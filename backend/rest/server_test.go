package rest

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"

	"github.com/prometheus/client_golang/prometheus"
	dto "github.com/prometheus/client_model/go"
	"github.com/stretchr/testify/assert"
	"github.com/syncloud/syncloud.org/event"
	"github.com/syncloud/syncloud.org/label"
	"github.com/syncloud/syncloud.org/metrics"
	"github.com/syncloud/syncloud.org/release"
	"go.uber.org/zap"
)

const base = "https://github.com/syncloud/image/releases/download"

const account = "https://www.syncloud.example"

var picks = []release.Pick{
	{Board: "amd64", Format: "img", Label: "PC"},
}

var dockerImage = release.Docker{
	Label: "Docker",
	Repo:  "syncloud/platform-bookworm",
	Tag:   "26.09.02",
}

func server(m *metrics.Metrics, releases release.Releases) *Server {
	return New("", account,
		release.NewDownloads(releases, base),
		release.NewCurator(releases, picks, dockerImage, zap.NewNop()),
		event.NewEvents([]string{"view.setup", "setup.build"}),
		label.New([]string{"cloud", "password"}),
		label.New([]string{"en", "de", "zh-CN"}),
		m, zap.NewNop())
}

func post(s *Server, body string) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	s.Router().ServeHTTP(recorder,
		httptest.NewRequest("POST", "/api/event", strings.NewReader(body)))
	return recorder
}

func TestEventCountsAKnownStep(t *testing.T) {
	m := metrics.New()
	s := server(m, stubReleases{})

	assert.Equal(t, http.StatusNoContent, post(s, `{"event":"view.setup"}`).Code)
	assert.Equal(t, http.StatusNoContent, post(s, `{"event":"view.setup","gclid":true}`).Code)
	assert.Equal(t, http.StatusNoContent, post(s, `{"event":"setup.build"}`).Code)

	assert.Equal(t, 1.0, event_(t, m, "view.setup", "direct", "none"))
	assert.Equal(t, 1.0, event_(t, m, "view.setup", "ad", "none"))
	assert.Equal(t, 1.0, event_(t, m, "setup.build", "direct", "none"))
}

func TestEventRecordsTheLandingPageTheVisitorArrivedOn(t *testing.T) {
	m := metrics.New()
	s := server(m, stubReleases{})

	assert.Equal(t, http.StatusNoContent,
		post(s, `{"event":"setup.build","gclid":true,"landing":"password"}`).Code)
	assert.Equal(t, http.StatusNoContent,
		post(s, `{"event":"setup.build","landing":"cloud"}`).Code)
	assert.Equal(t, http.StatusNoContent,
		post(s, `{"event":"setup.build","landing":"none"}`).Code)

	assert.Equal(t, 1.0, event_(t, m, "setup.build", "ad", "password"))
	assert.Equal(t, 1.0, event_(t, m, "setup.build", "direct", "cloud"))
	assert.Equal(t, 1.0, event_(t, m, "setup.build", "direct", "none"))
}

func TestEventFoldsAnUnknownLandingIntoOneLabel(t *testing.T) {
	m := metrics.New()
	s := server(m, stubReleases{})

	for _, variant := range []string{
		"invented",
		"Password",
		"password ",
		strings.Repeat("a", 512),
	} {
		body, err := json.Marshal(map[string]any{"event": "setup.build", "landing": variant})
		assert.NoError(t, err)
		assert.Equal(t, http.StatusNoContent, post(s, string(body)).Code, variant)
		assert.Equal(t, 0.0, event_(t, m, "setup.build", "direct", variant), variant)
	}
	assert.Equal(t, 4.0, event_(t, m, "setup.build", "direct", "other"))
	assert.Equal(t, 1, series(m))
}

func TestEventRecordsTheLanguageThePageWasShownIn(t *testing.T) {
	m := metrics.New()
	s := server(m, stubReleases{})

	assert.Equal(t, http.StatusNoContent,
		post(s, `{"event":"view.setup","language":"de"}`).Code)
	assert.Equal(t, http.StatusNoContent,
		post(s, `{"event":"view.setup","language":"zh-CN"}`).Code)
	assert.Equal(t, http.StatusNoContent,
		post(s, `{"event":"view.setup","language":"en"}`).Code)

	assert.Equal(t, 1.0, eventIn(t, m, "view.setup", "direct", "none", "de"))
	assert.Equal(t, 1.0, eventIn(t, m, "view.setup", "direct", "none", "zh-CN"))
	assert.Equal(t, 1.0, eventIn(t, m, "view.setup", "direct", "none", "en"))
	assert.Equal(t, 3, series(m))
}

