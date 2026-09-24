package label

import (
	"strings"
	"testing"
)

func TestKeepsAValueItWasGiven(t *testing.T) {
	allowed := New([]string{"cloud", "pi", "access", "password"})
	for _, value := range []string{"cloud", "pi", "access", "password"} {
		if got := allowed.Label(value); got != value {
			t.Errorf("%s became %q", value, got)
		}
	}
}

func TestKeepsAValueThatIsNotAWord(t *testing.T) {
	allowed := New([]string{"zh-CN", "actual-budget"})
	for _, value := range []string{"zh-CN", "actual-budget"} {
		if got := allowed.Label(value); got != value {
			t.Errorf("%s became %q", value, got)
		}
	}
}

func TestReportsNothingWhenNothingArrived(t *testing.T) {
	allowed := New([]string{"cloud"})
	for _, value := range []string{"", None} {
		if got := allowed.Label(value); got != None {
			t.Errorf("%q became %q, want %q", value, got, None)
		}
	}
}

func TestFoldsAnythingElseIntoOneLabel(t *testing.T) {
	allowed := New([]string{"cloud"})
	for _, value := range []string{
		"anything",
		"Cloud",
		"cloud ",
		"../etc/passwd",
		strings.Repeat("a", 4096),
		"cloud\nsite_event_total{x=\"1\"} 1",
	} {
		if got := allowed.Label(value); got != Other {
			t.Errorf("%q became %q, want %q", value, got, Other)
		}
	}
}

func TestBoundsTheLabelsItCanEverProduce(t *testing.T) {
	values := []string{"cloud", "pi"}
	allowed := New(values)
	seen := map[string]bool{}
	for i := 0; i < 1000; i++ {
		seen[allowed.Label(strings.Repeat("x", i))] = true
	}
	for _, value := range values {
		seen[allowed.Label(value)] = true
	}
	if len(seen) != len(values)+2 {
		t.Errorf("produced %d labels %v, want %d", len(seen), seen, len(values)+2)
	}
}

func TestRefusesEverythingWhenNothingIsConfigured(t *testing.T) {
	if got := New(nil).Label("cloud"); got != Other {
		t.Errorf("an empty configuration accepted a value as %q", got)
	}
}
