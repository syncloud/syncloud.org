package release

type Releases interface {
	Get() (*Release, error)
}
