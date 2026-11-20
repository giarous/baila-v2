import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {Text} from 'react-native';
import {GameProvider, useGame} from '../src/state/GameContext';
import GameScreen from '../src/screens/GameScreen';

it('draws the entire deck through the real swiper and its Next card control', async () => {
  jest.useFakeTimers();
  let game;
  let app;
  const navigation = {popToTop: jest.fn()};
  function Probe() {
    game = useGame();
    return null;
  }
  try {
    await act(async () => {
      app = renderer.create(
        <GameProvider>
          <Probe />
          <GameScreen navigation={navigation} />
        </GameProvider>,
      );
    });
    await act(async () => {
      game.selectAll(false);
    });
    await act(async () => {
      game.toggleCard('Barman');
    });
    await act(async () => {
      game.startGame();
    });
    const stage = app.root.findAll(
      (node) => typeof node.props.onLayout === 'function',
    )[0];
    await act(async () => {
      stage.props.onLayout({nativeEvent: {layout: {width: 320, height: 420}}});
    });
    // Start immediately with four playable cards and return home after the last.
    for (let draw = 0; draw < 4; draw += 1) {
      await act(async () => {
        app.root.findByProps({testID: 'next-card'}).props.onPress();
      });
      await act(async () => {
        jest.advanceTimersByTime(1500);
      });
      if (draw === 0) {
        expect(
          app.root
            .findAllByType(Text)
            .some((node) => node.props.children === '2 / 4'),
        ).toBe(true);
      }
    }
    expect(navigation.popToTop).toHaveBeenCalledTimes(1);
  } finally {
    if (app) {
      await act(async () => {
        app.unmount();
      });
    }
    jest.clearAllTimers();
    jest.useRealTimers();
  }
});
