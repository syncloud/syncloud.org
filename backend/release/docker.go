package release

import "fmt"

type Docker struct {
	Label string
	Repo  string
	Tag   string
}

func (d Docker) Entry() Entry {
	return Entry{
		Board:  KindDocker,
		Format: KindDocker,
		Kind:   KindDocker,
		Name:   fmt.Sprintf("%s:%s", d.Repo, d.Tag),
		Label:  d.Label,
	}
}
