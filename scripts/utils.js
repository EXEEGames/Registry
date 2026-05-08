export function generateGameId() {
  const time = Math.floor(Date.now() / 1000);
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `EXEE-${time}-${rand}`;
}