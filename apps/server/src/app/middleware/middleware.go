package middleware

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

// set CORS origin dynamically
func SetCORS(app *fiber.App, ports []int) {

	// parsing port number and concatenate to base url
	baseURL := "http://localhost:"
	var _whitelist []string

	for i := 0; i < len(ports); i++ {
		_url := strings.Join([]string{baseURL, strconv.Itoa(ports[i])}, "")
		_whitelist = append(_whitelist, _url)
	}

	whitelist := strings.Join(_whitelist, ", ")
	color.Magenta("whitelisted urls: %s", whitelist)

	app.Use(cors.New(cors.Config{
		AllowOrigins:     whitelist,
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowCredentials: true,
		// API CRUD
		AllowMethods: "POST, GET, PUT, DELETE",
		// no cache for preflight
		MaxAge: 0,
	}))
}

func LoadEnv() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal(".env load failed")
	}

	foo := os.Getenv("FOO")
	color.Green("loaded test .env var: %s", foo)
}
