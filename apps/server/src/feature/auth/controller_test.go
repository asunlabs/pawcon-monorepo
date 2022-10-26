package auth_test

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/asunlabs/pawcon-monorepo/server/src/app/database"
	"github.com/asunlabs/pawcon-monorepo/server/src/feature/auth"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/utils"
	mocket "github.com/selvatico/go-mocket"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type MockUser struct {
	gorm.Model
	Firstname string
	Lastname  string
	Email     string
	Username  string
}

var (
	DB *gorm.DB
)

func SetUpTests() *gorm.DB {
	// @dev Register safely register FakeDriver
	mocket.Catcher.Register()
	mocket.Catcher.Logging = true

	db, err := gorm.Open(sqlite.Open(mocket.DriverName))
	DB = db

	if err != nil {
		log.Fatalf(err.Error())
	}

	return db
}

// API test case with httptest + real db connection
func TestSignUpByJwt(t *testing.T) {
	t.Run("Sign up POST API test", func(t *testing.T) {
		t.SkipNow()
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
	})
}

// TODO fix no such table: users error 
func InsertRecord(db *gorm.DB, _commonReply []map[string]interface{}) uint {
	result := db.Exec(`INSERT INTO users VALUES (id, first_name, last_name, email, user_name)`, 
		"2022-10-25 22:46:24.792",
		"2022-10-25 22:46:24.888",
		"NULL", 
		"mock jake",
		"mock sung",
		"nellow1102@google.com",
		"mock dev")

	err := result.Error;

	if  err != nil {
		log.Fatal(err.Error())
	}

	_id := _commonReply[0]["id"]

	// type assertion
	id := _id.(uint)
	return id
}

// API test with mock db connection
func TestMockDB(t *testing.T) {
	SetUpTests()

	t.Run("Simple API test with mock db", func(t *testing.T) {
		t.SkipNow()

		commonReply := []map[string]interface{}{
			{
				"first_name": "mock jake",
				"last_name": "mock sung", 
				"email": "nellow1102@google.com", 
				"user_name": "mock dev",
			},
		}
	
		fakeResp := mocket.Catcher.Reset().NewMock().WithQuery(`SELECT * FROM "users" WHERE`).WithReply(commonReply)

		if err := fakeResp.Error; err != nil {
			t.Error(err.Error())
		}
	})

	t.Run("Should create a new user", func(t *testing.T) {
		app := fiber.New()
		SetUpTests()
		app.Post("/auth/signup", auth.HandleJwtSignUp)

		// ! Important: Use database files here (snake_case) and not struct variables (CamelCase)
		// ! eg: first_name, last_name, date_of_birth NOT FirstName, LastName or DateOfBirth
		commonReply := []map[string]interface{}{
			{
				"id": 1,
				"first_name": "mock jake",
				"last_name": "mock sung", 
				"email": "nellow1102@google.com", 
				"user_name": "mock dev",
			},
		}

		mocket.Catcher.Reset().NewMock().WithQuery(`INSERT INTO users`).WithReply(commonReply)

		id := InsertRecord(DB, commonReply)

		if id != commonReply[0]["id"] {
			t.Error()
		}
		// var buf bytes.Buffer
		// err := json.NewEncoder(&buf).Encode(commonReply[0])

		// if err != nil {
		// 	log.Fatal(err)
		// }

		// req := httptest.NewRequest(http.MethodPost, "/auth/signup", &buf)
		// req.Header.Set("Content-Type", "application/json")
	
		// resp, _ := app.Test(req)
		// io.ReadAll(resp.Body)
		// utils.AssertEqual(t, 201, resp.StatusCode)
	})

}

func TestHandleJwtSignUpWithMockDB(t *testing.T) {
	t.SkipNow()
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

	mock.ExpectBegin()

	query := regexp.QuoteMeta(`
		INSERT INTO "users" ("created_at","updated_at","deleted_at","firstname","lastname","email","username")
		VALUES ($2022-10-25 22:46:24.792,$2022-10-25 22:46:24.888,$NULL,$mock jake,$mock sung,$mock email,$mock dev)
		`)
		
	mock.ExpectQuery(query).WithArgs(
		sqlmock.AnyArg(),
		sqlmock.AnyArg(),
		sqlmock.AnyArg(),
	"mock jake",
	"mock sung",
	"mock email",
	"mock dev").WillReturnRows(row)

	mock.ExpectCommit()

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Error(err.Error())
	}
}