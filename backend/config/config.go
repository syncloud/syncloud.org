package config

import "github.com/syncloud/syncloud.org/release"

type Config struct {
	Account string
	Picks   []release.Pick
	Events  []string
}

func New(account string) *Config {
	return &Config{
		Account: account,
		Picks: []release.Pick{
			{Board: "raspberrypi-64", Format: "img", Label: "Raspberry Pi"},
			{Board: "amd64", Format: "img", Label: "PC"},
			{Board: "amd64", Format: "vdi", Label: "VirtualBox"},
		},
		Events: []string{
			"view.index",
			"view.setup",
			"view.faq",
			"view.privacy",
			"view.landing",
			"setup.build",
			"setup.buy",
			"setup.board",
			"outbound.shop",
			"outbound.account",
		},
	}
}
