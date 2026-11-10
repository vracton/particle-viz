export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}
export function seekTime(percent, duration) {
  if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(percent)) return 0;
  return Math.max(0, Math.min(100, percent)) / 100 * duration;
}
export function colorRGB(hex) {
  return [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255);
}
