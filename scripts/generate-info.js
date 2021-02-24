const fs = require("fs");
const path = require("path");

const championFiles = fs.readdirSync(
  path.resolve(__dirname, "..", "champion-details")
);

const generateAura = (description, name, auras) => {
  const skillAura = /Increases? (?<affinity>[a-z ]+)?Ally (?<stat>[a-z. ]+) in (?<domain>[a-z ]+) by [0-9%]+/i.exec(
    description
  );

  let skillDomain = skillAura.groups.domain;
  let skillStat = skillAura.groups.stat;
  let skillAffinity = skillAura.groups.affinity;

  if (skillAffinity) {
    skillAffinity = skillAffinity.toLowerCase();
  }

  switch (skillDomain) {
    case "the Arena":
      skillDomain = "Arena";
      break;
    case "all Battles":
      skillDomain = "All";
      break;
    case "all battles":
      skillDomain = "All";
      break;
    case "Dungeon":
      skillDomain = "Dungeons";
      break;
    case "Arena battles":
      skillDomain = "Arena";
      break;
    case "Campaign Battles":
      skillDomain = "Campaign";
      break;
    case "Doom Tower battles":
      skillDomain = "Doom Tower";
      break;
  }

  switch (skillStat) {
    case "Critical Rate":
      skillStat = "C.RATE";
      break;
    case "C. RATE":
      skillStat = "C.RATE";
      break;
    case "Attack":
      skillStat = "ATK";
      break;
    case "Accuracy":
      skillStat = "ACC";
      break;
    case "C. Rate":
      skillStat = "C.RATE";
      break;
  }

  if (auras[skillStat] === undefined) {
    auras[skillStat] = {};
  }

  const domainLong = skillAffinity
    ? `${skillDomain} (${skillAffinity.trim()})`
    : skillDomain;

  if (auras[skillStat][domainLong] === undefined) {
    auras[skillStat][domainLong] = [];
  }

  auras[skillStat][domainLong].push(name);

  return `${skillStat} - ${domainLong}`;
};

/**
 * @typedef {Object} BaseInfo
 * @property {string} id
 * @property {string} rarity
 * @property {string} affinity
 * @property {string} faction
 * @property {string} role
 * @property {string} aura
 * @property {string} avatarUrl
 * @property {string} detailsUrl
 */

/** @type {Record<string, BaseInfo>} */
const baseInfos = {};

/** @type {Record<string, string[]>} */
const affinities = {
  force: [],
  magic: [],
  spirit: [],
  void: [],
};

/** @type {Record<string, string[]>} */
const roles = {
  attack: [],
  defense: [],
  hp: [],
  support: [],
};

/** @type {Record<string, string[]>} */
const rarities = {
  uncommon: [],
  common: [],
  rare: [],
  epic: [],
  legendary: [],
};

/** @type {Record<string, string[]>} */
const factionsTemp = {};

/** @type {Record<string, string[]>} */
const aurasTemp = {};

championFiles.forEach((championFile) => {
  const champion = require(`../champion-details/${championFile}`);

  const name = champion.name;
  const id = champion.name.replace(/ |-/g, "_").replace(/‘|’/g, "");
  const faction = champion.class.faction;
  const rarity = champion.class.rarity.toLowerCase();
  const role = champion.class.role.toLowerCase();
  const affinity = champion.class.affinity.toLowerCase();

  if (factionsTemp[faction] === undefined) {
    factionsTemp[faction] = [];
  }

  factionsTemp[faction].push(name);
  rarities[rarity].push(name);
  roles[role].push(name);
  affinities[affinity].push(name);

  let aura;

  if (champion.aura !== undefined) {
    aura = generateAura(champion.aura, name, aurasTemp);
  }

  champion.skills.forEach(({ description, abilityname }) => {
    if (abilityname === "Aura") {
      // Old method for declaring aura
      aura = generateAura(description, name, aurasTemp);
    }
  });

  baseInfos[name] = {
    id,
    rarity,
    affinity,
    faction,
    role,
    aura,
    avatarUrl: champion.avatarUrl,
    detailsUrl: `https://mcradane.github.io/raid-data/champion-details/${championFile}`,
  };
});

const aurasStatsName = Object.keys(aurasTemp).sort();
const auras = {};
aurasStatsName.forEach((stat) => {
  //const auraDomaines = aurasTemp[name];
  const aurasDomainsName = Object.keys(aurasTemp[stat]).sort();
  const auraDomaines = {};

  aurasDomainsName.forEach((name) => {
    auraDomaines[name] = aurasTemp[stat][name];
  });

  auras[stat] = auraDomaines;
});

const factionsNames = Object.keys(factionsTemp).sort();
const factions = {};
factionsNames.forEach((name) => {
  factions[name] = factionsTemp[name];
});

const destDir = path.resolve(__dirname, "..");

fs.writeFileSync(
  path.resolve(destDir, "champions-base-info.json"),
  JSON.stringify(baseInfos, null, 2)
);
fs.writeFileSync(
  path.resolve(destDir, "champions-by-affinity.json"),
  JSON.stringify(affinities, null, 2)
);
fs.writeFileSync(
  path.resolve(destDir, "champions-by-faction.json"),
  JSON.stringify(factions, null, 2)
);
fs.writeFileSync(
  path.resolve(destDir, "champions-by-rarity.json"),
  JSON.stringify(rarities, null, 2)
);
fs.writeFileSync(
  path.resolve(destDir, "champions-by-role.json"),
  JSON.stringify(roles, null, 2)
);
fs.writeFileSync(
  path.resolve(destDir, "champions-by-aura.json"),
  JSON.stringify(auras, null, 2)
);
