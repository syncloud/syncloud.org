package release

import "go.uber.org/zap"

type Curator struct {
	releases Releases
	picks    []Pick
	logger   *zap.Logger
}

func NewCurator(releases Releases, picks []Pick, logger *zap.Logger) *Curator {
	return &Curator{releases: releases, picks: picks, logger: logger}
}

func (c *Curator) Get() (*Catalog, error) {
	latest, err := c.releases.Get()
	if err != nil {
		return nil, err
	}

	catalog := &Catalog{Version: latest.Version, Picked: []Entry{}, Others: []Entry{}}
	for _, pick := range c.picks {
		image, found := find(latest.Images, pick.Board, pick.Format)
		if !found {
			c.logger.Warn("a pick is missing from the release",
				zap.String("version", latest.Version),
				zap.String("board", pick.Board),
				zap.String("format", pick.Format),
				zap.String("label", pick.Label))
			continue
		}
		catalog.Picked = append(catalog.Picked, entry(image, pick.Label, ""))
	}
	for _, image := range latest.Images {
		if c.isPicked(image) {
			continue
		}
		note := ""
		if image.Format != "img" {
			note = image.Format
		}
		catalog.Others = append(catalog.Others, entry(image, image.Board, note))
	}
	return catalog, nil
}

func (c *Curator) isPicked(image Image) bool {
	for _, pick := range c.picks {
		if image.Board == pick.Board && image.Format == pick.Format {
			return true
		}
	}
	return false
}

func find(images []Image, board, format string) (Image, bool) {
	for _, image := range images {
		if image.Board == board && image.Format == format {
			return image, true
		}
	}
	return Image{}, false
}

func entry(image Image, label, note string) Entry {
	return Entry{
		Board:  image.Board,
		Format: image.Format,
		Name:   image.Name,
		Label:  label,
		Note:   note,
	}
}
