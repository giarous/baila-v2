import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GameProvider} from './src/state/GameContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <AppNavigator />
      </GameProvider>
    </SafeAreaProvider>
  );
}
