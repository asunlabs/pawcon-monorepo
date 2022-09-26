package router

import (
	"github.com/asunlabs/pawcon-monorepo/server/src/feature/auth/account/jsonwebtoken"
	"github.com/gofiber/fiber/v2"
)

func RoutingGroup(app *fiber.App) {
	AuthAccountRoutes(app)
}

func AuthAccountRoutes(app *fiber.App) {
	_auth := app.Group("/auth")

	_auth.Post("/signup", jsonwebtoken.HandleJwtSignUp)
	// auth.Get("/user:id", ReadUser)
	// auth.Put("/user:id", UpdateUser)
	_auth.Delete("/user/:id", jsonwebtoken.HandleJwtSignClose)
}
