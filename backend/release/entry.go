package release

const (
	KindCard   = "card"
	KindVm     = "vm"
	KindDocker = "docker"
)

type Entry struct {
	Board  string `json:"board"`
	Format string `json:"format"`
	Kind   string `json:"kind"`
	Name   string `json:"name"`
	Label  string `json:"label"`
	Note   string `json:"note"`
	Url    string `json:"url"`
}

func KindOf(format string) string {
	if format == "vdi" {
		return KindVm
	}
	return KindCard
}
