package controllers

import (
	"backend-api/internal/config"
	"backend-api/internal/helpers"
	"backend-api/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {
	var input LoginInput

	c.ShouldBindJSON(&input)

	var user models.User

	if err := config.DB.
		Where("email = ?", input.Email).
		First(&user).Error; err != nil {

		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Email salah",
		})

		return
	}

	err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(input.Password),
	)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Password salah",
		})

		return
	}

	token, _ := helpers.GenerateToken(user.ID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"token":   token,
	})
}