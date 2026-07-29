'use strict';

/**
 * 模块职责：收敛 Creator 生成的 Android 工程、权限、依赖和 ABI。
 * 关键约束：所有修改必须离线可复现，并保持 arm64、横屏和原版品牌资源门禁。
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const androidProject = path.join(root, 'build', 'jsb-link', 'frameworks', 'runtime-src', 'proj.android-studio');
const engineRootValue = process.env.LONGMARCH_COCOS_ENGINE;
if (!engineRootValue) {
  throw new Error('缺少 LONGMARCH_COCOS_ENGINE，请由构建入口传入 Creator 原生引擎目录。');
}
const engineRoot = path.resolve(engineRootValue);
const versionCode = Number(process.env.LONGMARCH_VERSION_CODE || 2026072902);
const versionName = process.env.LONGMARCH_VERSION_NAME || '1.2.0';
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
const engineJavaSource = path.join(engineRoot, 'cocos', 'platform', 'android', 'java', 'src');
if (!fs.existsSync(path.join(androidProject, 'app', 'build.gradle'))) throw new Error(`Android 工程不存在：${androidProject}`);
if (!fs.existsSync(sourceLib)) throw new Error(`Cocos Android 库不存在：${sourceLib}`);
fs.rmSync(localLib, { recursive: true, force: true });
fs.cpSync(sourceLib, localLib, {
  recursive: true,
  filter: (source) => source === sourceLib || path.basename(source) !== 'build'
});
const localJavaSource = path.join(localLib, 'src', 'main', 'java');
fs.rmSync(localJavaSource, { recursive: true, force: true });
fs.cpSync(engineJavaSource, localJavaSource, { recursive: true });
write(
  path.join(localJavaSource, 'org', 'cocos2dx', 'lib', 'Cocos2dxDownloader.java'),
  `package org.cocos2dx.lib;

/**
 * 为 Creator 原生下载器注册提供离线兼容外壳。
 * 游戏没有下载调用点、网络权限、OkHttp 或 Okio，因此实现不能创建网络任务。
 */
public final class Cocos2dxDownloader {
    private final int id;

    private Cocos2dxDownloader(int id) {
        this.id = id;
    }

    public static Cocos2dxDownloader createDownloader(
            int id, int timeoutInSeconds, String tempFileSuffix, int maxProcessingTasks) {
        return new Cocos2dxDownloader(id);
    }

    public static void createTask(
            final Cocos2dxDownloader downloader,
            final int taskId,
            String url,
            String path,
            String[] headers) {
        Cocos2dxHelper.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                downloader.nativeOnFinish(
                        downloader.id,
                        taskId,
                        -1,
                        "Offline build does not support download tasks",
                        null);
            }
        });
    }

    public static void abort(Cocos2dxDownloader downloader, int taskId) {
        // 离线发布不允许创建网络任务。
    }

    public static void cancelAllRequests(Cocos2dxDownloader downloader) {
        // 离线发布不允许创建网络任务。
    }

    native void nativeOnFinish(
            int downloaderId, int taskId, int errorCode, String error, byte[] data);
}
`
);

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
distributionSha256Sum=f397b287023acdba1e9f6fc5ea72d22dd63669d59ed4a289a29b1a76eee151c6
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
PROP_APP_ABI=arm64-v8a
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

// COCOS2D_DEBUG 非零时 Creator 会启动 V8 调试端口；Android 9 以上模拟器可能
// 拒绝绑定并让进程退出。质量验证包仍保留 Android 调试与原生符号，但不暴露或依赖
// TCP 调试监听。
const appDelegateFile = path.join(androidProject, '..', 'Classes', 'AppDelegate.cpp');
const appDelegate = read(appDelegateFile);
const debuggerBlock = /#if defined\(COCOS2D_DEBUG\) && \(COCOS2D_DEBUG > 0\)\s*\/\/ Enable debugger here\s*jsb_enable_debugger\("0\.0\.0\.0", 6086, false\);\s*#endif/;
const debuggerDisabled = '// V8 inspector disabled: QA/release builds must not bind a TCP debug port.';
if (!debuggerBlock.test(appDelegate) && !appDelegate.includes(debuggerDisabled)) {
  throw new Error(`无法定位 Creator 2.4.15 V8 inspector 启动块：${appDelegateFile}`);
}
write(
  appDelegateFile,
  appDelegate.replace(debuggerBlock, debuggerDisabled)
);

// Android 标准 Cocos2dxGLSurfaceView 只转发方向键，实体 A/D/W/S 不会到达
// cc.systemEvent，因此在生成的 Activity 中映射为等价方向键。
const appActivityFile = path.join(
  androidProject,
  'app',
  'src',
  'org',
  'cocos2dx',
  'javascript',
  'AppActivity.java'
);
let appActivity = read(appActivityFile);
const hardwareKeyMarker = 'LongMarch hardware key bridge';
if (!appActivity.includes(hardwareKeyMarker)) {
  appActivity = appActivity.replace(
    'import android.content.res.Configuration;',
    'import android.content.res.Configuration;\nimport android.view.KeyEvent;'
  );
  const activityClass = 'public class AppActivity extends Cocos2dxActivity {';
  if (!appActivity.includes(activityClass)) {
    throw new Error(`无法定位 Android Activity：${appActivityFile}`);
  }
  appActivity = appActivity.replace(
    activityClass,
    `${activityClass}

    // 实体键桥接：Cocos 原生只转发方向键，不直接转发 A/D/W/S。
    private static int mapMovementKey(int keyCode) {
        switch (keyCode) {
            case KeyEvent.KEYCODE_A: return KeyEvent.KEYCODE_DPAD_LEFT;
            case KeyEvent.KEYCODE_D: return KeyEvent.KEYCODE_DPAD_RIGHT;
            case KeyEvent.KEYCODE_W: return KeyEvent.KEYCODE_DPAD_UP;
            case KeyEvent.KEYCODE_S: return KeyEvent.KEYCODE_DPAD_DOWN;
            default: return keyCode;
        }
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        int mapped = mapMovementKey(event.getKeyCode());
        Cocos2dxGLSurfaceView surface = getGLSurfaceView();
        if (mapped != event.getKeyCode() && surface != null) {
            if (event.getAction() == KeyEvent.ACTION_DOWN) {
                return surface.onKeyDown(mapped, event);
            }
            if (event.getAction() == KeyEvent.ACTION_UP) {
                return surface.onKeyUp(mapped, event);
            }
        }
        return super.dispatchKeyEvent(event);
    }
