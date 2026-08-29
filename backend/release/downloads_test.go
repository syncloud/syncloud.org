package release

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

const base = "https://github.com/syncloud/image/releases/download"

func TestDownloadsRedirectsAtTheAssetTheReleaseShipped(t *testing.T) {
	url, err := NewDownloads(released(image("raspberrypi-64", "img")), base).
		Url("raspberrypi-64", "26.07.01", "img")

	assert.NoError(t, err)
	assert.Equal(t, base+"/26.07.01/syncloud-raspberrypi-64-26.07.01.img.xz", url)
}

func TestDownloadsServesAnOlderReleaseTaggedTheOlderWay(t *testing.T) {
	releases := stubReleases{releases: []*Release{
		{Version: "26.07.01", Images: []Image{image("amd64", "img")}},
		{Version: "26.04.9",
			Images: []Image{{Board: "amd64", Format: "img", Name: "syncloud-amd64-26.04.9.img.xz"}}},
	}}

	url, err := NewDownloads(releases, base).Url("amd64", "26.04.9", "img")

	assert.NoError(t, err)
	assert.Equal(t, base+"/26.04.9/syncloud-amd64-26.04.9.img.xz", url)
}

func TestDownloadsRefusesAnythingTheReleaseDoesNotShip(t *testing.T) {
	releases := released(image("amd64", "img"))
	for _, c := range []struct{ board, version, format string }{
		{"amd64", "26.07.01", "vdi"},
		{"amd64", "26.07.01", ""},
		{"helios4", "26.07.01", "img"},
		{"", "26.07.01", "img"},
		{"../../etc/passwd", "26.07.01", "img"},
		{"amd64", "26.06.01", "img"},
		{"amd64", "26.04.9", "img"},
		{"amd64", "", "img"},
		{"amd64", "latest", "img"},
		{"amd64", "26.07.01/../../x", "img"},
	} {
		_, err := NewDownloads(releases, base).Url(c.board, c.version, c.format)
		assert.ErrorIs(t, err, ErrNotFound, c)
	}
}

func TestDownloadsPassesAReleaseFailureOnAsItself(t *testing.T) {
	_, err := NewDownloads(stubReleases{err: errors.New("github is down")}, base).
		Url("amd64", "26.07.01", "img")

	assert.ErrorContains(t, err, "github is down")
	assert.NotErrorIs(t, err, ErrNotFound)
}
