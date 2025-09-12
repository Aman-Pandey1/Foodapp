module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Use only Worklets plugin (Reanimated v4 delegates to Worklets plugin)
    'react-native-worklets/plugin',
  ],
};
