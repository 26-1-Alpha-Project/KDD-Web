export function delay(ms?: number): Promise<void> {
  const duration = ms ?? (200 + Math.random() * 300);
  return new Promise(resolve => setTimeout(resolve, duration));
}
