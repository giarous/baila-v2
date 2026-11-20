# BAILA

A mobile card game with the original 28 card types, selectable decks, swipe gameplay, and English/Russian rules. The installed name is **BAILA**. The application ID remains `com.tbaila.v2`, so it installs alongside the original `com.tbaila` app.

Deck selection uses larger full-width illustrations. Each selection tile has an Info button that shows its localized rules without changing selection.

Home and gameplay use fixed layouts. Cards show artwork; **Details** opens the current card's rules. Changing EN/RU updates buttons, instructions, search, selection controls, accessibility labels, card details, and confirmation dialogs across the app.

## Build and download on GitHub

Open [Build Android APK](https://github.com/giarous/baila-v2/actions/workflows/android-apk.yml), choose **Run workflow**, select `main`, and run it. When the run succeeds, download **BAILA.apk** from the new entry under [Releases](https://github.com/giarous/baila-v2/releases). The APK and checksum are also attached to the workflow run as `BAILA-Android`.

The workflow is manual and does not run merely because code is pushed. It runs tests and lint, builds the standalone APK, verifies its signature and application metadata, and publishes a uniquely tagged development preview. The public React Native template signing key makes previews consistent across workflow runs without private signing secrets. Updating an earlier locally signed v2 build may require uninstalling that v2 build once; the original `com.tbaila` app can remain installed.

## Development

Use Node 22.13+ or Node 24.3+, npm, JDK 17, and an Android SDK. The project uses React Native 0.86, React 19, Hermes, Android compile/target SDK 36 (Android 16), build-tools 36.0.0, NDK 27.1.12297006, and the checksum-pinned Gradle 9.3.1 wrapper. Android 7.0/API 24 is the minimum supported OS.

```sh
npm ci
npm start
# Another terminal, with an emulator or device connected:
npm run android
```

Use the same development signing key as your earlier BAILA build to update that installed copy. The existing Android configuration expects an ignored local `android/app/debug.keystore`. Generate a standard Android debug key for a fresh development checkout; never commit signing keys. A new key requires uninstalling the earlier development build first.

For a standalone test APK with JavaScript and images included:

```sh
cd android
./gradlew --no-daemon --max-workers=2 assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`. It uses development signing and is not a store release. The source uses the modern Android application template, including an exported launcher activity and safe-area handling for edge-to-edge display.

On macOS with Xcode, install the iOS pods and run `npm run ios`. The iOS host has been updated to match React Native 0.86; its bundle identifier remains `com.tbaila.v2` and display name is BAILA. iOS builds require separate validation on macOS.

## Checks

```sh
npm test -- --runInBand --watch=false
npm run lint
```

The tests cover deck composition, immutable selection, artwork-only cards, complete deck progression, and EN/RU switching across real screen navigation, card details, and exit dialogs. Native animation, touch, and OS compatibility should also be checked on a device.

## Cloud environment

Activate the modern build tools with `source /workspace/.android-dev/activate-modern.sh`. The old `activate.sh` selects the retired Node 12/JDK 11 build stack and must not be used for this version.

Dependencies use the standard package-manager destinations plus `repo.reactnative.dev`, the download host to which Maven Central redirects the React Native 0.86 Android binary. The cloud proxy's CA store remains enabled for Java/Gradle downloads. If that destination is blocked, add it to environment network settings and save before rebuilding; do not disable verification.

The current source passes JavaScript tests and lint. Local native release verification is blocked by access to that binary host. The manual GitHub workflow builds outside this cloud workspace and reports its actual native build result. The outdated APK has been removed from the current repository tree to avoid confusing it with the updated build; older commits retain it. A new APK is available only after a successful workflow run.

## Code structure

| Location                   | Responsibility                                            |
| -------------------------- | --------------------------------------------------------- |
| `App.js`                   | Screen routing and Android back handling                  |
| `src/screens/`             | Home, card selection, instructions, and gameplay          |
| `src/components/`          | Shared controls, artwork, safe areas, and the swipe stack |
| `src/state/GameContext.js` | Session selection, language, and active deck              |
| `src/i18n.js`              | English and Russian interface strings                     |
| `src/game/deck.js`         | Immutable deck construction, shuffling, and rule lookup   |
| `constants/photoCards.js`  | Original bilingual card catalogue                         |

Every game shuffles four copies of each enabled card type and starts directly on a card. The final swipe returns home. Empty selection disables starting a game. Selection and language remain shared while navigating during a session; they are not persisted across app restarts.

## License

This app was created as a personal challenge and is not affiliated with or endorsed by "Baila". All associated copyrights and trademarks belong to their respective owners. The physical version can be found on [Baila Games](https://www.facebook.com/BailaGames).
