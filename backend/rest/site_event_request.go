package rest

type SiteEventRequest struct {
	Event    string `json:"event"`
	Gclid    bool   `json:"gclid"`
	Landing  string `json:"landing"`
	Language string `json:"language"`
	Detail   string `json:"detail"`
}
