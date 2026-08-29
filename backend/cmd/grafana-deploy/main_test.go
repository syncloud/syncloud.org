package main

import (
	"encoding/json"
	"testing"
)

func TestPickPrometheusUID(t *testing.T) {
	body := []byte(`[{"type":"loki","uid":"a"},{"type":"prometheus","uid":"vm"}]`)
	uid, err := pickPrometheusUID(body)
	if err != nil {
		t.Fatal(err)
	}
	if uid != "vm" {
		t.Fatalf("got %q, want vm", uid)
	}
}

func TestPickPrometheusUIDMissing(t *testing.T) {
	_, err := pickPrometheusUID([]byte(`[{"type":"loki","uid":"a"}]`))
	if err == nil {
		t.Fatal("expected error when no prometheus datasource")
	}
}

func TestBuildPayloadSubstitutesDatasource(t *testing.T) {
	dashboard := []byte(`{"uid":"popularity","panels":[{"datasource":{"type":"prometheus","uid":"${DS_PROMETHEUS}"}}]}`)
	payload, err := buildPayload(dashboard, "vm")
	if err != nil {
		t.Fatal(err)
	}
	var p struct {
		Dashboard struct {
			Panels []struct {
				Datasource struct {
					UID string `json:"uid"`
				} `json:"datasource"`
			} `json:"panels"`
		} `json:"dashboard"`
		Overwrite bool `json:"overwrite"`
	}
	if err := json.Unmarshal(payload, &p); err != nil {
		t.Fatal(err)
	}
	if p.Dashboard.Panels[0].Datasource.UID != "vm" {
		t.Fatalf("placeholder not substituted: %s", payload)
	}
	if !p.Overwrite {
		t.Fatal("overwrite must be true")
	}
}

func TestBuildPayloadStripsIdAndInputs(t *testing.T) {
	dashboard := []byte(`{"id":7,"__inputs":[{"name":"DS"}],"uid":"popularity"}`)
	payload, err := buildPayload(dashboard, "vm")
	if err != nil {
		t.Fatal(err)
	}
	var p struct {
		Dashboard map[string]any `json:"dashboard"`
	}
	if err := json.Unmarshal(payload, &p); err != nil {
		t.Fatal(err)
	}
	if _, ok := p.Dashboard["id"]; ok {
		t.Fatal("id must be stripped")
	}
	if _, ok := p.Dashboard["__inputs"]; ok {
		t.Fatal("__inputs must be stripped")
	}
}

func TestIniValueReadsUncommentedKey(t *testing.T) {
	ini := []byte("[security]\n;admin_password = admin\nadmin_password = sync123graf\n")
	if v := iniValue(ini, "admin_password"); v != "sync123graf" {
		t.Fatalf("got %q, want sync123graf", v)
	}
}

func TestIniValueIgnoresCommented(t *testing.T) {
	ini := []byte("[security]\n;admin_user = admin\n")
	if v := iniValue(ini, "admin_user"); v != "" {
		t.Fatalf("commented key must be ignored, got %q", v)
	}
}

func TestReadCredsDefaultsWhenNoFile(t *testing.T) {
	user, pass := readCreds("/nonexistent/grafana.ini")
	if user != "admin" || pass != "admin" {
		t.Fatalf("got %s/%s, want admin/admin", user, pass)
	}
}
