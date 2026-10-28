const BASE = process.env.BASE_URL || 'http://127.0.0.1:8080';
const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': process.env.API_KEY || 'praktikum-key',
};

async function main() {
  const productResponse = await fetch(`${BASE}/product-service/products`, { headers });
  const products = await productResponse.json();
  console.log('jumlah produk:', products.length);

  const orderResponse = await fetch(`${BASE}/order-service/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ productId: 1, qty: 2 }),
  });
  console.log('buat order:', orderResponse.status, await orderResponse.json());

  const updatedProductResponse = await fetch(
    `${BASE}/product-service/products/1`,
    { headers },
  );
  const product = await updatedProductResponse.json();
  console.log('stok produk 1 sekarang:', product.stock);
}

main().catch((error) => {
  console.error('Smoke test gagal:', error.message);
  process.exitCode = 1;
});
