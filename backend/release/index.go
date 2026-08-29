package release

type Index struct {
	Latest   *Release
	Versions map[string]*Release
}
