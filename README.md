# Praktikum: Memecah Aplikasi Menjadi Microservices

Implementasi mengikuti instruksi tugas: contoh toko dipisah menjadi `product-service` (port 3000) dan `order-service` (port 3001), keduanya diakses melalui gateway (port 8080). Data masih berupa array di memori, sesuai bahan praktikum.

Gateway juga memuat rate limiting dan API key sebagai kelanjutan konteks Lab 08. API key default untuk pengujian lokal: `praktikum-key`.

## Persyaratan
- Node.js 18 atau lebih baru
- npm

## Struktur folder
```text
toko/
├── gateway/
│   ├── gateway.js
│   └── package.json
├── product-service/
│   ├── product-service.js
│   └── package.json
├── order-service/
│   ├── order-service.js
│   └── package.json
├── smoke-test.js
├── .gitignore
└── README.md
```

## 1. Instalasi
Buka terminal di folder `toko`, lalu jalankan:
```bash
cd product-service && npm install
cd ../order-service && npm install
cd ../gateway && npm install
```

## 2. Menjalankan service
Buka **4 terminal** terpisah, semuanya dari folder proyek `toko`.

Terminal 1:
```bash
cd product-service
npm start
```

Terminal 2:
```bash
cd order-service
npm start
```

Terminal 3:
```bash
cd gateway
npm start
```

Terminal 4:
```bash
node smoke-test.js
```

Jangan menjalankan monolit bersamaan dengan product-service karena keduanya memakai port 3000.

## 3. Endpoint melalui gateway
Sertakan header `X-API-Key: praktikum-key` untuk route service.
- `GET http://localhost:8080/product-service/products`
- `GET http://localhost:8080/product-service/products/1`
- `POST http://localhost:8080/order-service/orders` dengan JSON `{"productId":1,"qty":2}`
- `GET http://localhost:8080/order-service/orders`

API key dapat diganti melalui environment variable `API_KEY`. Rate limiter contoh membatasi hingga 100 request per IP per 15 menit.

## 4. Hasil yang diharapkan
- Jumlah produk: 3
- Pembuatan order: HTTP 201
- Stok produk 1 berkurang sesuai kuantitas order
- Saat `product-service` dimatikan, `POST /order-service/orders` menghasilkan HTTP 503
- Saat `product-service` mati, `GET /order-service/orders` tetap menghasilkan HTTP 200

**Catatan penting:** data disimpan di memori, jadi akan kembali ke nilai awal saat service di-restart. Smoke test membuat order baru setiap kali dijalankan.

## 5. Commit ke GitHub
Setelah semua berjalan, inisialisasi Git di folder `toko`, lalu push ke repository yang kamu miliki ketika Git server sudah dapat diakses:
```bash
git init
git add .
git commit -m "Implementasi microservices toko dan API gateway"
```
File `node_modules` dan `.env` dikecualikan oleh `.gitignore`.
