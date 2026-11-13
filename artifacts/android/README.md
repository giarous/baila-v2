# Baila v2 Android test build

[Download the APK](./baila-v2-preview.apk?raw=true), or open the APK on GitHub and choose **Download raw file**.

The installed name is **Baila v2** and the application ID is `com.tbaila.v2`. It installs alongside the original `com.tbaila` app and uses the supplied Baila launcher artwork in square and round forms.

Home has three fixed buttons and gameplay shows full-size card artwork. Rules appear only through Details, and games begin immediately without an introduction card. Install it on an Android phone to try the updated app. The universal APK includes JavaScript, images, and the supported native CPU architectures; Metro is not required. This is a development-signed test build, not a Google Play release. The SHA-256 digest is recorded in `SHA256SUMS`.

Validation completed for this build: 14 Jest tests, ESLint, native release build, APK package/name/icon inspection, and APK signature verification. The distinct application IDs allow the two Android apps to coexist. Physical-device review and an iOS build are still pending.

Known limitation: software emulation was very slow and captures showed a background color mismatch. The cause is not resolved, and full visual/touch acceptance on a physical device is still pending.

To rebuild, use Node 12.22.12, npm 6.14.16, JDK 11, Android platform 28/build-tools 28.0.3, and Gradle 5.6.4 as described in the root README. The Android project currently expects a local `android/app/debug.keystore`; generate a standard local debug key if it is absent. Never commit a private signing key.
