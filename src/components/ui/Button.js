import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, radii, spacing} from '../../theme';

/** Primary and secondary actions share size, touch feedback and accessibility. */
export default function Button({title, onPress, secondary, disabled, testID}) {
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
      ]}
    >
      <Text style={[styles.text, secondary && styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: spacing.md,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {color: colors.onPrimary, fontWeight: '700', fontSize: 16},
  secondary: {backgroundColor: colors.secondary},
  secondaryText: {color: colors.onSecondary},
  disabled: {opacity: 0.45},
});
