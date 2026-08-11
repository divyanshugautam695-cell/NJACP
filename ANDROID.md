# NJACP Android app

NJACP uses Capacitor to package the live Next.js application as an Android app. Capacitor is designed to turn existing modern web apps into native Android/iOS containers.

## APK build

A GitHub Actions workflow is included at `.github/workflows/android-apk.yml`.

1. Open the repository on GitHub.
2. Open **Actions**.
3. Select **Build NJACP Android APK**.
4. Choose **Run workflow** on `main`.
5. Wait for the build to finish.
6. Open the completed workflow run and download the **NJACP-Android-debug** artifact.
7. Extract the ZIP and install `app-debug.apk` on an Android phone.

The APK currently points at the production web app through `capacitor.config.ts`. If your Vercel deployment uses a different production URL, replace the `server.url` value there with your exact Vercel URL before building.

## Important security note

The Hugging Face token must stay on the server/Vercel environment. It must never be embedded in the APK or frontend code.

## Future release build

The debug APK is intended for testing and demonstrations. A Play Store release should use a signed Android App Bundle (AAB), with a private signing key stored outside the repository.
