# BAILA Android test build

- Installed name: **BAILA**.
- Application ID: `com.tbaila.v2`, separate from the original `com.tbaila` app.
- Android 16/API 36 target; Android 7/API 24 or newer required.
- On `main`, the interface, instructions, selection, card details, and dialogs are English-only. The `multilingual` branch preserves the English/Russian version.
- Fixed home/game layouts with artwork-only cards and a Details button.
- Compact 3:4 deck-selection cards with fitted artwork and a separate Info button on every card.

This is a development-signed preview, not a Google Play release. Automated checks validate the tests, lint, APK signature, display name, application ID, and Android target. Physical-device review is still needed. iOS has not been built in this Linux environment.

The GitHub workflow uses the public development signing key distributed in the pinned official React Native template. It needs no private signing secret. **If Android refuses to update your previous v2 test build due to a signing-key mismatch, uninstall that v2 build once, then install this APK.** Your original app with ID `com.tbaila` can stay installed. Later previews from this workflow use the same development key.

Download **BAILA.apk** below. `SHA256SUMS` records its SHA-256 digest.
