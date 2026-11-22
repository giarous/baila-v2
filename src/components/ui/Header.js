import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {strings} from '../../content';
import {colors} from '../../theme';

export default function Header({navigation, label = 'BAILA', onBack}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        accessibilityRole="button"
        testID="back-home"
        accessibilityLabel={strings.backHome}
        onPress={onBack || (() => navigation.goBack())}
        style={styles.back}
      >
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.wordmark}>{label}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  wordmark: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 3,
    color: colors.text,
  },
  // Match the back target width to keep the label centered.
  headerSpacer: {width: 64},
  back: {width: 64, minHeight: 44, justifyContent: 'center'},
  backText: {fontSize: 36, lineHeight: 40, color: colors.text},
});
