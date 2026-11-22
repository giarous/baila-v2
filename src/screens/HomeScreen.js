import React from 'react';
import {strings} from '../content';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Screen, Button} from '../components/ui';
import {useGame} from '../state/GameContext';
import {colors} from '../theme';

export default function HomeScreen({navigation}) {
  const {cards, startGame} = useGame();
  const selected = cards.some((card) => card.state);
  const play = () => {
    if (startGame()) {
      navigation.navigate('NewGame');
    }
  };

  return (
    <Screen>
      <View style={styles.artwork}>
        <Image
          source={require('../../assets/branding/baila-v2-icon.png')}
          accessibilityLabel="BAILA"
          style={styles.image}
        />
      </View>
      <View style={styles.actions}>
        {!selected && <Text style={styles.empty}>{strings.chooseType}</Text>}
        <Button
          title={strings.play}
          onPress={play}
          disabled={!selected}
          testID="start-game"
        />
        <View style={styles.space} />
        <Button
          title={strings.chooseDeck}
          secondary
          onPress={() => navigation.navigate('Settings')}
          testID="choose-cards"
        />
        <View style={styles.space} />
        <Button
          title={strings.howToPlay}
          secondary
          onPress={() => navigation.navigate('Descriptions')}
          testID="how-to-play"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // The art gives up space before the controls do on smaller phones.
  artwork: {flex: 1, minHeight: 0, marginHorizontal: -8, marginVertical: 20},
  image: {flex: 1, width: '100%', resizeMode: 'contain'},
  actions: {paddingBottom: 16},
  space: {height: 10},
  empty: {
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 13,
  },
});
