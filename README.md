# Baila v2

A mobile card game for three or more people, inspired by the Estonian game. Pick your card types, start a shuffled deck, and take turns swiping. Rules are available in English and Russian.

The interface uses a warm cream palette, coral actions, teal accents, and the original card illustrations. All 28 card types and their bilingual rules are retained.

## Try the Android test build

The installed app is named **Baila v2** and uses application ID `com.tbaila.v2`, so it can coexist with the original `com.tbaila` app. iOS uses the separate bundle ID `com.tbaila.v2` and the same display name. Both platforms include the new card-stack launcher icon.

[Download the standalone APK](artifacts/android/baila-v2-preview.apk?raw=true). On GitHub, you can also open that file and choose **Download raw file**. This development-signed build runs without Metro. See [build notes and known limitations](artifacts/android/README.md).

## Development

This is a React Native 0.61.5 application, using React 16.9. Its legacy tooling works with **Node 12.22.12 and npm 6.14.16**. Use that runtime for the commands below; upgrading React Native is a separate migration.

```sh
npm ci --no-optional
npm start -- --max-workers 2
```

Metro serves native bundles; this project does not have a web target. For a connected device or emulator with a compatible native toolchain:

```sh
npm run android
# macOS with Xcode and the project's CocoaPods dependencies:
npm run ios
```

Android uses Gradle 5.6.4, Android Gradle plugin 3.6.2, SDK platform 28, and build-tools 28.0.3. Use a compatible legacy JDK rather than the cloud image's JDK 21. The prepared cloud environment now includes this Android toolchain. The standalone release APK build has passed; physical-device review is still pending.

## Prepared cloud Android environment

The toolchain is installed under `/workspace/.android-dev`. Activate it in each terminal:

```sh
source /workspace/.android-dev/activate.sh
cd /workspace/baila/android
gradle --no-daemon --max-workers=2 -Dorg.gradle.jvmargs=-Xmx2g assembleRelease
```

This uses the verified Gradle installation directly. The resulting universal APK is at `android/app/build/outputs/apk/release/app-universal-release.apk`. It embeds JavaScript and assets and can run without Metro. The existing release configuration signs it with a development key; it is a test build, not a store release. A copy is available at `/workspace/baila-preview/baila-v2-preview.apk`.

The cloud machine has no KVM acceleration. A small Android 9 emulator is configured for software emulation:

```sh
source /workspace/.android-dev/activate.sh
emulator -avd baila-api28 -no-window -no-audio -no-boot-anim \
  -no-snapshot -accel off -gpu swiftshader -cores 2 -memory 2048 \
  -camera-back none -camera-front none -no-metrics
```

In another terminal, wait for `adb shell getprop sys.boot_completed` to return `1`, then install and launch:

```sh
source /workspace/.android-dev/activate.sh
adb install --no-streaming -r /workspace/baila/android/app/build/outputs/apk/release/app-x86_64-release.apk
adb shell am start -n com.tbaila.v2/com.tbaila.MainActivity
adb exec-out screencap -p > /workspace/baila-preview/home.png
```

Software emulation is slow on this machine. The prepared installation can be refreshed with `bash /workspace/.android-dev/install-native.sh`, which checks the downloaded JDK, Gradle, and Android command-line tools against official checksums and uses the cloud proxy's trusted CA store. Android's required user configuration path points to a writable workspace directory.

## Checks

```sh
npm test -- --runInBand --watch=false
npm run lint

# Check the production JavaScript bundle without an Android SDK:
mkdir -p /tmp/baila-bundle
node node_modules/react-native/cli.js bundle \
  --platform android --dev false --entry-file index.js \
  --bundle-output /tmp/baila-bundle/index.android.bundle \
  --assets-dest /tmp/baila-bundle/assets --max-workers 2
```

Jest transforms the legacy navigation packages and loads the gesture handler's native mocks. Tests cover the render entry point, selection changes, empty-deck handling, bilingual rule lookup, deck composition, and progression through the real swiper. Native animations and touch behavior still need a device check.

## Code structure

| Location | Responsibility |
| --- | --- |
| `App.js` | Navigation routes and session provider |
| `src/screens/` | Home, card selection, instructions, and active game |
| `src/components/` | Shared screen shell, buttons, language picker, artwork, and playing card |
| `src/state/GameContext.js` | Session card selection, rule language, and active deck |
| `src/game/deck.js` | Immutable shuffle, deck construction, introductory rules, and language lookup |
| `src/theme.js` | Shared design tokens |
| `constants/photoCards.js` | Original illustrations and bilingual card rules |
| `__tests__/` | Game logic, screen interactions, and swiper integration |

Selection and language remain available while navigating during a session. They are not saved across app restarts, matching the original behavior. Every new game creates four copies of each enabled card type, shuffles them, and places the introductory guide first. The last swipe returns home. An empty selection disables starting a game. Game logic never mutates the source catalogue or an earlier deck.

Long rules scroll within a card; horizontal swipes advance the deck. The Next card button provides an alternative to swiping. Instructions can be searched using either English or Russian names. Selection controls expose checkbox state to accessibility services.

## Device review

Before shipping, check a small and large phone on Android and iOS: scroll the home page and long rules, select and deselect cards, switch rule languages, swipe and use Next card, cancel and confirm leaving a game, and finish a deck. Verify safe areas, larger text sizes, and screen-reader labels on the device.

## License

This app was created as a personal challenge and is not affiliated with or endorsed by "Baila". All associated copyrights and trademarks belong to their respective owners. The physical version can be found on [Baila Games](https://www.facebook.com/BailaGames).
