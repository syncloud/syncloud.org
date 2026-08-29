package release

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"sort"
	"sync"
	"time"

	"go.uber.org/zap"
)

type Image struct {
	Board  string `json:"board"`
	Format string `json:"format"`
}

type Release struct {
	Version string  `json:"version"`
	Images  []Image `json:"images"`
}

type Cache struct {
	url    string
	ttl    time.Duration
	client *http.Client
	now    func() time.Time
	logger *zap.Logger

	mu        sync.Mutex
	release   *Release
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

func (c *Cache) Get() (*Release, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.release != nil && c.now().Sub(c.fetchedAt) < c.ttl {
		return c.release, nil
	}

	fetched, err := c.fetch()
	if err != nil {
		if c.release != nil {
			// github being unreachable should not take the download page with it
			c.logger.Error("keeping the last known release", zap.Error(err))
			return c.release, nil
		}
		return nil, err
	}

	c.release = fetched
	c.fetchedAt = c.now()
	return c.release, nil
}

type githubRelease struct {
	TagName string `json:"tag_name"`
	Assets  []struct {
		Name string `json:"name"`
	} `json:"assets"`
}

func (c *Cache) fetch() (*Release, error) {
	response, err := c.client.Get(c.url)
	if err != nil {
		return nil, err
	}
	defer func() { _ = response.Body.Close() }()
	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("%s returned %d", c.url, response.StatusCode)
	}

	var body githubRelease
	if err := json.NewDecoder(response.Body).Decode(&body); err != nil {
		return nil, err
	}
	if body.TagName == "" {
		return nil, fmt.Errorf("%s returned a release with no tag", c.url)
	}

	asset := regexp.MustCompile(
		`^syncloud-(.+)-` + regexp.QuoteMeta(body.TagName) + `\.(img|vdi)\.xz$`)
	images := []Image{}
	for _, a := range body.Assets {
		if match := asset.FindStringSubmatch(a.Name); match != nil {
			images = append(images, Image{Board: match[1], Format: match[2]})
		}
	}
	if len(images) == 0 {
		return nil, fmt.Errorf("%s returned no images for %s", c.url, body.TagName)
	}
	sort.Slice(images, func(i, j int) bool {
		if images[i].Board == images[j].Board {
			return images[i].Format < images[j].Format
		}
		return images[i].Board < images[j].Board
	})

	c.logger.Info("release fetched",
		zap.String("version", body.TagName), zap.Int("images", len(images)))
	return &Release{Version: body.TagName, Images: images}, nil
}
