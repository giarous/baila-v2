import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {colors} from '../theme';

/** Reuse the original illustrations, cropping their bright printed borders. */
export default function CardArtwork({source, style}) {
  return (
    <View style={[styles.frame, style]}>
      <Image source={source} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    aspectRatio: 2 / 3,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: colors.paper,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    transform: [{scale: 1.1}],
  },
});
