import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {Alert, Text, TextInput} from 'react-native';
import App from '../App';
import {translations} from '../src/i18n';
import {photoCards} from '../constants';

it('has the same complete UI vocabulary in both languages', () => {
  expect(Object.keys(translations.ru).sort()).toEqual(
    Object.keys(translations.en).sort(),
  );
  Object.keys(translations.en).forEach((key) => {
    expect(typeof translations.ru[key]).toBe(typeof translations.en[key]);
  });
});

it('switches buttons, instructions, card details, and dialogs together across navigation', async () => {
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
    expect(hasText('BAILA')).toBe(true);
    await tap('language-ru');
    expect(app.root.findByProps({testID: 'start-game'}).props.title).toBe(
      'Начать игру',
    );
    expect(app.root.findByProps({testID: 'choose-cards'}).props.title).toBe(
      'Выбрать карты',
    );
    expect(app.root.findByProps({testID: 'how-to-play'}).props.title).toBe(
      'Как играть',
    );
    await tap('choose-cards');
    expect(hasText('Ваша колода')).toBe(true);
    expect(hasText(translations.ru.copiesHint)).toBe(true);
    expect(hasText('Снять выбор')).toBe(true);
    expect(app.root.findByProps({testID: 'selection-done'}).props.title).toBe(
      'Готово · Карт: 112',
    );
    await tap('select-all');
    expect(hasText(translations.ru.emptySelection)).toBe(true);
    expect(hasText('Выбрать все')).toBe(true);
    expect(app.root.findByProps({testID: 'selection-done'}).props.title).toBe(
      'Готово · Карт: 0',
    );
    await tap('select-all');
    await tap('selection-done');
    await tap('how-to-play');
    expect(hasText('Как играть')).toBe(true);
    expect(hasText('Основные правила')).toBe(true);
    expect(hasText('Правила карт')).toBe(true);
    const search = app.root.findByType(TextInput);
    expect(search.props.placeholder).toBe('Найти карту…');
    expect(search.props.accessibilityLabel).toBe('Поиск карт');
    await act(async () => {
      search.props.onChangeText('no matching card');
    });
    expect(hasText(translations.ru.noCards)).toBe(true);
    await act(async () => {
      search.props.onChangeText('Бармен');
    });

    const barman = app.root.findByProps({
      accessibilityRole: 'button',
      accessibilityLabel: 'Бармен',
    });
    await act(async () => {
      barman.props.onPress();
    });
    expect(hasText(photoCards[0].description_ru)).toBe(true);
    expect(hasText(photoCards[0].description)).toBe(false);
    await tap('back-home');
    await tap('start-game');
    expect(app.root.findByProps({testID: 'card-details'}).props.title).toBe(
      'Подробнее',
    );
    expect(app.root.findByProps({testID: 'next-card'}).props.title).toBe(
      'Следующая →',
    );
    await tap('card-details');
    const [title, body, buttons] =
      alert.mock.calls[alert.mock.calls.length - 1];
    expect(
      photoCards.some(
        (card) => card.name_ru === title && card.description_ru === body,
      ),
    ).toBe(true);
    expect(buttons).toEqual([{text: 'Закрыть'}]);
    await tap('back-home');
    expect(alert).toHaveBeenLastCalledWith('Выйти из игры?', '', [
      {text: 'Продолжить', style: 'cancel'},
      {text: 'Выйти', style: 'destructive', onPress: expect.any(Function)},
    ]);
    await act(async () => {
      alert.mock.calls[alert.mock.calls.length - 1][2][1].onPress();
    });
    expect(app.root.findByProps({testID: 'start-game'}).props.title).toBe(
      'Начать игру',
    );
    await tap('language-en');
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
