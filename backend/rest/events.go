package rest

type Events interface {
	Known(event string) bool
}
