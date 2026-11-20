import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import {Animated, PanResponder, StyleSheet, View} from 'react-native';

/** A horizontal swipe deck built on supported React Native animation primitives. */
const CardStack = forwardRef(function CardStack(props, ref) {
  const position = useRef(new Animated.ValueXY()).current;
  const busy = useRef(false);
  const latest = useRef(props);
  latest.current = props;

  useLayoutEffect(() => {
    position.setValue({x: 0, y: 0});
  }, [position, props.cardIndex]);

  const advance = useCallback(
    (direction = 1) => {
      const current = latest.current;
      if (busy.current || !current.cards[current.cardIndex]) {
        return;
      }
      busy.current = true;
      current.onSwiping?.();
      Animated.timing(position, {
        toValue: {x: direction * current.cardStyle.width * 1.4, y: 0},
        duration: 180,
        useNativeDriver: true,
      }).start(({finished}) => {
        busy.current = false;
        if (!finished) {
          latest.current.onSwipedAborted?.();
          return;
        }
        current.onSwiped(current.cardIndex);
        if (current.cardIndex === current.cards.length - 1) {
          current.onSwipedAll();
        }
      });
    },
    [position],
  );
  useImperativeHandle(ref, () => ({swipeRight: () => advance(1)}), [advance]);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          !busy.current &&
          Math.abs(gesture.dx) > 10 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderGrant: () => latest.current.onSwiping?.(),
        onPanResponderMove: (_, gesture) =>
          position.setValue({x: gesture.dx, y: 0}),
        onPanResponderRelease: (_, gesture) => {
          if (Math.abs(gesture.dx) > 60) {
            advance(gesture.dx > 0 ? 1 : -1);
          } else {
            Animated.spring(position, {
              toValue: {x: 0, y: 0},
              useNativeDriver: true,
            }).start(() => latest.current.onSwipedAborted?.());
          }
        },
        onPanResponderTerminate: () => {
          Animated.spring(position, {
            toValue: {x: 0, y: 0},
            useNativeDriver: true,
          }).start(() => latest.current.onSwipedAborted?.());
        },
      }),
    [advance, position],
  );

  const {cards, cardIndex, cardStyle, renderCard} = props;
  const card = cards[cardIndex];
  if (!card) {
    return null;
  }
  return (
    <View style={styles.container}>
      {cards[cardIndex + 1] && (
        <View
          pointerEvents="none"
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
          style={[styles.card, cardStyle, styles.back]}
        >
          {renderCard(cards[cardIndex + 1])}
        </View>
      )}
      <Animated.View
        {...responder.panHandlers}
        style={[
          styles.card,
          cardStyle,
          {transform: position.getTranslateTransform()},
        ]}
      >
        {renderCard(card)}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {flex: 1},
  card: {position: 'absolute', top: 0, left: 0},
  back: {transform: [{translateY: 8}, {scale: 0.97}]},
});

export default CardStack;
