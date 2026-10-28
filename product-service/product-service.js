const express = require('express');

const app = express();
app.use(express.json());

const products = [
  { id: 1, name: 'Keyboard Mekanik', price: 450000, stock: 10 },
  { id: 2, name: 'Mouse Wireless', price: 175000, stock: 25 },
  { id: 3, name: 'Monitor 24 inci', price: 1850000, stock: 5 },
];

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }
  return res.json(product);
});

// Endpoint reserve: hanya product-service yang mengubah stok.
app.post('/products/:id/reserve', (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));
  const { qty } = req.body || {};

  if (!product) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ error: 'qty tidak valid' });
  }
  if (product.stock < qty) {
    return res.status(409).json({ error: 'Stok tidak cukup' });
  }

  product.stock -= qty;
  return res.json(product);
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, process.env.HOST || '0.0.0.0', () => console.log(`product-service berjalan di port ${PORT}`));
