import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {BackHandler} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SelectionScreen from '../screens/SelectionScreen';
import InstructionsScreen from '../screens/InstructionsScreen';
import GameScreen from '../screens/GameScreen';

// Four routes need no native navigation dependency. The session provider stays
// above this router so selection survives screen changes.
const screens = {
  Home: HomeScreen,
  Settings: SelectionScreen,
  Descriptions: InstructionsScreen,
  NewGame: GameScreen,
};

export default function AppNavigator() {
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
