package ai.daftar.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewFeature
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import org.json.JSONObject

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var assetLoader: WebViewAssetLoader
    private var remotePageAttempted = false
    private val firebaseAuth by lazy { FirebaseAuth.getInstance() }
    private val googleLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        try {
            val account = GoogleSignIn.getSignedInAccountFromIntent(result.data)
                .getResult(ApiException::class.java)
            val idToken = account.idToken
            if (idToken.isNullOrBlank()) {
                sendNativeAuthError("لم يتم إنشاء ID Token. تأكد من Web Client ID في Firebase")
                return@registerForActivityResult
            }
            firebaseAuth.signInWithCredential(GoogleAuthProvider.getCredential(idToken, null))
                .addOnSuccessListener { authResult ->
                    val user = authResult.user
                    if (user == null) sendNativeAuthError("تعذر قراءة حساب Google")
                    else user.getIdToken(false)
                        .addOnSuccessListener { tokenResult ->
                            val firebaseToken = tokenResult.token
                            if (firebaseToken.isNullOrBlank()) sendNativeAuthError("تعذر إنشاء Firebase ID Token")
                            else sendNativeAuthSuccess(firebaseToken, user.displayName, user.email, user.photoUrl?.toString())
                        }
                        .addOnFailureListener { error -> sendNativeAuthError(error.message ?: "تعذر إنشاء Firebase ID Token") }
                }
                .addOnFailureListener { error -> sendNativeAuthError(error.message ?: "تعذر تسجيل الدخول عبر Firebase") }
        } catch (error: ApiException) {
            sendNativeAuthError(googleErrorMessage(error.statusCode))
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.web_view)
        assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.cacheMode = android.webkit.WebSettings.LOAD_NO_CACHE
        // React is bundled in the APK. These settings are required by WebView
        // when loading the local module bundle from android_asset.
        webView.settings.allowFileAccess = true
        webView.settings.allowContentAccess = true
        @Suppress("DEPRECATION")
        webView.settings.allowFileAccessFromFileURLs = true
        @Suppress("DEPRECATION")
        webView.settings.allowUniversalAccessFromFileURLs = true
        webView.addJavascriptInterface(AndroidAuthBridge(), "AndroidAuth")
        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
                    ?: super.shouldInterceptRequest(view, request)
            }

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                return request.url.scheme !in setOf("https", "http", "file", "about")
            }

            override fun onReceivedError(
                view: WebView,
                request: android.webkit.WebResourceRequest,
                error: android.webkit.WebResourceError
            ) {
                if (request.isForMainFrame && remotePageAttempted) loadLocalApp()
                super.onReceivedError(view, request, error)
            }

            override fun onReceivedHttpError(
                view: WebView,
                request: android.webkit.WebResourceRequest,
                errorResponse: android.webkit.WebResourceResponse
            ) {
                if (request.isForMainFrame && remotePageAttempted && errorResponse.statusCode >= 400) {
                    loadLocalApp()
                }
                super.onReceivedHttpError(view, request, errorResponse)
            }
        }
        webView.webChromeClient = WebChromeClient()

        if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK)) {
            WebSettingsCompat.setForceDark(webView.settings, WebSettingsCompat.FORCE_DARK_OFF)
        }

        val remoteUrl = BuildConfig.UI_URL.trim()
        if (remoteUrl.isNotEmpty()) {
            remotePageAttempted = true
            val separator = if (remoteUrl.contains('?')) '&' else '?'
            webView.loadUrl("$remoteUrl${separator}ota=${BuildConfig.VERSION_CODE}")
        } else {
            loadLocalApp()
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack() else finish()
            }
        })
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }

    private fun loadLocalApp() {
        remotePageAttempted = false
        // Keep the React UI fully offline inside the APK. The asset-loader URL
        // remains available for modern WebView versions, while file:// is the
        // most compatible path for older Android WebView installations.
        webView.loadUrl("file:///android_asset/web/index.html")
    }

    private fun startNativeGoogleSignIn() {
        val clientId = getString(R.string.default_web_client_id)
        if (clientId.startsWith("ضع_") || !clientId.endsWith(".apps.googleusercontent.com")) {
            sendNativeAuthError("أضف Web Client ID من Firebase إلى default_web_client_id أولاً")
            return
        }
        val options = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(clientId)
            .requestEmail()
            .build()
        googleLauncher.launch(GoogleSignIn.getClient(this, options).signInIntent)
    }

    private fun sendNativeAuthSuccess(token: String, name: String?, email: String?, picture: String?) {
        val payload = JSONObject()
            .put("token", token)
            .put("user", JSONObject().put("name", name ?: "").put("email", email ?: "").put("picture", picture ?: ""))
        sendToReact(payload.toString())
    }

    private fun sendNativeAuthError(message: String) {
        sendToReact(JSONObject().put("error", message).toString())
    }

    private fun googleErrorMessage(statusCode: Int): String = when (statusCode) {
        10 -> "DEVELOPER_ERROR (10): تحقق من SHA-1 وSHA-256 وWeb Client ID والحزمة ai.daftar.app في Firebase"
        7 -> "تعذر الاتصال بخدمات Google. تحقق من الإنترنت ثم حاول مرة أخرى"
        12501 -> "تم إلغاء اختيار حساب Google"
        12500 -> "تعذر تسجيل الدخول عبر Google. تحقق من إعداد OAuth في Firebase"
        else -> "فشل تسجيل Google Native. كود الخطأ: $statusCode"
    }

    private fun sendToReact(payload: String) {
        val quoted = JSONObject.quote(payload)
        runOnUiThread { webView.evaluateJavascript("window.__daftarNativeAuth && window.__daftarNativeAuth($quoted)", null) }
    }

    private inner class AndroidAuthBridge {
        @JavascriptInterface
        fun signInWithGoogle(@Suppress("UNUSED_PARAMETER") identityJson: String) = runOnUiThread { startNativeGoogleSignIn() }
    }
}
