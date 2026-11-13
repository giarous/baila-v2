import React, {useRef, useState} from 'react';
import {View, Text, Alert, StyleSheet} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {Screen, Header, Button} from '../components/UI';
import PlayingCard from '../components/PlayingCard';
import {useGame} from '../state/GameContext';
import {localizeCard} from '../game/deck';
import {colors} from '../theme';

export default function GameScreen({navigation}) {
  const {deck, language} = useGame();
  const swiper = useRef(null);
  const [index, setIndex] = useState(0);
  const [layout, setLayout] = useState(null);
  const [swiping, setSwiping] = useState(false);
  const finish = () => navigation.popToTop();
  const exit = () =>
    Alert.alert('Leave this game?', '', [
      {text: 'Keep playing', style: 'cancel'},
      {text: 'Leave game', style: 'destructive', onPress: finish},
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
    const {title, description} = localizeCard(card, language);
    Alert.alert(title, description, [
      {text: language === 'ru' ? 'Закрыть' : 'Close'},
    ]);
  };
  const measure = event => {
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
        label={
          deck.length
            ? `${Math.min(index + 1, deck.length)} / ${deck.length}`
            : 'BAILA'
        }
      />
      <View style={styles.stage} onLayout={measure}>
        {layout && deck.length > 0 && (
          <Swiper
            // The legacy swiper caches its dimensions, so remount after resizing.
            key={`${layout.width}-${layout.height}`}
            ref={swiper}
            cards={deck}
            cardIndex={index}
            renderCard={card => (card ? <PlayingCard card={card} /> : null)}
            cardStyle={{
              width: layout.width,
              height: Math.max(1, layout.height - 18),
            }}
            containerStyle={styles.swiper}
            cardVerticalMargin={0}
            cardHorizontalMargin={0}
            marginTop={0}
            marginBottom={0}
            backgroundColor="transparent"
            stackSize={2}
            stackSeparation={8}
            animateCardOpacity
            infinite={false}
            verticalSwipe={false}
            onSwiping={() => setSwiping(true)}
            onSwipedAborted={() => setSwiping(false)}
            onSwiped={previous => {
              setIndex(previous + 1);
              setSwiping(false);
            }}
            onSwipedAll={finish}
            useViewOverflow={false}
          />
        )}
        {!deck.length && (
          <Text style={styles.empty}>Choose a card type to play.</Text>
        )}
      </View>
      <View style={styles.controls}>
        <View style={styles.details}>
          <Button
            title="Details"
            secondary
            onPress={showDetails}
            disabled={swiping || !deck[index]}
            testID="card-details"
          />
        </View>
        <View style={styles.next}>
          <Button
            title="Next card →"
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
  swiper: {flex: 1},
  controls: {flexDirection: 'row', paddingTop: 8, paddingBottom: 16},
  details: {flex: 1, marginRight: 10},
  next: {flex: 1},
  empty: {color: colors.muted, textAlign: 'center', paddingTop: 24},
});
