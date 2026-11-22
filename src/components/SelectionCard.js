import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import CardArtwork from './CardArtwork';
import {COPIES_PER_CARD} from '../game/deck';
import {colors} from '../theme';

/**
 * A fixed 3:4 tile with separate selection and information touch targets.
 * Session changes and dialogs stay in the screen; this component only renders
 * its inputs and reports presses, which makes reuse and interaction tests simple.
 */
export default function SelectionCard({
  card,
  title,
  informationLabel,
  onToggle,
  onInformation,
}) {
  return (
    <View style={[styles.tile, card.state && styles.selectedTile]}>
      <TouchableOpacity
        accessibilityRole="checkbox"
        accessibilityLabel={title}
        accessibilityState={{checked: card.state}}
        onPress={onToggle}
        activeOpacity={0.75}
        style={styles.selection}
      >
        <View style={styles.tileTop}>
          <Text style={styles.copies}>×{COPIES_PER_CARD}</Text>
          <View style={[styles.check, card.state && styles.checked]}>
            <Text style={styles.checkText}>{card.state ? '✓' : ''}</Text>
          </View>
        </View>
        <View style={styles.artwork}>
          <CardArtwork source={card.photo} style={styles.image} />
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardName} numberOfLines={2}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
      {/* Keeping Info outside the checkbox prevents a rules lookup from toggling it. */}
      <TouchableOpacity
        testID={`card-info-${card.name}`}
        accessibilityRole="button"
        accessibilityLabel={informationLabel}
        onPress={onInformation}
        activeOpacity={0.75}
        style={styles.infoButton}
      >
        <Text accessible={false} style={styles.infoIcon}>
          ⓘ
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '48%',
    aspectRatio: 3 / 4,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  selectedTile: {borderColor: colors.primary},
  selection: {flex: 1, minHeight: 0, padding: 8},
  artwork: {flex: 1, minHeight: 0, alignItems: 'center'},
  cardFooter: {minHeight: 44, justifyContent: 'center', paddingRight: 52},
  infoButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },
  infoIcon: {fontSize: 22, color: colors.accentText},
  tileTop: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copies: {fontSize: 11, fontWeight: '700', color: colors.textMuted},
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {backgroundColor: colors.primary, borderColor: colors.primary},
  checkText: {color: colors.onPrimary, fontWeight: '800', fontSize: 14},
  image: {
    height: '100%',
    maxWidth: '100%',
  },
  cardName: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
  },
});
