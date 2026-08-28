package metrics

import (
	"net"
	"net/http"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.uber.org/zap"
)

type Server struct {
	address    string
	collectors []prometheus.Collector
	logger     *zap.Logger
}

func NewServer(address string, logger *zap.Logger, collectors ...prometheus.Collector) *Server {
	return &Server{address: address, collectors: collectors, logger: logger}
}

func (s *Server) Start() error {
	registry := prometheus.NewRegistry()
	for _, c := range s.collectors {
		registry.MustRegister(c)
	}
	listener, err := net.Listen("tcp", s.address)
	if err != nil {
		return err
	}
	mux := http.NewServeMux()
	mux.Handle("/metrics", promhttp.HandlerFor(registry, promhttp.HandlerOpts{}))
	s.logger.Info("metrics listening", zap.String("address", listener.Addr().String()))
	go func() {
		if err := http.Serve(listener, mux); err != nil {
			s.logger.Error("metrics server stopped", zap.Error(err))
		}
	}()
	return nil
}
