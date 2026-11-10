package ai.daftar.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewFeature
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import org.json.JSONObject

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private var remotePageAttempted = false
    private val firebaseAuth by lazy { FirebaseAuth.getInstance() }
    private val googleLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode != RESULT_OK) {
            sendNativeAuthError("تم إلغاء تسجيل الدخول عبر Google")
            return@registerForActivityResult
        }
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
                    else sendNativeAuthSuccess(idToken, user.displayName, user.email, user.photoUrl?.toString())
                }
                .addOnFailureListener { error -> sendNativeAuthError(error.message ?: "تعذر تسجيل الدخول عبر Firebase") }
        } catch (error: ApiException) {
            sendNativeAuthError("Google Sign-In error: ${error.statusCode}")
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.web_view)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.cacheMode = android.webkit.WebSettings.LOAD_NO_CACHE
        webView.settings.allowFileAccess = false
        webView.settings.allowContentAccess = false
        webView.addJavascriptInterface(AndroidAuthBridge(), "AndroidAuth")
        webView.webViewClient = object : WebViewClient() {
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

    private fun sendToReact(payload: String) {
        val quoted = JSONObject.quote(payload)
        runOnUiThread { webView.evaluateJavascript("window.__daftarNativeAuth && window.__daftarNativeAuth($quoted)", null) }
    }

    private inner class AndroidAuthBridge {
        @JavascriptInterface
        fun signInWithGoogle() = runOnUiThread { startNativeGoogleSignIn() }
    }
}
