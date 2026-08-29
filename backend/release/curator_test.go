package release

import (
	"errors"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"go.uber.org/zap/zaptest/observer"
)

var picks = []Pick{
	{Board: "raspberrypi-64", Format: "img", Label: "Raspberry Pi"},
	{Board: "amd64", Format: "img", Label: "PC"},
	{Board: "amd64", Format: "vdi", Label: "VirtualBox"},
}

type stubReleases struct {
	releases []*Release
	err      error
}

func (s stubReleases) Latest() (*Release, error) {
	if s.err != nil {
		return nil, s.err
	}
	return s.releases[0], nil
}

func (s stubReleases) Find(version string) (*Release, error) {
	if s.err != nil {
		return nil, s.err
	}
	for _, r := range s.releases {
		if r.Version == version {
			return r, nil
		}
	}
	return nil, fmt.Errorf("%w: no release %s", ErrNotFound, version)
}

func released(images ...Image) stubReleases {
	return stubReleases{releases: []*Release{{Version: "26.07.01", Images: images}}}
}

func image(board, format string) Image {
	return Image{
		Board:  board,
		Format: format,
		Name:   "syncloud-" + board + "-26.07.01." + format + ".xz",
	}
}

func curator(releases Releases) *Curator {
	return NewCurator(releases, picks, zap.NewNop())
}

func TestCuratorLeadsWithThePicksInTheirOwnOrder(t *testing.T) {
	catalog, err := curator(released(
		image("amd64", "img"),
		image("helios4", "img"),
		image("raspberrypi-64", "img"),
	)).Get()

	assert.NoError(t, err)
	assert.Equal(t, []string{"Raspberry Pi", "PC"}, labels(catalog.Picked))
	assert.Equal(t, []string{"helios4"}, labels(catalog.Others))
}

func TestCuratorDropsAPickTheReleaseDidNotShip(t *testing.T) {
	catalog, err := curator(released(image("amd64", "img"))).Get()

	assert.NoError(t, err)
	assert.Equal(t, []string{"PC"}, labels(catalog.Picked))
	assert.Empty(t, catalog.Others)
}

func TestCuratorKeepsFormatsApart(t *testing.T) {
	catalog, err := curator(released(
		image("amd64", "img"),
		image("amd64", "vdi"),
		image("helios4", "vdi"),
	)).Get()

	assert.NoError(t, err)
	assert.Equal(t, []string{"PC", "VirtualBox"}, labels(catalog.Picked))
	assert.Equal(t, []string{"helios4"}, labels(catalog.Others))
	assert.Equal(t, "vdi", catalog.Others[0].Note)
}

func TestCuratorOnlyNotesAFormatWorthMentioning(t *testing.T) {
	catalog, err := curator(released(image("helios4", "img"))).Get()

	assert.NoError(t, err)
	assert.Equal(t, "", catalog.Others[0].Note)
}

func TestCuratorNamesEntriesAfterTheShippedAsset(t *testing.T) {
	catalog, err := curator(released(image("amd64", "img"))).Get()

	assert.NoError(t, err)
	assert.Equal(t, "syncloud-amd64-26.07.01.img.xz", catalog.Picked[0].Name)
	assert.Equal(t, "26.07.01", catalog.Version)
}

func TestCuratorPassesTheFailureOn(t *testing.T) {
	_, err := curator(stubReleases{err: errors.New("github is down")}).Get()
	assert.ErrorContains(t, err, "github is down")
}

func labels(entries []Entry) []string {
	out := []string{}
	for _, e := range entries {
		out = append(out, e.Label)
	}
	return out
}

func TestCuratorSaysSoWhenAPickIsNotInTheRelease(t *testing.T) {
	core, logs := observer.New(zap.WarnLevel)
	_, err := NewCurator(released(image("amd64", "img")), picks, zap.New(core)).Get()

	assert.NoError(t, err)
	assert.Equal(t, 2, logs.Len())
	assert.Equal(t, "a pick is missing from the release", logs.All()[0].Message)
}
