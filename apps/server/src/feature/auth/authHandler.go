package auth

import "github.com/gofiber/fiber/v2"

func AuthHandler(c *fiber.Ctx) error {
	return c.SendString("JWT, Oauth will be set")
}