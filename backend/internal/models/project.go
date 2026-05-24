package models

import "time"

type Project struct {
	ID          uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Title       string    `json:"title" gorm:"not null"`
	Slug        string    `json:"slug" gorm:"unique;not null"`
	Description string    `json:"description"`
	Content     string    `json:"content" gorm:"type:text"`
	Image       string    `json:"image"`
	TechStack   string    `json:"tech_stack"`
	GithubURL   string    `json:"github_url"`
	LiveURL     string    `json:"live_url"`
	Thumbnail   string    `json:"thumbnail"`
	Category    string    `json:"category"`
	IsFeatured  bool      `json:"is_featured" gorm:"default:false"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