func TestEventFoldsAnUnknownLanguageIntoOneLabel(t *testing.T) {
	m := metrics.New()
	s := server(m, stubReleases{})

	for _, language := range []string{
		"invented",
		"DE",
		"de ",
		"de-DE",
		"../etc/passwd",
		strings.Repeat("a", 512),
		"de\nsite_event_total{x=\"1\"} 1",
	} {
		body, err := json.Marshal(map[string]any{"event": "view.setup", "language": language})
		assert.NoError(t, err)
		assert.Equal(t, http.StatusNoContent, post(s, string(body)).Code, language)
		assert.Equal(t, 0.0, eventIn(t, m, "view.setup", "direct", "none", language), language)
	}
	assert.Equal(t, 7.0, eventIn(t, m, "view.setup", "direct", "none", "other"))
	assert.Equal(t, 1, series(m))
}

func TestEventReportsNoLanguageWhenTheClientSendsNone(t *testing.T) {
	m := metrics.New()
	s := server(m, stubReleases{})

	assert.Equal(t, http.StatusNoContent, post(s, `{"event":"view.setup"}`).Code)
	assert.Equal(t, 1.0, eventIn(t, m, "view.setup", "direct", "none", "none"))
	assert.Equal(t, 1, series(m))
}

func TestEventRefusesAnythingNotConfigured(t *testing.T) {
	m := metrics.New()
	s := server(m, stubReleases{})
	for _, body := range []string{
		`{"event":"anything"}`,
		`{"event":""}`,
		`{"event":"view.setup "}`,
	} {
		assert.Equal(t, http.StatusNotFound, post(s, body).Code, body)
	}
	assert.Equal(t, 0.0, event_(t, m, "anything", "direct", "none"))
}

func TestEventRefusesRubbish(t *testing.T) {
	s := server(metrics.New(), stubReleases{})
	assert.Equal(t, http.StatusBadRequest, post(s, "not json").Code)
}

func TestEventIsNotReachableByGet(t *testing.T) {
	recorder := httptest.NewRecorder()
	server(metrics.New(), stubReleases{}).Router().ServeHTTP(recorder,
		httptest.NewRequest("GET", "/api/event", nil))
	assert.NotEqual(t, http.StatusNoContent, recorder.Code)
}

func event_(t *testing.T, m *metrics.Metrics, name, source, landing string) float64 {
	t.Helper()
	return eventIn(t, m, name, source, landing, "none")
}

func eventIn(t *testing.T, m *metrics.Metrics, name, source, landing, language string) float64 {
	t.Helper()
	return sample(t, m, map[string]string{
		"event": name, "source": source, "landing": landing, "language": language,
	})
}

func sample(t *testing.T, m *metrics.Metrics, want map[string]string) float64 {
	t.Helper()
	ch := make(chan prometheus.Metric, 64)
	m.Collect(ch)
	close(ch)
	for metric := range ch {
		var out dto.Metric
		if err := metric.Write(&out); err != nil {
			t.Fatal(err)
		}
		got := map[string]string{}
		for _, l := range out.GetLabel() {
			got[l.GetName()] = l.GetValue()
		}
		if len(got) != len(want) {
			continue
		}
		matched := true
		for name, value := range want {
			if got[name] != value {
				matched = false
				break
			}
		}
		if matched {
			return out.GetCounter().GetValue()
		}
	}
	return 0
}

func series(m *metrics.Metrics) int {
	ch := make(chan prometheus.Metric, 1024)
	m.Collect(ch)
	close(ch)
	count := 0
	for range ch {
		count++
	}
	return count
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
	assert.Equal(t, 1.0, counter(t, m, "helios4", "img", "direct", "none"))
	assert.Equal(t, 1.0, counter(t, m, "helios4", "img", "ad", "none"))
	assert.Equal(t, 1.0, counter(t, m, "amd64", "vdi", "direct", "none"))
	assert.Equal(t, 0.0, counter(t, m, "amd64", "img", "direct", "none"))
}

