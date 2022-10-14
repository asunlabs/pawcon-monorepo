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

	_auth.Post("/signup", jsonwebtoken.HandleJwtSignUp)
	_auth.Get("/user:id", jsonwebtoken.GetUserByID)
	// _auth.Put("/user:id", jsonwebtoken.UpdateUserByID)
	_auth.Delete("/user/:id", jsonwebtoken.HandleJwtSignClose)
}