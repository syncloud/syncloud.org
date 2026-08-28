package rest

import (
	"fmt"
	"net/http"
	"regexp"

	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

var (
	boardPattern   = regexp.MustCompile(`^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$`)
	versionPattern = regexp.MustCompile(`^[0-9]{2}\.[0-9]{2}\.[0-9]{2}$`)
	formats        = map[string]bool{"img": true, "vdi": true}
)

func (s *Server) Image(writer http.ResponseWriter, req *http.Request) {
	board := mux.Vars(req)["board"]
	version := req.URL.Query().Get("version")
	format := req.URL.Query().Get("format")
	if format == "" {
		format = "img"
	}
	if !boardPattern.MatchString(board) || !versionPattern.MatchString(version) || !formats[format] {
		s.logger.Info("image rejected",
			zap.String("board", board),
			zap.String("version", version),
			zap.String("format", format))
		http.Error(writer, "unknown image", http.StatusNotFound)
		return
	}

	source := "direct"
	if req.URL.Query().Get("gclid") != "" {
		source = "ad"
	}
	s.metrics.Download(board, format, source)
	s.logger.Info("image",
		zap.String("board", board),
		zap.String("version", version),
		zap.String("format", format),
		zap.String("source", source))

	http.Redirect(writer, req, fmt.Sprintf("%s/%s/syncloud-%s-%s.%s.xz",
		s.releaseBase, version, board, version, format), http.StatusFound)
}
