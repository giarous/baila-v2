import React, {useRef, useState} from 'react';
import {View, Text, Alert, StyleSheet} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {Screen, Header, Button} from '../components/UI';
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
    Alert.alert(
      'Leave this game?',
      'Your card selection will be kept. A new game starts with a fresh shuffle.',
      [
        {text: 'Keep playing', style: 'cancel'},
        {text: 'Leave game', style: 'destructive', onPress: finish},
      ],
    );
  const next = () => {
    if (swiper.current && !swiping) {
      setSwiping(true);
      swiper.current.swipeRight();
    }
  };
  // The first card is the guide and does not count toward the playable deck.
  const total = Math.max(0, deck.length - 1);
  const played = Math.max(0, index - 1);

  return (
    <Screen>
      <Header navigation={navigation} onBack={exit} />
      <View style={styles.progressCopy}>
        <Text style={styles.eyebrow}>
          {index === 0 ? 'GATHER YOUR PEOPLE' : 'PASS IT AROUND'}
        </Text>
        <Text style={styles.count}>
          {index === 0
            ? `${total} cards in play`
            : `${Math.min(index, total)} / ${total}`}
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.progress,
            {width: `${total ? (played / total) * 100 : 0}%`},
          ]}
        />
      </View>
      <View
        style={styles.stage}
        onLayout={event => setLayout(event.nativeEvent.layout)}>
        {layout && deck.length > 0 && (
          <Swiper
            // Remount for a changed available area: this legacy swiper caches dimensions.
            key={`${layout.width}-${layout.height}`}
            ref={swiper}
            cards={deck}
            cardIndex={index}
            renderCard={card => (card ? <PlayingCard card={card} /> : null)}
            cardStyle={{
              width: layout.width,
              height: Math.max(1, layout.height - 24),
            }}
            containerStyle={styles.swiper}
            cardVerticalMargin={0}
            cardHorizontalMargin={0}
            marginTop={0}
            marginBottom={0}
            backgroundColor="transparent"
            stackSize={3}
            stackSeparation={9}
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
          <Text style={styles.empty}>
            Choose some cards from the home screen to start a game.
          </Text>
        )}
      </View>
      <View style={styles.bottom}>
        <Text style={styles.hint}>Swipe left or right for the next card</Text>
        <Button
          title={index === 0 ? 'Ready? Let’s go  →' : 'Next card  →'}
          onPress={next}
          disabled={swiping || !deck.length}
          testID="next-card"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressCopy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  eyebrow: {
    fontSize: 10,
    color: colors.teal,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  count: {fontSize: 12, color: colors.muted, fontWeight: '600'},
  track: {
    height: 4,
    backgroundColor: colors.line,
    borderRadius: 2,
    marginBottom: 24,
  },
  progress: {height: 4, backgroundColor: colors.teal, borderRadius: 2},
  stage: {flex: 1, minHeight: 220},
  swiper: {flex: 1},
  bottom: {paddingBottom: 16, paddingTop: 10},
  hint: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 14,
  },
  empty: {color: colors.muted, paddingVertical: 30, lineHeight: 24},
});
