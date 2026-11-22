import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {Alert, Image, Text, TextInput} from 'react-native';
import App from '../App';
import {strings} from '../src/content';
import {photoCards} from '../constants';

it('keeps the complete navigation flow, rules, and dialogs English-only', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  let app;
  const tap = async (id) => {
    await act(async () => {
      app.root.findByProps({testID: id}).props.onPress();
    });
  };
  const hasText = (text) =>
    app.root.findAllByType(Text).some((node) => node.props.children === text);
  try {
    await act(async () => {
      app = renderer.create(<App />);
    });
    expect(hasText('BAILA')).toBe(false);
    expect(app.root.findByType(Image).props.accessibilityLabel).toBe('BAILA');
    expect(
      app.root.findAll(
        (node) =>
          typeof node.props.testID === 'string' &&
          node.props.testID.startsWith('language-'),
      ),
    ).toHaveLength(0);
    expect(app.root.findByProps({testID: 'start-game'}).props.title).toBe(
      'Let’s play',
    );
    expect(app.root.findByProps({testID: 'choose-cards'}).props.title).toBe(
      'Make it your deck',
    );
    expect(app.root.findByProps({testID: 'how-to-play'}).props.title).toBe(
      'How to play',
    );
    await tap('choose-cards');
    expect(hasText('Your deck')).toBe(true);
    expect(hasText(strings.copiesHint)).toBe(true);
    expect(hasText('Clear all')).toBe(true);
    expect(app.root.findByProps({testID: 'selection-done'}).props.title).toBe(
      'Done · 112 cards',
    );
    await tap('select-all');
    expect(hasText(strings.emptySelection)).toBe(true);
    expect(hasText('Select all')).toBe(true);
    expect(app.root.findByProps({testID: 'selection-done'}).props.title).toBe(
      'Done · 0 cards',
    );
    await tap('select-all');
    await tap('selection-done');
    await tap('how-to-play');
    expect(hasText('How to play')).toBe(true);
    expect(hasText('The basics')).toBe(true);
    expect(hasText('Card rules')).toBe(true);
    const search = app.root.findByType(TextInput);
    expect(search.props.placeholder).toBe('Find a card…');
    expect(search.props.accessibilityLabel).toBe('Search cards');
    await act(async () => {
      search.props.onChangeText('no matching card');
    });
    expect(hasText(strings.noCards)).toBe(true);
    await act(async () => {
      search.props.onChangeText('Barman');
    });

    const barman = app.root.findByProps({
      accessibilityRole: 'button',
      accessibilityLabel: 'Barman',
    });
    await act(async () => {
      barman.props.onPress();
    });
    expect(hasText(photoCards[0].description)).toBe(true);
    await tap('back-home');
    await tap('start-game');
    expect(app.root.findByProps({testID: 'card-details'}).props.title).toBe(
      'Details',
    );
    expect(app.root.findByProps({testID: 'next-card'}).props.title).toBe(
      'Next card →',
    );
    await tap('card-details');
    const [title, body, buttons] =
      alert.mock.calls[alert.mock.calls.length - 1];
    expect(
      photoCards.some(
        (card) => card.name === title && card.description === body,
      ),
    ).toBe(true);
    expect(buttons).toEqual([{text: 'Close'}]);
    await tap('back-home');
    expect(alert).toHaveBeenLastCalledWith('Leave this game?', '', [
      {text: 'Keep playing', style: 'cancel'},
      {text: 'Leave game', style: 'destructive', onPress: expect.any(Function)},
    ]);
    await act(async () => {
      alert.mock.calls[alert.mock.calls.length - 1][2][1].onPress();
    });
    expect(app.root.findByProps({testID: 'start-game'}).props.title).toBe(
      'Let’s play',
    );
  } finally {
    if (app) {
      await act(async () => {
        app.unmount();
      });
    }
    alert.mockRestore();
  }
});
