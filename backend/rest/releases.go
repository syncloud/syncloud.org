package rest

import (
	"encoding/json"
	"net/http"

	"go.uber.org/zap"
)

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
