package database

import (
	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	// Database connectivity API, used for controller CRUD
	Conn *gorm.DB
)

func Connect(schema interface{})  {
	db, err := gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	Conn = db

	if err != nil {
		color.Red("Connection failed")
		panic(fiber.StatusInternalServerError)
	} else {
		db.AutoMigrate(&schema)
		color.Green("Schema auto-migrated, DB connected")
	}
}