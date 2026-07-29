'use strict';

/**
 * 模块职责：管理音乐和音效的加载、播放、音量与释放。
 * 关键约束：不同音频类别分别计算音量，避免旧语音滑块误伤脚步和动作反馈。
 */

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var GameState = require("./GameState");
var ResourceManager = require("./ResourceManager");
var AudioCatalog = require("./AudioCatalog");

function numberInRange(value, fallback) {
    var numeric = Number(value);
    if (!isFinite(numeric)) numeric = fallback;
    return Math.max(0, Math.min(1, numeric));
}

var AudioManager = function () {
    function AudioManager() { }

    AudioManager.isEnabled = function (key) {
        var stored = cc.sys.localStorage.getItem(key);
        return null == stored || "0" != stored && "false" != String(stored).toLowerCase();
    };

    AudioManager.loadClip = function (path, callback) {
        var manager = this;
        var normalizedPath = String(path || "").replace(/\.(mp3|wav|ogg)$/i, "");
        if (this.audioCache[normalizedPath]) {
            callback(null, this.audioCache[normalizedPath]);
            return;
        }
        if (this.audioLoading[normalizedPath]) {
            this.audioLoading[normalizedPath].push(callback);
            return;
        }
        this.audioLoading[normalizedPath] = [callback];
        ResourceManager.default.load(normalizedPath, cc.AudioClip, function (error, clip) {
            if (!error && clip) manager.audioCache[normalizedPath] = clip;
            var callbacks = manager.audioLoading[normalizedPath] || [];
            delete manager.audioLoading[normalizedPath];
            for (var index = 0; index < callbacks.length; index++) callbacks[index](error, clip);
        });
    };

    AudioManager.passBGM = function () {
        this.bgmRequestToken++;
        if (this.bgmID >= 0) {
            cc.audioEngine.stop(this.bgmID);
            this.bgmID = -1;
        }
    };

    AudioManager.gamePlayBGM = function (name, loop) {
        var manager = this;
        void 0 === loop && (loop = !0);
        var key = AudioCatalog.default.musicKey(name);
        if (GameState.default.nowBGM == key && this.bgmID >= 0) return;
        var requestToken = ++this.bgmRequestToken;
        if (this.bgmID >= 0) {
            cc.audioEngine.stop(this.bgmID);
            this.bgmID = -1;
        }
        GameState.default.nowBGM = key;
        if (numberInRange(GameState.default.MUSIC_BGM, 1) <= 0 || !this.isEnabled("BGM_ENABLED")) return;
        this.loadClip(AudioCatalog.default.musicPath(key), function (error, clip) {
            if (error || !clip) {
                console.error("------------ 背景音乐加载失败 " + key, error);
                return;
            }
            if (requestToken != manager.bgmRequestToken || GameState.default.nowBGM != key) return;
            var volume = numberInRange(GameState.default.MUSIC_BGM, 1);
            cc.audioEngine.setMusicVolume(volume);
            manager.bgmID = cc.audioEngine.playMusic(clip, loop);
            console.log("------------ 背景音乐开始 " + key);
        });
    };

    AudioManager.stopBGM = function () {
        this.passBGM();
        GameState.default.nowBGM = "";
    };

    AudioManager.playSound = function (name, loop, volume) {
        var manager = this;
        void 0 === loop && (loop = !1);
        var key = AudioCatalog.default.effectKey(name);
        var requestToken = (this.soundRequestTokens[key] || 0) + 1;
        this.soundRequestTokens[key] = requestToken;
        if (this.soundMap[key] >= 0) {
            cc.audioEngine.stop(this.soundMap[key]);
            this.soundMap[key] = -1;
        }
        if (null != volume) this.soundVolumes[key] = numberInRange(volume, 1);
        if (numberInRange(GameState.default.MUSIC_SOUND, 1) <= 0 || !this.isEnabled("SOUND_ENABLED")) return;
        this.loadClip(AudioCatalog.default.effectPath(key), function (error, clip) {
            if (error || !clip) {
                console.error("------------ 音效加载失败 " + key, error);
                return;
            }
            if (requestToken != manager.soundRequestTokens[key]) return;
            var baseVolume = null != manager.soundVolumes[key] ? manager.soundVolumes[key] : 1;
            var effectVolume = baseVolume * numberInRange(GameState.default.MUSIC_SOUND, 1);
            manager.soundMap[key] = cc.audioEngine.play(clip, loop, effectVolume);
        });
        return key;
    };

    AudioManager.gameStopSound = function (name) {
        var key = AudioCatalog.default.effectKey(name);
        this.soundRequestTokens[key] = (this.soundRequestTokens[key] || 0) + 1;
        if (this.soundMap[key] >= 0) cc.audioEngine.stop(this.soundMap[key]);
        this.soundMap[key] = -1;
        delete this.soundVolumes[key];
    };

    AudioManager.stopSceneSounds = function () {
        for (var key in this.soundRequestTokens) this.soundRequestTokens[key]++;
        for (var soundKey in this.soundMap) {
            if (this.soundMap[soundKey] >= 0) cc.audioEngine.stop(this.soundMap[soundKey]);
        }
        this.soundMap = {};
        this.soundVolumes = {};
    };

    AudioManager.setSoundVolume = function (name, volume) {
        var key = AudioCatalog.default.effectKey(name);
        var normalizedVolume = numberInRange(volume, 1);
        this.soundVolumes[key] = normalizedVolume;
        if (this.soundMap[key] >= 0) {
            cc.audioEngine.setVolume(
                this.soundMap[key],
                normalizedVolume * numberInRange(GameState.default.MUSIC_SOUND, 1)
            );
        }
    };

    AudioManager.refreshSoundVolumes = function () {
        // Creator 只提供一个覆盖所有类别的全局音效音量；将它保持中性，再按每个活动
        // 音频应用玩家设置，避免未使用的语音滑块静音脚步和动作音效。
        cc.audioEngine.setEffectsVolume(1);
        var soundVolume = numberInRange(GameState.default.MUSIC_SOUND, 1);
        for (var key in this.soundMap) {
            if (this.soundMap[key] < 0) continue;
            var baseVolume = null != this.soundVolumes[key] ? this.soundVolumes[key] : 1;
            cc.audioEngine.setVolume(this.soundMap[key], baseVolume * soundVolume);
        }
    };

    AudioManager.playGoSound = function () {
        this.playSound("go", !1, this.voiceVolume);
    };

    AudioManager.lk_button = "lk_button";
    AudioManager.audioList = {};
    AudioManager.flag = !0;
    AudioManager.bgVolume = 1;
    AudioManager.deskVolume = 1;
    AudioManager.voiceVolume = 1;
    AudioManager.bgAudioID = -1;
    AudioManager.storyAudioId = -1;
    AudioManager.nowSoundVal = 0;
    AudioManager.soundMap = {};
    AudioManager.soundVolumes = {};
    AudioManager.soundRequestTokens = {};
    AudioManager.bgmID = -1;
    AudioManager.bgmRequestToken = 0;
    AudioManager.audioCache = {};
    AudioManager.audioLoading = {};
    return AudioManager;
}();

exports.default = AudioManager;
