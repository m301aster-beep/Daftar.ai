package ai.daftar.app

import android.net.Uri
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage
import kotlinx.coroutines.tasks.await

/**
 * مساحة بيانات مستقلة لكل معلم باستخدام Firebase UID.
 * المسار: teachers/{uid}
 */
class FirebaseTeacherStore(
    private val auth: FirebaseAuth = FirebaseAuth.getInstance(),
    private val database: FirebaseFirestore = FirebaseFirestore.getInstance(),
    private val storage: FirebaseStorage = FirebaseStorage.getInstance()
) {
    private fun uid(): String = auth.currentUser?.uid ?: error("يجب تسجيل الدخول أولاً")

    suspend fun createOrUpdateTeacher(name: String, email: String, photoUrl: String? = null) {
        val userId = uid()
        val data = mapOf(
            "uid" to userId,
            "name" to name,
            "email" to email,
            "photoUrl" to (photoUrl ?: ""),
            "updatedAt" to com.google.firebase.firestore.FieldValue.serverTimestamp()
        )
        database.collection("teachers").document(userId).set(data).await()
    }

    suspend fun getTeacher(): Map<String, Any>? = database.collection("teachers").document(uid()).get().await().data

    suspend fun saveImage(data: Uri, fileName: String): String {
        val reference = storage.reference.child("teachers/${uid()}/$fileName")
        reference.putFile(data).await()
        return reference.downloadUrl.await().toString()
    }

    suspend fun getStudents(): List<Map<String, Any>> = database.collection("teachers").document(uid()).collection("students").get().await().documents.mapNotNull { it.data }
}
