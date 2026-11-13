import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {useGame} from '../state/GameContext';
import {localizeCard} from '../game/deck';

/** Keep the whole illustration visible; rules are opened separately with Details. */
export default function PlayingCard({card}) {
  const {language} = useGame();
  return (
    <View style={styles.card}>
      <Image
        source={card.photo}
        accessibilityLabel={localizeCard(card, language).title}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {flex: 1, overflow: 'hidden', borderRadius: 18},
  image: {flex: 1, width: '100%', resizeMode: 'contain'},
});
