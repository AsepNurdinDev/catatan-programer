package models

import "time"

type Donation struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	OrderID   string    `json:"order_id" gorm:"type:varchar(100);unique;not null"`
	ProjectID uint      `json:"project_id" gorm:"not null"`
	DonorName string    `json:"donor_name" gorm:"type:varchar(100);default:'Anonim'"`
	Amount    int64     `json:"amount" gorm:"not null"`
	Status    string    `json:"status" gorm:"type:varchar(20);default:'PENDING'"`
	SnapToken string    `json:"snap_token,omitempty" gorm:"type:varchar(255)"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Project *Project `json:"project,omitempty" gorm:"foreignKey:ProjectID"`
}
