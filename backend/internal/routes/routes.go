package routes

import (
	"backend-api/internal/controllers"
	"backend-api/internal/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {

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

	// admin group
	admin := router.Group("/admin")
	admin.Use(middlewares.AuthMiddleware())

	{
		admin.POST("/posts", controllers.StorePost)
		admin.PUT("/posts/:id", controllers.UpdatePost)
		admin.DELETE("/posts/:id", controllers.DeletePost)
	}
}