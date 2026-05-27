package controllers

import (
	"backend-api/internal/config"
	"backend-api/internal/models"
	"fmt"
	"net/http"
	"sort"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
)

type DonationInput struct {
	ProjectID uint   `json:"project_id" binding:"required"`
	DonorName string `json:"donor_name"`
	Amount    int64  `json:"amount" binding:"required,min=1000"` // Minimal donasi Rp 1.000 di Midtrans
}

// POST /api/donations
func InitiateDonation(c *gin.Context) {
	var input DonationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Generate Order ID unik
	orderID := fmt.Sprintf("DONASI-%d", time.Now().UnixNano())

	// Jika nama donatur kosong, set default jadi Anonim
	if input.DonorName == "" {
		input.DonorName = "Anonim"
	}

	// 2. Siapkan parameter permintaan ke Midtrans Snap
	snapReq := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  orderID,
			GrossAmt: input.Amount,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: input.DonorName,
		},
	}

	// 3. Minta token ke Midtrans
	snapResp, err := config.SnapClient.CreateTransaction(snapReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat transaksi ke Midtrans: " + err.Error()})
		return
	}

	// 4. Simpan data transaksi berstatus PENDING ke database kita
	// (Asumsi config.DB adalah instance GORM kamu)
	donation := models.Donation{
		OrderID:   orderID,
		ProjectID: input.ProjectID,
		DonorName: input.DonorName,
		Amount:    input.Amount,
		Status:    "PENDING",
		SnapToken: snapResp.Token,
	}

	// Simpan ke DB
	// Jika kamu tidak pakai GORM, silakan ganti bagian ini dengan query SQL biasa (INSERT INTO...)
	if err := config.DB.Create(&donation).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data donasi ke DB: " + err.Error()})
		return
	}

	// 5. Kembalikan snap_token dan order_id ke Next.js
	c.JSON(http.StatusOK, gin.H{
		"message":    "Transaksi berhasil diinisiasi",
		"snap_token": snapResp.Token,
		"order_id":   orderID,
	})
}

// POST /api/donations/webhook
func HandleMidtransWebhook(c *gin.Context) {
	// Midtrans akan mengirimkan data dalam format JSON
	var notificationPayload map[string]interface{}

	if err := c.ShouldBindJSON(&notificationPayload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payload tidak valid"})
		return
	}

	// 1. Ambil data penting dari payload Midtrans
	orderID, ok1 := notificationPayload["order_id"].(string)
	transactionStatus, ok2 := notificationPayload["transaction_status"].(string)

	if !ok1 || !ok2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format payload Midtrans tidak sesuai"})
		return
	}

	// 2. Cari data donasi berdasarkan order_id di database kita
	var donation models.Donation
	if err := config.DB.Where("order_id = ?", orderID).First(&donation).Error; err != nil {
		// Jika order ID tidak ditemukan di DB kita
		c.JSON(http.StatusNotFound, gin.H{"error": "Data transaksi tidak ditemukan"})
		return
	}

	// 3. Tentukan status akhir berdasarkan logika respon Midtrans
	// 'settlement' artinya pembayaran berhasil dan uang sudah masuk
	// 'pending' artinya user belum bayar atau menunda pembayaran
	// 'expire' atau 'cancel' artinya user membatalkan atau waktu bayar habis
	var finalStatus string
	if transactionStatus == "settlement" || transactionStatus == "capture" {
		finalStatus = "SUCCESS"
	} else if transactionStatus == "pending" {
		finalStatus = "PENDING"
	} else if transactionStatus == "deny" || transactionStatus == "expire" || transactionStatus == "cancel" {
		finalStatus = "FAILED"
	}

	// 4. Update status donasi di database jika ada perubahan status
	if finalStatus != "" && donation.Status != finalStatus {
		err := config.DB.Model(&donation).Update("status", finalStatus).Error
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui status di database"})
			return
		}
	}

	// 5. Selalu kembalikan respon HTTP 200 OK ke Midtrans sebagai tanda sukses menerima laporan
	c.JSON(http.StatusOK, gin.H{"message": "Webhook Midtrans berhasil diproses"})
}

// Struct untuk membungkus data riwayat donatur yang bersih
type RecentDonorRes struct {
	DonorName string    `json:"donor_name"`
	Amount    int64     `json:"amount"`
	CreatedAt time.Time `json:"created_at"`
}

// 1. GET /api/donations/stats (Untuk Transparansi Halaman Publik User)
func GetDonationStats(c *gin.Context) {
	var totalAmount int64
	var recentDonors []RecentDonorRes

	// Query A: Hitung total uang dari donasi yang statusnya SUCCESS
	config.DB.Model(&models.Donation{}).
		Where("status = ?", "SUCCESS").
		Select("COALESCE(SUM(amount), 0)").
		Row().Scan(&totalAmount)

	// Query B: Ambil 5 donatur terakhir yang sukses bayar
	config.DB.Model(&models.Donation{}).
		Where("status = ?", "SUCCESS").
		Order("created_at DESC").
		Limit(5).
		Select("donor_name, amount, created_at").
		Scan(&recentDonors)

	c.JSON(http.StatusOK, gin.H{
		"total_donation": totalAmount,
		"recent_donors":  recentDonors,
	})
}

