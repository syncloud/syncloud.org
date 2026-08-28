package rest

import (
	"errors"
	"fmt"
	"io/fs"
	"net"
	"net/http"
	"os"
	"path"
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
	r.PathPrefix("/").Handler(spa{root: http.Dir(s.www), logger: s.logger})
	return r
}

type spa struct {
	root   http.FileSystem
	logger *zap.Logger
}

func (h spa) ServeHTTP(writer http.ResponseWriter, req *http.Request) {
	name := path.Clean(req.URL.Path)
	file, err := h.root.Open(name)
	switch {
	case err == nil:
		defer func() { _ = file.Close() }()
		info, err := file.Stat()
		if err != nil {
			h.logger.Error("cannot stat", zap.String("path", name), zap.Error(err))
			http.Error(writer, "cannot read file", http.StatusInternalServerError)
			return
		}
		if !info.IsDir() {
			http.ServeContent(writer, req, info.Name(), info.ModTime(), file)
			return
		}
	case errors.Is(err, fs.ErrNotExist):
	default:
		h.logger.Error("cannot open", zap.String("path", name), zap.Error(err))
		http.Error(writer, "cannot read file", http.StatusInternalServerError)
		return
	}
	h.serveIndex(writer, req)
}

func (h spa) serveIndex(writer http.ResponseWriter, req *http.Request) {
	index, err := h.root.Open("index.html")
	if err != nil {
		h.logger.Error("cannot open index.html", zap.Error(err))
		http.Error(writer, "site not available", http.StatusInternalServerError)
		return
	}
	defer func() { _ = index.Close() }()
	info, err := index.Stat()
	if err != nil {
		h.logger.Error("cannot stat index.html", zap.Error(err))
		http.Error(writer, "site not available", http.StatusInternalServerError)
		return
	}
	http.ServeContent(writer, req, "index.html", info.ModTime(), index)
}

func (s *Server) Start() error {
	if s.www == "" {
		return errors.New("no site directory configured, pass --www")
	}
	if _, err := os.Stat(filepath.Join(s.www, "index.html")); err != nil {
		return fmt.Errorf("no index.html under %s: %w", s.www, err)
	}
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
