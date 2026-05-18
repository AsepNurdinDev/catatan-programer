package controllers

import (
	"backend-api/internal/config"
	"backend-api/internal/models"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type ValidatePostInput struct {
	Title   string `form:"title" binding:"required"`
	Content string `form:"content" binding:"required"`
}

type ErrorMsg struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

func GetErrorMsg(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "This field is required"
	}
	return "Unknown error"
}

func FindPost(c *gin.Context) {
	var posts []models.Post

	search := c.Query("search")

	query := config.DB

	if search != "" {
		query = query.Where(
			"title LIKE ? OR content LIKE ?",
			"%"+search+"%",
			"%"+search+"%",
		)
	}

	query.Find(&posts)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "List data posts",
		"data":    posts,
	})
}

func StorePost(c *gin.Context) {
	var input ValidatePostInput

	// bind form-data
	if err := c.ShouldBind(&input); err != nil {
		var ve validator.ValidationErrors

		if errors.As(err, &ve) {
			out := make([]ErrorMsg, len(ve))

			for i, fe := range ve {
				out[i] = ErrorMsg{
					Field:   fe.Field(),
					Message: GetErrorMsg(fe),
				}
			}

			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"errors": out,
			})

			return
		}
	}

	// ambil file image
	file, err := c.FormFile("image")

	var fileName string

	if err == nil {
		fileName = file.Filename

		// simpan file ke folder uploads
		err = c.SaveUploadedFile(file, "./uploads/"+fileName)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed upload image",
			})
			return
		}
	}

	post := models.Post{
		Title:   input.Title,
		Content: input.Content,
		Image:   fileName,
	}

	config.DB.Create(&post)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Post Created Successfully",
		"data":    post,
	})
}

func FindPostById(c *gin.Context) {
	var post models.Post

	if err := config.DB.Where("id = ?", c.Param("id")).First(&post).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Record not found!",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Detail Data Post By ID",
		"data":    post,
	})
}

func UpdatePost(c *gin.Context) {
	var post models.Post

	if err := config.DB.Where("id = ?", c.Param("id")).First(&post).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Record not found!",
		})
		return
	}

	var input ValidatePostInput

	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	file, err := c.FormFile("image")

	if err == nil {
		fileName := file.Filename

		err = c.SaveUploadedFile(file, "./uploads/"+fileName)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed upload image",
			})
			return
		}

		post.Image = fileName
	}

	post.Title = input.Title
	post.Content = input.Content

	config.DB.Save(&post)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Post Updated Successfully",
		"data":    post,
	})
}

func DeletePost(c *gin.Context) {
	var post models.Post

	if err := config.DB.Where("id = ?", c.Param("id")).First(&post).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Record not found!",
		})
		return
	}

	config.DB.Delete(&post)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Post Deleted Successfully",
	})
}
