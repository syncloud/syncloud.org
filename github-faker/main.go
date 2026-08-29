package main

import (
	"flag"
	"log"
	"net/http"
	"strings"
)

func release(tag string, prerelease bool, images ...string) string {
	assets := []string{`{"name":"syncloud-` + tag + `-checksums.txt"}`}
	for _, image := range images {
		board, format, _ := strings.Cut(image, ".")
		assets = append(assets, `{"name":"syncloud-`+board+`-`+tag+`.`+format+`.xz"}`)
	}
	pre := "false"
	if prerelease {
		pre = "true"
	}
	return `{"tag_name":"` + tag + `","draft":false,"prerelease":` + pre +
		`,"assets":[` + strings.Join(assets, ",") + `]}`
}

func main() {
	address := flag.String("address", ":8081", "listen address")
	version := flag.String("version", "26.07.01", "release the faker pretends is latest")
	previous := flag.String("previous", "26.04.9", "an older release, tagged the older way")
	flag.Parse()

	http.HandleFunc("/releases", func(writer http.ResponseWriter, _ *http.Request) {
		writer.Header().Set("Content-Type", "application/json")
		_, _ = writer.Write([]byte(`[` + strings.Join([]string{
			release(*version+"-rc1", true, "amd64.img"),
			release(*version, false,
				"raspberrypi-64.img", "raspberrypi.img", "amd64.img", "amd64.vdi",
				"odroid-hc4.img", "helios4.img"),
			release(*previous, false, "raspberrypi-64.img", "amd64.img"),
		}, ",") + `]`))
	})

	http.HandleFunc("/", func(writer http.ResponseWriter, req *http.Request) {
		if !strings.HasSuffix(req.URL.Path, ".xz") {
			http.NotFound(writer, req)
			return
		}
		log.Printf("serving %s", req.URL.Path)
		writer.Header().Set("Content-Type", "text/plain")
		_, _ = writer.Write([]byte("not a real image: " + req.URL.Path))
	})

	log.Printf("github faker listening on %s", *address)
	log.Fatal(http.ListenAndServe(*address, nil))
}
