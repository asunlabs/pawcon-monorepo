package api

import "github.com/gofiber/fiber/v2"

type CollectionItem struct {
	Title string
}

func CollectionHandler(c *fiber.Ctx) error {
	collectionItemTest := CollectionItem {
		Title: "test collection item",
	}
	return c.JSON(collectionItemTest)
}