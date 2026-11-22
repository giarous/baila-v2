import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

/** Keep the whole illustration visible; rules are opened separately with Details. */
export default function PlayingCard({card}) {
  return (
    <View style={styles.card}>
      <Image
        source={card.photo}
        accessibilityLabel={card.name}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {flex: 1, overflow: 'hidden', borderRadius: 18},
  image: {flex: 1, width: '100%', resizeMode: 'contain'},
});
