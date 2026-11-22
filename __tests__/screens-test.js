import React from 'react';
import {Text, TextInput, ScrollView, Alert} from 'react-native';
import renderer, {act} from 'react-test-renderer';
import {GameProvider, useGame} from '../src/state/GameContext';
import HomeScreen from '../src/screens/HomeScreen';
import SelectionScreen from '../src/screens/SelectionScreen';
import InstructionsScreen from '../src/screens/InstructionsScreen';
import GameScreen from '../src/screens/GameScreen';
import PlayingCard from '../src/components/PlayingCard';
import Swiper from '../src/components/CardStack';

// Gesture animations require a device; keep screen tests focused on the callbacks.
jest.mock('../src/components/CardStack', () => {
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
async function mount(Screen) {
  navigation = {navigate: jest.fn(), goBack: jest.fn(), popToTop: jest.fn()};
  await act(async () => {
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
      (node) =>
        typeof node.props.children === 'string' &&
        node.props.children.includes(value),
    );
}
afterEach(async () => {
  jest.restoreAllMocks();
  if (app) {
    await act(async () => app.unmount());
  }
});

it('updates selection immutably and retains it when starting a new game', async () => {
  await mount(SelectionScreen);
  const original = game.cards;
  const barman = app.root.findByProps({
    accessibilityRole: 'checkbox',
    accessibilityLabel: 'Barman',
  });
  await act(async () => barman.props.onPress());
  expect(original[0].state).toBe(true);
  expect(game.cards[0].state).toBe(false);
  expect(barman.props.accessibilityState.checked).toBe(false);
  await act(async () => {
    game.startGame();
  });
  expect(game.deck).toHaveLength(108);
  expect(game.deck.some((card) => card.name === 'Barman')).toBe(false);
});

it('prevents an empty game and permits starting again after selection', async () => {
  await mount(HomeScreen);
  await act(async () => game.selectAll(false));
  expect(app.root.findByProps({testID: 'start-game'}).props.disabled).toBe(
    true,
  );
  await act(async () =>
    app.root.findByProps({testID: 'start-game'}).props.onPress(),
  );
  expect(navigation.navigate).not.toHaveBeenCalled();
  await act(async () => game.toggleCard('Barman'));
  await act(async () =>
    app.root.findByProps({testID: 'start-game'}).props.onPress(),
  );
  expect(navigation.navigate).toHaveBeenCalledWith('NewGame');
  expect(game.deck).toHaveLength(4);
});

it('searches English names case-insensitively and expands matching rules', async () => {
  await mount(InstructionsScreen);
  const search = app.root.findByType(TextInput);
  await act(async () => search.props.onChangeText('  bArMaN  '));
  await act(async () =>
    app.root
      .findByProps({accessibilityRole: 'button', accessibilityLabel: 'Barman'})
      .props.onPress(),
  );
  expect(textIncludes(game.cards[0].description)).toBe(true);
  await act(async () => search.props.onChangeText('nothing matches this'));
  expect(textIncludes('No cards found')).toBe(true);
});

it('selects and clears the whole catalogue', async () => {
  await mount(SelectionScreen);
  const toggle = () =>
    app.root
      .findAllByProps({accessibilityRole: 'button'})
      .find((node) =>
        node
          .findAllByType(Text)
          .some((text) =>
            ['Select all', 'Clear all'].includes(text.props.children),
          ),
      );
  await act(async () => toggle().props.onPress());
  expect(game.cards.every((card) => !card.state)).toBe(true);
  await act(async () => toggle().props.onPress());
  expect(game.cards.every((card) => card.state)).toBe(true);
});

it('advances the card counter and returns home when the deck is exhausted', async () => {
  await mount(GameScreen);
  await act(async () => {
    game.startGame();
  });
  const stage = app.root.findAll(
    (node) => typeof node.props.onLayout === 'function',
  )[0];
  await act(async () =>
    stage.props.onLayout({nativeEvent: {layout: {width: 320, height: 450}}}),
  );
  let swiper = app.root.findByType(Swiper);
  expect(swiper.props.cards).toHaveLength(112);
  await act(async () => swiper.props.onSwiped(0));
  expect(textIncludes('2 / 112')).toBe(true);
  swiper = app.root.findByType(Swiper);
  await act(async () => swiper.props.onSwipedAll());
  expect(navigation.popToTop).toHaveBeenCalled();
});

it('keeps home fixed with three equally structured actions and no marketing copy', async () => {
  await mount(HomeScreen);
  expect(app.root.findAllByType(ScrollView)).toHaveLength(0);
  for (const [id, route] of [
    ['choose-cards', 'Settings'],
    ['how-to-play', 'Descriptions'],
  ]) {
    const action = app.root.findByProps({testID: id});
    expect(action.props.secondary).toBe(true);
    await act(async () => action.props.onPress());
    expect(navigation.navigate).toHaveBeenCalledWith(route);
  }
  expect(textIncludes('Less scrolling.')).toBe(false);
});

it('shows English rules only when Details is pressed and follows the current card', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  await mount(GameScreen);
  await act(async () => {
    game.startGame();
  });
  expect(alert).not.toHaveBeenCalled();
  expect(app.root.findAllByType(ScrollView)).toHaveLength(0);
  const details = () =>
    app.root.findByProps({testID: 'card-details'}).props.onPress();
  await act(async () => details());
  expect(alert).toHaveBeenLastCalledWith(
    game.deck[0].name,
    game.deck[0].description,
    expect.any(Array),
  );
  const stage = app.root.findAll(
    (node) => typeof node.props.onLayout === 'function',
  )[0];
  await act(async () =>
    stage.props.onLayout({nativeEvent: {layout: {width: 320, height: 450}}}),
  );
  await act(async () => app.root.findByType(Swiper).props.onSwiped(0));
  await act(async () => details());
  expect(alert).toHaveBeenLastCalledWith(
    game.deck[1].name,
    game.deck[1].description,
    expect.any(Array),
  );
});

it('renders gameplay cards as artwork without inline text or scrolling', async () => {
  await mount(() => (
    <PlayingCard
      card={{
        name: 'Test card',

        photo: 1,
        description: 'Hidden rules',
      }}
    />
  ));
  expect(app.root.findAllByType(Text)).toHaveLength(0);
  expect(app.root.findAllByType(ScrollView)).toHaveLength(0);
  expect(textIncludes('Hidden rules')).toBe(false);
});

it('opens English selection-card information without changing selection', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  await mount(SelectionScreen);
  const original = game.cards;
  await act(async () =>
    app.root.findByProps({testID: 'card-info-Barman'}).props.onPress(),
  );
  expect(alert).toHaveBeenLastCalledWith(
    game.cards[0].name,
    game.cards[0].description,
    [{text: 'Close'}],
  );
  expect(game.cards).toBe(original);
  await act(async () => {
    game.toggleCard('Barman');
  });
  const selectionBeforeInfo = game.cards;
  const info = app.root.findByProps({testID: 'card-info-Barman'});
  expect(info.props.accessibilityLabel).toBe('Information about Barman');
  await act(async () => info.props.onPress());
  expect(alert).toHaveBeenLastCalledWith(
    game.cards[0].name,
    game.cards[0].description,
    [{text: 'Close'}],
  );
  expect(game.cards).toBe(selectionBeforeInfo);
  expect(game.cards[0].state).toBe(false);
  // FlatList mounts visible rows only; every mounted card has an info action.
  const visible = app.root.findAll(
    (node) => node.props.accessibilityRole === 'checkbox',
    {deep: false},
  );
  expect(visible.length).toBeGreaterThan(0);
  for (const checkbox of visible) {
    const card = game.cards.find(
      (item) => item.name === checkbox.props.accessibilityLabel,
    );
    expect(
      app.root.findByProps({testID: `card-info-${card.name}`}),
    ).toBeDefined();
  }
});
