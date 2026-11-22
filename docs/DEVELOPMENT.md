# Development

## Prerequisites

- Node `^22.13.0` or `>=24.3.0`, and npm.
- JDK 17.
- Android SDK platform 36, build-tools 36.0.0, NDK 27.1.12297006, and CMake 3.22.1.
- An Android device or emulator running API 24 or newer.

The project uses React Native 0.86, React 19, Hermes, and the checksum-pinned Gradle 9.3.1 wrapper. Compile/target SDK is 36 (Android 16).

## Branches

`main` is English-only. Check out `multilingual` for the preserved English/Russian version. Each branch contains its matching code, tests, documentation, and screenshots. To build that version in GitHub Actions, select `multilingual` in the manual workflow branch selector.

## Install and run

```sh
npm ci
npm start
# In another terminal:
npm run android
```

The Android configuration expects an ignored `android/app/debug.keystore`. For a new local installation, generate a standard development key:

```sh
keytool -genkeypair -v -storetype JKS \
  -keystore android/app/debug.keystore -storepass android \
  -alias androiddebugkey -keypass android \
  -dname "CN=Android Debug,O=Android,C=US" \
  -keyalg RSA -keysize 2048 -validity 10000
```

Never commit signing keys. Keep the same key to update an existing development installation; a different key requires uninstalling that v2 build first. The original app can remain installed.

## Quality checks

```sh
npm test -- --runInBand --watch=false
npm run lint
npm run format:check
# Apply project formatting:
npm run format
```

## Reproduce the README previews

Install Chromium or Google Chrome, then install the isolated documentation tooling:

```sh
npm ci
npm ci --prefix tools/ui-previews
npm run screenshots
```

The tool uses `/usr/bin/chromium` when present, otherwise installed Google Chrome. Set `CHROMIUM_EXECUTABLE` to use another executable. It does not download a browser automatically. Tool dependencies are separate from the mobile app's dependencies.

The script renders actual production components at 360 × 640 CSS pixels (9:16 aspect ratio, 2× output), captures English home, deck selection, gameplay, and instructions, and writes `docs/screenshots/`. Home and gameplay retain 9:16 framing; scrollable deck and instructions captures expand to their full content height to avoid clipped cards and rules. Game randomness is temporarily fixed by the browser fixture to capture a repeatable first card; production randomness is unchanged. It also checks home controls at 320 × 568 and 430 × 932 and the 3:4 selection layout.

These are browser-rendered UI previews, not Android screenshots. Verify native dialogs, swipes, animations, and safe areas on a device before a release.

## Android APK delivery

Run [Build Android APK](https://github.com/giarous/baila-v2/actions/workflows/android-apk.yml) manually on `main`. A successful run attaches `BAILA-Android` artifacts and creates a development preview under [Releases](https://github.com/giarous/baila-v2/releases) containing `BAILA.apk` and `SHA256SUMS`. A push alone does not publish an APK.

The workflow uses the public React Native template development key for consistent preview updates. See [Android preview notes](android-preview-notes.md) for installation and signing details.

To build locally after configuring the SDK and development key:

```sh
cd android
./gradlew --no-daemon --max-workers=2 assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`. It includes JavaScript and assets but uses development signing.

| Identifier                         | Value           |
| ---------------------------------- | --------------- |
| Installed display name             | `BAILA`         |
| Android application ID             | `com.tbaila.v2` |
| Internal React Native registration | `TBaila`        |

The distinct application ID permits side-by-side installation with the original `com.tbaila` app. Do not rename the internal registration independently of the native hosts.

## Platform and environment limits

On macOS with Xcode, install the iOS pods and run `npm run ios`. The iOS host targets the current React Native version, but has not been built or validated in this Linux environment.

In the managed cloud workspace, activate the current tools with `source /workspace/.android-dev/activate-modern.sh` when available. React Native's Android artifact downloads redirect to `repo.reactnative.dev`; blocked access to that host prevents a local native build. Keep TLS verification enabled. Use the GitHub workflow to build outside this workspace when its network policy blocks that dependency.
