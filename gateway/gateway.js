const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Rate limit sederhana per alamat IP: maksimal 100 request per 15 menit.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 100;
const requestCounts = new Map();

app.use((req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  let entry = requestCounts.get(key);

  if (!entry || now - entry.start >= WINDOW_MS) {
    entry = { start: now, count: 0 };
  }

  entry.count += 1;
  requestCounts.set(key, entry);

  if (entry.count > MAX_REQUESTS) {
    return res.status(429).json({ error: 'Terlalu banyak request, coba lagi nanti' });
  }
  return next();
});

// API key untuk akses ke route service.
// Untuk tugas lokal, default key adalah praktikum-key.
// Dapat diganti dengan environment variable API_KEY.
app.use((req, res, next) => {
  if (req.path === '/') return next();

  const expectedKey = process.env.API_KEY || 'praktikum-key';
  const suppliedKey = req.get('X-API-Key');

  if (suppliedKey !== expectedKey) {
    return res.status(401).json({ error: 'API key tidak valid atau tidak ada' });
  }
  return next();
});

// Jangan pasang express.json() secara global sebelum proxy,
// agar body request tetap dapat diteruskan ke service tujuan.
app.use(
  '/product-service',
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_TARGET || 'http://127.0.0.1:3000',
    changeOrigin: true,
    pathRewrite: { '^/product-service': '' },
  }),
);

app.use(
  '/order-service',
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_TARGET || 'http://127.0.0.1:3001',
    changeOrigin: true,
    pathRewrite: { '^/order-service': '' },
  }),
);

app.get('/', (req, res) => {
  res.json({
    message: 'Toko API Gateway aktif',
    routes: {
      products: '/product-service/products',
      orders: '/order-service/orders',
    },
    security: ['rate limiting', 'API key'],
  });
});

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => console.log(`API Gateway berjalan di port ${PORT}`));
