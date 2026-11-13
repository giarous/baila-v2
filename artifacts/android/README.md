# Android test build

[Download the APK](./baila-preview.apk?raw=true), or open the APK on GitHub and choose **Download raw file**.

Install it on an Android phone to try the redesigned app. The universal APK includes JavaScript, images, and the supported native CPU architectures; Metro is not required. This is a development-signed test build, not a Google Play release. The SHA-256 digest is recorded in `SHA256SUMS`.

Validation completed: 11 Jest tests, ESLint, native debug and release builds, APK signature verification, installation, and launch in an Android 9 emulator.

Known limitation: software emulation was very slow and captures showed a background color mismatch. The cause is not resolved, and full visual/touch acceptance on a physical device is still pending.

To rebuild, use Node 12.22.12, npm 6.14.16, JDK 11, Android platform 28/build-tools 28.0.3, and Gradle 5.6.4 as described in the root README. The Android project currently expects a local `android/app/debug.keystore`; generate a standard local debug key if it is absent. Never commit a private signing key.
