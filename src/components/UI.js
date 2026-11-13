import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {colors} from '../theme';
import {useGame} from '../state/GameContext';

export function Screen({children}) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

export function Button({title, onPress, secondary, disabled, testID}) {
  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{disabled: !!disabled}}
      disabled={disabled}
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.button,
        secondary && styles.secondary,
        disabled && styles.disabled,
      ]}>
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function LanguagePicker() {
  const {language, setLanguage} = useGame();
  return (
    <View style={styles.languages} accessibilityLabel="Rules language">
      {['en', 'ru'].map(value => (
        <TouchableOpacity
          key={value}
          accessibilityRole="button"
          accessibilityLabel={
            value === 'en' ? 'English rules' : 'Russian rules'
          }
          accessibilityState={{selected: language === value}}
          onPress={() => setLanguage(value)}
          style={[
            styles.language,
            language === value && styles.activeLanguage,
          ]}>
          <Text
            style={[
              styles.languageText,
              language === value && styles.activeLanguageText,
            ]}>
            {value.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function Header({navigation, label = 'BAILA', onBack}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Back to home"
        onPress={onBack || (() => navigation.goBack())}
        style={styles.back}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.wordmark}>{label}</Text>
      <LanguagePicker />
    </View>
  );
}

export const typography = StyleSheet.create({
  eyebrow: {
    color: colors.teal,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    color: colors.ink,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1.3,
  },
  body: {color: colors.muted, fontSize: 15, lineHeight: 23},
});

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  content: {flex: 1, paddingHorizontal: 24},
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
    color: colors.ink,
  },
  back: {width: 64, minHeight: 44, justifyContent: 'center'},
  backText: {fontSize: 36, lineHeight: 40, color: colors.ink},
  button: {
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {color: colors.paper, fontWeight: '700', fontSize: 16},
  secondary: {backgroundColor: colors.coralLight},
  secondaryText: {color: colors.coral},
  disabled: {opacity: 0.45},
  languages: {
    flexDirection: 'row',
    backgroundColor: colors.line,
    borderRadius: 14,
  },
  language: {
    minHeight: 44,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  activeLanguage: {backgroundColor: colors.teal},
  languageText: {fontSize: 11, fontWeight: '800', color: colors.muted},
  activeLanguageText: {color: colors.paper},
});
