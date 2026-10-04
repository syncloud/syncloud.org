package config

import "github.com/syncloud/syncloud.org/release"

type Config struct {
	Account   string
	Picks     []release.Pick
	Docker    release.Docker
	Events    []string
	Landings  []string
	Languages []string
}

func New(account, platformVersion string) *Config {
	return &Config{
		Account: account,
		Picks: []release.Pick{
			{Board: "raspberrypi-64", Format: "img", Label: "Raspberry Pi"},
			{Board: "amd64", Format: "img", Label: "PC"},
			{Board: "amd64", Format: "vdi", Label: "VirtualBox"},
		},
		Docker: release.Docker{
			Label: "Docker",
			Repo:  "syncloud/platform-bookworm",
			Tag:   platformVersion,
		},
		Events: []string{
			"view.index",
			"view.setup",
			"view.hardware",
			"view.faq",
			"view.privacy",
			"view.landing",
			"setup.build",
			"setup.buy",
			"setup.board",
			"outbound.shop",
			"outbound.account",
			"outbound.ameridroid",
			"outbound.protectli",
			"outbound.sossolutions",
			"outbound.electrokit",
			"outbound.shellyparts",
			"outbound.thepihut",
			"outbound.starlabs",
			"outbound.slimbook",
		},
		Landings: []string{
			"cloud",
			"pi",
			"access",
			"bitwarden",
			"nextcloud",
			"games",
			"actual-budget",
		},
		Languages: []string{
			"en",
			"zh-CN",
			"es",
			"hi",
			"ar",
			"pt",
			"ru",
			"ja",
			"de",
			"fr",
		},
	}
}
