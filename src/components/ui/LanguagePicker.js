import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useStrings} from '../../i18n';
import {useGame} from '../../state/GameContext';
import {colors, radii} from '../../theme';

/** A single session language updates screen copy, rules and native dialogs. */
export default function LanguagePicker() {
  const strings = useStrings();
  const {language, setLanguage} = useGame();
  return (
    <View style={styles.languages} accessibilityLabel={strings.language}>
      {['en', 'ru'].map((value) => (
        <TouchableOpacity
          key={value}
          testID={`language-${value}`}
          accessibilityRole="button"
          accessibilityLabel={
            value === 'en' ? strings.english : strings.russian
          }
          accessibilityState={{selected: language === value}}
          onPress={() => setLanguage(value)}
          style={[styles.language, language === value && styles.active]}
        >
          <Text style={[styles.text, language === value && styles.activeText]}>
            {value.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  languages: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: radii.control,
  },
  language: {
    minHeight: 44,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.control,
  },
  active: {backgroundColor: colors.primary},
  text: {fontSize: 11, fontWeight: '800', color: colors.onSecondary},
  activeText: {color: colors.onPrimary},
});
