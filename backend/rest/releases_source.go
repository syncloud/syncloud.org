package rest

import "github.com/syncloud/syncloud.org/release"

type Releases interface {
	Get() (*release.Release, error)
}
