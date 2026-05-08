import fs from "fs";

export function loadRegistry() {
  try {
    return JSON.parse(fs.readFileSync("./games.json", "utf8"));
  } catch (e) {
    console.error("Registry corrupted — resetting");
    return { games: [] };
  }
}

export function saveRegistry(data) {
  fs.writeFileSync("./games.json", JSON.stringify(data, null, 2));
}