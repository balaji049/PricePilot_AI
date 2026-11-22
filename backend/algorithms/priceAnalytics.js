/**
 * Price Analytics Module
 * Calculates moving averages, min/max bounds, volatility and deviations.
 */

function calculateMovingAverage(prices, days) {
  if (!prices || prices.length === 0) return 0;
  // Undated input represents one price per consecutive day.
  const slice = prices.slice(-days);
  if (slice.length === 0) return 0;
  const sum = slice.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : curr.price), 0);
  return Math.round(sum / slice.length);
}

// Each observed day has equal weight, even when retailer coverage varies.
function dailyPrices(records) {
  const totals = new Map();
  for (const { recorded_at, price } of records) {
    const day = Math.floor(Date.parse(recorded_at) / 86400000);
    const entry = totals.get(day) || { sum: 0, count: 0 };
    entry.sum += price;
    entry.count += 1;
    totals.set(day, entry);
  }
  return Array.from(totals, ([day, { sum, count }]) => ({ day, price: sum / count }));
}

function calculateHistoricalMetrics(priceRecords, currentPrice) {
  if (!priceRecords || priceRecords.length === 0) {
    return {
      currentPrice: currentPrice || 0,
      lowestPrice: currentPrice || 0,
      highestPrice: currentPrice || 0,
      ma30: currentPrice || 0,
      ma90: currentPrice || 0,
      deviation90: 0,
      deviation30: 0,
      totalDataPoints: 0
    };
  }

  // Extract raw prices sorted chronologically
  const sorted = [...priceRecords].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
  const rawPrices = sorted.map(r => r.price);

  const lowestPrice = Math.min(...rawPrices);
  const highestPrice = Math.max(...rawPrices);
  const effectiveCurrentPrice = currentPrice || rawPrices[rawPrices.length - 1];

  const daily = dailyPrices(sorted);
  const lastDay = daily[daily.length - 1].day;
  const windowAverage = days => calculateMovingAverage(
    daily.filter(entry => entry.day > lastDay - days), days
  );
  const ma30 = windowAverage(30);
  const ma90 = windowAverage(90);

  // Deviation (%) = ((Current Price - Average Price) / Average Price) * 100
  const deviation90 = ma90 > 0 ? Number((((effectiveCurrentPrice - ma90) / ma90) * 100).toFixed(2)) : 0;
  const deviation30 = ma30 > 0 ? Number((((effectiveCurrentPrice - ma30) / ma30) * 100).toFixed(2)) : 0;

  // Price distance to historical low (%)
  const distanceToLow = lowestPrice > 0 ? Number((((effectiveCurrentPrice - lowestPrice) / lowestPrice) * 100).toFixed(2)) : 0;

  return {
    currentPrice: effectiveCurrentPrice,
    lowestPrice,
    highestPrice,
    ma30,
    ma90,
    deviation90,
    deviation30,
    distanceToLow,
    totalDataPoints: priceRecords.length
  };
}

module.exports = {
  calculateMovingAverage,
  calculateHistoricalMetrics
};
