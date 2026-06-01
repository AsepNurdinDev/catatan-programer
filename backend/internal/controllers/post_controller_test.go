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

func TestFindPost_Empty(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/posts", FindPost)

	req, _ := http.NewRequest(http.MethodGet, "/posts", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, true, resp["success"])
}

func TestFindPost_WithSearch(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	db.Create(&models.Post{Title: "Tutorial Golang", Content: "Isi konten"})
	db.Create(&models.Post{Title: "Belajar React", Content: "Konten react"})

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/posts", FindPost)

	req, _ := http.NewRequest(http.MethodGet, "/posts?search=Golang", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	data := resp["data"].([]interface{})
	assert.Equal(t, 1, len(data))
}

func TestFindPostById_Found(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	post := models.Post{Title: "Post A", Content: "Konten A"}
	db.Create(&post)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/posts/:id", FindPostById)

	req, _ := http.NewRequest(http.MethodGet, fmt.Sprintf("/posts/%d", post.Id), nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestFindPostById_NotFound(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/posts/:id", FindPostById)

	req, _ := http.NewRequest(http.MethodGet, "/posts/9999", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestDeletePost_Success(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	post := models.Post{Title: "Hapus Ini", Content: "Isi"}
	db.Create(&post)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.DELETE("/posts/:id", DeletePost)

	req, _ := http.NewRequest(http.MethodDelete, fmt.Sprintf("/posts/%d", post.Id), nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestDeletePost_NotFound(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.DELETE("/posts/:id", DeletePost)

	req, _ := http.NewRequest(http.MethodDelete, "/posts/9999", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestStorePost_MissingTitle(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/posts", StorePost)

	body := bytes.NewBufferString("content=isi")
	req, _ := http.NewRequest(http.MethodPost, "/posts", body)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}