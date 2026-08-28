package metrics

import "github.com/prometheus/client_golang/prometheus"

type Metrics struct {
	downloads *prometheus.CounterVec
}

func New() *Metrics {
	return &Metrics{
		downloads: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Name: "site_image_download_total",
				Help: "Device image download links followed, by board, image format and whether the visitor arrived from an ad.",
			},
			[]string{"board", "format", "source"},
		),
	}
}

func (m *Metrics) Download(board, format, source string) {
	m.downloads.WithLabelValues(board, format, source).Inc()
}

func (m *Metrics) Describe(ch chan<- *prometheus.Desc) {
	m.downloads.Describe(ch)
}

func (m *Metrics) Collect(ch chan<- prometheus.Metric) {
	m.downloads.Collect(ch)
}
