plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "ai.daftar.app"
    compileSdk = 35

    val releaseKeystore = file(System.getenv("ANDROID_KEYSTORE_PATH") ?: "release.keystore")
    val hasReleaseSigning = releaseKeystore.exists() &&
        !System.getenv("ANDROID_KEYSTORE_PASSWORD").isNullOrBlank() &&
        !System.getenv("ANDROID_KEY_ALIAS").isNullOrBlank() &&
        !System.getenv("ANDROID_KEY_PASSWORD").isNullOrBlank()

    defaultConfig {
        applicationId = "ai.daftar.app"
        minSdk = 24
        targetSdk = 35
        versionCode = (System.getenv("VERSION_CODE") ?: "1").toInt()
        versionName = System.getenv("VERSION_NAME") ?: "1.0.0"
        buildConfigField("String", "UI_URL", "\"${System.getenv("UI_URL") ?: ""}\"")
    }

    signingConfigs {
        if (hasReleaseSigning) {
            create("release") {
                storeFile = releaseKeystore
                storePassword = System.getenv("ANDROID_KEYSTORE_PASSWORD")
                keyAlias = System.getenv("ANDROID_KEY_ALIAS")
                keyPassword = System.getenv("ANDROID_KEY_PASSWORD")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = if (hasReleaseSigning) signingConfigs.getByName("release") else signingConfigs.getByName("debug")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        buildConfig = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.activity:activity-ktx:1.10.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.webkit:webkit:1.12.1")
}

// The React build is copied into the WebView assets before Android compilation.
tasks.register<Copy>("copyReactAssets") {
    from(rootProject.projectDir.parentFile.resolve("dist"))
    into(layout.projectDirectory.dir("src/main/assets/web"))
}

tasks.named("preBuild") {
    dependsOn("copyReactAssets")
}
