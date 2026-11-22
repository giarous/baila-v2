import React, {useRef, useState} from 'react';
import {strings} from '../content';
import {View, Text, Alert, StyleSheet} from 'react-native';
import CardStack from '../components/CardStack';
import {Screen, Header, Button} from '../components/ui';
import PlayingCard from '../components/PlayingCard';
import {useGame} from '../state/GameContext';
import {colors} from '../theme';

export default function GameScreen({navigation}) {
  const {deck} = useGame();
  const swiper = useRef(null);
  const [index, setIndex] = useState(0);
  const [layout, setLayout] = useState(null);
  const [swiping, setSwiping] = useState(false);
  const finish = () => navigation.popToTop();
  const exit = () =>
    Alert.alert(strings.leaveGameTitle, '', [
      {text: strings.keepPlaying, style: 'cancel'},
      {text: strings.leaveGame, style: 'destructive', onPress: finish},
    ]);
  const next = () => {
    if (swiper.current && !swiping) {
      setSwiping(true);
      swiper.current.swipeRight();
    }
  };
  const showDetails = () => {
    const card = deck[index];
    if (!card) {
      return;
    }
    const {name, description} = card;
    Alert.alert(name, description, [{text: strings.close}]);
  };
  const measure = (event) => {
    const size = event.nativeEvent.layout;
    if (
      !layout ||
      size.width !== layout.width ||
      size.height !== layout.height
    ) {
      setSwiping(false);
      setLayout(size);
    }
  };

  return (
    <Screen>
      <Header
        navigation={navigation}
        onBack={exit}
        progress={
          deck.length
            ? `${Math.min(index + 1, deck.length)} / ${deck.length}`
            : undefined
        }
      />
      <View style={styles.stage} onLayout={measure}>
        {layout && deck.length > 0 && (
          <CardStack
            // Remount after resizing so an in-progress drag cannot leave the card offset.
            key={`${layout.width}-${layout.height}`}
            ref={swiper}
            cards={deck}
            cardIndex={index}
            renderCard={(card) => (card ? <PlayingCard card={card} /> : null)}
            cardStyle={{
              width: layout.width,
              height: Math.max(1, layout.height - 18),
            }}
            onSwiping={() => setSwiping(true)}
            onSwipedAborted={() => setSwiping(false)}
            onSwiped={(previous) => {
              setIndex(previous + 1);
              setSwiping(false);
            }}
            onSwipedAll={finish}
          />
        )}
        {!deck.length && <Text style={styles.empty}>{strings.chooseType}</Text>}
      </View>
      <View style={styles.controls}>
        <View style={styles.details}>
          <Button
            title={strings.details}
            secondary
            onPress={showDetails}
            disabled={swiping || !deck[index]}
            testID="card-details"
          />
        </View>
        <View style={styles.next}>
          <Button
            title={strings.nextCard}
            onPress={next}
            disabled={swiping || !layout || !deck[index]}
            testID="next-card"
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stage: {flex: 1, minHeight: 0},
  controls: {flexDirection: 'row', paddingTop: 8, paddingBottom: 16},
  details: {flex: 1, marginRight: 10},
  next: {flex: 1},
  empty: {color: colors.textMuted, textAlign: 'center', paddingTop: 24},
});
