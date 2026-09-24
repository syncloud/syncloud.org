package main

import (
	"encoding/json"
	"os"
	"regexp"
	"strings"
	"testing"
)

const dashboardFile = "../ci/grafana/downloads.json"

type dashboard struct {
	UID        string `json:"uid"`
	Title      string `json:"title"`
	Templating struct {
		List []struct {
			Name string `json:"name"`
		} `json:"list"`
	} `json:"templating"`
	Panels []struct {
		ID      int    `json:"id"`
		Title   string `json:"title"`
		Targets []struct {
			Expr string `json:"expr"`
		} `json:"targets"`
	} `json:"panels"`
}

func read(t *testing.T) dashboard {
	t.Helper()
	raw, err := os.ReadFile(dashboardFile)
	if err != nil {
		t.Fatal(err)
	}
	var d dashboard
	if err := json.Unmarshal(raw, &d); err != nil {
		t.Fatal(err)
	}
	return d
}

func TestDashboardHasAnEnvironmentSwitch(t *testing.T) {
	for _, v := range read(t).Templating.List {
		if v.Name == "env" {
			return
		}
	}
	t.Fatal("no env variable to switch uat and prod")
}

func TestEveryPanelReadsTheSelectedEnvironment(t *testing.T) {
	for _, panel := range read(t).Panels {
		for _, target := range panel.Targets {
			if !strings.Contains(target.Expr, `env="$env"`) {
				t.Errorf("panel %q ignores the environment: %s", panel.Title, target.Expr)
			}
		}
	}
}

func TestEveryPanelSurvivesACounterReset(t *testing.T) {
	for _, panel := range read(t).Panels {
		for _, target := range panel.Targets {
			if !strings.Contains(target.Expr, "increase(") {
				t.Errorf("panel %q reads the counter raw: %s", panel.Title, target.Expr)
			}
		}
	}
}

func TestDashboardIsWiredToTheDatasourcePlaceholder(t *testing.T) {
	raw, err := os.ReadFile(dashboardFile)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(raw), placeholder) {
		t.Fatal("nothing for the deploy to substitute")
	}
}

func TestDashboardIdentifiesItself(t *testing.T) {
	d := read(t)
	if d.UID != "syncloud-org" || d.Title != "syncloud.org" {
		t.Fatalf("unexpected identity %q %q", d.UID, d.Title)
	}
	if len(d.Panels) == 0 {
		t.Fatal("no panels")
	}
}

func panelExpr(t *testing.T, title string) string {
	t.Helper()
	for _, panel := range read(t).Panels {
		if panel.Title != title {
			continue
		}
		if len(panel.Targets) != 1 {
			t.Fatalf("panel %q has %d targets", title, len(panel.Targets))
		}
		return panel.Targets[0].Expr
	}
	t.Fatalf("no panel titled %q", title)
	return ""
}

func configuredEvents(t *testing.T) []string {
	t.Helper()
	raw, err := os.ReadFile("../backend/config/config.go")
	if err != nil {
		t.Fatal(err)
	}
	block := regexp.MustCompile(`Events: \[\]string\{([^}]*)\}`).FindStringSubmatch(string(raw))
	if block == nil {
		t.Fatal("backend/config/config.go does not configure Events")
	}
	events := []string{}
	for _, match := range regexp.MustCompile(`"([^"]+)"`).FindAllStringSubmatch(block[1], -1) {
		events = append(events, match[1])
	}
	if len(events) == 0 {
		t.Fatal("no events configured")
	}
	return events
}

func visitPattern(t *testing.T, expr string) *regexp.Regexp {
	t.Helper()
	matcher := regexp.MustCompile(`event=~"([^"]+)"`).FindStringSubmatch(expr)
	if matcher == nil {
		t.Fatalf("no event matcher in %s", expr)
	}
	pattern, err := regexp.Compile("^" + strings.ReplaceAll(matcher[1], `\\`, `\`) + "$")
	if err != nil {
		t.Fatal(err)
	}
	return pattern
}

func TestVisitPanelsCountEveryPageViewAndNothingElse(t *testing.T) {
	for _, title := range []string{"Site visits", "Visits by language"} {
		pattern := visitPattern(t, panelExpr(t, title))
		views := 0
		for _, event := range configuredEvents(t) {
			if strings.HasPrefix(event, "view.") {
				views++
				if !pattern.MatchString(event) {
					t.Errorf("panel %q does not count %s", title, event)
				}
				continue
			}
			if pattern.MatchString(event) {
				t.Errorf("panel %q counts %s as a visit", title, event)
			}
		}
		if views == 0 {
			t.Fatal("no view events configured")
		}
	}
}

func TestVisitsAreBrokenDownByLanguage(t *testing.T) {
	expr := panelExpr(t, "Visits by language")
	if !strings.Contains(expr, "sum by (language)") {
		t.Errorf("the language panel does not group by language: %s", expr)
	}
	if strings.Contains(panelExpr(t, "Site visits"), "by (") {
		t.Error("the overall visits panel splits the total instead of giving one number")
	}
}
