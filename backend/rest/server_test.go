package rest

import (
	"encoding/json"
	"errors"
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

func server(m *metrics.Metrics, catalogs Catalogs) *Server {
	return New("", release.NewDownloads(base), catalogs, m, zap.NewNop())
}

func get(target string) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	server(metrics.New(), stubCatalogs{}).
		Router().ServeHTTP(recorder, httptest.NewRequest("GET", target, nil))
	return recorder
}

func TestImageRedirectsToTheRelease(t *testing.T) {
	response := get("/api/image/raspberrypi-64?version=26.07.01&format=img")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Equal(t, base+"/26.07.01/syncloud-raspberrypi-64-26.07.01.img.xz",
		response.Header().Get("Location"))
}

func TestImageServesVirtualBoxFormat(t *testing.T) {
	response := get("/api/image/amd64?version=26.07.01&format=vdi")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Equal(t, base+"/26.07.01/syncloud-amd64-26.07.01.vdi.xz",
		response.Header().Get("Location"))
}

func TestImageRejectsBadVersion(t *testing.T) {
	for _, version := range []string{"", "latest", "26.6.1", "../../etc", "26.07.01/x"} {
		assert.Equal(t, http.StatusNotFound,
			get("/api/image/amd64?format=img&version="+version).Code, version)
	}
}

func TestImageRejectsBadFormat(t *testing.T) {
	for _, format := range []string{"", "exe", "img.xz", "../img", "IMG"} {
		assert.Equal(t, http.StatusNotFound,
			get("/api/image/amd64?version=26.07.01&format="+format).Code, format)
	}
}

func TestImageRejectsBadBoard(t *testing.T) {
	for _, board := range []string{"Raspberry", "pi_64", "pi.64", "-pi", "pi-"} {
		assert.NotEqual(t, http.StatusFound,
			get("/api/image/"+board+"?version=26.07.01&format=img").Code, board)
	}
}

func TestImageCannotRedirectOffGithub(t *testing.T) {
	response := get("/api/image/amd64?version=26.07.01&format=img&url=https://evil.example.com")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Contains(t, response.Header().Get("Location"), base)
}

func TestImageCountsTheDownload(t *testing.T) {
	m := metrics.New()
	s := server(m, stubCatalogs{})
	for _, target := range []string{
		"/api/image/raspberrypi-64?version=26.07.01&format=img",
		"/api/image/raspberrypi-64?version=26.07.01&format=img&gclid=abc",
		"/api/image/amd64?version=26.07.01&format=vdi",
		"/api/image/amd64?version=nonsense&format=img",
	} {
		s.Router().ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", target, nil))
	}
	assert.Equal(t, 1.0, counter(t, m, "raspberrypi-64", "img", "direct"))
	assert.Equal(t, 1.0, counter(t, m, "raspberrypi-64", "img", "ad"))
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
	assert.Equal(t, "helios4", got.Others[0].Label)
}

func TestReleasesLinksEveryEntryAtTheImageEndpoint(t *testing.T) {
	var got release.Catalog
	assert.NoError(t, json.NewDecoder(get("/api/releases").Body).Decode(&got))

	assert.Equal(t, "/api/image/amd64?version=26.07.01&format=img", got.Picked[0].Url)
	assert.Equal(t, "/api/image/helios4?version=26.07.01&format=vdi", got.Others[0].Url)

	response := get(got.Picked[0].Url)
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Equal(t, base+"/26.07.01/"+got.Picked[0].Name, response.Header().Get("Location"))
}

func TestReleasesReportsWhenItCannotBeRead(t *testing.T) {
	recorder := httptest.NewRecorder()
	server(metrics.New(), failingCatalogs{}).
		Router().ServeHTTP(recorder, httptest.NewRequest("GET", "/api/releases", nil))
	assert.Equal(t, http.StatusServiceUnavailable, recorder.Code)
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

type stubCatalogs struct{}

func (stubCatalogs) Get() (*release.Catalog, error) {
	return &release.Catalog{
		Version: "26.07.01",
		Picked: []release.Entry{
			{Board: "amd64", Format: "img", Name: "syncloud-amd64-26.07.01.img.xz", Label: "PC"},
		},
		Others: []release.Entry{
			{Board: "helios4", Format: "vdi", Name: "syncloud-helios4-26.07.01.vdi.xz",
				Label: "helios4", Note: "vdi"},
		},
	}, nil
}

type failingCatalogs struct{}

func (failingCatalogs) Get() (*release.Catalog, error) {
	return nil, errors.New("github is down")
}
