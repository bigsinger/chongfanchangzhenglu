'use strict';

var e = module;
var o = exports;

var i, n = this && this.__extends || (i = function (t, e) {
            return (i = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function (t, e) {
                t.__proto__ = e;
            } || function (t, e) {
                for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
            })(t, e);
        }, function (t, e) {
            i(t, e);
            function o() {
                this.constructor = t;
            }
            t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
        }), a = this && this.__decorate || function (t, e, o, i) {
            var n, a = arguments.length, s = a < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, i); else for (var r = t.length - 1; r >= 0; r--) (n = t[r]) && (s = (a < 3 ? n(s) : a > 3 ? n(e, o, s) : n(e, o)) || s);
            return a > 3 && s && Object.defineProperty(e, o, s), s;
        };
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var s = require("./GameConfigManager"), r = require("./GameState"), c = require("./PopupView"), l = require("./AudioManager"), h = require("./DialogManager"), d = cc._decorator, p = d.ccclass, u = d.property, m = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.node_bgm = null;
                e.node_sound = null;
                e.node_voice = null;
                e.animation_node = null;
                e.m_isCheck = !1;
                return e;
            }
            e.prototype.initData = function () { };
            e.prototype.start = function () {
                this.m_checkData = [];
                r.default.MUSIC_BGM = cc.sys.localStorage.getItem("MUSIC_BGM") || 1;
                r.default.MUSIC_SOUND = cc.sys.localStorage.getItem("MUSIC_SOUND") || 1;
                r.default.MUSIC_VOICE = cc.sys.localStorage.getItem("MUSIC_VOICE") || 1;
                var t = this.node_bgm.getChildByName("slider_bgm"), e = t.getComponent(cc.Slider);
                e.progress = r.default.MUSIC_BGM;
                e.enabled = cc.sys.localStorage.getItem("BGM_ENABLED") || !0;
                t.getChildByName("node_mask").width = 406 * r.default.MUSIC_BGM;
                this.node_bgm.getChildByName("label_val").getComponent(cc.Label).string = Math.floor(100 * r.default.MUSIC_BGM) + "%";
                var o = this.node_sound.getChildByName("slider_sound"), i = o.getComponent(cc.Slider);
                i.progress = r.default.MUSIC_SOUND;
                i.enabled = cc.sys.localStorage.getItem("SOUND_ENABLED") || !0;
                o.getChildByName("node_mask").width = 406 * r.default.MUSIC_SOUND;
                this.node_sound.getChildByName("label_val").getComponent(cc.Label).string = Math.floor(100 * r.default.MUSIC_SOUND) + "%";
                var n = this.node_voice.getChildByName("slider_voice"), a = n.getComponent(cc.Slider);
                a.progress = r.default.MUSIC_VOICE;
                a.enabled = cc.sys.localStorage.getItem("VOICE_ENABLED") || !0;
                n.getChildByName("node_mask").width = 406 * r.default.MUSIC_VOICE;
                this.node_voice.getChildByName("label_val").getComponent(cc.Label).string = Math.floor(100 * r.default.MUSIC_VOICE) + "%";
            };
            e.prototype.toggleBack = function (t, e) {
                l.default.playSound("ui/click.mp3");
                var o = t.isChecked, i = Number(e);
                this.m_checkData[i] = o;
                switch (i) {
                    case 0:
                        var n = this.node_bgm.getChildByName("slider_bgm"), a = (n.getChildByName("Handle").getComponent(cc.Button),
                            n.getChildByName("Handle").getComponent(cc.Sprite));
                        n.getComponent(cc.Slider).enabled = o;
                        var s = n.getChildByName("node_mask").getChildByName("Background").getComponent(cc.Sprite), c = o ? 1 : 2;
                        this.setSpriteFrame(s, "dialog/set/image_kdt" + c);
                        var h = n.getComponent(cc.Sprite);
                        this.setSpriteFrame(h, "dialog/set/image_bg" + c);
                        this.setSpriteFrame(a, "dialog/set/image_jz" + c);
                        o ? l.default.gamePlayBGM(r.default.nowBGM) : l.default.passBGM();
                        cc.sys.localStorage.setItem("BGM_ENABLED", o);
                        break;

                    case 1:
                        var d = this.node_sound.getChildByName("slider_sound");
                        d.getComponent(cc.Slider).enabled = o;
                        d.getChildByName("Handle").getComponent(cc.Button);
                        var p = d.getChildByName("Handle").getComponent(cc.Sprite), u = d.getChildByName("node_mask").getChildByName("Background").getComponent(cc.Sprite), m = o ? 1 : 2, _ = d.getComponent(cc.Sprite);
                        this.setSpriteFrame(_, "dialog/set/image_bg" + m);
                        this.setSpriteFrame(u, "dialog/set/image_kdt" + m);
                        this.setSpriteFrame(p, "dialog/set/image_jz" + m);
                        cc.sys.localStorage.setItem("SOUND_ENABLED", o);
                        break;

                    case 2:
                        var f = this.node_voice.getChildByName("slider_voice");
                        f.getComponent(cc.Slider).enabled = o;
                        f.getChildByName("Handle").getComponent(cc.Button);
                        var g = f.getChildByName("Handle").getComponent(cc.Sprite), y = f.getChildByName("node_mask").getChildByName("Background").getComponent(cc.Sprite), v = o ? 1 : 2;
                        this.setSpriteFrame(y, "dialog/set/image_kdt" + v);
                        var b = f.getComponent(cc.Sprite);
                        this.setSpriteFrame(b, "dialog/set/image_bg" + v);
                        this.setSpriteFrame(g, "dialog/set/image_jz" + v);
                        cc.sys.localStorage.setItem("VOICE_ENABLED", o);
                }
            };
            e.prototype.resetBack = function () {
                if (!this.m_isCheck) {
                    l.default.playSound("ui/warning.mp3");
                    cc.director.resume();
                    h.default.open("dialog/tipsDialog", ["<b><size=40>是否重置游戏进度？</>", "（请慎重选择！）", function () {
                        cc.director.resume();
                        console.log("==确定=回调=");
                        s.default.cleanAllSave();
                        r.default.chapter = 1;
                        r.default.mapIndex = 1;
                        r.default.Smallplot = "0_1";
                        r.default.playData = {
                            onlinetm: 0,
                            chapter: 1,
                            chapterCur: 1,
                            mapIndex: 1,
                            itemData: {},
                            storyData: [],
                            unlockchapters: 0,
                            gametips: []
                        };
                        r.default.initMapInfo();
                        l.default.stopBGM();
                        setTimeout(function () {
                            cc.game.restart();
                        }, 200);
                    }, null, "进度重置，将会自动重启游戏！"], function () {
                        if (cc.find("Canvas").getChildByName("node_control")) {
                            console.log("=opencall==node_control==");
                            setTimeout(function () {
                                cc.director.pause();
                            }, 50);
                        }
                    });
                }
            };
            e.prototype.sliderBack = function (t, e) {
                Number(e);
                if (!this.m_isCheck) {
                    t.node.getChildByName("node_mask").width = 406 * t.progress;
                    t.node.parent.getChildByName("label_val").getComponent(cc.Label).string = Math.floor(100 * t.progress) + "%";
                    switch (Number(e)) {
                        case 0:
                            r.default.MUSIC_BGM = t.progress.toFixed(1);
                            cc.sys.localStorage.setItem("MUSIC_BGM", r.default.MUSIC_BGM);
                            cc.audioEngine.setMusicVolume(r.default.MUSIC_BGM);
                            break;

                        case 1:
                            r.default.MUSIC_SOUND = t.progress.toFixed(1);
                            cc.sys.localStorage.setItem("MUSIC_SOUND", r.default.MUSIC_SOUND);
                            cc.audioEngine.setEffectsVolume(r.default.MUSIC_SOUND);
                            break;

                        case 2:
                            r.default.MUSIC_VOICE = t.progress.toFixed(1);
                            cc.sys.localStorage.setItem("MUSIC_VOICE", r.default.MUSIC_VOICE);
                            cc.audioEngine.setEffectsVolume(r.default.MUSIC_VOICE);
                    }
                }
            };
            a([u(cc.Node)], e.prototype, "node_bgm", void 0);
            a([u(cc.Node)], e.prototype, "node_sound", void 0);
            a([u(cc.Node)], e.prototype, "node_voice", void 0);
            a([u(cc.Node)], e.prototype, "animation_node", void 0);
            return a([p], e);
        }(c.default);
        o.default = m;
