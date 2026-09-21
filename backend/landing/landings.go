package landing

const None = "none"

const Other = "other"

type Landings struct {
	known map[string]bool
}

func NewLandings(variants []string) *Landings {
	known := map[string]bool{}
	for _, variant := range variants {
		known[variant] = true
	}
	return &Landings{known: known}
}

func (l *Landings) Label(variant string) string {
	if variant == "" || variant == None {
		return None
	}
	if l.known[variant] {
		return variant
	}
	return Other
}