func TestImageRecordsTheLandingPageTheVisitorArrivedOn(t *testing.T) {
	m := metrics.New()
	s := server(m, stubReleases{})
	for _, target := range []string{
		"/api/image/amd64?version=26.07.01&format=vdi&gclid=abc&landing=password",
		"/api/image/amd64?version=26.07.01&format=vdi&landing=cloud",
		"/api/image/amd64?version=26.07.01&format=vdi&landing=none",
	} {
		s.Router().ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", target, nil))
	}
	assert.Equal(t, 1.0, counter(t, m, "amd64", "vdi", "ad", "password"))
	assert.Equal(t, 1.0, counter(t, m, "amd64", "vdi", "direct", "cloud"))
	assert.Equal(t, 1.0, counter(t, m, "amd64", "vdi", "direct", "none"))
}

func TestImageFoldsAnUnknownLandingIntoOneLabel(t *testing.T) {
	m := metrics.New()
	s := server(m, stubReleases{})
	for _, variant := range []string{
		"invented",
		"Cloud",
		"../etc/passwd",
		strings.Repeat("a", 512),
	} {
		target := "/api/image/amd64?version=26.07.01&format=img&landing=" + url.QueryEscape(variant)
		s.Router().ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", target, nil))
		assert.Equal(t, 0.0, counter(t, m, "amd64", "img", "direct", variant), variant)
	}
	assert.Equal(t, 4.0, counter(t, m, "amd64", "img", "direct", "other"))
	assert.Equal(t, 1, series(m))
}

func TestImageRecordsTheLanguageThePageWasShownIn(t *testing.T) {
	m := metrics.New()
	s := server(m, stubReleases{})
	for _, target := range []string{
		"/api/image/amd64?version=26.07.01&format=vdi&language=de",
		"/api/image/amd64?version=26.07.01&format=vdi&language=zh-CN",
		"/api/image/amd64?version=26.07.01&format=vdi",
	} {
		s.Router().ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", target, nil))
	}
	assert.Equal(t, 1.0, counterIn(t, m, "amd64", "vdi", "direct", "none", "de"))
	assert.Equal(t, 1.0, counterIn(t, m, "amd64", "vdi", "direct", "none", "zh-CN"))
	assert.Equal(t, 1.0, counterIn(t, m, "amd64", "vdi", "direct", "none", "none"))
	assert.Equal(t, 3, series(m))
}

func TestImageFoldsAnUnknownLanguageIntoOneLabel(t *testing.T) {
	m := metrics.New()
	s := server(m, stubReleases{})
	for _, language := range []string{
		"invented",
		"DE",
		"de-DE",
		"../etc/passwd",
		strings.Repeat("a", 512),
	} {
		target := "/api/image/amd64?version=26.07.01&format=img&language=" + url.QueryEscape(language)
		s.Router().ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", target, nil))
		assert.Equal(t, 0.0, counterIn(t, m, "amd64", "img", "direct", "none", language), language)
	}
	assert.Equal(t, 5.0, counterIn(t, m, "amd64", "img", "direct", "none", "other"))
	assert.Equal(t, 1, series(m))
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

	entries := []release.Entry{}
	for _, entry := range append(append([]release.Entry{}, got.Picked...), got.Others...) {
		if entry.Kind != release.KindDocker {
			entries = append(entries, entry)
		}
	}
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

func counter(t *testing.T, m *metrics.Metrics, board, format, source, landing string) float64 {
	t.Helper()
	return counterIn(t, m, board, format, source, landing, "none")
}

func counterIn(t *testing.T, m *metrics.Metrics, board, format, source, landing, language string) float64 {
	t.Helper()
	return sample(t, m, map[string]string{
		"board": board, "format": format, "source": source,
		"landing": landing, "language": language,
	})
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

func TestConfigTellsThePageWhereTheAccountServiceIs(t *testing.T) {
	response := get("/api/config")
	assert.Equal(t, http.StatusOK, response.Code)

	var got map[string]string
	assert.NoError(t, json.NewDecoder(response.Body).Decode(&got))
	assert.Equal(t, account, got["account"])
}

func TestReleasesLeavesDockerWithoutADownloadLink(t *testing.T) {
	var catalog release.Catalog
	assert.NoError(t, json.NewDecoder(get("/api/releases").Body).Decode(&catalog))

	last := catalog.Picked[len(catalog.Picked)-1]
	assert.Equal(t, release.KindDocker, last.Kind)
	assert.Equal(t, "syncloud/platform-bookworm:26.09.02", last.Name)
	assert.Empty(t, last.Url)
	for _, entry := range catalog.Picked[:len(catalog.Picked)-1] {
		assert.NotEmpty(t, entry.Url, entry.Label)
	}
}
