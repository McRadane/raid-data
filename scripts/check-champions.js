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

  let idMessage = true;

  if (missingIds) {
    idMessage = "MISSING";
  }

  if (missingIdsId) {
    idMessage = "INCOMPLETE";
  } else if (championId.id.match(/[^0-9]+/) !== null) {
    idMessage = "INVALID";
  }

  const missingAvatar = !listImgChampions.includes(`${champion}.png`);

  if (missingDetails || missingAvatar || idMessage !== true) {
    missing.push({
      champion,
      id: championId.id,
      details: !missingDetails,
      avatar: !missingAvatar,
      ids: idMessage,
    });
  }
});

const deprecatedDetails = [];
const skillsImageMissings = [];

listDetailsChampions.forEach((championFile) => {
  const champion = require(path.resolve(
    __dirname,
    "..",
    "champion-details",
    championFile
  ));

  const championGuid = champion.name.replace(/ |-/g, "_").replace(/‘|’/g, "");
  const championId = listChampionsIds.find((c) => c.key === championGuid);

  champion.skills.forEach((_skill, index) => {
    const skillName = `${championGuid}_s${index + 1}.png`;

    if (
      !fs.existsSync(
        path.resolve(__dirname, "..", "images", "Skills", skillName)
      )
    ) {
      skillsImageMissings.push({
        champion: championGuid,
        id: championId.id,
        skill: skillName,
      });
    }
  });

  if (!champion.version) {
    deprecatedDetails.push({ champion: championGuid, version: "unknown" });
  } else if (champion.version !== packageJson.version) {
    deprecatedDetails.push({
      champion: championGuid,
      version: champion.version,
    });
  }
});

console.table(missing);
console.table(skillsImageMissings);
console.table(deprecatedDetails);
