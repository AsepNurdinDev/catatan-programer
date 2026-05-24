package controllers

import (
	"backend-api/internal/config"
	"backend-api/internal/models"
	"errors"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/gosimple/slug"
)

type ValidateProjectInput struct {
	Title       string `form:"title" binding:"required"`
	Description string `form:"description" binding:"required"`
	Content     string `form:"content" binding:"required"`
	TechStack   string `form:"tech_stack"`
	GithubURL   string `form:"github_url"`
	LiveURL     string `form:"live_url"`
	Category    string `form:"category" binding:"required"`
	IsFeatured  bool   `form:"is_featured"`
}

// GET /projects
func FindProjects(c *gin.Context) {
	var projects []models.Project

	category := c.Query("category")
	search := c.Query("search")

	query := config.DB

	if category != "" {
		query = query.Where("category = ?", category)
	}

	if search != "" {
		query = query.Where("title LIKE ? OR description LIKE ?",
			"%"+search+"%",
			"%"+search+"%",
		)
	}

	query.Order("is_featured DESC, created_at DESC").Find(&projects)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "List data projects",
		"data":    projects,
	})
}

// GET /projects/:slug
func FindProjectBySlug(c *gin.Context) {
	var project models.Project

	if err := config.DB.Where("slug = ?", c.Param("slug")).First(&project).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Project tidak ditemukan!",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Detail project",
		"data":    project,
	})
}

// POST /admin/projects
func StoreProject(c *gin.Context) {
	var input ValidateProjectInput

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
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"errors": out})
			return
		}
	}

	// Generate slug dari title
	projectSlug := slug.Make(input.Title)

	// Handle image upload
	file, err := c.FormFile("image")
	var fileName string
	if err == nil {
		// Validasi tipe file
		ext := strings.ToLower(filepath.Ext(file.Filename))
		allowed := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".webp": true}
		if !allowed[ext] {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Tipe file tidak diizinkan"})
			return
		}

		// Validasi ukuran file (max 5MB)
		if file.Size > 5<<20 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Ukuran file maksimal 5MB"})
			return
		}

		fileName = file.Filename
		if err := c.SaveUploadedFile(file, "./uploads/"+fileName); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal upload gambar"})
			return
		}
	}

	project := models.Project{
		Title:       input.Title,
		Slug:        projectSlug,
		Description: input.Description,
		Content:     input.Content,
		Image:       fileName,
		TechStack:   input.TechStack,
		GithubURL:   input.GithubURL,
		LiveURL:     input.LiveURL,
		Category:    input.Category,
		IsFeatured:  input.IsFeatured,
	}

	config.DB.Create(&project)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Project berhasil dibuat",
		"data":    project,
	})
}

// PUT /admin/projects/:id
func UpdateProject(c *gin.Context) {
	var project models.Project

	if err := config.DB.Where("id = ?", c.Param("id")).First(&project).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Project tidak ditemukan!",
		})
		return
	}

	var input ValidateProjectInput
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Handle image upload jika ada
	file, err := c.FormFile("image")
	if err == nil {
		ext := strings.ToLower(filepath.Ext(file.Filename))
		allowed := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".webp": true}
		if !allowed[ext] {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Tipe file tidak diizinkan"})
			return
		}

		if file.Size > 5<<20 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Ukuran file maksimal 5MB"})
			return
		}

		fileName := file.Filename
		if err := c.SaveUploadedFile(file, "./uploads/"+fileName); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal upload gambar"})
			return
		}
		project.Image = fileName
	}

	project.Title       = input.Title
	project.Slug        = slug.Make(input.Title)
	project.Description = input.Description
	project.Content     = input.Content
	project.TechStack   = input.TechStack
	project.GithubURL   = input.GithubURL
	project.LiveURL      = input.LiveURL
	project.Category    = input.Category
	project.IsFeatured  = input.IsFeatured

	config.DB.Save(&project)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Project berhasil diupdate",
		"data":    project,
	})
}

// DELETE /admin/projects/:id
func DeleteProject(c *gin.Context) {
	var project models.Project

	if err := config.DB.Where("id = ?", c.Param("id")).First(&project).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   "Project tidak ditemukan!",
		})
		return
	}

	config.DB.Delete(&project)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Project berhasil dihapus",
	})
}