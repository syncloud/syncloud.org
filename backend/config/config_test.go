package config

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func unique(t *testing.T, name string, values []string) {
	t.Helper()
	seen := map[string]bool{}
	for _, value := range values {
		assert.NotEmpty(t, strings.TrimSpace(value), name)
		assert.Equal(t, value, strings.TrimSpace(value), name+" has padding: "+value)
		assert.False(t, seen[value], name+" lists "+value+" twice")
		seen[value] = true
	}
}

func TestEveryAllowListIsCleanAndFreeOfDuplicates(t *testing.T) {
	cfg := New("https://www.syncloud.example", "26.09.03")

	unique(t, "Events", cfg.Events)
	unique(t, "Landings", cfg.Landings)
	unique(t, "Languages", cfg.Languages)
	unique(t, "Details", cfg.Details)
	unique(t, "Paths", cfg.Paths)
}

func TestDetailsNeverCollideWithTheFilterNamesTheyShareALabelWith(t *testing.T) {
	cfg := New("https://www.syncloud.example", "26.09.03")

	countries := map[string]bool{}
	for _, value := range cfg.Details {
		if len(value) == 2 && value == strings.ToUpper(value) {
			countries[value] = true
		}
	}

	for _, name := range []string{"country", "arch", "search"} {
		assert.False(t, countries[name], name)
		assert.Contains(t, cfg.Details, name)
	}
	assert.NotEmpty(t, countries)
}

func TestPathsCoverEverySetupRouteTheSetupPageCanTake(t *testing.T) {
	cfg := New("https://www.syncloud.example", "26.09.03")

	for _, path := range []string{"build", "buy", "board"} {
		assert.Contains(t, cfg.Paths, path)
	}
}
