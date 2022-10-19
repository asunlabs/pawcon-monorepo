package database

import (
	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"os"
)

var (
	// Database connectivity API, used for controller CRUD
	Conn *gorm.DB
)

func Connect(schema []interface{}) {
	db, err := gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	Conn = db

	if err != nil {
		color.Red("Connection failed with err code: %d", fiber.StatusInternalServerError)
		/*
			Exit causes the current program to exit with the given status code.
			Conventionally, code zero indicates success, non-zero an error.
		*/
		os.Exit(1)
	} else {
		// iterate array in Go: for ~ range
		for _, v := range schema {
			db.AutoMigrate(v)
		}
		color.Green("Schema auto-migrated, DB connected")
	}
}
