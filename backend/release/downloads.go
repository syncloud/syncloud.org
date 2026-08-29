package release

import "fmt"

type Downloads struct {
	releases Releases
	base     string
}

func NewDownloads(releases Releases, base string) *Downloads {
	return &Downloads{releases: releases, base: base}
}

func (d *Downloads) Url(board, version, format string) (string, error) {
	published, err := d.releases.Find(version)
	if err != nil {
		return "", err
	}
	for _, image := range published.Images {
		if image.Board == board && image.Format == format {
			return fmt.Sprintf("%s/%s/%s", d.base, published.Version, image.Name), nil
		}
	}
	return "", fmt.Errorf("%w: release %s ships no %s %s image",
		ErrNotFound, published.Version, board, format)
}
