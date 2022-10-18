package auth_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"

	"testing"

	"github.com/asunlabs/pawcon-monorepo/server/src/feature/auth"
	"github.com/gofiber/fiber/v2"
)

type MockUser struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Email     string `json:"email"`
	Username  string `json:"username"`
}

func TestHandleJwtSignUp(t *testing.T) {
	app := fiber.New()

	app.Post("/api/v1/login/jwt", auth.HandleJwtSignUp)
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

	response, _ := app.Test(req)
	fmt.Println(req)
	fmt.Println(response.StatusCode)
}
