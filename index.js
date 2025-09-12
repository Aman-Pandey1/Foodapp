/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { View } from 'react-native';
let GestureHandlerRootView = View;
try {
  // eslint-disable-next-line global-require
  GestureHandlerRootView = require('react-native-gesture-handler').GestureHandlerRootView;
} catch (_e) {
  // fallback to View if native module is unavailable (tests)
}
import { enableScreens } from 'react-native-screens';
import { AppRegistry } from 'react-native';
import App from './src/App';
import ErrorBoundary from './src/components/ErrorBoundary';
import { name as appName } from './app.json';

try {
  enableScreens(true);
} catch (_e) {
  // no-op if native screens not available; prevents startup crash in unstable envs
}

function Root() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent(appName, () => Root);
