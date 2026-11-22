const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateHistoricalMetrics } = require('../algorithms/priceAnalytics');

test('three quotes per date still span 30 and 90 calendar days', () => {
  const prices = [];
  for (let day = 0; day < 90; day++) {
    const recorded_at = new Date(Date.UTC(2026, 0, 1 + day)).toISOString().slice(0, 10);
    for (const offset of [-10, 0, 10]) {
      prices.push({ recorded_at, price: (day < 60 ? 100 : 400) + offset });
    }
  }
  const metrics = calculateHistoricalMetrics(prices.reverse(), 400);
  assert.equal(metrics.ma30, 400);
  assert.equal(metrics.ma90, 200);
});

test('missing days do not extend a window and busy days get no extra weight', () => {
  const prices = [
    { recorded_at: '2026-01-01', price: 900 },
    { recorded_at: '2026-03-01', price: 600 },
    { recorded_at: '2026-03-02', price: 100 },
    { recorded_at: '2026-03-02', price: 300 },
    { recorded_at: '2026-03-31', price: 400 }
  ];
  const metrics = calculateHistoricalMetrics(prices, 400);
  assert.equal(metrics.ma30, 300);
  assert.equal(metrics.ma90, 525);
});
