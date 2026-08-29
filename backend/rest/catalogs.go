package rest

import "github.com/syncloud/syncloud.org/release"

type Catalogs interface {
	Get() (*release.Catalog, error)
}
