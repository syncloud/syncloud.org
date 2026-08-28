package rest

import (
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/syncloud/syncloud.org/metrics"
	"go.uber.org/zap"
)

const DefaultReleaseBase = "https://github.com/syncloud/image/releases/download"

type Server struct {
	socket      string
	releaseBase string
	www         string
	metrics     *metrics.Metrics
	logger      *zap.Logger
}

func New(socket, releaseBase, www string, m *metrics.Metrics, logger *zap.Logger) *Server {
	if releaseBase == "" {
		releaseBase = DefaultReleaseBase
	}
	return &Server{socket: socket, releaseBase: releaseBase, www: www, metrics: m, logger: logger}
}

func (s *Server) Router() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/image/{board}", s.Image).Methods("GET")
	if s.www != "" {
		r.PathPrefix("/").Handler(spa{root: s.www})
	}
	return r
}

type spa struct {
	root string
}

func (h spa) ServeHTTP(writer http.ResponseWriter, req *http.Request) {
	file := filepath.Join(h.root, filepath.Clean(req.URL.Path))
	if info, err := os.Stat(file); err != nil || info.IsDir() {
		http.ServeFile(writer, req, filepath.Join(h.root, "index.html"))
		return
	}
	http.ServeFile(writer, req, file)
}

func (s *Server) Start() error {
	if strings.HasPrefix(s.socket, "tcp://") {
		listener, err := net.Listen("tcp", strings.TrimPrefix(s.socket, "tcp://"))
		if err != nil {
			return err
		}
		return s.serve(listener)
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
