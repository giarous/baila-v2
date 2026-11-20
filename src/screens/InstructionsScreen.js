import {useStrings} from '../i18n';
import CardArtwork from '../components/CardArtwork';
import React, {useState} from 'react';
import {
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Screen, Header, typography} from '../components/UI';
import {useGame} from '../state/GameContext';
import {introduction, localizeCard} from '../game/deck';
import {colors} from '../theme';

export default function InstructionsScreen({navigation}) {
  const strings = useStrings();
  const {cards, language} = useGame();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(null);
  const guide = localizeCard(introduction, language);
  // Search both languages so switching the rule language never hides a match.
  const matching = cards.filter((card) =>
    `${card.name} ${card.name_ru}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  return (
    <Screen>
      <Header navigation={navigation} />
      <FlatList
        data={matching}
        extraData={{language, expanded}}
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
              <Text style={styles.guideText}>{guide.description}</Text>
            </View>
            <Text style={styles.sectionTitle}>{strings.cardRules}</Text>
            <Text style={typography.body}>{strings.tapCard}</Text>
            <TextInput
              accessibilityLabel={strings.searchCards}
              placeholder={strings.findCard}
              placeholderTextColor={colors.muted}
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
          const content = localizeCard(item, language);
          return (
            <View style={styles.rule}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{expanded: open}}
                accessibilityLabel={content.title}
                onPress={() => setExpanded(open ? null : item.name)}
                style={styles.ruleHeader}
              >
                <CardArtwork source={item.photo} style={styles.image} />
                <View style={styles.ruleCopy}>
                  <Text style={styles.ruleTitle}>{content.title}</Text>
                </View>
                <Text style={styles.expand}>{open ? '−' : '+'}</Text>
              </TouchableOpacity>
              {open && (
                <Text style={styles.description}>{content.description}</Text>
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
    backgroundColor: colors.teal,
    borderRadius: 24,
    padding: 22,
    marginBottom: 28,
  },
  guideTitle: {
    color: colors.paper,
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 12,
  },
  guideText: {color: colors.paper, fontSize: 14, lineHeight: 23},
  sectionTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 6,
  },
  search: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    minHeight: 52,
    paddingHorizontal: 16,
    color: colors.ink,
    marginVertical: 18,
    fontSize: 15,
  },
  rule: {
    backgroundColor: colors.paper,
    borderRadius: 18,
    marginBottom: 10,
    overflow: 'hidden',
  },
  ruleHeader: {flexDirection: 'row', alignItems: 'center', padding: 14},
  image: {width: 36, height: 54, marginRight: 14},
  ruleCopy: {flex: 1},
  ruleTitle: {fontSize: 15, color: colors.ink, fontWeight: '700'},
  translation: {fontSize: 12, color: colors.muted, marginTop: 5},
  expand: {fontSize: 24, color: colors.teal, paddingLeft: 12},
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 24,
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  empty: {color: colors.muted, textAlign: 'center', padding: 20},
});
