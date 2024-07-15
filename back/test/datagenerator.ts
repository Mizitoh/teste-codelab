export function generateRandomName(): string {
  const prefixes = [
    'Fei',
    'Vi',
    'Sal',
    'Lei',
    'Mar',
    'Car',
    'Pen',
    'Ra',
    'Que',
  ];
  const suffixes = [
    'jão',
    'nho',
    'do',
    'te',
    'te',
    'roz',
    'ca',
    'ne',
    'ção',
    'ijo',
  ];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return randomPrefix + randomSuffix;
}

export function generateRandomPrices(): number {
  const randomValue = Math.random() * 999.99;
  return parseFloat(randomValue.toFixed(2));
}
