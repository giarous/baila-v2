export const COPIES_PER_CARD = 4;

export const introduction = {
  name: 'The night starts here',
  name_ru: 'Игра начинается здесь',
  photo: require('../../assets/baila_start_screen.jpg'),
  description:
    'Baila is played with at least three people. Everyone needs their own drink. Place an empty glass in the middle of the table, with the cards arranged in a circle around it. The player next to the dealer goes first. Take turns drawing a card and follow its rules. The game ends when there are no cards left.',
  description_ru:
    'В эту игру лучше играть трем или более участникам. Каждому нужен свой напиток. Поставьте пустой бокал в центре стола и расположите карты вокруг него по кругу. Первым ходит игрок рядом с дилером. По очереди берите карту и выполняйте её правила. Игра заканчивается, когда карт больше не осталось.',
  isIntroduction: true,
};

/**
 * Fisher–Yates returns a new array; the shared catalogue is never reordered.
 * Injecting randomness makes game rules testable without relying on lucky draws.
 * @template T
 * @param {T[]} cards
 * @param {() => number} random A generator returning a value in [0, 1).
 * @returns {T[]}
 */
export function shuffle(cards, random = Math.random) {
  const result = cards.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(random() * (index + 1));
    [result[index], result[nextIndex]] = [result[nextIndex], result[index]];
  }
  return result;
}

/**
 * Create a session-owned deck: four copies per enabled type, no introduction card.
 * Copies are independent of selection state; an empty selection cannot start play.
 */
export function createDeck(cards, random = Math.random) {
  const enabled = cards.filter((card) => card.state);
  if (!enabled.length) {
    return [];
  }
  const copies = [];
  enabled.forEach((card) => {
    for (let copy = 0; copy < COPIES_PER_CARD; copy += 1) {
      copies.push({...card});
    }
  });
  return shuffle(copies, random);
}

/** Resolve catalogue copy at render time so a language change is immediate. */
export function localizeCard(card, language) {
  return language === 'ru'
    ? {title: card.name_ru, description: card.description_ru}
    : {title: card.name, description: card.description};
}
