import React from 'react';
import {Image, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {strings} from '../../content';
import {colors} from '../../theme';

export default function Header({navigation, progress, onBack}) {
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
      <View style={styles.brand}>
        <Image
          source={require('../../../assets/baila_logo2.png')}
          accessibilityLabel="BAILA"
          style={styles.logo}
        />
      </View>
      <View style={styles.trailing}>
        {progress && <Text style={styles.progress}>{progress}</Text>}
      </View>
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
  brand: {
    backgroundColor: colors.text,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logo: {width: 84, height: 25, resizeMode: 'contain'},
  // Match the back target width to keep the logo centered.
  trailing: {width: 64, alignItems: 'flex-end'},
  progress: {fontSize: 12, fontWeight: '700', color: colors.text},
  back: {width: 64, minHeight: 44, justifyContent: 'center'},
  backText: {fontSize: 36, lineHeight: 40, color: colors.text},
});
