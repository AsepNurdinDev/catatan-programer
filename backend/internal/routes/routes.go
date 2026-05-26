package routes

import (
	"backend-api/internal/controllers"
	"backend-api/internal/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	// ⚠️ PASANG CORS DI SINI SEBAGAI TAMENG UTAMA ROUTER GLOBAL
	router.Use(middlewares.CORSMiddleware())

	// home
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello World!",
		})
	})

	// auth
	router.POST("/login", controllers.Login)

	// public post
	router.GET("/posts", controllers.FindPost)
	router.GET("/posts/:id", controllers.FindPostById)

	// public project
	router.GET("/projects", controllers.FindProjects)
	router.GET("/projects/:slug", controllers.FindProjectBySlug)

	// public donation
	publicAPI := router.Group("/api")
	{
		publicAPI.POST("/donations", controllers.InitiateDonation)
		publicAPI.POST("/donations/webhook", controllers.HandleMidtransWebhook)
		publicAPI.GET("/donations/stats", controllers.GetDonationStats)
	}

	// admin group
	admin := router.Group("/admin")
	admin.Use(middlewares.AuthMiddleware())
	{
		// post management
		admin.POST("/posts", controllers.StorePost)
		admin.PUT("/posts/:id", controllers.UpdatePost)
		admin.DELETE("/posts/:id", controllers.DeletePost)

		// project management
		admin.POST("/projects", controllers.StoreProject)
		admin.PUT("/projects/:id", controllers.UpdateProject)
		admin.DELETE("/projects/:id", controllers.DeleteProject)

		// 🛠️ UPDATE & TAMBAHAN ENDPOINT MANAJEMEN KAS/DONASI DI SINI
		admin.GET("/donations", controllers.GetAdminDonationDashboard)
		admin.POST("/expenses", controllers.CreateExpenseHandler)
	}
}
