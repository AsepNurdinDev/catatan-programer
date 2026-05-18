package main

import (
	"backend-api/internal/config"
	"backend-api/internal/routes"
	"backend-api/internal/seeders"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()

	router.MaxMultipartMemory = 8 << 20

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
			"http://localhost:3001",
			"https://asepblog.my.id",
		},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Authorization",
		},
	}))

	// static uploads
	router.Static("/uploads", "./uploads")

	// database
	config.ConnectDatabase()

	// seeder
	seeders.SeedAdmin()

	// routes
	routes.SetupRoutes(router)

	// run
	router.Run(":8000")
}
