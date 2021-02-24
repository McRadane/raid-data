# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.30.0] - 2021-02-24

### Added

- Added missing champions
- Added missing avatars
- Added missing sets icons
- Added script for generating base json
- Added champions-by-aura.json
- Added champions.json
- Added CHANGELOG

### Changed

- The champions-base-info has now id and aura properties
- Champions json files now contains id, version (game version)
- All url use now mcradane github cdn
- The skills array of champions json files has a flag "passive"
- The skills array of champions json files not show aura anymore. An aura field for the champion has been added instead
- The skills array of champions json files has a damageMultiplier property
- Champions json files affinity, rarity and role is now in lowercase
- Champions json files stats are now in number
- Package version follow RAID Shadow Legends game version
