# Firebase Android — Daftar AI

تطبيق Android يستخدم جسرًا أصليًا لفتح حسابات Google، مع واجهة WebView محدثة من Cloudflare Pages ونسخة محلية احتياطية.

تم ربط التطبيق بالحزمة التالية:

```text
ai.daftar.app
```

ومشروع Firebase الموجود في الملف المرفق:

```text
project_id: master-40cd2
project_number: 668388767870
```

تم وضع ملف Firebase في:

```text
android/app/google-services.json
```

## ما تمت إضافته

- Firebase Authentication.
- Google Sign-In dependency.
- Firestore لإنشاء مساحة المعلم داخل `teachers/{firebaseUid}`.
- Storage لصور المعلم والشعار داخل `teachers/{firebaseUid}/...`.
- `FirebaseTeacherStore.kt` لإنشاء ملف المعلم وجلب بياناته وطلابه.
- `FirebaseGoogleAuth.kt` لإكمال تسجيل Google داخل Kotlin.

## قبل تشغيل تسجيل Google

من Firebase Console أضف SHA-1 وSHA-256 لمفتاح التطبيق إلى تطبيق Android ذي المعرف `ai.daftar.app`، ثم أنشئ OAuth Web Client ID وضعه بدل القيمة المؤقتة في:

```text
android/app/src/main/res/values/strings.xml
```

القيمة المطلوبة هي:

```xml
<string name="default_web_client_id">WEB_CLIENT_ID.apps.googleusercontent.com</string>
```

ملف `google-services.json` المرفق لا يحتوي على `oauth_client`، ولذلك لا يمكن تشغيل Google Sign-In فعليًا قبل إنشاء Web Client ID وإضافة بصمات التوقيع.

## بناء APK/AAB

من جذر المشروع:

```bash
npm run android:prepare
cd android
gradle assembleDebug
# للإصدار الموقّع:
gradle assembleRelease bundleRelease
```

الناتج:

```text
android/app/build/outputs/apk/debug/app-debug.apk
android/app/build/outputs/apk/release/app-release.apk
android/app/build/outputs/bundle/release/app-release.aab
```

لا يتم إنشاء كلمة مرور أو Service Account داخل تطبيق Android. قواعد Firestore وStorage يجب أن تظل مفعلة بحيث لا يقرأ المعلم إلا المسار الخاص بـ Firebase UID الخاص به.
