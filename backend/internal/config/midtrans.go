package config

import (
	"os"
	"strconv"

	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
)

var SnapClient snap.Client

func InitMidtrans() {
	serverKey := os.Getenv("MIDTRANS_SERVER_KEY")
	isProdStr := os.Getenv("MIDTRANS_IS_PRODUCTION")

	isProduction, err := strconv.ParseBool(isProdStr)
	if err != nil {
		isProduction = false
	}

	// Tentukan environment (Sandbox atau Production)
	var env midtrans.EnvironmentType = midtrans.Sandbox
	if isProduction {
		env = midtrans.Production
	}

	// Inisialisasi Snap Client resmi dari Midtrans
	SnapClient.New(serverKey, env)
}
