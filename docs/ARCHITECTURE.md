# Architecture

BAILA separates session state, pure game rules, and screen presentation. The app has four screens and no backend; a small router and React Context keep the implementation proportional to that scope.

## Module boundaries

| Location                          | Responsibility                                                        |
| --------------------------------- | --------------------------------------------------------------------- |
| `App.js`                          | Compose safe-area and session providers with the navigator            |
| `src/navigation/AppNavigator.js`  | Route selection and Android hardware-back handling                    |
| `src/screens/`                    | Coordinate each user flow and localized dialogs                       |
| `src/components/ui/`              | Shared buttons, header, language picker, and safe-area screen shell   |
| `src/components/SelectionCard.js` | Present one selection tile with independent checkbox and Info targets |
| `src/components/CardArtwork.js`   | Fit the original illustrations within available space                 |
| `src/components/CardStack.js`     | Animate a swipe and report when it commits                            |
| `src/state/GameContext.js`        | Own language, selected types, and the active session deck             |
| `src/game/deck.js`                | Construct, shuffle, and localize cards without UI dependencies        |
| `src/i18n.js`                     | English/Russian interface strings                                     |
| `src/theme.js`                    | Semantic colors, spacing, radii, and shared typography                |
| `constants/photoCards.js`         | Original bilingual card catalogue                                     |

## Session flow

The provider sits above the navigator, so changing screens does not recreate selection or language. Starting a game builds four copies of each selected card and shuffles a new array. Empty selection disables starting. Each committed swipe advances the deck; completing it returns home.

Selection and language are intentionally held in memory rather than persisted. Native dialogs resolve strings when opened. Card descriptions resolve from the current language rather than being frozen when a deck is created.

## Interaction and styling

Selection cards keep a 3:4 ratio. The checkbox and Info button are siblings, so reading a rule does not also toggle a card. Accessibility roles, labels, and checked states describe their distinct actions.

The swipe stack uses stable gesture handlers and a ref to the latest callbacks, preventing stale deck indices during animation. Threshold constants describe when a drag becomes a committed swipe. Shared semantic theme tokens let screens use colors by purpose rather than repeating palette values.

## Verification and limits

Jest covers deck composition, immutable selection, game completion, artwork-only cards, and language switching across navigation, details, and exit dialogs. ESLint and Prettier check the maintained JavaScript and documentation.

The separate UI capture tool bundles production screens through React Native Web, captures five documentation previews, and checks home controls at three viewport sizes and selection-card proportions. It is not a shipped web application or a substitute for Android gesture, animation, native dialog, or safe-area testing.

The manual Android workflow builds the APK and checks its signature, installed name, application ID, and target SDK. Physical-device review and macOS/iOS validation remain separate checks.
