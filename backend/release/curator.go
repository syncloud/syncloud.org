package release

type Curator struct {
	releases Releases
	picks    []Pick
}

func NewCurator(releases Releases, picks []Pick) *Curator {
	return &Curator{releases: releases, picks: picks}
}

func (c *Curator) Get() (*Catalog, error) {
	latest, err := c.releases.Get()
	if err != nil {
		return nil, err
	}

	catalog := &Catalog{Version: latest.Version, Picked: []Entry{}, Others: []Entry{}}
	for _, pick := range c.picks {
		for _, image := range latest.Images {
			if image.Board == pick.Board && image.Format == pick.Format {
				catalog.Picked = append(catalog.Picked, entry(image, pick.Label, ""))
			}
		}
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

func entry(image Image, label, note string) Entry {
	return Entry{
		Board:  image.Board,
		Format: image.Format,
		Name:   image.Name,
		Label:  label,
		Note:   note,
	}
}
