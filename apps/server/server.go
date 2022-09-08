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
	"log"
	"time"
	"github.com/gofiber/fiber/v2"
	"github.com/asunlabs/pawcon-monorepo/server/src/feature/auth"
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
	app.Group("/auth", auth.AuthHandler)
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

	

	log.Fatal(app.Listen(":3000"))
}