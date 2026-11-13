import CardArtwork from '../components/CardArtwork';
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Screen, Button, LanguagePicker, typography} from '../components/UI';
import {useGame} from '../state/GameContext';
import {COPIES_PER_CARD} from '../game/deck';
import {colors} from '../theme';

export default function HomeScreen({navigation}) {
  const {cards, startGame} = useGame();
  const selected = cards.filter(card => card.state).length;
  const play = () => {
    if (startGame()) {
      navigation.navigate('NewGame');
    }
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <View style={styles.topbar}>
          <Text style={styles.logo}>
            baila<Text style={styles.dot}>.</Text>
          </Text>
          <LanguagePicker />
        </View>
        <View style={styles.hero}>
          <Text style={typography.eyebrow}>GOOD COMPANY. GREAT STORIES.</Text>
          <Text style={styles.headline}>
            Less scrolling.{'\n'}More playing.
          </Text>
          <Text style={typography.body}>
            Your people. A deck of surprises.{'\n'}Let the next card decide.
          </Text>
        </View>
        <View
          style={styles.art}
          accessible
          accessibilityLabel="A playful stack of Baila cards">
          <View style={styles.backCard} />
          <View style={styles.middleCard} />
          <View style={styles.frontCard}>
            <Text style={styles.cardNumber}>01 / 28</Text>
            <CardArtwork source={cards[0].photo} style={styles.illustration} />
            <Text style={styles.cardTitle}>A little unexpected.</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Made for{'\n'}your next{'\n'}get-together.
            </Text>
          </View>
          <Text style={styles.spark}>✳</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.stat}>3+ players</Text>
          <Text style={styles.stat}>EN / RU rules</Text>
          <Text style={styles.stat}>{selected * COPIES_PER_CARD} cards</Text>
        </View>
        <Button
          title="Let’s play  ↗"
          onPress={play}
          disabled={!selected}
          testID="start-game"
        />
        {!selected && (
          <Text style={styles.empty}>
            Choose at least one card type to start.
          </Text>
        )}
        <View style={styles.links}>
          <MenuLink
            title="Make it your deck"
            subtitle={`${selected} of ${cards.length} types selected`}
            onPress={() => navigation.navigate('Settings')}
          />
          <MenuLink
            title="How to play"
            subtitle="The rules, without the guesswork"
            onPress={() => navigation.navigate('Descriptions')}
          />
        </View>
        <Text style={styles.footer}>Keep it fun. Play at your own pace.</Text>
      </ScrollView>
    </Screen>
  );
}

function MenuLink({title, subtitle, onPress}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={styles.link}>
      <View style={styles.linkCopy}>
        <Text style={styles.linkTitle}>{title}</Text>
        <Text style={styles.linkSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.arrow}>↗</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: {paddingBottom: 24},
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  logo: {fontSize: 38, fontWeight: '900', letterSpacing: -2, color: colors.ink},
  dot: {color: colors.coral},
  hero: {marginTop: 32},
  headline: {
    fontSize: 43,
    lineHeight: 47,
    fontWeight: '800',
    letterSpacing: -1.8,
    color: colors.ink,
    marginTop: 14,
    marginBottom: 12,
  },
  art: {
    height: 258,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  backCard: {
    position: 'absolute',
    width: 156,
    height: 210,
    borderRadius: 22,
    backgroundColor: colors.yellow,
    transform: [{rotate: '-18deg'}, {translateX: -32}],
  },
  middleCard: {
    position: 'absolute',
    width: 156,
    height: 210,
    borderRadius: 22,
    backgroundColor: colors.teal,
    transform: [{rotate: '15deg'}, {translateX: 27}],
  },
  frontCard: {
    width: 160,
    height: 218,
    borderRadius: 20,
    backgroundColor: colors.paper,
    padding: 14,
    transform: [{rotate: '-3deg'}],
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardNumber: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.muted,
  },
  illustration: {
    flex: 1,
    marginVertical: 8,
  },
  cardTitle: {color: colors.ink, fontWeight: '700', fontSize: 11},
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 12,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.coralLight,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{rotate: '12deg'}],
  },
  badgeText: {
    fontWeight: '700',
    color: colors.coral,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  spark: {
    position: 'absolute',
    top: 8,
    right: 16,
    fontSize: 46,
    color: colors.coral,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  stat: {color: colors.muted, fontSize: 11, fontWeight: '600'},
  empty: {textAlign: 'center', color: colors.coral, marginTop: 10},
  links: {marginTop: 20},
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.line,
    paddingVertical: 18,
  },
  linkCopy: {flex: 1},
  linkTitle: {color: colors.ink, fontSize: 16, fontWeight: '700'},
  linkSubtitle: {color: colors.muted, fontSize: 12, marginTop: 5},
  arrow: {fontSize: 25, color: colors.teal, paddingLeft: 12},
  footer: {
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 24,
  },
});
