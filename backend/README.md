
# 📚 BOOK-COMMERCE Backend

Proyek backend ini adalah bagian dari sistem **BOOK-COMMERCE** yang menggunakan **arsitektur microservices** dan **Event-Driven Architecture (EDA)**. Setiap service (layanan) bertanggung jawab atas fitur spesifik dan berkomunikasi menggunakan event (RabbitMQ). Sistem ini dibuat dengan Node.js, Express, MongoDB, Redis, dan dijalankan dalam Docker.

---

## 🧱 Arsitektur

- 🧩 **Microservices**: Setiap layanan berdiri sendiri dan dapat diskalakan secara independen.  
  👉 Penjelasan lengkap: [Apa itu Microservices?](https://microservices.io/)

- 🔄 **Event-Driven Architecture (EDA)**: Layanan berkomunikasi melalui event asynchronous (menggunakan RabbitMQ).  
  👉 Penjelasan lengkap: [Apa itu Event-Driven Architecture?](https://learn.microsoft.com/en-us/azure/architecture/best-practices/event-driven-architecture)

---

## 📦 Services

Berikut adalah tiga service utama:

```
backend/
└── services/
    ├── book-detail/
    ├── book-display/
    └── book-search/
```

Setiap folder memiliki struktur:
```
📁 src/
├── config/   # Konfigurasi DB, Redis, RabbitMQ
├── models/   # Skema mongoose
├── routes/   # HTTP API endpoints
├── cache/    # Cache (jika ada)
├── events/   # Event handlers (khusus book-search)
└── index.js  # Entry point server
```

---

## 🔧 Library yang Digunakan

```json
"dependencies": {
  "amqplib": "^0.10.8",
  "cors": "^2.8.5",
  "dotenv": "^16.5.0",
  "express": "^5.1.0",
  "ioredis": "^5.6.1",
  "mongoose": "^8.15.0"
},
"devDependencies": {
  "nodemon": "^3.1.10"
}
```

---

## 🐳 Cara Menjalankan dengan Docker

### 1. 🔽 Instal Docker Desktop

Untuk Windows:

> 💡 Download installer Docker Desktop dari:  
[Klik di sini untuk unduh Docker Desktop](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&utm_medium=webreferral&utm_campaign=dd-smartbutton&utm_location=module)

> Pastikan **WSL2** sudah aktif di Windows, karena Docker membutuhkan ini untuk berjalan.

---

### 2. 📂 Instalasi Dependencies

Masuk ke setiap service dan install dependency:

```bash
cd backend/services/book-search
npm install

cd ../book-detail
npm install

cd ../book-display
npm install
```

---

### 3. 🚀 Jalankan Docker Compose

Kembali ke folder `backend` dan jalankan Docker Compose:

```bash
cd backend
docker compose up --build
```

Docker akan membangun container untuk semua service dan menjalankannya secara otomatis. Pastikan RabbitMQ dan MongoDB juga didefinisikan di `docker-compose.yml`.

---

## 📁 Struktur Proyek

```bash
BOOK-COMMERCE/
└── backend/
    ├── docker-compose.yml
    └── services/
        ├── book-detail/
        │   └── src/
        ├── book-display/
        │   └── src/
        └── book-search/
            └── src/
```

---

## ✅ Status & Catatan

- 📌 Service `book-search` memiliki fitur pencarian buku, caching dengan Redis, dan event listener dari RabbitMQ.
- 📌 Service `book-detail` menyimpan informasi lengkap buku.
- 📌 Service `book-display` menangani katalog/tampilan daftar buku.
