# Qifaya Backend PRD

## Project Information

### Project Name

Qifaya Backend API

### Version

1.0 MVP

### Framework

NestJS

### Database

PostgreSQL

### ORM

TypeORM

### Authentication

JWT Authentication

---

# 1. Overview

Backend Qifaya bertugas menyediakan API untuk mengelola data produk, kategori, ukuran produk, dan autentikasi admin.

Backend tidak menangani pembayaran, checkout, tracking pesanan, maupun integrasi WhatsApp.

Website Qifaya berfungsi sebagai katalog produk dan media branding.

---

# 2. Goals

## Business Goals

* Mempermudah admin mengelola katalog produk.
* Mengurangi kebutuhan perubahan data langsung pada source code.
* Menyediakan sistem pengelolaan produk yang sederhana.

## Technical Goals

* API RESTful.
* Mudah dikembangkan.
* Mudah diintegrasikan dengan Vue.js.
* Aman untuk penggunaan admin.

---

# 3. User Roles

## Admin

Hak akses:

* Login
* Tambah produk
* Edit produk
* Hapus produk
* Tambah kategori
* Edit kategori
* Hapus kategori
* Kelola ukuran produk

---

# 4. Modules

## Authentication Module

### Features

* Login Admin
* JWT Authentication
* Password Hashing

### Endpoint

POST /auth/login

Response:

{
"accessToken": "jwt_token"
}

---

## Products Module

### Features

* Ambil semua produk
* Ambil detail produk
* Tambah produk
* Edit produk
* Hapus produk

### Endpoints

GET /products

GET /products/:id

POST /products

PATCH /products/:id

DELETE /products/:id

---

## Categories Module

### Features

* Ambil kategori
* Tambah kategori
* Edit kategori
* Hapus kategori

### Endpoints

GET /categories

POST /categories

PATCH /categories/:id

DELETE /categories/:id

---

## Product Sizes Module

### Features

* Tambah ukuran produk
* Hapus ukuran produk
* Ambil ukuran produk

### Endpoints

GET /products/:id/sizes

POST /products/:id/sizes

DELETE /products/:id/sizes/:sizeId

---

## Upload Module

### Features

* Upload gambar produk
* Hapus gambar produk

### Endpoints

POST /upload

DELETE /upload/:id

---

# 5. Database Design

## users

| Field      | Type      |
| ---------- | --------- |
| id         | uuid      |
| email      | varchar   |
| password   | varchar   |
| created_at | timestamp |
| updated_at | timestamp |

---

## categories

| Field      | Type      |
| ---------- | --------- |
| id         | uuid      |
| name       | varchar   |
| created_at | timestamp |
| updated_at | timestamp |

---

## products

| Field       | Type      |
| ----------- | --------- |
| id          | uuid      |
| name        | varchar   |
| slug        | varchar   |
| description | text      |
| gender      | varchar   |
| image_url   | varchar   |
| category_id | uuid      |
| created_at  | timestamp |
| updated_at  | timestamp |

---

## product_sizes

| Field      | Type      |
| ---------- | --------- |
| id         | uuid      |
| product_id | uuid      |
| size       | varchar   |
| sort_order | integer   |
| created_at | timestamp |

---

# 6. Product Rules

## Gender

Allowed Values:

* MALE
* FEMALE
* UNISEX

---

## Product Sizes

Contoh ukuran:

* S
* M
* L
* XL
* XXL
* ALL SIZE

Admin dapat menambahkan lebih dari satu ukuran pada setiap produk.

---

# 7. Security Requirements

## Authentication

* JWT Token
* Protected Routes
* Token Expiration

## Password

* Hash menggunakan bcrypt
* Password tidak boleh disimpan dalam bentuk plain text

---

# 8. Validation Rules

## Product

Nama Produk:

* Wajib diisi

Deskripsi:

* Wajib diisi

Kategori:

* Wajib dipilih

Gender:

* Wajib dipilih

Minimal ukuran:

* 1 ukuran

---

## Category

Nama kategori:

* Unik
* Tidak boleh kosong

---

# 9. Non Functional Requirements

## Performance

* Response API < 500ms untuk query normal

## Scalability

* Struktur modular NestJS

## Maintainability

* Menggunakan service layer
* Menggunakan DTO Validation
* Menggunakan Repository Pattern (TypeORM)

---

# 10. Folder Structure

src/

├── auth/

├── products/

├── categories/

├── product-sizes/

├── upload/

├── common/

├── database/

└── main.ts

---

# 11. Future Enhancements

Version 2.0

* Product Stock Management
* Dashboard Analytics
* Multi Admin
* Product Reviews
* Customer Accounts
* Order Management
* Payment Integration
