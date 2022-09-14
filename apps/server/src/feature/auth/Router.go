package auth

import (
	"github.com/gofiber/fiber/v2"
)

func SetAuthRouter(app *fiber.App)  {
	// TODO setup for auth router. Group controllers into router
	app.Group("/auth", func(c *fiber.Ctx) error { 
		return nil 
	})
}