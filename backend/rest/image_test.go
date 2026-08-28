package rest

import (
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"

	"github.com/prometheus/client_golang/prometheus"
	dto "github.com/prometheus/client_model/go"

	"github.com/stretchr/testify/assert"
	"github.com/syncloud/syncloud.org/metrics"
	"go.uber.org/zap"
)

func get(target string) *httptest.ResponseRecorder {
	s := New("", "https://github.com/syncloud/image/releases/download", metrics.New(), zap.NewNop())
	recorder := httptest.NewRecorder()
	s.Router().ServeHTTP(recorder, httptest.NewRequest("GET", target, nil))
	return recorder
}

func TestRefusesToStartWithoutAReleaseBase(t *testing.T) {
	err := New(filepath.Join(t.TempDir(), "api.socket"), "", metrics.New(), zap.NewNop()).Start()
	assert.ErrorContains(t, err, "--release-base")
}

func TestImageRedirectsToTheRelease(t *testing.T) {
	response := get("/api/image/raspberrypi-64?version=26.07.01")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Equal(t,
		"https://github.com/syncloud/image/releases/download/26.07.01/syncloud-raspberrypi-64-26.07.01.img.xz",
		response.Header().Get("Location"))
}

func TestImageServesVirtualBoxFormat(t *testing.T) {
	response := get("/api/image/amd64?version=26.07.01&format=vdi")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Equal(t,
		"https://github.com/syncloud/image/releases/download/26.07.01/syncloud-amd64-26.07.01.vdi.xz",
		response.Header().Get("Location"))
}

func TestImageRejectsBadVersion(t *testing.T) {
	for _, version := range []string{"", "latest", "26.6.1", "../../etc", "26.07.01/x"} {
		assert.Equal(t, http.StatusNotFound, get("/api/image/amd64?version="+version).Code, version)
	}
}

func TestImageRejectsBadFormat(t *testing.T) {
	for _, format := range []string{"exe", "img.xz", "../img", "IMG"} {
		assert.Equal(t, http.StatusNotFound,
			get("/api/image/amd64?version=26.07.01&format="+format).Code, format)
	}
}

func TestImageRejectsBadBoard(t *testing.T) {
	for _, board := range []string{"Raspberry", "pi_64", "pi.64", "-pi", "pi-"} {
		assert.NotEqual(t, http.StatusFound,
			get("/api/image/"+board+"?version=26.07.01").Code, board)
	}
}

func TestImageUsesTheConfiguredReleaseBase(t *testing.T) {
	s := New("", "http://github-faker:8081/releases", metrics.New(), zap.NewNop())
	recorder := httptest.NewRecorder()
	s.Router().ServeHTTP(recorder,
		httptest.NewRequest("GET", "/api/image/raspberrypi-64?version=26.07.01", nil))
	assert.Equal(t,
		"http://github-faker:8081/releases/26.07.01/syncloud-raspberrypi-64-26.07.01.img.xz",
		recorder.Header().Get("Location"))
}

func TestImageCountsTheDownload(t *testing.T) {
	m := metrics.New()
	s := New("", "https://github.com/syncloud/image/releases/download", m, zap.NewNop())
	for _, target := range []string{
		"/api/image/raspberrypi-64?version=26.07.01",
		"/api/image/raspberrypi-64?version=26.07.01&gclid=abc",
		"/api/image/amd64?version=26.07.01&format=vdi",
		"/api/image/amd64?version=nonsense",
	} {
		s.Router().ServeHTTP(httptest.NewRecorder(), httptest.NewRequest("GET", target, nil))
	}
	assert.Equal(t, 1.0, counter(t, m, "raspberrypi-64", "img", "direct"))
	assert.Equal(t, 1.0, counter(t, m, "raspberrypi-64", "img", "ad"))
	assert.Equal(t, 1.0, counter(t, m, "amd64", "vdi", "direct"))
	assert.Equal(t, 0.0, counter(t, m, "amd64", "img", "direct"))
}

func TestImageCannotRedirectOffGithub(t *testing.T) {
	response := get("/api/image/amd64?version=26.07.01&url=https://evil.example.com")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Contains(t, response.Header().Get("Location"), "https://github.com/syncloud/image/")
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
