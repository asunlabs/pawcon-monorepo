package auth_test

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"

	"testing"
)

type MockUser struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Email     string `json:"email"`
	Username  string `json:"username"`
}

type MockServer struct {
	url           string
	body          *MockUser
	server        *httptest.Server
	expectedError error
	statusCreated uint
}

func TestHandleJwtSignUp(t *testing.T) {

	// create a post body with struct
	body := MockUser{
		Firstname: "Jake",
		Lastname:  "Sung",
		Email:     "nellow1102@gmail.com",
		Username:  "developerasun",
	}

	// struct needs to be encoded with buffer
	var buf bytes.Buffer
	err := json.NewEncoder(&buf).Encode(body)

	if err != nil {
		log.Fatal(err)
	}

	req := httptest.NewRequest(http.MethodPost, "/api/v1/login/jwt", &buf)
	req.Header.Set("Content-Type", "application/json")

	// TODO find a httptest post request
	// w := httptest.NewRecorder()
	// res := w.Result()

	log.Print(req.Body)
	// mockServer := MockServer{
	// 	url: "/api/v1/login/jwt",
	// 	server: httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

	// 	})),
	// 	body: &MockUser{
	// 		Firstname: "Jake",
	// 		Lastname: "Sung",
	// 		Email: "nellow1102@gmail.com",
	// 		Username: "developerasun",
	// 	},
	// 	expectedError: nil,
	// 	statusCreated: 201,
	// }

}
