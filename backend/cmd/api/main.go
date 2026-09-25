package main

import (
	"fmt"
	"os"
	"time"

	"github.com/spf13/cobra"
	"github.com/syncloud/syncloud.org/config"
	"github.com/syncloud/syncloud.org/event"
	"github.com/syncloud/syncloud.org/label"
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
	var accountUrl string
	var platformVersion string
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

			if platformVersion == "" {
				return fmt.Errorf("platform-version is empty, the docker choice would have no image")
			}

			cfg := config.New(accountUrl, platformVersion)

			cache := release.NewCache(releaseApi, releaseCache, logger)
			curator := release.NewCurator(cache, cfg.Picks, cfg.Docker, logger)
			downloads := release.NewDownloads(cache, releaseBase)
			events := event.NewEvents(cfg.Events)
			landings := label.New(cfg.Landings)
			languages := label.New(cfg.Languages)

			server := rest.New(socket, cfg.Account, downloads, curator, events, landings, languages, collector, logger)
			return server.Start()
		},
	}
	cmd.Flags().StringVar(&socket, "socket", "", "unix socket to listen on")
	cmd.Flags().StringVar(&metricsAddress, "metrics", "", "prometheus metrics address")
	cmd.Flags().StringVar(&releaseBase, "release-base", "", "where image downloads are redirected")
	cmd.Flags().StringVar(&releaseApi, "release-api", "", "where the latest release is read from")
	cmd.Flags().DurationVar(&releaseCache, "release-cache", 0, "how long a fetched release is reused")
	cmd.Flags().StringVar(&accountUrl, "account-url", "", "where the account service lives")
	cmd.Flags().StringVar(&platformVersion, "platform-version", "", "docker tag of the platform image offered on the setup page")
	for _, flag := range []string{"socket", "metrics", "release-base", "release-api", "release-cache", "account-url", "platform-version"} {
		if err := cmd.MarkFlagRequired(flag); err != nil {
			panic(err)
		}
	}
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
