package rest

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/syncloud/syncloud.org/metrics"
	"go.uber.org/zap"
)

func get(target string) *httptest.ResponseRecorder {
	s := New("", metrics.New(), zap.NewNop())
	recorder := httptest.NewRecorder()
	s.Router().ServeHTTP(recorder, httptest.NewRequest("GET", target, nil))
	return recorder
}

func TestImageRedirectsToTheRelease(t *testing.T) {
	response := get("/image/raspberrypi-64?version=26.07.01")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Equal(t,
		"https://github.com/syncloud/image/releases/download/26.07.01/syncloud-raspberrypi-64-26.07.01.img.xz",
		response.Header().Get("Location"))
}

func TestImageServesVirtualBoxFormat(t *testing.T) {
	response := get("/image/amd64?version=26.07.01&format=vdi")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Equal(t,
		"https://github.com/syncloud/image/releases/download/26.07.01/syncloud-amd64-26.07.01.vdi.xz",
		response.Header().Get("Location"))
}

func TestImageRejectsBadVersion(t *testing.T) {
	for _, version := range []string{"", "latest", "26.6.1", "../../etc", "26.07.01/x"} {
		assert.Equal(t, http.StatusNotFound, get("/image/amd64?version="+version).Code, version)
	}
}

func TestImageRejectsBadFormat(t *testing.T) {
	for _, format := range []string{"exe", "img.xz", "../img", "IMG"} {
		assert.Equal(t, http.StatusNotFound,
			get("/image/amd64?version=26.07.01&format="+format).Code, format)
	}
}

func TestImageRejectsBadBoard(t *testing.T) {
	for _, board := range []string{"Raspberry", "pi_64", "pi.64", "-pi", "pi-"} {
		assert.NotEqual(t, http.StatusFound,
			get("/image/"+board+"?version=26.07.01").Code, board)
	}
}

func TestImageCannotRedirectOffGithub(t *testing.T) {
	response := get("/image/amd64?version=26.07.01&url=https://evil.example.com")
	assert.Equal(t, http.StatusFound, response.Code)
	assert.Contains(t, response.Header().Get("Location"), "https://github.com/syncloud/image/")
}
