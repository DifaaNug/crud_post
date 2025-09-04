# 📮 Panduan Testing API dengan Postman

## 🔧 Setup Awal
- **Base URL**: `http://127.0.0.1:8000/api`
- **Content-Type**: `application/json` (untuk request JSON)
- **Content-Type**: `multipart/form-data` (untuk upload file)

---

## 📝 POSTS API Endpoints

### 1. **GET** - Ambil Semua Posts
```
GET http://127.0.0.1:8000/api/posts
```
**Response Example:**
```json
{
    "success": true,
    "message": "Data posts berhasil diambil",
    "data": {
        "data": [...],
        "current_page": 1,
        "total": 10
    }
}
```

### 2. **POST** - Buat Post Baru
```
POST http://127.0.0.1:8000/api/posts
```
**Body (form-data):**
- `title`: "Judul Post Baru" *(required)*
- `content`: "Konten post yang panjang..." *(required)*
- `status`: "draft" atau "published" *(required)*
- `picture`: [Upload File Gambar] *(optional)*

**Response Example:**
```json
{
    "success": true,
    "message": "Post berhasil dibuat",
    "data": {
        "id": 1,
        "title": "Judul Post Baru",
        "content": "Konten post...",
        "status": "draft",
        "picture": "posts/filename.jpg",
        "created_at": "2025-09-04T01:30:00.000000Z"
    }
}
```

### 3. **GET** - Ambil Detail Post
```
GET http://127.0.0.1:8000/api/posts/{id}
```
**Contoh**: `GET http://127.0.0.1:8000/api/posts/1`

### 4. **PUT** - Update Post
```
PUT http://127.0.0.1:8000/api/posts/{id}
```
**Body (form-data):**
- `title`: "Judul Post Diupdate"
- `content`: "Konten yang sudah diupdate"
- `status`: "published"
- `picture`: [Upload File Baru] *(optional)*

### 5. **DELETE** - Hapus Post
```
DELETE http://127.0.0.1:8000/api/posts/{id}
```

---

## 🛍️ PRODUCTS API Endpoints

### 1. **GET** - Ambil Semua Products
```
GET http://127.0.0.1:8000/api/products
```

### 2. **POST** - Buat Product Baru
```
POST http://127.0.0.1:8000/api/products
```
**Body (form-data):**
- `name`: "Nama Produk" *(required)*
- `category`: "Kategori Produk" *(required)*
- `price`: 50000 *(required, numeric)*
- `stock`: 100 *(required, integer)*
- `description`: "Deskripsi produk..." *(optional)*
- `image`: [Upload File Gambar] *(optional)*

**Response Example:**
```json
{
    "success": true,
    "message": "Product berhasil dibuat",
    "data": {
        "id": 1,
        "name": "Nama Produk",
        "category": "Kategori",
        "price": 50000,
        "stock": 100,
        "description": "Deskripsi...",
        "image": "products/filename.jpg"
    }
}
```

### 3. **GET** - Ambil Detail Product
```
GET http://127.0.0.1:8000/api/products/{id}
```

### 4. **PUT** - Update Product
```
PUT http://127.0.0.1:8000/api/products/{id}
```
**Body (form-data):**
- `name`: "Nama Produk Update"
- `category`: "Kategori Update"
- `price`: 75000
- `stock`: 50
- `description`: "Deskripsi update..."
- `image`: [Upload File Baru] *(optional)*

### 5. **DELETE** - Hapus Product
```
DELETE http://127.0.0.1:8000/api/products/{id}
```

---

## 📊 DASHBOARD STATS API

### **GET** - Ambil Statistik Dashboard
```
GET http://127.0.0.1:8000/api/dashboard/stats
```
**Response Example:**
```json
{
    "success": true,
    "message": "Statistik dashboard berhasil diambil",
    "data": {
        "total_products": 25,
        "total_posts": 15,
        "published_posts": 10,
        "low_stock_products": 3
    }
}
```

---

## 🧪 Testing Steps di Postman

### Step 1: Test GET All Posts
1. Buka Postman
2. Buat request baru: **GET** `http://127.0.0.1:8000/api/posts`
3. Klik **Send**
4. Pastikan dapat response dengan data posts

### Step 2: Test CREATE Post
1. Buat request baru: **POST** `http://127.0.0.1:8000/api/posts`
2. Di tab **Body**, pilih **form-data**
3. Tambahkan fields:
   - `title` → "Post dari Postman"
   - `content` → "Ini adalah konten post yang dibuat via API"
   - `status` → "published"
   - `picture` → [pilih file gambar]
4. Klik **Send**

### Step 3: Test GET Detail Post
1. Dari response step 2, ambil `id` post yang baru dibuat
2. Buat request: **GET** `http://127.0.0.1:8000/api/posts/{id}`
3. Klik **Send**

### Step 4: Test UPDATE Post
1. Buat request: **PUT** `http://127.0.0.1:8000/api/posts/{id}`
2. Di **Body** → **form-data**, ubah beberapa field
3. Klik **Send**

### Step 5: Test DELETE Post
1. Buat request: **DELETE** `http://127.0.0.1:8000/api/posts/{id}`
2. Klik **Send**
3. Pastikan response sukses

## 🔥 Ulangi untuk Products API!

---

## ⚠️ Error Responses
Semua API akan mengembalikan error response seperti ini:

**Validation Error (422):**
```json
{
    "success": false,
    "message": "Validasi gagal",
    "errors": {
        "title": ["Field title wajib diisi"]
    }
}
```

**Not Found Error (404):**
```json
{
    "success": false,
    "message": "Post tidak ditemukan"
}
```

**Server Error (500):**
```json
{
    "success": false,
    "message": "Gagal membuat post",
    "error": "Detail error message"
}
```

---

## 🎯 Pro Tips
1. **Headers**: Untuk upload file, jangan set Content-Type manual, biar Postman yang handle
2. **Testing**: Test semua scenario (sukses, validasi error, not found)
3. **Environment**: Buat Postman Environment dengan base_url variable
4. **Collections**: Simpan semua request dalam Postman Collection untuk reuse

**Happy Testing! 🚀**