// 2. GET /api/admin/donations/dashboard (Untuk Ringkasan Statistik di Dashboard Admin)
// Struct gabungan untuk mutasi (IN & OUT)
type MutationEntry struct {
	ID           uint      `json:"id"`
	Type         string    `json:"type"` // "IN" atau "OUT"
	Amount       float64   `json:"amount"`
	DonorName    string    `json:"donor_name,omitempty"`
	ProjectTitle string    `json:"project_title,omitempty"`
	Notes        string    `json:"notes"`
	Category     string    `json:"category,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}

func GetAdminDonationDashboard(c *gin.Context) {
	var mutations []MutationEntry

	// Query donasi masuk (IN) yang SUCCESS
	var donations []models.Donation
	config.DB.Preload("Project").Where("status = ?", "SUCCESS").Order("created_at DESC").Find(&donations)
	for _, d := range donations {
		projectTitle := ""
		if d.Project != nil {
			projectTitle = d.Project.Title // sesuaikan dengan field di model Project kamu
		}
		mutations = append(mutations, MutationEntry{
			ID:           d.ID,
			Type:         "IN",
			Amount:       float64(d.Amount),
			DonorName:    d.DonorName,
			ProjectTitle: projectTitle,
			Notes:        "Donasi via QRIS Midtrans",
			CreatedAt:    d.CreatedAt,
		})
	}

	// Query pengeluaran (OUT)
	var expenses []models.Expense
	config.DB.Order("created_at DESC").Find(&expenses)
	for _, e := range expenses {
		mutations = append(mutations, MutationEntry{
			ID:        e.ID,
			Type:      "OUT",
			Amount:    e.Amount,
			Notes:     e.Notes,
			Category:  e.Category,
			CreatedAt: e.CreatedAt,
		})
	}

	// Sort gabungan by created_at DESC
	sort.Slice(mutations, func(i, j int) bool {
		return mutations[i].CreatedAt.After(mutations[j].CreatedAt)
	})

	// Hitung statistik
	var totalIn, totalOut float64
	for _, m := range mutations {
		if m.Type == "IN" {
			totalIn += m.Amount
		} else {
			totalOut += m.Amount
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"data":           mutations,
		"total_earnings": totalIn,
		"total_used":     totalOut,
		"balance":        totalIn - totalOut,
	})
}

type ExpenseInput struct {
	Amount          float64 `json:"amount" binding:"required,gt=0"`
	Notes           string  `json:"notes" binding:"required"`
	ExpenseCategory string  `json:"category"`
}

// GET /api/donations/ledger (Publik, tanpa auth)
func GetPublicLedger(c *gin.Context) {
    var mutations []MutationEntry

    var donations []models.Donation
    config.DB.Preload("Project").Where("status = ?", "SUCCESS").Order("created_at DESC").Find(&donations)
    for _, d := range donations {
        projectTitle := ""
        if d.Project != nil {
            projectTitle = d.Project.Title
        }
        mutations = append(mutations, MutationEntry{
            ID:           d.ID,
            Type:         "IN",
            Amount:       float64(d.Amount),
            DonorName:    d.DonorName,
            ProjectTitle: projectTitle,
            Notes:        "Donasi via QRIS Midtrans",
            CreatedAt:    d.CreatedAt,
        })
    }

    var expenses []models.Expense
    config.DB.Order("created_at DESC").Find(&expenses)
    for _, e := range expenses {
        mutations = append(mutations, MutationEntry{
            ID:        e.ID,
            Type:      "OUT",
            Amount:    e.Amount,
            Notes:     e.Notes,
            Category:  e.Category,
            CreatedAt: e.CreatedAt,
        })
    }

    sort.Slice(mutations, func(i, j int) bool {
        return mutations[i].CreatedAt.After(mutations[j].CreatedAt)
    })

    var totalIn, totalOut float64
    for _, m := range mutations {
        if m.Type == "IN" {
            totalIn += m.Amount
        } else {
            totalOut += m.Amount
        }
    }

    c.JSON(http.StatusOK, gin.H{
        "data":           mutations,
        "total_earnings": totalIn,
        "total_used":     totalOut,
        "balance":        totalIn - totalOut,
    })
}

// CreateExpenseHandler mencatat pengeluaran uang kas/donasi
func CreateExpenseHandler(c *gin.Context) {
	var input ExpenseInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	// Ambil kategori dari body (opsional, default "other")
	category := input.ExpenseCategory
	if category == "" {
		category = "other"
	}

	// Simpan ke DB
	expense := models.Expense{
		Amount:   input.Amount,
		Notes:    input.Notes,
		Category: input.ExpenseCategory, // lihat struct update di bawah
	}
	if err := config.DB.Create(&expense).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Gagal menyimpan pengeluaran"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Pengeluaran berhasil dicatat",
		"data":    expense,
	})
}
