'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const androidProject = path.join(root, 'build', 'jsb-link', 'frameworks', 'runtime-src', 'proj.android-studio');
const engineRoot = process.env.LONGMARCH_COCOS_ENGINE || 'E:/temp/CocosCreator-2.4.3/resources/cocos2d-x';
const versionCode = Number(process.env.LONGMARCH_VERSION_CODE || 2026072701);
const versionName = process.env.LONGMARCH_VERSION_NAME || '1.1.0';
const packageName = 'com.game.longmarch.creator243';

if (!Number.isInteger(versionCode) || versionCode < 1 || versionCode > 2100000000) {
  throw new Error(`versionCode 无效：${versionCode}`);
}
if (!/^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(versionName)) {
  throw new Error(`versionName 无效：${versionName}`);
}

const write = (file, text) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text.replace(/\r\n?/g, '\n').replace(/\n/g, '\r\n'));
};
const read = (file) => fs.readFileSync(file, 'utf8');

const sourceLib = path.join(engineRoot, 'cocos', 'platform', 'android', 'libcocos2dx');
const localLib = path.join(androidProject, 'libcocos2dx');
if (!fs.existsSync(path.join(androidProject, 'app', 'build.gradle'))) throw new Error(`Android 工程不存在：${androidProject}`);
if (!fs.existsSync(sourceLib)) throw new Error(`Cocos Android 库不存在：${sourceLib}`);
fs.rmSync(localLib, { recursive: true, force: true });
fs.cpSync(sourceLib, localLib, {
  recursive: true,
  filter: (source) => source === sourceLib || path.basename(source) !== 'build'
});

write(path.join(androidProject, 'settings.gradle'), `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

rootProject.name = "LongMarch"
include ":app", ":libcocos2dx"
project(":app").projectDir = new File(settingsDir, "app")
project(":libcocos2dx").projectDir = new File(settingsDir, "libcocos2dx")
`);

write(path.join(androidProject, 'build.gradle'), `plugins {
    id "com.android.application" version "8.9.2" apply false
    id "com.android.library" version "8.9.2" apply false
}

allprojects {
    repositories {
        google()
        mavenCentral()
        flatDir { dirs "libs" }
    }
}

tasks.register("clean", Delete) {
    delete rootProject.layout.buildDirectory
}
`);

write(path.join(androidProject, 'gradle', 'wrapper', 'gradle-wrapper.properties'), `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.11.1-bin.zip
networkTimeout=120000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`);

write(path.join(androidProject, 'gradle.properties'), `org.gradle.jvmargs=-Xmx4096m -Dfile.encoding=UTF-8
org.gradle.daemon=false
org.gradle.parallel=true
android.useAndroidX=false
android.enableJetifier=false
android.nonTransitiveRClass=true
PROP_COMPILE_SDK_VERSION=36
PROP_MIN_SDK_VERSION=21
PROP_TARGET_SDK_VERSION=36
PROP_BUILD_TOOLS_VERSION=35.0.0
PROP_APP_ABI=armeabi-v7a:arm64-v8a
android.injected.testOnly=false
`);

const normalizedEngine = engineRoot.replace(/\\/g, '/');
const cocosAndroidMkFile = path.join(androidProject, 'jni', 'CocosAndroid.mk');
const cocosAndroidMkTemplate = path.join(
  engineRoot,
  'templates',
  'js-template-link',
  'frameworks',
  'runtime-src',
  'proj.android-studio',
  'jni',
  'CocosAndroid.mk'
);
if (!fs.existsSync(cocosAndroidMkTemplate)) {
  throw new Error(`Cocos Android.mk 模板不存在：${cocosAndroidMkTemplate}`);
}
const cocosAndroidMk = read(cocosAndroidMkTemplate);
if (!/LOCAL_MODULE\s*:=\s*cocos2djs(?:_shared)?/.test(cocosAndroidMk)) {
  throw new Error(`无法识别 Cocos JSB 模块：${cocosAndroidMkFile}`);
}
write(
  cocosAndroidMkFile,
  cocosAndroidMk.replace(/LOCAL_MODULE\s*:=\s*cocos2djs(?:_shared)?/, 'LOCAL_MODULE := cocos2djs')
);