`
  );
}
write(appActivityFile, appActivity);

write(path.join(androidProject, 'app', 'build.gradle'), `plugins {
    id "com.android.application"
}

def requestedTasks = gradle.startParameter.taskNames.collect { it.toLowerCase() }
def needsReleaseSigning = requestedTasks.any { it.contains("release") }
def signingFilePath = System.getenv("LONGMARCH_SIGNING_PROPERTIES")
def hasReleaseSigning = signingFilePath != null && !signingFilePath.trim().isEmpty()
if (needsReleaseSigning && !hasReleaseSigning) {
    throw new GradleException("LONGMARCH_SIGNING_PROPERTIES 未设置")
}
def signingProps = new Properties()
if (hasReleaseSigning) {
    def signingFile = file(signingFilePath)
    if (!signingFile.isFile()) {
        throw new GradleException("签名配置不存在: " + signingFile)
    }
    signingFile.withInputStream { signingProps.load(it) }
    ["storeFile", "storePassword", "keyAlias", "keyPassword"].each {
        if (!signingProps.getProperty(it)) throw new GradleException("签名配置缺少 " + it)
    }
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
    // Creator Android.mk 运行时只在 NDK r20 兼容组合下验证。
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
            if (hasReleaseSigning) {
                storeFile file(signingProps.getProperty("storeFile"))
                storePassword signingProps.getProperty("storePassword")
                keyAlias signingProps.getProperty("keyAlias")
                keyPassword signingProps.getProperty("keyPassword")
                enableV1Signing true
                enableV2Signing true
                enableV3Signing true
            }
        }
    }

    buildTypes {
        debug {
            debuggable true
            jniDebuggable true
            minifyEnabled false
            shrinkResources false
        }
        release {
            debuggable false
            jniDebuggable false
            minifyEnabled true
            shrinkResources true
            if (hasReleaseSigning) signingConfig signingConfigs.release
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
    implementation fileTree(
        dir: "${normalizedEngine}/cocos/platform/android/java/libs",
        include: ["*.jar"],
        exclude: ["okhttp-*.jar", "okio-*.jar"]
    )
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
            aidl.srcDir "src/main/java"
            java {
                srcDir "src/main/java"
            }
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
    implementation fileTree(
        dir: "${normalizedEngine}/cocos/platform/android/java/libs",
        include: ["*.jar"],
        exclude: ["okhttp-*.jar", "okio-*.jar"]
    )
}
`);

const appManifestFile = path.join(androidProject, 'app', 'AndroidManifest.xml');
let appManifest = read(appManifestFile)
  .replace(/\s+package="[^"]+"/, '')
  .replace(/\s+android:usesCleartextTraffic="true"/, '')
  .replace('android:allowBackup="true"', 'android:allowBackup="false"')
  .replace(/android:screenOrientation="[^"]+"/, 'android:screenOrientation="landscape"')
  .replace('android:taskAffinity="" >', 'android:taskAffinity=""\n            android:exported="true" >')
  .replace(/\s*<uses-permission android:name="android\.permission\.(?:INTERNET|ACCESS_NETWORK_STATE|ACCESS_WIFI_STATE)"\/>\s*/g, '\n');
write(appManifestFile, appManifest);

// 四档启动图标精确复用受控原版资源；放在 Creator 资源树之外可避免启动图在游戏包内重复。
const launcherIconRoot = path.join(root, 'native', 'android');
for (const density of ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi']) {
  const relativeIcon = path.join(`mipmap-${density}`, 'ic_launcher.png');
  const sourceIcon = path.join(launcherIconRoot, relativeIcon);
  const generatedIcon = path.join(androidProject, 'res', relativeIcon);
  if (!fs.existsSync(sourceIcon)) {
    throw new Error(`原版启动图标不存在：${sourceIcon}`);
  }
  fs.mkdirSync(path.dirname(generatedIcon), { recursive: true });
  fs.copyFileSync(sourceIcon, generatedIcon);
}

const libManifestFile = path.join(localLib, 'AndroidManifest.xml');
let libManifest = read(libManifestFile)
  .replace(/\s+package="[^"]+"/, '')
  .replace(/\s*<uses-permission android:name="android\.permission\.(?:INTERNET|ACCESS_NETWORK_STATE|ACCESS_WIFI_STATE)"\/>\s*/g, '\n');
write(libManifestFile, libManifest);

console.log(`Android 正式工程：AGP 8.9.2 / Gradle 8.11.1 / API 36 / arm64-v8a / 原版图标 / ${versionName} (${versionCode})`);
