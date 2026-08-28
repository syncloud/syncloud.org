package main

import (
	"os"
	"time"

	"github.com/spf13/cobra"
	"github.com/syncloud/syncloud.org/metrics"
	"github.com/syncloud/syncloud.org/release"
	"github.com/syncloud/syncloud.org/rest"
	"go.uber.org/zap"
)

func main() {
	var socket string
	var metricsAddress string
	var releaseBase string
	var releaseApi string
	var releaseCache time.Duration
	cmd := &cobra.Command{
		Use:          "api",
		SilenceUsage: true,
		RunE: func(cmd *cobra.Command, args []string) error {
			logger, err := zap.NewProduction()
			if err != nil {
				return err
			}
			defer func() { _ = logger.Sync() }()

			collector := metrics.New()
			releases := release.NewCache(releaseApi, releaseCache, logger)

			metricsServer := metrics.NewServer(metricsAddress, logger, collector)
			err = metricsServer.Start()
			if err != nil {
				return err
			}

			server := rest.New(socket, releaseBase, releases, collector, logger)
			return server.Start()
		},
	}
	cmd.Flags().StringVar(&socket, "socket", "/var/www/syncloud.org/api.socket", "unix socket to listen on")
	cmd.Flags().StringVar(&metricsAddress, "metrics", ":9101", "prometheus metrics address")
	cmd.Flags().StringVar(&releaseBase, "release-base", "",
		"where image downloads are redirected, set per environment")
	cmd.Flags().StringVar(&releaseApi, "release-api", "",
		"where the latest release is read from, set per environment")
	cmd.Flags().DurationVar(&releaseCache, "release-cache", 0,
		"how long a fetched release is reused, set per environment")
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
