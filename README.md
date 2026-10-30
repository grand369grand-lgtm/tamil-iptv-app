# Tamil IPTV App 📺

Free Tamil IPTV channels player built with **Expo + React Native**.

## Features
- 130+ Tamil channels from [iptv-org](https://github.com/iptv-org/iptv)
- Live streaming with expo-av
- Dark modern UI
- Simple channel list + player

## Run locally
```bash
npm install
npx expo start
```

Scan QR with Expo Go app.

## Build APK (No EAS login needed)

### On your computer:
```bash
npm install
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

APK location:
`android/app/build/outputs/apk/release/app-release.apk`

### GitHub Actions
Push to `main` triggers the workflow (checks only).  
For full APK in CI you need Android SDK setup or EXPO_TOKEN.

## Playlist
https://iptv-org.github.io/iptv/languages/tam.m3u

## Repo
https://github.com/grand369grand-lgtm/tamil-iptv-app
