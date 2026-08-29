package rest

import (
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/gorilla/mux"
	"github.com/syncloud/syncloud.org/metrics"
	"go.uber.org/zap"
)

type Server struct {
	socket      string
	releaseBase string
	releases    Releases
	metrics     *metrics.Metrics
	logger      *zap.Logger
}

func New(socket, releaseBase string, releases Releases, m *metrics.Metrics, logger *zap.Logger) *Server {
	return &Server{socket: socket, releaseBase: releaseBase, releases: releases, metrics: m, logger: logger}
}

func (s *Server) Router() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/api/image/{board}", s.Image).Methods("GET")
	r.HandleFunc("/api/releases", s.Releases).Methods("GET")
	return r
}

func (s *Server) Start() error {
	if s.releaseBase == "" {
		return errors.New("no release base configured, pass --release-base")
	}
	if s.releases == nil {
		return errors.New("no release source configured, pass --release-api and --release-cache")
	}
	if _, err := os.Stat(s.socket); err == nil {
		if err := os.Remove(s.socket); err != nil {
			return err
		}
	}
	listener, err := net.Listen("unix", s.socket)
	if err != nil {
		return err
	}
	if err := os.Chmod(s.socket, 0777); err != nil {
		return err
	}
	return s.serve(listener)
}

func (s *Server) serve(listener net.Listener) error {
	srv := &http.Server{
		Handler:      s.Router(),
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
		IdleTimeout:  15 * time.Second,
	}
	s.logger.Info("started",
		zap.String("address", listener.Addr().String()),
		zap.String("release base", s.releaseBase))
	return srv.Serve(listener)
}

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

func (s *Server) Releases(writer http.ResponseWriter, _ *http.Request) {
	latest, err := s.releases.Get()
	if err != nil {
		s.logger.Error("cannot read the latest release", zap.Error(err))
		http.Error(writer, "cannot read the latest release", http.StatusServiceUnavailable)
		return
	}
	writer.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(writer).Encode(latest); err != nil {
		s.logger.Error("cannot write the release", zap.Error(err))
	}
}
