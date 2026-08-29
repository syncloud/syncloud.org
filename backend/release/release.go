package release

type Release struct {
	Version string  `json:"version"`
	Images  []Image `json:"images"`
}
