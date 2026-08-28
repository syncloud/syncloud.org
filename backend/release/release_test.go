package release

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
)

func body(tag string, assets ...string) string {
	list := ""
	for i, a := range assets {
		if i > 0 {
			list += ","
		}
		list += fmt.Sprintf(`{"name":%q}`, a)
	}
	return fmt.Sprintf(`{"tag_name":%q,"assets":[%s]}`, tag, list)
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

func TestReadsBoardsAndFormatsFromTheRelease(t *testing.T) {
	c, _, _ := cache(t, func(w http.ResponseWriter, _ *http.Request) {
		fmt.Fprint(w, body("26.07.01",
			"syncloud-raspberrypi-64-26.07.01.img.xz",
			"syncloud-amd64-26.07.01.img.xz",
			"syncloud-amd64-26.07.01.vdi.xz",
			"syncloud-26.07.01-checksums.txt"))
	}, time.Hour)

	got, err := c.Get()
	assert.NoError(t, err)
	assert.Equal(t, "26.07.01", got.Version)
	assert.Equal(t, []Image{
		{Board: "amd64", Format: "img"},
		{Board: "amd64", Format: "vdi"},
		{Board: "raspberrypi-64", Format: "img"},
	}, got.Images)
}

func TestReusesTheReleaseUntilItExpires(t *testing.T) {
	c, _, calls := cache(t, func(w http.ResponseWriter, _ *http.Request) {
		fmt.Fprint(w, body("26.07.01", "syncloud-amd64-26.07.01.img.xz"))
	}, time.Hour)

	for i := 0; i < 5; i++ {
		_, err := c.Get()
		assert.NoError(t, err)
	}
	assert.Equal(t, 1, *calls)
}

func TestFetchesAgainOnceExpired(t *testing.T) {
	c, _, calls := cache(t, func(w http.ResponseWriter, _ *http.Request) {
		fmt.Fprint(w, body("26.07.01", "syncloud-amd64-26.07.01.img.xz"))
	}, time.Hour)

	now := time.Now()
	c.now = func() time.Time { return now }
	_, err := c.Get()
	assert.NoError(t, err)
	now = now.Add(2 * time.Hour)
	_, err = c.Get()
	assert.NoError(t, err)
	assert.Equal(t, 2, *calls)
}

func TestKeepsTheLastReleaseWhenGithubFails(t *testing.T) {
	fail := false
	c, _, _ := cache(t, func(w http.ResponseWriter, _ *http.Request) {
		if fail {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		fmt.Fprint(w, body("26.07.01", "syncloud-amd64-26.07.01.img.xz"))
	}, 0)

	first, err := c.Get()
	assert.NoError(t, err)
	fail = true
	second, err := c.Get()
	assert.NoError(t, err, "a github outage must not empty the download page")
	assert.Equal(t, first, second)
}

func TestFailsWhenThereIsNothingCachedYet(t *testing.T) {
	c, _, _ := cache(t, func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
	}, time.Hour)
	_, err := c.Get()
	assert.Error(t, err)
}

func TestRejectsAReleaseWithNoImages(t *testing.T) {
	c, _, _ := cache(t, func(w http.ResponseWriter, _ *http.Request) {
		fmt.Fprint(w, body("26.07.01", "syncloud-26.07.01-checksums.txt"))
	}, time.Hour)
	_, err := c.Get()
	assert.ErrorContains(t, err, "no images")
}
