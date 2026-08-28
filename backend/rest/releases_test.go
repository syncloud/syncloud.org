package rest

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/syncloud/syncloud.org/metrics"
	"github.com/syncloud/syncloud.org/release"
	"go.uber.org/zap"
)

type failingReleases struct{}

func (failingReleases) Get() (*release.Release, error) {
	return nil, errors.New("github is down")
}

func TestReleasesServesWhatTheCacheHas(t *testing.T) {
	s := New("", "base", stubReleases{}, metrics.New(), zap.NewNop())
	recorder := httptest.NewRecorder()
	s.Router().ServeHTTP(recorder, httptest.NewRequest("GET", "/api/releases", nil))

	assert.Equal(t, http.StatusOK, recorder.Code)
	var got release.Release
	assert.NoError(t, json.NewDecoder(recorder.Body).Decode(&got))
	assert.Equal(t, "26.07.01", got.Version)
	assert.Equal(t, []release.Image{{Board: "amd64", Format: "img"}}, got.Images)
}

func TestReleasesReportsWhenItCannotBeRead(t *testing.T) {
	s := New("", "base", failingReleases{}, metrics.New(), zap.NewNop())
	recorder := httptest.NewRecorder()
	s.Router().ServeHTTP(recorder, httptest.NewRequest("GET", "/api/releases", nil))
	assert.Equal(t, http.StatusServiceUnavailable, recorder.Code)
}
