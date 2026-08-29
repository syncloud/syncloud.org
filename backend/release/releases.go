package release

type Releases interface {
	Latest() (*Release, error)
	Find(version string) (*Release, error)
}
