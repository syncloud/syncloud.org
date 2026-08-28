package main

import (
	"flag"
	"log"
	"net/http"
	"strings"
)

func main() {
	address := flag.String("address", ":8081", "listen address")
	version := flag.String("version", "26.07.01", "release the faker pretends is latest")
	flag.Parse()

	http.HandleFunc("/releases/latest", func(writer http.ResponseWriter, _ *http.Request) {
		writer.Header().Set("Content-Type", "application/json")
		_, _ = writer.Write([]byte(`{"tag_name":"` + *version + `","assets":[
			{"name":"syncloud-raspberrypi-64-` + *version + `.img.xz"},
			{"name":"syncloud-raspberrypi-` + *version + `.img.xz"},
			{"name":"syncloud-amd64-` + *version + `.img.xz"},
			{"name":"syncloud-amd64-` + *version + `.vdi.xz"},
			{"name":"syncloud-odroid-hc4-` + *version + `.img.xz"},
			{"name":"syncloud-helios4-` + *version + `.img.xz"},
			{"name":"syncloud-` + *version + `-checksums.txt"}
		]}`))
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
