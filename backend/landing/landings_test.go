package landing

import (
	"strings"
	"testing"
)

func TestKeepsAVariantItWasGiven(t *testing.T) {
	landings := NewLandings([]string{"cloud", "pi", "access", "password"})
	for _, variant := range []string{"cloud", "pi", "access", "password"} {
		if got := landings.Label(variant); got != variant {
			t.Errorf("%s became %q", variant, got)
		}
	}
}

func TestReportsNoLandingWhenNothingArrived(t *testing.T) {
	landings := NewLandings([]string{"cloud"})
	for _, variant := range []string{"", None} {
		if got := landings.Label(variant); got != None {
			t.Errorf("%q became %q, want %q", variant, got, None)
		}
	}
}

func TestFoldsAnythingElseIntoOneLabel(t *testing.T) {
	landings := NewLandings([]string{"cloud"})
	for _, variant := range []string{
		"anything",
		"Cloud",
		"cloud ",
		"../etc/passwd",
		strings.Repeat("a", 4096),
		"cloud\nsite_event_total{x=\"1\"} 1",
	} {
		if got := landings.Label(variant); got != Other {
			t.Errorf("%q became %q, want %q", variant, got, Other)
		}
	}
}

func TestBoundsTheLabelsItCanEverProduce(t *testing.T) {
	variants := []string{"cloud", "pi"}
	landings := NewLandings(variants)
	seen := map[string]bool{}
	for i := 0; i < 1000; i++ {
		seen[landings.Label(strings.Repeat("x", i))] = true
	}
	for _, variant := range variants {
		seen[landings.Label(variant)] = true
	}
	if len(seen) != len(variants)+2 {
		t.Errorf("produced %d labels %v, want %d", len(seen), seen, len(variants)+2)
	}
}

func TestRefusesEverythingWhenNothingIsConfigured(t *testing.T) {
	if got := NewLandings(nil).Label("cloud"); got != Other {
		t.Errorf("an empty configuration accepted a variant as %q", got)
	}
}
