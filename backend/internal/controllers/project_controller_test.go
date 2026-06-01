package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend-api/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestFindProjects_Empty(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/projects", FindProjects)

	req, _ := http.NewRequest(http.MethodGet, "/projects", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, true, resp["success"])
}

func TestFindProjects_FilterByCategory(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	db.Create(&models.Project{Title: "App Mobile", Slug: "app-mobile", Category: "mobile"})
	db.Create(&models.Project{Title: "Web Dashboard", Slug: "web-dashboard", Category: "web"})

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/projects", FindProjects)

	req, _ := http.NewRequest(http.MethodGet, "/projects?category=web", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	data := resp["data"].([]interface{})
	assert.Equal(t, 1, len(data))
}

func TestFindProjects_FilterBySearch(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	db.Create(&models.Project{Title: "Sistem Presensi", Slug: "sistem-presensi", Description: "Sistem absensi", Category: "web"})
	db.Create(&models.Project{Title: "Blog Personal", Slug: "blog-personal", Description: "Blog saya", Category: "web"})

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/projects", FindProjects)

	req, _ := http.NewRequest(http.MethodGet, "/projects?search=Presensi", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	data := resp["data"].([]interface{})
	assert.Equal(t, 1, len(data))
}

func TestFindProjectBySlug_Found(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	db.Create(&models.Project{Title: "Portfolio", Slug: "portfolio", Category: "web"})

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/projects/:slug", FindProjectBySlug)

	req, _ := http.NewRequest(http.MethodGet, "/projects/portfolio", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestFindProjectBySlug_NotFound(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/projects/:slug", FindProjectBySlug)

	req, _ := http.NewRequest(http.MethodGet, "/projects/tidak-ada", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestDeleteProject_Success(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	project := models.Project{Title: "Hapus Project", Slug: "hapus-project", Category: "web"}
	db.Create(&project)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.DELETE("/admin/projects/:id", DeleteProject)

	req, _ := http.NewRequest(http.MethodDelete, fmt.Sprintf("/admin/projects/%d", project.ID), nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestDeleteProject_NotFound(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.DELETE("/admin/projects/:id", DeleteProject)

	req, _ := http.NewRequest(http.MethodDelete, "/admin/projects/9999", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestStoreProject_MissingFields(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/admin/projects", StoreProject)

	body := bytes.NewBufferString("title=Test+Project")
	req, _ := http.NewRequest(http.MethodPost, "/admin/projects", body)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}