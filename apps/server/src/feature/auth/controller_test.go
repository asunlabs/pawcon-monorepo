package auth_test

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/asunlabs/pawcon-monorepo/server/src/app/database"
	"github.com/asunlabs/pawcon-monorepo/server/src/feature/auth"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/utils"
	"gorm.io/gorm"
)

type MockUser struct {
	gorm.Model
	Firstname string
	Lastname  string
	Email     string
	Username  string
}

// TODO fix nil pointer bug
func TestHandleJwtSignUp(t *testing.T) {
	app := fiber.New()
	app.Post("/auth/signup", auth.HandleJwtSignUp)

	// create a post body with struct
	body := database.User{
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

	/// @dev see http test detail here: https://github.com/gofiber/fiber/blob/master/app_test.go
	req := httptest.NewRequest(http.MethodPost, "/auth/signup", &buf)
	req.Header.Add("Content-Type", "application/json")

	resp, _ := app.Test(req)
	utils.AssertEqual(t, 201, resp.StatusCode)
}
