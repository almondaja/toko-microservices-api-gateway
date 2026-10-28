# Diagram Arsitektur

```mermaid
flowchart TD
    Client[Klien / Postman / smoke-test.js] --> GW[API Gateway :8080]
    GW -->|/product-service/*| PS[Product Service :3000]
    GW -->|/order-service/*| OS[Order Service :3001]
    OS -->|HTTP POST /products/:id/reserve\nTimeout 2 detik| PS
    PS --- PD[(Data produk di memori)]
    OS --- OD[(Data pesanan di memori)]
```

Aturan batas service:
- `product-service` adalah pemilik tunggal data produk dan stok.
- `order-service` adalah pemilik tunggal data pesanan.
- `order-service` tidak membaca atau mengubah array produk secara langsung. Ia meminta reservasi stok melalui HTTP.
- Jika `product-service` tidak tersedia, pembuatan pesanan membalas `503`, sedangkan daftar pesanan tetap dapat dibaca.
