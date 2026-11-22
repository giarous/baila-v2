import React from 'react';
import {StatusBar, View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, spacing} from '../../theme';

/** Safe areas keep fixed home/game controls clear of Android's system bars. */
export default function Screen({children}) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  content: {flex: 1, paddingHorizontal: spacing.lg},
});
