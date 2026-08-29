package rest

import (
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/syncloud/syncloud.org/metrics"
	"github.com/syncloud/syncloud.org/release"
	"go.uber.org/zap"
)

type Server struct {
	socket    string
	downloads Downloads
	catalogs  Catalogs
	metrics   *metrics.Metrics
	logger    *zap.Logger
}

func New(socket string, downloads Downloads, catalogs Catalogs, m *metrics.Metrics, logger *zap.Logger) *Server {
	return &Server{socket: socket, downloads: downloads, catalogs: catalogs, metrics: m, logger: logger}
}

func (s *Server) Router() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/api/image/{board}", s.Image).Methods("GET")
	r.HandleFunc("/api/releases", s.Releases).Methods("GET")
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
	s.logger.Info("started", zap.String("address", listener.Addr().String()))
	return srv.Serve(listener)
}

func (s *Server) Image(writer http.ResponseWriter, req *http.Request) {
	board := mux.Vars(req)["board"]
	version := req.URL.Query().Get("version")
	format := req.URL.Query().Get("format")

	image, err := s.downloads.Url(board, version, format)
	if err != nil {
		if errors.Is(err, release.ErrUnknownImage) {
			s.logger.Info("image rejected", zap.Error(err))
			http.Error(writer, "unknown image", http.StatusNotFound)
			return
		}
		s.logger.Error("cannot read the latest release", zap.Error(err))
		http.Error(writer, "cannot read the latest release", http.StatusServiceUnavailable)
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

	http.Redirect(writer, req, image, http.StatusFound)
}

func (s *Server) Releases(writer http.ResponseWriter, _ *http.Request) {
	catalog, err := s.catalogs.Get()
	if err != nil {
		s.logger.Error("cannot read the latest release", zap.Error(err))
		http.Error(writer, "cannot read the latest release", http.StatusServiceUnavailable)
		return
	}
	for i := range catalog.Picked {
		catalog.Picked[i].Url = s.imageUrl(catalog.Picked[i], catalog.Version)
	}
	for i := range catalog.Others {
		catalog.Others[i].Url = s.imageUrl(catalog.Others[i], catalog.Version)
	}

	writer.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(writer).Encode(catalog); err != nil {
		s.logger.Error("cannot write the release", zap.Error(err))
	}
}

func (s *Server) imageUrl(entry release.Entry, version string) string {
	return fmt.Sprintf("/api/image/%s?version=%s&format=%s",
		url.PathEscape(entry.Board), url.QueryEscape(version), url.QueryEscape(entry.Format))
}
