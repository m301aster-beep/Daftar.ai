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

## التوقيع والإصدار

يستخدم GitHub Actions أربعة أسرار مستودع لبناء النسخ الموقعة:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

عند دفع tag بصيغة `v1.0.0` يتم إنشاء GitHub Release تلقائيًا وإرفاق `app-release.apk` و`app-release.aab`.

## تحديث الواجهة هوائيًا

ينشر Workflow مجلد `dist` على GitHub Pages. التطبيق يحاول تحميل الواجهة من:

`https://m301aster-beep.github.io/Daftar.ai/`

وبذلك تظهر تحديثات React للمستخدمين دون إصدار Android جديد. إذا لم يتوفر الإنترنت، يعود التطبيق تلقائيًا إلى نسخة React المحلية المضمّنة داخل APK.
