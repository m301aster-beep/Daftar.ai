package ai.daftar.app

import android.app.Activity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import kotlinx.coroutines.tasks.await

class FirebaseGoogleAuth(private val activity: Activity) {
    private val auth = FirebaseAuth.getInstance()
    private val client: GoogleSignInClient

    init {
        val options = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(activity.getString(R.string.default_web_client_id))
            .requestEmail()
            .build()
        client = GoogleSignIn.getClient(activity, options)
    }

    fun signInIntent() = client.signInIntent

    suspend fun completeSignIn(idToken: String): FirebaseTeacherStore {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        auth.signInWithCredential(credential).await()
        return FirebaseTeacherStore(auth)
    }

    suspend fun signOut() {
        auth.signOut()
        client.signOut().await()
    }
}
