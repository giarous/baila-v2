import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {GameProvider} from './src/state/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import SelectionScreen from './src/screens/SelectionScreen';
import InstructionsScreen from './src/screens/InstructionsScreen';
import GameScreen from './src/screens/GameScreen';

const Navigator = createAppContainer(
  createStackNavigator(
    {
      Home: HomeScreen,
      Settings: SelectionScreen,
      Descriptions: InstructionsScreen,
      NewGame: GameScreen,
    },
    {initialRouteName: 'Home', headerMode: 'none'},
  ),
);

export default function App() {
  return (
    <GameProvider>
      <Navigator />
    </GameProvider>
  );
}
