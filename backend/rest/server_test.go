package rest

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/syncloud/syncloud.org/metrics"
	"go.uber.org/zap"
)

func site(t *testing.T) string {
	t.Helper()
	dir := t.TempDir()
	assert.NoError(t, os.WriteFile(filepath.Join(dir, "index.html"), []byte("<html>app</html>"), 0644))
	assert.NoError(t, os.WriteFile(filepath.Join(dir, "robots.txt"), []byte("User-agent: *"), 0644))
	return dir
}

func request(t *testing.T, www, target string) *httptest.ResponseRecorder {
	t.Helper()
	s := New("", "", www, metrics.New(), zap.NewNop())
	recorder := httptest.NewRecorder()
	s.Router().ServeHTTP(recorder, httptest.NewRequest("GET", target, nil))
	return recorder
}

func TestSiteServesARealFile(t *testing.T) {
	response := request(t, site(t), "/robots.txt")
	assert.Equal(t, http.StatusOK, response.Code)
	assert.Contains(t, response.Body.String(), "User-agent")
}

func TestSiteFallsBackToTheAppForRoutes(t *testing.T) {
	for _, route := range []string{"/", "/setup", "/download", "/anything/at/all"} {
		response := request(t, site(t), route)
		assert.Equal(t, http.StatusOK, response.Code, route)
		assert.Contains(t, response.Body.String(), "app", route)
	}
}

func TestSiteCannotEscapeTheRoot(t *testing.T) {
	secret := filepath.Join(t.TempDir(), "secret")
	assert.NoError(t, os.WriteFile(secret, []byte("do not serve me"), 0644))
	for _, target := range []string{"/etc/passwd", "/" + secret} {
		response := request(t, site(t), target)
		assert.NotContains(t, response.Body.String(), "do not serve me", target)
		assert.NotContains(t, response.Body.String(), "root:", target)
	}
}

func TestRefusesToStartWithoutASiteDirectory(t *testing.T) {
	err := New("tcp://127.0.0.1:0", "", "", metrics.New(), zap.NewNop()).Start()
	assert.ErrorContains(t, err, "--www")
}

func TestRefusesToStartWhenTheSiteIsMissing(t *testing.T) {
	err := New("tcp://127.0.0.1:0", "", t.TempDir(), metrics.New(), zap.NewNop()).Start()
	assert.ErrorContains(t, err, "index.html")
}
