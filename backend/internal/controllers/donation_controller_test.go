package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend-api/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetDonationStats_Empty(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/api/donations/stats", GetDonationStats)

	req, _ := http.NewRequest(http.MethodGet, "/api/donations/stats", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, float64(0), resp["total_donation"])
	assert.NotNil(t, resp["recent_donors"])
}

func TestGetDonationStats_WithData(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	project := models.Project{Title: "Project A", Slug: "project-a", Category: "web"}
	db.Create(&project)
	db.Create(&models.Donation{OrderID: "ORDER-1", ProjectID: project.ID, DonorName: "Budi", Amount: 50000, Status: "SUCCESS"})
	db.Create(&models.Donation{OrderID: "ORDER-2", ProjectID: project.ID, DonorName: "Ani", Amount: 25000, Status: "PENDING"})

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/api/donations/stats", GetDonationStats)

	req, _ := http.NewRequest(http.MethodGet, "/api/donations/stats", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, float64(50000), resp["total_donation"])
}

func TestHandleMidtransWebhook_Settlement(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	project := models.Project{Title: "Project B", Slug: "project-b", Category: "web"}
	db.Create(&project)
	db.Create(&models.Donation{OrderID: "DONASI-123", ProjectID: project.ID, Amount: 10000, Status: "PENDING"})

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/api/donations/webhook", HandleMidtransWebhook)

	payload := map[string]interface{}{
		"order_id":           "DONASI-123",
		"transaction_status": "settlement",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/donations/webhook", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var updated models.Donation
	db.Where("order_id = ?", "DONASI-123").First(&updated)
	assert.Equal(t, "SUCCESS", updated.Status)
}

func TestHandleMidtransWebhook_Cancel(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	project := models.Project{Title: "Project C", Slug: "project-c", Category: "web"}
	db.Create(&project)
	db.Create(&models.Donation{OrderID: "DONASI-456", ProjectID: project.ID, Amount: 15000, Status: "PENDING"})

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/api/donations/webhook", HandleMidtransWebhook)

	payload := map[string]interface{}{
		"order_id":           "DONASI-456",
		"transaction_status": "cancel",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/donations/webhook", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var updated models.Donation
	db.Where("order_id = ?", "DONASI-456").First(&updated)
	assert.Equal(t, "FAILED", updated.Status)
}

func TestHandleMidtransWebhook_OrderNotFound(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/api/donations/webhook", HandleMidtransWebhook)

	payload := map[string]interface{}{
		"order_id":           "TIDAK-ADA",
		"transaction_status": "settlement",
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "/api/donations/webhook", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestHandleMidtransWebhook_InvalidPayload(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/api/donations/webhook", HandleMidtransWebhook)

	req, _ := http.NewRequest(http.MethodPost, "/api/donations/webhook", bytes.NewBuffer([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestGetPublicLedger(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	project := models.Project{Title: "Project D", Slug: "project-d", Category: "web"}
	db.Create(&project)
	db.Create(&models.Donation{OrderID: "LD-001", ProjectID: project.ID, DonorName: "Citra", Amount: 100000, Status: "SUCCESS"})
	db.Create(&models.Expense{Amount: 30000, Notes: "Bayar hosting", Category: "operasional"})

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/api/donations/ledger", GetPublicLedger)

	req, _ := http.NewRequest(http.MethodGet, "/api/donations/ledger", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, float64(100000), resp["total_earnings"])
	assert.Equal(t, float64(30000), resp["total_used"])
	assert.Equal(t, float64(70000), resp["balance"])
}

func TestCreateExpenseHandler_Success(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/admin/expenses", CreateExpenseHandler)

	body, _ := json.Marshal(map[string]interface{}{
		"amount":   75000,
		"notes":    "Beli domain baru",
		"category": "infrastruktur",
	})

	req, _ := http.NewRequest(http.MethodPost, "/admin/expenses", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "success", resp["status"])
}

func TestCreateExpenseHandler_MissingFields(t *testing.T) {
	db := SetupTestDB(t)
	defer TeardownTestDB(db)

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/admin/expenses", CreateExpenseHandler)

	body, _ := json.Marshal(map[string]interface{}{
		"amount": 50000,
	})

	req, _ := http.NewRequest(http.MethodPost, "/admin/expenses", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}