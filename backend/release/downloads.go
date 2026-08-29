package release

import (
	"errors"
	"fmt"
)

var ErrUnknownImage = errors.New("unknown image")

type Downloads struct {
	releases Releases
	base     string
}

func NewDownloads(releases Releases, base string) *Downloads {
	return &Downloads{releases: releases, base: base}
}

func (d *Downloads) Url(board, version, format string) (string, error) {
	latest, err := d.releases.Get()
	if err != nil {
		return "", err
	}
	if version != latest.Version {
		return "", fmt.Errorf("%w: %s is not the latest release, %s is",
			ErrUnknownImage, version, latest.Version)
	}
	for _, image := range latest.Images {
		if image.Board == board && image.Format == format {
			return fmt.Sprintf("%s/%s/%s", d.base, latest.Version, image.Name), nil
		}
	}
	return "", fmt.Errorf("%w: release %s ships no %s %s image",
		ErrUnknownImage, latest.Version, board, format)
}
