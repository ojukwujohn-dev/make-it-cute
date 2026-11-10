# Publishing Make It Cute

Everything lives in one GitHub repository.
- **The website** (also the privacy policy link the stores need) is published free with GitHub Pages.
- **The Android and iPhone apps** have the whole app built in, so they work offline and don't depend on any website.
- App ID on both stores: `app.makeitcute`. It can never change after the first upload.
- Contact email: info@glasscointech.com

---

## 1. Put it on GitHub (once)
1. Sign in at github.com (or create a free account).
2. Click **New repository**, name it `make-it-cute`, set it to **Public** (Pages is free for public repos), and don't add a README. Click Create.
3. Tell Claude your GitHub username, or replace `GITHUB_USERNAME` yourself in `web/index.html` and `store/store-listing.txt`.
4. On your Mac, in Terminal:
   ```
   cd "~/Downloads/Make It Cute/make-it-cute"
   git remote add origin https://github.com/GITHUB_USERNAME/make-it-cute.git
   git push -u origin main
   ```
   GitHub will ask you to sign in the first time. GitHub Desktop works too: choose File → Add Local Repository → Publish.
5. In the repo, go to **Settings → Pages → Source: GitHub Actions**. The "Publish website" action runs, and the site appears at
   `https://GITHUB_USERNAME.github.io/make-it-cute/` with the privacy page at `.../privacy.html`.

## 2. Developer accounts (start now, verification takes a few days)
- **Google Play:** play.google.com/console, a personal account with your own Google account, US$25 once.
- **Apple:** developer.apple.com, enroll as an individual, US$99 a year.

## 3. Android → Google Play
**Make your upload key (once).** In Terminal on your Mac:
```
keytool -genkeypair -v -keystore make-it-cute-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```
Keep the `.jks` file and its password **safe and backed up**. Never commit it (the .gitignore already blocks it).

**Give it to GitHub as secrets.** Repo → Settings → Secrets and variables → Actions → New repository secret:
| Secret | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | output of `base64 -i make-it-cute-upload.jks` |
| `ANDROID_KEYSTORE_PASSWORD` | the keystore password |
| `ANDROID_KEY_ALIAS` | `upload` |
| `ANDROID_KEY_PASSWORD` | the key password (often the same) |

**Build.** Actions tab → **Build Android app** → Run workflow. When it finishes, download `make-it-cute-android` from the run's Artifacts. Inside is the `.aab`.
(You can also build on your Mac with Android Studio: `npm install`, `npx cap sync`, `npx cap open android`, then Build → Generate Signed Bundle.)

**Play Console.**
1. Create app → Make It Cute → App → Free.
2. Fill in App content:
   - Privacy policy: your Pages `privacy.html` link.
   - Ads: No. Data safety: no data collected.
   - Target audience: 9–12. Content rating: answer the questionnaire.
3. Main store listing: paste the text from `store/store-listing.txt`. Upload `web/icon-512.png`, `store/feature-graphic-1024x500.png` and the `store/screenshot-*.png` files.
4. Testing → **Closed testing**: upload the .aab and add **12+ testers** (Gmail addresses, Android phones). They must stay opted in for **14 days**, then you can apply for Production.

## 4. iPhone → App Store (on your Mac)
You need Xcode (free, from the Mac App Store) and Node.js (nodejs.org, LTS).
```
cd "~/Downloads/Make It Cute/make-it-cute"
npm install
npx cap sync ios
npx cap open ios
```
1. In Xcode, click **App** → Signing & Capabilities → choose your Team.
2. Run it on your iPhone and test the camera/video, photos, read-aloud, music, printing, "Save to my device" and Share.
3. Choose Product → Archive → Distribute App → App Store Connect.
4. In App Store Connect:
   - Category: Kids (ages 9–11) or Education.
   - App Privacy: Data Not Collected.
   - Privacy URL: your Pages link.
   - Screenshots: `store/ios-screenshot-*.png` (iPhone 6.9").
   - Description: from `store/store-listing.txt`.

## Updating
- **Website:** push to main. That's it.
- **Android:** bump `versionName` in `android/app/build.gradle` if you like (versionCode bumps automatically), run the Build Android app action, and upload the new .aab.
- **iPhone:** `npx cap sync ios`, bump the version in Xcode, then Archive and upload.
