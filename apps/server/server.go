/*
       /$$                               /$$
      | $$                              | $$
  /$$$$$$$  /$$$$$$  /$$    /$$ /$$$$$$ | $$  /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$   /$$$$$$$ /$$   /$$ /$$$$$$$
 /$$__  $$ /$$__  $$|  $$  /$$//$$__  $$| $$ /$$__  $$ /$$__  $$ /$$__  $$ /$$__  $$|____  $$ /$$_____/| $$  | $$| $$__  $$
| $$  | $$| $$$$$$$$ \  $$/$$/| $$$$$$$$| $$| $$  \ $$| $$  \ $$| $$$$$$$$| $$  \__/ /$$$$$$$|  $$$$$$ | $$  | $$| $$  \ $$
| $$  | $$| $$_____/  \  $$$/ | $$_____/| $$| $$  | $$| $$  | $$| $$_____/| $$      /$$__  $$ \____  $$| $$  | $$| $$  | $$
|  $$$$$$$|  $$$$$$$   \  $/  |  $$$$$$$| $$|  $$$$$$/| $$$$$$$/|  $$$$$$$| $$     |  $$$$$$$ /$$$$$$$/|  $$$$$$/| $$  | $$
 \_______/ \_______/    \_/    \_______/|__/ \______/ | $$____/  \_______/|__/      \_______/|_______/  \______/ |__/  |__/
                                                      | $$
                                                      | $$
                                                      |__/
*/

package main

import (
	"fmt"
	"github.com/asunlabs/pawcon-monorepo/server/src/app/database"
	"github.com/asunlabs/pawcon-monorepo/server/src/app/middleware"
	"github.com/asunlabs/pawcon-monorepo/server/src/app/router"
	"github.com/gofiber/fiber/v2"
	"log"
	"time"
)

const (
	_CLIENT_PORT = 3000
	_PORT        = 3001
)

func main() {
	// ================ App config ================ //
	middleware.LoadEnv("")
	app := fiber.New(fiber.Config{
		AppName:       "PawCon server v0.3.0",
		CaseSensitive: true,
		StrictRouting: true,
		Immutable:     false, // performance-related
		GETOnly:       false,
	})
	middleware.SetCORS(app, []int{_CLIENT_PORT, _PORT})
	database.Connect(database.ReturnAllModel(), "develop")
	// ================ App config ================ //

	// ================ API ================ //
	// * API ver 1: REST API, hardcoded static jsons
	/// @dev /api => virtual path prefix
	app.Static("/api", "./public", fiber.Static{
		Compress:      true, // CPU minimization
		CacheDuration: 10 * time.Second,
		MaxAge:        3600, // 5 mins
	})

	// * API ver 2: GraphQL, dynamic jsons
	// ================ API ================ //

	// ================ Routers ================ //
	router.RoutingGroup(app)
	// ================ Routers ================ //

	app.Get("/", func(c *fiber.Ctx) error {
		type PawConServerGuide struct {
			Routers  []string `json:"routers"`
			Handlers uint32   `json:"numberOfHandlers"`
		}

		pawconServerGuide := PawConServerGuide{
			Routers:  []string{"/api, /auth"},
			Handlers: app.HandlersCount(),
		}
		return c.JSON(pawconServerGuide)
	})

	PORT := fmt.Sprintf(":%d", _PORT)
	log.Fatal(app.Listen(PORT))
}
