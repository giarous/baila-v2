import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {BackHandler} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GameProvider} from './src/state/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import SelectionScreen from './src/screens/SelectionScreen';
import InstructionsScreen from './src/screens/InstructionsScreen';
import GameScreen from './src/screens/GameScreen';

const screens = {
  Home: HomeScreen,
  Settings: SelectionScreen,
  Descriptions: InstructionsScreen,
  NewGame: GameScreen,
};

function Navigator() {
  const [route, setRoute] = useState('Home');
  const home = useCallback(() => setRoute('Home'), []);
  const navigation = useMemo(
    () => ({navigate: setRoute, goBack: home, popToTop: home}),
    [home],
  );
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (route === 'Home') {
          return false;
        }
        home();
        return true;
      },
    );
    return () => subscription.remove();
  }, [home, route]);
  const Screen = screens[route] || HomeScreen;
  return <Screen navigation={navigation} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <Navigator />
      </GameProvider>
    </SafeAreaProvider>
  );
}
