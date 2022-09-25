package jsonwebtoken

import (
	"log"
	"github.com/asunlabs/pawcon-monorepo/server/src/app/database"
	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
)

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
	color.Cyan("user instance: ", user.Name, user.Email)

	if err := c.BodyParser(&user); err != nil {
		log.Panicf("struct binding failed: %s", err.Error())
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	db := database.Conn
	db.Create(&user)

	return c.SendStatus(fiber.StatusCreated)
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
