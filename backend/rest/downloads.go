package rest

type Downloads interface {
	Url(board, version, format string) (string, error)
}
