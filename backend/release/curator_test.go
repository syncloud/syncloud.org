package release

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

var picks = []Pick{
	{Board: "raspberrypi-64", Format: "img", Label: "Raspberry Pi"},
	{Board: "amd64", Format: "img", Label: "PC"},
	{Board: "amd64", Format: "vdi", Label: "VirtualBox"},
}

type stubReleases struct {
	release *Release
	err     error
}

func (s stubReleases) Get() (*Release, error) { return s.release, s.err }

func released(images ...Image) stubReleases {
	return stubReleases{release: &Release{Version: "26.07.01", Images: images}}
}

func image(board, format string) Image {
	return Image{Board: board, Format: format, Name: Name(board, "26.07.01", format)}
}

func TestCuratorLeadsWithThePicksInTheirOwnOrder(t *testing.T) {
	catalog, err := NewCurator(released(
		image("amd64", "img"),
		image("helios4", "img"),
		image("raspberrypi-64", "img"),
	), picks).Get()

	assert.NoError(t, err)
	assert.Equal(t, []string{"Raspberry Pi", "PC"}, labels(catalog.Picked))
	assert.Equal(t, []string{"helios4"}, labels(catalog.Others))
}

func TestCuratorDropsAPickTheReleaseDidNotShip(t *testing.T) {
	catalog, err := NewCurator(released(image("amd64", "img")), picks).Get()

	assert.NoError(t, err)
	assert.Equal(t, []string{"PC"}, labels(catalog.Picked))
	assert.Empty(t, catalog.Others)
}

func TestCuratorKeepsFormatsApart(t *testing.T) {
	catalog, err := NewCurator(released(
		image("amd64", "img"),
		image("amd64", "vdi"),
		image("helios4", "vdi"),
	), picks).Get()

	assert.NoError(t, err)
	assert.Equal(t, []string{"PC", "VirtualBox"}, labels(catalog.Picked))
	assert.Equal(t, []string{"helios4"}, labels(catalog.Others))
	assert.Equal(t, "vdi", catalog.Others[0].Note)
}

func TestCuratorOnlyNotesAFormatWorthMentioning(t *testing.T) {
	catalog, err := NewCurator(released(image("helios4", "img")), picks).Get()

	assert.NoError(t, err)
	assert.Equal(t, "", catalog.Others[0].Note)
}

func TestCuratorNamesEntriesAfterTheShippedAsset(t *testing.T) {
	catalog, err := NewCurator(released(image("amd64", "img")), picks).Get()

	assert.NoError(t, err)
	assert.Equal(t, "syncloud-amd64-26.07.01.img.xz", catalog.Picked[0].Name)
	assert.Equal(t, "26.07.01", catalog.Version)
}

func TestCuratorPassesTheFailureOn(t *testing.T) {
	_, err := NewCurator(stubReleases{err: errors.New("github is down")}, picks).Get()
	assert.ErrorContains(t, err, "github is down")
}

func labels(entries []Entry) []string {
	out := []string{}
	for _, e := range entries {
		out = append(out, e.Label)
	}
	return out
}
