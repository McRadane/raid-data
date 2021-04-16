# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.10.0] - 2021-04-16

### Added

- Added new champions

### Changed

- Changed some skill image name
- Updated Champion's ID

## [3.40.1] - 2021-03-30

### Added

- Added new champions
- Added storage_roominess image

### Changed

- Changed aura filename that contain hash and numbers
- Normalized aura text and add the stat value

## [3.30.2] - 2021-03-02

### Added

- Added skills images

### Changed

- Bump to version 3.30.2
- Added image link for each skills in details

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
