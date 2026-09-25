package metrics

import "github.com/prometheus/client_golang/prometheus"

type Metrics struct {
	downloads *prometheus.CounterVec
	events    *prometheus.CounterVec
}

func New() *Metrics {
	return &Metrics{
		downloads: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Name: "site_image_download_total",
				Help: "Device image download links followed, by board, image format, whether the visitor arrived from an ad, which landing page they arrived on and the language the page was shown in.",
			},
			[]string{"board", "format", "source", "landing", "language"},
		),
		events: prometheus.NewCounterVec(
			prometheus.CounterOpts{
				Name: "site_event_total",
				Help: "Steps visitors reached on the site, by event name, whether they arrived from an ad, which landing page they arrived on and the language the page was shown in.",
			},
			[]string{"event", "source", "landing", "language"},
		),
	}
}

func (m *Metrics) Download(board, format, source, landing, language string) {
	m.downloads.WithLabelValues(board, format, source, landing, language).Inc()
}

func (m *Metrics) Event(event, source, landing, language string) {
	m.events.WithLabelValues(event, source, landing, language).Inc()
}

func (m *Metrics) Describe(ch chan<- *prometheus.Desc) {
	m.downloads.Describe(ch)
	m.events.Describe(ch)
}

func (m *Metrics) Collect(ch chan<- prometheus.Metric) {
	m.downloads.Collect(ch)
	m.events.Collect(ch)
}
