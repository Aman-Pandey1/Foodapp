// Enable CSS if needed and improve stability for Reanimated on Expo SDK 53
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;

