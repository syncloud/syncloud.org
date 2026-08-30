package main

import (
	"os"
	"time"

	"github.com/spf13/cobra"
	"github.com/syncloud/syncloud.org/config"
	"github.com/syncloud/syncloud.org/event"
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

			metricsServer := metrics.NewServer(metricsAddress, logger, collector)
			err = metricsServer.Start()
			if err != nil {
				return err
			}

			cfg := config.New()

			cache := release.NewCache(releaseApi, releaseCache, logger)
			curator := release.NewCurator(cache, cfg.Picks, logger)
			downloads := release.NewDownloads(cache, releaseBase)
			events := event.NewEvents(cfg.Events)

			server := rest.New(socket, downloads, curator, events, collector, logger)
			return server.Start()
		},
	}
	cmd.Flags().StringVar(&socket, "socket", "", "unix socket to listen on")
	cmd.Flags().StringVar(&metricsAddress, "metrics", "", "prometheus metrics address")
	cmd.Flags().StringVar(&releaseBase, "release-base", "", "where image downloads are redirected")
	cmd.Flags().StringVar(&releaseApi, "release-api", "", "where the latest release is read from")
	cmd.Flags().DurationVar(&releaseCache, "release-cache", 0, "how long a fetched release is reused")
	for _, flag := range []string{"socket", "metrics", "release-base", "release-api", "release-cache"} {
		if err := cmd.MarkFlagRequired(flag); err != nil {
			panic(err)
		}
	}
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
