const fs = require("fs");
const path = require("path");
const packageJson = require("../package.json");

const listChampionsJson = require("../champions.json");

const listDetailsChampions = fs.readdirSync(
  path.resolve(__dirname, "..", "champion-details")
);
const listImgChampions = fs.readdirSync(
  path.resolve(__dirname, "..", "images", "avatar")
);

const listChampionsIds = require("../champions-by-id.json");

const listChampions = listChampionsJson
  .map((champion) => champion.replace(/ |-/g, "_").replace(/‘|’/g, ""))
  .sort();

const missing = [];

listChampions.forEach((champion) => {
  const missingDetails = !listDetailsChampions.includes(`${champion}.json`);

  const championId = listChampionsIds.find((c) => c.key === champion);
  const missingIds = !championId;

  let missingIdsId = true;

  if (!missingIds) {
    missingIdsId = championId.id === undefined;
  }

  let idMessage = undefined;

  if (missingIds) {
    idMessage = "MISSING";
  }

  if (missingIdsId) {
    idMessage = "INCOMPLETE";
  }

  const missingAvatar = !listImgChampions.includes(`${champion}.png`);

  if (missingDetails || missingAvatar || idMessage) {
    missing.push({
      champion,
      details: !missingDetails,
      avatar: !missingAvatar,
      ids: idMessage,
    });
  }
});

const deprecatedDetails = [];

listDetailsChampions.forEach((championFile) => {
  const champion = require(path.resolve(
    __dirname,
    "..",
    "champion-details",
    championFile
  ));

  const championId = champion.name.replace(/ |-/g, "_").replace(/‘|’/g, "");

  if (!champion.version) {
    deprecatedDetails.push({ champion: championId, version: "unknown" });
  } else if (champion.version !== packageJson.version) {
    deprecatedDetails.push({
      champion: championId,
      version: champion.version,
    });
  }
});

console.table(missing);
console.table(deprecatedDetails);
