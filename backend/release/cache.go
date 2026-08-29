package release

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"regexp"
	"sort"
	"sync"
	"time"

	"go.uber.org/zap"
)

var ErrNotFound = errors.New("not found")

type Cache struct {
	url    string
	ttl    time.Duration
	client *http.Client
	now    func() time.Time
	logger *zap.Logger

	mu        sync.Mutex
	index     *Index
	fetchedAt time.Time
}

func NewCache(url string, ttl time.Duration, logger *zap.Logger) *Cache {
	return &Cache{
		url:    url,
		ttl:    ttl,
		client: &http.Client{Timeout: 10 * time.Second},
		now:    time.Now,
		logger: logger,
	}
}

func (c *Cache) Latest() (*Release, error) {
	index, err := c.get()
	if err != nil {
		return nil, err
	}
	return index.Latest, nil
}

func (c *Cache) Find(version string) (*Release, error) {
	index, err := c.get()
	if err != nil {
		return nil, err
	}
	found, ok := index.Versions[version]
	if !ok {
		return nil, fmt.Errorf("%w: no release %s", ErrNotFound, version)
	}
	return found, nil
}

func (c *Cache) get() (*Index, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.index != nil && c.now().Sub(c.fetchedAt) < c.ttl {
		return c.index, nil
	}

	fetched, err := c.fetch()
	if err != nil {
		if c.index != nil {
			c.logger.Error("keeping the last known releases", zap.Error(err))
			return c.index, nil
		}
		return nil, err
	}

	c.index = fetched
	c.fetchedAt = c.now()
	return c.index, nil
}

func (c *Cache) fetch() (*Index, error) {
	response, err := c.client.Get(c.url)
	if err != nil {
		return nil, err
	}
	defer func() { _ = response.Body.Close() }()
	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("%s returned %d", c.url, response.StatusCode)
	}

	var body []githubRelease
	if err := json.NewDecoder(response.Body).Decode(&body); err != nil {
		return nil, err
	}

	index := &Index{Versions: map[string]*Release{}}
	for _, published := range body {
		if published.Draft || published.Prerelease || published.TagName == "" {
			continue
		}
		images := parse(published)
		if len(images) == 0 {
			continue
		}
		found := &Release{Version: published.TagName, Images: images}
		index.Versions[found.Version] = found
		if index.Latest == nil {
			index.Latest = found
		}
	}
	if index.Latest == nil {
		return nil, fmt.Errorf("%s returned no release with images", c.url)
	}

	c.logger.Info("releases fetched",
		zap.String("latest", index.Latest.Version),
		zap.Int("versions", len(index.Versions)),
		zap.Int("images", len(index.Latest.Images)))
	return index, nil
}

func parse(published githubRelease) []Image {
	asset := regexp.MustCompile(
		`^syncloud-(.+)-` + regexp.QuoteMeta(published.TagName) + `\.(img|vdi)\.xz$`)
	images := []Image{}
	for _, a := range published.Assets {
		if match := asset.FindStringSubmatch(a.Name); match != nil {
			images = append(images, Image{Board: match[1], Format: match[2], Name: a.Name})
		}
	}
	sort.Slice(images, func(i, j int) bool {
		if images[i].Board == images[j].Board {
			return images[i].Format < images[j].Format
		}
		return images[i].Board < images[j].Board
	})
	return images
}
