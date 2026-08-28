package metrics

import (
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
	mux := http.NewServeMux()
	mux.Handle("/metrics", promhttp.HandlerFor(registry, promhttp.HandlerOpts{}))
	s.logger.Info("metrics listening", zap.String("address", s.address))
	return http.ListenAndServe(s.address, mux)
}
