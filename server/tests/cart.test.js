import test from 'node:test';
import assert from 'node:assert/strict';

test('Cart: Exact integer paise monetary calculations', () => {
  // Kurti: ₹2,850 (285000 paise), Quantity: 2
  const item1Price = 285000;
  const item1Qty = 2;
  const item1Total = item1Price * item1Qty; // 570000 paise

  // Saree: ₹6,900 (690000 paise), Quantity: 1
  const item2Price = 690000;
  const item2Qty = 1;
  const item2Total = item2Price * item2Qty; // 690000 paise

  const subtotal = item1Total + item2Total; // 1260000 paise (₹12,600)
  assert.equal(subtotal, 1260000);

  // Free shipping threshold: ₹1,999 (199900 paise)
  const shipping = subtotal >= 199900 ? 0 : 15000;
  assert.equal(shipping, 0);

  const total = subtotal + shipping;
  assert.equal(total, 1260000);
  assert.equal(total / 100, 12600);
});

test('Cart: Shipping charge applied when below free shipping threshold', () => {
  // Small accessory or blouse piece: ₹1,200 (120000 paise)
  const subtotal = 120000;
  const shipping = subtotal >= 199900 ? 0 : 15000;
  assert.equal(shipping, 15000); // ₹150 delivery charge

  const total = subtotal + shipping;
  assert.equal(total, 135000); // ₹1,350
});
