package rest

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/prometheus/client_golang/prometheus"
	dto "github.com/prometheus/client_model/go"
	"github.com/stretchr/testify/assert"
	"github.com/syncloud/syncloud.org/metrics"
	"github.com/syncloud/syncloud.org/release"
	"go.uber.org/zap"
)

const base = "https://github.com/syncloud/image/releases/download"

var picks = []release.Pick{
	{Board: "amd64", Format: "img", Label: "PC"},
}

func server(m *metrics.Metrics, releases release.Releases) *Server {
	return New("",
		release.NewDownloads(releases, base),
		release.NewCurator(releases, picks, zap.NewNop()),
		m, zap.NewNop())
}

func get(target string) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	server(metrics.New(), stubReleases{}).
		Router().ServeHTTP(recorder, httptest.NewRequest("GET", target, nil))
	return recorder
}

func TestImageRedirectsToTheRelease(t *testing.T) {
	response := get("/api/image/helios4?version=26.07.01&format=img")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Equal(t, base+"/26.07.01/syncloud-helios4-26.07.01.img.xz",
		response.Header().Get("Location"))
}

func TestImageServesVirtualBoxFormat(t *testing.T) {
	response := get("/api/image/amd64?version=26.07.01&format=vdi")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Equal(t, base+"/26.07.01/syncloud-amd64-26.07.01.vdi.xz",
		response.Header().Get("Location"))
}

func TestImageIsNotFoundWhenTheReleaseDoesNotShipIt(t *testing.T) {
	for _, target := range []string{
		"/api/image/amd64?version=26.07.01&format=",
		"/api/image/amd64?version=26.07.01&format=exe",
		"/api/image/amd64?version=26.06.01&format=img",
		"/api/image/helios4?version=26.04.9&format=img",
		"/api/image/amd64?version=latest&format=img",
		"/api/image/rock64?version=26.07.01&format=img",
		"/api/image/Raspberry?version=26.07.01&format=img",
	} {
		assert.Equal(t, http.StatusNotFound, get(target).Code, target)
	}
}

func TestImageStillServesAReleaseThatIsNoLongerTheLatest(t *testing.T) {
	response := get("/api/image/amd64?version=26.04.9&format=img")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Equal(t, base+"/26.04.9/syncloud-amd64-26.04.9.img.xz",
		response.Header().Get("Location"))
}

func TestImageSaysServiceUnavailableWhenTheReleaseCannotBeRead(t *testing.T) {
	recorder := httptest.NewRecorder()
	server(metrics.New(), failingReleases{}).Router().ServeHTTP(recorder,
		httptest.NewRequest("GET", "/api/image/amd64?version=26.07.01&format=img", nil))
	assert.Equal(t, http.StatusServiceUnavailable, recorder.Code)
}

func TestImageCannotRedirectOffGithub(t *testing.T) {
	response := get("/api/image/amd64?version=26.07.01&format=img&url=https://evil.example.com")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Contains(t, response.Header().Get("Location"), base)
}

func TestImageCountsTheDownload(t *testing.T) {
	m := metrics.New()
	s := server(m, stubReleases{})
	for _, target := range []string{
		"/api/image/helios4?version=26.07.01&format=img",
		"/api/image/helios4?version=26.07.01&format=img&gclid=abc",
		"/api/image/amd64?version=26.07.01&format=vdi",
		"/api/image/amd64?version=nonsense&format=img",
	} {
		s.Router().ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", target, nil))
	}
	assert.Equal(t, 1.0, counter(t, m, "helios4", "img", "direct"))
	assert.Equal(t, 1.0, counter(t, m, "helios4", "img", "ad"))
	assert.Equal(t, 1.0, counter(t, m, "amd64", "vdi", "direct"))
	assert.Equal(t, 0.0, counter(t, m, "amd64", "img", "direct"))
}

func TestReleasesServesWhatTheCuratorHas(t *testing.T) {
	response := get("/api/releases")
	assert.Equal(t, http.StatusOK, response.Code)

	var got release.Catalog
	assert.NoError(t, json.NewDecoder(response.Body).Decode(&got))
	assert.Equal(t, "26.07.01", got.Version)
	assert.Equal(t, "PC", got.Picked[0].Label)
	assert.Equal(t, "syncloud-amd64-26.07.01.img.xz", got.Picked[0].Name)
	assert.Equal(t, []string{"amd64", "helios4"}, labels(got.Others))
}

func TestEveryLinkTheCatalogOffersIsOneTheImageEndpointAccepts(t *testing.T) {
	var got release.Catalog
	assert.NoError(t, json.NewDecoder(get("/api/releases").Body).Decode(&got))

	entries := append(append([]release.Entry{}, got.Picked...), got.Others...)
	assert.Len(t, entries, 3)
	for _, entry := range entries {
		response := get(entry.Url)
		assert.Equal(t, http.StatusFound, response.Code, entry.Url)
		assert.Equal(t, base+"/26.07.01/"+entry.Name,
			response.Header().Get("Location"), entry.Url)
	}
}

func TestReleasesReportsWhenItCannotBeRead(t *testing.T) {
	recorder := httptest.NewRecorder()
	server(metrics.New(), failingReleases{}).
		Router().ServeHTTP(recorder, httptest.NewRequest("GET", "/api/releases", nil))
	assert.Equal(t, http.StatusServiceUnavailable, recorder.Code)
}

func labels(entries []release.Entry) []string {
	out := []string{}
	for _, e := range entries {
		out = append(out, e.Label)
	}
	return out
}

func counter(t *testing.T, m *metrics.Metrics, board, format, source string) float64 {
	t.Helper()
	ch := make(chan prometheus.Metric, 32)
	m.Collect(ch)
	close(ch)
	for sample := range ch {
		var out dto.Metric
		if err := sample.Write(&out); err != nil {
			t.Fatal(err)
		}
		got := map[string]string{}
		for _, l := range out.GetLabel() {
			got[l.GetName()] = l.GetValue()
		}
		if got["board"] == board && got["format"] == format && got["source"] == source {
			return out.GetCounter().GetValue()
		}
	}
	return 0
}

type stubReleases struct{}

func (stubReleases) Latest() (*release.Release, error) {
	return &release.Release{
		Version: "26.07.01",
		Images: []release.Image{
			{Board: "amd64", Format: "img", Name: "syncloud-amd64-26.07.01.img.xz"},
			{Board: "amd64", Format: "vdi", Name: "syncloud-amd64-26.07.01.vdi.xz"},
			{Board: "helios4", Format: "img", Name: "syncloud-helios4-26.07.01.img.xz"},
		},
	}, nil
}

func (s stubReleases) Find(version string) (*release.Release, error) {
	if version == "26.04.9" {
		return &release.Release{
			Version: "26.04.9",
			Images: []release.Image{
				{Board: "amd64", Format: "img", Name: "syncloud-amd64-26.04.9.img.xz"},
			},
		}, nil
	}
	latest, _ := s.Latest()
	if version != latest.Version {
		return nil, fmt.Errorf("%w: no release %s", release.ErrNotFound, version)
	}
	return latest, nil
}

type failingReleases struct{}

func (failingReleases) Latest() (*release.Release, error) {
	return nil, errors.New("github is down")
}

func (failingReleases) Find(string) (*release.Release, error) {
	return nil, errors.New("github is down")
}
