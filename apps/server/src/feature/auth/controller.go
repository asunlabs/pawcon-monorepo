package auth

import (
	"log"
	"github.com/asunlabs/pawcon-monorepo/server/src/app/database"
	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
)

func validateMethodType(reqType string) bool {
	var isValid bool = false
	allowedMethods := []string{"get", "delete", "post", "put"}

	for _, v := range allowedMethods {
		if reqType == v {
			isValid = true
			break
		}
	}

	return isValid
}

// return 0 if no err
func useErrorCallback(c *fiber.Ctx, err error, reqType string) int {

	isValid := validateMethodType(reqType)

	if !isValid {
		log.Fatalf("Invalid HTTP request")
	}

	log.Printf("Request coming from: %s %v", c.Request().URI(), color.BgCyan)
	var status int

	if err != nil {
		status = fiber.StatusInternalServerError
	}

	switch reqType {
		case "post":
			status = fiber.StatusCreated
		case "get":
			status = fiber.StatusOK
		case "delete":
			status = fiber.StatusNoContent
		case "put":
			status = fiber.StatusNoContent
	}

	return status
}

func HandleJwtSignUp(c *fiber.Ctx) error {
	log.Printf("client sent: %s", string(c.Request().Body()))
	// pointer
	user := new(database.User)

	if err := c.BodyParser(user); err != nil {
		log.Panicf("struct binding failed: %s", err.Error())
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	db := database.Conn
	result := db.Create(user)

	status := useErrorCallback(c, result.Error, "post")

	return c.SendStatus(status)
}

// @dev GORM soft delete
func HandleJwtAccountClose(c *fiber.Ctx) error {
	db := database.Conn
	id := c.Params("id")

	user := new(database.User)

	result := db.Delete(&user, id)

	status := useErrorCallback(c, result.Error, "delete")
	return c.SendStatus(status)
}

func HandleJwtSignIn(c *fiber.Ctx) error {

	db := database.Conn
	email := c.Params("email")
	user := new(database.User)

	result := db.First(&user, email)

	status := useErrorCallback(c, result.Error, "get")
	return c.SendStatus(status)
}

func HandleJwtSignOut(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusOK)
}

func GetUserByID(c *fiber.Ctx) error {
	db := database.Conn
	id := c.Params("id")
	user := new(database.User)

	result := db.First(&user, id)
	status := useErrorCallback(c, result.Error, "get")

	if status != fiber.StatusOK {
		return result.Error
	}

	return c.JSON(&user)
}

func UpdateUserByID(c *fiber.Ctx) error {
	db := database.Conn
	user := new(database.User)
	id := c.Params("id")

	if err := c.BodyParser(user); err != nil {
		return err
	}

	result := db.Model(&user).Where("id = ?", id).Updates(map[string]interface{}{
		"firstname": user.Firstname,
		"lastname":  user.Lastname,
		"email":     user.Email,
		"username":  user.Username})

	status := useErrorCallback(c, result.Error, "put")

	return c.SendStatus(status)
}
