package release

type Catalog struct {
	Version string  `json:"version"`
	Picked  []Entry `json:"picked"`
	Others  []Entry `json:"others"`
}
