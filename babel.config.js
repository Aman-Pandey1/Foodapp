module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Worklets plugin must be last for Reanimated 4+
    'react-native-worklets/plugin',
  ],
};
