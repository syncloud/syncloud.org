package rest

import (
	"net"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/syncloud/syncloud.org/metrics"
	"go.uber.org/zap"
)

const DefaultReleaseBase = "https://github.com/syncloud/image/releases/download"

type Server struct {
	socket      string
	releaseBase string
	metrics     *metrics.Metrics
	logger      *zap.Logger
}

func New(socket, releaseBase string, m *metrics.Metrics, logger *zap.Logger) *Server {
	if releaseBase == "" {
		releaseBase = DefaultReleaseBase
	}
	return &Server{socket: socket, releaseBase: releaseBase, metrics: m, logger: logger}
}

func (s *Server) Router() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/api/image/{board}", s.Image).Methods("GET")
	return r
}

func (s *Server) Start() error {
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
