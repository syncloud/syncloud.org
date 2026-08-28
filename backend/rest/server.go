package rest

import (
	"errors"
	"net"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/syncloud/syncloud.org/metrics"
	"github.com/syncloud/syncloud.org/release"
	"go.uber.org/zap"
)

type Releases interface {
	Get() (*release.Release, error)
}

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
