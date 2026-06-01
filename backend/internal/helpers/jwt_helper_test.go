package helpers_test

import (
	"os"
	"testing"

	"backend-api/internal/helpers"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

func TestGenerateToken_Success(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret-key")
	token, err := helpers.GenerateToken(1)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)
}

func TestGenerateToken_ValidClaims(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret-key")

	userID := uint(42)
	tokenStr, err := helpers.GenerateToken(userID)
	assert.NoError(t, err)

	// Baca secret dari env langsung, tidak perlu helpers.SECRET_KEY
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	assert.NoError(t, err)
	assert.True(t, token.Valid)

	claims, ok := token.Claims.(jwt.MapClaims)
	assert.True(t, ok)
	assert.Equal(t, float64(userID), claims["user_id"])
}

func TestGenerateToken_DifferentUsers(t *testing.T) {
	os.Setenv("JWT_SECRET", "test-secret-key")
	token1, _ := helpers.GenerateToken(1)
	token2, _ := helpers.GenerateToken(2)
	assert.NotEqual(t, token1, token2)
}
