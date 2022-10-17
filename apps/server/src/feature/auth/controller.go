package auth

import (
	"github.com/asunlabs/pawcon-monorepo/server/src/app/database"
	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	"log"
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

	if reqType == "post" {
		status = fiber.StatusCreated
	}

	if reqType == "get" || reqType == "delete" {
		status = fiber.StatusOK
	}

	if reqType == "put" {
		status = fiber.StatusNoContent // 204
	}

	return status
}

/*
* Authentication package:
1) HandleSignUp
3) HandleSignClose
2) HandleSignIn
4) HandleSignOut
*/

func HandleJwtSignUp(c *fiber.Ctx) error {
	log.Printf("client sent: %s", string(c.Request().Body()))
	allParams := c.AllParams()

	color.Blue("params from client: ", allParams)

	/*
		TODO User signup validation
		* 1) email duplicates
		* 2) password hashing with jwt
		* 3) data transfer object
	*/
	user := new(database.User)

	if err := c.BodyParser(&user); err != nil {
		log.Panicf("struct binding failed: %s", err.Error())
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	db := database.Conn
	result := db.Create(&user)

	status := useErrorCallback(c, result.Error, "post")

	return c.SendStatus(status)
}

func HandleJwtSignClose(c *fiber.Ctx) error {
	db := database.Conn
	id := c.Params("id")

	/*
		* pointer = new(type)
		The new built-in function allocates memory. The first argument is a type,
		not a value, and the value returned is a pointer to a newly
		allocated zero value of that type.
	*/
	user := new(database.User)

	/* db.Delete: Delete delete value match given conditions,
	if the value has primary key, then will including the primary key as condition
	*/
	result := db.Delete(&user, id)

	status := useErrorCallback(c, result.Error, "delete")
	return c.SendStatus(status)
}

/*
* User signin validation
* 1) data transfer object
* 2) password comparison from DB
 */
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

	if err := c.BodyParser(&user); err != nil {
		return err
	}

	result := db.Model(&user).Updates(map[string]interface{}{
		"firstname": user.Firstname,
		"lastname":  user.Lastname,
		"email":     user.Email,
		"username":  user.Username})

	status := useErrorCallback(c, result.Error, "put")

	return c.SendStatus(status)
}