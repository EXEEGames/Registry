export function validateGame(game) {

  const errors = [];

  if (!game.name) errors.push("Missing name");
  if (!game.description) errors.push("Missing description");
  if (!game.download) errors.push("Missing download URL");

  if (game.download && !game.download.startsWith("https://")) {
    errors.push("Download must be HTTPS");
  }

  if (!Array.isArray(game.genres)) {
    errors.push("Genres must be array");
  }

  if (!game.thumbnail) {
    errors.push("Missing thumbnail");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}