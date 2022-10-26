package database

import (
	"log"
	"os"
	"strings"

	"github.com/fatih/color"
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var (
	// Database connectivity API, used for controller CRUD
	Conn *gorm.DB
)


func Connect(schema []interface{}, _appType string)  {
	appType := []string{"production", "develop", "test"}

	isValidType := false
	
	for _, v := range appType {
		if v == strings.ToLower(_appType) {
			isValidType = true
			break
		}
	}

	if isValidType {
		switch _appType {
			case "production":
				_connect(schema)
			case "develop":
				_connect(schema)
			case "test":
				_connectForTest(schema)
		}
	}

	if !isValidType {
		log.Fatal("Database: Invalid app type")
	}
}

func _connect(schema []interface{}) {
	db, err := gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	Conn = db

	if err != nil {
		color.Red("Connection failed with err code: %d", fiber.StatusInternalServerError)
		os.Exit(1)
	} else {
		// iterate array in Go: for ~ range
		for _, v := range schema {
			db.AutoMigrate(v)
		}
		color.Green("Schema auto-migrated, DB connected")
	}
}

func _connectForTest(schema []interface{}) {
	testDB, err := gorm.Open(sqlite.Open("appTest.db"), &gorm.Config{})
	Conn = testDB

	if err != nil {
		color.Red(err.Error())
		os.Exit(1)
	}

	for _, v := range schema {
		testDB.AutoMigrate(v)
		color.Green("Test DB connected")
	}
}
