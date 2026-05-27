package models

import "time"

type Expense struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Amount    float64   `json:"amount" gorm:"not null"`
	Notes     string    `json:"notes" gorm:"type:varchar(255);not null"`
	Category  string    `json:"category" gorm:"type:varchar(100);default:'other'"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}