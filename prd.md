# Product Images Feature PRD

## Overview

Menambahkan fitur gambar produk untuk Qifaya.

Setiap produk memiliki:

* 1 gambar utama (thumbnail)
* 0 atau lebih gambar detail

Semua gambar disimpan di Supabase Storage dan URL disimpan di database.

---

# Goals

* Admin dapat mengunggah gambar utama produk.
* Admin dapat mengunggah beberapa gambar detail produk.
* Frontend dapat menampilkan thumbnail produk pada halaman listing.
* Frontend dapat menampilkan galeri gambar pada halaman detail produk.

---

# Database Design

## Table: product_images

```sql
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  image_url TEXT NOT NULL,

  is_primary BOOLEAN DEFAULT FALSE,

  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Explanation

| Column     | Description                      |
| ---------- | -------------------------------- |
| id         | Primary key                      |
| product_id | Relasi ke produk                 |
| image_url  | URL gambar dari Supabase Storage |
| is_primary | Menentukan gambar utama          |
| sort_order | Urutan tampilan gambar           |
| created_at | Tanggal upload                   |

---

# Business Rules

## Main Image

* Setiap produk wajib memiliki 1 gambar utama.
* Hanya boleh ada 1 gambar utama per produk.
* Gambar utama digunakan untuk:

  * Product Card
  * Homepage
  * Search Result
  * Related Product

## Detail Images

* Produk dapat memiliki banyak gambar detail.
* Gambar detail digunakan pada halaman detail produk.
* Maksimal 10 gambar detail per produk.

---

# Backend Requirements

## Create Product

Endpoint:

POST /products

Request:

* product data
* main image
* detail images[]

Flow:

1. Upload main image ke Supabase Storage.
2. Upload seluruh detail images ke Supabase Storage.
3. Simpan produk ke database.
4. Simpan seluruh data gambar ke table product_images.

---

## Upload Product Images

Endpoint:

POST /products/:id/images

Function:

* Menambahkan gambar baru ke produk.

---

## Delete Product Image

Endpoint:

DELETE /products/images/:imageId

Function:

* Menghapus gambar dari database.
* Menghapus file dari Supabase Storage.

---

## Update Main Image

Endpoint:

PATCH /products/:id/main-image

Function:

* Mengubah gambar utama.
* Set gambar lama menjadi is_primary = false.
* Set gambar baru menjadi is_primary = true.

---

# API Response

GET /products

Example:

```json
{
  "id": "product-id",
  "name": "Gamis Premium",
  "slug": "gamis-premium",
  "mainImage": "https://storage.supabase.co/...",
  "category": {
    "id": "category-id",
    "name": "Gamis"
  }
}
```

---

GET /products/:id

Example:

```json
{
  "id": "product-id",
  "name": "Gamis Premium",
  "description": "Lorem ipsum",
  "images": [
    {
      "id": "1",
      "imageUrl": "https://...",
      "isPrimary": true
    },
    {
      "id": "2",
      "imageUrl": "https://...",
      "isPrimary": false
    },
    {
      "id": "3",
      "imageUrl": "https://...",
      "isPrimary": false
    }
  ]
}
```

---

# Frontend Requirements

## Product Form

### Main Image Section

Field:

* Main Image

Rules:

* Wajib diisi saat membuat produk.
* Hanya boleh upload 1 gambar.
* Preview gambar sebelum submit.

---

### Detail Images Section

Field:

* Detail Images

Rules:

* Opsional.
* Bisa upload multiple images.
* Maksimal 10 gambar.
* Preview seluruh gambar sebelum submit.
* Bisa menghapus gambar sebelum submit.

---

# UI Layout

Product Form

Main Image
[ Upload 1 Image ]

Detail Images
[ Upload Multiple Images ]

Preview Detail Images
[ Image 1 ]
[ Image 2 ]
[ Image 3 ]

---

# Storage Structure

Bucket:

product-images

Folder Structure:

product-images/
├── products/
│    ├── product-id/
│    │    ├── main.jpg
│    │    ├── detail-1.jpg
│    │    ├── detail-2.jpg
│    │    └── detail-3.jpg

---

# Success Criteria

* Produk memiliki tepat 1 gambar utama.
* Produk dapat memiliki banyak gambar detail.
* Seluruh gambar tersimpan di Supabase Storage.
* Gambar dapat ditambah, diubah, dan dihapus melalui dashboard admin.
