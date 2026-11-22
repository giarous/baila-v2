import React, {createContext, useContext, useState} from 'react';
import {photoCards} from '../../constants';
import {createDeck} from '../game/deck';

const GameContext = createContext(null);

/** In-memory session state, deliberately kept above navigation to survive route changes. */
export function GameProvider({children}) {
  // Selection belongs to the session, not to route params or module globals.
  const [cards, setCards] = useState(() =>
    photoCards.map((card) => ({...card})),
  );
  const [language, setLanguage] = useState('en');
  const [deck, setDeck] = useState([]);

  const toggleCard = (name) => {
    setCards((current) =>
      current.map((card) =>
        card.name === name ? {...card, state: !card.state} : card,
      ),
    );
  };
  const selectAll = (selected) => {
    setCards((current) => current.map((card) => ({...card, state: selected})));
  };
  const startGame = () => {
    const nextDeck = createDeck(cards);
    setDeck(nextDeck);
    return nextDeck.length > 0;
  };

  return (
    <GameContext.Provider
      value={{
        cards,
        deck,
        language,
        setLanguage,
        toggleCard,
        selectAll,
        startGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const game = useContext(GameContext);
  if (!game) {
    throw new Error('useGame must be used inside GameProvider');
  }
  return game;
}
