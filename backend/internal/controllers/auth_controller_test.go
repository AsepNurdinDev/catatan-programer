package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"backend-api/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

func TestMain(m *testing.M) {
	os.Setenv("JWT_SECRET", "test-secret-key")
	m.Run()
}

func TestLogin_Success(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	hashed, _ := bcrypt.GenerateFromPassword([]byte("password123"), 10)
	db.Create(&models.User{Name: "Tester", Email: "test@example.com", Password: string(hashed)})

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/login", Login)

	body, _ := json.Marshal(map[string]string{
		"email":    "test@example.com",
		"password": "password123",
	})

	req, _ := http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, true, resp["success"])
	assert.NotEmpty(t, resp["token"])
}

func TestLogin_WrongEmail(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/login", Login)

	body, _ := json.Marshal(map[string]string{
		"email":    "notfound@example.com",
		"password": "whatever",
	})

	req, _ := http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "Email salah", resp["message"])
}

func TestLogin_WrongPassword(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	hashed, _ := bcrypt.GenerateFromPassword([]byte("correct"), 10)
	db.Create(&models.User{Name: "Tester", Email: "test2@example.com", Password: string(hashed)})

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/login", Login)

	body, _ := json.Marshal(map[string]string{
		"email":    "test2@example.com",
		"password": "wrong",
	})

	req, _ := http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "Password salah", resp["message"])
}

func TestLogin_EmptyBody(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/login", Login)

	req, _ := http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer([]byte("{}")))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
