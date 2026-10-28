const express = require('express');

const app = express();
app.use(express.json());

const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://127.0.0.1:3000';
const orders = [];

app.post('/orders', async (req, res) => {
  const { productId, qty } = req.body || {};

  if (!Number.isInteger(productId) || productId < 1 ||
      !Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({
      error: 'productId dan qty harus bilangan bulat > 0',
    });
  }

  let productResponse;
  try {
    productResponse = await fetch(
      `${PRODUCT_URL}/products/${productId}/reserve`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty }),
        signal: AbortSignal.timeout(2000),
      },
    );
  } catch (error) {
    return res.status(503).json({
      error: 'product-service tidak tersedia, coba lagi nanti',
    });
  }

  let product;
  try {
    product = await productResponse.json();
  } catch (error) {
    return res.status(502).json({ error: 'Respons product-service tidak valid' });
  }

  if (!productResponse.ok) {
    return res.status(productResponse.status).json(product);
  }

  const order = {
    id: orders.length + 1,
    productId,
    productName: product.name,
    qty,
    total: product.price * qty,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  return res.status(201).json(order);
});

app.get('/orders', (req, res) => {
  res.json(orders);
});

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, process.env.HOST || '0.0.0.0', () => console.log(`order-service berjalan di port ${PORT}`));
