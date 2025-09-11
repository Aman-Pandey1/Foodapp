module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin',
    // Worklets plugin must be last for Reanimated 4+
  ],
};
