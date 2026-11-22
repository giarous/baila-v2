import React from 'react';
import {useStrings} from '../i18n';
import SelectionCard from '../components/SelectionCard';
import {
  Alert,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Screen, Header, Button} from '../components/ui';
import {useGame} from '../state/GameContext';
import {localizeCard, COPIES_PER_CARD} from '../game/deck';
import {colors, typography} from '../theme';

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
            <SelectionCard
              card={item}
              title={title}
              informationLabel={strings.cardInformation(title)}
              onToggle={() => toggleCard(item.name)}
              onInformation={() => showInformation(item)}
            />
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
  count: {fontSize: 12, fontWeight: '700', color: colors.textMuted},
  selectAll: {paddingVertical: 14, paddingLeft: 14},
  selectAllText: {color: colors.accentText, fontWeight: '700', fontSize: 13},
  list: {paddingBottom: 8},
  row: {justifyContent: 'space-between'},
  bottom: {paddingVertical: 12, borderTopWidth: 1, borderColor: colors.border},
  hint: {
    fontSize: 12,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
});
