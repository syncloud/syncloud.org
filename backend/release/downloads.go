package release

import (
	"fmt"
	"regexp"
)

var (
	boardPattern   = regexp.MustCompile(`^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$`)
	versionPattern = regexp.MustCompile(`^[0-9]{2}\.[0-9]{2}\.[0-9]{2}$`)
	formats        = map[string]bool{"img": true, "vdi": true}
)

type Downloads struct {
	base string
}

func NewDownloads(base string) *Downloads {
	return &Downloads{base: base}
}

func (d *Downloads) Url(board, version, format string) (string, error) {
	if !boardPattern.MatchString(board) {
		return "", fmt.Errorf("board %q is not a board name", board)
	}
	if !versionPattern.MatchString(version) {
		return "", fmt.Errorf("version %q is not a version", version)
	}
	if !formats[format] {
		return "", fmt.Errorf("format %q is not an image format", format)
	}
	return fmt.Sprintf("%s/%s/%s", d.base, version, Name(board, version, format)), nil
}

func Name(board, version, format string) string {
	return fmt.Sprintf("syncloud-%s-%s.%s.xz", board, version, format)
}
