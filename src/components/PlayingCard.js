import CardArtwork from './CardArtwork';
import React from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {useGame} from '../state/GameContext';
import {localizeCard} from '../game/deck';
import {colors} from '../theme';

export default function PlayingCard({card}) {
  const {language} = useGame();
  const {title, description} = localizeCard(card, language);
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.eyebrow}>
          {card.isIntroduction ? 'BEFORE YOU BEGIN' : 'YOUR NEXT MOVE'}
        </Text>
        <Text style={styles.mark}>b.</Text>
      </View>
      <View style={styles.artwork}>
        <CardArtwork source={card.photo} style={styles.image} />
      </View>
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <ScrollView
          showsVerticalScrollIndicator
          nestedScrollEnabled
          style={styles.rules}>
          <Text style={styles.description}>{description}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 26,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.teal,
  },
  mark: {
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: -2,
    color: colors.coral,
  },
  artwork: {height: '36%', marginVertical: 12, alignItems: 'center'},
  image: {height: '100%'},
  copy: {flex: 1, paddingHorizontal: 22, paddingBottom: 20},
  title: {
    fontWeight: '800',
    fontSize: 26,
    color: colors.ink,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  rules: {flex: 1},
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.muted,
    paddingBottom: 8,
  },
});
