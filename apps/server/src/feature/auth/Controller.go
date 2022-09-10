package auth

import "github.com/gofiber/fiber/v2"

func Default(c *fiber.Ctx) error {
	return c.SendString("JWT, Oauth will be set")
}

// TODO set CRUD handlers