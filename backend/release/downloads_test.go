package release

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDownloadsBuildsTheReleaseUrl(t *testing.T) {
	url, err := NewDownloads("https://github.com/syncloud/image/releases/download").
		Url("raspberrypi-64", "26.07.01", "img")

	assert.NoError(t, err)
	assert.Equal(t,
		"https://github.com/syncloud/image/releases/download/26.07.01/syncloud-raspberrypi-64-26.07.01.img.xz",
		url)
}

func TestDownloadsRefusesAnythingButABoardName(t *testing.T) {
	for _, board := range []string{"", "Raspberry", "pi_64", "pi.64", "-pi", "pi-", "../etc"} {
		_, err := NewDownloads("base").Url(board, "26.07.01", "img")
		assert.Error(t, err, board)
	}
}

func TestDownloadsRefusesAnythingButAVersion(t *testing.T) {
	for _, version := range []string{"", "latest", "26.6.1", "../../etc", "26.07.01/x"} {
		_, err := NewDownloads("base").Url("amd64", version, "img")
		assert.Error(t, err, version)
	}
}

func TestDownloadsRefusesAnythingButAnImageFormat(t *testing.T) {
	for _, format := range []string{"", "exe", "img.xz", "../img", "IMG"} {
		_, err := NewDownloads("base").Url("amd64", "26.07.01", format)
		assert.Error(t, err, format)
	}
}
