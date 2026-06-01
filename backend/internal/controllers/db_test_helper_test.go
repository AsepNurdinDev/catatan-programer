package controllers

import (
	"testing"

	"backend-api/internal/config"
	"backend-api/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func SetupTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("gagal membuka test DB: %v", err)
	}

	db.AutoMigrate(
		&models.User{},
		&models.Post{},
		&models.Project{},
		&models.Donation{},
		&models.Expense{},
	)

	config.DB = db
	return db
}

// TeardownTestDB menutup koneksi SQLite setelah test selesai
func TeardownTestDB(db *gorm.DB) {
	sqlDB, _ := db.DB()
	sqlDB.Close()
}