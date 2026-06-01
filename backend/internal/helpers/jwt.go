package helpers

import (
    "os"
    "time"

    "github.com/golang-jwt/jwt/v5"
)

func getSecretKey() []byte {
    secret := os.Getenv("JWT_SECRET")
    if secret == "" {
        panic("JWT_SECRET tidak di-set di environment!")
    }
    return []byte(secret)
}

func GenerateToken(userId uint) (string, error) {
    claims := jwt.MapClaims{
        "user_id": userId,
        "exp":     time.Now().Add(time.Hour * 24).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(getSecretKey())
}