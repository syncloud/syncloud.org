package event

type Events struct {
	known map[string]bool
}

func NewEvents(names []string) *Events {
	known := map[string]bool{}
	for _, name := range names {
		known[name] = true
	}
	return &Events{known: known}
}

func (e *Events) Known(name string) bool {
	return e.known[name]
}
