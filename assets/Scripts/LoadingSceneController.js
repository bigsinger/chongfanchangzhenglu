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
        var s = require("./BaseView"), r = require("./GameConfigManager"), c = require("./GameState"), l = require("./AudioManager"), h = require("./PlatformBridge"), v = require("./SaveManager"), y = require("./ResourceManager"), b = require("./Logger"), displayAdapter = require("./DisplayAdapter"), d = cc._decorator, p = d.ccclass, u = d.property, m = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.probg = null;
                e.proimg = null;
                e.loadtip = null;
                e.box = null;
                e.cg = null;
                e.btn_skip = null;
                e.plot_label = null;
                e.m_chapterIndex = 0;
                e.m_path = "ani02";
                e.mMaxlength = 235;
                e.m_loadIndex = 0;
                e.m_isFirst = !1;
                e.m_asideIndex = 1;
                e.m_timeIndex = 0;
                e.m_index = 0;
                e.m_openingGateDone = !1;
                e.m_openingGateCallback = null;
                return e;
            }
            e.prototype.onLoad = function () {
                displayAdapter.default.apply(this.node, {
                    referenceWidth: 1650,
                    coverNodes: [this.cg && this.cg.node]
                });
                b.default.install();
                v.default.installLifecycle(c.default);
                var t = this, e = v.default.restoreOrMigrate(c.default.playData, "gameScene" == cc.sys.localStorage.getItem("codex_direct_scene")), o = c.default.playData;
                if (e && "object" == typeof e && !Array.isArray(e)) {
                    for (var i in o) null == e[i] && (e[i] = o[i]);
                    c.default.playData = e;
                }
                cc.sys.localStorage.getItem("longmarch_first") && (this.m_isFirst = !0);
                this.btn_skip.active = this.m_isFirst;
                // Keep the complete authored opening. Its five-page atlas is
                // repaired during the 2.4.15 migration, so native wide-screen
                // rendering no longer needs the temporary static fallback.
                this.cg.node.active = !0;
                this.cg.setCompleteListener(function () {
                    t._onPlayComplete();
                });
                this.btn_skip.active && this.btn_skip.runAction(cc.fadeIn(1.2));
                h.default.init();
                cc.debug.setDisplayStats(!1);
            };
            e.prototype.start = function () {
                var t = this;
                this.maxwidth = this.probg.width;
                this.proimg.width = 0;
                c.default.MUSIC_BGM = cc.sys.localStorage.getItem("MUSIC_BGM") || 1;
                c.default.MUSIC_SOUND = cc.sys.localStorage.getItem("MUSIC_SOUND") || 1;
                c.default.MUSIC_VOICE = cc.sys.localStorage.getItem("MUSIC_VOICE") || 1;
                c.default.loadMapInfo();
                r.default.loadTempData();
                this.m_callBack = function () {
                    t.m_playName = "await";
                    t.cg.setAnimation(0, "await", !1);
                    l.default.gamePlayBGM("cg/cgbgm");
                    t.m_titleData = c.default.cgtitleData[0];
                    t.schedule(t.execute, 1);
                    t.m_openingGateCallback = function () {
                        t.finishOpeningGate();
                    };
                    // The complete opening lasts about 56 seconds. This is a
                    // watchdog for a missing native completion callback, not a
                    // short presentation timer.
                    t.scheduleOnce(t.m_openingGateCallback, 65);
                };
                y.default.loadDir("sound/effect/ui", function () { }, function () { }, "core:ui-sound");
                this.loadGameConfig();
            };
            e.prototype.execute = function () {
                var t = this;
                if (this.m_titleData[this.m_index]) {
                    if (Number(this.m_titleData[this.m_index].first) == this.m_timeIndex) {
                        this.plot_label.string = this.m_titleData[this.m_index].val;
                        this.plot_label.node.active = !0;
                        this.scheduleOnce(function () {
                            t.plot_label.node.active = !1;
                            t.m_index++;
                        }, Number(this.m_titleData[this.m_index].showtime));
                    }
                    this.m_timeIndex++;
                } else {
                    this.plot_label.node.active = !1;
                    this.unschedule(this.execute);
                }
            };
            e.prototype.loads = function (t) {
                var e = this;
                y.default.loadDir(t, function (t, o) {
                    e.onProgress(t / o, "加载游戏资源");
                }, function () {
                    e.loadtip.string = "资源加载完成";
                    e.onComplete();
                }, "core:" + t);
            };
            e.prototype.onProgress = function (t, e) {
                t = (t = Number((t + "").replace("%", ""))) || 0;
                var o = Number(t.toFixed(2));
                this.proimg.width = this.maxwidth * o;
                this.box.x < 0 ? this.box.x = this.box.x + this.mMaxlength * o : this.box.x = this.mMaxlength * o;
                this.loadtip.string = e + Math.min(100, Math.floor(100 * o)) + "%";
            };
            e.prototype.onComplete = function () {
                this.loadtip.string = "资源加载完成进入游戏中!.....";
                if ("gameScene" == cc.sys.localStorage.getItem("codex_direct_scene")) {
                    // Manual regression checkpoints already contain the exact
                    // chapter, map, hero and event state.  Load the playable
                    // scene as soon as configuration/tempData is ready instead
                    // of replaying the title, chapter transition and CG chain.
                    // The marker is one-shot so normal player launches keep the
                    // original presentation flow.
                    cc.sys.localStorage.removeItem("codex_direct_scene");
                    cc.sys.localStorage.setItem("longmarch_first", "11111");
                    cc.director.loadScene("gameScene", function () {
                        console.log("==== checkpoint direct gameScene success ====");
                    });
                    return;
                }
                this.m_loadIndex++;
                this.gotoLoginScene();
            };
            e.prototype.loadGameConfig = function () {
                var t = this;
                y.default.loadDir("gameConf", function (e, o) {
                    t.onProgress(e / o, "游戏配置加载");
                }, function (e, o) {
                    if (e || !Array.isArray(o) || !o.length) {
                        console.error("------------ 游戏配置加载失败", e);
                        t.loadtip.string = "游戏配置加载失败，请重新启动游戏";
                        return;
                    }
                    t.loadtip.string = "游戏配置加载完成";
                    for (var i = 0, n = o; i < n.length; i++) {
                        var a = n[i];
                        switch (a.name) {
                            case "eventConf":
                                c.default.loadEvent(a.json);
                                break;

                            case "doorConf":
                                c.default.loadDoor(a.json);
                                break;

                            case "plotConf":
                                c.default.loadPlot(a.json);
                                break;

                            case "goodsConf":
                                c.default.loadGoods(a.json);
                                break;

                            case "chapterConf":
                                c.default.loadChapter(a.json);
                                break;

                            case "aniConf":
                                c.default.loadAni(a.json);
                                break;

                            case "guideConf":
                                c.default.loadGuide(a.json);
                                break;

                            case "chapterMax":
                                c.default.chapterMax = a.json;
                                c.default.ctorChapter();
                                break;

                            case "czconfig":
                                r.default.loadMapConf(a.json);
                                break;

                            case "story":
                                c.default.story = a.json;
                                c.default.ctorStory();
                                break;

                            case "item":
                                c.default.item = a.json;
                                break;

                            case "gametips":
                                c.default.gametipsJson = a.json;
                                break;

                            case "talkConf":
                                c.default.loadTalk(a.json);
                                break;

                            case "comConf":
                                c.default.loadCom(a.json);
                                break;

                            case "processConf":
                                c.default.loadprocess(a.json);
                                break;

                            case "chapterUi":
                                c.default.loadChapterUi(a.json);
                                break;

                            case "answer":
                                c.default.loadanswer(a.json);
                                break;

                            case "cgtitle":
                                c.default.cgtitleConfig = a.json;
                                c.default.ctorCgtitle();
                                break;

                            case "groundConf":
                                c.default.loadGround(a.json);
                                break;

                            case "sound":
                                c.default.soundJson = a.json;
                        }
                    }
                    t.m_callBack();
                    t.onComplete();
                }, "core:game-conf");
            };
            e.prototype.gotoLoginScene = function () {
                if (!(this.m_loadIndex < 2)) {
                    cc.sys.localStorage.setItem("longmarch_first", "11111");
                    setTimeout(function () {
                        cc.director.loadScene("mainScene", function () {
                            console.log("==1111== gameScene==success=====");
                        });
                    }, 200);
                }
            };
            e.prototype._onPlayComplete = function () {
                switch (this.m_playName) {
                    case "diyimu":
                        this.m_playName = "diermu";
                        this.cg.setAnimation(0, "diermu", !1);
                        break;

                    case "await":
                        this.finishOpeningGate();
                }
            };
            e.prototype.finishOpeningGate = function () {
                if (this.m_openingGateDone) return;
                this.m_openingGateDone = !0;
                this.m_openingGateCallback && this.unschedule(this.m_openingGateCallback);
                this.m_openingGateCallback = null;
                this.m_loadIndex++;
                this.gotoLoginScene();
            };
            e.prototype.skipBack = function () {
                l.default.playSound("ui/back.mp3");
                this.plot_label.node.active = !1;
                this.finishOpeningGate();
            };
            a([u(cc.Node)], e.prototype, "probg", void 0);
            a([u(cc.Node)], e.prototype, "proimg", void 0);
            a([u(cc.Label)], e.prototype, "loadtip", void 0);
            a([u(cc.Node)], e.prototype, "box", void 0);
            a([u(sp.Skeleton)], e.prototype, "cg", void 0);
            a([u(cc.Node)], e.prototype, "btn_skip", void 0);
            a([u(cc.Label)], e.prototype, "plot_label", void 0);
            return a([p], e);
        }(s.default);
        o.default = m;
