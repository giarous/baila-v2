import React from 'react';
import {Text, TextInput} from 'react-native';
import renderer, {act} from 'react-test-renderer';
import {GameProvider, useGame} from '../src/state/GameContext';
import HomeScreen from '../src/screens/HomeScreen';
import SelectionScreen from '../src/screens/SelectionScreen';
import InstructionsScreen from '../src/screens/InstructionsScreen';
import GameScreen from '../src/screens/GameScreen';
import {Button} from '../src/components/UI';
import Swiper from 'react-native-deck-swiper';

// Gesture animations require a device; keep screen tests focused on the callbacks.
jest.mock('react-native-deck-swiper', () => {
  const ReactModule = require('react');
  return ReactModule.forwardRef((props, ref) => {
    ReactModule.useImperativeHandle(ref, () => ({swipeRight: jest.fn()}));
    return null;
  });
});

let app;
let game;
let navigation;
function Probe() {
  game = useGame();
  return null;
}
function mount(Screen) {
  navigation = {navigate: jest.fn(), goBack: jest.fn(), popToTop: jest.fn()};
  act(() => {
    app = renderer.create(
      <GameProvider>
        <Probe />
        <Screen navigation={navigation} />
      </GameProvider>,
    );
  });
}
function textIncludes(value) {
  return app.root
    .findAllByType(Text)
    .some(
      node =>
        typeof node.props.children === 'string' &&
        node.props.children.includes(value),
    );
}
afterEach(() => {
  if (app) {
    act(() => app.unmount());
  }
});

it('updates selection immutably and retains it when starting a new game', () => {
  mount(SelectionScreen);
  const original = game.cards;
  const barman = app.root.findByProps({
    accessibilityRole: 'checkbox',
    accessibilityLabel: 'Barman',
  });
  act(() => barman.props.onPress());
  expect(original[0].state).toBe(true);
  expect(game.cards[0].state).toBe(false);
  expect(barman.props.accessibilityState.checked).toBe(false);
  act(() => {
    game.startGame();
  });
  expect(game.deck).toHaveLength(109);
  expect(game.deck.some(card => card.name === 'Barman')).toBe(false);
});

it('prevents an empty game and permits starting again after selection', () => {
  mount(HomeScreen);
  act(() => game.selectAll(false));
  expect(app.root.findByType(Button).props.disabled).toBe(true);
  act(() => app.root.findByType(Button).props.onPress());
  expect(navigation.navigate).not.toHaveBeenCalled();
  act(() => game.toggleCard('Barman'));
  act(() => app.root.findByType(Button).props.onPress());
  expect(navigation.navigate).toHaveBeenCalledWith('NewGame');
  expect(game.deck).toHaveLength(5);
});

it('searches bilingual names, expands rules, and switches their language', () => {
  mount(InstructionsScreen);
  const search = app.root.findByType(TextInput);
  act(() => search.props.onChangeText('Бармен'));
  act(() =>
    app.root
      .findByProps({accessibilityRole: 'button', accessibilityLabel: 'Barman'})
      .props.onPress(),
  );
  expect(textIncludes(game.cards[0].description)).toBe(true);
  act(() =>
    app.root.findByProps({accessibilityLabel: 'Russian rules'}).props.onPress(),
  );
  expect(textIncludes(game.cards[0].description_ru)).toBe(true);
  expect(
    app.root.findByProps({
      accessibilityRole: 'button',
      accessibilityLabel: 'Бармен',
    }).props.accessibilityState.expanded,
  ).toBe(true);
  act(() => search.props.onChangeText('nothing matches this'));
  expect(textIncludes('No cards found')).toBe(true);
});

it('selects and clears the whole catalogue', () => {
  mount(SelectionScreen);
  const toggle = () =>
    app.root
      .findAllByProps({accessibilityRole: 'button'})
      .find(node =>
        node
          .findAllByType(Text)
          .some(text =>
            ['Select all', 'Clear all'].includes(text.props.children),
          ),
      );
  act(() => toggle().props.onPress());
  expect(game.cards.every(card => !card.state)).toBe(true);
  act(() => toggle().props.onPress());
  expect(game.cards.every(card => card.state)).toBe(true);
});

it('advances the card counter and returns home when the deck is exhausted', () => {
  mount(GameScreen);
  act(() => {
    game.startGame();
  });
  const stage = app.root.findAll(
    node => typeof node.props.onLayout === 'function',
  )[0];
  act(() =>
    stage.props.onLayout({nativeEvent: {layout: {width: 320, height: 450}}}),
  );
  let swiper = app.root.findByType(Swiper);
  expect(swiper.props.cards).toHaveLength(113);
  act(() => swiper.props.onSwiped(0));
  expect(textIncludes('1 / 112')).toBe(true);
  swiper = app.root.findByType(Swiper);
  act(() => swiper.props.onSwipedAll());
  expect(navigation.popToTop).toHaveBeenCalled();
});
