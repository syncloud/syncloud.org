package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/spf13/cobra"
)

const placeholder = "${DS_PROMETHEUS}"

func main() {
	var host, dashboard, dsUID, iniPath string
	cmd := &cobra.Command{
		Use:  "grafana-deploy",
		Args: cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return run(host, dashboard, dsUID, iniPath)
		},
	}
	cmd.Flags().StringVar(&host, "host", "", "grafana host:port")
	cmd.Flags().StringVar(&dashboard, "dashboard", "", "dashboard json file")
	cmd.Flags().StringVar(&dsUID, "ds", "", "prometheus datasource uid, discovered when empty")
	cmd.Flags().StringVar(&iniPath, "grafana-ini", "/etc/grafana/grafana.ini", "grafana.ini holding admin credentials")
	_ = cmd.MarkFlagRequired("host")
	_ = cmd.MarkFlagRequired("dashboard")
	if err := cmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run(host, dashboard, dsUID, iniPath string) error {
	user, pass := readCreds(iniPath)
	base := "http://" + host
	client := &http.Client{Timeout: 30 * time.Second}

	if err := waitHealthy(client, base); err != nil {
		return err
	}

	if dsUID == "" {
		uid, err := discoverDatasource(client, base, user, pass)
		if err != nil {
			return err
		}
		dsUID = uid
	}

	raw, err := os.ReadFile(dashboard)
	if err != nil {
		return err
	}
	payload, err := buildPayload(raw, dsUID)
	if err != nil {
		return err
	}
	if err := postDashboard(client, base, user, pass, payload); err != nil {
		return err
	}
	uid, err := dashboardUID(raw)
	if err != nil {
		return err
	}
	return verifyDashboard(client, base, user, pass, uid, dsUID)
}

func dashboardUID(raw []byte) (string, error) {
	var dash struct {
		UID string `json:"uid"`
	}
	if err := json.Unmarshal(raw, &dash); err != nil {
		return "", err
	}
	if dash.UID == "" {
		return "", fmt.Errorf("dashboard has no uid")
	}
	return dash.UID, nil
}

func verifyDashboard(client *http.Client, base, user, pass, uid, dsUID string) error {
	req, _ := http.NewRequest(http.MethodGet, base+"/api/dashboards/uid/"+uid, nil)
	req.SetBasicAuth(user, pass)
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("reading back %s: %s: %s", uid, resp.Status, body)
	}
	return checkDeployed(body, dsUID)
}

func checkDeployed(body []byte, dsUID string) error {
	var deployed struct {
		Dashboard struct {
			Panels []struct {
				ID         int    `json:"id"`
				Title      string `json:"title"`
				Datasource struct {
					UID string `json:"uid"`
				} `json:"datasource"`
			} `json:"panels"`
		} `json:"dashboard"`
	}
	if err := json.Unmarshal(body, &deployed); err != nil {
		return err
	}
	if strings.Contains(string(body), placeholder) {
		return fmt.Errorf("deployed dashboard still holds %s", placeholder)
	}
	if len(deployed.Dashboard.Panels) == 0 {
		return fmt.Errorf("deployed dashboard has no panels")
	}
	for _, panel := range deployed.Dashboard.Panels {
		if panel.Datasource.UID != dsUID {
			return fmt.Errorf("panel %d %q points at datasource %q, not %q",
				panel.ID, panel.Title, panel.Datasource.UID, dsUID)
		}
	}
	fmt.Printf("verified %s: %d panels on datasource %s\n",
		uidOf(body), len(deployed.Dashboard.Panels), dsUID)
	return nil
}

func uidOf(body []byte) string {
	var d struct {
		Dashboard struct {
			UID string `json:"uid"`
		} `json:"dashboard"`
	}
	_ = json.Unmarshal(body, &d)
	return d.Dashboard.UID
}

func readCreds(iniPath string) (string, string) {
	user, pass := "admin", "admin"
	data, err := os.ReadFile(iniPath)
	if err != nil {
		return user, pass
	}
	if v := iniValue(data, "admin_user"); v != "" {
		user = v
	}
	if v := iniValue(data, "admin_password"); v != "" {
		pass = v
	}
	return user, pass
}

func iniValue(data []byte, key string) string {
	re := regexp.MustCompile(`(?m)^[ \t]*` + regexp.QuoteMeta(key) + `[ \t]*=[ \t]*(.+?)[ \t]*$`)
	m := re.FindSubmatch(data)
	if m == nil {
		return ""
	}
	return string(m[1])
}

func waitHealthy(client *http.Client, base string) error {
	var last error
	for i := 0; i < 60; i++ {
		resp, err := client.Get(base + "/api/health")
		if err == nil {
			body, _ := io.ReadAll(resp.Body)
			resp.Body.Close()
			var h struct {
				Database string `json:"database"`
			}
			if json.Unmarshal(body, &h) == nil && h.Database == "ok" {
				return nil
			}
			last = fmt.Errorf("unhealthy: %s", body)
		} else {
			last = err
		}
		time.Sleep(2 * time.Second)
	}
	return fmt.Errorf("grafana not healthy at %s: %w", base, last)
}

func discoverDatasource(client *http.Client, base, user, pass string) (string, error) {
	req, _ := http.NewRequest(http.MethodGet, base+"/api/datasources", nil)
	req.SetBasicAuth(user, pass)
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("datasources %s: %s", resp.Status, body)
	}
	return pickPrometheusUID(body)
}

func pickPrometheusUID(body []byte) (string, error) {
	var sources []struct {
		Type string `json:"type"`
		UID  string `json:"uid"`
	}
	if err := json.Unmarshal(body, &sources); err != nil {
		return "", err
	}
	for _, s := range sources {
		if s.Type == "prometheus" {
			return s.UID, nil
		}
	}
	return "", fmt.Errorf("no prometheus datasource found")
}

func buildPayload(dashboard []byte, dsUID string) ([]byte, error) {
	substituted := strings.ReplaceAll(string(dashboard), placeholder, dsUID)
	var dash map[string]any
	if err := json.Unmarshal([]byte(substituted), &dash); err != nil {
		return nil, err
	}
	delete(dash, "id")
	delete(dash, "__inputs")
	return json.Marshal(map[string]any{
		"dashboard": dash,
		"overwrite": true,
		"folderId":  0,
		"message":   "CI auto-deploy",
	})
}

func postDashboard(client *http.Client, base, user, pass string, payload []byte) error {
	req, _ := http.NewRequest(http.MethodPost, base+"/api/dashboards/db", bytes.NewReader(payload))
	req.SetBasicAuth(user, pass)
	req.Header.Set("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode/100 != 2 {
		return fmt.Errorf("dashboard post %s: %s", resp.Status, body)
	}
	fmt.Println(string(body))
	return nil
}
