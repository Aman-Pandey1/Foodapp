/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import RootNavigation from './src/navigation';
import { AuthProvider } from './src/providers/AuthProvider';
import { StatusBar } from 'react-native';

export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" />
      <RootNavigation />
    </AuthProvider>
  );
}
