# 📝 Catatan Programmer

> A modern personal tech blog built with Next.js and Go (Gin), deployed with Docker and Cloudflare Tunnel.

## 🌐 Live Demo

- **Frontend:** [https://asepblog.my.id](https://asepblog.my.id)
- **API:** [https://api.asepblog.my.id](https://api.asepblog.my.id)

---

## 📌 Features

- 📖 Read articles with estimated read time
- 🔍 Search articles by title or content
- 🌙 Dark mode support
- 📱 Fully responsive (mobile-friendly)
- 🔐 Admin dashboard with JWT authentication
- 🖼️ Image upload for each article
- ✏️ Create, edit, and delete articles
- 🚀 Deployed via Docker + Cloudflare Tunnel

---

## 🏗️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16 | React framework (SSR + CSR) |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3 | Styling |
| next-themes | latest | Dark mode |
| sonner | latest | Toast notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Go (Golang) | 1.23 | Backend language |
| Gin | latest | HTTP web framework |
| GORM | latest | ORM for database |
| JWT | latest | Authentication |
| gin-contrib/cors | latest | CORS middleware |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerization |
| Cloudflare Tunnel | Expose server without open port |
| MariaDB / MySQL | Database |
| Ubuntu Server | Hosting |

---

## 📁 Project Structure

```
catatan-programmer/
├── backend/                  # Go (Gin) API
│   ├── cmd/
│   │   └── main.go           # Entry point
│   ├── internal/
│   │   ├── config/           # Database connection
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # JWT auth middleware
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   └── seeders/          # Database seeders
│   ├── uploads/              # Uploaded images
│   ├── .env                  # Environment variables (not committed)
│   ├── Dockerfile
│   └── go.mod
│
├── frontend/                 # Next.js App
│   ├── app/
│   │   ├── admin/
│   │   │   ├── create/       # Create article page
│   │   │   ├── dashboard/    # Admin dashboard
│   │   │   └── edit/[id]/    # Edit article page
│   │   ├── components/
│   │   │   ├── SearchInput   # Search component
│   │   │   └── ThemeToggle   # Dark mode toggle
│   │   ├── posts/[id]/       # Article detail page
│   │   ├── login/            # Admin login page
│   │   └── page.tsx          # Home page
│   ├── src/
│   │   ├── services/
│   │   │   └── api.ts        # API service functions
│   │   └── utils/
│   │       └── dateAndReadTime.ts
│   ├── .env.local            # Environment variables (not committed)
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [Go](https://golang.org/) >= 1.23
- [pnpm](https://pnpm.io/) 
- [Docker](https://www.docker.com/) & Docker Compose
- MySQL / MariaDB

---

### 1. Clone Repository

```bash
git clone https://github.com/AsepNurdinDev/catatan-programmer.git
cd catatan-programmer
```

### 2. Setup Backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit sesuai konfigurasi database kamu
nano .env
```

Isi `.env`:
```env
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=db_go_api
JWT_SECRET=your_random_secret_32_chars
PORT=8000
```

### 3. Setup Frontend

```bash
cd frontend

# Copy environment file
cp .env.example .env.local

# Edit sesuai environment kamu
nano .env.local
```

Isi `.env.local`:
```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:8000
API_URL_SERVER=http://localhost:8000

# Production (ganti dengan domain kamu)
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
# API_URL_SERVER=http://backend:8000
```

### 4. Run Development

**Backend:**
```bash
cd backend
go run ./cmd/main.go
```

**Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
```

Akses di:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

---

## 🐳 Run with Docker

### Development / Local

```bash
# Build dan jalankan semua service
docker compose up -d --build

# Cek status container
docker ps

# Lihat logs
docker logs journal-backend
docker logs journal-frontend
```

### Production

1. Update `docker-compose.yml` dengan domain production:

```yaml
frontend:
  build:
    args:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
  environment:
    - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
    - API_URL_SERVER=http://backend:8000
```

2. Build dan jalankan:

```bash
docker compose up -d --build
```

---

## 🌐 Deployment (Cloudflare Tunnel)

### Prerequisites
- Ubuntu Server
- Domain aktif di Cloudflare
- `cloudflared` terinstall di server

### Setup Tunnel

```bash
# Login ke Cloudflare
cloudflared tunnel login

# Buat tunnel
cloudflared tunnel create blog-tunnel

# Buat config
sudo nano /etc/cloudflared/config.yml
```

```yaml
tunnel: blog-tunnel
credentials-file: /etc/cloudflared/TUNNEL_ID.json

ingress:
  - hostname: yourdomain.com
    service: http://localhost:3001

  - hostname: api.yourdomain.com
    service: http://localhost:8000

  - service: http_status:404
```

```bash
# Daftarkan DNS
cloudflared tunnel route dns blog-tunnel yourdomain.com
cloudflared tunnel route dns blog-tunnel api.yourdomain.com

# Jalankan sebagai service
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

---

## 🔌 API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | `/posts` | Get all articles |
| GET | `/posts?search=keyword` | Search articles |
| GET | `/posts/:id` | Get article by ID |
| POST | `/login` | Admin login |

### Protected (Requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/posts` | Create article |
| PUT | `/admin/posts/:id` | Update article |
| DELETE | `/admin/posts/:id` | Delete article |

### Static Files
| Path | Description |
|---|---|
| `/uploads/:filename` | Serve uploaded images |

---

## 🔐 Admin Access

Default admin credentials dibuat otomatis via seeder saat pertama kali aplikasi dijalankan.

Akses admin panel di:
```
https://yourdomain.com/login
```

---

## 🔒 Security

- JWT token authentication untuk semua admin routes
- CORS dibatasi hanya ke domain yang diizinkan
- File upload divalidasi tipe dan ukuran
- Environment variables tidak di-commit ke Git
- Backend port tidak di-expose langsung ke internet (hanya via Cloudflare Tunnel)
- Token disimpan di `localStorage` dengan key spesifik `admin_token`

---

## ⚙️ Environment Variables

### Backend (`.env`)
| Variable | Description | Example |
|---|---|---|
| `DB_USER` | Database username | `root` |
| `DB_PASS` | Database password | `password` |
| `DB_HOST` | Database host | `127.0.0.1` |
| `DB_PORT` | Database port | `3306` |
| `DB_NAME` | Database name | `db_go_api` |
| `JWT_SECRET` | Secret key for JWT | `random_32_chars` |
| `PORT` | Backend port | `8000` |

### Frontend (`.env.local`)
| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL for browser | `https://api.domain.com` |
| `API_URL_SERVER` | Backend URL for SSR | `http://backend:8000` |

---

## 📦 Update Production

```bash
# Di server
cd ~/catatan-programmer

# Pull perubahan terbaru
git pull origin main

# Rebuild dan restart
docker compose down
docker compose up -d --build
```

---

## 🐛 Troubleshooting

**Data tidak muncul di frontend:**
```bash
# Cek container jalan
docker ps

# Cek log backend
docker logs journal-backend

# Test API langsung
curl http://localhost:8000/posts
```

**Gambar tidak muncul:**
```bash
# Cek file ada di container
docker exec -it journal-backend ls /root/uploads

# Copy file ke container jika kosong
docker cp ./uploads/. journal-backend:/root/uploads/
```

**Tunnel tidak konek:**
```bash
# Cek status
sudo systemctl status cloudflared

# Restart tunnel
sudo systemctl restart cloudflared

# Lihat daftar tunnel
cloudflared tunnel list
```

---

## 👨‍💻 Author

**Asep Nurdin**
- Blog: [asepblog.my.id](https://asepblog.my.id)
- GitHub: [@asepnrdn](https://github.com/AsepNurdinDev)
- Linkedin: [@aseppnurdin] (https://www.linkedin.com/in/aseppnurdin)
- Portofolio: [@asepnrdn] (https://www.asepnrdn.site/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).