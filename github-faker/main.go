package main

import (
	"flag"
	"log"
	"net/http"
	"strings"
)

func main() {
	address := flag.String("address", ":8081", "listen address")
	flag.Parse()

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
