package label

const None = "none"

const Other = "other"

type Allowed struct {
	known map[string]bool
}

func New(values []string) *Allowed {
	known := map[string]bool{}
	for _, value := range values {
		known[value] = true
	}
	return &Allowed{known: known}
}

func (a *Allowed) Label(value string) string {
	if value == "" || value == None {
		return None
	}
	if a.known[value] {
		return value
	}
	return Other
}
