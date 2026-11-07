# Daftar AI Android

هذا مجلد تطبيق Android أصلي بـKotlin يعرض واجهة React الحالية داخل WebView.

## التشغيل والبناء

من جذر المشروع:

```bash
npm install
npm run android:prepare
cd android
./gradlew assembleDebug
```

الناتج سيكون في `android/app/build/outputs/apk/debug/app-debug.apk`.

لبناء نسخة النشر:

```bash
./gradlew bundleRelease
```

يتم إنشاء APK وAAB تلقائيًا عبر GitHub Actions عند الدفع إلى فرع `main` أو عند تشغيل Workflow يدويًا.
