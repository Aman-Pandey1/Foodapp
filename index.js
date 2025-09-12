/**
 * @format
 */

import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
