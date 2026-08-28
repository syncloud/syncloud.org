package main

import (
	"github.com/spf13/cobra"
	"github.com/syncloud/syncloud.org/metrics"
	"github.com/syncloud/syncloud.org/rest"
	"go.uber.org/zap"
)

func main() {
	var socket string
	var metricsAddress string
	cmd := &cobra.Command{
		Use: "api",
		RunE: func(cmd *cobra.Command, args []string) error {
			logger, err := zap.NewProduction()
			if err != nil {
				return err
			}
			defer func() { _ = logger.Sync() }()

			collector := metrics.New()
			errs := make(chan error, 2)
			go func() { errs <- metrics.NewServer(metricsAddress, logger, collector).Start() }()
			go func() { errs <- rest.New(socket, collector, logger).Start() }()
			return <-errs
		},
	}
	cmd.Flags().StringVar(&socket, "socket", "/var/www/syncloud.org/api.socket", "unix socket to listen on")
	cmd.Flags().StringVar(&metricsAddress, "metrics", "127.0.0.1:9101", "prometheus metrics address")
	if err := cmd.Execute(); err != nil {
		panic(err)
	}
}
