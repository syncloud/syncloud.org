package main

import (
	"os"

	"github.com/spf13/cobra"
	"github.com/syncloud/syncloud.org/metrics"
	"github.com/syncloud/syncloud.org/rest"
	"go.uber.org/zap"
)

func main() {
	var socket string
	var metricsAddress string
	var releaseBase string
	var www string
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
			if err := metrics.NewServer(metricsAddress, logger, collector).Start(); err != nil {
				return err
			}
			return rest.New(socket, releaseBase, www, collector, logger).Start()
		},
	}
	cmd.Flags().StringVar(&socket, "socket", "/var/www/syncloud.org/api.socket", "unix socket to listen on")
	cmd.Flags().StringVar(&metricsAddress, "metrics", ":9101", "prometheus metrics address")
	cmd.Flags().StringVar(&releaseBase, "release-base", rest.DefaultReleaseBase,
		"where image downloads are redirected, pointed at a faker in tests")
	cmd.Flags().StringVar(&www, "www", "", "serve the built site from this directory as well")
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
