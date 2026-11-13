import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {Text} from 'react-native';
import {GameProvider, useGame} from '../src/state/GameContext';
import GameScreen from '../src/screens/GameScreen';
import {Button} from '../src/components/UI';

it('draws the entire deck through the real swiper and its Next card control', () => {
  jest.useFakeTimers();
  let game;
  let app;
  const navigation = {popToTop: jest.fn()};
  function Probe() {
    game = useGame();
    return null;
  }
  try {
    act(() => {
      app = renderer.create(
        <GameProvider>
          <Probe />
          <GameScreen navigation={navigation} />
        </GameProvider>,
      );
    });
    act(() => {
      game.selectAll(false);
    });
    act(() => {
      game.toggleCard('Barman');
    });
    act(() => {
      game.startGame();
    });
    const stage = app.root.findAll(
      node => typeof node.props.onLayout === 'function',
    )[0];
    act(() => {
      stage.props.onLayout({nativeEvent: {layout: {width: 320, height: 420}}});
    });
    // One guide and four playable cards. A complete draw must return home once.
    for (let draw = 0; draw < 5; draw += 1) {
      act(() => {
        app.root.findByType(Button).props.onPress();
      });
      act(() => {
        jest.advanceTimersByTime(1500);
      });
      if (draw === 0) {
        expect(
          app.root
            .findAllByType(Text)
            .some(node => node.props.children === '1 / 4'),
        ).toBe(true);
      }
    }
    expect(navigation.popToTop).toHaveBeenCalledTimes(1);
  } finally {
    if (app) {
      act(() => {
        app.unmount();
      });
    }
    jest.clearAllTimers();
    jest.useRealTimers();
  }
});
