package auth_test

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
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

// test case with real db connection
func TestHandleJwtSignUp(t *testing.T) {
	app := fiber.New()
	
	// db should be connected for DB CRUD op
	database.Connect(database.ReturnAllModel(), "test")
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
	req.Header.Set("Content-Type", "application/json")

	resp, _ := app.Test(req)
	utils.AssertEqual(t, 201, resp.StatusCode)
}

func TestHandleJwtSignUpWithMockDB(t *testing.T) {
	/// @dev New creates sqlmock database connection and a mock to manage expectations.
	db, mock, err := sqlmock.New()

	if err != nil { 
		t.Errorf("error message: %s", err.Error())
	}

	/// @dev Close closes the database and prevents new queries from starting.
	defer db.Close()

	// TODO fix expectation not matched error: QueryContext or QueryRow error
	row := sqlmock.NewRows([]string{
		"created_at", 
		"updated_at", 
		"deleted_at", 
		"firstname", 
		"lastname", 
		"email",
		"username"}).AddRow(
			"2022-10-25 22:46:24.792",
			"2022-10-25 22:46:24.888",
			"NULL", 
	    	"mock jake",
			"mock sung",
			"mock email",
			"mock dev")
	insertQuery := `INSERT INTO users VALUE (
		"2022-10-25 22:46:24.792",
		"2022-10-25 22:46:24.888",
		"NULL", 
		"mock jake",
		"mock sung",
		"mock email",
		"mock dev"
	)`

	mock.ExpectQuery(insertQuery).WithArgs(
		"2022-10-25 22:46:24.792",
	"2022-10-25 22:46:24.888",
	"NULL", 
	"mock jake",
	"mock sung",
	"mock email",
	"mock dev").WillReturnRows(row)

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Error(err.Error())
	}
}