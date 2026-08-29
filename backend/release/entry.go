package release

type Entry struct {
	Board  string `json:"board"`
	Format string `json:"format"`
	Name   string `json:"name"`
	Label  string `json:"label"`
	Note   string `json:"note"`
	Url    string `json:"url"`
}
