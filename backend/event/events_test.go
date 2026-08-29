package event

import "testing"

func TestKnowsWhatItWasGiven(t *testing.T) {
	events := NewEvents([]string{"view.index", "setup.build"})
	for _, name := range []string{"view.index", "setup.build"} {
		if !events.Known(name) {
			t.Errorf("%s should be known", name)
		}
	}
}

func TestRefusesAnythingElse(t *testing.T) {
	events := NewEvents([]string{"view.index"})
	for _, name := range []string{"", "view.Index", "view.index ", "anything", "../etc/passwd"} {
		if events.Known(name) {
			t.Errorf("%q should not be known", name)
		}
	}
}

func TestRefusesEverythingWhenNothingIsConfigured(t *testing.T) {
	if NewEvents(nil).Known("view.index") {
		t.Error("an empty configuration must not accept events")
	}
}
