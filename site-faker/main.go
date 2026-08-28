package main

import (
	"context"
	"flag"
	"log"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	address := flag.String("address", ":8080", "listen address")
	root := flag.String("www", "web/dist", "directory holding the built site")
	socket := flag.String("socket", "", "unix socket of the api")
	flag.Parse()

	target, err := url.Parse("http://api")
	if err != nil {
		log.Fatal(err)
	}
	api := httputil.NewSingleHostReverseProxy(target)
	api.Transport = &http.Transport{
		DialContext: func(ctx context.Context, _, _ string) (net.Conn, error) {
			return (&net.Dialer{}).DialContext(ctx, "unix", *socket)
		},
	}

	files := http.FileServer(http.Dir(*root))
	http.HandleFunc("/", func(writer http.ResponseWriter, req *http.Request) {
		if strings.HasPrefix(req.URL.Path, "/api/") {
			api.ServeHTTP(writer, req)
			return
		}
		if _, err := os.Stat(filepath.Join(*root, filepath.Clean(req.URL.Path))); err != nil {
			req.URL.Path = "/"
		}
		files.ServeHTTP(writer, req)
	})

	log.Printf("site faker on %s serving %s, api on %s", *address, *root, *socket)
	log.Fatal(http.ListenAndServe(*address, nil))
}
