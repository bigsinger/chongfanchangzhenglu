'use strict';

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = require("./GameState"), a = require("./ResourceManager"), n = function () {
            function t() { }
            t.isEnabled = function (t) {
                var e = cc.sys.localStorage.getItem(t);
                return null == e || "0" != e && "false" != String(e).toLowerCase();
            };
            t.loadClip = function (t, e) {
                var o = this;
                // Creator 2.4 的 resources 接口使用不带扩展名的资源路径，
                // 同时兼容迁移前代码里普遍存在的 ".mp3" / ".wav" 写法。
                var i = t.replace(/\.(mp3|wav|ogg)$/i, "");
                if (this.audioCache[i]) {
                    e(null, this.audioCache[i]);
                    return;
                }
                if (this.audioLoading[i]) {
                    this.audioLoading[i].push(e);
                    return;
                }
                this.audioLoading[i] = [e];
                a.default.load(i, cc.AudioClip, function (e, t) {
                    e || (o.audioCache[i] = t);
                    var n = o.audioLoading[i] || [];
                    delete o.audioLoading[i];
                    for (var a = 0; a < n.length; a++) n[a](e, t);
                });
            };
            t.passBGM = function () {
                this.bgmRequestToken++;
                if (this.bgmID >= 0) {
                    cc.audioEngine.stop(this.bgmID);
                    this.bgmID = -1;
                }
            };
            t.gamePlayBGM = function (t, e) {
                var o = this;
                void 0 === e && (e = !0);
                var n = this.isEnabled("BGM_ENABLED");
                if (i.default.nowBGM != t || this.bgmID < 0) {
                    var a = ++this.bgmRequestToken;
                    if (this.bgmID >= 0) {
                        cc.audioEngine.stop(this.bgmID);
                        this.bgmID = -1;
                    }
                    if (i.default.MUSIC_BGM > 0 && n) {
                        var s = "sound/" + t + ".mp3";
                        i.default.nowBGM = t;
                        this.loadClip(s, function (n, s) {
                            if (n) console.error(n); else if (a == o.bgmRequestToken && i.default.nowBGM == t) {
                                o.bgmID = cc.audioEngine.playMusic(s, e);
                                cc.audioEngine.setVolume(o.bgmID, i.default.MUSIC_BGM);
                            }
                        });
                    }
                }
            };
            t.stopBGM = function () {
                this.bgmRequestToken++;
                if (this.bgmID >= 0) {
                    cc.audioEngine.stop(this.bgmID);
                    this.bgmID = -1;
                }
                i.default.nowBGM = "";
            };
            t.playSound = function (t, e) {
                var o = this;
                void 0 === e && (e = !1);
                var n = this.isEnabled("SOUND_ENABLED");
                var a = (this.soundRequestTokens[t] || 0) + 1;
                this.soundRequestTokens[t] = a;
                if (this.soundMap[t] >= 0) {
                    cc.audioEngine.stop(this.soundMap[t]);
                    this.soundMap[t] = -1;
                }
                if (i.default.MUSIC_SOUND > 0 && n) {
                    var s = "sound/effect/" + t;
                    this.loadClip(s, function (n, s) {
                        n ? console.error(n) : a == o.soundRequestTokens[t] && (o.soundMap[t] = cc.audioEngine.play(s, e, o.nowSoundVal || i.default.MUSIC_SOUND));
                    });
                }
            };
            t.gameStopSound = function (t) {
                this.soundRequestTokens[t] = (this.soundRequestTokens[t] || 0) + 1;
                if (this.soundMap[t] >= 0) {
                    cc.audioEngine.stop(this.soundMap[t]);
                    this.soundMap[t] = -1;
                    this.nowSoundVal = 0;
                }
            };
            t.setSoundVolume = function (t, e) {
                this.soundMap && this.soundMap[t] >= 0 && cc.audioEngine.setVolume(this.soundMap[t], e);
            };
            t.playGoSound = function () {
                var t = this;
                this.loadClip("sound/effect/go.mp3", function (e, o) {
                    e ? console.error(e) : cc.audioEngine.play(o, !1, t.voiceVolume);
                });
            };
            t.lk_button = "lk_button";
            t.audioList = {};
            t.flag = !0;
            t.bgVolume = 1;
            t.deskVolume = 1;
            t.voiceVolume = 1;
            t.bgAudioID = -1;
            t.storyAudioId = -1;
            t.nowSoundVal = 0;
            t.soundMap = {};
            t.soundRequestTokens = {};
            t.bgmID = -1;
            t.bgmRequestToken = 0;
            t.audioCache = {};
            t.audioLoading = {};
            return t;
        }();
        o.default = n;
