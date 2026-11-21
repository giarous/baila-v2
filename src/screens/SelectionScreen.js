import {useStrings} from '../i18n';
import CardArtwork from '../components/CardArtwork';
import React from 'react';
import {
  Alert,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Screen, Header, Button, typography} from '../components/UI';
import {useGame} from '../state/GameContext';
import {localizeCard, COPIES_PER_CARD} from '../game/deck';
import {colors} from '../theme';

export default function SelectionScreen({navigation}) {
  const strings = useStrings();
  const {cards, language, toggleCard, selectAll} = useGame();
  const selected = cards.filter((card) => card.state).length;
  const showInformation = (card) => {
    const {title, description} = localizeCard(card, language);
    Alert.alert(title, description, [{text: strings.close}]);
  };
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
        renderItem={({item}) => {
          const {title} = localizeCard(item, language);
          return (
            <View style={[styles.tile, item.state && styles.selectedTile]}>
              <TouchableOpacity
                accessibilityRole="checkbox"
                accessibilityLabel={title}
                accessibilityState={{checked: item.state}}
                onPress={() => toggleCard(item.name)}
                activeOpacity={0.75}
                style={styles.selection}
              >
                <View style={styles.tileTop}>
                  <Text style={styles.copies}>×{COPIES_PER_CARD}</Text>
                  <View style={[styles.check, item.state && styles.checked]}>
                    <Text style={styles.checkText}>
                      {item.state ? '✓' : ''}
                    </Text>
                  </View>
                </View>
                <View style={styles.artwork}>
                  <CardArtwork source={item.photo} style={styles.image} />
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardName} numberOfLines={2}>
                    {title}
                  </Text>
                </View>
              </TouchableOpacity>
              {/* A sibling button keeps opening rules separate from deck selection. */}
              <TouchableOpacity
                testID={`card-info-${item.name}`}
                accessibilityRole="button"
                accessibilityLabel={strings.cardInformation(title)}
                onPress={() => showInformation(item)}
                activeOpacity={0.75}
                style={styles.infoButton}
              >
                <Text accessible={false} style={styles.infoIcon}>
                  ⓘ
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
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
    aspectRatio: 3 / 4,
    backgroundColor: colors.paper,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  selectedTile: {borderColor: colors.teal},
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
    backgroundColor: colors.tealLight,
  },
  infoIcon: {fontSize: 22, color: colors.teal},
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
    height: '100%',
    maxWidth: '100%',
  },
  cardName: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
  },
  bottom: {paddingVertical: 12, borderTopWidth: 1, borderColor: colors.line},
  hint: {
    fontSize: 12,
    color: colors.coral,
    textAlign: 'center',
    marginBottom: 8,
  },
});
