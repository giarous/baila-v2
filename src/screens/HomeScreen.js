import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Screen, Button, LanguagePicker} from '../components/UI';
import {useGame} from '../state/GameContext';
import {colors} from '../theme';

export default function HomeScreen({navigation}) {
  const {cards, startGame} = useGame();
  const selected = cards.some(card => card.state);
  const play = () => {
    if (startGame()) {
      navigation.navigate('NewGame');
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.logo}>baila v2</Text>
        <LanguagePicker />
      </View>
      <View style={styles.artwork}>
        <Image
          source={require('../../assets/branding/baila-v2-icon.png')}
          accessibilityLabel="Baila"
          style={styles.image}
        />
      </View>
      <View style={styles.actions}>
        {!selected && (
          <Text style={styles.empty}>Choose a card type to play.</Text>
        )}
        <Button
          title="Let’s play"
          onPress={play}
          disabled={!selected}
          testID="start-game"
        />
        <View style={styles.space} />
        <Button
          title="Make it your deck"
          secondary
          onPress={() => navigation.navigate('Settings')}
          testID="choose-cards"
        />
        <View style={styles.space} />
        <Button
          title="How to play"
          secondary
          onPress={() => navigation.navigate('Descriptions')}
          testID="how-to-play"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  logo: {fontSize: 24, fontWeight: '800', color: colors.ink},
  // The art gives up space before the controls do on smaller phones.
  artwork: {flex: 1, minHeight: 0, marginVertical: 20},
  image: {flex: 1, width: '100%', resizeMode: 'contain'},
  actions: {paddingBottom: 16},
  space: {height: 10},
  empty: {
    color: colors.coral,
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 13,
  },
});
