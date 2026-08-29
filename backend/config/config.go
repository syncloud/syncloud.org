package config

import "github.com/syncloud/syncloud.org/release"

type Config struct {
	Picks []release.Pick
}

func New() *Config {
	return &Config{
		Picks: []release.Pick{
			{Board: "raspberrypi-64", Format: "img", Label: "Raspberry Pi"},
			{Board: "amd64", Format: "img", Label: "PC"},
			{Board: "amd64", Format: "vdi", Label: "VirtualBox"},
		},
	}
}