write(path.join(androidProject, 'app', 'build.gradle'), `plugins {
    id "com.android.application"
}

def signingFilePath = System.getenv("LONGMARCH_SIGNING_PROPERTIES")
if (signingFilePath == null || signingFilePath.trim().isEmpty()) {
    throw new GradleException("LONGMARCH_SIGNING_PROPERTIES 未设置")
}
def signingFile = file(signingFilePath)
if (!signingFile.isFile()) {
    throw new GradleException("签名配置不存在: " + signingFile)
}
def signingProps = new Properties()
signingFile.withInputStream { signingProps.load(it) }
["storeFile", "storePassword", "keyAlias", "keyPassword"].each {
    if (!signingProps.getProperty(it)) throw new GradleException("签名配置缺少 " + it)
}

def cocosSourceDir = System.getenv("COCOS_JSB_SOURCE_DIR")
if (cocosSourceDir == null || cocosSourceDir.trim().isEmpty()) {
    throw new GradleException("COCOS_JSB_SOURCE_DIR 未设置")
}
def nativeLibDir = System.getenv("LONGMARCH_NATIVE_LIB_DIR")
if (nativeLibDir == null || !file(nativeLibDir).isDirectory()) {
    throw new GradleException("LONGMARCH_NATIVE_LIB_DIR 未设置或不存在")
}
def generatedAssets = layout.buildDirectory.dir("generated/cocosAssets")
def syncCocosAssets = tasks.register("syncCocosAssets", Sync) {
    into(generatedAssets)
    from(cocosSourceDir + "/assets") { into "assets" }
    from(cocosSourceDir + "/src") { into "src" }
    from(cocosSourceDir + "/jsb-adapter") { into "jsb-adapter" }
    from(cocosSourceDir) {
        include "main.js", "project.json"
    }
}

android {
    namespace "${packageName}"
    compileSdk 36
    buildToolsVersion "35.0.0"
    // Creator 2.4.3's Android.mk runtime is validated against NDK r20.
    ndkVersion "20.1.5948944"

    defaultConfig {
        applicationId "${packageName}"
        minSdk 21
        targetSdk 36
        versionCode ${versionCode}
        versionName "${versionName}"
    }

    sourceSets {
        main {
            java.srcDirs "../src", "src"
            res.srcDirs "../res", "res"
            jniLibs.srcDirs nativeLibDir
            manifest.srcFile "AndroidManifest.xml"
            assets.srcDir generatedAssets
        }
    }

    signingConfigs {
        release {
            storeFile file(signingProps.getProperty("storeFile"))
            storePassword signingProps.getProperty("storePassword")
            keyAlias signingProps.getProperty("keyAlias")
            keyPassword signingProps.getProperty("keyPassword")
            enableV1Signing true
            enableV2Signing true
            enableV3Signing true
        }
    }

    buildTypes {
        release {
            debuggable false
            jniDebuggable false
            minifyEnabled true
            shrinkResources true
            signingConfig signingConfigs.release
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        }
    }

    packaging {
        jniLibs {
            useLegacyPackaging = true
        }
        resources {
            excludes += ["META-INF/DEPENDENCIES", "META-INF/LICENSE*", "META-INF/NOTICE*"]
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

tasks.named("preBuild").configure { dependsOn(syncCocosAssets) }

dependencies {
    implementation fileTree(dir: "../libs", include: ["*.jar", "*.aar"])
    implementation fileTree(dir: "libs", include: ["*.jar", "*.aar"])
    implementation fileTree(dir: "${normalizedEngine}/cocos/platform/android/java/libs", include: ["*.jar"])
    implementation project(":libcocos2dx")
}
`);

write(path.join(localLib, 'build.gradle'), `plugins {
    id "com.android.library"
}

android {
    namespace "org.cocos2dx.lib"
    compileSdk 36
    ndkVersion "20.1.5948944"

    defaultConfig {
        minSdk 21
        targetSdk 36
    }

    sourceSets {
        main {
            aidl.srcDir "${normalizedEngine}/cocos/platform/android/java/src"
            java.srcDir "${normalizedEngine}/cocos/platform/android/java/src"
            manifest.srcFile "AndroidManifest.xml"
        }
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation fileTree(include: ["*.jar"], dir: "${normalizedEngine}/cocos/platform/android/java/libs")
}
`);

const appManifestFile = path.join(androidProject, 'app', 'AndroidManifest.xml');
let appManifest = read(appManifestFile)
  .replace(/\s+package="[^"]+"/, '')
  .replace(/\s+android:usesCleartextTraffic="true"/, '')
  .replace('android:allowBackup="true"', 'android:allowBackup="false"')
  .replace('android:taskAffinity="" >', 'android:taskAffinity=""\n            android:exported="true" >')
  .replace(/\s*<uses-permission android:name="android\.permission\.(?:INTERNET|ACCESS_NETWORK_STATE|ACCESS_WIFI_STATE)"\/>\s*/g, '\n');
write(appManifestFile, appManifest);

const libManifestFile = path.join(localLib, 'AndroidManifest.xml');
let libManifest = read(libManifestFile).replace(/\s+package="[^"]+"/, '');
write(libManifestFile, libManifest);

console.log(`Android 正式工程：AGP 8.9.2 / Gradle 8.11.1 / API 36 / ${versionName} (${versionCode})`);
