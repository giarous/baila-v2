import {useStrings} from '../i18n';
import CardArtwork from '../components/CardArtwork';
import React from 'react';
import {FlatList, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Screen, Header, Button, typography} from '../components/UI';
import {useGame} from '../state/GameContext';
import {localizeCard, COPIES_PER_CARD} from '../game/deck';
import {colors} from '../theme';

export default function SelectionScreen({navigation}) {
  const strings = useStrings();
  const {cards, language, toggleCard, selectAll} = useGame();
  const selected = cards.filter((card) => card.state).length;
  return (
    <Screen>
      <Header navigation={navigation} />

      <Text style={[typography.title, styles.title]}>{strings.yourDeck}</Text>
      <Text style={typography.body}>{strings.copiesHint}</Text>
      <View style={styles.toolbar}>
        <Text style={styles.count}>
          {strings.selectedCount(selected, cards.length)}
        </Text>
        <TouchableOpacity
          testID="select-all"
          accessibilityRole="button"
          style={styles.selectAll}
          onPress={() => selectAll(selected !== cards.length)}
        >
          <Text style={styles.selectAllText}>
            {selected === cards.length ? strings.clearAll : strings.selectAll}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cards}
        extraData={language}
        keyExtractor={(card) => card.name}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <TouchableOpacity
            accessibilityRole="checkbox"
            accessibilityLabel={localizeCard(item, language).title}
            accessibilityState={{checked: item.state}}
            onPress={() => toggleCard(item.name)}
            activeOpacity={0.75}
            style={[styles.tile, item.state && styles.selectedTile]}
          >
            <View style={styles.tileTop}>
              <Text style={styles.copies}>×{COPIES_PER_CARD}</Text>
              <View style={[styles.check, item.state && styles.checked]}>
                <Text style={styles.checkText}>{item.state ? '✓' : ''}</Text>
              </View>
            </View>
            <CardArtwork source={item.photo} style={styles.image} />
            <Text style={styles.cardName}>
              {localizeCard(item, language).title}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.bottom}>
        {!selected && <Text style={styles.hint}>{strings.emptySelection}</Text>}
        <Button
          testID="selection-done"
          title={strings.done(selected * COPIES_PER_CARD)}
          onPress={() => navigation.goBack()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {marginTop: 12, marginBottom: 8},
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  count: {fontSize: 12, fontWeight: '700', color: colors.muted},
  selectAll: {paddingVertical: 14, paddingLeft: 14},
  selectAllText: {color: colors.teal, fontWeight: '700', fontSize: 13},
  list: {paddingBottom: 8},
  row: {justifyContent: 'space-between'},
  tile: {
    width: '48%',
    backgroundColor: colors.paper,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },
  selectedTile: {borderColor: colors.teal},
  tileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copies: {fontSize: 11, fontWeight: '700', color: colors.muted},
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {backgroundColor: colors.teal, borderColor: colors.teal},
  checkText: {color: colors.paper, fontWeight: '800', fontSize: 14},
  image: {
    height: 102,
    width: 68,
    marginVertical: 12,
  },
  cardName: {color: colors.ink, fontWeight: '700', fontSize: 13, minHeight: 34},
  bottom: {paddingVertical: 12, borderTopWidth: 1, borderColor: colors.line},
  hint: {
    fontSize: 12,
    color: colors.coral,
    textAlign: 'center',
    marginBottom: 8,
  },
});
