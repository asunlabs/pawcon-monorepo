package auth

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name string `json:"name"`
	Email string `json:"email"`
}

func UserModel() *User {
	return &User{}
}