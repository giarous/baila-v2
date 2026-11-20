# Android downloads

The outdated Android 9-targeted APK has been removed from the current repository tree. It is still present in older Git history.

To create the updated APK, open [Build Android APK](https://github.com/giarous/baila-v2/actions/workflows/android-apk.yml), select **Run workflow**, and wait for a successful run. Download **BAILA.apk** from the newly published [Android test release](https://github.com/giarous/baila-v2/releases). The run also contains a `BAILA-Android` artifact with the APK and checksum.

A successful workflow verifies the installed name **BAILA**, application ID `com.tbaila.v2`, and target SDK 36. The signing-key and installation notes are in [the release notes](../../docs/android-preview-notes.md).
