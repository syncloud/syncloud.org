package release

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
)

func published(tag string, prerelease bool, assets ...string) string {
	names := []string{}
	for _, a := range assets {
		names = append(names, fmt.Sprintf(`{"name":%q}`, a))
	}
	return fmt.Sprintf(`{"tag_name":%q,"draft":false,"prerelease":%t,"assets":[%s]}`,
		tag, prerelease, strings.Join(names, ","))
}

func body(releases ...string) string {
	return "[" + strings.Join(releases, ",") + "]"
}

func latest() string {
	return published("26.07.01", false,
		"syncloud-raspberrypi-64-26.07.01.img.xz",
		"syncloud-amd64-26.07.01.img.xz",
		"syncloud-amd64-26.07.01.vdi.xz",
		"syncloud-26.07.01-checksums.txt")
}

func cache(t *testing.T, handler http.HandlerFunc, ttl time.Duration) (*Cache, *httptest.Server, *int) {
	t.Helper()
	calls := 0
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		calls++
		handler(w, r)
	}))
	t.Cleanup(server.Close)
	return NewCache(server.URL, ttl, zap.NewNop()), server, &calls
}

func serving(t *testing.T, response string, ttl time.Duration) *Cache {
	t.Helper()
	c, _, _ := cache(t, func(w http.ResponseWriter, _ *http.Request) {
		fmt.Fprint(w, response)
	}, ttl)
	return c
}

func TestReadsBoardsAndFormatsFromTheRelease(t *testing.T) {
	got, err := serving(t, body(latest()), time.Hour).Latest()

	assert.NoError(t, err)
	assert.Equal(t, "26.07.01", got.Version)
	assert.Equal(t, []Image{
		{Board: "amd64", Format: "img", Name: "syncloud-amd64-26.07.01.img.xz"},
		{Board: "amd64", Format: "vdi", Name: "syncloud-amd64-26.07.01.vdi.xz"},
		{Board: "raspberrypi-64", Format: "img", Name: "syncloud-raspberrypi-64-26.07.01.img.xz"},
	}, got.Images)
}

func TestKeepsEveryPublishedVersionHoweverItWasTagged(t *testing.T) {
	c := serving(t, body(
		latest(),
		published("26.04.9", false, "syncloud-amd64-26.04.9.img.xz"),
		published("22.01", false, "syncloud-amd64-22.01.img.xz"),
	), time.Hour)

	for _, version := range []string{"26.07.01", "26.04.9", "22.01"} {
		found, err := c.Find(version)
		assert.NoError(t, err, version)
		assert.Equal(t, version, found.Version)
	}
}

func TestTheNewestPublishedReleaseIsTheLatest(t *testing.T) {
	c := serving(t, body(
		latest(),
		published("26.04.9", false, "syncloud-amd64-26.04.9.img.xz"),
	), time.Hour)

	got, err := c.Latest()
	assert.NoError(t, err)
	assert.Equal(t, "26.07.01", got.Version)
}

func TestSkipsPrereleases(t *testing.T) {
	c := serving(t, body(
		published("26.08.01-rc1", true, "syncloud-amd64-26.08.01-rc1.img.xz"),
		latest(),
	), time.Hour)

	got, err := c.Latest()
	assert.NoError(t, err)
	assert.Equal(t, "26.07.01", got.Version)

	_, err = c.Find("26.08.01-rc1")
	assert.ErrorIs(t, err, ErrNotFound)
}

func TestSkipsAReleaseWithNoImagesWithoutLosingTheRest(t *testing.T) {
	c := serving(t, body(
		published("22.12", false, "syncloud-odroid-xu3and4-22.09.img.xz"),
		latest(),
	), time.Hour)

	got, err := c.Latest()
	assert.NoError(t, err)
	assert.Equal(t, "26.07.01", got.Version)

	_, err = c.Find("22.12")
	assert.ErrorIs(t, err, ErrNotFound)
}

func TestFindReportsAVersionThatWasNeverPublished(t *testing.T) {
	_, err := serving(t, body(latest()), time.Hour).Find("99.99.99")
	assert.ErrorIs(t, err, ErrNotFound)
}

func TestReusesTheReleasesUntilTheyExpire(t *testing.T) {
	c, _, calls := cache(t, func(w http.ResponseWriter, _ *http.Request) {
		fmt.Fprint(w, body(latest()))
	}, time.Hour)

	for i := 0; i < 5; i++ {
		_, err := c.Latest()
		assert.NoError(t, err)
		_, err = c.Find("26.07.01")
		assert.NoError(t, err)
	}
	assert.Equal(t, 1, *calls)
}

func TestFetchesAgainOnceExpired(t *testing.T) {
	c, _, calls := cache(t, func(w http.ResponseWriter, _ *http.Request) {
		fmt.Fprint(w, body(latest()))
	}, time.Hour)

	now := time.Now()
	c.now = func() time.Time { return now }
	_, err := c.Latest()
	assert.NoError(t, err)
	now = now.Add(2 * time.Hour)
	_, err = c.Latest()
	assert.NoError(t, err)
	assert.Equal(t, 2, *calls)
}

func TestKeepsTheLastReleasesWhenGithubFails(t *testing.T) {
	fail := false
	c, _, _ := cache(t, func(w http.ResponseWriter, _ *http.Request) {
		if fail {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		fmt.Fprint(w, body(latest()))
	}, 0)

	first, err := c.Latest()
	assert.NoError(t, err)
	fail = true
	second, err := c.Latest()
	assert.NoError(t, err, "a github outage must not empty the download page")
	assert.Equal(t, first, second)
}

func TestFailsWhenThereIsNothingCachedYet(t *testing.T) {
	c, _, _ := cache(t, func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
	}, time.Hour)
	_, err := c.Latest()
	assert.Error(t, err)
}

func TestRejectsAnAnswerWithNoImagesAnywhere(t *testing.T) {
	c := serving(t, body(published("26.07.01", false, "syncloud-26.07.01-checksums.txt")), time.Hour)
	_, err := c.Latest()
	assert.ErrorContains(t, err, "no release with images")
}
