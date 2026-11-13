import React from 'react';
import {Text, TextInput, ScrollView, Alert} from 'react-native';
import renderer, {act} from 'react-test-renderer';
import {GameProvider, useGame} from '../src/state/GameContext';
import HomeScreen from '../src/screens/HomeScreen';
import SelectionScreen from '../src/screens/SelectionScreen';
import InstructionsScreen from '../src/screens/InstructionsScreen';
import GameScreen from '../src/screens/GameScreen';
import PlayingCard from '../src/components/PlayingCard';
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
  jest.restoreAllMocks();
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
  expect(game.deck).toHaveLength(108);
  expect(game.deck.some(card => card.name === 'Barman')).toBe(false);
});

it('prevents an empty game and permits starting again after selection', () => {
  mount(HomeScreen);
  act(() => game.selectAll(false));
  expect(app.root.findByProps({testID: 'start-game'}).props.disabled).toBe(
    true,
  );
  act(() => app.root.findByProps({testID: 'start-game'}).props.onPress());
  expect(navigation.navigate).not.toHaveBeenCalled();
  act(() => game.toggleCard('Barman'));
  act(() => app.root.findByProps({testID: 'start-game'}).props.onPress());
  expect(navigation.navigate).toHaveBeenCalledWith('NewGame');
  expect(game.deck).toHaveLength(4);
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
  expect(swiper.props.cards).toHaveLength(112);
  act(() => swiper.props.onSwiped(0));
  expect(textIncludes('2 / 112')).toBe(true);
  swiper = app.root.findByType(Swiper);
  act(() => swiper.props.onSwipedAll());
  expect(navigation.popToTop).toHaveBeenCalled();
});

it('keeps home fixed with three equally structured actions and no marketing copy', () => {
  mount(HomeScreen);
  expect(app.root.findAllByType(ScrollView)).toHaveLength(0);
  for (const [id, route] of [
    ['choose-cards', 'Settings'],
    ['how-to-play', 'Descriptions'],
  ]) {
    const action = app.root.findByProps({testID: id});
    expect(action.props.secondary).toBe(true);
    act(() => action.props.onPress());
    expect(navigation.navigate).toHaveBeenCalledWith(route);
  }
  expect(textIncludes('Less scrolling.')).toBe(false);
});

it('shows rules only when Details is pressed, in the selected language', () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  mount(GameScreen);
  act(() => {
    game.startGame();
  });
  expect(alert).not.toHaveBeenCalled();
  expect(app.root.findAllByType(ScrollView)).toHaveLength(0);
  const details = () =>
    app.root.findByProps({testID: 'card-details'}).props.onPress();
  act(() => details());
  expect(alert).toHaveBeenLastCalledWith(
    game.deck[0].name,
    game.deck[0].description,
    expect.any(Array),
  );
  act(() => {
    game.setLanguage('ru');
  });
  act(() => details());
  expect(alert).toHaveBeenLastCalledWith(
    game.deck[0].name_ru,
    game.deck[0].description_ru,
    [{text: 'Закрыть'}],
  );
  const stage = app.root.findAll(
    node => typeof node.props.onLayout === 'function',
  )[0];
  act(() =>
    stage.props.onLayout({nativeEvent: {layout: {width: 320, height: 450}}}),
  );
  act(() => app.root.findByType(Swiper).props.onSwiped(0));
  act(() => details());
  expect(alert).toHaveBeenLastCalledWith(
    game.deck[1].name_ru,
    game.deck[1].description_ru,
    expect.any(Array),
  );
});

it('renders gameplay cards as artwork without inline text or scrolling', () => {
  mount(() => (
    <PlayingCard
      card={{
        name: 'Test card',
        name_ru: 'Карта',
        photo: 1,
        description: 'Hidden rules',
        description_ru: 'Правила',
      }}
    />
  ));
  expect(app.root.findAllByType(Text)).toHaveLength(0);
  expect(app.root.findAllByType(ScrollView)).toHaveLength(0);
  expect(textIncludes('Hidden rules')).toBe(false);
});
