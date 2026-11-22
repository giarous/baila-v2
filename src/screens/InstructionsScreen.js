import React, {useState} from 'react';
import {strings} from '../content';
import CardArtwork from '../components/CardArtwork';
import {
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Screen, Header} from '../components/ui';
import {useGame} from '../state/GameContext';
import {introduction} from '../game/deck';
import {colors, typography} from '../theme';

export default function InstructionsScreen({navigation}) {
  const {cards} = useGame();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(null);
  // Normalize the query once per render; the catalogue stays unchanged.
  const normalizedQuery = query.trim().toLowerCase();
  const matching = cards.filter((card) =>
    card.name.toLowerCase().includes(normalizedQuery),
  );

  return (
    <Screen>
      <Header navigation={navigation} />
      <FlatList
        data={matching}
        extraData={expanded}
        keyExtractor={(card) => card.name}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={[typography.title, styles.title]}>
              {strings.howToPlay}
            </Text>
            <View style={styles.guide}>
              <Text style={styles.guideTitle}>{strings.basics}</Text>
              <Text style={styles.guideText}>{introduction.description}</Text>
            </View>
            <Text style={styles.sectionTitle}>{strings.cardRules}</Text>
            <Text style={typography.body}>{strings.tapCard}</Text>
            <TextInput
              accessibilityLabel={strings.searchCards}
              placeholder={strings.findCard}
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              style={styles.search}
            />
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>{strings.noCards}</Text>}
        renderItem={({item}) => {
          const open = expanded === item.name;
          return (
            <View style={styles.rule}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{expanded: open}}
                accessibilityLabel={item.name}
                onPress={() => setExpanded(open ? null : item.name)}
                style={styles.ruleHeader}
              >
                <CardArtwork source={item.photo} style={styles.image} />
                <View style={styles.ruleCopy}>
                  <Text style={styles.ruleTitle}>{item.name}</Text>
                </View>
                <Text style={styles.expand}>{open ? '−' : '+'}</Text>
              </TouchableOpacity>
              {open && (
                <Text style={styles.description}>{item.description}</Text>
              )}
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {paddingBottom: 24},
  title: {marginTop: 12, marginBottom: 24},
  guide: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 22,
    marginBottom: 28,
  },
  guideTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 12,
  },
  guideText: {color: colors.text, fontSize: 14, lineHeight: 23},
  sectionTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    minHeight: 52,
    paddingHorizontal: 16,
    color: colors.text,
    marginVertical: 18,
    fontSize: 15,
  },
  rule: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    marginBottom: 10,
    overflow: 'hidden',
  },
  ruleHeader: {flexDirection: 'row', alignItems: 'center', padding: 14},
  image: {width: 36, height: 54, marginRight: 14},
  ruleCopy: {flex: 1},
  ruleTitle: {fontSize: 15, color: colors.text, fontWeight: '700'},
  expand: {fontSize: 24, color: colors.accentText, paddingLeft: 12},
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  empty: {color: colors.textMuted, textAlign: 'center', padding: 20},
});
