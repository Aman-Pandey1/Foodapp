module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Keep Worklets plugin before Reanimated
    'react-native-worklets/plugin',
    // Reanimated plugin MUST be listed last
    'react-native-reanimated/plugin',
  ],
};
