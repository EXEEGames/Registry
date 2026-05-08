import fs from "fs";
import crypto from "crypto";

const issueBody = fs.readFileSync("./issue.txt", "utf8");

const registryPath = "./games.json";

const registry = JSON.parse(
  fs.readFileSync(registryPath, "utf8")
);

const generatedHash = fs
  .readFileSync("./sha256.txt", "utf8")
  .trim();

function generateGameId() {

  const time = Math.floor(Date.now() / 1000);

  const rand = Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase();

  return `EXEE-${time}-${rand}`;
}

function field(name) {

  const regex = new RegExp(`${name}:\\s*(.*)`);

  const match = issueBody.match(regex);

  return match ? match[1].trim() : "";
}

function multiField(name) {

  const regex = new RegExp(
    `${name}:([\\s\\S]*?)(\\n\\n|$)`
  );

  const match = issueBody.match(regex);

  if (!match) return [];

  return match[1]
    .split("\n")
    .map(x => x.trim())
    .filter(Boolean);
}

const isUpdate = issueBody.includes("Game ID");

if (!isUpdate) {

  const game = {

    id: generateGameId(),

    name: field("Game Name"),

    description: field("Description"),

    developer: field("Developer Name"),

    version: field("Version") || "1.0.0",

    created_at: new Date().toISOString(),

    updated_at: new Date().toISOString(),

    genres: multiField("Genres"),

    age_rating: field("Age Rating") || "N/A",

    thumbnail: field("Thumbnail URL"),

    images: multiField("Screenshot URLs"),

    multiplayer: field("Multiplayer"),

    download: field("PCK Download URL"),

    sha256: generatedHash,

    repository: field("Repository URL")
  };

  const duplicate = registry.games.find(
    g => g.name.toLowerCase() === game.name.toLowerCase()
  );

  if (duplicate) {

    console.log("Duplicate game");

    process.exit(0);
  }

  registry.games.push(game);

  console.log("Added game");
}

else {

  const gameId = field("Game ID");

  const game = registry.games.find(
    g => g.id === gameId
  );

  if (!game) {

    console.log("Game not found");

    process.exit(0);
  }

  const updates = {

    name: field("Updated Game Name"),

    description: field("Updated Description"),

    version: field("Version"),

    download: field("New PCK Download URL"),

    thumbnail: field("New Thumbnail URL"),

    age_rating: field("Age Rating"),

    multiplayer: field("Multiplayer")
  };

  Object.keys(updates).forEach(key => {

    if (updates[key]) {

      game[key] = updates[key];
    }
  });

  const genres = multiField("Genres");

  if (genres.length) {

    game.genres = genres;
  }

  const images = multiField("Screenshot URLs");

  if (images.length) {

    game.images = images;
  }

  game.sha256 = generatedHash;

  game.updated_at = new Date().toISOString();

  console.log("Updated game");
}

fs.writeFileSync(
  registryPath,
  JSON.stringify(registry, null, 2)
);

console.log("Registry saved");