package jsonwebtoken

import (
	"log"
	"github.com/asunlabs/pawcon-monorepo/server/src/app/database"
	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
)

// return 0 if no err
func useErrorCallback(c *fiber.Ctx, err error) int {
	log.Printf("Request coming from: %s %v", c.Request().URI(), color.BgCyan)
	var status int
	if err != nil { 
		status = fiber.StatusInternalServerError
	}
	status = 0

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

	status := useErrorCallback(c, result.Error)

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
	db.Delete(&user, id)
	return c.SendStatus(fiber.StatusOK)
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
	db.Find(&user, email)

	return c.SendStatus(fiber.StatusOK)
}

func HandleJwtSignOut(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusOK)
}

func GetUserByID(c *fiber.Ctx) error {
	db := database.Conn
	id := c.Params("id")
	user := new(database.User)

	db.Find(&user, id)
	return c.JSON(&user)
}

func UpdateUserByID(c *fiber.Ctx) error {
	db := database.Conn
	user := new(database.User)

	c.BodyParser(&user)
	db.Model(&user).Updates(map[string]interface{}{ "firstname": user.Firstname, "email": user.Email})

	return c.SendStatus(fiber.StatusOK)
}