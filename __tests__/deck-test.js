import {photoCards} from '../constants';
import {
  createDeck,
  shuffle,
  localizeCard,
  introduction,
} from '../src/game/deck';

it('keeps four copies of each enabled card and puts the guide first', () => {
  const cards = photoCards.map((card, index) => ({...card, state: index < 2}));
  const original = JSON.stringify(cards);
  const deck = createDeck(cards, () => 0.5);

  expect(deck).toHaveLength(9);
  expect(deck[0]).toEqual(introduction);
  cards.slice(0, 2).forEach(card => {
    expect(deck.filter(item => item.name === card.name)).toHaveLength(4);
  });
  expect(JSON.stringify(cards)).toBe(original);
  // A session owns its card objects; a later game cannot mutate this one.
  deck[1].state = false;
  expect(cards[0].state).toBe(true);
  expect(cards[1].state).toBe(true);
});

it('supports the complete original catalogue and excludes disabled cards', () => {
  expect(photoCards).toHaveLength(28);
  expect(createDeck(photoCards)).toHaveLength(113);
  expect(createDeck(photoCards.map(card => ({...card, state: false})))).toEqual(
    [],
  );
});

it('shuffles without losing, duplicating, or mutating entries', () => {
  const source = [1, 2, 3, 4];
  const result = shuffle(source, () => 0);
  expect(result).toEqual([2, 3, 4, 1]);
  expect(source).toEqual([1, 2, 3, 4]);
  expect(result.slice().sort()).toEqual(source);
});

it('preserves the English and Russian rule text', () => {
  photoCards.forEach(card => {
    expect(localizeCard(card, 'en')).toEqual({
      title: card.name,
      description: card.description,
    });
    expect(localizeCard(card, 'ru')).toEqual({
      title: card.name_ru,
      description: card.description_ru,
    });
  });
});
