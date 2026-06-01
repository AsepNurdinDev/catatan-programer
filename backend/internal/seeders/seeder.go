package seeders

import (
    "backend-api/internal/config"
    "backend-api/internal/models"
    "os"

    "golang.org/x/crypto/bcrypt"
)

func SeedAdmin() {
    var user models.User

    config.DB.Where("email = ?", "admin@gmail.com").First(&user)

    if user.ID == 0 {
        adminPassword := os.Getenv("ADMIN_PASSWORD")
        if adminPassword == "" {
            adminPassword = "changeme_segera"
        }

        hash, _ := bcrypt.GenerateFromPassword([]byte(adminPassword), 10)

        admin := models.User{
            Name:     "Admin",
            Email:    "admin@gmail.com",
            Password: string(hash),
        }

        config.DB.Create(&admin)
    }
}