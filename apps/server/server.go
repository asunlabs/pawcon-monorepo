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
	"log"
	"time"
	"github.com/asunlabs/pawcon-monorepo/server/src/app/database"
	"github.com/asunlabs/pawcon-monorepo/server/src/app/middleware"
	"github.com/asunlabs/pawcon-monorepo/server/src/feature/auth"
	"github.com/gofiber/fiber/v2"
)

const (
	_CLIENT_PORT = 3000
	_PORT = 3001
)

func main() {
	
	// ================ App config ================ //
	app := fiber.New(fiber.Config{
		AppName: "PawCon server v0.3.0",
		CaseSensitive: false,
		StrictRouting: false,
		Immutable: false,
		GETOnly: false,
	})
	middleware.SetCORS(app, []int{_CLIENT_PORT, _PORT})
	database.Connect(auth.UserModel())
	// ================ App config ================ //
	
	// ================ API ================ //
	/// @dev /api => virtual path prefix
	app.Static("/api", "./public", fiber.Static{
		Compress: true, // CPU minimization
		CacheDuration: 10 * time.Second,
		MaxAge: 3600, // 5 mins
	})
	// ================ API ================ //
	
	// ================ Routers ================ //
	app.Group("/auth", auth.Default)
	// ================ Routers ================ //

	app.Get("/", func(c *fiber.Ctx) error {
		type PawConServerGuide struct {
			Routers []string `json:"routers"`
			Handlers uint32 `json:"numberOfHandlers"`
		} 

		pawconServerGuide := PawConServerGuide{
			Routers: []string {"/api, /auth"},
			Handlers: app.HandlersCount(),
		}
		return c.JSON(pawconServerGuide)
	})

	PORT := fmt.Sprintf(":%d", _PORT)
	log.Fatal(app.Listen(PORT))
}