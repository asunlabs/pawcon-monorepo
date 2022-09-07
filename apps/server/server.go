package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/asunlabs/pawcon-monorepo/server/src/feature/api"
)


func main() {
	app := fiber.New()
	
	app.Get("/", api.CollectionHandler)

	app.Listen(":3000")
}