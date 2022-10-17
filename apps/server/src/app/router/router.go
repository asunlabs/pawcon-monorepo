package router

import (
	"github.com/asunlabs/pawcon-monorepo/server/src/feature/auth"
	"github.com/gofiber/fiber/v2"
)

func RoutingGroup(app *fiber.App) {
	AuthAccountRoutes(app)
}

func AuthAccountRoutes(app *fiber.App) {
	_auth := app.Group("/auth")

	_auth.Post("/signup", auth.HandleJwtSignUp)
	_auth.Get("/user:id", auth.GetUserByID)
	_auth.Put("/user:id", auth.UpdateUserByID)
	_auth.Delete("/user/:id", auth.HandleJwtSignClose)
}