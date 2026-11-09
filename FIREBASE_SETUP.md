# إعداد Firebase لمشروع Daftar AI

## 1. إنشاء المشروع

من Firebase Console أنشئ مشروعًا جديدًا، ثم أضف Web App. انسخ قيم الإعداد إلى ملف `.env` محليًا اعتمادًا على `.env.example`.

فعّل من Authentication > Sign-in method:

- Google

وأضف نطاقات التطبيق في Authentication > Settings > Authorized domains، مثل نطاق Firebase Hosting ونطاق GitHub Pages إن كنت ستستخدمهما معًا.

## 2. تجهيز المشروع محليًا

```bash
cp .env.example .env
# املأ قيم VITE_FIREBASE_* وVITE_API_URL
cp .firebaserc.example .firebaserc
# ضع project ID الحقيقي داخل .firebaserc
npm run build
npx firebase login
npx firebase deploy --only hosting,firestore,storage
```

## 3. إعداد GitHub Actions

أضف الأسرار التالية إلى مستودع GitHub:

```text
FIREBASE_PROJECT_ID
FIREBASE_SERVICE_ACCOUNT_DAFTAR
VITE_API_URL
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

قيمة `FIREBASE_SERVICE_ACCOUNT_DAFTAR` هي محتوى JSON لحساب الخدمة الذي تنشئه من Project settings > Service accounts.

بعد إضافة الأسرار، أي Push إلى `main` سيبني الواجهة وينشرها على Firebase Hosting عبر Workflow `firebase-hosting.yml`.

## 4. المصادقة والباك اند

الواجهة تستخدم Firebase Google Login عندما تكون قيم Firebase موجودة، ثم ترسل Firebase ID token إلى:

```text
POST /api/auth/firebase
```

يجب أن يتحقق Backend من التوكن باستخدام Firebase Admin SDK، ثم ينشئ أو يقرأ مساحة المعلم بناءً على `uid`. لا تضع `FIREBASE_SERVICE_ACCOUNT` داخل الواجهة أو داخل ملف `.env` المنشور.

## 5. صور المعلم والشعار

يتم رفع الصور إلى Storage داخل المسار:

```text
teachers/{uid}/profile.png
teachers/{uid}/logo.png
```

وقواعد Storage تمنع أي معلم من قراءة أو تعديل ملفات معلم آخر.
