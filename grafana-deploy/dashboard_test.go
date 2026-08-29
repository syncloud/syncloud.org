package main

import (
	"encoding/json"
	"os"
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
