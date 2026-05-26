package config

import (
	"fmt"
	"log"
	"os"

	"backend-api/internal/models"

	"github.com/joho/godotenv"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Peringatan: File .env fisik tidak ditemukan, membaca environment langsung dari sistem container/Docker.")
	}

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// format dsn mysql
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?parseTime=true",
		dbUser,
		dbPass,
		dbHost,
		dbPort,
		dbName,
	)

	// koneksi database
	database, err := gorm.Open(
		mysql.Open(dsn),
		&gorm.Config{},
	)

	if err != nil {
		panic("Gagal konek ke database")
	}

	// migrate
	database.AutoMigrate(
		&models.Post{},
		&models.User{},
		&models.Project{},
		&models.Donation{},
	)

	DB = database

	fmt.Println("Database connected")
}
