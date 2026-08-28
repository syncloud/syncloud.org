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

type Server struct {
	socket  string
	metrics *metrics.Metrics
	logger  *zap.Logger
}

func New(socket string, m *metrics.Metrics, logger *zap.Logger) *Server {
	return &Server{socket: socket, metrics: m, logger: logger}
}

func (s *Server) Router() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/image/{board}", s.Image).Methods("GET")
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
	srv := &http.Server{
		Handler:      s.Router(),
		WriteTimeout: 10 * time.Second,
		ReadTimeout:  10 * time.Second,
		IdleTimeout:  15 * time.Second,
	}
	s.logger.Info("started", zap.String("socket", s.socket))
	return srv.Serve(listener)
}
