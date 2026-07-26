window.__require = function t(e, o, i) {
    function n(s, r) {
        if (!o[s]) {
            if (!e[s]) {
                var c = s.split("/");
                c = c[c.length - 1];
                if (!e[c]) {
                    var l = "function" == typeof __require && __require;
                    if (!r && l) return l(c, !0);
                    if (a) return a(c, !0);
                    throw new Error("Cannot find module '" + s + "'");
                }
                s = c;
            }
            var h = o[s] = {
                exports: {}
            };
            e[s][0].call(h.exports, function (t) {
                return n(e[s][1][t] || t);
            }, h, h.exports, t, e, o, i);
        }
        return o[s].exports;
    }
    for (var a = "function" == typeof __require && __require, s = 0; s < i.length; s++) n(i[s]);
    return n;
}({
    BaseScene: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "28dd0D2y4BNE6o/0k1P9EKd", "BaseScene");
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
        var s = t("./BaseView"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.uiContent = null;
                return e;
            }
            e.prototype.onLoad = function () {
                this.uiContent && this.uiContent.getComponent(cc.Widget);
            };
            e.prototype.start = function () { };
            a([l(cc.Node)], e.prototype, "uiContent", void 0);
            return a([c], e);
        }(s.default);
        o.default = h;
        cc._RF.pop();
    }, {
        "./BaseView": "BaseView"
    }],
    BaseView: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "837ccCcTjxBdaZNaCs+qT2A", "BaseView");
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
        });
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var a = t("./SoundManage"), s = t("./ViewManager"), r = t("../familiar/spineManager"), c = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.m_isChick = !1;
                return e;
            }
            e.prototype.ctor = function () { };
            e.prototype.onLoad = function () { };
            e.prototype.start = function () { };
            e.prototype.openView = function (t, e, o) {
                void 0 === e && (e = []);
                void 0 === o && (o = null);
                s.default.open(t, e, o);
            };
            e.prototype.setClick = function (t, e) {
                var o = this;
                void 0 === e && (e = !1);
                this.m_baseNode = new cc.Node();
                e && (this.m_baseNode.group = "ui");
                t.parent.addChild(this.m_baseNode);
                this.m_baseNode.zIndex = 99999;
                this.m_baseNode.active = !1;
                this.m_baseNode.addComponent(r.default);
                this.m_baseSpineManagerTs = this.m_baseNode.getComponent(r.default);
                this.m_baseSpineManagerTs.m_specialParm = !0;
                this.m_baseSpineManagerTs.initData(this.m_baseNode, "click", "effect/click", function () {
                    o.m_isChick = !1;
                }, 1);
                t.on(cc.Node.EventType.TOUCH_START, function (t) {
                    if (!o.m_isChick) {
                        o.m_isChick = !0;
                        var e = t.getLocation();
                        o.m_baseNode.x = e.x;
                        o.m_baseNode.y = e.y;
                        o.m_baseNode.active = !0;
                        o.m_baseSpineManagerTs.setAction("click", 1);
                    }
                });
            };
            e.prototype.createPrefab = function (t, e) {
                void 0 === e && (e = null);
                cc.resources.load("prefab/" + t, cc.Prefab, function (t, o) {
                    if (t) {
                        console.log("--- err", t);
                        if (!e) return null;
                        e(null);
                    }
                    e && e(cc.instantiate(o));
                });
            };
            e.prototype.setSpriteFrame = function (t, e) {
                cc.resources.load(e, cc.SpriteFrame, function (e, o) {
                    e || (t.spriteFrame = o);
                });
            };
            e.prototype.addClickEvent = function (t, e, o, i, n) {
                void 0 === n && (n = null);
                t.on(e, function () {
                    o && o(n);
                }, i, n);
            };
            e.prototype.onClose = function () { };
            e.prototype._onClose = function () {
                a.default.playSound("ui/back.mp3");
                s.default.close(this.node.name);
            };
            return e;
        }(cc.Component);
        o.default = c;
        cc._RF.pop();
    }, {
        "../familiar/spineManager": "spineManager",
        "./SoundManage": "SoundManage",
        "./ViewManager": "ViewManager"
    }],
    ConfManager: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "763e7JAcZVNP42wIQUeUxOT", "ConfManager");
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
        });
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var a = t("./GameData"), s = function (t) {
            n(e, t);
            function e() {
                return null !== t && t.apply(this, arguments) || this;
            }
            e.loadMapConf = function (t) {
                for (var e = 0, o = t; e < o.length; e++) {
                    var i = o[e];
                    this.confData[i.name] = JSON.parse(i.content);
                }
                console.log("------------ loadMapConf ", this.confData);
            };
            e.setPointConf = function (t, e) {
                console.log("---------- 保存关卡数据 " + t);
                console.log("---------- 保存关卡数据 ", e);
                this.confData[t] = e;
                cc.sys.localStorage.setItem(t, JSON.stringify(e));
            };
            e.getPointConf = function (t) {
                console.log("---------- 读取关卡数据 " + t);
                if (a.default.isTest) return this.confData[t];
                var e = cc.sys.localStorage.getItem(t);
                console.log("---------- 读取关卡数据 ", e);
                return JSON.parse(e);
            };
            e.loadTempData = function () {
                var t = cc.sys.localStorage.getItem("tempData");
                console.log("-------- loadTempData ", t);
                this.tempData = null != t && "" != t ? JSON.parse(t) : {};
            };
            e.saveTempData = function (t, e, o, i) {
                void 0 === o && (o = null);
                void 0 === i && (i = "walk");
                this.tempData[t] || (this.tempData[t] = {});
                this.tempData[t].itemArr = e;
                null != o && (this.tempData[t].heroPos = o);
                this.tempData[t].gomod = i;
                cc.sys.localStorage.setItem("tempData", JSON.stringify(this.tempData));
            };
            e.getTempData = function (t) {
                var e = cc.sys.localStorage.getItem("tempData");
                if (e && "" != e) {
                    var o = JSON.parse(e);
                    if (o && "" != o && o[t]) {
                        this.tempData[t] = o[t];
                        return this.tempData[t];
                    }
                }
                return "";
            };
            e.saveCrossData = function (t) {
                cc.sys.localStorage.setItem("cross", JSON.stringify(t));
            };
            e.getCorssData = function () {
                var t = cc.sys.localStorage.getItem("cross");
                return JSON.parse(t);
            };
            e.cleanCorssData = function () {
                cc.sys.localStorage.removeItem("cross");
            };
            e.saveHeroItem = function (t) {
                cc.sys.localStorage.setItem("heroItem", JSON.stringify(t));
            };
            e.getHeroItem = function () {
                var t = cc.sys.localStorage.getItem("heroItem");
                return JSON.parse(t);
            };
            e.cleanHeroItem = function () {
                cc.sys.localStorage.removeItem("heroItem");
            };
            e.saveHeroFollow = function (t) {
                cc.sys.localStorage.setItem("heroFollow", JSON.stringify(t));
            };
            e.getHeroFollow = function () {
                var t = cc.sys.localStorage.getItem("heroFollow");
                return JSON.parse(t);
            };
            e.cleanHeroFollow = function () {
                cc.sys.localStorage.removeItem("heroFollow");
            };
            e.saveHeroSpine = function (t) {
                cc.sys.localStorage.setItem("heroSpine", t);
            };
            e.getHeroSpine = function () {
                return cc.sys.localStorage.getItem("heroSpine");
            };
            e.cleanHeroSpine = function () {
                cc.sys.localStorage.removeItem("heroSpine");
            };
            e.cleanAllSave = function () {
                cc.sys.localStorage.setItem("tempData", "");
                this.tempData = {};
                cc.sys.localStorage.removeItem("cross");
                cc.sys.localStorage.removeItem("longmarch");
                this.cleanHeroItem();
                this.cleanHeroFollow();
                this.cleanHeroSpine();
            };
            e.getLoadDragonBones = function (t) {
                for (var e = "scenes_d" + t + "_", o = 1, i = {}, n = []; ;) {
                    var a = this.confData[e + o];
                    if (!a) break;
                    for (var s = 0, r = a.confArr; s < r.length; s++) {
                        var c = r[s].ani;
                        null != c && "" != c && (i[c] = 1);
                    }
                    o++;
                }
                for (var l in i) n.push(l);
                console.log("--------- getLoadDragonBones ", n);
                return n;
            };
            e.confData = {};
            e.tempData = {};
            return e;
        }(cc.Component);
        o.default = s;
        cc._RF.pop();
    }, {
        "./GameData": "GameData"
    }],
    DefaultZIndex: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "188578ZKd1CD78F6vF92jO/", "DefaultZIndex");
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
        var s = cc._decorator, r = s.ccclass, c = s.property, l = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.z = 0;
                return e;
            }
            e.prototype.start = function () {
                this.node.zIndex = Number(this.z);
            };
            a([c(cc.Integer)], e.prototype, "z", void 0);
            return a([r], e);
        }(cc.Component);
        o.default = l;
        cc._RF.pop();
    }, {}],
    DragonBonesManager: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "71ab600gFpPLqhDGTCvpujH", "DragonBonesManager");
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
        var s = cc._decorator, r = s.ccclass, c = (s.property, function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.m_timeScale = 1;
                e.m_path = "dragonBones/";
                return e;
            }
            e.prototype.onLoad = function () {
                this.m_armatureName = "Armature";
                this.m_playTimes = 0;
                this.m_timeScale = 1;
            };
            e.prototype.onDestroy = function () {
                cc.resources.release(this.m_path);
            };
            e.prototype.start = function () {
                this.addDragonBones(this.m_Node, this.m_path, this._onLoadComplete.bind(this));
            };
            e.prototype.initData = function (t, e, o, i, n, a) {
                void 0 === o && (o = "ani01");
                void 0 === i && (i = null);
                void 0 === n && (n = 0);
                void 0 === a && (a = 1);
                if (t) {
                    this.m_Node = t;
                    this.m_playName = e || "daiji";
                    this.m_curPlayName = this.m_playName;
                    this.m_path = "dragonBones/" + o;
                    this.m_callBcak = i;
                    this.m_playTimes = n;
                    this.m_timeScale = a;
                }
            };
            e.prototype.setAction = function (t, e, o) {
                void 0 === e && (e = this.m_playTimes);
                void 0 === o && (o = this.m_timeScale);
                if (!t) return console.log("=playName=参数错误=");
                if (this.m_dragonDisplay) {
                    this.m_playTimes = e || 0;
                    this.m_dragonDisplay.timeScale = o;
                    this.m_dragonDisplay.playAnimation(t, this.m_playTimes);
                    this.m_curPlayName = t;
                } else console.log("=m_dragonDisplay=对象为null=");
            };
            e.prototype.stopAction = function () {
                this.m_dragonDisplay.timeScale = 0;
            };
            e.prototype.goOnAction = function () {
                this.m_dragonDisplay.timeScale = this.m_timeScale;
            };
            e.prototype.addDragonBones = function (t, e, o) {
                void 0 === o && (o = null);
                var i = e;
                cc.resources.loadDir(i, function (e, i) {
                    if (e) console.log("========龙骨动画加载错误==请检查==" + e); else if (!(i.length <= 0) && t && cc.isValid(t) && t.parent) {
                        t.getComponent(dragonBones.ArmatureDisplay) && t.removeComponent(dragonBones.ArmatureDisplay);
                        var n = t.addComponent(dragonBones.ArmatureDisplay);
                        i.forEach(function (t) {
                            t instanceof dragonBones.DragonBonesAsset && (n.dragonAsset = t);
                            t instanceof dragonBones.DragonBonesAtlasAsset && (n.dragonAtlasAsset = t);
                        });
                        o && o(n);
                    }
                });
            };
            e.prototype._onLoadComplete = function (t) {
                this.m_dragonDisplay = t;
                t.timeScale = this.m_timeScale;
                var e = this.m_armatureName;
                "lingyou_item" == t.node.name && (e = "armatureName");
                e && "" != e && (t.armatureName = e);
                var o = this.m_playName;
                if (o && "" != o) {
                    this.m_dragonDisplay.playAnimation(o, this.m_playTimes);
                    this.m_curPlayName = o;
                    this.m_dragonDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this._onPlayComplete, this);
                }
            };
            e.prototype._onPlayComplete = function () {
                this.m_callBcak && this.m_callBcak(this.m_curPlayName);
            };
            e.prototype.switchSolt = function (t) {
                void 0 === t && (t = 0);
                this.m_dragonDisplay.armature().getSlot("body_prop").displayIndex = t;
            };
            e.prototype.switchHand = function (t) {
                void 0 === t && (t = 0);
                this.m_dragonDisplay.armature().getSlot("hand_prop").displayIndex = t;
            };
            e.prototype.setSlotColor = function (t) {
                this.m_dragonDisplay.armature().getSlot("body_prop")._setColor(t);
            };
            return a([r], e);
        }(cc.Component));
        o.default = c;
        cc._RF.pop();
    }, {}],
    GameData: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "535e30UpX9Ayo+0npWuqOqm", "GameData");
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
        });
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var a = function (t) {
            n(e, t);
            function e() {
                return null !== t && t.apply(this, arguments) || this;
            }
            e.loadCom = function (t) {
                for (var e in t) {
                    var o = t[e];
                    switch (o.configname2) {
                        case "walk":
                            this.SPEED_WALK = Number(o.configdata);
                            console.log("----------- SPEED_WALK " + this.SPEED_WALK);
                            break;

                        case "run":
                            this.SPEED_RUN = Number(o.configdata);
                            console.log("----------- SPEED_RUN " + this.SPEED_RUN);
                            break;

                        case "slow_walk":
                            this.SPEED_LOAD = Number(o.configdata);
                            this.SPEED_SHIELD = Number(o.configdata);
                            console.log("----------- SPEED_LOAD " + this.SPEED_LOAD);
                            console.log("----------- SPEED_SHIELD " + this.SPEED_SHIELD);
                    }
                }
            };
            e.loadEvent = function (t) {
                this.eventJson = t;
            };
            Object.defineProperty(e, "eventConf", {
                get: function () {
                    if (this.eventMap) return this.eventMap;
                    this.eventMap = {};
                    for (var t = 0, e = this.eventJson; t < e.length; t++) {
                        var o = e[t];
                        this.eventMap[o.id] = o;
                    }
                    return this.eventMap;
                },
                enumerable: !1,
                configurable: !0
            });
            Object.defineProperty(e, "onlinetm", {
                set: function (t) {
                    this.playData.onlinetm = t;
                    cc.sys.localStorage.setItem("longmarch", JSON.stringify(this.playData));
                },
                enumerable: !1,
                configurable: !0
            });
            Object.defineProperty(e, "soundConf", {
                get: function () {
                    if (this.soundMap) return this.soundMap;
                    this.soundMap = {};
                    for (var t = 0, e = this.soundJson; t < e.length; t++) {
                        var o = e[t];
                        this.soundMap[o.act] = o;
                    }
                    return this.soundMap;
                },
                enumerable: !1,
                configurable: !0
            });
            e.loadGround = function (t) {
                this.groundJson = t;
            };
            Object.defineProperty(e, "groundConf", {
                get: function () {
                    if (this.groundMap) return this.groundMap;
                    this.groundMap = {};
                    for (var t = 0, e = this.groundJson; t < e.length; t++) {
                        var o = e[t];
                        this.groundMap[o.groundtype] = o;
                    }
                    return this.groundMap;
                },
                enumerable: !1,
                configurable: !0
            });
            e.loadTalk = function (t) {
                this.talkJson = t;
            };
            Object.defineProperty(e, "talkConf", {
                get: function () {
                    if (this.talkMap) return this.talkMap;
                    this.talkMap = {};
                    for (var t = 0, e = this.talkJson; t < e.length; t++) {
                        var o = e[t];
                        this.talkMap[o.txtid] = o;
                    }
                    return this.talkMap;
                },
                enumerable: !1,
                configurable: !0
            });
            e.loadChapterUi = function (t) {
                this.chapterUiJson = t;
            };
            Object.defineProperty(e, "chapterUiConf", {
                get: function () {
                    if (this.chapterUiMap) return this.chapterUiMap;
                    this.chapterUiMap = {};
                    for (var t = 0, e = this.chapterUiJson; t < e.length; t++) {
                        var o = e[t];
                        this.chapterUiMap[o.id] = o;
                    }
                    return this.chapterUiMap;
                },
                enumerable: !1,
                configurable: !0
            });
            e.loadDoor = function (t) {
                this.doorJson = t;
            };
            Object.defineProperty(e, "doorConf", {
                get: function () {
                    if (this.doorMap) return this.doorMap;
                    this.doorMap = {};
                    for (var t = 0, e = this.doorJson; t < e.length; t++) {
                        var o = e[t];
                        this.doorMap[o.id] = o;
                    }
                    return this.doorMap;
                },
                enumerable: !1,
                configurable: !0
            });
            e.loadGuide = function (t) {
                this.guideJson = t;
            };
            Object.defineProperty(e, "guideConf", {
                get: function () {
                    if (this.guideMap) return this.guideMap;
                    this.guideMap = {};
                    for (var t = 0, e = this.guideJson; t < e.length; t++) {
                        var o = e[t];
                        this.guideMap[o.id] = o;
                    }
                    return this.guideMap;
                },
                enumerable: !1,
                configurable: !0
            });
            e.loadPlot = function (t) {
                this.plotJson = t;
            };
            Object.defineProperty(e, "plotConf", {
                get: function () {
                    if (this.plotMap) return this.plotMap;
                    this.plotMap = {};
                    for (var t = 0, e = this.plotJson; t < e.length; t++) {
                        var o = e[t];
                        this.plotMap[o.txtid] = o;
                    }
                    return this.plotMap;
                },
                enumerable: !1,
                configurable: !0
            });
            e.loadGoods = function (t) {
                this.goodsJson = t;
            };
            Object.defineProperty(e, "goodsConf", {
                get: function () {
                    if (this.goodsMap) return this.goodsMap;
                    this.goodsMap = {};
                    for (var t = 0, e = this.goodsJson; t < e.length; t++) {
                        var o = e[t];
                        this.goodsMap[o.nameid] = o;
                    }
                    return this.goodsMap;
                },
                enumerable: !1,
                configurable: !0
            });
            e.loadprocess = function (t) {
                this.processJson = t;
            };
            Object.defineProperty(e, "processConf", {
                get: function () {
                    if (this.processMap) return this.processMap;
                    this.processMap = {};
                    for (var t = 0, e = this.processJson; t < e.length; t++) {
                        var o = e[t];
                        this.processMap[o.hintid] = o;
                    }
                    return this.processMap;
                },
                enumerable: !1,
                configurable: !0
            });
            e.loadAni = function (t) {
                this.aniJson = t;
            };
            Object.defineProperty(e, "aniConf", {
                get: function () {
                    if (this.aniMap) return this.aniMap;
                    this.aniMap = {};
                    for (var t = 0, e = this.aniJson; t < e.length; t++) {
                        var o = e[t];
                        this.aniMap[o.nameid] = o;
                    }
                    return this.aniMap;
                },
                enumerable: !1,
                configurable: !0
            });
            e.loadanswer = function (t) {
                this.answerJson = t;
            };
            Object.defineProperty(e, "answerConf", {
                get: function () {
                    if (this.answerMap) return this.answerMap;
                    this.answerMap = {};
                    for (var t = 0, e = this.answerJson; t < e.length; t++) {
                        var o = e[t];
                        this.answerMap[o.id] = o;
                    }
                    return this.answerMap;
                },
                enumerable: !1,
                configurable: !0
            });
            e.loadChapter = function (t) {
                this.chapterJson = t;
            };
            Object.defineProperty(e, "chapterConf", {
                get: function () {
                    if (this.chapterMap) return this.chapterMap;
                    this.chapterMap = {};
                    for (var t = 0, e = this.chapterJson; t < e.length; t++) {
                        var o = e[t];
                        this.chapterMap[o.id] = o;
                    }
                    return this.chapterMap;
                },
                enumerable: !1,
                configurable: !0
            });
            e.ctorCgtitle = function () {
                this.cgtitleData = [];
                for (var t in this.cgtitleConfig) {
                    var e = this.cgtitleConfig[t].where;
                    if (e) if (this.cgtitleData[e]) this.cgtitleData[e].push(this.cgtitleConfig[t]); else {
                        this.cgtitleData[e] = [];
                        this.cgtitleData[e].push(this.cgtitleConfig[t]);
                    }
                }
            };
            e.ctorChapter = function () {
                this.chapterData = [];
                for (var t in this.chapterMax) {
                    var e = this.chapterMax[t].chaptemax;
                    if (e) if (this.chapterData[e]) this.chapterData[e].push(this.chapterMax[t]); else {
                        this.chapterData[e] = [];
                        this.chapterData[e].push(this.chapterMax[t]);
                    }
                }
            };
            e.ctorStory = function () {
                this.storyConfig = [];
                var t = 0, e = 1;
                for (var o in this.story) {
                    var i = this.story[o].where;
                    if (i) if (this.storyConfig[i]) {
                        if (this.story[o].xjid == e) this.storyConfig[i][this.story[o].xjid][t] = this.story[o]; else {
                            this.storyConfig[i][this.story[o].xjid] = [];
                            this.storyConfig[i][this.story[o].xjid][t] = this.story[o];
                            e = this.story[o].xjid;
                        }
                        t++;
                    } else {
                        this.storyConfig[i] = [];
                        this.storyConfig[i][this.story[o].xjid] = [];
                        this.storyConfig[i][this.story[o].xjid][t] = this.story[o];
                        e = this.story[o].xjid;
                        t++;
                    }
                }
            };
            Object.defineProperty(e, "chapterCur", {
                get: function () {
                    return this.playData.chapterCur;
                },
                set: function (t) {
                    this.playData.chapterCur = Number(t);
                },
                enumerable: !1,
                configurable: !0
            });
            Object.defineProperty(e, "gametips", {
                get: function () {
                    return this.playData.gametips;
                },
                enumerable: !1,
                configurable: !0
            });
            e.saveMapInfo = function () {
                console.log("------------ 小节 " + this.chapter);
                console.log("------------ 地图 " + this.mapIndex);
                cc.sys.localStorage.setItem("chapter", this.chapter);
                cc.sys.localStorage.setItem("mapIndex", this.mapIndex);
                cc.sys.localStorage.setItem("unlockchapters", this.unlockchapters);
            };
            e.loadMapInfo = function () {
                this.chapter = Number(cc.sys.localStorage.getItem("chapter") || 1);
                this.mapIndex = Number(cc.sys.localStorage.getItem("mapIndex") || 1);
                this.Smallplot = "0_" + this.chapter;
                this.unlockchapters = Number(cc.sys.localStorage.getItem("unlockchapters") || 0);
            };
            e.saveUnlockChapter = function () {
                cc.sys.localStorage.setItem("unlockchapters", this.unlockchapters);
            };
            e.initMapInfo = function (t) {
                void 0 === t && (t = 1);
                this.chapter = Number(t);
                this.mapIndex = 1;
                this.saveMapInfo();
            };
            Object.defineProperty(e, "mapIndex", {
                get: function () {
                    return this.playData.mapIndex;
                },
                set: function (t) {
                    this.playData.mapIndex = Number(t);
                },
                enumerable: !1,
                configurable: !0
            });
            Object.defineProperty(e, "chapter", {
                get: function () {
                    return this.playData.chapter;
                },
                set: function (t) {
                    this.playData.chapter = Number(t);
                },
                enumerable: !1,
                configurable: !0
            });
            Object.defineProperty(e, "itemData", {
                get: function () {
                    return this.playData.itemData;
                },
                enumerable: !1,
                configurable: !0
            });
            Object.defineProperty(e, "storyData", {
                get: function () {
                    return this.playData.storyData;
                },
                enumerable: !1,
                configurable: !0
            });
            Object.defineProperty(e, "unlockchapters", {
                get: function () {
                    return this.playData.unlockchapters;
                },
                set: function (t) {
                    this.playData.unlockchapters = Number(t);
                },
                enumerable: !1,
                configurable: !0
            });
            e.isTest = !0;
            e.isConfNet = !1;
            e.mapKey = "";
            e._version = "V_S_1.0.00";
            e.SPEED_RUN = 4.5;
            e.SPEED_WALK = 2.2;
            e.SPEED_SQUAT = 1.8;
            e.SPEED_DRAG = 1.8;
            e.SPEED_LOAD_K = 4;
            e.SPEED_LOAD = 2;
            e.SPEED_SHIELD = 2;
            e.G_RANGE = 55;
            e.G_COUNT = 18;
            e.FOLLOW_RANGE = 180;
            e.STATE_NORMAL = 0;
            e.STATE_LADDER = 1;
            e.STATE_DRAG = 2;
            e.STATE_OP = 3;
            e.KNOCK_DOWN = 4;
            e.EMBARK = 5;
            e.STATE_LOAD = 6;
            e.AI_NORMAL = 0;
            e.HERO_STANDBY = 0;
            e.HERO_UP = 1;
            e.HERO_DOWN = 2;
            e.HERO_WALk = 3;
            e.HERO_RUN = 4;
            e.HERO_ATT = 5;
            e.HERO_PICK = 6;
            e.HERO_INTERACT = 7;
            e.HERO_LADDER1 = 8;
            e.HERO_LADDER2 = 9;
            e.HERO_LADDER3 = 10;
            e.HERO_TOUZI = 11;
            e.HERO_CLIMB1 = 12;
            e.HERO_CLIMB2 = 13;
            e.HERO_TOUZI2 = 14;
            e.HERO_SHENGQI = 15;
            e.HERO_DRAG = 16;
            e.HERO_DOOR = 17;
            e.HERO_START = 18;
            e.HERO_DEATH = 19;
            e.HERO_END = 20;
            e.HERO_FALL = 21;
            e.HERO_BOATING = 22;
            e.HERO_HANDLE = 23;
            e.HERO_TURN = 24;
            e.HERO_TURN2 = 524;
            e.HERO_BZ = 25;
            e.HERO_LOAD_K = 26;
            e.HERO_LOAD = 27;
            e.HERO_SHIELD = 28;
            e.HERO_PICKUP = 29;
            e.HERO_DOWN_G = 30;
            e.HERO_GETWATER = 31;
            e.HERO_WATERING = 32;
            e.HERO_SHIELD_LOAD = 33;
            e.HERO_PAIL_PUT = 34;
            e.HERO_DRAG_NPC = 35;
            e.OP_TRIGGER = 0;
            e.OP_TOUCH = 1;
            e.OP_USE = 2;
            e.OP_INTERACT = 3;
            e.OP_EXACVATE_H = 4;
            e.OP_EXACVATE_I = 5;
            e.OP_PICK = 6;
            e.OP_PICK_C = 7;
            e.OP_GETWATER = 8;
            e.OP_WATERING = 9;
            e.OP_ENTER = 10;
            e.OP_OUT = 11;
            e.OP_COOKING_POTATO = 15;
            e.OP_PROMOTE = 16;
            e.OP_DRAG = 17;
            e.OP_CLIMB = 18;
            e.OP_ANSWER = 19;
            e.OP_ACWATER = 20;
            e.OP_FEEDWATER = 21;
            e.OP_OPEN = 22;
            e.OP_DOOR = 23;
            e.OP_RAISE = 24;
            e.OP_CHECK = 25;
            e.OP_CHANGE = 27;
            e.OP_EMBARK = 28;
            e.OP_CUI = 29;
            e.OP_ATT = 30;
            e.OP_PULL = 31;
            e.OP_CONTROL = 32;
            e.CO_NORMAL = 0;
            e.CO_WALL = 1;
            e.CO_ITEM = 101;
            e.CO_ATT = 201;
            e.CO_EMP = 202;
            e.CO_BOOM = 203;
            e.CO_DEATH = 1e3;
            e.CO_BULLET = 1001;
            e.CO_SHOWATT = 2001;
            e.CO_INDUCTION = 9001;
            e.GameTipsMax = 5;
            e.nowBGM = "";
            e.MUSIC_BGM = 1;
            e.MUSIC_SOUND = 1;
            e.MUSIC_VOICE = 1;
            e.playData = {
                onlinetm: 0,
                chapter: 1,
                chapterCur: 1,
                mapIndex: 1,
                itemData: {},
                storyData: [],
                unlockchapters: 0,
                gametips: []
            };
            e.Smallplot = "0_1";
            e.maxchapterName = ["东方欲晓", "凤凰涅槃", "横空出世"];
            e.chapterName = ["第一节 ", "第二节 ", "第三节 ", "第四节 ", "第五节 "];
            return e;
        }(cc.Component);
        o.default = a;
        cc._RF.pop();
    }, {}],
    GameInfo: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "97db2GexvxD+4Zo79YqQPR7", "GameInfo");
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = function () {
            function t() { }
            t._version = "V_S_1.0.0";
            t.nowGkId = 1;
            return t;
        }();
        o.default = i;
        cc._RF.pop();
    }, {}],
    GameUpdata: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "b1ab8YNanpJnY0rLRqYfbuc", "GameUpdata");
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
        var s = t("./GameInfo"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.configUrl = null;
                e.pro = null;
                e.proLabel = null;
                e.sizeLabel = null;
                e.stateLabel = null;
                e.vesionLabel = null;
                e.failTimes = 0;
                e.erroIdx = 0;
                return e;
            }
            e.prototype.ctor = function () {
                this.failTimes = 0;
                this.hotParms = {};
            };
            e.prototype.onLoad = function () {
                this.pro.node.active = !0;
                this.erroIdx = 0;
            };
            e.prototype.onDestroy = function () {
                this.gameAm;
            };
            e.prototype.hotUpdateProcess = function () {
                console.log("==========hotUpdateProcess===222=====");
                this.startHotUp();
            };
            e.prototype.getHotUpdateParms = function () {
                this.erroIdx++;
                var t = this;
                console.log("===url=111==", "");
                var e = new XMLHttpRequest();
                e.open("GET", "", !0);
                e.send();
                e.onreadystatechange = function () {
                    if (4 === e.readyState) if (e.status >= 200 && e.status < 300) {
                        this.hotParms = JSON.parse(e.responseText);
                        console.log("===hotParms==" + JSON.stringify(this.hotParms));
                        this.startHotUp();
                    } else {
                        console.log("====payXhr.status==" + e.status);
                        this.erroIdx++;
                        this.again();
                    }
                }.bind(this);
                e.ontimeout = function () {
                    console.log("===获取参数超时");
                    t.again();
                };
                e.onerror = function () {
                    console.log("===获取参数出错");
                    t.again();
                };
            };
            e.prototype.again = function () { };
            e.prototype.Compare = function (t, e) {
                console.log("当前版本 :  " + t + " , 远程版本 : " + e);
                for (var o = t.split("."), i = e.split("."), n = 0; n < o.length && n < i.length; ++n) if (parseInt(o[n]) !== parseInt(i[n])) return -1;
                return i.length > o.length ? -1 : 0;
            };
            e.prototype.setVerifycb = function (t, e) {
                var o = e.compressed, i = e.md5, n = e.path, a = e.size;
                console.log("assetPath", t);
                console.log("assetSize:", a);
                if (o) {
                    this.stateLabel.string = "检查压缩 : " + n;
                    return !0;
                }
                this.stateLabel.string = "检查压缩 : " + n + " (" + i + ")";
                return !0;
            };
            e.prototype.startHotUp = function () {
                if (!this.gameAm) {
                    var t = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
                    console.log("Storage path for remote asset : " + t);
                    this.gameAm = new jsb.AssetsManager("", t, this.Compare);
                    this.gameAm.setVerifyCallback(this.setVerifycb.bind(this));
                    console.log(jsb.AssetsManager.State.UNINITED + "==getState=" + this.gameAm.getState());
                    console.log("==nativeUrl=" + JSON.stringify(this.configUrl));
                    if (this.gameAm.getState() === jsb.AssetsManager.State.UNINITED) {
                        var e = this.configUrl.nativeUrl;
                        console.info("check manifestUrl is: " + e);
                        var o = cc.loader;
                        o.md5Pipe && (e = o.md5Pipe.transformURL(e));
                        console.info("2222check manifestUrl is: " + e);
                        this.gameAm.loadLocalManifest(e);
                    }
                    var i = this.gameAm.getLocalManifest();
                    if (i && i.isLoaded()) {
                        console.log("热更新参数设置:");
                        console.log(i.getPackageUrl());
                        console.log(i.getManifestFileUrl());
                        console.log(i.getVersionFileUrl());
                        console.log("重新设置:");
                        i.setPackageUrl("https://minigame.buyu777.com/appupdate/data/longmarch/hotup20201224180913/zip/");
                        i.setManifestFileUrl("https://minigame.buyu777.com/appupdate/data/longmarch/hotup20201224180913/zip/project.manifest");
                        i.setVersionFileUrl("https://minigame.buyu777.com/appupdate/data/longmarch/hotup20201224180913/zip/version.manifest");
                        console.log(i.getPackageUrl());
                        console.log(i.getManifestFileUrl());
                        console.log(i.getVersionFileUrl());
                        s.default._version = "V_S_" + i.getVersion();
                        this.vesionLabel.string = s.default._version;
                        this.gameAm.setEventCallback(this.checkCb.bind(this));
                        this.gameAm.checkUpdate();
                    } else console.log("加载本地配置失败");
                }
            };
            e.prototype.checkCb = function (t) {
                switch (t.getEventCode()) {
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        console.log("未找到本地配置表,跳过热更");
                        this.enterGameProcess();
                        break;

                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                        console.log("下载远程配置表失败,跳过热更");
                        this.enterGameProcess();
                        break;

                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        console.log("解析远程配置表失败,跳过热更");
                        this.enterGameProcess();
                        break;

                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                        console.log("已是最新版本");
                        this.enterGameProcess();
                        break;

                    case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                        console.log("发现新版本1111");
                        this.setState("发现新版本");
                        this.gameAm.setEventCallback(null);
                        this.onHotUpdate();
                        break;

                    default:
                        return;
                }
            };
            e.prototype.onHotUpdate = function () {
                if (this.gameAm) {
                    console.log("11=gameAm=");
                    this.gameAm.setEventCallback(this.updateCb.bind(this));
                    console.log("=State=" + this.gameAm.getState());
                    if (this.gameAm.getState() === jsb.AssetsManager.State.UNINITED) {
                        var t = this.configUrl.nativeUrl;
                        console.log("hotUpdate" + t);
                        cc.loader.md5Pipe && (t = cc.loader.md5Pipe.transformURL(t));
                        this.gameAm.loadLocalManifest(t);
                    }
                    this.gameAm.update();
                }
            };
            e.prototype.updateCb = function (t) {
                var e = !1, o = !1;
                switch (t.getEventCode()) {
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        console.log("什么鬼");
                        o = !0;
                        break;

                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        var i = t.getDownloadedBytes(), n = t.getTotalBytes();
                        n && this.setProGress(i, n);
                        break;

                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        console.log("下载远程配置表失败,跳过热更");
                        o = !0;
                        break;

                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                        console.log("已经是最新版本");
                        o = !0;
                        break;

                    case jsb.EventAssetsManager.ASSET_UPDATED:
                        console.log("单个文件更新成功 " + t.getAssetId() + ", " + t.getMessage());
                        break;

                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        console.log("更新完成 " + t.getMessage());
                        var a = t.getTotalBytes();
                        a && this.setProGress(a, a);
                        this.setState("更新完成");
                        e = !0;
                        break;

                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        console.log("更新失败 " + t.getMessage());
                        if (this.failTimes > 3) this.setState("更新失败"); else {
                            this.failTimes++;
                            console.log("热更失败次数:" + this.failTimes);
                        }
                        break;

                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        console.log("更新出错 " + t.getAssetId() + ", " + t.getMessage());
                        break;

                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        console.log("解压出错" + t.getMessage());
                }
                if (o) {
                    console.log("111已是最新版本");
                    this.setState("已是最新版本");
                    this.gameAm.setEventCallback(null);
                    this.enterGameProcess();
                }
                if (e) {
                    console.log("===needRestart===");
                    this.gameAm.setEventCallback(null);
                    var s = jsb.fileUtils.getSearchPaths(), r = this.gameAm.getLocalManifest().getSearchPaths();
                    console.log(JSON.stringify(r));
                    Array.prototype.unshift(s, r);
                    cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(s));
                    jsb.fileUtils.setSearchPaths(s);
                    console.log(JSON.stringify(jsb.fileUtils.getSearchPaths()));
                    cc.audioEngine.stopAll();
                    setTimeout(function () {
                        console.log("==111=重启game===");
                        cc.game.restart();
                    }, 500);
                }
            };
            e.prototype.setProGress = function (t, e) {
                var o = t / e;
                this.pro && (this.pro.progress = o);
                if (this.proLabel) {
                    this.proLabel.node.active = !0;
                    this.proLabel.string = Number(100 * o) + "%";
                }
                if (this.sizeLabel) {
                    this.sizeLabel.node.active = !0;
                    var i = this.holdDecimal(t / 1024, 100);
                    if (i >= 1024) var n = (i = this.holdDecimal(i / 1024, 10)) + "M"; else n = i + "KB";
                    var a = this.holdDecimal(e / 1024, 100);
                    if (a >= 1024) var s = (a = this.holdDecimal(a / 1024, 10)) + "M"; else s = a + "KB";
                    this.sizeLabel.string = n + "/" + s;
                }
                t == e && this.setState("解压中....");
            };
            e.prototype.setState = function (t) {
                if (this.stateLabel) {
                    this.stateLabel.node.active = !0;
                    this.stateLabel.string = t;
                }
            };
            e.prototype.enterGameProcess = function () {
                this.node.getComponent("GameLoadScene").loadGameConfig();
            };
            e.prototype.holdDecimal = function (t, e) {
                if (!t || !e) return t;
                for (var o = parseInt(t * e + "") / e, i = 0; e >= 10;) {
                    e /= 10;
                    i++;
                }
                return o.toFixed(i);
            };
            a([l(cc.Asset)], e.prototype, "configUrl", void 0);
            a([l(cc.ProgressBar)], e.prototype, "pro", void 0);
            a([l(cc.Label)], e.prototype, "proLabel", void 0);
            a([l(cc.Label)], e.prototype, "sizeLabel", void 0);
            a([l(cc.Label)], e.prototype, "stateLabel", void 0);
            a([l(cc.Label)], e.prototype, "vesionLabel", void 0);
            return a([c], e);
        }(cc.Component);
        o.default = h;
        cc._RF.pop();
    }, {
        "./GameInfo": "GameInfo"
    }],
    HttpGame: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "d4a764zD4lJSKripy6hzvEz", "HttpGame");
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = function () {
            function t() { }
            t.saveConfig = function (t, e) {
                t.gametype = this.gametype;
                this.gosend("tool/saveStage", t, e);
            };
            t.checkName = function (t, e) {
                t.gametype = this.gametype;
                this.gosend("tool/findStageByName", t, e);
            };
            t.config = function (t, e) {
                t.gametype = this.gametype;
                this.gosend("tool/config", t, e);
            };
            t.saveAINewResult = function (t, e) {
                t.gametype = this.gametype;
                this.gosend("tool/saveAINewResult", t, e);
            };
            t.gosend = function (t, e, o) {
                var i = this.httpConnect();
                if (this.currenturl != t) {
                    this.currenturl = t;
                    this.errnum = 0;
                }
                this.callback = o;
                i.onreadystatechange = function () {
                    this.completeHandler(this.callback, i);
                }.bind(this);
                i.onerror = this.errorHandler.bind(this);
                i.ontimeout = this.processHandler.bind(this);
                i.open("POST", "https://minigame.buyu777.com/develop/" + t);
                i.setRequestHeader("Access-Control-Allow-Origin", "*");
                i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                i.send(JSON.stringify(e));
            };
            t.httpConnect = function () {
                var t = cc.loader.getXMLHttpRequest();
                t.timeout = 12e3;
                return t;
            };
            t.processHandler = function () { };
            t.errorHandler = function (t) {
                this.errnum++;
                console.log("=请求=超时==" + t);
            };
            t.completeHandler = function (t, e) {
                console.log("---http---- completeHandler e ");
                if (4 == e.readyState && e.status >= 200 && e.status < 400) {
                    var o = e.responseText;
                    if (o) {
                        var i = JSON.parse(o);
                        console.log("解析完毕，执行回调函数" + o);
                        this.callback && this.callback(i);
                    }
                }
            };
            t.gametype = "cz";
            t.errnum = 0;
            return t;
        }();
        o.default = i;
        cc._RF.pop();
    }, {}],
    PopupView: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "d36e5y8rhRJ854i1byLSIOw", "PopupView");
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
        var s = t("./BaseView"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.uiContent = null;
                e.btn_close = null;
                return e;
            }
            e.prototype.onLoad = function () {
                var t = this;
                if (this.uiContent && this.uiContent.getComponent(cc.Widget)) {
                    console.log("==当前屏幕大小==" + cc.winSize.width);
                    cc.winSize.width <= 1334 && (this.uiContent.scale = cc.winSize.width / 1650);
                }
                var e = this.node.getChildByName("btn_close");
                (e = e || this.btn_close) && e.on(cc.Node.EventType.TOUCH_END, function () {
                    t._onClose();
                });
                if (!cc.find("Canvas").getChildByName("node_control")) {
                    this.node.opacity = 0;
                    this.node.runAction(cc.fadeIn(.35));
                }
            };
            e.prototype.start = function () { };
            a([l(cc.Node)], e.prototype, "uiContent", void 0);
            a([l(cc.Node)], e.prototype, "btn_close", void 0);
            return a([c], e);
        }(s.default);
        o.default = h;
        cc._RF.pop();
    }, {
        "./BaseView": "BaseView"
    }],
    SoundManage: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "659b6IyoHFCPYrZBhq7DOgA", "SoundManage");
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = t("./GameData"), n = function () {
            function t() { }
            t.passBGM = function () {
                if (this.bgmID >= 0) {
                    cc.audioEngine.stop(this.bgmID);
                    this.bgmID = -1;
                }
            };
            t.gamePlayBGM = function (t, e) {
                var o = this;
                void 0 === e && (e = !0);
                var n = cc.sys.localStorage.getItem("BGM_ENABLED") || !0;
                if (i.default.nowBGM != t) {
                    if (this.bgmID >= 0) {
                        cc.audioEngine.stop(this.bgmID);
                        this.bgmID = -1;
                    }
                    if (i.default.MUSIC_BGM > 0 && n) {
                        var a = "sound/" + t + ".mp3";
                        i.default.nowBGM = t;
                        cc.loader.loadRes(a, cc.AudioClip, function (t, n) {
                            if (t) console.error(t); else {
                                o.bgmID = cc.audioEngine.playMusic(n, e);
                                cc.audioEngine.setVolume(o.bgmID, i.default.MUSIC_BGM);
                            }
                        });
                    }
                }
            };
            t.stopBGM = function () {
                if (this.bgmID >= 0) {
                    cc.audioEngine.stop(this.bgmID);
                    this.bgmID = -1;
                    i.default.nowBGM = "";
                }
            };
            t.playSound = function (t, e) {
                var o = this;
                void 0 === e && (e = !1);
                var n = cc.sys.localStorage.getItem("SOUND_ENABLED") || !0;
                if (this.soundMap[t] >= 0) {
                    cc.audioEngine.stop(this.soundMap[t]);
                    this.soundMap[t] = -1;
                }
                if (i.default.MUSIC_SOUND > 0 && n) {
                    var a = "sound/effect/" + t;
                    cc.loader.loadRes(a, cc.AudioClip, function (n, a) {
                        n ? console.error(n) : o.soundMap[t] = cc.audioEngine.play(a, e, o.nowSoundVal || i.default.MUSIC_SOUND);
                    });
                }
            };
            t.gameStopSound = function (t) {
                if (this.soundMap[t]) {
                    cc.audioEngine.stop(this.soundMap[t]);
                    this.soundMap[t] = -1;
                    this.nowSoundVal = 0;
                }
            };
            t.setSoundVolume = function (t, e) {
                this.soundMap && this.soundMap[t] && cc.audioEngine.setVolume(this.soundMap[t], e);
            };
            t.playGoSound = function () {
                var t = this;
                cc.loader.loadRes("sound/effect/go.mp3", cc.AudioClip, function (e, o) {
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
            t.bgmID = -1;
            return t;
        }();
        o.default = n;
        cc._RF.pop();
    }, {
        "./GameData": "GameData"
    }],
    ToolsManager: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "d490dqRI0lP2oA6GqGw65Cm", "ToolsManager");
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
        });
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var a = function (t) {
            n(e, t);
            function e() {
                return null !== t && t.apply(this, arguments) || this;
            }
            e.setSpriteFrame = function (t, e) {
                cc.resources.load(e, cc.SpriteFrame, function (e, o) {
                    e || (t.spriteFrame = o);
                });
            };
            e.createPrefab = function (t, e) {
                cc.resources.load("prefab/" + t, cc.Prefab, function (t, o) {
                    if (t) {
                        console.log("--- err", t);
                        if (!e) return null;
                        e(null);
                    }
                    e && e(cc.instantiate(o));
                });
            };
            e.fadeAct = function (t, e) {
                void 0 === e && (e = !1);
                if (t) if (e) {
                    t.runAction(cc.fadeOut(.5));
                    t.opacity = 0;
                } else {
                    t.opacity = 0;
                    t.runAction(cc.sequence(cc.fadeIn(.5), cc.delayTime(2), cc.fadeOut(.4)));
                }
            };
            e.getAngle = function (t, e) {
                var o = e.x - t.x, i = e.y - t.y;
                return -cc.v2(o, i).signAngle(cc.v2(1, 0)) / Math.PI * 180;
            };
            e.mt_rand = function (t, e) {
                return this.toInt(Math.random() * (e - t + 1) + t);
            };
            e.toInt = function (t) {
                return parseInt(t);
            };
            e.shockAct = function (t) {
                void 0 === t && (t = this.gameNode);
                var e = t.x, o = t.y, i = cc.sequence(cc.moveBy(.07, cc.v2(-15, -16)), cc.moveBy(.07, cc.v2(21, 22)), cc.moveBy(.07, cc.v2(-14, -18)), cc.moveTo(.07, cc.v2(e, o)));
                t.runAction(i);
            };
            e.getNewPoint = function (t, e, o) {
                var i = e * Math.PI / 180, n = Math.cos(i) * o, a = Math.sin(i) * o;
                return new cc.Vec2(t.x + n, t.y + a);
            };
            return e;
        }(cc.Component);
        o.default = a;
        cc._RF.pop();
    }, {}],
    ViewManager: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "1374cGp3gZFYL1W24pRcokA", "ViewManager");
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = function () {
            function t() { }
            t.open = function (t, e, o) {
                var i = this;
                void 0 === e && (e = []);
                void 0 === o && (o = null);
                var n = "prefab/" + t, a = t;
                this._popupMap[a] && this.close(a);
                cc.resources.load(n, cc.Prefab, function (t, a) {
                    t ? console.log("--- err", t) : i._addPopup(a, e, n, o);
                });
            };
            t._addPopup = function (t, e, o, i) {
                cc.log("open view " + o);
                var n = cc.instantiate(t), a = n.name;
                this._popupMap[a] = {
                    pop: n,
                    prefab: o
                };
                var s = n.getComponent(a);
                s && s.initData(e);
                cc.find("Canvas").addChild(n);
                n.on(cc.Node.EventType.TOUCH_END, function () {
                    console.log("------ click popup " + a);
                }, this);
                i && i(n);
            };
            t.close = function (t) {
                var e = this._popupMap[t];
                if (e) {
                    var o = e.pop;
                    e.prefab;
                    cc.log("close view " + t);
                    delete this._popupMap[t];
                    if (cc.isValid(o)) {
                        var i = o.getComponent(t);
                        i.onClose && i.onClose();
                        o.destroy();
                    }
                    o = null;
                }
            };
            t._popupMap = {};
            return t;
        }();
        o.default = i;
        cc._RF.pop();
    }, {}],
    answerDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "9d54egUN+dL4Kyj07oi9hsf", "answerDialog");
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
        var s = t("../common/GameData"), r = t("../common/PopupView"), c = cc._decorator, l = c.ccclass, h = c.property, d = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.label_question = null;
                e.label_answer1 = null;
                e.label_answer2 = null;
                e.label_answer3 = null;
                e.m_questionIndex = 1;
                return e;
            }
            e.prototype.initData = function (t) {
                this.m_Data = t[0].split("|");
                this.m_callBack = t[1];
            };
            e.prototype.onLoad = function () { };
            e.prototype.start = function () {
                this.m_nowData = s.default.answerConf[this.m_Data[0]];
                this.label_question.string = this.m_questionIndex + "." + this.m_nowData.question;
                this.label_answer1.string = this.m_nowData.answer1;
                this.label_answer2.string = this.m_nowData.answer2;
                this.label_answer3.string = this.m_nowData.answer3;
                this.m_questionIndex++;
            };
            e.prototype.btnBack = function (t, e) {
                if (!this.m_isChick) {
                    this.m_isChick = !0;
                    console.log("==answerDialog==");
                    if (this.answerResults(e)) {
                        this.m_Data.shift();
                        if (this.m_Data.length <= 0) {
                            this.m_callBack(!0);
                            this._onClose();
                            this.m_isChick = !1;
                            console.log("==回答正确=");
                        } else {
                            this.start();
                            this.m_isChick = !1;
                        }
                    } else {
                        this.m_callBack(!1);
                        this._onClose();
                        this.m_isChick = !1;
                        console.log("==回答错误=");
                    }
                }
            };
            e.prototype.answerResults = function (t) {
                return this.m_nowData.right == t;
            };
            a([h(cc.Label)], e.prototype, "label_question", void 0);
            a([h(cc.Label)], e.prototype, "label_answer1", void 0);
            a([h(cc.Label)], e.prototype, "label_answer2", void 0);
            a([h(cc.Label)], e.prototype, "label_answer3", void 0);
            return a([l], e);
        }(r.default);
        o.default = d;
        cc._RF.pop();
    }, {
        "../common/GameData": "GameData",
        "../common/PopupView": "PopupView"
    }],
    baseEvent: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "fd1c8+E9kRFeo+gLTaRfXfR", "baseEvent");
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
        var s = cc._decorator, r = s.ccclass, c = (s.property, function (t) {
            n(e, t);
            function e() {
                return null !== t && t.apply(this, arguments) || this;
            }
            e.prototype.initData = function (t, e, o) {
                this.m_eventData = t;
                this.m_spineNode = e;
                this.m_boxJs = o;
                this.init();
            };
            e.prototype.init = function () { };
            e.prototype.run = function () { };
            e.prototype.callBack = function () { };
            e.prototype.setNext = function (t) {
                this.m_next = t;
            };
            return a([r], e);
        }(cc.Component));
        o.default = c;
        cc._RF.pop();
    }, {}],
    blackDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "2a0bbWKUXpEUIih/FcsMJzR", "blackDialog");
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
        var s = t("../common/PopupView"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.label_tips = null;
                return e;
            }
            e.prototype.initData = function (t) {
                this.m_Data = t[0] || "";
                this.m_callBack = t[1];
                this.m_time = t[2] || 1.5;
            };
            e.prototype.start = function () {
                var t = this;
                this.label_tips.string = this.m_Data.txt || "";
                var e = cc.sequence(cc.delayTime(this.m_time), cc.fadeOut(.7), cc.callFunc(function () {
                    t.m_callBack && t.m_callBack();
                    t._onClose();
                }));
                this.node.runAction(e);
            };
            a([l(cc.Label)], e.prototype, "label_tips", void 0);
            return a([c], e);
        }(s.default);
        o.default = h;
        cc._RF.pop();
    }, {
        "../common/PopupView": "PopupView"
    }],
    bullet: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "34d3a0ELINHMIk3rl1VNOVs", "bullet");
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
        var s = t("../familiar/spineManager"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.img_bullet = null;
                return e;
            }
            e.prototype.initData = function (t) {
                this.m_data = t;
                this.m_Index = t[0];
            };
            e.prototype.start = function () {
                this.m_Sprkle = this.node.parent;
            };
            e.prototype.onBeginContact = function (t, e, o) {
                if (!o.sensor && (0 == o.tag || 1 == o.tag)) {
                    var i = {
                        x: this.node.x,
                        y: this.node.y
                    };
                    this.createSparkle(i);
                    this.node.stopAllActions();
                    this.node.removeFromParent();
                    this.node.destroy();
                }
            };
            e.prototype.onDestroy = function () {
                this.node && this.node.stopAllActions();
            };
            e.prototype.update = function () {
                this.node.angle <= -170 || (this.img_bullet.width = 60);
                this.img_bullet.width += 20;
                !(this.img_bullet.height >= 20) || (this.img_bullet.height -= 1);
            };
            e.prototype.createSparkle = function (t) {
                var e = new cc.Node();
                e.addComponent(s.default);
                var o = e.getComponent(s.default);
                o.m_specialParm = !0;
                o.initData(e, "shouji1", "ani18_1", function () {
                    e.removeFromParent();
                    e.destroy();
                }, 1);
                e.x = t.x;
                e.y = t.y;
                this.m_Sprkle.addChild(e);
            };
            a([l(cc.Node)], e.prototype, "img_bullet", void 0);
            return a([c], e);
        }(cc.Component);
        o.default = h;
        cc._RF.pop();
    }, {
        "../familiar/spineManager": "spineManager"
    }],
    camera_master: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "e3a5btPH+hOvKH07kqtn92m", "camera_master");
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
        var s = cc._decorator, r = s.ccclass, c = (s.property, function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.showWidth = 0;
                e.showHeight = 0;
                e.mapWidth = 0;
                e.mapHeight = 0;
                e.lastX = 0;
                e.lastY = 0;
                e.SPEED_MAX = 20;
                e.xRate = 1;
                e.speedX = e.SPEED_MAX;
                e.speedY = 0;
                e.SPEED_DEFAULT = 25;
                e.trackPos = {
                    x: 0,
                    y: 0
                };
                e.dif_x = 0;
                e.dif_y = 0;
                return e;
            }
            e.prototype.initCamera = function (t, e, o, i, n) {
                this.gameManager = n;
                this.camera_ts = this.node.getComponent(cc.Camera);
                this.camera_ts.zoomRatio = 1;
                this.showWidth = t;
                this.showHeight = e;
                this.mapWidth = o;
                this.mapHeight = i;
            };
            e.prototype.getZoom = function () {
                return this.camera_ts.zoomRatio;
            };
            e.prototype.restoreCamera = function (t, e) {
                if (e) {
                    var o = !0;
                    if ("" != e.x && "" != e.y) {
                        this.dif_x = Number(e.x) - t.x;
                        this.dif_y = Number(e.y) - t.y;
                        this.checkCamera(Number(e.x), Number(e.y));
                    } else {
                        o = !1;
                        this.checkCamera(t.x, t.y);
                    }
                    if ("" != e.ss) this.camera_ts.zoomRatio = Number(e.ss); else {
                        o = !1;
                        this.camera_ts.zoomRatio = 1;
                    }
                    o && "" != e.se && "" != e.time && "" != e.mod && this.zoom(Number(e.mod), Number(e.se), null, Number(e.time));
                } else {
                    this.camera_ts.zoomRatio = 1;
                    this.checkCamera(t.x, t.y);
                }
            };
            e.prototype.initTrack = function (t) {
                this.trackPos = t;
                this.xRate = 0;
                this.speedX = 0;
                this.speedY = 0;
            };
            Object.defineProperty(e.prototype, "ratio", {
                get: function () {
                    return this.camera_ts.zoomRatio;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.trackPosAct = function (t) {
                this.camera_ts.zoomRatio;
                this.checkCamera(t.x + this.dif_x, t.y + this.dif_y);
            };
            e.prototype.checkCamera = function (t, e) {
                var o = this.camera_ts.zoomRatio, i = this.mapHeight / 2 * Math.sqrt(o), n = this.showHeight / 2;
                e > i - n ? e = i - n : e < -i + n && (e = -i + n);
                var a = this.mapWidth / 2, s = this.showWidth / 2;
                t > a - s ? t = a - s : t < -a + s && (t = -a + s);
                this.node.x = t;
                this.node.y = e;
            };
            e.prototype.zoom = function (t, e, o, i, n) {
                var a = this;
                void 0 === o && (o = null);
                void 0 === i && (i = .5);
                void 0 === n && (n = null);
                this.unscheduleAllCallbacks();
                var s = Math.floor(60 * i), r = (e - this.camera_ts.zoomRatio) / s, c = 0, l = 0;
                if (o) {
                    null != o.x && (c = (o.x - this.node.x) / s);
                    null != o.y && (l = (o.y - this.node.y) / s);
                } else {
                    c = -this.dif_x / s;
                    l = -this.dif_y / s;
                }
                var h = 0, d = 0;
                if (1 == t) {
                    c -= (h = c / s) * (s / 2);
                    l -= (d /= s) * (s / 2);
                } else if (2 == t) {
                    c += s / 2 * -(h = -c / s);
                    l += s / 2 * -(d = -d / s);
                }
                this.schedule(function () {
                    a.camera_ts.zoomRatio += r;
                    a.dif_x += c;
                    a.dif_y += l;
                    c += h;
                    l += d;
                    --s <= 0 && n && n();
                }, 0, s - 1);
            };
            e.prototype.stateBack = function () {
                this.node.x = this.lastX;
                this.node.y = this.lastY;
                this.camera_ts.zoomRatio = 1;
            };
            e.prototype.setCameraZoomRatio = function (t) {
                if (!t) return console.log("=zoomRatioNum=参数错误");
                this.camera_ts.zoomRatio = t;
            };
            return a([r], e);
        }(cc.Component));
        o.default = c;
        cc._RF.pop();
    }, {}],
    cgDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "6dc169VP/VJXYjHh/zU5nYs", "cgDialog");
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
        var s = t("../common/PopupView"), r = t("./spineManager"), c = cc._decorator, l = c.ccclass, h = c.property, d = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.node_ani = null;
                e.node_black = null;
                return e;
            }
            e.prototype.initData = function (t) {
                var e = this;
                if (t) {
                    this.node.runAction(cc.fadeIn(.3));
                    var o = this.node_ani.addComponent(r.default);
                    o.m_specialParm = !0;
                    o.initData(this.node_ani, "daiji", "effect/inbetweening" + t[0], function () {
                        e.node_ani.removeFromParent();
                        e.node_ani.destroy();
                        e.closeAct();
                    }, 1);
                    this.closeBack = t[1];
                }
            };
            e.prototype.closeAct = function () {
                var t = this;
                this.node_black.active = !0;
                this.node_black.runAction(cc.sequence(cc.fadeOut(.4), cc.callFunc(function () {
                    t._onClose();
                })));
            };
            e.prototype.start = function () { };
            e.prototype.onDisable = function () {
                this.closeBack && this.closeBack();
            };
            a([h(cc.Node)], e.prototype, "node_ani", void 0);
            a([h(cc.Node)], e.prototype, "node_black", void 0);
            return a([l], e);
        }(s.default);
        o.default = d;
        cc._RF.pop();
    }, {
        "../common/PopupView": "PopupView",
        "./spineManager": "spineManager"
    }],
    chapterDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "bec7dSuQCFKALWxZfFimK75", "chapterDialog");
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
        var s = t("../common/ConfManager"), r = t("../common/GameData"), c = t("../common/PopupView"), l = t("../common/SoundManage"), h = t("../common/ToolsManager"), d = t("../common/ViewManager"), p = cc._decorator, u = p.ccclass, m = p.property, _ = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.pan_chapter = null;
                e.node_right = null;
                e.node_bg = null;
                e.scroll_chapter = null;
                e.CHAPTER_MAX = 11;
                e.chapterMap = {};
                e.chapterData = {};
                e.isNodeRight = !1;
                e.touchChapter = 0;
                e.CHAPTER_STEP_2 = -1520;
                e.CHAPTER_STEP_3 = -3050;
                e.chapter_step = 1;
                e.scrollPos = null;
                e.label_name_r = null;
                e.label_info_r = null;
                e.rich_story_r = null;
                e.rich_item_r = null;
                e.label_num_r = null;
                e.itemCount = {};
                e.storyCount = {};
                return e;
            }
            e.prototype.initData = function () { };
            e.prototype.start = function () {
                var t = r.default.itemData;
                for (var e in t) {
                    var o = t[e].xjid;
                    null != this.itemCount[o] ? this.itemCount[o]++ : this.itemCount[o] = 1;
                }
                var i = r.default.storyData;
                for (var e in i) if (null != i[e]) {
                    o = i[e].xjid;
                    null != this.storyCount[o] ? this.storyCount[o]++ : this.storyCount[o] = 1;
                }
                for (var e in r.default.chapterData) {
                    var n = r.default.chapterData[e];
                    for (var a in n) this.chapterData[n[a].id] = n[a];
                }
                this.initChapter();
                this.pan_chapter.on(cc.Node.EventType.TOUCH_START, this.scrollTouchStart, this);
                this.pan_chapter.on(cc.Node.EventType.TOUCH_MOVE, this.scrollTouchMove, this);
                this.pan_chapter.on(cc.Node.EventType.TOUCH_END, this.scrollTouchEnd, this);
            };
            e.prototype.initChapter = function () {
                for (var t = 1; t <= this.CHAPTER_MAX; t++) {
                    var e = this.pan_chapter.getChildByName("node_chapter" + t);
                    this.chapterMap[t] = e;
                    var o = r.default.unlockchapters + 1, i = e.getChildByName("node_unlock"), n = e.getChildByName("node_lock"), a = Number(t);
                    e.chapterId = a;
                    var s = r.default.chapterUiConf[a], c = s.chapterid.split("_");
                    if (o < a) {
                        i.active = !1;
                        n.active = !0;
                        s && (n.getChildByName("img_bg").getChildByName("label_num").getComponent(cc.Label).string = c[0] + ":" + c[1]);
                    } else {
                        i.active = !0;
                        n.active = !1;
                        e.isUnlock = !0;
                        if (s) {
                            var l = i.getChildByName("img_title");
                            l.getChildByName("label_name").getComponent(cc.Label).string = s.chapter_name;
                            l.getChildByName("label_num").getComponent(cc.Label).string = c[0] + ":" + c[1];
                            var h = i.getChildByName("img_record"), d = s.chapter_prop.split("|"), p = null != this.storyCount[a] ? this.storyCount[a] : 0, u = null != this.itemCount[a] ? this.itemCount[a] : 0;
                            h.getChildByName("rText_story").getComponent(cc.RichText).string = "<color=#8c21220><b>" + p + "</c><b><color=#21212> / " + d[0] + "</color>";
                            h.getChildByName("rText_item").getComponent(cc.RichText).string = "<color=#8c21220><b>" + u + "</c><b><color=#21212> / " + d[1] + "</color>";
                        }
                    }
                }
            };
            e.prototype.chapterCall = function () { };
            e.prototype.scrollCall = function (t) {
                var e, o = t.getScrollOffset().x;
                e = o <= this.CHAPTER_STEP_3 ? 3 : o <= this.CHAPTER_STEP_2 ? 2 : 1;
                if (this.chapter_step != e) {
                    this.chapter_step = e;
                    h.default.setSpriteFrame(this.node_bg.getComponent(cc.Sprite), "dialog/mainchapter/bg" + this.chapter_step);
                    this.node_bg.stopAllActions();
                    this.node_bg.runAction(cc.sequence(cc.fadeTo(.2, 180), cc.fadeTo(.3, 255)));
                }
            };
            e.prototype.scrollTouchStart = function (t) {
                this.scrollPos = t.getLocation();
            };
            e.prototype.scrollTouchMove = function (t) {
                if (this.isNodeRight) {
                    var e = t.getLocation();
                    if (Math.sqrt(Math.pow(e.x - this.scrollPos.x, 2) + Math.pow(e.y - this.scrollPos.y, 2)) > 50) {
                        this.isNodeRight = !1;
                        var o = cc.winSize.width;
                        this.node_right.stopAllActions();
                        this.node_right.runAction(cc.moveTo(.3, cc.v2(o / 2, 0)));
                    }
                }
            };
            e.prototype.scrollTouchEnd = function (t) {
                this.scrollPos = null;
                var e = t.getLocation();
                e.x -= this.pan_chapter.x;
                e.y -= 375;
                this.touchChapter = 0;
                for (var o in this.chapterMap) {
                    var i = this.chapterMap[o];
                    if (i.isUnlock && Math.abs(i.x - e.x) < 150 && Math.abs(i.y - e.y) < 100) {
                        this.touchChapter = i.chapterId;
                        break;
                    }
                }
                console.log("----------- this.touchChapter " + this.touchChapter);
                var n = cc.winSize.width;
                if (this.touchChapter > 0) {
                    l.default.playSound("ui/paper.mp3");
                    if (this.isNodeRight) this.updateRight(); else {
                        this.isNodeRight = !0;
                        this.updateRight();
                        this.node_right.stopAllActions();
                        this.node_right.runAction(cc.moveTo(.3, cc.v2(n / 2 - 550, 0)));
                    }
                } else if (0 == this.touchChapter && this.isNodeRight) {
                    this.isNodeRight = !1;
                    this.node_right.stopAllActions();
                    this.node_right.runAction(cc.moveTo(.3, cc.v2(n / 2, 0)));
                }
            };
            e.prototype.updateRight = function () {
                var t = r.default.chapterUiConf[this.touchChapter];
                if (t) {
                    this.label_name_r.string = t.chapter_name;
                    this.label_info_r.string = "      " + t.chapter_txt;
                    var e = t.chapterid.split("_");
                    this.label_num_r.string = e[0] + ":" + e[1];
                    var o = t.chapter_prop.split("|");
                    this.rich_story_r.string = "<color=#8c21220>0</c><color=#F8E5D9> / " + o[0] + "</color>";
                    this.rich_item_r.string = "<color=#8c21220>0</c><color=#F8E5D9> / " + o[1] + "</color>";
                }
            };
            e.prototype.goGameCall = function () {
                var t = this;
                l.default.playSound("ui/start.mp3");
                d.default.open("dialog/tipsDialog", ["是否载入<size=22> <size=30><b>" + r.default.chapterUiConf[this.touchChapter].chapter_name + "?</>", "", function () {
                    s.default.cleanAllSave();
                    console.log("==选择=" + r.default.chapterUiConf[t.touchChapter].chapter_name + "进入游戏");
                    r.default.initMapInfo(t.touchChapter);
                    r.default.Smallplot = "0_" + t.touchChapter;
                    cc.director.preloadScene("transitionScene", function () { }, function () {
                        setTimeout(function () {
                            l.default.stopBGM();
                            cc.director.loadScene("transitionScene", function () {
                                console.log("==== transitionScene==success=====");
                            });
                        }, 1200);
                    });
                }]);
            };
            a([m(cc.Node)], e.prototype, "pan_chapter", void 0);
            a([m(cc.Node)], e.prototype, "node_right", void 0);
            a([m(cc.Node)], e.prototype, "node_bg", void 0);
            a([m(cc.Node)], e.prototype, "scroll_chapter", void 0);
            a([m(cc.Label)], e.prototype, "label_name_r", void 0);
            a([m(cc.Label)], e.prototype, "label_info_r", void 0);
            a([m(cc.RichText)], e.prototype, "rich_story_r", void 0);
            a([m(cc.RichText)], e.prototype, "rich_item_r", void 0);
            a([m(cc.Label)], e.prototype, "label_num_r", void 0);
            return a([u], e);
        }(c.default);
        o.default = _;
        cc._RF.pop();
    }, {
        "../common/ConfManager": "ConfManager",
        "../common/GameData": "GameData",
        "../common/PopupView": "PopupView",
        "../common/SoundManage": "SoundManage",
        "../common/ToolsManager": "ToolsManager",
        "../common/ViewManager": "ViewManager"
    }],
    checkDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "18565dXpqREe53J82VoAvPU", "checkDialog");
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
        var s = t("../common/PopupView"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.sp_check = null;
                return e;
            }
            e.prototype.initData = function (t) {
                if (t) {
                    this.setSpriteFrame(this.sp_check, "gk/scenes_public/check/check_" + t[0]);
                    this.closeBack = t[1];
                } else console.log("----- 检视图片参数有误");
            };
            e.prototype.start = function () {
                var t = this;
                this.node.on(cc.Node.EventType.TOUCH_START, function () {
                    t._onClose();
                });
            };
            e.prototype.onDisable = function () {
                this.closeBack && this.closeBack();
            };
            a([l(cc.Sprite)], e.prototype, "sp_check", void 0);
            return a([c], e);
        }(s.default);
        o.default = h;
        cc._RF.pop();
    }, {
        "../common/PopupView": "PopupView"
    }],
    cloud: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "7a47dBa0+NMlbdcRqmU5OXf", "cloud");
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
        var s = cc._decorator, r = s.ccclass, c = s.property, l = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.cloud1_1 = null;
                e.cloud1_2 = null;
                e.cloud2_1 = null;
                e.cloud2_2 = null;
                return e;
            }
            e.prototype.start = function () {
                this.schedule(this.cloudAct, 0);
            };
            e.prototype.cloudAct = function () {
                this.cloud1_1.x -= .16;
                this.cloud1_1.x < -18e3 && (this.cloud1_1.x = this.cloud1_2.x + 12e3);
                this.cloud1_2.x -= .16;
                this.cloud1_2.x < -18e3 && (this.cloud1_2.x = this.cloud1_1.x + 12e3);
                this.cloud2_1.x -= .09;
                this.cloud2_1.x < -18e3 && (this.cloud2_1.x = this.cloud2_2.x + 12e3);
                this.cloud2_2.x -= .09;
                this.cloud2_2.x < -18e3 && (this.cloud2_2.x = this.cloud2_1.x + 12e3);
            };
            e.prototype.onDisable = function () {
                this.unscheduleAllCallbacks();
            };
            a([c(cc.Node)], e.prototype, "cloud1_1", void 0);
            a([c(cc.Node)], e.prototype, "cloud1_2", void 0);
            a([c(cc.Node)], e.prototype, "cloud2_1", void 0);
            a([c(cc.Node)], e.prototype, "cloud2_2", void 0);
            return a([r], e);
        }(cc.Component);
        o.default = l;
        cc._RF.pop();
    }, {}],
    dialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "640cd8KF2NPIpMKxaBbvbVR", "dialog");
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
        var s = cc._decorator, r = s.ccclass, c = s.property, l = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.label_ms = null;
                return e;
            }
            e.prototype.initData = function (t) {
                this.label_ms.string = t;
            };
            e.prototype.start = function () { };
            a([c(cc.Label)], e.prototype, "label_ms", void 0);
            return a([r], e);
        }(cc.Component);
        o.default = l;
        cc._RF.pop();
    }, {}],
    editorScene: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "f91b9kzkPdDroxsZ7v+Zw7A", "editorScene");
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
        var s = t("./common/BaseScene"), r = t("./common/ConfManager"), c = t("./common/GameData"), l = t("./gameTools/HttpGame"), h = t("./node_netTip"), d = cc._decorator, p = d.ccclass, u = d.property, m = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.node_show = null;
                e.node_game = null;
                e.eb_width = null;
                e.eb_height = null;
                e.slider_width = null;
                e.slider_height = null;
                e.scroll_obj = null;
                e.slider_obj = null;
                e.scroll_eventObj = null;
                e.slider_event = null;
                e.pan_item = null;
                e.lb_pos = null;
                e.sx = 0;
                e.sy = 0;
                e.ix = 0;
                e.iy = 0;
                e.gameWidth = 1e3;
                e.gameHeight = 600;
                e.label_locTime = null;
                e.label_netTime = null;
                e.eb_seach = null;
                e.pan_seach = null;
                e.node_seach = null;
                e.label_seach = null;
                e.btn_pre = null;
                e.itemData = null;
                e.itemList = {
                    initPos: {
                        name: "初始位置",
                        url: "role/role_1"
                    },
                    trigger: {
                        name: "触发器",
                        url: ""
                    },
                    goods: {
                        name: "场景道具",
                        url: ""
                    },
                    collection: {
                        name: "收藏品",
                        url: "item/items/item3"
                    },
                    prop20: {
                        name: "空水桶",
                        url: "public/goods/prop_pail1"
                    },
                    prop44: {
                        name: "铁锹",
                        url: "public/goods/prop_shovel"
                    },
                    prop41: {
                        name: "红薯",
                        url: "public/goods/prop_cooked1"
                    }
                };
                e.chooseList = {};
                e.editItem = null;
                e.node_data = null;
                e.lb_name = null;
                e.node_item = null;
                e.pan_obj = null;
                e.index_obj = 0;
                e.pan_eventobj = null;
                e.node_event = null;
                e.pan_event = null;
                e.chooseEvent = {};
                e.node_param = null;
                e.lb_ePre = null;
                e.lb_eTrigger = null;
                e.lb_index = null;
                e.eventMod = 0;
                e.selectObj = null;
                e.eb_map = null;
                e.isImport = !1;
                e.mapKey = "";
                e.node_org = null;
                e.node_camera = null;
                e.eb_camera_x = null;
                e.eb_camera_y = null;
                e.eb_camera_start = null;
                e.eb_camera_end = null;
                e.eb_camera_time = null;
                e.eb_camera_mod = null;
                e.eb_px = null;
                e.eb_py = null;
                e.node_netTip = null;
                return e;
            }
            e.prototype.start = function () {
                this.eb_px.string = "0";
                this.eb_py.string = "0";
                r.default.loadTempData();
                cc.resources.loadDir("gameConf", function (t, e) {
                    t && console.log("--- error ", t);
                    for (var o = 0, i = e; o < i.length; o++) {
                        var n = i[o];
                        switch (n.name) {
                            case "eventConf":
                                c.default.loadEvent(n.json);
                                break;

                            case "doorConf":
                                c.default.loadDoor(n.json);
                                break;

                            case "plotConf":
                                c.default.loadPlot(n.json);
                                break;

                            case "goodsConf":
                                c.default.loadGoods(n.json);
                                break;

                            case "chapterConf":
                                c.default.loadChapter(n.json);
                                break;

                            case "aniConf":
                                c.default.loadAni(n.json);
                                break;

                            case "guideConf":
                                c.default.loadGuide(n.json);
                                break;

                            case "chapterMax":
                                c.default.chapterMax = n.json;
                                c.default.ctorChapter();
                                break;

                            case "talkConf":
                                c.default.loadTalk(n.json);
                                break;

                            case "story":
                                c.default.story = n.json;
                                c.default.ctorStory();
                                break;

                            case "item":
                                c.default.item = n.json;
                                break;

                            case "gametips":
                                c.default.gametipsJson = n.json;
                                break;

                            case "comConf":
                                c.default.loadCom(n.json);
                                break;

                            case "processConf":
                                c.default.loadprocess(n.json);
                                break;

                            case "chapterUi":
                                c.default.loadChapterUi(n.json);
                                break;

                            case "answer":
                                c.default.loadanswer(n.json);
                                break;

                            case "cgtitle":
                                c.default.cgtitleConfig = n.json;
                                c.default.ctorCgtitle();
                                break;

                            case "groundConf":
                                c.default.loadGround(n.json);
                                break;

                            case "sound":
                                c.default.soundJson = n.json;
                        }
                    }
                    this.initItems();
                    this.initEvent();
                    this.showNodeParam(!1);
                    this.hideNodeEvent();
                    this.hideEdit();
                    this.hideNodeItem();
                }.bind(this));
            };
            e.prototype.loadViewPrefab = function (t, e, o) {
                var i = this;
                this.createPrefab("view/" + t, function (n) {
                    if (null != n) {
                        i.mapKey = t;
                        c.default.mapKey = t;
                        i.node_game.width = n.width;
                        i.node_game.height = n.height;
                        i.gameWidth = n.width;
                        i.gameHeight = n.height;
                        if (o) {
                            i.node_camera.active = !0;
                            i.eb_camera_x.string = null == o.x || "" == o.x ? "" : Number(o.x) + i.gameWidth / 2 + "";
                            i.eb_camera_y.string = null == o.y || "" == o.y ? "" : i.gameHeight / 2 - Number(o.y) + "";
                            i.eb_camera_start.string = o.ss;
                            i.eb_camera_end.string = o.se;
                            i.eb_camera_time.string = o.time;
                            i.eb_camera_mod.string = o.mod || "0";
                        }
                        i.eb_px.string = i.gameWidth / 2 + "";
                        i.eb_py.string = i.gameHeight / 2 + "";
                        i.node_org.x = -i.gameWidth / 2;
                        i.node_org.y = i.gameHeight / 2 + 30;
                        n.zIndex = -9999;
                        i.node_game.addChild(n);
                        if (null != e) {
                            var a = function () {
                                var t = e[s], o = i.itemList[t.key];
                                t.url = o.url;
                                i.createPrefab("itemObj", function (e) {
                                    i.pan_obj.addChild(e);
                                    e.getComponent("itemObj").initItemObj(t.key, t, t.index, i);
                                    e.on(cc.Node.EventType.TOUCH_END, i.itemObjCall, i);
                                    e.getComponent("itemObj").createAss();
                                    t.index > i.index_obj && (i.index_obj = t.index);
                                });
                            };
                            for (var s in e) a();
                        }
                        i.scheduleOnce(function () {
                            i.btn_pre.active = !0;
                        }, 3);
                    } else i.isImport = !1;
                });
            };
            e.prototype.cleanSaveCall = function () {
                r.default.cleanAllSave();
            };
            e.prototype.downloadCall = function () {
                l.default.config({
                    gametype: "cz"
                }, function (t) {
                    console.log("downloadCall res ---- ", JSON.stringify(t));
                    if (1 == t.code) {
                        var e = document.createElement("a");
                        e.download = "czconfig.json";
                        e.style.display = "none";
                        var o = new Blob([JSON.stringify(t.data)]);
                        e.href = URL.createObjectURL(o);
                        document.body.appendChild(e);
                        e.click();
                        document.body.removeChild(e);
                    }
                });
            };
            e.prototype.downLocalCall = function () {
                this.saveConf(null, 2);
            };
            e.prototype.importCall = function (t, e) {
                var o = this;
                if (!this.isImport) {
                    this.isImport = !0;
                    var i = this.eb_map.string;
                    if ("" != i && null != i) if (c.default.isConfNet && 1 == Number(e)) {
                        console.log("----- 开始从服务器导入数据 -----");
                        var n = !1;
                        l.default.checkName({
                            name: i
                        }, function (t) {
                            if (1 == t.code) {
                                var e = t.data;
                                if (e.content) {
                                    n = !0;
                                    var a = JSON.parse(e.content), s = a.confArr;
                                    o.loadViewPrefab(i, s, a.initCamera);
                                } else console.log("----- 找不到关卡配置数据！", i);
                            }
                            n || o.loadViewPrefab(i, null, null);
                        });
                    } else {
                        console.log("----- 开始从本地导入数据 -----");
                        var a = r.default.getPointConf(i);
                        if (a) {
                            var s = a.confArr;
                            this.loadViewPrefab(i, s, a.initCamera);
                        } else this.loadViewPrefab(i, null, null);
                    } else this.isImport = !1;
                }
            };
            e.prototype.preCall = function () {
                this.saveConf(null, 0);
                this.isImport && "" != this.mapKey && cc.director.loadScene("gameScene");
            };
            e.prototype.saveNetCall = function () {
                var t = this;
                if (this.isImport && "" != this.mapKey) {
                    this.node_netTip.active = !0;
                    this.node_netTip.getComponent(h.default).initCallBack(function () {
                        t.saveConf(null, 1);
                    }, "是否确认要保存至服务器？");
                }
            };
            e.prototype.saveConf = function (t, e) {
                this.addObjEvent();
                var o = {}, i = [];
                if (this.isImport && "" != this.mapKey) {
                    for (var n = 0, a = this.pan_obj.children; n < a.length; n++) {
                        var s = a[n].getComponent("itemObj").getConf();
                        null != s && i.push(s);
                    }
                    o.confArr = i;
                    var h = "", d = "";
                    "" != this.eb_camera_x.string && (h = Number(this.eb_camera_x.string) - this.gameWidth / 2 + "");
                    "" != this.eb_camera_y.string && (d = -(Number(this.eb_camera_y.string) - this.gameHeight / 2) + "");
                    o.initCamera = {
                        x: h,
                        y: d,
                        ss: this.eb_camera_start.string,
                        se: this.eb_camera_end.string,
                        time: this.eb_camera_time.string,
                        mod: this.eb_camera_mod.string
                    };
                    console.log("----- initCamera ", o.initCamera);
                    if (c.default.isConfNet && 1 == Number(e)) if ("scenes_d99_99" == this.mapKey) alert("测试关卡数据不上传服务器！！"); else {
                        console.log("----- 保存数据至服务器 -----");
                        l.default.saveConfig({
                            name: this.mapKey,
                            surpass: 0,
                            sortno: 1,
                            content: JSON.stringify(o)
                        }, function (t) {
                            console.log("------res ", t);
                            if (1 == t.code) alert("保存成功!"); else {
                                alert("保存失败!");
                                console.log("---- msg ", t.msg);
                            }
                        });
                    } else if (0 == Number(e)) {
                        console.log("----- 保存数据至本地 -----");
                        r.default.setPointConf(this.mapKey, o);
                    } else if (2 == Number(e)) {
                        console.log("----- 下载本地文档 -----");
                        var p = document.createElement("a");
                        p.download = this.mapKey + ".json";
                        p.style.display = "none";
                        var u = new Blob([JSON.stringify(o)]);
                        p.href = URL.createObjectURL(u);
                        document.body.appendChild(p);
                        p.click();
                        document.body.removeChild(p);
                    }
                    var m = new Date().toLocaleString();
                    if (0 == Number(e)) {
                        this.label_locTime.string = m;
                        cc.sys.localStorage.setItem("saveLocTime", JSON.stringify(m));
                    } else if (1 == Number(e)) if (c.default.isConfNet) {
                        if ("scenes_d99_99" != this.mapKey) {
                            this.label_netTime.string = m;
                            cc.sys.localStorage.setItem("saveNetTime", JSON.stringify(m));
                        }
                    } else this.label_netTime.string = "离线模式";
                }
            };
            e.prototype.initEvent = function () {
                var t = this, e = c.default.eventConf, o = function () {
                    var o = n, a = e[n];
                    i.createPrefab("itemEvent", function (e) {
                        e.getChildByName("lb_index").getComponent(cc.Label).string = a.id;
                        e.getChildByName("lb_res").getComponent(cc.Label).string = a.explain;
                        t.pan_event.addChild(e);
                        e.eventKey = o;
                        e.isChoose = !1;
                        e.getChildByName("sp_g").active = !1;
                        e.on(cc.Node.EventType.TOUCH_END, t.eventStartCall, t);
                    });
                }, i = this;
                for (var n in e) o();
            };
            e.prototype.addObjEvent = function () {
                if (this.selectObj) {
                    for (var t = [], e = 0, o = this.pan_eventobj.children; e < o.length; e++) {
                        var i = o[e];
                        t.push(i.getComponent("itemEventObj").getEventData());
                    }
                    this.selectObj.getComponent("itemObj").addEvent(t);
                }
            };
            e.prototype.moveUpEvent = function (t) {
                if (this.selectObj) {
                    var e = 0, o = this.pan_eventobj.children;
                    for (var i in o) if (t == o[i]) {
                        e = Number(i);
                        break;
                    }
                    if (e > 0) {
                        var n = o[e - 1];
                        o[e - 1] = t;
                        o[e] = n;
                        o[e].y += 100;
                    }
                }
            };
            e.prototype.saveEventConf = function () {
                this.addObjEvent();
                this.saveConf(null, 0);
            };
            e.prototype.eventAddCall = function () {
                var t = this;
                if (this.selectObj) {
                    for (var e = 0, o = 0, i = this.pan_eventobj.children; o < i.length; o++) {
                        var n = i[o].getComponent("itemEventObj").getIndex();
                        n >= e && (e = n);
                    }
                    var a = function () {
                        var o = r;
                        1 == s.chooseEvent[r] && s.createPrefab("itemEventObj", function (i) {
                            t.pan_eventobj.addChild(i);
                            e++;
                            i.getComponent("itemEventObj").initItemEventObj({
                                key: o
                            }, e, t);
                        });
                    }, s = this;
                    for (var r in this.chooseEvent) a();
                    this.chooseEvent = {};
                    this.initEventState();
                    this.hideNodeEvent();
                }
            };
            e.prototype.eventDelCall = function () {
                this.selectObj;
            };
            e.prototype.showNodeEvent = function (t, e) {
                this.node_event.active = !0;
                this.eventMod = e;
            };
            e.prototype.hideNodeEvent = function () {
                this.node_event.active = !1;
            };
            e.prototype.initEventState = function () {
                for (var t = 0, e = this.pan_event.children; t < e.length; t++) {
                    var o = e[t];
                    o.isChoose = !1;
                    o.getChildByName("sp_g").active = !1;
                }
            };
            e.prototype.eventStartCall = function (t) {
                var e = t.currentTarget;
                if (e.isChoose) {
                    e.isChoose = !1;
                    this.chooseEvent[e.eventKey] = 0;
                    console.log("----- 取消event " + e.eventKey);
                } else {
                    e.isChoose = !0;
                    this.chooseEvent[e.eventKey] = 1;
                    console.log("----- 选中event " + e.eventKey);
                }
                e.getChildByName("sp_g").active = e.isChoose;
            };
            e.prototype.initItems = function () {
                var t = this, e = function () {
                    var e = i, n = o.itemList[i];
                    o.createPrefab("item", function (o) {
                        t.setSpriteFrame(o.getChildByName("sp_item").getComponent(cc.Sprite), n.url);
                        o.getChildByName("lb_name").getComponent(cc.Label).string = n.name;
                        t.pan_item.addChild(o);
                        o.dataKey = e;
                        o.isChoose = !1;
                        o.getChildByName("sp_g").active = !1;
                        o.on(cc.Node.EventType.TOUCH_END, t.itemStartCall, t);
                    });
                }, o = this;
                for (var i in this.itemList) e();
            };
            e.prototype.initItemState = function () {
                for (var t = 0, e = this.pan_item.children; t < e.length; t++) {
                    var o = e[t];
                    o.isChoose = !1;
                    o.getChildByName("sp_g").active = !1;
                }
            };
            e.prototype.itemAddCall = function () {
                var t = this, e = function () {
                    var e = i, n = o.itemList[e], a = {};
                    for (var s in n) a[s] = n[s];
                    1 == o.chooseList[i] && o.createPrefab("itemObj", function (o) {
                        t.pan_obj.addChild(o);
                        t.index_obj++;
                        o.getComponent("itemObj").initItemObj(e, a, t.index_obj, t);
                        o.on(cc.Node.EventType.TOUCH_END, t.itemObjCall, t);
                    });
                }, o = this;
                for (var i in this.chooseList) e();
                this.chooseList = {};
                this.initItemState();
                this.hideNodeItem();
            };
            e.prototype.showNodeParam = function (t) {
                this.node_param.active = t;
            };
            e.prototype.itemObjCall = function (t, e) {
                for (var o = t.currentTarget, i = this.pan_obj.children, n = i.length, a = -1, s = 0, r = i; s < r.length; s++) {
                    var c = r[s];
                    a++;
                    c.getComponent("itemObj").showSelect(c == o);
                    if (c == o && o != this.selectObj) {
                        this.selectObj = o;
                        this.refreshParam(o.getComponent("itemObj").getData());
                        this.showNodeParam(o.getComponent("itemObj").isCreate);
                        var l = o.getComponent("itemObj").getPos();
                        l && this.locationObj(l.x, l.y);
                        if (e) {
                            e = !1;
                            this.scroll_obj.scrollToPercentVertical(1 - a / n, 0);
                        }
                    }
                }
            };
            e.prototype.delObjCall = function (t) {
                var e = this, o = t.getComponent("itemObj");
                this.node_netTip.active = !0;
                this.node_netTip.getComponent(h.default).initCallBack(function () {
                    e.checkObjParam(t);
                    o.delSelf();
                }, "是否要删除 " + o.itemIndex + " 号组件？");
            };
            e.prototype.checkObjParam = function (t) {
                if (this.selectObj == t) {
                    this.selectObj = null;
                    this.showNodeParam(!1);
                }
            };
            e.prototype.copyObjCall = function () {
                var t = this;
                if (this.selectObj) {
                    var e = this.selectObj.getComponent("itemObj").getData(), o = {};
                    for (var i in e) o[i] = e[i];
                    o.x += 100;
                    this.createPrefab("itemObj", function (e) {
                        t.pan_obj.addChild(e);
                        t.index_obj++;
                        e.getComponent("itemObj").initItemObj(o.key, o, t.index_obj, t);
                        e.on(cc.Node.EventType.TOUCH_END, t.itemObjCall, t);
                        e.getComponent("itemObj").createAss();
                    });
                }
            };
            e.prototype.refreshParam = function (t) {
                var e = this;
                this.pan_eventobj.removeAllChildren();
                var o = 0, i = t.eventTrigger, n = function () {
                    var t = i[s];
                    a.createPrefab("itemEventObj", function (i) {
                        e.pan_eventobj.addChild(i);
                        o++;
                        i.getComponent("itemEventObj").initItemEventObj(t, o, e);
                    });
                }, a = this;
                for (var s in i) n();
            };
            e.prototype.oneKeyObj = function () {
                for (var t = 0, e = this.pan_obj.children; t < e.length; t++) e[t].getComponent("itemObj").createAss();
            };
            e.prototype.oneKeyUpdateAss = function () {
                for (var t = 0, e = this.pan_obj.children; t < e.length; t++) e[t].getComponent("itemObj").updateAss();
            };
            e.prototype.closeSeach = function () {
                this.node_seach.active = !1;
            };
            e.prototype.seachCall = function () {
                var t = this;
                if ("" != this.eb_seach.string) {
                    for (var e = this.eb_seach.string, o = [], i = 0, n = 0, a = this.pan_obj.children; n < a.length; n++) {
                        var s = a[n];
                        if (s.getComponent("itemObj").itemName.indexOf(e) >= 0) {
                            o.push(s);
                            i++;
                        }
                    }
                    this.label_seach.string = "搜索找到" + i + "个";
                    this.pan_seach.removeAllChildren();
                    for (var r = function (e) {
                        var o = e, i = {
                            index: e.getComponent("itemObj").itemIndex,
                            name: e.getComponent("itemObj").itemName
                        };
                        c.createPrefab("itemSeach", function (e) {
                            t.pan_seach.addChild(e);
                            e.getChildByName("lb_index").getComponent(cc.Label).string = i.index;
                            e.getChildByName("lb_name").getComponent(cc.Label).string = i.name;
                            e.link = o;
                            e.on(cc.Node.EventType.TOUCH_END, t.seachObjCall, t);
                        });
                    }, c = this, l = 0, h = o; l < h.length; l++) r(h[l]);
                    this.node_seach.active = !0;
                }
            };
            e.prototype.seachObjCall = function (t) {
                var e = t.currentTarget;
                e.link && this.itemObjCall({
                    currentTarget: e.link
                }, !0);
            };
            e.prototype.itemStartCall = function (t) {
                var e = t.currentTarget;
                if (e.isChoose) {
                    e.isChoose = !1;
                    this.chooseList[e.dataKey] = 0;
                    console.log("----- 取消 " + e.dataKey);
                } else {
                    e.isChoose = !0;
                    this.chooseList[e.dataKey] = 1;
                    console.log("----- 选中 " + e.dataKey);
                }
                e.getChildByName("sp_g").active = e.isChoose;
            };
            e.prototype.itemMoveCall = function () { };
            e.prototype.itemEndCall = function (t) {
                var e = t.getLocation();
                this.node_game.convertToNodeSpaceAR(e);
            };
            e.prototype.initGameItem = function (t, e, o) {
                var i = t.addComponent(cc.Sprite);
                this.setSpriteFrame(i, o.url);
                t.setPosition(e.x, e.y);
                this.node_game.addChild(t);
                t.itemData = o;
                t.itemData.zIndex = 3;
                t.on(cc.Node.EventType.TOUCH_START, this.editStartCall, this);
                t.on(cc.Node.EventType.TOUCH_MOVE, this.editMoveCall, this);
                t.on(cc.Node.EventType.TOUCH_END, this.editEndCall, this);
                t.on(cc.Node.EventType.TOUCH_CANCEL, this.editEndCall, this);
            };
            e.prototype.addGameItem = function (t, e) {
                this.node_game.addChild(t);
                this.locationObj(t.x, t.y);
                if (this.selectObj == e) {
                    this.refreshParam(e.getComponent("itemObj").getData());
                    this.showNodeParam(!0);
                }
            };
            e.prototype.locationObj = function (t, e) {
                this.node_game.x = -t;
                this.node_game.y = -e;
                this.slider_width.progress = t / this.gameWidth + .5;
                this.slider_height.progress = e / this.gameHeight + .5;
                this.eb_px.string = t + this.gameWidth / 2 + "";
                this.eb_py.string = -e + this.gameHeight / 2 + "";
            };
            e.prototype.locationPos = function () {
                var t = Number(this.eb_px.string) - this.gameWidth / 2, e = this.gameHeight / 2 - Number(this.eb_py.string);
                this.locationObj(t, e);
            };
            e.prototype.editStartCall = function (t) {
                this.editItem = t.currentTarget;
                this.editItem.runAction(cc.sequence(cc.scaleTo(.15, 1.15), cc.scaleTo(.15, 1)));
                this.showEdit();
            };
            e.prototype.editMoveCall = function (t) {
                if (null != this.editItem) {
                    var e = t.getLocation(), o = this.node_game.convertToNodeSpaceAR(e);
                    this.editItem.setPosition(o);
                }
            };
            e.prototype.editEndCall = function () { };
            e.prototype.sliderObjCall = function (t) {
                this.scroll_obj.scrollToPercentVertical(t.progress, 0);
            };
            e.prototype.sliderEventCall = function (t) {
                this.scroll_eventObj.scrollToPercentVertical(t.progress, 0);
            };
            e.prototype.sliderWidthCall = function (t) {
                this.node_game.x = -this.gameWidth * (t.progress - .5);
                var e = Math.floor(-this.node_game.x), o = Math.floor(-this.node_game.y);
                this.eb_px.string = e + this.gameWidth / 2 + "";
                this.eb_py.string = -o + this.gameHeight / 2 + "";
            };
            e.prototype.sliderHeightCall = function (t) {
                this.node_game.y = -this.gameHeight * (t.progress - .5);
                var e = Math.floor(-this.node_game.x), o = Math.floor(-this.node_game.y);
                this.eb_px.string = e + this.gameWidth / 2 + "";
                this.eb_py.string = -o + this.gameHeight / 2 + "";
            };
            e.prototype.btnSizeCall = function () {
                var t = Number(this.eb_width.string), e = Number(this.eb_height.string);
                if (t > 0 && e > 0) {
                    this.gameWidth = t;
                    this.gameHeight = e;
                    this.node_game.width = t;
                    this.node_game.height = e;
                    this.node_game.x = 0;
                    this.node_game.y = 0;
                    this.slider_width.progress = 0;
                    this.slider_height.progress = 0;
                }
            };
            e.prototype.showEdit = function () {
                this.node_data.active = !0;
            };
            e.prototype.hideEdit = function () {
                this.node_data.active = !1;
            };
            e.prototype.showNodeItem = function () {
                this.isImport && (this.node_item.active = !0);
            };
            e.prototype.hideNodeItem = function () {
                this.node_item.active = !1;
            };
            e.prototype.toggleItemCall = function (t, e) {
                null != this.editItem && (this.editItem.zIndex = e);
            };
            e.prototype.delItemCall = function () {
                if (null != this.editItem) {
                    this.editItem.destroy();
                    this.editItem = null;
                    this.hideEdit();
                }
            };
            a([u(cc.Node)], e.prototype, "node_show", void 0);
            a([u(cc.Node)], e.prototype, "node_game", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_width", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_height", void 0);
            a([u(cc.Slider)], e.prototype, "slider_width", void 0);
            a([u(cc.Slider)], e.prototype, "slider_height", void 0);
            a([u(cc.ScrollView)], e.prototype, "scroll_obj", void 0);
            a([u(cc.Slider)], e.prototype, "slider_obj", void 0);
            a([u(cc.ScrollView)], e.prototype, "scroll_eventObj", void 0);
            a([u(cc.Slider)], e.prototype, "slider_event", void 0);
            a([u(cc.Node)], e.prototype, "pan_item", void 0);
            a([u(cc.Label)], e.prototype, "lb_pos", void 0);
            a([u(cc.Label)], e.prototype, "label_locTime", void 0);
            a([u(cc.Label)], e.prototype, "label_netTime", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_seach", void 0);
            a([u(cc.Node)], e.prototype, "pan_seach", void 0);
            a([u(cc.Node)], e.prototype, "node_seach", void 0);
            a([u(cc.Label)], e.prototype, "label_seach", void 0);
            a([u(cc.Node)], e.prototype, "btn_pre", void 0);
            a([u(cc.Node)], e.prototype, "node_data", void 0);
            a([u(cc.Label)], e.prototype, "lb_name", void 0);
            a([u(cc.Node)], e.prototype, "node_item", void 0);
            a([u(cc.Node)], e.prototype, "pan_obj", void 0);
            a([u(cc.Node)], e.prototype, "pan_eventobj", void 0);
            a([u(cc.Node)], e.prototype, "node_event", void 0);
            a([u(cc.Node)], e.prototype, "pan_event", void 0);
            a([u(cc.Node)], e.prototype, "node_param", void 0);
            a([u(cc.Label)], e.prototype, "lb_ePre", void 0);
            a([u(cc.Label)], e.prototype, "lb_eTrigger", void 0);
            a([u(cc.Label)], e.prototype, "lb_index", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_map", void 0);
            a([u(cc.Node)], e.prototype, "node_org", void 0);
            a([u(cc.Node)], e.prototype, "node_camera", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_camera_x", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_camera_y", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_camera_start", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_camera_end", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_camera_time", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_camera_mod", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_px", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_py", void 0);
            a([u(cc.Node)], e.prototype, "node_netTip", void 0);
            return a([p], e);
        }(s.default);
        o.default = m;
        cc._RF.pop();
    }, {
        "./common/BaseScene": "BaseScene",
        "./common/ConfManager": "ConfManager",
        "./common/GameData": "GameData",
        "./gameTools/HttpGame": "HttpGame",
        "./node_netTip": "node_netTip"
    }],
    enemy_ai: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "24e47cIythI97eOjqn2VrBn", "enemy_ai");
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
        var s = t("../common/GameData"), r = t("../common/ToolsManager"), c = t("../gameEvent"), l = cc._decorator, h = l.ccclass, d = (l.property,
            function (t) {
                n(e, t);
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    e.m_bulletNum = 0;
                    e.m_nodeX = 0;
                    e.m_bulletIndex = 0;
                    e.m_CheckOk = !0;
                    e.isDeath = !1;
                    e.isExAct = !1;
                    e.dzTable = {
                        0: {
                            daiji: {
                                name1: "daiji"
                            },
                            zoulu: {
                                name1: "zoulu"
                            },
                            death: {
                                name1: "death"
                            },
                            over: {
                                name1: "over"
                            }
                        },
                        1: {
                            daiji: {
                                name1: "daiji2"
                            },
                            zoulu: {
                                name1: "zoulu2"
                            },
                            death: {
                                name1: "death1"
                            },
                            over: {
                                name1: "over1"
                            }
                        },
                        2: {
                            death: {
                                name1: "death2"
                            },
                            over: {
                                name1: "over2"
                            }
                        }
                    };
                    e.m_flyy = 300;
                    e.m_nowAngle = 0;
                    return e;
                }
                e.prototype.start = function () { };
                e.prototype.initData = function (t, e, o, i) {
                    console.log("enemy ai init ", t);
                    this.aiData = t;
                    this.aiType = e;
                    this.node_ani = o;
                    this.node_ani.scaleX = t.initRight ? Math.abs(this.node_ani.scaleX) : -Math.abs(this.node_ani.scaleX);
                    this.isRight = t.initRight;
                    this.node_ts = i;
                    this.range = t.range;
                    var n = (t.space + "").split("|");
                    this.m_spceTime = n[0];
                    this.m_standbyTime = n[1] || 2;
                    this.speed_walk = (t.xmax - t.xmin) / Number(this.m_spceTime);
                    this.targetX = t.xmin;
                    this.aiState = s.default.AI_NORMAL;
                    this.m_trenchesPos = [];
                    this.m_aniOder = t.ani;
                    var a;
                    a = "" != this.m_aniOder && this.m_aniOder && "0" != this.m_aniOder ? this.m_aniOder : "0";
                    this.m_dzMap = this.dzTable[a];
                    this.m_reverse = t.reverse;
                    this.initAction();
                };
                e.prototype.deathCall = function () {
                    this.isDeath = !0;
                    this.m_CheckOk = !1;
                    this.unscheduleAllCallbacks();
                    this.node.stopAllActions();
                };
                e.prototype.inductionCall = function (t, e, o) {
                    var i = this;
                    void 0 === o && (o = !1);
                    if ((!this.isExAct || 1001 == this.aiType) && t == s.default.CO_EMP) {
                        this.isExAct = !0;
                        this.node.stopAllActions();
                        this.isRight = e.x >= this.node.x;
                        this.node_ani.scaleX = this.isRight ? Math.abs(this.node_ani.scaleX) : -Math.abs(this.node_ani.scaleX);
                        var n, a, r = this.aiData.xmax && "" != this.aiData.xmax ? this.speed_walk : 100;
                        if (1 == e.getComponent("image_sl").m_goods.id) {
                            this.node_ts.playAni({
                                name1: "shoujing3"
                            }, 0);
                            this.scheduleOnce(function () {
                                n = e.x >= i.node.x ? i.node.x - 300 : i.node.x + 300;
                                a = Math.abs(n - i.node.x) / (5.5 * i.speed_walk);
                                i.node.runAction(cc.sequence(cc.callFunc(function () {
                                    i.isRight = n >= i.node.x;
                                    i.node_ani.scaleX = i.isRight ? Math.abs(i.node_ani.scaleX) : -Math.abs(i.node_ani.scaleX);
                                    i.node_ts.playAni({
                                        name1: "benpao"
                                    }, -1);
                                }), cc.moveTo(a, cc.v2(n, i.node.y)), cc.callFunc(function () {
                                    i.node_ts.playAni({
                                        name1: "pudao"
                                    }, 0);
                                }), cc.delayTime(2.5), cc.callFunc(function () {
                                    i.backAction();
                                })));
                            }, 1);
                        } else if (o) {
                            this.node_ts.playAni({
                                name1: "shoujing1"
                            }, 0);
                            this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                                i.node_ts.playAni({
                                    name1: "zuoyouhuanshi"
                                }, 0);
                            }), cc.delayTime(3), cc.callFunc(function () {
                                i.backAction();
                            })));
                        } else {
                            n = e.x >= this.node.x ? e.x - 35 : e.x + 35;
                            a = Math.abs(e.x - this.node.x) / r;
                            this.node_ts.playAni({
                                name1: "shoujing2"
                            }, 0);
                            this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                                i.node_ts.playAni(i.m_dzMap.zoulu, -1);
                            }), cc.moveTo(a, cc.v2(n, this.node.y)), cc.callFunc(function () {
                                i.node_ts.playAni({
                                    name1: "wangyao"
                                }, 0);
                            }), cc.delayTime(3), cc.callFunc(function () {
                                i.backAction();
                            })));
                        }
                    }
                };
                e.prototype.backAction = function () {
                    var t = this;
                    this.isExAct = !1;
                    if (this.aiData.xmax && "" != this.aiData.xmax) this.backPatrol(); else {
                        var e = this.node_ts.itemConf.x;
                        this.isRight = e >= this.node.x;
                        this.node_ani.scaleX = this.isRight ? Math.abs(this.node_ani.scaleX) : -Math.abs(this.node_ani.scaleX);
                        var o = Math.abs(e - this.node.x) / 100;
                        this.node_ts.playAni(this.m_dzMap.zoulu, -1);
                        this.node.runAction(cc.sequence(cc.moveTo(o, cc.v2(e, this.node.y)), cc.callFunc(function () {
                            t.isRight = t.aiData.initRight;
                            t.node_ani.scaleX = t.isRight ? Math.abs(t.node_ani.scaleX) : -Math.abs(t.node_ani.scaleX);
                            t.node_ts.playAni(t.m_dzMap.daiji, -1);
                        })));
                    }
                };
                e.prototype.initAction = function () {
                    var t = this;
                    switch (this.aiType) {
                        case 1001:
                            var e = new cc.Node(), o = e.addComponent(cc.RigidBody);
                            o.type = cc.RigidBodyType.Dynamic;
                            o.gravityScale = 0;
                            var i = this.node.addComponent(cc.PhysicsBoxCollider);
                            i.size.width = 260;
                            i.size.height = 220;
                            i.sensor = !0;
                            i.tag = s.default.CO_SHOWATT;
                            i.apply();
                            this.node.addChild(e);
                            var n = new cc.Node(), a = n.addComponent(cc.RigidBody);
                            a.type = cc.RigidBodyType.Dynamic;
                            a.gravityScale = 0;
                            a.enabledContactListener = !0;
                            var r = this.node.addComponent(cc.PhysicsBoxCollider);
                            r.size.width = 500;
                            r.size.height = 40;
                            r.sensor = !0;
                            r.offset.y = -60;
                            r.tag = s.default.CO_INDUCTION;
                            r.apply();
                            this.node.addChild(n);
                            this.aiData.xmax && "" != this.aiData.xmax ? this.backPatrol() : this.scheduleOnce(function () {
                                t.node_ts.playAni(t.m_dzMap.daiji, -1);
                            }, 1);
                            this.schedule(this.checkHero, .5);
                            break;

                        case 1002:
                            Number(this.m_spceTime) > 0 && this.setActive(Number(this.m_spceTime));
                            break;

                        case 1003:
                            this.m_bulletNum = 50 * Math.floor(this.aiData.range / 500);
                            this.m_bulletNum = 50;
                            this.m_nodeX = this.node.x - 400;
                            "" != this.aiData.special && (this.m_trenchesPos = this.aiData.special.split(","));
                            this.moveBullet();
                            this.scheduleOnce(function () {
                                t.node_ts.playAni("gongji", -1);
                            }, 2);
                            break;

                        case 1004:
                        case 1006:
                            this.setLamplight();
                            break;

                        case 1005:
                            this.scheduleOnce(function () {
                                t.setSentry();
                            }, 4);
                            this.schedule(this.checkHero, .5);
                    }
                };
                e.prototype.setSentry = function () {
                    var t = this;
                    if (this.node_ts.lock) this.scheduleOnce(function () {
                        t.setSentry();
                    }, Number(this.m_spceTime)); else if (this.m_CheckOk) {
                        this.node_ts.playAni("gongji1", 0);
                        this.m_CheckOk = !1;
                        this.scheduleOnce(function () {
                            t.setSentry();
                        }, Number(this.m_spceTime));
                    } else {
                        this.node_ts.playAni("gongji2", 0);
                        this.node.runAction(cc.sequence(cc.delayTime(this.m_standbyTime), cc.callFunc(function () {
                            t.node_ts.playAni("daiji", -1);
                            t.m_CheckOk = !0;
                            t.scheduleOnce(function () {
                                t.setSentry();
                            }, Number(t.m_spceTime));
                        })));
                    }
                };
                e.prototype.checkHero = function () {
                    switch (this.aiType) {
                        case 1001:
                            var t = c.default.hero, e = c.default.hero_ts;
                            if (Math.abs(t.y + 60 - this.node.y) < 100 && "squat" != e.walkingMode && (this.isRight && t.x > this.node.x || !this.isRight && t.x < this.node.x) && Math.abs(t.x - this.node.x) < this.range) {
                                console.log("--------- catch hero !!!");
                                c.default.deathEvent(s.default.CO_DEATH);
                                this.unscheduleAllCallbacks();
                                this.node.stopAllActions();
                            }
                            break;

                        case 1005:
                            var o = c.default.hero;
                            if ((!this.aiData.xmax || "" == this.aiData.xmax) && this.m_CheckOk && (this.isRight && o.x > this.node.x - 110 || !this.isRight && o.x < this.node.x + 110) && Math.abs(o.x - this.node.x) < this.range) {
                                console.log("--------- catch _hero !!!");
                                c.default.deathEvent(s.default.CO_DEATH);
                                this.unscheduleAllCallbacks();
                                this.node.stopAllActions();
                            }
                    }
                };
                e.prototype.backPatrol = function () {
                    var t = this;
                    this.isExAct = !1;
                    this.node_ts.playAni(this.m_dzMap.daiji, -1);
                    this.targetX = this.targetX == this.aiData.xmin ? this.aiData.xmax : this.aiData.xmin;
                    var e = Math.abs(this.node.x - this.targetX) / this.speed_walk;
                    this.node.runAction(cc.sequence(cc.delayTime(this.m_standbyTime), cc.callFunc(function () {
                        t.isRight = t.targetX >= t.node.x;
                        t.node_ani.scaleX = t.isRight ? Math.abs(t.node_ani.scaleX) : -Math.abs(t.node_ani.scaleX);
                        t.node_ts.playAni(t.m_dzMap.zoulu, -1);
                    }), cc.moveTo(e, cc.v2(this.targetX, this.node.y)), cc.callFunc(function () {
                        t.backPatrol();
                    })));
                };
                e.prototype.setActive = function (t) {
                    var e = this;
                    this.scheduleOnce(function () {
                        if (e.node.active) e.node.runAction(cc.sequence(cc.fadeOut(.5), cc.callFunc(function () {
                            e.node.active = !1;
                            e.setActive(Number(e.m_spceTime));
                        }))); else {
                            e.node.active = !0;
                            e.node.runAction(cc.sequence(cc.fadeIn(.5), cc.callFunc(function () {
                                e.setActive(Number(e.m_spceTime));
                            })));
                        }
                    }, t);
                };
                e.prototype.moveBullet = function () {
                    var t = this;
                    if (this.node_ts.lock) this.scheduleOnce(function () {
                        t.moveBullet();
                    }, Number(this.m_spceTime)); else {
                        this.m_nodeX -= 35;
                        for (var e in this.m_trenchesPos) {
                            var o = this.m_trenchesPos[e].split("|"), i = Number(o[0]) - r.default.gameNode.width / 2;
                            Number(o[1]), r.default.gameNode.width;
                            if (this.m_nodeX <= Number(o[0]) - r.default.gameNode.width / 2 && this.m_nodeX > Number(o[1]) - r.default.gameNode.width / 2) {
                                this.m_nodeX = Number(o[1]) - r.default.gameNode.width / 2;
                                if (Number(e) >= 1) {
                                    this.m_flyy -= 35;
                                    console.log("once111=", i);
                                }
                            }
                        }
                        this.createBullet(.15 + .002 * this.m_bulletIndex);
                        this.scheduleOnce(function () {
                            if (t.m_bulletNum > 0) t.moveBullet(); else {
                                t.m_flyy = 300;
                                t.m_bulletNum = 50;
                                t.m_nodeX = t.node.x - 400;
                                t.m_bulletIndex = 0;
                                t.m_nowAngle = 0;
                                t.node_ts.playAni("sheji1", 0);
                                t.scheduleOnce(function () {
                                    t.node_ts.playAni("sheji2", -1);
                                    t.scheduleOnce(function () {
                                        t.node_ts.playAni("sheji3", -1);
                                        t.scheduleOnce(function () {
                                            t.node_ts.playAni("gongji", -1);
                                            t.moveBullet();
                                        }, .1);
                                    }, Number(t.m_spceTime));
                                }, .3);
                            }
                        }, .15);
                    }
                };
                e.prototype.createBullet = function (t) {
                    var e = this;
                    r.default.createPrefab("throw/bullet", function (o) {
                        if (o) {
                            o.x = e.node.x - 280;
                            o.y = e.node.y + 132;
                            o.angle = r.default.getAngle({
                                x: o.x,
                                y: o.y
                            }, {
                                x: e.m_nodeX,
                                y: o.y - e.m_flyy
                            });
                            Math.abs(o.angle), e.m_nowAngle;
                            e.m_bulletIndex >= 5 && (o.x -= 90);
                            o.zIndex = e.node.zIndex - 1;
                            e.node.parent.addChild(o);
                            o.runAction(cc.sequence(cc.moveTo(t, cc.v2(e.m_nodeX, o.y - e.m_flyy - 20)), cc.callFunc(function (t) {
                                if (t && t.active) {
                                    t.stopAllActions();
                                    t.removeFromParent();
                                    t.destroy();
                                }
                            })));
                            e.m_bulletNum--;
                            e.m_bulletIndex++;
                        }
                    });
                };
                e.prototype.setLamplight = function () {
                    c.default.gameManager.setLayer_Ex();
                    var t = this.aiData.special.split("|");
                    this.m_lampAry = [];
                    var e = new cc.Node(), o = new cc.Node(), i = new cc.Node(), n = i.addComponent(cc.Sprite);
                    r.default.setSpriteFrame(n, "gk/d3/dg_02");
                    i.x = 1004 == this.aiType ? this.node.x : this.node.x + 50;
                    i.y = 1004 == this.aiType ? this.node.y - 30 : this.node.y - 200;
                    i.opacity = 125;
                    i.scale = .6;
                    i.active = !1;
                    i.zIndex = t[0] || 0;
                    this.node.parent.addChild(i);
                    this.m_lampAry.push(i);
                    var a = e.addComponent(cc.Sprite);
                    r.default.setSpriteFrame(a, "gk/d3/dg_02");
                    e.active = !1;
                    e.x = 1004 == this.aiType ? this.node.x : this.node.x + 170;
                    e.y = 1004 == this.aiType ? this.node.y - 70 : this.node.y - 340;
                    e.scale = .95;
                    e.zIndex = t[1] || this.node.zIndex + 1;
                    this.node.parent.addChild(e);
                    this.m_lampAry.push(e);
                    var l = o.addComponent(cc.Sprite);
                    r.default.setSpriteFrame(l, "gk/d3/dg_01");
                    o.x = 1004 == this.aiType ? this.node.x : this.node.x + 220;
                    o.y = 1004 == this.aiType ? this.node.y - 220 : this.node.y - 540;
                    var h = l.addComponent(cc.RigidBody);
                    h.type = cc.RigidBodyType.Dynamic;
                    h.gravityScale = 0;
                    var d = l.addComponent(cc.PhysicsBoxCollider);
                    d.sensor = !0;
                    d.tag = s.default.CO_DEATH;
                    d.size = new cc.Size(300, 60);
                    d.apply();
                    o.active = !1;
                    o.zIndex = t[2] || 0;
                    this.node.parent.addChild(o);
                    this.m_lampAry.push(o);
                    var p = new cc.Node(), u = p.addComponent(cc.Sprite);
                    r.default.setSpriteFrame(u, "gk/d3/dg_03");
                    p.active = !1;
                    p.x = this.node.x + 180;
                    p.y = 1004 == this.aiType ? this.node.y + 40 : this.node.y - 200;
                    c.default.gameManager.layer_ex.addChild(p);
                    this.m_lampAry.push(p);
                    var m = new cc.Node(), _ = m.addComponent(cc.Sprite);
                    r.default.setSpriteFrame(_, "gk/d3/dg_03");
                    m.active = !1;
                    m.x = this.node.x - 250;
                    m.y = 1004 == this.aiType ? this.node.y + 40 : this.node.y - 200;
                    m.scaleX = -1;
                    c.default.gameManager.layer_ex.addChild(m);
                    this.m_lampAry.push(m);
                    var f = new cc.Node(), g = f.addComponent(cc.Sprite);
                    r.default.setSpriteFrame(g, "gk/d3/dg_role");
                    f.zIndex = this.node.zIndex + 1;
                    f.x = this.node.x + 15;
                    f.y = this.node.y + 30;
                    f.scale = .7;
                    this.node.parent.addChild(f);
                    this.m_lampAry.push(f);
                    if (this.m_reverse) {
                        this.m_lampAry[5].x = this.node.x - 20;
                        this.m_lampAry[5].y = this.node.y + 45;
                        this.moveSoldierReverse();
                    } else this.moveSoldier();
                    this.m_lampAry[5].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.8, .7), cc.delayTime(.25), cc.scaleTo(.8, .6))));
                };
                e.prototype.moveSoldier = function () {
                    var t = this;
                    this.node_ts.playAni(s.default.aniConf.dz24, -1);
                    this.targetX = this.targetX == this.aiData.xmin ? this.aiData.xmax : this.aiData.xmin;
                    this.targetX = this.targetX ? this.targetX : this.node.x;
                    var e = this.speed_walk ? Math.abs(this.node.x - this.targetX) / this.speed_walk : Number(this.m_spceTime);
                    this.node.runAction(cc.sequence(cc.delayTime(this.m_standbyTime), cc.callFunc(function () {
                        if (t.speed_walk) t.isRight = t.targetX >= t.node.x; else {
                            t.node_ts.playAni(s.default.aniConf.dz24, -1);
                            t.isRight = !t.isRight;
                        }
                        if (t.isRight) {
                            t.m_lampAry[5].x = t.node.x + 15;
                            t.m_lampAry[5].y = t.node.y + 45;
                            t.m_lampAry[5].zIndex = t.node.zIndex + 1;
                            t.m_lampAry[3].active = !1;
                            t.m_lampAry[4].active = !1;
                            t.speed_walk && (t.node_ani.scaleX = t.isRight ? Math.abs(t.node_ani.scaleX) : -Math.abs(t.node_ani.scaleX));
                            t.node_ts.node_mount.color = cc.color(255, 255, 255);
                            t.m_lampAry[0].x = 1004 == t.aiType ? t.node.x : t.node.x + 60;
                            t.m_lampAry[0].y = 1004 == t.aiType ? t.node.y - 30 : t.node.y - 200;
                            t.getLampState(0) || (t.m_lampAry[0].active = !0);
                            t.getLampState(1) || (t.m_lampAry[1].active = !0);
                            t.m_lampAry[1].x = 1004 == t.aiType ? t.node.x : t.node.x + 170;
                            t.m_lampAry[1].y = 1004 == t.aiType ? t.node.y - 70 : t.node.y - 340;
                            t.m_lampAry[2].x = 1004 == t.aiType ? t.node.x : t.node.x + 220;
                            t.m_lampAry[2].y = 1004 == t.aiType ? t.node.y - 290 : t.node.y - 540;
                            t.getLampState(2) || (t.m_lampAry[2].active = !0);
                            t.aiData.xmin || t.aiData.xmax ? t.m_lampAry[0].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                t.speed_walk && t.node_ts.playAni(s.default.aniConf.dz33, -1);
                                t.m_lampAry[1].runAction(cc.moveTo(e, cc.v2(t.targetX + 320, t.m_lampAry[1].y)));
                                t.m_lampAry[2].runAction(cc.moveTo(e, cc.v2(t.targetX + 360, t.m_lampAry[2].y)));
                                t.m_lampAry[5].runAction(cc.moveTo(e, cc.v2(t.targetX + 15, t.m_lampAry[5].y)));
                            }), cc.moveTo(e, cc.v2(t.targetX + 130, t.m_lampAry[0].y)))) : t.m_lampAry[0].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                t.speed_walk && t.node_ts.playAni(s.default.aniConf.dz33, -1);
                            })));
                        } else {
                            t.m_lampAry[5].x = t.node.x + 20;
                            t.m_lampAry[5].y = t.node.y + 45;
                            t.m_lampAry[5].zIndex = t.node.zIndex - 1;
                            t.m_lampAry[0].active = !1;
                            t.m_lampAry[1].active = !1;
                            t.m_lampAry[2].active = !1;
                            t.node_ts.node_mount.color = cc.color(0, 0, 0);
                            t.m_lampAry[3].x = t.node.x + 180;
                            t.m_lampAry[3].y = 1004 == t.aiType ? t.node.y + 40 : t.node.y - 160;
                            t.getLampState(3) || (t.m_lampAry[3].active = !0);
                            t.aiData.xmin || t.aiData.xmax ? t.m_lampAry[3].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                if (t.speed_walk) {
                                    t.node_ani.scaleX = t.isRight ? Math.abs(t.node_ani.scaleX) : -Math.abs(t.node_ani.scaleX);
                                    t.node_ts.playAni(s.default.aniConf.dz33, -1);
                                }
                                t.m_lampAry[5].x = t.node.x - 20;
                                t.m_lampAry[3].active = !1;
                                t.m_lampAry[4].x = t.node.x - 180;
                                t.m_lampAry[4].y = t.node.y + 40;
                                t.getLampState(4) || (t.m_lampAry[4].active = !0);
                                t.m_lampAry[4].runAction(cc.moveTo(e, cc.v2(t.targetX - 180, t.m_lampAry[3].y)));
                                t.m_lampAry[5].runAction(cc.moveTo(e, cc.v2(t.targetX - 20, t.m_lampAry[5].y)));
                            }))) : t.m_lampAry[3].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                if (t.speed_walk) {
                                    t.node_ani.scaleX = t.isRight ? Math.abs(t.node_ani.scaleX) : -Math.abs(t.node_ani.scaleX);
                                    t.node_ts.playAni(s.default.aniConf.dz33, -1);
                                }
                                t.m_lampAry[5].x = t.node.x - 20;
                                t.m_lampAry[3].active = !1;
                                t.m_lampAry[4].x = t.node.x - 180;
                                t.m_lampAry[4].y = 1004 == t.aiType ? t.node.y + 40 : t.node.y - 160;
                                t.getLampState(4) || (t.m_lampAry[4].active = !0);
                            })));
                        }
                    }), cc.delayTime(.5), cc.moveTo(e, cc.v2(this.targetX, this.node.y)), cc.callFunc(function () {
                        t.moveSoldier();
                    })));
                };
                e.prototype.moveSoldierReverse = function () {
                    var t = this;
                    this.node_ts.playAni(s.default.aniConf.dz24, -1);
                    this.targetX = this.targetX == this.aiData.xmin ? this.aiData.xmax : this.aiData.xmin;
                    this.targetX = this.targetX ? this.targetX : this.node.x;
                    var e = this.speed_walk ? Math.abs(this.node.x - this.targetX) / this.speed_walk : Number(this.m_spceTime);
                    this.node.runAction(cc.sequence(cc.delayTime(this.m_standbyTime), cc.callFunc(function () {
                        if (t.speed_walk) t.isRight = t.targetX <= t.node.x; else {
                            t.node_ts.playAni(s.default.aniConf.dz24, -1);
                            t.isRight = !t.isRight;
                        }
                        if (t.isRight) {
                            t.m_lampAry[5].x = t.node.x - 20;
                            t.m_lampAry[5].y = t.node.y + 45;
                            t.m_lampAry[5].zIndex = t.node.zIndex + 1;
                            t.m_lampAry[3].active = !1;
                            t.m_lampAry[4].active = !1;
                            t.speed_walk && (t.node_ani.scaleX = t.isRight ? -Math.abs(t.node_ani.scaleX) : Math.abs(t.node_ani.scaleX));
                            t.node_ts.node_mount.color = cc.color(255, 255, 255);
                            t.m_lampAry[0].x = t.node.x;
                            t.m_lampAry[0].y = t.node.y - 40;
                            t.getLampState(0) || (t.m_lampAry[0].active = !0);
                            t.getLampState(1) || (t.m_lampAry[1].active = !0);
                            t.m_lampAry[1].x = t.node.x;
                            t.m_lampAry[1].y = t.node.y - 92;
                            t.m_lampAry[2].x = t.node.x;
                            t.m_lampAry[2].y = t.node.y - 290;
                            t.getLampState(2) || (t.m_lampAry[2].active = !0);
                            t.aiData.xmin || t.aiData.xmax ? t.m_lampAry[0].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                t.speed_walk && t.node_ts.playAni(s.default.aniConf.dz33, -1);
                                t.m_lampAry[1].runAction(cc.moveTo(e, cc.v2(t.targetX - 320, t.m_lampAry[1].y)));
                                t.m_lampAry[2].runAction(cc.moveTo(e, cc.v2(t.targetX - 360, t.m_lampAry[2].y)));
                                t.m_lampAry[5].runAction(cc.moveTo(e, cc.v2(t.targetX - 15, t.m_lampAry[5].y)));
                            }), cc.moveTo(e, cc.v2(t.targetX - 130, t.m_lampAry[0].y)))) : t.m_lampAry[0].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                t.speed_walk && t.node_ts.playAni(s.default.aniConf.dz33, -1);
                            })));
                        } else {
                            t.m_lampAry[5].x = t.node.x + 20;
                            t.m_lampAry[5].y = t.node.y + 45;
                            t.m_lampAry[5].zIndex = t.node.zIndex - 1;
                            t.m_lampAry[0].active = !1;
                            t.m_lampAry[1].active = !1;
                            t.m_lampAry[2].active = !1;
                            t.node_ts.node_mount.color = cc.color(0, 0, 0);
                            t.m_lampAry[3].x = t.node.x - 180;
                            t.m_lampAry[3].y = t.node.y + 40;
                            t.m_lampAry[3].scaleX = -1;
                            t.getLampState(3) || (t.m_lampAry[3].active = !0);
                            t.aiData.xmin || t.aiData.xmax ? t.m_lampAry[3].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                if (t.speed_walk) {
                                    t.node_ani.scaleX = t.isRight ? -Math.abs(t.node_ani.scaleX) : Math.abs(t.node_ani.scaleX);
                                    t.node_ts.playAni(s.default.aniConf.dz33, -1);
                                }
                                t.m_lampAry[3].active = !1;
                                t.m_lampAry[4].x = t.node.x + 180;
                                t.m_lampAry[4].y = t.node.y + 80;
                                t.m_lampAry[4].scaleX = 1;
                                t.getLampState(4) || (t.m_lampAry[4].active = !0);
                                t.m_lampAry[4].runAction(cc.moveTo(e, cc.v2(t.targetX + 180, t.m_lampAry[4].y)));
                                t.m_lampAry[5].runAction(cc.moveTo(e, cc.v2(t.targetX + 20, t.m_lampAry[5].y)));
                            }))) : t.m_lampAry[3].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                if (t.speed_walk) {
                                    t.node_ani.scaleX = t.isRight ? -Math.abs(t.node_ani.scaleX) : Math.abs(t.node_ani.scaleX);
                                    t.node_ts.playAni(s.default.aniConf.dz33, -1);
                                }
                                t.m_lampAry[3].active = !1;
                                t.m_lampAry[4].x = t.node.x + 180;
                                t.m_lampAry[4].y = t.node.y + 80;
                                t.m_lampAry[4].scaleX = 1;
                                t.getLampState(4) || (t.m_lampAry[4].active = !0);
                            })));
                        }
                    }), cc.delayTime(.5), cc.moveTo(e, cc.v2(this.targetX, this.node.y)), cc.callFunc(function () {
                        t.moveSoldierReverse();
                    })));
                };
                e.prototype.getLampState = function (t) {
                    if (!this.aiData.lamp || "" == this.aiData.lamp) return !1;
                    this.m_lampObj || (this.m_lampObj = this.aiData.lamp.split("|"));
                    for (var e in this.m_lampObj) if (t == this.m_lampObj[e] && 0 != t) return !0;
                    return !1;
                };
                e.prototype.onDestroy = function () {
                    this.unscheduleAllCallbacks();
                };
                return a([h], e);
            }(cc.Component));
        o.default = d;
        cc._RF.pop();
    }, {
        "../common/GameData": "GameData",
        "../common/ToolsManager": "ToolsManager",
        "../gameEvent": "gameEvent"
    }],
    explodeBox: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "7607aqYzo1PWZYEgqYY+E3+", "explodeBox");
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
        var s = t("./DragonBonesManager"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.m_path = "effect/baoza1";
                e.node_mount = null;
                return e;
            }
            e.prototype.start = function () {
                this.node.addComponent(s.default);
                this.m_dragonBones = this.node.getComponent(s.default);
                this.m_dragonBones.initData(this.node_mount, "daiji", this.m_path, this.aniComplete.bind(this), 1);
            };
            e.prototype.aniComplete = function () { };
            e.prototype.initData = function (t, e, o) {
                void 0 === t && (t = null);
                void 0 === e && (e = {
                    width: 160,
                    height: 260
                });
                void 0 === o && (o = "effect/baoza1");
                this.m_callBack = t;
                this.m_path = o;
                var i = this.node.getComponent(cc.PhysicsBoxCollider);
                this.m_width = i.size.width = e.width;
                this.m_height = i.size.height = e.height;
                i.apply();
            };
            e.prototype.onBeginContact = function (t, e, o) {
                o.tag && this.m_callBack && this.m_callBack();
            };
            e.prototype.clear = function (t) {
                var e = this;
                void 0 === t && (t = null);
                this.scheduleOnce(function () {
                    t && t();
                    e.node.removeFromParent();
                    e.node.destroy();
                }, .5);
            };
            e.prototype.onDestroy = function () {
                this.unscheduleAllCallbacks();
            };
            a([l(cc.Node)], e.prototype, "node_mount", void 0);
            return a([c], e);
        }(cc.Component);
        o.default = h;
        cc._RF.pop();
    }, {
        "./DragonBonesManager": "DragonBonesManager"
    }],
    externalGame: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "3c87crXmgFInpNEgSblhOuE", "externalGame");
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = function () {
            function t() { }
            t.melogin = function () {
                console.log("===========登录========");
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "melogin:", "") : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "melogin", "()V");
            };
            t.prototype.staticstartlevel = function (t) {
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "startlevel:", t) : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startlevel", "()V");
            };
            t.finishlevel = function (t) {
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "finishlevel:", t) : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "finishlevel", "()V");
            };
            t.faillevel = function (t) {
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "faillevel:", t) : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "faillevel", "()V");
            };
            t.setevent = function (t, e) {
                void 0 === e && (e = null);
                e = e || {};
                console.log("=2=上传事件内容==" + JSON.stringify(e));
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "setevent:", JSON.stringify(e)) : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setevent", "(Ljava/lang/String;)V", JSON.stringify(e));
            };
            t.gotouser = function () {
                if (cc.sys.os == cc.sys.OS_IOS) {
                    var t = {
                        server_id: "LoginProxy.serverId",
                        game_role_id: "playerVo.uid",
                        server_name: "LoginProxy.server.name",
                        game_role_name: "playerVo.name",
                        game_role_lv: "playerVo.level"
                    };
                    console.log("==角色信息==" + JSON.stringify(t));
                    jsb.reflection.callStaticMethod("AppController", "gotouser:", JSON.stringify(t));
                } else cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "gotouser", "()V");
            };
            t.exitgame = function () {
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "exitgame:", "") : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "exitgame", "()V");
            };
            t.init = function () {
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "IAP_SDKInit:", "1") : (cc.sys.os,
                    cc.sys.OS_ANDROID);
            };
            t.testBuy = function () {
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "IAP_testbuy:", "1") : (cc.sys.os,
                    cc.sys.OS_ANDROID);
            };
            t.upuser = function () {
                if (!this.goGame) {
                    this.gotouser();
                    this.goGame = !0;
                }
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "uplv:", "playerVo.level") : (cc.sys.os,
                    cc.sys.OS_ANDROID);
            };
            t.nativeVideo = function (t, e, o) {
                var i = this;
                void 0 === o && (o = 1);
                if (!t || "" == t) return console.log("error 视频参数错误");
                this.m_jumpBack = e;
                if (!cc.sys.isNative && this.m_jumpBack) {
                    setTimeout(function () {
                        i.m_jumpBack();
                    }, 200);
                    return console.log("非移动端暂时不播视频");
                }
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "nativeVideo:", t, o) : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "nativeVideo", "(Ljava/lang/String;Ljava/lang/String;)V", t, o);
            };
            t.jumpCallBack = function () {
                console.log("jumpCallBack");
                this.m_jumpBack && this.m_jumpBack();
            };
            return t;
        }();
        o.default = i;
        cc.externalGame = i;
        cc._RF.pop();
    }, {}],
    fontFloating: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "212727+KdpBc725E8ahaEvv", "fontFloating");
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
        var s = t("../common/PopupView"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.ms_label = null;
                return e;
            }
            e.prototype.onLoad = function () { };
            e.prototype.initData = function (t) {
                this.m_data = t;
            };
            e.prototype.start = function () {
                this.ms_label.string = this.m_data[0];
            };
            a([l(cc.RichText)], e.prototype, "ms_label", void 0);
            return a([c], e);
        }(s.default);
        o.default = h;
        cc._RF.pop();
    }, {
        "../common/PopupView": "PopupView"
    }],
    gameEvent: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "9505dKS6RZGFaRojyfXD/10", "gameEvent");
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
        var s = t("./common/ConfManager"), r = t("./common/GameData"), c = t("./common/SoundManage"), l = t("./common/ViewManager"), h = t("./item/itemDrop"), d = t("./item/loopDrop"), p = t("./item/timingEvent"), u = cc._decorator, m = u.ccclass, _ = (u.property,
            function (t) {
                n(e, t);
                function e() {
                    return null !== t && t.apply(this, arguments) || this;
                }
                o = e;
                e.prototype.start = function () { };
                e.initGameEvent = function (t, e) {
                    this.gameManager = t;
                    this.hero = e;
                    this.hero && (this.hero_ts = this.hero.getComponent("role_1"));
                };
                e.remindHero = function () {
                    this.hero_ts.remind();
                };
                e.recoveryOp = function (t) {
                    void 0 === t && (t = !1);
                    (this.gameManager.interact == r.default.OP_ATT || t) && this.gameManager.setInteract(0);
                };
                e.deathEvent = function () {
                    console.log("----------- boom");
                    this.gameManager.changeForceWait(!0);
                    this.gameManager.operateDir = 0;
                    c.default.playSound("kaiqiang.mp3");
                    this.hero_ts.setDeath();
                };
                e.addStack = function (t) {
                    for (var e in this.itemStack) if (this.itemStack[e] == t) return;
                    var o = t.getComponent("itemBox").getOpType();
                    if (o && this.hero_ts.heroState != r.default.STATE_DRAG) {
                        this.itemStack.push(t);
                        this.cItem = t;
                        this.gameManager.setInteract(o);
                    }
                };
                e.outStack = function (t) {
                    var e = !1;
                    for (var o in this.itemStack) if (this.itemStack[o] == t) {
                        this.itemStack.splice(Number(o), 1);
                        e = !0;
                        break;
                    }
                    if (this.itemStack.length <= 0) {
                        this.cItem = null;
                        e && this.hero_ts.heroState != r.default.STATE_DRAG && this.gameManager.setInteract(0);
                    } else {
                        var i = this.itemStack[this.itemStack.length - 1];
                        if (Math.abs(i.x - this.hero.x) > 300 || Math.abs(i.y - this.hero.y) > 300) this.outStack(i); else {
                            var n = i.getComponent("itemBox").getOpType();
                            if (n) {
                                this.cItem = i;
                                this.gameManager.setInteract(n);
                            } else {
                                this.cItem = null;
                                this.hero_ts.heroState != r.default.STATE_DRAG && this.gameManager.setInteract(0);
                            }
                        }
                    }
                };
                e.cleanStack = function () {
                    this.itemStack = [];
                };
                e.addBlockStack = function (t) {
                    for (var e = 0, o = this.blockStack; e < o.length; e++) if (o[e] == t) return;
                    this.blockStack.push(t);
                };
                e.outBlockStack = function (t) {
                    for (var e in this.blockStack) if (this.blockStack[e] == t) {
                        this.blockStack.splice(Number(e), 1);
                        return;
                    }
                };
                e.checkCollision = function (t) {
                    var e = this, o = t.tag;
                    if (o != r.default.CO_BOOM && o != r.default.CO_DEATH && o != r.default.CO_BULLET) {
                        var i = t.node;
                        if (o != r.default.CO_SHOWATT || "squat" == this.hero_ts.walkingMode) if (this.hero_ts.heroState != r.default.STATE_DRAG && this.hero_ts.heroState != r.default.STATE_LADDER && this.hero_ts.isEntity()) {
                            if (o != r.default.CO_NORMAL && 0 == t.sensor && this.hero_ts.heroState != r.default.STATE_DRAG && i.y > this.hero.y) {
                                this.blockItem = i;
                                this.gameManager.operateDir = 0;
                                this.hero_ts.initAllState();
                                this.hero_ts.setStopDir(i.x > this.hero.x);
                            }
                            if (o == r.default.CO_ITEM) {
                                this.addStack(i);
                                this.triggerEvent(i, 1, 0, !0);
                                var n = i.getComponent("itemBox"), a = n.itemConf.guide;
                                if (a && !n.lock) {
                                    var s = a.split("|"), c = Number(s[0]);
                                    c > 1e3 && c <= 2e3 ? null != n.getEvent() && n.showTopImg(c - 1e3, -1) : c > 2e3 && n.showSpecialGuide(c);
                                }
                                if (0 == t.sensor && n.isClimb && i.y < this.hero.y) {
                                    if (this.isDoor) this.isDoor = !1; else if (this.dropY && this.dropY - this.hero.y > 30) {
                                        this.gameManager.gameOperate = !0;
                                        this.hero_ts.squatAct(function () {
                                            e.gameManager.gameOperate = !1;
                                        });
                                    }
                                    this.isGround = !0;
                                    this.gameManager.setSpecialMode(0);
                                    this.hero_ts.setStopDir(null);
                                }
                            } else if (o > 1e4) {
                                var l = r.default.groundConf[o];
                                l && this.hero_ts.switchGround(l);
                            } else if (o == r.default.CO_NORMAL) {
                                if (this.isDoor) this.isDoor = !1; else if (this.dropY && this.dropY - this.hero.y > 30) {
                                    this.gameManager.gameOperate = !0;
                                    this.hero_ts.squatAct(function () {
                                        e.gameManager.gameOperate = !1;
                                    });
                                }
                                this.isGround = !0;
                            }
                        } else o == r.default.CO_ITEM && this.triggerEvent(i, 1); else {
                            console.log("---------- CO_SHOWATT !!");
                            this.gameManager.setInteract(r.default.OP_ATT);
                        }
                    } else this.deathEvent(o);
                };
                e.leaveCollision = function (t) {
                    if (t.tag != r.default.CO_SHOWATT) {
                        var e = t.node, o = e.getComponent("itemBox");
                        if (t.tag == r.default.CO_ITEM) {
                            o.setBubble(!1, 0, !0);
                            this.checkLeave(e);
                        }
                        if (this.hero_ts.heroState != r.default.STATE_DRAG && this.hero_ts.heroState != r.default.STATE_LADDER && this.hero_ts.isEntity()) {
                            if (this.blockItem == e) {
                                this.hero_ts.setStopDir(null);
                                this.blockItem = null;
                            }
                            if (t.tag == r.default.CO_ITEM) {
                                o.setBubble(!1, 0, !0);
                                e.getComponent("itemBox").hideTopGuide();
                                this.cItem != e || this.cItem.discardIdx || this.cItem.getComponent("itemBox").stopBlink();
                                var i = e.getComponent("itemBox");
                                if (0 == t.sensor && i.isClimb && e.y < this.hero.y) {
                                    this.isGround = !1;
                                    this.dropY = this.hero.y;
                                }
                            } else if (t.tag == r.default.CO_NORMAL) {
                                this.isGround = !1;
                                this.dropY = this.hero.y;
                            }
                            this.blockStack.length <= 0 && (this.gameManager.dropCount = 20);
                        }
                    } else {
                        console.log("---------- leave CO_SHOWATT !!");
                        this.gameManager.setInteract(0);
                    }
                };
                e.checkLeave = function (t) {
                    var e = t.getComponent("itemBox").findEvent(null, "45");
                    e && this.triggerEvent(t, 0, e.index);
                };
                e.checkDrop = function () { };
                e.setItemboxTips = function () {
                    if (this.cItem && this.cItem.active) {
                        var t = this.cItem.getComponent("itemBox"), e = this.hero_ts.goods ? 0 : 1;
                        e ? t.blinkAct(e) : t.stopBlink();
                    }
                };
                e.analysisEvent = function (t, e) {
                    var o = this;
                    void 0 === e && (e = 4);
                    if (t == r.default.OP_ATT) {
                        this.hero_ts.stopMove();
                        this.gameManager.gameOperate = !0;
                        this.hero_ts.attAct(4 == e ? this.hero.x + 100 : this.hero.x - 100, function () {
                            o.gameManager.gameOperate = !1;
                        });
                    }
                    null != this.cItem && this.triggerEvent(this.cItem, t);
                };
                e.setExpression = function (t, e) {
                    var i;
                    switch (t) {
                        case 1:
                            i = r.default.processConf[e].hintcont;
                            this.hero_ts.setRoleTips(!0, "img", i, {
                                num: 0,
                                times: 0,
                                interval: 0,
                                pos: "56|340"
                            });
                            break;

                        case 3:
                            i = r.default.processConf[e].hintcont;
                            this.hero_ts.setRoleTips(!0, "ani", i, {
                                num: 0,
                                times: 0,
                                interval: 0,
                                pos: "56|340"
                            });
                            break;

                        case 2:
                            var n = r.default.plotConf[r.default.processConf[e].hintcont] || {
                                txt: r.default.processConf[e].hintcont
                            };
                            this.hero_ts.setRoleTips(!0, "label", n, {
                                num: 0,
                                times: 0,
                                interval: 0,
                                pos: "56|340"
                            });
                            this.gameManager.delayHold(2, function () {
                                o.hero_ts.setRoleTips(!1);
                            });
                    }
                };
                e.checkTrigger = function (t, e, o, i) {
                    void 0 === o && (o = null);
                    void 0 === i && (i = null);
                    for (var n = 0, a = t; n < a.length; n++) {
                        var s = a[n], c = Number(s), l = !0;
                        if (0 == e) return l;
                        if (1 == c) {
                            if (1 == e) return 1e3;
                        } else if (c > 1 && 1 == e && c != e) return 1;
                        if (c == e) {
                            if (o) {
                                l = !1;
                                if (o.includes("state")) {
                                    var h = o.replace("state", "");
                                    l = Number(h) == this.hero_ts.heroState;
                                } else if (o.includes("prop")) {
                                    var d = this.hero_ts.goods;
                                    d && (l = o == d.nameid) && 3 != d.isthrow && "keepgoods" != i && this.hero_ts.setGoods(null);
                                } else "left" == o ? l = !this.hero_ts.heroDir : "right" == o && (l = this.hero_ts.heroDir);
                                l || (r.default.processConf[o] ? this.setExpression(r.default.processConf[o].hintmode, o) : console.log("---------------- 配置表找不到提示数据 " + o));
                                l || null == i || "" == i || "keepgoods" == i || this.checkNext(i, 1);
                            }
                            return l;
                        }
                    }
                    return 0;
                };
                e.triggerEvent = function (t, e, o, i) {
                    var n = this;
                    void 0 === o && (o = 0);
                    void 0 === i && (i = !1);
                    var a = t.getComponent("itemBox");
                    if (!a) return console.log("===itemBox=没有脚本");
                    var s = a.getConf();
                    if (1 != a.lock) {
                        if (1 == s.isDrag && this.hero.y < a.getColliderCenter().y && a.isEntity()) {
                            this.cItem = t;
                            a.setBubble(!0, r.default.OP_DRAG);
                            if (e == r.default.OP_DRAG) {
                                this.hero_ts.initMoveData();
                                this.hero_ts.heroState == r.default.STATE_DRAG ? this.hero_ts.switchState(r.default.STATE_DRAG, !0) : this.hero_ts.setDragItem(t);
                                return;
                            }
                        }
                        if (1 == s.isClimb && this.hero.y < a.getColliderCenter().y && a.isEntity()) {
                            console.log("------------ 可攀爬");
                            this.itemStack.push(t);
                            this.cItem = t;
                            this.gameManager.setInteract(r.default.OP_CLIMB);
                            if (e == r.default.OP_CLIMB) {
                                this.gameManager.setInteract(0);
                                this.gameManager.gameOperate = !0;
                                this.gameManager.operateDir = 0;
                                this.hero_ts.stopMove();
                                this.hero_ts.climbAct({
                                    x: t.x,
                                    y: a.getColliderTop()
                                }, function () {
                                    n.gameManager.gameOperate = !1;
                                });
                                this.blockStack = [];
                                return;
                            }
                        }
                        var u = a.getEvent(o);
                        if (null != u) {
                            console.log("----------- eventData ", u);
                            var m = u.key, _ = r.default.eventConf[m];
                            if (_) {
                                u.param;
                                var f, g, y = u.specialParam;
                                if (null != this.interactNode && this.interactNode != t) {
                                    g = u.op.split("|");
                                    f = this.checkTrigger(g, e, null);
                                } else this.interactNode == t && (this.interactNode = null);
                                if (f) this.triggerEvent(this.interactNode, 0); else {
                                    g = u.trigger.split("|");
                                    38 == u.key && (w = t.getComponent(p.default)) && w.isTiming && (f = !0);
                                    f || (f = this.checkTrigger(g, e, u.limit, u.limitTigger));
                                    8 == u.key && (t.y > this.hero.y ? a.setPaoPos(null, this.hero.y - t.y + 300) : a.setPaoPos(null, a.getColliderTop(!0) + 30));
                                    if (f) {
                                        var v = a.itemConf.guide;
                                        v && a.setGuideAction(Number(v));
                                        if (i && f < 1e3) {
                                            a.setBubble(!0, g[0]);
                                            return;
                                        }
                                        1e3 == f && a.setBubble(!1);
                                        e > 1 && this.hero_ts.initAllState();
                                        var b = Number(_.result), C = u.param, x = Number(u.last);
                                        if ("initPos" == s.key) {
                                            this.triggerRoleEvent(b, u);
                                            return;
                                        }
                                        a.hideTopGuide();
                                        switch (b) {
                                            case 0:
                                                this.checkNext(C, 1);
                                                break;

                                            case 1:
                                                this.gameManager.setBtnOpacity(0);
                                                this.gameManager.operateDir = 0;
                                                this.gameManager.changeForceWait(!0, u.isHoldDz);
                                                var O = u.next;
                                                this.gameManager.tempCloseUp();
                                                l.default.open("dialog/plotDialog", [C, function () {
                                                    O && "" != O && n.checkNext(O, 1);
                                                    n.gameManager.setBtnOpacity(255);
                                                    n.gameManager.tempCloseUp(!0);
                                                }]);
                                                0 == u.isLoop && a.switchEvent();
                                                return;

                                            case 2:
                                                if (this.gameManager.interact == r.default.OP_ATT) {
                                                    this.gameManager.gameOperate = !0;
                                                    this.hero_ts.attAct(t.x, function () {
                                                        n.gameManager.gameOperate = !1;
                                                    });
                                                }
                                                var D = C;
                                                D && "" != D ? a.playAni(D, Number(u.playTime)) : console.log("---- 动画配置表找不到 " + C + " 此动画");
                                                break;

                                            case 3:
                                                if (this.gameManager.interact == r.default.OP_ATT) {
                                                    this.gameManager.gameOperate = !0;
                                                    this.hero_ts.attAct(t.x, function () {
                                                        n.gameManager.gameOperate = !1;
                                                    });
                                                }
                                                return;

                                            case 4:
                                                this.pickEvent(C, a, u.isNoAct);
                                                break;

                                            case 6:
                                                if (this.hero_ts.heroState != r.default.STATE_OP) {
                                                    this.gameManager.gameOperate = !0;
                                                    this.hero_ts.alignPos({
                                                        x: t.x - this.hero.width / 2 + 20,
                                                        y: this.hero.y
                                                    }, function () {
                                                        n.hero_ts.interactAct();
                                                        n.interactNode = n.gameManager.getTriggerItem(C);
                                                        if (n.interactNode) {
                                                            n.gameManager.setInteract(r.default.OP_RAISE);
                                                            n.gameManager.gameOperate = !1;
                                                        } else {
                                                            console.log("---- 场景内找不到 " + C + " 为key的物件");
                                                            n.interactNode = null;
                                                        }
                                                    });
                                                } else {
                                                    this.hero_ts.interactAct();
                                                    this.gameManager.setInteract(r.default.OP_CONTROL);
                                                    this.interactNode = null;
                                                }
                                                return;

                                            case 7:
                                                var k = u.move, A = {};
                                                if (k.isOp) {
                                                    A.x = null != k.x ? Number(k.x) : 0;
                                                    A.y = null != k.y ? Number(k.y) : 0;
                                                } else {
                                                    (A = this.gameManager.changeEditorPos(k.x, k.y)).x = null != A.x ? A.x : t.x;
                                                    A.y = null != A.y ? A.y : t.y;
                                                }
                                                a.moveAct(A.x, A.y, "" != k.time ? Number(k.time) : 0, k.isOp, k.isUnFlip);
                                                (O = u.next) && "" != O && this.findNext(O);
                                                break;

                                            case 8:
                                                if (this.hero_ts.ladderState) return;
                                                this.gameManager.changeForceWait(!0);
                                                this.hero_ts.stopMove();
                                                var S = u.ladderRight, T = t.y > this.hero.y;
                                                this.hero_ts.alignPos({
                                                    x: S ? T ? t.x + 40 : t.x - 40 : T ? t.x - 40 : t.x + 40,
                                                    y: this.hero.y
                                                }, function () {
                                                    n.hero_ts.ladderAct(t.x, u.jumpRight, S, T, a.getColliderTop(), a.getColliderBottom());
                                                    n.hero_ts.setStopDir(null);
                                                    n.gameManager.changeForceWait(!1);
                                                });
                                                break;

                                            case 9:
                                                this.checkNext(C, 3, u);
                                                break;

                                            case 10:
                                                this.checkNext(C, 2, u);
                                                break;

                                            case 11:
                                                var N = u.camera;
                                                this.gameManager.cameraAct(N, x);
                                                break;

                                            case 12:
                                                this.checkNext(C, 4, u.flipDir);
                                                break;

                                            case 13:
                                                this.tempHeroLeft = u.dirLeft;
                                                this.gameManager.changeMap(C, u.door);
                                                a.setBubble(!1);
                                                break;

                                            case 14:
                                                if (this.gameManager.interact == r.default.OP_ATT) {
                                                    this.gameManager.gameOperate = !0;
                                                    this.hero_ts.attAct(t.x, function () {
                                                        n.gameManager.gameOperate = !1;
                                                    });
                                                } else this.gameManager.interact == r.default.OP_OPEN && this.hero_ts.setDir(t.x > this.hero.x);
                                                a.spriteByState(C);
                                                break;

                                            case 15:
                                                a.setEntity(u.openKnock);
                                                break;

                                            case 16:
                                                this.gameManager.chapterOver(C);
                                                break;

                                            case 17:
                                                this.hero_ts.walkingMode;
                                                this.hero_ts.setWalkingMode(C);
                                                break;

                                            case 18:
                                                this.addCrossEvent({
                                                    cross: Number(u.cross),
                                                    param: C
                                                });
                                                break;

                                            case 19:
                                                this.gameManager.operateDir = 0;
                                                this.gameManager.gameOperate = !0;
                                                O = u.next;
                                                l.default.open("dialog/unlockDialog", [C, function () {
                                                    console.log("==密码匹配成功==");
                                                    a.switchEvent();
                                                    O && "" != O && n.checkNext(O, 1);
                                                }, function () {
                                                    n.gameManager.gameOperate = !1;
                                                }]);
                                                return;

                                            case 20:
                                                a.showTopImg(C, Number(u.playTime));
                                                break;

                                            case 21:
                                                0 == u.isLoop && a.switchEvent();
                                                this.hero_ts.setInitDir(u.dirLeft);
                                                this.gameManager.saveItemConf({
                                                    x: t.x,
                                                    y: t.y
                                                }, this.hero_ts.walkingMode);
                                                this.gameManager.showSave();
                                                break;

                                            case 22:
                                                break;

                                            case 23:
                                                this.gameManager.changeForceWait(!u.relieveWait);
                                                break;

                                            case 24:
                                                this.gameManager.operateDir = 0;
                                                this.gameManager.changeForceWait(!0);
                                                l.default.open("dialog/checkDialog", [C, function () {
                                                    n.gameManager.gameOperate = !1;
                                                }]);
                                                break;

                                            case 25:
                                                var w;
                                                (w = t.addComponent(d.default)).initData(C, u.drop);
                                                break;

                                            case 26:
                                                a.addDragonBones(C);
                                                break;

                                            case 27:
                                                var P = u.camera_part;
                                                if (P._active) {
                                                    this.gameManager.setCamera_part();
                                                    this.gameManager.texture_sp.node.parent.parent.active = !0;
                                                    this.gameManager.camera_part.x = P.x.toFixed(2);
                                                    this.gameManager.camera_part.y = P.y.toFixed(2);
                                                    this.gameManager.camera_part.getComponent(cc.Camera).zoomRatio = Number(P.scale);
                                                } else this.gameManager.texture_sp.node.parent.parent.active = !1;
                                                break;

                                            case 28:
                                                var M = this.gameManager.getTriggerItem(C);
                                                this.hero_ts.setCarrier(M, y);
                                                break;

                                            case 29:
                                                O = u.next;
                                                var E = u.isLoop, R = u.alignLeft, B = 0;
                                                C && "" != C && (B = Number(C));
                                                this.gameManager.changeForceWait(!0);
                                                this.hero_ts.alignPos({
                                                    x: t.x + B,
                                                    y: this.hero.y
                                                }, function () {
                                                    n.hero_ts.setDir(!R);
                                                    0 == E && a.switchEvent();
                                                    O && "" != O && n.checkNext(O, 1);
                                                }, null);
                                                return;

                                            case 30:
                                                var I = C;
                                                "" != I && null != I && a.setItemZIndex(Number(I));
                                                var j = u.att_scale;
                                                "" != j && null != j && a.setItemScale(j);
                                                break;

                                            case 31:
                                                this.hero_ts.setSwitchHead(C);
                                                break;

                                            case 32:
                                                O = u.next;
                                                this.gameManager.changeForceWait(!0);
                                                l.default.open("dialog/cgDialog", [C, function () {
                                                    O && "" != O && n.checkNext(O, 1);
                                                }]);
                                                0 == u.isLoop && a.switchEvent();
                                                return;

                                            case 33:
                                                this.hero_ts.setLockDir(C);
                                                break;

                                            case 34:
                                                t.addComponent(h.default).initData(C, u.dropOne);
                                                break;

                                            case 35:
                                                r.default.storyData[Number(C)] = r.default.story[Number(C) - 1];
                                                r.default.onlinetm = new Date().getTime();
                                                break;

                                            case 36:
                                                var L = C, F = u.sound;
                                                if (F.stop) {
                                                    F.bgm ? c.default.stopBGM() : c.default.gameStopSound(L + ".mp3");
                                                    this.hero_ts.changeSound(L + ".mp3", [], !0);
                                                } else {
                                                    if (F.soundpos) {
                                                        var H = F.soundpos.split("|");
                                                        this.hero_ts.changeSound(L + ".mp3", H);
                                                    }
                                                    if (F.bgm) c.default.gamePlayBGM("gkbg/" + C); else {
                                                        var G = Number(F.time);
                                                        c.default.playSound(L + ".mp3", -1 == G || G > 0);
                                                        G > 0 && this.gameManager.delayHold(G, function () {
                                                            c.default.gameStopSound(L + ".mp3");
                                                        });
                                                    }
                                                }
                                                break;

                                            case 37:
                                                this.gameManager.removeItemData(s.index);
                                                s.index = Number(C);
                                                this.gameManager.addItemData(s.index, t);
                                                this.hero_ts.addFollow(s, t.y);
                                                a.followHero();
                                                break;

                                            case 38:
                                                var z = t.getComponent(p.default);
                                                z || (z = t.addComponent(p.default)).initData(C, a, u.timingFrame, u.timingDelay);
                                                var U = z.checkTiming();
                                                console.log("------------- te_ts r " + U);
                                                switch (U) {
                                                    case 0:
                                                        break;

                                                    case 1:
                                                    case 2:
                                                    case 3:
                                                        a.setPaoSprite(e);
                                                        this.timingResult(u.timing[U - 1], a);
                                                        return;
                                                }
                                                break;

                                            case 39:
                                                this.gameManager.setMasterOpacity(C, y);
                                                break;

                                            case 40:
                                                a.m_baseEventJs.m_next || "" == u.next || (a.m_baseEventJs.m_next = u.next);
                                                if (a.m_baseEventJs.m_analogyHp > 1) {
                                                    a.node_bubble.active = !1;
                                                    this.gameManager.delayHold(.6, function () {
                                                        a.node_bubble.active = !0;
                                                    });
                                                }
                                                a.m_baseEventJs.run();
                                                return;

                                            case 41:
                                                this.gameManager.gameOperate = !0;
                                                this.hero_ts.getWater(function () {
                                                    n.gameManager.gameOperate = !1;
                                                });
                                                break;

                                            case 42:
                                            case 43:
                                                if (0 == Number(C)) 42 == b ? this.hero_ts.setRoleTips(!1) : a.setBoxTips(!1); else {
                                                    var V = C.split("|");
                                                    42 == b ? this.hero_ts.setRoleTips(!0, V[0], r.default.plotConf[V[1]], u.bubble) : a.setBoxTips(!0, V[0], V[1], u.bubble);
                                                }
                                                break;

                                            case 44:
                                                this.gameManager.changeForceWait(!0);
                                                console.log("------------------- 拖拽物件 ");
                                                var X = this.gameManager.getTriggerItem(C), W = u.drag, q = (O = u.next, "" == W.dragX ? 0 : Number(W.dragX));
                                                q = W.dragRight ? q : -q;
                                                this.hero_ts.alignPos({
                                                    x: X.x + q,
                                                    y: this.hero.y
                                                }, function () {
                                                    n.hero_ts.dragAct(X, W, function () {
                                                        O && "" != O && n.checkNext(O, 1);
                                                    });
                                                }, null);
                                                0 == u.isLoop && a.switchEvent();
                                                return;

                                            case 45:
                                                this.checkNext(C, 1);
                                                break;

                                            case 46:
                                                this.gameManager.changeForceWait(!0);
                                                O = u.next;
                                                var Y = u.specialParam;
                                                l.default.open("dialog/answerDialog", [C, function (t) {
                                                    console.log("==答题结束==");
                                                    if (t) {
                                                        a.switchEvent();
                                                        O && "" != O && n.checkNext(O, 1);
                                                    } else Y && "" != Y && n.checkNext(Y, 1);
                                                }]);
                                                return;

                                            case 47:
                                                this.gameManager.changeForceWait(!0);
                                                var K = r.default.plotConf[C], J = u.next;
                                                l.default.open("dialog/blackDialog", [K || {}, function () {
                                                    0 == u.isLoop && a.switchEvent();
                                                    J && "" != J && n.checkNext(J, 1);
                                                }, u.time]);
                                                return;

                                            case 101:
                                                this.gameManager.specialEvent(101);
                                        }
                                        if (0 == u.isLoop) {
                                            a.switchEvent();
                                            e != r.default.OP_TRIGGER && e != r.default.OP_TOUCH && this.gameManager.setInteract(0);
                                        }
                                        if (x > 0) {
                                            u.isWait;
                                            this.gameManager.delayHold(x, function () {
                                                u.next && "" != u.next && n.checkNext(u.next, 1);
                                            });
                                        } else u.next && "" != u.next && this.checkNext(u.next, 1);
                                    }
                                }
                            }
                        }
                    }
                };
                e.pickEvent = function (t, e, o) {
                    var i = this;
                    void 0 === o && (o = !1);
                    if (t && "" != t) {
                        var n = r.default.goodsConf[t];
                        if (n) if (this.hero_ts.goods && 2 != n.isthrow) if (n.id == this.hero_ts.goods.id) this.hero_ts.setGoodsBlink(); else {
                            this.gameManager.gameOperate = !0;
                            this.gameManager.instatThrow();
                            3 == n.isthrow ? this.hero_ts.pickedUp(n, function () {
                                i.gameManager.gameOperate = !1;
                            }) : this.hero_ts.pickAct(n, function () {
                                i.gameManager.gameOperate = !1;
                            }, o);
                        } else {
                            this.gameManager.gameOperate = !0;
                            3 == n.isthrow ? this.hero_ts.pickedUp(n, function () {
                                i.gameManager.gameOperate = !1;
                            }) : this.hero_ts.pickAct(n, function () {
                                i.gameManager.gameOperate = !1;
                                if (2 == n.isthrow) {
                                    l.default.open("dialog/pickupDialog", [n]);
                                    if (!r.default.itemData[n.nameid]) {
                                        r.default.itemData[n.nameid] = n;
                                        r.default.onlinetm = new Date().getTime();
                                    }
                                    e.onclear();
                                    i.cItem = null;
                                }
                            }, o);
                        } else console.log("---- 物品配置表找不到 " + t + " 此物品");
                    } else this.hero_ts.setRoleGoods();
                };
                e.timingResult = function (t, e) {
                    t && "" != t && (-1 != t.indexOf("prop") ? this.pickEvent(t, e) : this.checkNext(t, 1));
                };
                e.findNext = function (t) {
                    var e = t.split("|"), o = this.gameManager.getTriggerItem(e[0]);
                    if (o) {
                        var i = o.getComponent("itemBox"), n = i.findEvent(Number(e[1]));
                        if (null != n) {
                            var a = r.default.eventConf[n.key];
                            switch (Number(a.result)) {
                                case 2:
                                    if (-1 == Number(n.playTime)) {
                                        var s = r.default.aniConf[n.param];
                                        s && i.setLastAni(s.name1);
                                    }
                                    break;

                                case 7:
                                    var c = n.move;
                                    if (!c.isOp) {
                                        var l = this.gameManager.changeEditorPos(c.x, c.y), h = null != l.x ? l.x : o.x, d = null != l.y ? l.y : o.y;
                                        i.setLastPos(h, d);
                                    }
                                    break;

                                case 12:
                                    i.setLastDir(n.flipDir);
                            }
                            n.next && "" != n.next && this.findNext(n.next);
                        }
                    }
                };
                e.addCrossEvent = function (t) {
                    this.crossEvent.push(t);
                    s.default.saveCrossData(this.crossEvent);
                };
                e.loadCrossEvent = function () {
                    this.crossEvent = s.default.getCorssData();
                    this.crossEvent || (this.crossEvent = []);
                };
                e.checkCrossEvent = function (t) {
                    if (this.crossEvent) for (var e = 0, o = this.crossEvent; e < o.length; e++) {
                        var i = o[e];
                        t == i.cross && this.checkNext(i.param, 1);
                    }
                };
                e.cleanCrossEvent = function () {
                    this.crossEvent = [];
                };
                e.checkNext = function (t, e, o) {
                    void 0 === o && (o = null);
                    if (t && "" != t && "number" != typeof t) {
                        var i = t.split("|"), n = this.gameManager.getTriggerItem(i[0]);
                        if (n) {
                            var a = n.getComponent("itemBox");
                            switch (e) {
                                case 1:
                                    this.triggerEvent(n, 0, i[1] ? i[1] : 0);
                                    break;

                                case 2:
                                    a.unLock(o.isHide, o.isHideButton);
                                    break;

                                case 3:
                                    if (!a.lock) if (i[1] || o.isDelGuide) {
                                        i[1] && a.delEvent(Number(i[1]));
                                        o.isDelGuide && a.cleanGuide();
                                    } else a.onclear();
                                    break;

                                case 4:
                                    a.flipAct(o);
                                    break;

                                case 5:
                                    a.blinkAct();
                            }
                        } else {
                            this.gameManager.gameOperate = !1;
                            console.log("---- 场景内找不到 " + i[0] + " 为key的物件");
                        }
                    } else {
                        null != this.interactNode && (this.interactNode = null);
                        console.log("==checkNext====");
                        this.gameManager.gameOperate = !1;
                    }
                };
                e.triggerRoleEvent = function (t, e) {
                    var o = this, i = e.param, n = Number(e.last);
                    n > 0 && e.isWait;
                    switch (t) {
                        case 1:
                            var a = r.default.plotConf[i];
                            a ? this.hero_ts.addDialog(a.txt) : console.log("---- 剧情配置表找不到 " + i + " 此对话");
                            break;

                        case 2:
                            var c = i;
                            if (c && "" != c) {
                                var l = Number(e.playTime);
                                this.hero_ts.m_state = null;
                                this.hero_ts.setPlay(c, 0 == l ? 1 : 0);
                            } else console.log("---- 动画配置表找不到 " + i + " 此动画");
                            break;

                        case 7:
                            var h = e.move, d = {};
                            if (h.isOp) {
                                d.x = null != h.x ? Number(h.x) : 0;
                                d.y = null != h.y ? Number(h.y) : 0;
                            } else {
                                (d = this.gameManager.changeEditorPos(h.x, h.y)).x = null != d.x ? d.x : this.hero.x;
                                d.y = null != d.y ? d.y : this.hero.y;
                            }
                            this.hero_ts.alignPos({
                                x: d.x,
                                y: d.y
                            }, function () { }, Number(h.time), null, h.isUnFlip);
                            break;

                        case 12:
                            var p = "right" == e.flipDir;
                            this.hero_ts.setDir(p);
                            break;

                        case 22:
                            this.hero_ts.setBrightness(Number(i));
                            break;

                        case 23:
                            this.gameManager.changeForceWait(!e.relieveWait);
                            break;

                        case 26:
                            this.hero_ts.addDragonBones(i);
                            s.default.saveHeroSpine(i);
                            break;

                        case 30:
                            var u = i;
                            "" != u && null != u && (this.hero.zIndex = Number(u));
                            var m = e.att_scale;
                            "" != m && null != m && this.hero_ts.setHeroScale(m);
                            break;

                        case 35:
                            r.default.storyData[Number(i)] = r.default.story[Number(i) - 1];
                            r.default.onlinetm = new Date().getTime();
                    }
                    n > 0 ? this.gameManager.delayHold(n, function () {
                        console.log("-------------- last call !!!!!!!!");
                        e.next && "" != e.next && o.checkNext(e.next, 1);
                    }) : e.next && "" != e.next && this.checkNext(e.next, 1);
                };
                e.removeItemBox = function (t) {
                    this.gameManager.removeItemData(t);
                };
                var o;
                e.isGround = !0;
                e.isDrop = !1;
                e.cItem = null;
                e.interactNode = null;
                e.lastTime = 0;
                e.lastCallBack = null;
                e.crossEvent = [];
                e.itemStack = [];
                e.blockStack = [];
                e.isDoor = !1;
                e.blockItem = null;
                e.tempHeroLeft = !1;
                return o = a([m], e);
            }(cc.Component));
        o.default = _;
        cc._RF.pop();
    }, {
        "./common/ConfManager": "ConfManager",
        "./common/GameData": "GameData",
        "./common/SoundManage": "SoundManage",
        "./common/ViewManager": "ViewManager",
        "./item/itemDrop": "itemDrop",
        "./item/loopDrop": "loopDrop",
        "./item/timingEvent": "timingEvent"
    }],
    gameScene: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "993c1l1CsxO54HdL96fGoTP", "gameScene");
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
        var s = t("./common/BaseView"), r = t("./common/ConfManager"), c = t("./common/GameData"), l = t("./common/SoundManage"), h = t("./common/ToolsManager"), d = t("./common/ViewManager"), p = t("./familiar/spineManager"), u = t("./gameEvent"), m = cc._decorator, _ = m.ccclass, f = m.property, g = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.camera_master = null;
                e.camera_ui = null;
                e.btn_up = null;
                e.btn_down = null;
                e.btn_left = null;
                e.btn_right = null;
                e.btn_throw = null;
                e.btn_pass = null;
                e.btn_tips = null;
                e.node_control = null;
                e.pan_control = null;
                e.btn_control = null;
                e.btn_light = null;
                e.node_dir = null;
                e.btn_user = null;
                e.btn_climb = null;
                e.img_user = null;
                e.img_special = null;
                e.layer_black = null;
                e.layer_dir = null;
                e.m_guideNode = null;
                e.node_save = null;
                e.guidetips_node = null;
                e.camera_part = null;
                e.texture_sp = null;
                e.itemBox = null;
                e.pan_goods = null;
                e.mask_goods = null;
                e.ani_node = null;
                e.DIR_UP = 1;
                e.DIR_DOWN = 2;
                e.DIR_LEFT = 3;
                e.DIR_RIGHT = 4;
                e.touchX = 0;
                e.touchY = 0;
                e.tx = 0;
                e.ty = 0;
                e.controlAngle = 999;
                e.gameWidth = 0;
                e.gameHeight = 0;
                e.isCheck = !1;
                e.isCamera = !1;
                e.layer_master = null;
                e.layer_static = null;
                e.layer_static0 = null;
                e.layer_static1 = null;
                e.layer_near0 = null;
                e.layer_near = null;
                e.layer_far0 = null;
                e.layer_far1 = null;
                e.layer_far2 = null;
                e.layer_far3 = null;
                e.layer_ob = null;
                e.isLockCamera = !0;
                e.btnShield = 90;
                e.itemCount = 0;
                e.itemMap = {};
                e.enemyMap = {};
                e.interactMod = c.default.OP_USE;
                e.specialMode = c.default.OP_CLIMB;
                e.operateDir = 0;
                e.mapName = "";
                e.horizonY = 0;
                e.forceWaitTime = 0;
                e.forceWaitCb = null;
                e.isGesture = !1;
                e.gestureCount = 0;
                e.nPos = null;
                e.isToucheLong = 0;
                e.m_angle = 45;
                e.m_forceX = 6e3;
                e.m_forceY = 6e3;
                e.m_MaxX = 8e3;
                e.m_MaxY = 11e3;
                e.m_MiniX = 2e3;
                e.m_MiniY = 3e3;
                e.m_MaxZindex = 999;
                e.m_isTimeTouch = 0;
                e.dropCount = 0;
                e.initCameraData = null;
                e.cameraCurScale = 1;
                e.layer_ex = null;
                e.cameraIndex = 1;
                e.m_isThrow = 0;
                e.m_touchState = 0;
                e.m_throwIndex = 0;
                e.m_discardIdx = 5e3;
                return e;
            }
            e.prototype.onLoad = function () {
                this.gameWidth = cc.winSize.width;
                this.gameHeight = cc.winSize.height;
                cc.director.getPhysicsManager().enabled = !0;
                if (!c.default.isTest) {
                    cc.director.getPhysicsManager().debugDrawFlags = 16 | cc.PhysicsManager.DrawBits.e_shapeBit | cc.PhysicsManager.DrawBits.e_jointBit;
                    cc.director.getCollisionManager().enabledDrawBoundingBox = !0;
                }
                cc.director.getPhysicsManager().enabledAccumulator = !0;
                cc.PhysicsManager.FIXED_TIME_STEP = 1 / 30;
                cc.PhysicsManager.VELOCITY_ITERATIONS = 8;
                cc.PhysicsManager.POSITION_ITERATIONS = 8;
                cc.debug.setDisplayStats(!1);
                this.setClick(this.node, !0);
            };
            e.prototype.start = function () {
                var t = this;
                cc.find("Canvas").on(cc.Node.EventType.TOUCH_START, function () {
                    t.m_isTimeTouch = 0;
                });
                this.m_nowMod = [];
                u.default.loadCrossEvent();
                this.initControl();
                if (c.default.isTest) this.initData(["scenes_d" + c.default.chapter + "_" + c.default.mapIndex]); else {
                    var e = c.default.mapKey, o = (e = e.replace("scenes_d", "")).split("_"), i = o[0], n = o[1];
                    c.default.chapter = Number(i);
                    c.default.mapIndex = Number(n);
                    this.initData([c.default.mapKey]);
                }
            };
            e.prototype.initTouchData = function () {
                this.m_forceX = 6e3;
                this.m_forceY = 5e3;
                this.m_MaxX = 8e3;
                this.m_MaxY = 11e3;
                this.m_MiniX = 2e3;
                this.m_MiniY = 3e3;
                this.m_throwNode && this.m_throwNode.destroy();
                this.m_throwNode = null;
                this.m_ThrowPos = [];
            };
            e.prototype.openEffect = function (t, e) {
                var o = this;
                void 0 === t && (t = .6);
                void 0 === e && (e = null);
                var i = cc.sequence(cc.delayTime(t), cc.fadeOut(.7), cc.callFunc(function () {
                    o.layer_black.active = !1;
                    e && e();
                }));
                this.layer_black.active = !0;
                this.layer_black.opacity = 255;
                this.layer_black.runAction(i);
            };
            e.prototype.removeItemData = function (t) {
                this.itemMap[t] = null;
            };
            e.prototype.addItemData = function (t, e) {
                this.itemMap[t] = e;
            };
            e.prototype.delayHold = function (t, e) {
                this.scheduleOnce(e, t);
            };
            e.prototype.resumeGame = function () {
                this.node.resumeAllActions();
                cc.director.getScheduler().resumeTarget(this);
                this.recursionNode(this.gameNode, !1);
            };
            e.prototype.pauseGame = function () {
                this.node.pauseAllActions();
                cc.director.getScheduler().pauseTarget(this);
                this.recursionNode(this.gameNode, !0);
            };
            e.prototype.recursionNode = function (t, e) {
                for (var o = 0, i = t.children; o < i.length; o++) {
                    var n = i[o], a = n.getComponent("DragonBonesManager"), s = n.getComponent("spineManager"), r = n.getComponent("itemBox"), c = n.getComponent("enemy_ai"), l = cc.director.getScheduler();
                    if (e) {
                        n.pauseAllActions();
                        a && a.stopAction();
                        s && s.stopAction();
                        r && l.pauseTarget(r);
                        c && l.pauseTarget(c);
                    } else {
                        n.resumeAllActions();
                        a && a.goOnAction();
                        s && s.goOnAction();
                        r && l.resumeTarget(r);
                        c && l.resumeTarget(c);
                    }
                    n.childrenCount > 0 && this.recursionNode(n, e);
                }
            };
            e.prototype.initData = function (t) {
                var e = this;
                this.btnShield = 999999;
                cc.game.setFrameRate(60);
                this.gameOperate = !0;
                var o = t[0], i = t[1];
                this.camera_master_ts = this.camera_master.getComponent("camera_master");
                this.m_throwAry = [];
                this.m_ThrowPos = [];
                var n = new cc.Node();
                n.name = "throwParent";
                this.layer_black.active && (this.ani_node.node.active = !1);
                this.createPrefab("view/" + o, function (t) {
                    if (null != t) {
                        e.gameNode = t;
                        h.default.gameNode = t;
                        e.layer_master = e.gameNode.getChildByName("node_master").getChildByName("node_obj");
                        e.layer_static = e.gameNode.getChildByName("node_static");
                        e.layer_static0 = e.gameNode.getChildByName("node_static0");
                        e.layer_static1 = e.gameNode.getChildByName("node_static1");
                        e.layer_near0 = e.gameNode.getChildByName("node_near0");
                        e.layer_near = e.gameNode.getChildByName("node_near");
                        e.layer_far0 = e.gameNode.getChildByName("node_far0");
                        e.layer_far1 = e.gameNode.getChildByName("node_far1");
                        e.layer_far2 = e.gameNode.getChildByName("node_far2");
                        e.layer_far3 = e.gameNode.getChildByName("node_far3");
                        e.layer_ob = e.gameNode.getChildByName("node_ob");
                        e.layer_ob.opacity = 0;
                        if (i) {
                            i.x = Number(i.x) - e.gameNode.width / 2;
                            i.y = -(Number(i.y) - e.gameNode.height / 2);
                        }
                        e.node.addChild(t);
                        console.log("------------- heroPos ", i);
                        var a = r.default.getTempData(o), s = null, l = null;
                        e.initCameraData = null;
                        if (a && "" != a) {
                            s = a.itemArr;
                            i || (i = a.heroPos);
                            l = a.gomod;
                        }
                        if (!s) {
                            var d = r.default.getPointConf(o);
                            s = d.confArr;
                            e.initCameraData = d.initCamera;
                        }
                        e.mapName = o;
                        e.itemCount = s.length;
                        console.log("------------- confArr ", s);
                        e.layer_master.addChild(n);
                        e.m_ParentNode = n;
                        e.m_ParentNode.zIndex = e.m_MaxZindex;
                        u.default.initGameEvent(e, null);
                        var p = 0, m = [];
                        for (var _ in s) m.push(s[_]);
                        for (var f = function () {
                            var t = v;
                            e.createPrefab("item/itemBox", function (o) {
                                o.x = t.x;
                                o.y = t.y;
                                e.layer_master.addChild(o);
                                o.getComponent("itemBox").setConf(t, e);
                                e.itemMap[t.index] = o;
                                p++;
                                e.checkLoadItem(p);
                            });
                            if ("initPos" == t.key) {
                                var o = t;
                                console.log("------------- heroConf ", o);
                                o.heroGo = l || o.heroGo || "walk";
                                e.createPrefab(o.url, function (t) {
                                    e.hero = t;
                                    if (i) {
                                        e.hero.x = i.x;
                                        e.hero.y = i.y;
                                    } else {
                                        e.hero.x = o.x;
                                        e.hero.y = o.y;
                                    }
                                    var n = r.default.getHeroSpine();
                                    n && "" != n && (o.heroAni = n);
                                    e.hero.zIndex = o.z;
                                    e.hero_ts = e.hero.getComponent("role_1");
                                    u.default.initGameEvent(e, e.hero);
                                    e.hero_ts.initHero(o, c.default.HERO_STANDBY, r.default.getHeroItem());
                                    e.layer_master.addChild(e.hero);
                                    p++;
                                    e.checkLoadItem(p);
                                });
                            }
                        }, g = 0, y = m; g < y.length; g++) {
                            var v = y[g];
                            f();
                        }
                        e.layer_black.active && e.openEffect();
                    }
                });
            };
            e.prototype.checkLoadItem = function (t) {
                if (t > this.itemCount) {
                    this.checkFollow();
                    this.initGame();
                }
            };
            e.prototype.changeEditorPos = function (t, e) {
                var o = null, i = null;
                null != t && (o = Number(t) - this.gameNode.width / 2);
                null != e && (i = -(Number(e) - this.gameNode.height / 2));
                return {
                    x: o,
                    y: i
                };
            };
            e.prototype.tempCloseUp = function (t) {
                void 0 === t && (t = !1);
                if (t) this.camera_master_ts.zoom(0, this.cameraCurScale, null, .3); else {
                    this.cameraCurScale = this.camera_master_ts.getZoom();
                    var e = 1.5 * this.cameraCurScale;
                    this.camera_master_ts.zoom(0, e, null, .5);
                }
            };
            e.prototype.checkFollow = function () {
                var t = this, e = r.default.getHeroFollow();
                this.hero_ts.followMap = e || {};
                var o, i = function () {
                    if (null == e[a]) return "continue";
                    if (null == n.itemMap[a]) {
                        var i = e[a].conf;
                        o = e[a].y;
                        n.createPrefab("item/itemBox", function (e) {
                            e.x = t.hero.x + h.default.mt_rand(-80, 80);
                            e.y = t.hero.y + o;
                            e.zIndex = i.z;
                            t.layer_master.addChild(e);
                            var n = e.getComponent("itemBox");
                            n.setConf(i, t);
                            t.itemMap[i.index] = e;
                            n.followHero(t.hero.y);
                        });
                    } else n.itemMap[a].getComponent("itemBox").followHero(n.hero.y);
                }, n = this;
                for (var a in e) i();
            };
            e.prototype.cleanGame = function () {
                this.unschedule(this.upGame);
                this.operateDir = 0;
                this.itemMap = {};
                this.gameNode.removeAllChildren();
                this.gameNode.removeFromParent();
                this.gameNode.destroy();
            };
            e.prototype.cameraAct = function (t, e) {
                void 0 === e && (e = 0);
                this.isLockCamera = !t.unlock;
                var o = {};
                if (null == t.x && null == t.y) o = null; else {
                    null != t.x && (o.x = Number(t.x));
                    null != t.y && (o.y = Number(t.y));
                }
                this.camera_master_ts.zoom(t.mod, Number(t.scale), o, Number(t.time), function () { });
            };
            e.prototype.specialEvent = function (t) {
                switch (t) {
                    case 101:
                        for (var e, o, i = -105, n = function () {
                            var t = new cc.Node();
                            t.x = -a.gameNode.width / 2 - h.default.mt_rand(200, 600);
                            e = 120 + 135 * (1 - (-65 - i) / 350);
                            t.color = cc.color(e, e, e);
                            i -= h.default.mt_rand(25, 40);
                            t.y = i;
                            t.zIndex = -i;
                            t.scale = .8 * (.35 + Math.abs(i) / 400);
                            o = h.default.mt_rand(1, 4) / 10;
                            var n = cc.sequence(cc.delayTime(o), cc.callFunc(function () {
                                var e = t.addComponent(p.default), o = 1 == h.default.mt_rand(1, 2) ? "benpao" : "benpao2";
                                e.initData(t, o, "ani05");
                            }), cc.moveBy(4, cc.v2(2500, h.default.mt_rand(-20, 20))), cc.callFunc(function () {
                                t.stopAllActions();
                                t.destroy();
                            }));
                            t.runAction(n);
                            a.layer_master.addChild(t);
                        }, a = this, s = 0; s < 7; s++) n();
                }
            };
            e.prototype.saveItemConf = function (t, e) {
                void 0 === t && (t = null);
                void 0 === e && (e = "walk");
                c.default.onlinetm = new Date().getTime();
                var o = this.hero_ts.followMap, i = [];
                for (var n in this.itemMap) {
                    var a = this.itemMap[n];
                    if (null != a) {
                        var s = a.getComponent("itemBox").getTempConf();
                        if (null == o[s.index]) {
                            "initPos" == s.key && (s = this.hero_ts.getTempConf());
                            i.push(s);
                        }
                    }
                }
                console.log("------------ 保存地图信息 " + this.mapName);
                console.log("------------ 保存主角坐标 ", t);
                r.default.saveTempData(this.mapName, i, t, e);
                r.default.saveHeroItem(this.hero_ts.goods);
                r.default.saveHeroFollow(this.hero_ts.followMap);
                r.default.saveHeroSpine(this.hero_ts.m_path);
                c.default.saveMapInfo();
            };
            e.prototype.changeMap = function (t, e) {
                var o = this;
                void 0 === e && (e = {
                    x: "",
                    y: ""
                });
                this.changeForceWait(!0);
                var i = "scenes_d" + c.default.chapter + "_" + t;
                u.default.cleanStack();
                u.default.isDoor = !0;
                if (this.mapName == i) {
                    this.hero_ts.initAllState();
                    this.hero.runAction(cc.sequence(cc.fadeOut(.7), cc.callFunc(function () {
                        o.hero.x = Number(e.x) - o.gameNode.width / 2;
                        o.hero.y = -(Number(e.y) - o.gameNode.height / 2);
                    }), cc.fadeIn(.7), cc.callFunc(function () {
                        o.changeForceWait(!1);
                        u.default.isGround = !0;
                    })));
                    var n = this.hero_ts.followMap, a = function () {
                        if (null != n[r]) {
                            var t = s.itemMap[r];
                            t.runAction(cc.sequence(cc.fadeOut(.71), cc.callFunc(function () {
                                t.x = Number(e.x) - o.gameNode.width / 2;
                                t.y = 52 - (Number(e.y) - o.gameNode.height / 2);
                            }), cc.fadeIn(.69)));
                        }
                    }, s = this;
                    for (var r in n) a();
                } else {
                    c.default.mapIndex = Number(t);
                    this.saveItemConf(null, this.hero_ts.walkingMode);
                    this.showSave();
                    this.layer_black.opacity = 0;
                    this.layer_black.active = !0;
                    this.layer_black.runAction(cc.fadeIn(.5));
                    this.delayHold(.5, function () {
                        if (null != e.x && "" != e.x && null != e.y && "" != e.y) {
                            o.cleanGame();
                            o.initData([i, {
                                x: e.x,
                                y: e.y
                            }]);
                        } else {
                            o.cleanGame();
                            o.initData([i]);
                        }
                    });
                }
            };
            e.prototype.goTransitionScene = function (t) {
                void 0 === t && (t = "");
                this.cleanGame();
                r.default.cleanHeroItem();
                r.default.cleanCorssData();
                r.default.cleanHeroFollow();
                var e = t.split("_");
                if (!t || "" == t) {
                    this.openEffect(.01, function () {
                        d.default.open("dialog/tipsDialog", ["<b><size=28>后续关卡正在开发中，敬请期待!</>", "", function () {
                            console.log("==确定=回调=");
                            r.default.cleanAllSave();
                            c.default.chapter = 1;
                            c.default.mapIndex = 1;
                            c.default.Smallplot = "0_1";
                            l.default.stopBGM();
                            c.default.initMapInfo();
                            setTimeout(function () {
                                cc.director.loadScene("mainScene", function () {
                                    console.log("==1111== mainScene==success=====");
                                });
                            }, 200);
                        }, null, null, !0]);
                    });
                    return console.log("111关卡结束未配置参数");
                }
                c.default.Smallplot = t;
                c.default.mapIndex = 1;
                if (Number(e[1]) > c.default.chapterCur) {
                    c.default.chapterCur = Number(e[1]);
                    console.log("------------- chapterCur " + c.default.chapterCur);
                }
                Number(e[0]) > c.default.unlockchapters && (c.default.unlockchapters = Number(e[0]));
                c.default.saveUnlockChapter();
                l.default.stopBGM();
                this.layer_black.opacity = 0;
                this.layer_black.active = !0;
                this.layer_black.runAction(cc.fadeIn(1.5));
                cc.director.preloadScene("transitionScene", function () { }, function () {
                    setTimeout(function () {
                        cc.director.loadScene("transitionScene", function () {
                            console.log("==1111== gameScene==success=====");
                        });
                    }, 200);
                });
            };
            Object.defineProperty(e.prototype, "gameOperate", {
                get: function () {
                    return this.isCheck;
                },
                set: function (t) {
                    this.isCheck = t;
                    console.log("------------- 设置阻断 ", this.isCheck);
                    this.isCheck && (this.operateDir = 0);
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.getTriggerItem = function (t) {
                if (this.itemMap && this.itemMap[t]) return this.itemMap[t];
            };
            e.prototype.showSave = function () {
                var t = this;
                this.node_save.active = !0;
                this.delayHold(3, function () {
                    t.node_save.active = !1;
                });
            };
            e.prototype.setBtnOpacity = function (t) {
                this.btn_user.opacity = t;
            };
            e.prototype.setInteract = function () { };
            Object.defineProperty(e.prototype, "interact", {
                get: function () {
                    return this.interactMod;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.setSpecialMode = function (t) {
                this.specialMode = t;
            };
            e.prototype.checkCollision = function () { };
            e.prototype.initGame = function () {
                this.ani_node.node.active && this.ani_node.setAnimation(0, "daiji2", !1);
                console.log("------- gameWidth " + this.gameWidth);
                console.log("------- gameHeight " + this.gameHeight);
                this.isLockCamera = !0;
                this.camera_master_ts.initCamera(this.gameWidth, this.gameHeight, this.gameNode.width, this.gameNode.height, this);
                var t = this.hero.getPosition();
                this.camera_master_ts.restoreCamera({
                    x: t.x,
                    y: t.y + 275
                }, this.initCameraData);
                this.horizonY = this.hero.y;
                this.saveItemConf({
                    x: this.hero.x,
                    y: this.hero.y
                }, this.hero_ts.walkingMode);
                this.btnShield = null != this.initCameraData && "" != this.initCameraData.time ? 60 * this.initCameraData.time : 90;
                this.schedule(this.upGame, 0);
                this.gameOperate = !1;
                this.delayHold(.6, function () {
                    u.default.checkCrossEvent(c.default.mapIndex);
                });
            };
            e.prototype.setMasterOpacity = function (t, e) {
                if (t && null != e && "" != e) {
                    var o = this.layer_master.getChildByName(t);
                    o && (o.opacity = Number(e));
                }
            };
            e.prototype.chapterOver = function (t) {
                console.log("-------- chapterOver !!", t);
                this.goTransitionScene(t);
            };
            e.prototype.alignLayer = function () {
                var t = this.camera_master.node.x, e = this.camera_master.node.y;
                this.layer_static.x = t;
                if (this.layer_static0) {
                    this.layer_static0.x = t;
                    this.layer_static0.y = e;
                }
                if (this.layer_static1) {
                    this.layer_static1.x = t;
                    this.layer_static1.y = e;
                }
                this.layer_near0 && (this.layer_near0.x = .6 * -t);
                this.layer_near.x = .2 * -t;
                this.layer_far0.x = .15 * t;
                this.layer_far1.x = .25 * t;
                this.layer_far2.x = .5 * t;
                this.layer_far3.x = .8 * t;
                this.layer_static.y = e;
                this.layer_far0.y = .1 * e;
                this.layer_far1.y = .2 * e;
                this.layer_far2.y = .3 * e;
                this.layer_far3.y = .4 * e;
            };
            e.prototype.alignCamera = function () {
                if (this.isLockCamera) {
                    var t = this.hero.getPosition();
                    this.camera_master_ts.trackPosAct({
                        x: t.x,
                        y: t.y + 275
                    });
                }
                this.alignLayer();
            };
            e.prototype.onKeyDown = function (t) {
                switch (t.keyCode) {
                    case cc.macro.KEY.a:
                        this.dirCall(this.DIR_LEFT);
                        break;

                    case cc.macro.KEY.d:
                        this.dirCall(this.DIR_RIGHT);
                        break;

                    case cc.macro.KEY.r:
                        this.throwBack();
                        break;

                    case cc.macro.KEY.t:
                        this.startBack();
                }
            };
            e.prototype.onKeyUp = function (t) {
                switch (t.keyCode) {
                    case cc.macro.KEY.a:
                        this.dirEndCall(this.DIR_LEFT);
                        break;

                    case cc.macro.KEY.d:
                        this.dirEndCall(this.DIR_RIGHT);
                        break;

                    case cc.macro.KEY.r:
                        break;

                    case cc.macro.KEY.t:
                        this.endBack();
                }
            };
            e.prototype.initControl = function () {
                cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
                cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
                this.btn_user.on(cc.Node.EventType.TOUCH_START, this.startBack, this);
                this.btn_user.on(cc.Node.EventType.TOUCH_END, this.endBack, this);
                this.btn_user.on(cc.Node.EventType.TOUCH_CANCEL, this.endBack, this);
                this.btn_throw.on(cc.Node.EventType.TOUCH_START, this.throwBack, this);
                this.btn_climb.on(cc.Node.EventType.TOUCH_START, this.startClimbBack, this);
                this.layer_dir.on(cc.Node.EventType.TOUCH_START, this.controlStart, this);
                this.layer_dir.on(cc.Node.EventType.TOUCH_MOVE, this.controlMove, this);
                this.layer_dir.on(cc.Node.EventType.TOUCH_END, this.controlEnd, this);
                this.btn_pass.on(cc.Node.EventType.TOUCH_END, this.passBack, this);
                this.btn_tips.on(cc.Node.EventType.TOUCH_END, this.tipsBack, this);
                this.setThrowBtn(!1);
                this.btn_user.active = !1;
                this.btn_climb.active = !1;
                this.m_partTexture = new cc.RenderTexture();
                this.m_partTexture.setPremultiplyAlpha(!0);
                var t = new Uint8Array(this.camera_part.width * this.camera_part.height * 4);
                this.m_partTexture.readPixels(t, 0, 0, this.camera_part.width, this.camera_part.height);
                for (var e = 0; e < this.camera_part.width; e++) for (var o = 0; o < this.camera_part.height; o++) {
                    var i = e * this.camera_part.height * 4 + 4 * o + 3;
                    t[i] = Math.round(Math.pow(t[i] / 255, 1 / 3));
                    t[i] > 220 && (t[i] = 255);
                }
                this.m_partTexture.initWithData(t, cc.Texture2D.PixelFormat.RGBA8888, this.camera_part.width, this.camera_part.height);
                this.m_partTexture.initWithSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
                this.camera_part.getComponent(cc.Camera).targetTexture = this.m_partTexture;
            };
            e.prototype.upGame = function () {
                this.checkEnemy();
                this.m_isTimeTouch++;
                36e3 == this.m_isTimeTouch && this.passBack();
                this.btnShield > 0 && this.btnShield--;
                if (this.gestureCount < 2 * c.default.G_COUNT) {
                    this.gestureCount++;
                    if (!this.m_isThrow && null != this.nPos && !this.isGesture && this.gestureCount == c.default.G_COUNT + 1) {
                        this.gestureCount = 0;
                        var t = this.nPos.x + this.camera_master.node.x;
                        if (Math.abs(t - this.hero.x) > 30) {
                            t = t > this.hero.x ? 9999 : -9999;
                            this.hero_ts.posMove(t, this.nPos.y);
                        } else {
                            this.nPos = null;
                            this.hero_ts.posMove(this.hero.x, this.hero.y);
                        }
                    }
                }
                this.alignCamera();
                if (this.dropCount > 0) {
                    this.dropCount--;
                    1 == this.dropCount && u.default.checkDrop();
                }
                if (!(this.isCheck || this.btnShield > 20)) {
                    this.operateDir;
                    if (this.texture_sp.node.parent.parent.active) {
                        this.cameraIndex % 3 == 0 && this.setCamera_part();
                        this.cameraIndex++;
                    } else this.cameraIndex = 0;
                }
            };
            e.prototype.setCamera_part = function () {
                this.camera_part.getComponent(cc.Camera).render();
                var t = this.camera_part.getComponent(cc.Camera).targetTexture, e = new cc.SpriteFrame();
                e.setTexture(t);
                this.texture_sp.node.scaleY = -1;
                this.texture_sp.spriteFrame = e;
            };
            e.prototype.refreshControl = function (t) {
                this.node_control.setPosition(this.touchX - this.gameWidth / 2, this.touchY - this.gameHeight / 2);
                if (1 != t) {
                    var e = h.default.getAngle({
                        x: this.touchX,
                        y: this.touchY
                    }, {
                        x: this.tx,
                        y: this.ty
                    });
                    this.btn_control.x = 79;
                    this.controlAngle = e;
                    this.pan_control.angle = e;
                    this.btn_light.active = !0;
                    var o;
                    o = this.controlAngle <= 45 && this.controlAngle >= -45 ? this.DIR_RIGHT : this.controlAngle > 45 && this.controlAngle < 135 ? this.DIR_UP : this.controlAngle > -135 && this.controlAngle < -45 ? this.DIR_DOWN : this.DIR_LEFT;
                    if (this.operateDir != o) {
                        0 != this.operateDir && this.dirEndCall(this.operateDir);
                        this.dirCall(o);
                    }
                }
            };
            e.prototype.findTouchHero = function (t) {
                var e = 0;
                t.x <= this.hero_ts.node.x + 40 && t.y >= this.hero_ts.node.y && e++;
                t.x <= this.hero_ts.node.x + 20 && t.y <= this.hero_ts.node.y + 180 && e++;
                t.x >= this.hero_ts.node.x - 40 && t.y >= this.hero_ts.node.y && e++;
                t.x >= this.hero_ts.node.x - 40 && t.y <= this.hero_ts.node.y + 180 && e++;
                return e >= 4;
            };
            e.prototype.refreshThrow = function (t) {
                t.x - this.m_TouchPos.x > 0 ? (this.hero_ts.isRight, this.m_forceX > this.m_MiniX && (this.m_forceX -= 50)) : this.m_TouchPos.x - t.x > 0 && (this.hero_ts.isRight,
                    this.m_forceX < this.m_MaxX && (this.m_forceX += 50));
                t.y - this.m_TouchPos.y > 0 ? this.m_forceY > this.m_MiniY && (this.m_forceY -= 50) : this.m_TouchPos.y - t.y > 0 && this.m_forceY < this.m_MaxY && (this.m_forceY += 50);
                this.updateLine();
                this.m_TouchPos = t;
            };
            e.prototype.controlStart = function (t) {
                if (!(this.isCheck || this.btnShield > 0)) {
                    this.btnShield = 20;
                    this.isGesture = !1;
                    this.gestureCount = 0;
                    var e = t.getLocation();
                    this.touchX = e.x;
                    this.touchY = e.y;
                    this.nPos = this.layer_master.convertToNodeSpaceAR(e);
                    this.refreshControl(1);
                    if (this.findTouchHero({
                        x: this.nPos.x + this.camera_master.node.x,
                        y: this.nPos.y + this.camera_master.node.y
                    }) && this.hero_ts.goods) if ("1" == this.hero_ts.goods.isthrow) {
                        this.m_TouchPos = {
                            x: this.touchX,
                            y: this.touchY
                        };
                        this.m_isThrow = 1;
                    } else "3" == this.hero_ts.goods.isthrow && (this.m_touchState = 1);
                    return !0;
                }
            };
            e.prototype.controlMove = function (t) {
                if (!this.isCheck) {
                    var e = t.getLocation();
                    this.tx = e.x;
                    this.ty = e.y;
                    this.nPos = this.layer_master.convertToNodeSpaceAR(e);
                    if (this.findTouchHero({
                        x: this.nPos.x + this.camera_master.node.x,
                        y: this.nPos.y + this.camera_master.node.y
                    }) || !(this.tx - this.touchX >= 50 || this.touchX - this.tx >= 50) || 1 != this.m_isThrow && 3 != this.m_isThrow) {
                        if (this.findTouchHero({
                            x: this.nPos.x + this.camera_master.node.x,
                            y: this.nPos.y + this.camera_master.node.y
                        }) && 2 == this.m_isThrow) {
                            this.m_isThrow = 3;
                            if (this.m_throwAry.length > 0) for (var o = 0; o < this.m_throwAry.length; o++) this.m_throwAry[o].destroy();
                            this.m_throwAry = [];
                            this.m_touchState = 0;
                        } else if (!this.isGesture && this.gestureCount < c.default.G_COUNT && Math.sqrt(Math.pow(Math.abs(this.tx - this.touchX), 2) + Math.pow(Math.abs(this.ty - this.touchY), 2)) > c.default.G_RANGE) {
                            this.isGesture = !0;
                            this.checkGesture();
                        }
                    } else {
                        this.nPos.x + this.camera_master.node.x > this.hero_ts.node.x ? this.hero_ts.isRight = !1 : this.hero_ts.isRight = !0;
                        this.throwBack();
                        this.m_isThrow = 2;
                    }
                    this.refreshControl(2);
                    2 == this.m_isThrow && 1 == this.isToucheLong && this.refreshThrow({
                        x: this.tx,
                        y: this.ty
                    });
                }
            };
            e.prototype.controlEnd = function (t) {
                var e = this;
                if (!this.isCheck) {
                    this.nPos = null;
                    this.node_control.active = !1;
                    this.controlAngle = 999;
                    this.btn_control.x = 0;
                    this.pan_control.angle = 0;
                    this.btn_light.active = !1;
                    this.dirEndCall(this.operateDir);
                    if (1 == this.isToucheLong && 2 == this.m_isThrow) this.hero_ts.setState(c.default.HERO_TOUZI2, function () {
                        e.setThrow();
                    }); else if (3 == this.m_isThrow) {
                        console.log("==取消投掷==");
                        this.setThrowEnd();
                        this.m_isThrow = 0;
                        this.m_TouchPos = null;
                    } else if (!this.isGesture) if (1 == this.m_touchState) {
                        console.log("====点击主角===");
                        this.m_touchState = 0;
                        this.gameOperate = !0;
                        this.instatThrow();
                    } else {
                        var o = t.getLocation(), i = this.layer_master.convertToNodeSpaceAR(o);
                        this.hero_ts.posMove(i.x / this.camera_master.zoomRatio + this.camera_master.node.x, i.y / this.camera_master.zoomRatio + this.camera_master.node.y);
                    }
                }
            };
            e.prototype.checkGesture = function () {
                if (!(this.isCheck || this.hero_ts.goods && 3 != this.hero_ts.goods.isthrow)) {
                    var t = null, e = (h.default.getAngle({
                        x: this.touchX,
                        y: this.touchY
                    }, {
                        x: this.tx,
                        y: this.ty
                    }), 0);
                    if (this.controlAngle <= 45 && this.controlAngle >= -45) {
                        t = c.default.OP_ATT;
                        e = this.DIR_RIGHT;
                        console.log("------------------ 形成手势！！！！！--- 右");
                    } else if (this.controlAngle > 45 && this.controlAngle < 135) {
                        t = c.default.OP_CLIMB;
                        e = this.DIR_UP;
                        console.log("------------------ 形成手势！！！！！--- 上");
                    } else if (this.controlAngle > -135 && this.controlAngle < -45) {
                        e = this.DIR_DOWN;
                        console.log("------------------ 形成手势！！！！！--- 下");
                    } else {
                        t = c.default.OP_ATT;
                        e = this.DIR_LEFT;
                        console.log("------------------ 形成手势！！！！！--- 左");
                    }
                    null != t && u.default.analysisEvent(t, e);
                }
            };
            e.prototype.dirCall = function (t) {
                if (this.isCheck) this.operateDir = 0; else {
                    this.m_tochDir = t;
                    switch (t) {
                        case this.DIR_UP:
                            this.operateDir = this.DIR_UP;
                            break;

                        case this.DIR_DOWN:
                            this.operateDir = this.DIR_DOWN;
                            break;

                        case this.DIR_LEFT:
                            this.operateDir = this.DIR_LEFT;
                            break;

                        case this.DIR_RIGHT:
                            this.operateDir = this.DIR_RIGHT;
                    }
                }
            };
            e.prototype.dirEndCall = function (t) {
                2 == this.isToucheLong && (this.isToucheLong = 1);
                this.m_tochDir = 0;
                if (this.isCheck || this.isToucheLong && this.isToucheLong < 3) this.operateDir != this.DIR_RIGHT && this.operateDir != this.DIR_LEFT || (this.operateDir = 0); else {
                    switch (t) {
                        case this.DIR_UP:
                        case this.DIR_DOWN:
                        case this.DIR_LEFT:
                        case this.DIR_RIGHT:
                    }
                    this.camera_master_ts.initTrack(this.hero.position);
                    this.operateDir = 0;
                }
            };
            e.prototype.insPoint = function () {
                var t = new cc.Node();
                t.addComponent(cc.Sprite);
                var e = t.getComponent(cc.Sprite);
                this.setSpriteFrame(e, "public/image_tz5");
                return t;
            };
            e.prototype.updateLine = function (t) {
                void 0 === t && (t = 1);
                var e = 0, o = 0;
                if (this.m_throwAry.length <= 0) for (var i = 0; i < 50; i++) {
                    e += .25;
                    o += .09;
                    var n = this.hero_ts.isRight ? this.m_forceX / 16.1 * o + this.hero.x - 20 : -this.m_forceX / 16.1 * o + this.hero.x + 20, a = this.m_forceY / 16.1 * o - 200 * o * o + this.hero.y + 160;
                    this.m_ThrowPos.push([n, a]);
                    if (i < 7) {
                        (c = this.insPoint()).zIndex = this.m_MaxZindex;
                        c.setParent(this.m_ParentNode);
                        var s = this.hero_ts.isRight ? this.m_forceX / 16.1 * e + this.hero.x - 20 : -this.m_forceX / 16.1 * e + this.hero.x + 20, r = this.m_forceY / 16.1 * e - 200 * e * e + this.hero.y + 160;
                        c.setPosition(s, r);
                        this.m_throwAry.push(c);
                    }
                } else for (i = 0; i < 50; i++) {
                    e += .25;
                    o += .09;
                    if (i < 7) {
                        var c = this.m_throwAry[i];
                        s = this.hero_ts.isRight ? this.m_forceX / 16.1 * e + this.hero.x - 20 : -this.m_forceX / 16.1 * e + this.hero.x + 20,
                            r = this.m_forceY / 16.1 * e - 200 * e * e + this.hero.y + 160;
                        c.setPosition(s, r);
                    }
                    n = this.hero_ts.isRight ? this.m_forceX / 16.1 * o + this.hero.x - 20 : -this.m_forceX / 16.1 * o + this.hero.x + 20,
                        a = this.m_forceY / 16.1 * o - 200 * o * o + this.hero.y + 160;
                    this.m_ThrowPos[i] = [n, a];
                }
            };
            e.prototype.throwBack = function () {
                if (!(this.isCheck || this.btnShield > 0) && this.hero_ts.goods) {
                    this.btnShield = 30;
                    this.operateDir = 0;
                    this.hero_ts.stopMove();
                    this.isToucheLong = 1;
                    this.hero_ts.isRight;
                    this.updateLine(1);
                    this.hero_ts.setState(c.default.HERO_TOUZI);
                }
            };
            e.prototype.startBack = function () {
                if (!(this.isCheck || this.isToucheLong || this.btnShield > 0)) {
                    this.btnShield = 25;
                    u.default.analysisEvent(this.interactMod);
                }
            };
            e.prototype.endBack = function () {
                this.isCheck;
            };
            e.prototype.startClimbBack = function () {
                if (!(this.isCheck || this.btnShield > 0)) {
                    this.btnShield = 25;
                    if (this.m_guideNode.x < 1e4) {
                        this.btn_climb.active = !1;
                        this.m_guideNode.x = 1e4;
                    }
                    u.default.analysisEvent(this.specialMode);
                }
            };
            e.prototype.createExplodeBox = function (t, e) {
                var o = this;
                void 0 === e && (e = !0);
                this.createPrefab("effect/explodeBox", function (i) {
                    if (null != i) {
                        var n = i.getComponent("explodeBox");
                        n.initData();
                        i.x = o.m_throwNode.x;
                        i.y = o.m_throwNode.y + 30;
                        i.zIndex = o.m_MaxZindex;
                        t.addChild(i);
                        n.clear();
                        e && o.delayHold(1, function () {
                            o.cameraAct({
                                scale: 1,
                                time: .7
                            });
                            o.isToucheLong = 0;
                        });
                    }
                    o.initTouchData();
                });
            };
            e.prototype.setThrowEnd = function (t) {
                var e = this;
                void 0 === t && (t = !1);
                if (3 == this.isToucheLong) if (t) {
                    this.delayHold(.2, function () {
                        e.cameraAct({
                            scale: 1,
                            time: .7
                        });
                        e.isToucheLong = 0;
                    });
                    this.initTouchData();
                } else this.createExplodeBox(this.layer_master); else {
                    this.m_guideNode.opacity = 0;
                    this.hero_ts.setHand(1);
                    this.hero_ts.setSwitchSolt();
                    this.m_tochDir = 0;
                    if (this.m_throwAry.length > 0) for (var o = 0; o < this.m_throwAry.length; o++) this.m_throwAry[o].destroy();
                    this.m_throwAry = [];
                    this.initTouchData();
                    this.hero_ts.setState(c.default.HERO_STANDBY);
                    this.cameraAct({
                        scale: 1,
                        time: .7
                    });
                    this.isToucheLong = 0;
                }
            };
            e.prototype.setThrow = function () {
                var t = this;
                this.setThrowBtn(!1);
                this.isToucheLong = 3;
                l.default.playSound("grenadeso.mp3");
                if (this.m_throwAry.length > 0) for (var e = 0; e < this.m_throwAry.length; e++) this.m_throwAry[e].destroy();
                this.m_throwAry = [];
                this.m_throwNode && this.m_throwNode.destroy();
                this.m_throwNode = null;
                this.hero_ts.setHand(1);
                this.createPrefab("throw/image_sl", function (e) {
                    if (null != e && t.m_ThrowPos[0]) {
                        e.x = t.m_ThrowPos[0][0];
                        e.y = t.m_ThrowPos[0][1];
                        e.zIndex = t.m_MaxZindex;
                        var o = e.getComponent("image_sl");
                        o.initData(function () {
                            t.m_throwNode.stopAllActions();
                            t.unschedule(t.timeCallBack);
                            t.m_throwIndex = 0;
                            o.m_goods && 1 == o.m_goods.id ? o.BoomBack() : t.delayHold(.18, function () {
                                t.setThrowEnd(!0);
                            });
                        }, t.hero_ts.goods, function () {
                            if (t.m_throwNode && t.m_throwNode.active) {
                                l.default.playSound("grenadeboom.mp3");
                                h.default.shockAct();
                                t.setThrowEnd();
                            }
                        });
                        t.m_throwNode = e;
                        t.layer_master.addChild(t.m_throwNode);
                        t.simulation();
                        t.hero_ts.setGoods(null);
                        t.delayHold(5, function () {
                            if (t.m_throwNode && t.m_throwNode.active) {
                                var e = !o.m_goods || 1 != o.m_goods.id;
                                if (!e) {
                                    l.default.playSound("grenadeboom.mp3");
                                    h.default.shockAct();
                                }
                                t.setThrowEnd(e);
                            }
                        });
                    } else t.isToucheLong = 0;
                });
            };
            e.prototype.simulation = function (t) {
                void 0 === t && (t = null);
                if (!t) {
                    var e = cc.rotateBy(1, 360), o = cc.repeat(e, 1.5);
                    this.m_throwNode.runAction(o);
                }
                this.schedule(this.timeCallBack, .02);
            };
            e.prototype.timeCallBack = function () {
                if (this.m_throwNode && this.m_throwNode.active) if (this.m_ThrowPos[this.m_throwIndex]) {
                    this.m_throwNode.x = this.m_ThrowPos[this.m_throwIndex][0];
                    this.m_throwNode.y = this.m_ThrowPos[this.m_throwIndex][1];
                    this.m_throwIndex++;
                } else {
                    this.m_throwNode.stopAllActions();
                    this.unschedule(this.timeCallBack);
                    this.m_throwIndex = 0;
                }
            };
            e.prototype.setThrowBtn = function (t) {
                null != t && (this.btn_throw.active = t);
            };
            e.prototype.btnUseCall = function () {
                this.isCheck || u.default.analysisEvent(2);
            };
            e.prototype.btnQuitCall = function () {
                this._onClose();
            };
            e.prototype.instatThrow = function () {
                var t = this, e = this.hero_ts.goods;
                if (e && "4" != e.isthrow && "2" != e.isthrow) {
                    this.hero_ts.initAllState();
                    this.m_discardIdx++;
                    var o = {
                        ani: null,
                        box: {
                            width: 60,
                            height: 60,
                            x: 0,
                            y: 0
                        },
                        doorId: null,
                        eventPre: null,
                        eventTrigger: [{
                            delay: 0,
                            index: 1,
                            isLoop: !1,
                            isWait: !0,
                            key: "5",
                            last: 0,
                            next: this.m_discardIdx + "|2",
                            param: this.hero_ts.goods.nameid,
                            trigger: "6"
                        }, {
                            delay: 0,
                            index: 2,
                            isLoop: !1,
                            isWait: !0,
                            key: "9",
                            last: 0,
                            next: "",
                            param: this.m_discardIdx + "",
                            trigger: "0"
                        }],
                        guide: "",
                        height: 30,
                        index: this.m_discardIdx,
                        isClimb: !1,
                        isDrag: !1,
                        isHide: !1,
                        isLock: !1,
                        isLoop: !1,
                        isOb: !1,
                        key: "box1",
                        name: "derelict",
                        sx: 1 == e.isthrow ? .6 : 1,
                        sy: 1 == e.isthrow ? .6 : 1,
                        url: "public/goods/" + this.hero_ts.goods.imgname,
                        width: 60,
                        x: this.hero.x,
                        y: this.hero.y + 90,
                        z: 800,
                        r: 0
                    }, i = cc.instantiate(this.itemBox);
                    i.x = o.x;
                    i.y = o.y;
                    i.zIndex = this.hero_ts.node.zIndex - 1;
                    i.discardIdx = this.m_discardIdx;
                    var n = i.getComponent("itemBox");
                    n.setConf(o, this);
                    i.active = !1;
                    this.layer_master.addChild(i);
                    this.itemMap[o.index] = i;
                    if (3 == e.isthrow) {
                        this.gameOperate = !0;
                        this.hero_ts.pail_put(function () {
                            i.x = t.hero_ts.isRight ? t.hero.x + 85 : t.hero.x - 85;
                            i.y = t.hero.y + 40;
                            i.active = !0;
                        });
                    } else {
                        i.active = !0;
                        var a = this.hero_ts.isRight ? cc.v2(this.hero.x - 120, this.hero.y) : cc.v2(this.hero.x + 120, this.hero.y);
                        if (1 == e.isthrow) i.runAction(cc.sequence(cc.jumpTo(.6, a, 50, 1), cc.callFunc(function () {
                            n.onclear();
                        }))); else {
                            var s = this.hero_ts.isRight ? cc.v2(this.hero.x - 50, this.hero.y + 20) : cc.v2(this.hero.x + 50, this.hero.y);
                            i.runAction(cc.jumpTo(.15, s, 5, 1));
                        }
                    }
                }
            };
            e.prototype.changeForceWait = function (t, e) {
                void 0 === e && (e = !1);
                this.gameOperate = t;
                this.nPos = null;
                this.gestureCount = 0;
                if (t) {
                    this.operateDir = 0;
                    this.hero_ts.setControl(!1);
                    this.hero_ts.initAllState(e);
                    console.log("------------- 进入强制等待");
                } else {
                    this.hero_ts.setControl(!0);
                    console.log("------------- 解除强制等待");
                }
            };
            e.prototype.addForceWait = function (t) {
                this.gameOperate = !0;
                this.operateDir = 0;
                this.forceWaitTime += t;
                if (null == this.forceWaitCb) {
                    this.hero_ts.initAllState();
                    this.forceWaitCb = function () {
                        if (this.forceWaitTime <= 0) {
                            this.unschedule(this.forceWaitCb);
                            this.forceWaitCb = null;
                            this.forceWaitTime = 0;
                            this.gameOperate = !1;
                        } else this.forceWaitTime -= .5;
                    };
                    this.schedule(this.forceWaitCb, .5);
                }
            };
            e.prototype.storyBack = function () {
                d.default.open("dialog/showhistoryDialog");
            };
            e.prototype.passBack = function () {
                var t = this;
                if (!cc.find("Canvas").getChildByName("passDialog")) {
                    this.layer_black.active = !0;
                    this.layer_black.opacity = 180;
                    this.pauseGame();
                    d.default.open("dialog/passDialog", ["您确定暂停游戏吗。", function () { }, function () {
                        t.m_isTimeTouch = 0;
                        t.resumeGame();
                        t.openEffect(.1);
                    }], function () { });
                }
            };
            e.prototype.tipsBack = function () {
                d.default.open("dialog/gametipsDialog", [1]);
            };
            e.prototype.restartGameDeath = function () {
                var t = this;
                this.layer_black.active = !0;
                this.layer_black.opacity = 200;
                var e = "scenes_d" + c.default.chapter + "_" + c.default.mapIndex;
                this.cleanGame();
                r.default.cleanHeroItem();
                this.texture_sp.node.parent.parent.active = !1;
                this.delayHold(1, function () {
                    t.initData([e]);
                    t.openEffect();
                });
            };
            e.prototype.setTroveMove = function (t, e) {
                if (!c.default.itemData[t.nameid]) {
                    c.default.itemData[t.nameid] = t;
                    c.default.onlinetm = new Date().getTime();
                }
                var o = new cc.Node(), i = o.addComponent(cc.Sprite);
                h.default.setSpriteFrame(i, "item/items/" + t.imgname);
                var n = this.camera_master.getWorldToCameraPoint(new cc.Vec2(e.x, e.y));
                o.x = n.x;
                o.y = n.y;
                o.group = "ui";
                this.camera_ui.node.addChild(o);
                o.runAction(cc.sequence(cc.spawn(cc.scaleTo(.8, 1.2), cc.moveTo(.8, cc.v2(0, 80))), cc.delayTime(1.5), cc.moveTo(.3, cc.v2(-680, 263)), cc.callFunc(function () {
                    o.removeFromParent();
                    o.destroy();
                })));
            };
            e.prototype.addEnemy = function (t, e) {
                this.enemyMap[e] = t;
            };
            e.prototype.checkEnemy = function () { };
            e.prototype.setLayer_Ex = function (t) {
                void 0 === t && (t = -1);
                var e = this.gameNode.getChildByName("node_master");
                this.layer_ex = e.getChildByName("node_ex");
            };
            e.prototype.propBack = function () {
                d.default.open("dialog/showpropDialog");
            };
            a([f(cc.Camera)], e.prototype, "camera_master", void 0);
            a([f(cc.Camera)], e.prototype, "camera_ui", void 0);
            a([f(cc.Button)], e.prototype, "btn_up", void 0);
            a([f(cc.Button)], e.prototype, "btn_down", void 0);
            a([f(cc.Button)], e.prototype, "btn_left", void 0);
            a([f(cc.Button)], e.prototype, "btn_right", void 0);
            a([f(cc.Node)], e.prototype, "btn_throw", void 0);
            a([f(cc.Node)], e.prototype, "btn_pass", void 0);
            a([f(cc.Node)], e.prototype, "btn_tips", void 0);
            a([f(cc.Node)], e.prototype, "node_control", void 0);
            a([f(cc.Node)], e.prototype, "pan_control", void 0);
            a([f(cc.Node)], e.prototype, "btn_control", void 0);
            a([f(cc.Node)], e.prototype, "btn_light", void 0);
            a([f(cc.Node)], e.prototype, "node_dir", void 0);
            a([f(cc.Node)], e.prototype, "btn_user", void 0);
            a([f(cc.Node)], e.prototype, "btn_climb", void 0);
            a([f(cc.Sprite)], e.prototype, "img_user", void 0);
            a([f(cc.Sprite)], e.prototype, "img_special", void 0);
            a([f(cc.Node)], e.prototype, "layer_black", void 0);
            a([f(cc.Node)], e.prototype, "layer_dir", void 0);
            a([f(cc.Node)], e.prototype, "m_guideNode", void 0);
            a([f(cc.Node)], e.prototype, "node_save", void 0);
            a([f(cc.Node)], e.prototype, "guidetips_node", void 0);
            a([f(cc.Node)], e.prototype, "camera_part", void 0);
            a([f(cc.Sprite)], e.prototype, "texture_sp", void 0);
            a([f(cc.Prefab)], e.prototype, "itemBox", void 0);
            a([f(cc.Node)], e.prototype, "pan_goods", void 0);
            a([f(cc.Node)], e.prototype, "mask_goods", void 0);
            a([f(sp.Skeleton)], e.prototype, "ani_node", void 0);
            return a([_], e);
        }(s.default);
        o.default = g;
        cc._RF.pop();
    }, {
        "./common/BaseView": "BaseView",
        "./common/ConfManager": "ConfManager",
        "./common/GameData": "GameData",
        "./common/SoundManage": "SoundManage",
        "./common/ToolsManager": "ToolsManager",
        "./common/ViewManager": "ViewManager",
        "./familiar/spineManager": "spineManager",
        "./gameEvent": "gameEvent"
    }],
    gameendDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "cb0971hvm1GCKdrYfgI/h3T", "gameendDialog");
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
        var s = t("../common/PopupView"), r = t("../common/SoundManage"), c = cc._decorator, l = c.ccclass, h = (c.property,
            function (t) {
                n(e, t);
                function e() {
                    return null !== t && t.apply(this, arguments) || this;
                }
                e.prototype.initData = function () { };
                e.prototype.start = function () { };
                e.prototype.sureBack = function () {
                    r.default.stopBGM();
                    setTimeout(function () {
                        cc.game.restart();
                    }, 500);
                };
                return a([l], e);
            }(s.default));
        o.default = h;
        cc._RF.pop();
    }, {
        "../common/PopupView": "PopupView",
        "../common/SoundManage": "SoundManage"
    }],
    gametipsDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "3e00f9Sy6BLTbQ3K9SBM5Ss", "gametipsDialog");
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
        var s = t("../common/GameData"), r = t("../common/PopupView"), c = cc._decorator, l = c.ccclass, h = c.property, d = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.itemcontent = null;
                e.item_sp = null;
                e.focus_sp = null;
                e.ms_font = null;
                return e;
            }
            e.prototype.initData = function (t) {
                this.m_Data = t;
                this.m_tipsData = s.default.gametipsJson[this.m_Data[0] - 1];
                this.m_fontFloatingJs = this.ms_font.getComponent("fontFloating");
            };
            e.prototype.start = function () {
                if (s.default.gametips.length >= s.default.GameTipsMax) this.m_fontFloatingJs.initData(["<size=28><color=#ed892C>提示：</><size=28><color=#fdfaea>当前小节提示次数已用完！</>"]); else {
                    this.itemcontent.children.length > 0 && this.itemcontent.removeAllChildren();
                    for (var t = 0; t < s.default.GameTipsMax; t++) {
                        var e = this.itemcontent.children[t];
                        if (e) {
                            e.ID = t;
                            var o = e.getComponent(cc.Sprite), i = e.getChildByName("image_red"), n = "dialog/gametips/image_xj";
                            if (e.isOpen) i.active = !1; else {
                                n = "dialog/gametips/image_xj1";
                                i.active = !0;
                            }
                            this.setSpriteFrame(o, n);
                        } else {
                            (e = cc.instantiate(this.item_sp)).x = 0;
                            e.ID = t;
                            var a = e.getComponent(cc.Sprite), r = e.getChildByName("image_red");
                            n = "dialog/gametips/image_xj";
                            if (e.isOpen) r.active = !1; else {
                                n = "dialog/gametips/image_xj1";
                                r.active = !0;
                            }
                            this.setSpriteFrame(a, n);
                            this.itemcontent.addChild(e);
                        }
                    }
                    this.focus_sp.node.opacity = 255;
                    var c = this.itemcontent.children[s.default.gametips.length];
                    c.isOpen = !0;
                    var l = c.getComponent(cc.Sprite);
                    c.getChildByName("image_red").active = !1;
                    this.setSpriteFrame(l, "dialog/gametips/image_xj");
                    this.ms_font.active = !0;
                    this.m_fontFloatingJs.initData(["<size=28><color=#ed892C>提示：</><size=28><color=#fdfaea>" + this.m_tipsData.ms + "</>"]);
                    this.setSpriteFrame(this.focus_sp, "item/gametips/" + this.m_tipsData.url);
                }
            };
            e.prototype.itemCallBack = function (t) {
                if (t.target.isOpen) {
                    var e = s.default.gametipsJson[t.target.ID];
                    this.focus_sp.node.opacity = 255;
                    t.target.getChildByName("image_red").active = !1;
                    this.setSpriteFrame(this.focus_sp, "item/gametips/" + e.url);
                    this.ms_font.active = !0;
                    this.m_fontFloatingJs.initData(["<size=28><color=#ed892C>提示：</><size=28><color=#fdfaea>" + this.m_tipsData.ms + "</>"]);
                } else {
                    t.target.getChildByName("image_red").active = !0;
                    this.focus_sp.node.opacity = 64;
                    this.setSpriteFrame(this.focus_sp, "public/dialog/image_wh");
                    this.ms_font.active = !1;
                }
            };
            a([h(cc.Node)], e.prototype, "itemcontent", void 0);
            a([h(cc.Node)], e.prototype, "item_sp", void 0);
            a([h(cc.Sprite)], e.prototype, "focus_sp", void 0);
            a([h(cc.Node)], e.prototype, "ms_font", void 0);
            return a([l], e);
        }(r.default);
        o.default = d;
        cc._RF.pop();
    }, {
        "../common/GameData": "GameData",
        "../common/PopupView": "PopupView"
    }],
    image_sl: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "3fe46kTCg9E3Z7kDHtWLZT5", "image_sl");
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
        var s = t("../common/PopupView"), r = t("../common/SoundManage"), c = t("./spineManager"), l = cc._decorator, h = l.ccclass, d = (l.property,
            function (t) {
                n(e, t);
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    e.m_grenade = 5;
                    e.m_index = .55;
                    return e;
                }
                e.prototype.initData = function (t, e, o, i) {
                    void 0 === i && (i = !1);
                    this.m_callBack = t;
                    this.m_endBack = o;
                    this.m_once = !1;
                    this.m_goods = e;
                    this.m_imgPath = "public/goods/" + e.imgname;
                    this.m_isAbandon = i;
                };
                e.prototype.update = function () { };
                e.prototype.start = function () {
                    var t = this;
                    if (3 == this.m_goods.id) {
                        this.m_dragonBones = this.node.addComponent(c.default);
                        this.m_dragonBones.initData(this.node, "daiji", "scani20", function () { });
                    } else this.setSpriteFrame(this.node.getComponent(cc.Sprite), this.m_imgPath);
                    if (this.m_isAbandon) {
                        var e = this.node.getComponent(cc.RigidBody), o = this.node.getComponent(cc.PhysicsBoxCollider);
                        e.gravityScale = 2;
                        o.sensor = !0;
                        o.apply();
                        1 == this.m_goods.isthrow && this.scheduleOnce(function () {
                            t.node.removeFromParent();
                            t.node.destroy();
                        }, 300);
                    }
                };
                e.prototype.onBeginContact = function (t, e, o) {
                    var i = this;
                    if (999 != o.tag && !o.sensor && 1001 != o.tag) {
                        1 == this.m_goods.id && r.default.playSound("grenadebang.mp3");
                        var n = this.node.getComponent(cc.RigidBody), a = this.node.getComponent(cc.PhysicsBoxCollider);
                        if (2 == n.gravityScale) return;
                        n.gravityScale = 2;
                        a.apply();
                        if (this.m_callBack && !this.m_once) {
                            this.m_once = !0;
                            this.setplay();
                            this.m_callBack();
                        }
                        if (0 == o.tag && !a.sensor) {
                            this.scheduleOnce(function () {
                                i.node.removeComponent(cc.PhysicsBoxCollider);
                                i.node.removeComponent(cc.RigidBody);
                            }, .1);
                            this.node.runAction(cc.rotateTo(.1, 0));
                        }
                    }
                };
                e.prototype.BoomBack = function (t) {
                    var e = this;
                    void 0 === t && (t = 1);
                    var o = 1.5 - this.m_index > 0 ? 1.5 - this.m_index : .08;
                    this.scheduleOnce(function () {
                        e.m_index += .2;
                        e.m_grenade--;
                        e.node.color = e.m_grenade % 2 == 0 ? cc.color(255, 255, 255) : cc.color(255, 30, 10);
                        e.m_grenade >= 0 ? e.BoomBack(0) : e.m_endBack && e.m_endBack();
                    }, o);
                };
                e.prototype.setplay = function () {
                    this.m_dragonBones && this.m_dragonBones.setAction("posui", 1);
                };
                e.prototype.onDestroy = function () {
                    this.unscheduleAllCallbacks();
                };
                return a([h], e);
            }(s.default));
        o.default = d;
        cc._RF.pop();
    }, {
        "../common/PopupView": "PopupView",
        "../common/SoundManage": "SoundManage",
        "./spineManager": "spineManager"
    }],
    itemBox: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "8b5edRS37pK35C6+mF1B4Us", "itemBox");
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
        var s = t("../common/GameData"), r = t("../common/PopupView"), c = t("../common/SoundManage"), l = t("../common/ToolsManager"), h = t("../familiar/DragonBonesManager"), d = t("../familiar/spineManager"), p = t("../gameEvent"), u = t("../role/enemy_ai"), m = t("./loopDrop"), _ = cc._decorator, f = _.ccclass, g = _.property, y = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.node_mount = null;
                e.node_bubble = null;
                e.spine_guide = null;
                e.node_tips = null;
                e.label_tips = null;
                e.node_spine = null;
                e.itemConf = null;
                e.eventData = null;
                e.eventArr = null;
                e.hp = 3;
                e.deadNext = "";
                e.attNext = "";
                e.img_top = null;
                e.isTopLast = !1;
                e.img_blink = null;
                e.isEnemy = !1;
                e.isLastPos = !1;
                e.followType = null;
                e.followY = 0;
                e.m_actickIndex = 0;
                return e;
            }
            e.prototype.start = function () {
                this.node_Guide = [];
            };
            e.prototype.unLock = function (t, e) {
                e && (this.node_bubble.active = !1);
                if (t) {
                    this.itemConf.isHide = !0;
                    this.node.active = !1;
                    p.default.remindHero();
                } else {
                    this.itemConf.lockCount--;
                    if (this.itemConf.lockCount <= 0) {
                        this.itemConf.unlock && "" != this.itemConf.unlock && p.default.checkNext(this.itemConf.unlock, 1);
                        if (1 == this.itemConf.isClimb || 1 == this.itemConf.isOb) {
                            this.m_collider.sensor = !1;
                            this.m_collider.friction = .5;
                            this.m_collider.apply();
                        }
                        if (this.itemConf.isHide) {
                            this.itemConf.isHide = !1;
                            this.node.active = !0;
                        }
                        p.default.remindHero();
                    }
                }
            };
            Object.defineProperty(e.prototype, "lock", {
                get: function () {
                    return this.itemConf.lockCount > 0;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.getConf = function () {
                return this.itemConf;
            };
            e.prototype.getTempConf = function () {
                if (!this.isLastPos) {
                    this.itemConf.x = this.node.x;
                    this.itemConf.y = this.node.y;
                }
                return this.itemConf;
            };
            e.prototype.flipAct = function (t) {
                if (t && "left" != t) {
                    this.node_mount.scaleX = Math.abs(this.node_mount.scaleX);
                    this.node_render.scaleX = Math.abs(this.node_render.scaleX);
                } else {
                    this.node_mount.scaleX = -Math.abs(this.node_mount.scaleX);
                    this.node_render.scaleX = -Math.abs(this.node_render.scaleX);
                }
                this.itemConf.sx = this.node_mount.scaleX;
            };
            e.prototype.blinkAct = function (t) {
                void 0 === t && (t = !1);
                if (!this.img_blink) {
                    this.img_blink = new cc.Node();
                    var e = this.img_blink.addComponent(cc.Sprite), o = this.itemConf.url + "-blink";
                    l.default.setSpriteFrame(e, o);
                    this.img_blink.opacity = 0;
                    this.node_render.addChild(this.img_blink);
                }
                this.img_blink.stopAllActions();
                this.img_blink.opacity = 0;
                var i = cc.repeat(cc.sequence(cc.fadeIn(.5), cc.delayTime(.2), cc.fadeOut(.5)), 5);
                if (t) {
                    var n = cc.repeatForever(i);
                    this.img_blink.runAction(n);
                } else this.img_blink.runAction(i);
            };
            e.prototype.stopBlink = function () {
                if (this.img_blink) {
                    this.img_blink.stopAllActions();
                    this.img_blink.opacity = 0;
                }
            };
            e.prototype.delEvent = function (t) {
                if (this.eventArr) for (var e in this.eventArr) if (this.eventArr[e].index == t) {
                    this.eventArr.splice(e, 1);
                    break;
                }
            };
            e.prototype.findEvent = function (t, e) {
                void 0 === t && (t = null);
                void 0 === e && (e = null);
                if (!this.eventArr) return null;
                for (var o = 0, i = this.eventArr; o < i.length; o++) {
                    var n = i[o];
                    if (t) {
                        if (n.index == t && !n.isFinish) return n;
                    } else if (e && n.key == e && !n.isFinish) return n;
                }
                return null;
            };
            e.prototype.setLastPos = function (t, e) {
                this.itemConf.x = t;
                this.itemConf.y = e;
                this.isLastPos = !0;
            };
            e.prototype.setLastAni = function (t) {
                this.itemConf.lastDz = t;
            };
            e.prototype.setLastDir = function (t) {
                this.itemConf.sx = t && "left" != t ? Math.abs(this.node_mount.scaleX) : -Math.abs(this.node_mount.scaleX);
            };
            e.prototype.setEvent = function (t) {
                this.eventArr = t;
            };
            e.prototype.getEvent = function (t) {
                if (!this.eventArr) return null;
                for (var e = 0, o = this.eventArr; e < o.length; e++) {
                    var i = o[e];
                    if (t) {
                        if (i.index == t && !i.isFinish) {
                            if (this.isTopLast) {
                                this.isTopLast = !1;
                                this.hideTopImg();
                            }
                            this.hideTopGuide();
                            this.followStop();
                            this.eventData = i;
                            return i;
                        }
                    } else if (!i.isFinish) {
                        if (Number(i.key) > 1e3) return null;
                        this.eventData = i;
                        return i;
                    }
                }
                return null;
            };
            e.prototype.getOpType = function () {
                if (!this.eventArr || this.itemConf.lockCount > 0) return null;
                if (this.itemConf.isDrag) return s.default.OP_DRAG;
                for (var t = 0, e = this.eventArr; t < e.length; t++) {
                    var o = e[t];
                    if (!o.isFinish) {
                        if (Number(o.key) > 1e3) return null;
                        var i = Number(o.trigger);
                        if (0 != i && 1 != i) return i;
                    }
                }
                return null;
            };
            e.prototype.switchEvent = function () {
                this.eventData.isFinish = !0;
                this.itemConf.lastEvent = this.eventData.index;
                for (var t = !0, e = 0, o = this.eventArr; e < o.length; e++) {
                    var i = o[e];
                    if (!i.isFinish) {
                        var n = Number(i.trigger);
                        if (0 != n && 1 != n) {
                            var a = this.node_bubble.getChildByName("Background");
                            this.setSpriteFrame(a.getComponent(cc.Sprite), "ui/interact_" + n);
                            t = !1;
                        }
                        break;
                    }
                }
                t && this.setBubble(!1, 0, !1);
            };
            e.prototype.playAni = function (t, e) {
                var o = this;
                console.log(t + "---------- play time " + e);
                if (this.m_dragonBones && (this.m_dragonBones.m_dragonDisplay || this.m_dragonBones.m_skeleton) && this.node_mount) {
                    switch (t) {
                        case "chuihao":
                            c.default.playSound("chuihao.mp3");
                    }
                    this.m_dragonBones.setAction(t, 0 == e ? 1 : 0);
                    e > 0 ? this.scheduleOnce(function () {
                        o.m_dragonBones && o.m_dragonBones.setAction("await", 0);
                    }, e) : -1 == e && (this.itemConf.lastDz = t);
                } else console.log("=没有挂载龙骨动画无法播放请检查！！！==");
            };
            e.prototype.initAni = function (t, e) {
                void 0 === e && (e = null);
                var o = !1, i = t, n = (o = !1, (i = t).split("|"));
                this.m_path = i;
                if (-1 != n[0].indexOf("sp_")) {
                    o = !0;
                    i = n[0].replace("sp_", "");
                }
                if (o) {
                    this.node_mount.addComponent(d.default);
                    this.m_dragonBones = this.node_mount.getComponent(d.default);
                } else {
                    this.node_mount.addComponent(h.default);
                    this.m_dragonBones = this.node_mount.getComponent(h.default);
                }
                var a = null != e ? e : "" == n[1] ? "await" : n[1];
                this.m_dragonBones.initData(this.node_mount, a, i, this.aniComplete.bind(this));
            };
            e.prototype.aniComplete = function (t) {
                switch (this.itemConf.key) {
                    case "scarecrow":
                        switch (t) {
                            case "gongji1":
                                this.m_dragonBones.setAction("daiji2", 1);
                                break;

                            case "gongji2":
                                this.m_dragonBones.setAction("daiji3", 1);
                                break;

                            case "death":
                                this.onclear(this.itemConf.key);
                        }
                        break;

                    default:
                        switch (t) {
                            case "death":
                            case "death1":
                            case "death2":
                                this.onclear(this.itemConf.key);
                        }
                }
                "zhendong" == t && l.default.shockAct();
            };
            e.prototype.setGuideAction = function (t, e) {
                void 0 === e && (e = {
                    x: null,
                    y: null
                });
                switch (t) {
                    case 2:
                        this.spine_guide.node.x = e.x || 0;
                        this.spine_guide.node.y = e.y || 200;
                        this.spine_guide.node.active = !0;
                        this.spine_guide.setAnimation(0, "slidepress1", !0);
                        break;

                    case 3:
                        this.spine_guide.node.x = e.x || 100;
                        this.spine_guide.node.y = e.y || 100;
                        this.spine_guide.node.active = !0;
                        this.spine_guide.setAnimation(0, "slideup1", !0);
                        break;

                    case 4:
                        this.spine_guide.node.x = e.x || -50;
                        this.spine_guide.node.y = e.y || 30;
                        this.spine_guide.node.active = !0;
                        this.spine_guide.setAnimation(0, "slideright1", !0);
                        break;

                    case 5:
                        this.spine_guide.node.x = e.x || 50;
                        this.spine_guide.node.y = e.y || 0;
                        this.spine_guide.node.active = !0;
                        this.spine_guide.setAnimation(0, "slidelelf1", !0);
                        break;

                    case 6:
                    case 7:
                        this.spine_guide.node.x = e.x || 0;
                        this.spine_guide.node.y = e.y || 200;
                        this.spine_guide.node.active = !0;
                        this.spine_guide.setAnimation(0, "slidepress1", !0);
                        break;

                    case 8:
                        p.default.hero_ts.setGuideAction();
                }
            };
            e.prototype.setPaoPos = function (t, e) {
                void 0 === t && (t = null);
                void 0 === e && (e = null);
                null != t && (this.node_bubble.x = t);
                null != e && (this.node_bubble.y = e);
            };
            e.prototype.setPaoSprite = function (t) {
                console.log("------------- setPaoSprite ui/interact_" + t);
                var e = this.node_bubble.getChildByName("Background");
                this.setSpriteFrame(e.getComponent(cc.Sprite), "ui/interact_" + t);
                this.node_bubble.active = !0;
            };
            e.prototype.setBubble = function (t, e, o) {
                void 0 === e && (e = 0);
                void 0 === o && (o = !1);
                t && e > 1 && this.setPaoSprite(e);
                this.node_bubble.active = t;
                e && (this.m_nowOperate = e);
                if (!t && o) {
                    this.spine_guide.node.active = t;
                    p.default.hero_ts.setGuideAction(!0);
                }
            };
            e.prototype.bubbleBack = function () {
                if (p.default.gameManager.btnShield > 0) console.log("----------- 打断连续点击 " + p.default.gameManager.btnShield); else {
                    p.default.gameManager.btnShield = 20;
                    p.default.triggerEvent(this.node, this.m_nowOperate || 1);
                }
            };
            e.prototype.setItemScale = function (t) {
                var e = Math.abs(t);
                this.itemConf.sx = this.node_mount.scaleX < 0 ? -e : e;
                this.itemConf.sy = e;
                this.node_render.scaleX = this.itemConf.sx;
                this.node_render.scaleY = this.itemConf.sy;
                this.node_mount.scaleX = this.itemConf.sx;
                this.node_mount.scaleY = this.itemConf.sy;
            };
            e.prototype.setItemZIndex = function (t) {
                this.itemConf.z = t;
                this.node.zIndex = t;
            };
            e.prototype.setConf = function (t, e) {
                this.itemConf = t;
                (this.itemConf.isHide || this.itemConf.isDead) && (this.node.active = !1);
                this.gameManager = e;
                this.node_render = new cc.Node();
                this.node_render.addComponent(cc.Sprite);
                this.node.addChild(this.node_render);
                "collection" != this.itemConf.key ? "" == t.url || null != t.ani && "goods" != t.key || "initPos" == t.key || l.default.setSpriteFrame(this.node_render.getComponent(cc.Sprite), t.url) : l.default.setSpriteFrame(this.node_render.getComponent(cc.Sprite), "item/items/item" + t.ani);
                this.node_render.angle = Number(t.r);
                this.node_mount.angle = Number(t.r);
                this.node.width = t.width;
                this.node.height = t.height;
                this.node_render.scaleX = t.sx;
                this.node_render.scaleY = t.sy;
                this.node_mount.scaleX = t.sx;
                this.node_mount.scaleY = t.sy;
                this.node_mount.y = -this.node.height / 2 * t.sy;
                this.node.zIndex = t.z;
                var o = t.color;
                if (o && "" != o) {
                    var i = o.split("|");
                    this.node_mount.color = cc.color(Number(i[0]), Number(i[1]), Number(i[2]));
                    this.node_render.color = cc.color(Number(i[0]), Number(i[1]), Number(i[2]));
                }
                this.initItemBox();
            };
            e.prototype.initItemBox = function () {
                var t = this, e = this.itemConf.button;
                if (e) {
                    this.node_bubble.x = e.x;
                    this.node_bubble.y = e.y || 200;
                }
                var o = this.itemConf.box;
                this.m_collider = this.node.getComponent(cc.PhysicsBoxCollider);
                var i = this.node.getComponent(cc.RigidBody);
                if (o && "" != o.width && "" != o.height && 0 != o.width && 0 != o.height) {
                    this.m_collider.size.width = o.width * Math.abs(this.itemConf.sx);
                    this.m_collider.size.height = o.height * Math.abs(this.itemConf.sy);
                    this.m_collider.offset.x = o.x;
                    this.m_collider.offset.y = o.y;
                    if (1 == this.itemConf.isClimb || 1 == this.itemConf.isOb) {
                        this.m_collider.sensor = !1;
                        this.m_collider.friction = .5;
                    }
                    this.itemConf.lockCount > 0 && (this.m_collider.sensor = !0);
                } else {
                    this.node.removeComponent(cc.PhysicsBoxCollider);
                    this.node.removeComponent(cc.RigidBody);
                }
                var n = this.itemConf.lastEvent;
                this.eventArr = this.itemConf.eventTrigger;
                this.eventArr.length;
                for (var a = 0, r = this.eventArr; a < r.length; a++) {
                    var c = r[a], h = s.default.eventConf[c.key], d = Number(h.result);
                    if (40 == d) {
                        console.log("---------- enemy ai " + c.key);
                        this.m_baseEventJs = this.node.addComponent(c.param);
                        this.m_baseEventJs.initData(c, this.node_mount, this);
                        break;
                    }
                    if (d > 1e3) {
                        console.log("---------- enemy ai " + c.key);
                        this.ai_ts = this.node.addComponent(u.default);
                        this.ai_ts.initData(c, d, this.node_mount, this);
                        this.gameManager.addEnemy(this.node, this.itemConf.index);
                        i.enabledContactListener = !0;
                        this.m_collider.apply();
                        if (1001 == d) {
                            this.hp = 1;
                            this.isEnemy = !0;
                        } else 1002 == d && (this.m_collider.tag = s.default.CO_DEATH);
                        break;
                    }
                    if (3 == d || 0 == d && 0 == c.heroTigger) {
                        i.enabledContactListener = !0;
                        if (3 == d) {
                            this.deadNext = c.next;
                            this.attNext = c.param;
                        }
                    }
                    if (4 == d && c.param && "" != c.param) {
                        var p = s.default.goodsConf[c.param];
                        2 == Number(p.isthrow) && l.default.createPrefab("item/itemEffect", function (e) {
                            e.zIndex = -1;
                            t.node.addChild(e);
                        });
                    }
                    var _ = null;
                    if (n && n == c.index) switch (d) {
                        case 15:
                            this.m_collider.sensor = !0;
                            break;

                        case 20:
                            var f = Number(c.playTime);
                            -1 == f && this.showTopImg(c.param, f);
                            break;

                        case 25:
                            c.isFinish && this.node.addComponent(m.default).initData(c.param, c.drop);
                    }
                    this.itemConf.lastDz && (_ = this.itemConf.lastDz);
                }
                null != this.itemConf.ani && "collection" != this.itemConf.key && "goods" != this.itemConf.key && this.initAni(this.itemConf.ani, _);
                this.m_collider.apply();
            };
            e.prototype.getColliderTop = function (t) {
                void 0 === t && (t = !1);
                return t ? this.m_collider.size.height / 2 + this.m_collider.offset.y : this.node.y + this.m_collider.size.height / 2 + this.m_collider.offset.y;
            };
            e.prototype.getColliderBottom = function () {
                return this.node.y - this.m_collider.size.height / 2 + this.m_collider.offset.y;
            };
            e.prototype.getColliderCenter = function () {
                return {
                    x: this.node.x + this.m_collider.offset.x,
                    y: this.node.y + this.m_collider.offset.y
                };
            };
            e.prototype.isEntity = function () {
                return 0 == this.m_collider.sensor;
            };
            e.prototype.setEntity = function (t) {
                this.m_collider.sensor = !t;
                if (t) this.itemConf.isOb = !0; else {
                    this.itemConf.isClimb = !1;
                    this.itemConf.isDrag = !1;
                    this.itemConf.isOb = !1;
                }
                this.m_collider.apply();
            };
            Object.defineProperty(e.prototype, "isClimb", {
                get: function () {
                    return this.itemConf.isClimb;
                },
                enumerable: !1,
                configurable: !0
            });
            Object.defineProperty(e.prototype, "isAttack", {
                get: function () {
                    return this.isEnemy;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.cleanGuide = function () {
                this.itemConf.guide = "";
                this.spine_guide.node.active = !1;
            };
            e.prototype.spriteByState = function (t) {
                var e = this.itemConf.url, o = e.indexOf("-");
                if (-1 != o) {
                    var i = e.substring(o, e.length), n = e.replace(i, "-" + t);
                    l.default.setSpriteFrame(this.node_render.getComponent(cc.Sprite), n);
                    this.itemConf.url = n;
                    console.log("--------- 替换新纹理 " + n);
                } else console.log("--------- 找不到需要替换的新纹理！");
            };
            e.prototype.moveAct = function (t, e, o, i, n) {
                if (n); else {
                    var a, s = Math.abs(this.node_render.scaleX);
                    a = i ? t >= 0 ? s : -s : t >= this.node.x ? s : -s;
                    this.node_mount.scaleX = a;
                    this.itemConf.sx = a;
                }
                if (i) {
                    this.itemConf.x += t;
                    this.itemConf.y += e;
                    this.node.runAction(cc.moveBy(o, cc.v2(t, e)));
                } else {
                    this.itemConf.x = t;
                    this.itemConf.y = e;
                    this.node.runAction(cc.moveTo(o, cc.v2(t, e)));
                }
                this.isLastPos = !0;
            };
            e.prototype.onHit = function (t) {
                this.hp -= t;
                if (!(this.hp <= -1)) {
                    this.m_actickIndex += t;
                    console.log("==itemConf===", this.itemConf.key);
                    switch (this.itemConf.key) {
                        case "scarecrow":
                            if (3 == this.m_actickIndex) {
                                this.m_dragonBones.setAction("death", 1);
                                this.m_actickIndex = 0;
                            } else this.m_dragonBones.setAction("gongji" + this.m_actickIndex, 1);
                            break;

                        default:
                            if (this.ai_ts) {
                                console.log("==敌人组件===", this.ai_ts.m_aniOder);
                                console.log("==敌人组件==111=", this.ai_ts.m_dzMap.death.name1);
                                this.ai_ts.deathCall();
                                this.m_dragonBones.setAction(this.ai_ts.m_dzMap.death.name1, 1);
                            } else this.hp <= 0 && this.onclear();
                    }
                    this.hp > 0 && "" != this.attNext && p.default.checkNext(this.attNext, 1);
                }
            };
            e.prototype.onBreak = function () {
                console.log("------------ onBreak ");
                this.m_dragonBones && this.m_dragonBones.setAction("death", 1);
            };
            e.prototype.onclear = function (t) {
                var e = this;
                void 0 === t && (t = "");
                this.itemConf.isDead = !0;
                if ("" != this.deadNext) {
                    console.log("------------ this.deadNext ", this.deadNext);
                    p.default.recoveryOp();
                    p.default.checkNext(this.deadNext, 1);
                }
                p.default.removeItemBox(this.itemConf.index);
                if ("scarecrow" != t) if (this.ai_ts) {
                    this.node.removeComponent(cc.PhysicsBoxCollider);
                    this.node.removeComponent(cc.RigidBody);
                    this.m_collider.apply();
                    if (1002 != this.ai_ts.aiType) this.scheduleOnce(function () {
                        e.node.removeFromParent();
                        e.node.destroy();
                    }, 4); else {
                        this.node.removeFromParent();
                        this.node.destroy();
                    }
                } else {
                    console.log("------------ removeFromParent ", this.itemConf.index);
                    this.node.removeFromParent();
                    this.node.destroy();
                } else {
                    this.node.removeComponent(cc.PhysicsBoxCollider);
                    this.node.removeComponent(cc.RigidBody);
                    this.m_collider.apply();
                }
            };
            e.prototype.onBeginContact = function (t, e, o) {
                var i = o.tag;
                if (e.tag != s.default.CO_INDUCTION) {
                    if (e.tag != s.default.CO_SHOWATT) switch (i) {
                        case s.default.CO_ATT:
                            this.onHit(1);
                            break;

                        case s.default.CO_BOOM:
                            if (this.itemConf.ani) if (this.ai_ts && 1003 == this.ai_ts.aiType) {
                                this.m_dragonBones.stopAction();
                                this.ai_ts.onDestroy();
                                this.onHit(0);
                            } else this.onBreak(); else this.onclear();
                            break;

                        case s.default.CO_EMP:
                            this.ai_ts ? this.ai_ts.inductionCall(i, o.node, !0) : p.default.triggerEvent(this.node, s.default.OP_TRIGGER);
                            break;

                        default:
                            p.default.triggerEvent(this.node, s.default.OP_TRIGGER);
                    }
                } else {
                    console.log("------- induction tag " + i);
                    this.ai_ts && this.ai_ts.inductionCall(i, o.node);
                }
            };
            e.prototype.addDialog = function (t) {
                var e = this, o = t.txt;
                if (this.node_dialog) {
                    this.node_dialog.getComponent("dialog").initData(o);
                    l.default.fadeAct(this.node_dialog);
                } else this.createPrefab("item/dialog", function (t) {
                    if (t) {
                        t.y = 235 * Math.abs(e.node_render.scaleX);
                        t.x = -10;
                        t.getComponent("dialog").initData(o);
                        e.node_dialog = t;
                        e.node.addChild(t);
                        l.default.fadeAct(e.node_dialog);
                    }
                });
            };
            e.prototype.setGuide = function (t) {
                var e = 0;
                if (t && 0 == this.node_Guide.length) for (var o in t) {
                    var i = s.default.guideJson[Number(t[o]) - 1], n = new cc.Node();
                    n.addComponent(cc.Sprite);
                    this.setSpriteFrame(n.getComponent(cc.Sprite), "guide/" + i.img);
                    console.log("=addGuide=Y" + this.node.height);
                    n.y = this.node.height + e + 70;
                    n.opacity = 0;
                    this.node.addChild(n);
                    n.runAction(cc.fadeIn(.35));
                    e = n.y - 40;
                    this.node_Guide.push(n);
                } else for (var o in this.node_Guide) l.default.fadeAct(this.node_Guide[o], !0);
            };
            e.prototype.showTopImg = function (t, e) {
                var o = this;
                if (!this.img_top) {
                    this.img_top = new cc.Node();
                    this.img_top.addComponent(cc.Sprite);
                    this.img_top.anchorY = 0;
                    this.img_top.y = Math.abs(this.node.height / 2 * this.itemConf.sy) + 40;
                    this.node.addChild(this.img_top);
                }
                this.hideTopImg(!0);
                l.default.createPrefab("guide/guide_" + t, function (t) {
                    o.img_top && o.img_top.addChild(t);
                });
                e > 0 ? this.scheduleOnce(function () {
                    o.hideTopImg();
                }, e) : this.isTopLast = !0;
            };
            e.prototype.hideTopImg = function (t) {
                void 0 === t && (t = !1);
                if (this.img_top) {
                    this.img_top.removeAllChildren();
                    this.img_top.active = t;
                }
            };
            e.prototype.hideTopGuide = function () {
                var t = this.itemConf.guide.split("|"), e = Number(t[0]);
                if (e > 1e3 && e <= 2e3) this.hideTopImg(); else if (e > 2e3) switch (e) {
                    case 2001:
                        this.stopBlink();
                        break;

                    case 2002:
                        this.node.opacity = 255;
                }
            };
            e.prototype.showSpecialGuide = function (t) {
                switch (t) {
                    case 2001:
                        this.blinkAct(!0);
                        break;

                    case 2002:
                        this.node.opacity = 100;
                }
            };
            e.prototype.followHero = function () {
                this.followY = this.node.y - p.default.hero.y;
                var t = p.default.hero_ts.m_scale;
                this.setItemScale(t);
                this.node.zIndex = p.default.hero.zIndex - 1;
                this.schedule(this.followCall, 0);
            };
            e.prototype.followCall = function () {
                var t = this.node.x - p.default.hero.x;
                if (Math.abs(t) > s.default.FOLLOW_RANGE) {
                    if (null == this.followType) {
                        this.followType = t > 0 ? "left" : "right";
                        this.flipAct(this.followType);
                        this.playAni("run", -1);
                    }
                } else if (Math.abs(t) < s.default.FOLLOW_RANGE / 2 && null != this.followType) {
                    this.followType = null;
                    this.playAni("await", -1);
                }
                if (null != this.followType) {
                    this.node.x += "left" == this.followType ? -s.default.SPEED_RUN : s.default.SPEED_RUN;
                    var e = this.node.y - (p.default.hero.y + 52);
                    e = Math.abs(e) > 9 ? e > 0 ? -1.2 : 1.2 : 0;
                    this.node.y += e;
                    this.node.zIndex = p.default.hero.zIndex - 1;
                }
                var o = p.default.hero_ts.m_scale;
                Math.abs(this.node_render.scaleX) != o && this.setItemScale(o);
            };
            e.prototype.followStop = function () {
                this.unschedule(this.followCall);
                this.followType = null;
                this.followY = 0;
                p.default.hero_ts.delFollow(this.itemConf.index);
            };
            e.prototype.setBoxTips = function (t, e, o, i) {
                void 0 === e && (e = null);
                void 0 === o && (o = "");
                void 0 === i && (i = null);
                this.node_tips.active = t;
                this.node_tips.stopAllActions();
                this.node_tips.statr = 1;
                this.label_tips.node.active = !1;
                this.node_spine.node.active = !1;
                if (t) {
                    this.m_eventData = {};
                    if (i) {
                        for (var n in i) this.m_eventData[n] = "pos" == n ? i[n] : Number(i[n]);
                        var a = this.m_eventData.pos.split("|");
                        this.node_tips.x = a[0];
                        this.node_tips.y = a[1];
                    }
                    var r = this.node_tips.getChildByName("node_sprite").getComponent(cc.Sprite);
                    if (this.node_tips.active) {
                        r.spriteFrame = null;
                        if ("label" == e) {
                            var c = s.default.plotConf[o];
                            if (!c) return;
                            this.label_tips.node.active = !0;
                            this.label_tips.string = c.txt;
                        } else if ("img" == e) {
                            l.default.setSpriteFrame(r, o);
                            this.node_tips.getChildByName("node_sprite").active = !0;
                        }
                        if (0 == this.m_eventData.num && 0 == this.m_eventData.times && 0 == this.m_eventData.interval) this.node_tips.active = !0; else {
                            this.node_tips.statr = this.m_eventData.num ? 0 : -1;
                            this.setNodeAction();
                        }
                    }
                }
            };
            e.prototype.setNodeAction = function () {
                var t = this;
                if (1 != this.node_tips.statr) {
                    this.node_tips.active = !0;
                    this.node_tips.runAction(cc.sequence(cc.delayTime(this.m_eventData.times), cc.callFunc(function () {
                        t.node_tips.active = !1;
                        if (-1 != t.node_tips.statr) {
                            t.m_eventData.num--;
                            if (t.m_eventData.num <= 0) {
                                t.node_tips.stopAllActions();
                                return;
                            }
                        }
                        t.scheduleOnce(function () {
                            t.setNodeAction();
                        }, t.m_eventData.interval);
                    })));
                }
            };
            e.prototype.onDestroy = function () {
                this.unscheduleAllCallbacks();
            };
            e.prototype.addDragonBones = function (t) {
                var e = this;
                if (t != this.m_path) if (this.node_mount.getComponent(sp.Skeleton)) {
                    this.m_path = t;
                    this.node_mount.removeComponent(sp.Skeleton);
                    if (this.node_mount.getComponent(d.default)) {
                        this.node_mount.removeComponent(d.default);
                        this.m_dragonBones = null;
                    }
                    this.scheduleOnce(function () {
                        e.initAni(e.m_path, "await");
                    }, .1);
                } else console.log("==未挂载龙骨=请检查=");
            };
            a([g(cc.Node)], e.prototype, "node_mount", void 0);
            a([g(cc.Node)], e.prototype, "node_bubble", void 0);
            a([g(sp.Skeleton)], e.prototype, "spine_guide", void 0);
            a([g(cc.Node)], e.prototype, "node_tips", void 0);
            a([g(cc.Label)], e.prototype, "label_tips", void 0);
            a([g(sp.Skeleton)], e.prototype, "node_spine", void 0);
            return a([f], e);
        }(r.default);
        o.default = y;
        cc._RF.pop();
    }, {
        "../common/GameData": "GameData",
        "../common/PopupView": "PopupView",
        "../common/SoundManage": "SoundManage",
        "../common/ToolsManager": "ToolsManager",
        "../familiar/DragonBonesManager": "DragonBonesManager",
        "../familiar/spineManager": "spineManager",
        "../gameEvent": "gameEvent",
        "../role/enemy_ai": "enemy_ai",
        "./loopDrop": "loopDrop"
    }],
    itemDrop: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "b69a2TjFIlKGJkGW9E/rYFP", "itemDrop");
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
        var s = t("../common/GameData"), r = t("../common/ToolsManager"), c = t("../common/SoundManage"), l = t("../gameEvent"), h = cc._decorator, d = h.ccclass, p = (h.property,
            function (t) {
                n(e, t);
                function e() {
                    return null !== t && t.apply(this, arguments) || this;
                }
                e.prototype.start = function () { };
                e.prototype.initData = function (t, e) {
                    this.m_type = t;
                    this.m_dropData = e;
                    var o = t.split("|");
                    if ("item" == o[0]) {
                        this.m_posAry = this.m_dropData.pos.split(",");
                        if (this.m_posAry.length > 0) {
                            var i = this.m_posAry[0].split("|");
                            this.createItemDrop(this.m_type.split("|"), {
                                x: i[0],
                                y: i[1]
                            });
                        }
                    } else switch (o[1]) {
                        case "grenade":
                            this.createDrop();
                    }
                };
                e.prototype.createItemDrop = function (t, e) {
                    var o = this, i = new cc.Node(), n = i.addComponent(cc.Sprite), a = "", s = new cc.Node(), c = s.addComponent(cc.Sprite), l = "";
                    switch (Number(t[1])) {
                        case 1:
                        case 2:
                            a = "public/goods/paijipaodan";
                            l = "public/goods/image_qq2";
                    }
                    r.default.setSpriteFrame(n, a);
                    r.default.setSpriteFrame(c, l);
                    i.x = Number(e.x);
                    i.y = Number(e.y);
                    s.x = Number(e.x);
                    this.node.addChild(s);
                    this.node.addChild(i);
                    var h = Number(this.m_dropData.time);
                    s.runAction(cc.scaleTo(h, 1.2));
                    var d = cc.moveBy(h, cc.v2(0, -i.y));
                    i.runAction(cc.sequence(d, cc.callFunc(function () {
                        s.removeFromParent();
                        i.removeFromParent();
                        r.default.createPrefab("effect/explodeBox", function (t) {
                            if (t) {
                                var i = t.getComponent("explodeBox");
                                i.initData();
                                t.x = Number(e.x);
                                t.y = 30;
                                o.node.addChild(t);
                                i.clear();
                            }
                        });
                    })));
                    this.m_posAry.shift();
                    this.m_posAry.length > 0 && this.scheduleOnce(function () {
                        var t = o.m_posAry[0].split("|");
                        o.createItemDrop(o.m_type.split("|"), {
                            x: t[0],
                            y: t[1]
                        });
                    }, this.m_dropData.interval);
                };
                e.prototype.createDrop = function () {
                    var t = this;
                    r.default.createPrefab("throw/image_sl", function (e) {
                        e.x = 400;
                        e.y = 200;
                        var o = e.getComponent("image_sl");
                        l.default.gameManager.m_throwNode = e;
                        o.m_grenade = 1;
                        o.initData(function () {
                            o.BoomBack();
                        }, s.default.goodsConf.prop1, function () {
                            c.default.playSound("grenadeboom.mp3");
                            r.default.shockAct();
                            l.default.gameManager.createExplodeBox(t.node, !1);
                        });
                        t.node.addChild(e);
                        var i = cc.rotateBy(.5, 360), n = cc.repeat(i, 1.5);
                        e.runAction(n);
                        var a = [cc.v2(e.x, e.y), cc.v2(50, 50), cc.v2(0, -Number(t.m_dropData.y))], h = Number(t.m_dropData.time), d = cc.bezierTo(h, a);
                        e.runAction(d);
                    });
                };
                e.prototype.insPoint = function () {
                    var t = new cc.Node();
                    t.addComponent(cc.Sprite);
                    var e = t.getComponent(cc.Sprite);
                    r.default.setSpriteFrame(e, "public/image_tz5");
                    return t;
                };
                return a([d], e);
            }(cc.Component));
        o.default = p;
        cc._RF.pop();
    }, {
        "../common/GameData": "GameData",
        "../common/SoundManage": "SoundManage",
        "../common/ToolsManager": "ToolsManager",
        "../gameEvent": "gameEvent"
    }],
    itemEventObj: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "b59e0qD9MdFdLEqVKt6CqgC", "itemEventObj");
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
        var s = t("./common/GameData"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.lb_id = null;
                e.lb_explain = null;
                e.eb_param = null;
                e.eb_specialParam = null;
                e.eb_next = null;
                e.eb_trigger = null;
                e.toggle_loop = null;
                e.att_scale = null;
                e.eb_last = null;
                e.node_move = null;
                e.eb_x = null;
                e.eb_y = null;
                e.eb_time = null;
                e.toggle_op = null;
                e.toggle_unflip = null;
                e.txt_param = null;
                e.txt_specialParam = null;
                e.txt_toggle = null;
                e.eb_op = null;
                e.node_camera = null;
                e.eb_cx = null;
                e.eb_cy = null;
                e.eb_ctime = null;
                e.eb_cscale = null;
                e.tc_cmod = null;
                e.toggle_cunlock = null;
                e.eb_aniTime = null;
                e.node_cameraPart = null;
                e.part_cx = null;
                e.part_cy = null;
                e.part_cscale = null;
                e.part_active = null;
                e.node_ladder = null;
                e.toggle_ladder = null;
                e.toggle_jump = null;
                e.node_door = null;
                e.eb_doorx = null;
                e.eb_doory = null;
                e.node_drop = null;
                e.eb_drop_range = null;
                e.eb_drop_y = null;
                e.eb_drop_space = null;
                e.node_dropOne = null;
                e.eb_dropOne_y = null;
                e.eb_dropOne_time = null;
                e.eb_dropOne_interval = null;
                e.eb_dropOne_pos = null;
                e.eb_delay = null;
                e.eb_limit = null;
                e.eb_limitTigger = null;
                e.eb_cross = null;
                e.toggle_openKnock = null;
                e.toggle_hide = null;
                e.toggle_tigger = null;
                e.toggle_wait = null;
                e.txt_ex = null;
                e.txt_DAni = null;
                e.node_bottom = null;
                e.node_top = null;
                e.node_ai = null;
                e.eb_ai_xmin = null;
                e.eb_ai_xmax = null;
                e.eb_ai_range = null;
                e.eb_ai_space = null;
                e.toggle_ai_right = null;
                e.toggle_reverse = null;
                e.not_editbox = null;
                e.toggle_delguide = null;
                e.editBox_special = null;
                e.ani_editbox = null;
                e.node_flip = null;
                e.toggle_flipLeft = null;
                e.toggle_flipRight = null;
                e.toggle_dirLeft = null;
                e.eb_timing_1 = null;
                e.eb_timing_2 = null;
                e.eb_timing_3 = null;
                e.eb_timingFrame = null;
                e.eb_timingDelay = null;
                e.node_sound = null;
                e.toggle_bgm = null;
                e.toggle_stop = null;
                e.eb_soundTime = null;
                e.eb_soundpos = null;
                e.node_drag = null;
                e.eb_dragRange = null;
                e.eb_dragTime = null;
                e.eb_dragX = null;
                e.toggle_dragRight = null;
                e.node_bubble = null;
                e.eb_num = null;
                e.eb_times = null;
                e.eb_interval = null;
                e.eb_pos = null;
                e.node_black = null;
                e.black_times = null;
                e.eventKey = null;
                e.resultKey = null;
                e.eventIndex = 0;
                return e;
            }
            e.prototype.start = function () { };
            e.prototype.getIndex = function () {
                return this.eventIndex;
            };
            e.prototype.initItemEventObj = function (t, e, o) {
                this.editManager = o;
                this.eventIndex = t.index ? t.index : 0;
                this.eventIndex || (this.eventIndex = e);
                this.lb_id.string = this.eventIndex + "";
                this.eventKey = t.key;
                var i = s.default.eventConf[this.eventKey];
                this.resultKey = Number(i.result);
                this.lb_explain.string = i.explain;
                if (this.resultKey < 1e3) {
                    switch (this.resultKey) {
                        case 1:
                            this.txt_toggle.string = "保持动画";
                            this.toggle_tigger.node.active = !0;
                            this.toggle_tigger.isChecked = null != t.isHoldDz && t.isHoldDz;
                            break;

                        case 2:
                            this.eb_aniTime.node.active = !0;
                            this.eb_aniTime.string = null != t.playTime ? t.playTime : 0;
                            break;

                        case 3:
                            this.txt_param.string = "受击触发";
                            break;

                        case 4:
                            this.txt_toggle.string = "无拾取动作";
                            this.toggle_tigger.node.active = !0;
                            this.toggle_tigger.isChecked = null != t.isNoAct && t.isNoAct;
                            break;

                        case 0:
                            this.txt_param.string = "触发物件";
                            this.toggle_tigger.node.active = !0;
                            this.toggle_tigger.isChecked = null == t.heroTigger || t.heroTigger;
                            break;

                        case 9:
                            this.txt_param.string = "物件/事件";
                            this.toggle_delguide.node.active = !0;
                            this.toggle_delguide.isChecked = null != t.isDelGuide && t.isDelGuide;
                            break;

                        case 10:
                            this.txt_param.string = "物件ID";
                            this.toggle_hide.node.active = !0;
                            this.toggle_hide.isChecked = null != t.isHide && t.isHide;
                            this.txt_toggle.string = "隐藏按钮";
                            this.toggle_tigger.node.active = !0;
                            this.toggle_tigger.isChecked = null != t.isHideButton && t.isHideButton;
                            break;

                        case 6:
                            this.txt_param.string = "操作物件";
                            this.eb_op.node.active = !0;
                            this.eb_op.string = t.op;
                            break;

                        case 7:
                            this.eb_param.node.active = !1;
                            this.node_move.active = !0;
                            var n = t.move;
                            if (n) {
                                this.toggle_op.isChecked = null != n.isOp && n.isOp;
                                this.toggle_unflip.isChecked = null != n.isUnFlip && n.isUnFlip;
                                this.eb_x.string = null == n.x ? "" : n.x;
                                this.eb_y.string = null == n.y ? "" : n.y;
                                this.eb_time.string = n.time;
                            }
                            break;

                        case 8:
                            this.node_ladder.active = !0;
                            this.toggle_jump.isChecked = !!t.jumpRight && t.jumpRight;
                            this.toggle_ladder.isChecked = !!t.ladderRight && t.ladderRight;
                            break;

                        case 11:
                            this.eb_param.node.active = !1;
                            this.node_camera.active = !0;
                            var a = t.camera;
                            if (a) {
                                this.eb_cx.string = null == a.x ? "" : a.x + o.gameWidth / 2 + "";
                                this.eb_cy.string = null == a.y ? "" : o.gameHeight / 2 - a.y + "";
                                this.eb_ctime.string = a.time;
                                this.eb_cscale.string = a.scale;
                                this.toggle_cunlock.isChecked = null != a.unlock && a.unlock;
                                var r = this.tc_cmod.node.children;
                                for (var c in r) if (a.mod == Number(c)) {
                                    r[c].getComponent(cc.Toggle).isChecked = !0;
                                    break;
                                }
                            }
                            break;

                        case 12:
                            this.txt_param.string = "翻转物件";
                            this.node_flip.active = !0;
                            this.toggle_flipLeft.isChecked = null == t.flipDir || "left" == t.flipDir;
                            this.toggle_flipRight.isChecked = "right" == t.flipDir;
                            break;

                        case 13:
                            this.toggle_dirLeft.node.active = !0;
                            this.toggle_dirLeft.isChecked = null != t.dirLeft && t.dirLeft;
                            this.txt_param.string = "地图序号";
                            this.node_door.active = !0;
                            var l = t.door;
                            if (l) {
                                this.eb_doorx.string = l.x;
                                this.eb_doory.string = l.y;
                            }
                            break;

                        case 14:
                            this.txt_param.string = "切换至状态";
                            break;

                        case 15:
                            this.eb_param.node.active = !1;
                            this.toggle_openKnock.node.active = !0;
                            this.toggle_openKnock.isChecked = null != t.openKnock && t.openKnock;
                            break;

                        case 16:
                            this.txt_param.string = "关卡";
                            break;

                        case 17:
                            this.txt_param.string = "行走方式";
                            this.txt_ex.string = "run跑步 walk走路 squat半蹲";
                            this.txt_ex.node.active = !0;
                            break;

                        case 18:
                            this.eb_cross.node.active = !0;
                            this.eb_cross.string = t.cross;
                            break;

                        case 19:
                            this.txt_param.string = "密码";
                            break;

                        case 20:
                            this.eb_aniTime.node.active = !0;
                            this.eb_aniTime.string = null != t.playTime ? t.playTime : 0;
                            this.txt_DAni.active = !1;
                            break;

                        case 21:
                            this.eb_param.node.active = !1;
                            this.toggle_dirLeft.node.active = !0;
                            this.toggle_dirLeft.isChecked = null != t.dirLeft && t.dirLeft;
                            break;

                        case 22:
                            break;

                        case 23:
                            this.txt_toggle.string = "解除等待";
                            this.toggle_tigger.node.active = !0;
                            this.toggle_tigger.isChecked = null != t.relieveWait && t.relieveWait;
                            break;

                        case 25:
                            this.txt_param.string = "掉落类型";
                            this.node_drop.active = !0;
                            var h = t.drop;
                            if (h) {
                                this.eb_drop_range.string = h.range;
                                this.eb_drop_y.string = h.y;
                                this.eb_drop_space.string = h.space;
                            }
                            break;

                        case 26:
                            this.txt_param.string = "动画名";
                            break;

                        case 27:
                            this.eb_param.node.active = !1;
                            this.node_cameraPart.active = !0;
                            var d = t.camera_part;
                            if (d) {
                                this.part_cx.string = null == d.x ? "" : d.x + o.gameWidth / 2 + "";
                                this.part_cy.string = null == d.y ? "" : o.gameHeight / 2 - d.y + "";
                                this.part_cscale.string = d.scale;
                                this.part_active.isChecked = d._active;
                            }
                            break;

                        case 28:
                            this.eb_specialParam.node.active = !0;
                            break;

                        case 29:
                            this.txt_param.string = "x偏移";
                            this.txt_toggle.string = "对齐后朝左";
                            this.toggle_tigger.node.active = !0;
                            this.toggle_tigger.isChecked = null != t.alignLeft && t.alignLeft;
                            break;

                        case 30:
                            this.txt_param.string = "层级";
                            this.att_scale.node.active = !0;
                            this.att_scale.string = t.att_scale ? t.att_scale : 1;
                            break;

                        case 33:
                            this.txt_ex.string = "left锁定朝左 right锁定朝右 不填取消锁定";
                            this.txt_ex.node.active = !0;
                            break;

                        case 34:
                            this.txt_param.string = "掉落物类型";
                            this.node_dropOne.active = !0;
                            var p = t.dropOne;
                            if (p) {
                                this.eb_dropOne_y.string = p.y ? p.y : 0;
                                this.eb_dropOne_time.string = p.time ? p.time : 0;
                                this.eb_dropOne_pos.string = p.pos ? p.pos : "";
                                this.eb_dropOne_interval.string = p.interval ? p.interval : "1";
                            }
                            break;

                        case 36:
                            this.node_sound.active = !0;
                            var u = t.sound;
                            this.eb_soundTime.string = u.time ? u.time : 0;
                            this.toggle_bgm.isChecked = !!u.bgm && u.bgm;
                            this.toggle_stop.isChecked = !!u.stop && u.stop;
                            var m = "";
                            if (u.soundpos && "" != u.soundpos) {
                                var _ = u.soundpos.split("|");
                                m = Number(_[0]) + o.gameWidth / 2 + "|" + (Number(_[1]) + o.gameWidth / 2) + "|" + (Number(_[2]) + o.gameWidth / 2);
                            }
                            this.eb_soundpos.string = m;
                            break;

                        case 37:
                            this.txt_param.string = "跟随ID";
                            break;

                        case 38:
                            this.txt_param.string = "计时区间";
                            this.eb_timing_1.node.active = !0;
                            this.eb_timing_2.node.active = !0;
                            this.eb_timing_3.node.active = !0;
                            this.eb_timingFrame.node.active = !0;
                            this.eb_timingDelay.node.active = !0;
                            var f = t.timing;
                            if (f) {
                                this.eb_timing_1.string = f[0];
                                this.eb_timing_2.string = f[1];
                                this.eb_timing_3.string = f[2];
                            }
                            var g = t.timingFrame;
                            g && (this.eb_timingFrame.string = g);
                            var y = t.timingDelay;
                            this.eb_timingDelay.string = null != y && "" != y ? y : "0";
                            break;

                        case 39:
                            this.txt_param.string = "节点名";
                            this.txt_specialParam.string = "透明度";
                            this.eb_specialParam.node.active = !0;
                            break;

                        case 42:
                        case 43:
                            this.node_bubble.active = !0;
                            var v = t.bubble;
                            if (v) {
                                this.eb_num.string = v.num ? v.num : "0";
                                this.eb_times.string = v.times ? v.times : "0";
                                this.eb_interval.string = v.interval ? v.interval : "0";
                                this.eb_pos.string = v.pos ? v.pos : "56|300";
                            }
                            break;

                        case 44:
                            this.txt_param.string = "拖拽ID";
                            this.node_drag.active = !0;
                            var b = t.drag;
                            if (b) {
                                this.eb_dragRange.string = b.range;
                                this.eb_dragTime.string = b.time;
                                this.eb_dragX.string = null != b.dragX ? b.dragX : 0;
                                this.toggle_dragRight.isChecked = b.dragRight;
                            }
                            break;

                        case 46:
                            this.txt_specialParam.string = "错误next";
                            this.eb_specialParam.node.active = !0;
                            break;

                        case 47:
                            this.node_black.active = !0;
                            this.black_times.node.active = !0;
                            var C = t.black;
                            C && (this.black_times.string = C.times ? C.times : "0");
                    }
                    this.eb_param.string = t.param ? t.param : "";
                    this.eb_next.string = t.next ? t.next : "";
                    this.toggle_loop.isChecked = !!t.isLoop && t.isLoop;
                    this.eb_trigger.string = t.trigger ? t.trigger : "";
                    this.eb_last.string = t.last ? t.last : "";
                    this.eb_delay.string = t.delay ? t.delay : "";
                    this.toggle_wait.isChecked = null == t.isWait || t.isWait;
                    this.eb_specialParam.string = t.specialParam ? t.specialParam : "";
                    t.limit && (this.eb_limit.string = t.limit);
                    t.limitTigger && (this.eb_limitTigger.string = t.limitTigger);
                } else {
                    this.node_bottom.active = !1;
                    this.node_top.active = !1;
                    this.node_ai.active = !0;
                    this.eb_ai_xmin.string = null == t.xmin ? "" : t.xmin + o.gameWidth / 2 + "";
                    this.eb_ai_xmax.string = null == t.xmax ? "" : t.xmax + o.gameWidth / 2 + "";
                    this.eb_ai_range.string = t.range ? t.range : 0;
                    this.eb_ai_space.string = t.space ? t.space : 0;
                    this.toggle_ai_right.isChecked = !!t.initRight && t.initRight;
                    this.editBox_special.string = t.special || "";
                    this.ani_editbox.string = t.ani || "";
                    this.toggle_reverse.isChecked = !!t.reverse && t.reverse;
                    this.not_editbox.string = t.lamp || "";
                }
            };
            e.prototype.getEventData = function () {
                var t;
                if (this.resultKey < 1e3) {
                    t = {
                        index: this.eventIndex,
                        key: this.eventKey,
                        param: this.eb_param.string,
                        next: this.eb_next.string,
                        isLoop: this.toggle_loop.isChecked,
                        trigger: "" != this.eb_trigger.string ? this.eb_trigger.string : "0",
                        last: "" != this.eb_last.string ? this.eb_last.string : 0,
                        delay: "" != this.eb_delay.string ? this.eb_delay.string : 0,
                        isWait: this.toggle_wait.isChecked,
                        specialParam: this.eb_specialParam.string
                    };
                    "" != this.eb_limit.string && (t.limit = this.eb_limit.string);
                    "" != this.eb_limitTigger.string && (t.limitTigger = this.eb_limitTigger.string);
                    switch (this.resultKey) {
                        case 0:
                            t.heroTigger = this.toggle_tigger.isChecked;
                            break;

                        case 1:
                            t.isHoldDz = this.toggle_tigger.isChecked;
                            break;

                        case 6:
                            t.op = this.eb_op.string;
                            break;

                        case 4:
                            t.isNoAct = this.toggle_tigger.isChecked;
                            break;

                        case 7:
                            var e;
                            e = {
                                x: "" != this.eb_x.string ? Number(this.eb_x.string) : null,
                                y: "" != this.eb_y.string ? Number(this.eb_y.string) : null
                            };
                            t.move = {
                                x: e.x,
                                y: e.y,
                                time: this.eb_time.string,
                                isOp: this.toggle_op.isChecked,
                                isUnFlip: this.toggle_unflip.isChecked
                            };
                            break;

                        case 8:
                            t.jumpRight = this.toggle_jump.isChecked;
                            t.ladderRight = this.toggle_ladder.isChecked;
                            break;

                        case 9:
                            t.isDelGuide = this.toggle_delguide.isChecked;
                            break;

                        case 10:
                            t.isHide = this.toggle_hide.isChecked;
                            t.isHideButton = this.toggle_tigger.isChecked;
                            break;

                        case 11:
                            var o = 0, i = this.tc_cmod.node.children;
                            for (var n in i) if (i[n].getComponent(cc.Toggle).isChecked) {
                                o = Number(n);
                                break;
                            }
                            var a = this.changePosToData({
                                x: this.eb_cx.string,
                                y: this.eb_cy.string
                            });
                            t.camera = {
                                scale: this.eb_cscale.string,
                                x: a.x,
                                y: a.y,
                                time: this.eb_ctime.string,
                                mod: o,
                                unlock: this.toggle_cunlock.isChecked
                            };
                            break;

                        case 12:
                            t.flipDir = this.toggle_flipLeft.isChecked ? "left" : "right";
                            break;

                        case 2:
                        case 20:
                            t.playTime = this.eb_aniTime.string;
                            break;

                        case 21:
                            t.dirLeft = this.toggle_dirLeft.isChecked;
                            break;

                        case 13:
                            t.dirLeft = this.toggle_dirLeft.isChecked;
                            t.door = {
                                x: this.eb_doorx.string,
                                y: this.eb_doory.string
                            };
                            break;

                        case 15:
                            t.openKnock = this.toggle_openKnock.isChecked;
                            break;

                        case 18:
                            t.cross = this.eb_cross.string;
                            break;

                        case 23:
                            t.relieveWait = this.toggle_tigger.isChecked;
                            break;

                        case 25:
                            t.drop = {
                                range: this.eb_drop_range.string,
                                y: this.eb_drop_y.string,
                                space: this.eb_drop_space.string
                            };
                            break;

                        case 27:
                            var s = this.changePosToData({
                                x: this.part_cx.string,
                                y: this.part_cy.string
                            });
                            t.camera_part = {
                                scale: this.part_cscale.string,
                                x: s.x,
                                y: s.y,
                                _active: this.part_active.isChecked
                            };
                            break;

                        case 29:
                            t.alignLeft = this.toggle_tigger.isChecked;
                            break;

                        case 30:
                            t.att_scale = this.att_scale.string;
                            break;

                        case 34:
                            t.dropOne = {
                                y: this.eb_dropOne_y.string,
                                time: this.eb_dropOne_time.string,
                                interval: this.eb_dropOne_interval.string,
                                pos: this.eb_dropOne_pos.string
                            };
                            break;

                        case 36:
                            var r = "";
                            if ("" != this.eb_soundpos.string) {
                                var c = this.eb_soundpos.string.split("|"), l = this.changePosToData({
                                    x: c[0],
                                    y: 0
                                }), h = this.changePosToData({
                                    x: c[1],
                                    y: 0
                                }), d = this.changePosToData({
                                    x: c[2],
                                    y: 0
                                });
                                r = l.x + "|" + h.x + "|" + d.x;
                            }
                            t.sound = {
                                time: this.eb_soundTime.string,
                                bgm: this.toggle_bgm.isChecked,
                                stop: this.toggle_stop.isChecked,
                                soundpos: r
                            };
                            break;

                        case 38:
                            t.timing = [this.eb_timing_1.string, this.eb_timing_2.string, this.eb_timing_3.string];
                            t.timingFrame = this.eb_timingFrame.string;
                            t.timingDelay = "" == this.eb_timingDelay.string ? 0 : Number(this.eb_timingDelay.string);
                            break;

                        case 42:
                        case 43:
                            t.bubble = {
                                num: this.eb_num.string,
                                times: this.eb_times.string,
                                interval: this.eb_interval.string,
                                pos: this.eb_pos.string
                            };
                            break;

                        case 44:
                            t.drag = {
                                dragX: this.eb_dragX.string,
                                range: this.eb_dragRange.string,
                                time: this.eb_dragTime.string,
                                dragRight: this.toggle_dragRight.isChecked
                            };
                            break;

                        case 47:
                            t.black = {
                                times: this.black_times.string
                            };
                    }
                } else {
                    var p = "" == this.eb_ai_xmin.string ? null : Number(this.eb_ai_xmin.string) - this.editManager.gameWidth / 2, u = "" == this.eb_ai_xmax.string ? null : Number(this.eb_ai_xmax.string) - this.editManager.gameWidth / 2;
                    t = {
                        index: this.eventIndex,
                        key: this.eventKey,
                        xmin: p,
                        xmax: u,
                        range: Number(this.eb_ai_range.string),
                        space: Number(this.eb_ai_space.string),
                        initRight: this.toggle_ai_right.isChecked,
                        special: this.editBox_special.string,
                        ani: this.ani_editbox.string,
                        reverse: this.toggle_reverse.isChecked,
                        lamp: this.not_editbox.string
                    };
                }
                return t;
            };
            e.prototype.changePosToData = function (t) {
                var e = null, o = null;
                "" != t.x && (e = Number(t.x) - this.editManager.gameWidth / 2);
                "" != t.y && (o = -(Number(t.y) - this.editManager.gameHeight / 2));
                return {
                    x: e,
                    y: o
                };
            };
            e.prototype.moveUp = function () {
                this.editManager.moveUpEvent(this.node);
            };
            e.prototype.delObj = function () {
                this.node.destroy();
            };
            a([l(cc.Label)], e.prototype, "lb_id", void 0);
            a([l(cc.Label)], e.prototype, "lb_explain", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_param", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_specialParam", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_next", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_trigger", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_loop", void 0);
            a([l(cc.EditBox)], e.prototype, "att_scale", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_last", void 0);
            a([l(cc.Node)], e.prototype, "node_move", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_x", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_y", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_time", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_op", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_unflip", void 0);
            a([l(cc.Label)], e.prototype, "txt_param", void 0);
            a([l(cc.Label)], e.prototype, "txt_specialParam", void 0);
            a([l(cc.Label)], e.prototype, "txt_toggle", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_op", void 0);
            a([l(cc.Node)], e.prototype, "node_camera", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_cx", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_cy", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_ctime", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_cscale", void 0);
            a([l(cc.ToggleContainer)], e.prototype, "tc_cmod", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_cunlock", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_aniTime", void 0);
            a([l(cc.Node)], e.prototype, "node_cameraPart", void 0);
            a([l(cc.EditBox)], e.prototype, "part_cx", void 0);
            a([l(cc.EditBox)], e.prototype, "part_cy", void 0);
            a([l(cc.EditBox)], e.prototype, "part_cscale", void 0);
            a([l(cc.Toggle)], e.prototype, "part_active", void 0);
            a([l(cc.Node)], e.prototype, "node_ladder", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_ladder", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_jump", void 0);
            a([l(cc.Node)], e.prototype, "node_door", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_doorx", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_doory", void 0);
            a([l(cc.Node)], e.prototype, "node_drop", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_drop_range", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_drop_y", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_drop_space", void 0);
            a([l(cc.Node)], e.prototype, "node_dropOne", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dropOne_y", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dropOne_time", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dropOne_interval", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dropOne_pos", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_delay", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_limit", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_limitTigger", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_cross", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_openKnock", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_hide", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_tigger", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_wait", void 0);
            a([l(cc.Label)], e.prototype, "txt_ex", void 0);
            a([l(cc.Node)], e.prototype, "txt_DAni", void 0);
            a([l(cc.Node)], e.prototype, "node_bottom", void 0);
            a([l(cc.Node)], e.prototype, "node_top", void 0);
            a([l(cc.Node)], e.prototype, "node_ai", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_ai_xmin", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_ai_xmax", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_ai_range", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_ai_space", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_ai_right", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_reverse", void 0);
            a([l(cc.EditBox)], e.prototype, "not_editbox", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_delguide", void 0);
            a([l(cc.EditBox)], e.prototype, "editBox_special", void 0);
            a([l(cc.EditBox)], e.prototype, "ani_editbox", void 0);
            a([l(cc.Node)], e.prototype, "node_flip", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_flipLeft", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_flipRight", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_dirLeft", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_timing_1", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_timing_2", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_timing_3", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_timingFrame", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_timingDelay", void 0);
            a([l(cc.Node)], e.prototype, "node_sound", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_bgm", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_stop", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_soundTime", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_soundpos", void 0);
            a([l(cc.Node)], e.prototype, "node_drag", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dragRange", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dragTime", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dragX", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_dragRight", void 0);
            a([l(cc.Node)], e.prototype, "node_bubble", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_num", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_times", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_interval", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_pos", void 0);
            a([l(cc.Node)], e.prototype, "node_black", void 0);
            a([l(cc.EditBox)], e.prototype, "black_times", void 0);
            return a([c], e);
        }(cc.Component);
        o.default = h;
        cc._RF.pop();
    }, {
        "./common/GameData": "GameData"
    }],
    itemObj: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "3483dBCLMVJkYL5r++cqaW/", "itemObj");
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
        var s = t("./common/ToolsManager"), r = t("./familiar/DragonBonesManager"), c = t("./familiar/spineManager"), l = cc._decorator, h = l.ccclass, d = l.property, p = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.lb_index = null;
                e.eb_name = null;
                e.eb_x = null;
                e.eb_y = null;
                e.eb_z = null;
                e.eb_r = null;
                e.eb_sx = null;
                e.eb_sy = null;
                e.n_create = null;
                e.n_update = null;
                e.n_select = null;
                e.toggle_climb = null;
                e.assObj = null;
                e.assBox = null;
                e.assMount = null;
                e.assDragonBones = null;
                e.assButton = null;
                e.toggle_trigger = null;
                e.eb_id = null;
                e.toggle_loop = null;
                e.eb_door = null;
                e.toggle_drag = null;
                e.toggle_ob = null;
                e.toggle_ani = null;
                e.eb_ani = null;
                e.eb_bwidth = null;
                e.eb_bheight = null;
                e.eb_bx = null;
                e.eb_by = null;
                e.eb_button_bx = null;
                e.eb_button_by = null;
                e.txt_box = null;
                e.txt_button = null;
                e.toggle_lock = null;
                e.eb_lock = null;
                e.eb_unlock = null;
                e.toggle_hide = null;
                e.eb_guide = null;
                e.node_toggle = null;
                e.node_hero = null;
                e.eb_heroani = null;
                e.eb_herogo = null;
                e.toggle_dirLeft = null;
                e.eb_face = null;
                e.eb_color = null;
                return e;
            }
            e.prototype.start = function () {
                this.n_select.active = !1;
            };
            Object.defineProperty(e.prototype, "isCreate", {
                get: function () {
                    return null != this.assObj;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.isAniCall = function (t) {
                var e = t.isChecked;
                this.eb_ani.node.active = e;
            };
            e.prototype.isLockCall = function (t) {
                var e = t.isChecked;
                this.eb_lock.node.active = e;
                this.eb_unlock.node.active = e;
            };
            e.prototype.isDoorCall = function () { };
            e.prototype.updateDoor = function () { };
            e.prototype.isTriggerCall = function (t) {
                var e = t.isChecked;
                this.eb_id.node.active = e;
            };
            e.prototype.addEvent = function (t) {
                this.itemData.eventTrigger = t;
            };
            e.prototype.setEvent = function (t, e) {
                if (null == e) 1 == t ? this.itemData.eventPre = {} : 2 == t && (this.itemData.eventTrigger = {}); else for (var o in e) if (1 == t) {
                    null == this.itemData.eventPre && (this.itemData.eventPre = {});
                    1 == e[o] && (this.itemData.eventPre[o] = 1);
                } else if (2 == t) {
                    null == this.itemData.eventTrigger && (this.itemData.eventTrigger = {});
                    1 == e[o] && (this.itemData.eventTrigger[o] = 1);
                }
                this.editManager.refreshParam(this.itemData);
            };
            e.prototype.getData = function () {
                return this.itemData;
            };
            e.prototype.getConf = function () {
                if (this.assObj) {
                    this.itemData.isClimb = this.toggle_climb.isChecked;
                    this.itemData.isLoop = this.toggle_loop.isChecked;
                    this.itemData.isOb = this.toggle_ob.isChecked;
                    this.itemData.isDrag = this.toggle_drag.isChecked;
                    this.toggle_ani.isChecked && "" != this.eb_ani.string ? this.itemData.ani = this.eb_ani.string : this.itemData.ani = null;
                    if (this.toggle_lock.isChecked && "" != this.eb_lock.string) {
                        this.itemData.lockCount = Number(this.eb_lock.string);
                        this.itemData.unlock = this.eb_unlock.string;
                    } else this.itemData.lockCount = 0;
                    this.itemData.isLock = this.toggle_lock.isChecked;
                    this.itemData.isHide = this.toggle_hide.isChecked;
                    this.itemData.guide = this.eb_guide.string;
                    this.itemData.width = this.assObj.width;
                    this.itemData.height = this.assObj.height;
                    this.itemData.color = this.eb_color.string;
                    this.itemData.name = this.eb_name.string;
                    if ("initPos" == this.itemData.key) {
                        this.itemData.heroAni = this.eb_heroani.string;
                        this.itemData.heroGo = this.eb_herogo.string;
                        this.itemData.initLeft = this.toggle_dirLeft.isChecked;
                        this.itemData.heroface = this.eb_face.string;
                    }
                    return this.itemData;
                }
                return null;
            };
            e.prototype.showSelect = function (t) {
                this.n_select.active = t;
            };
            Object.defineProperty(e.prototype, "itemName", {
                get: function () {
                    return this.itemData.name;
                },
                enumerable: !1,
                configurable: !0
            });
            Object.defineProperty(e.prototype, "itemIndex", {
                get: function () {
                    return this.itemData.index;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.initItemObj = function (t, e, o, i) {
                this.itemData = e;
                this.itemData.key = t;
                this.itemData.eventPre = e.eventPre ? e.eventPre : null;
                this.itemData.eventTrigger = e.eventTrigger ? e.eventTrigger : [];
                this.editManager = i;
                this.lb_index.string = o;
                this.itemData.index = o;
                this.eb_name.string = this.itemData.name;
                this.eb_x.string = (null != e.x ? e.x + i.gameWidth / 2 : 0) + "";
                this.eb_y.string = (null != e.y ? i.gameHeight / 2 - e.y : 0) + "";
                this.eb_z.string = null != e.z ? e.z : "";
                this.eb_r.string = null != e.r ? e.r : 0;
                this.eb_sx.string = (e.sx ? e.sx : 1) + "";
                this.eb_sy.string = (e.sy ? e.sy : 1) + "";
                this.eb_bwidth.string = e.box ? e.box.width : "";
                this.eb_bheight.string = e.box ? e.box.height : "";
                this.eb_bx.string = e.box ? e.box.x : 0;
                this.eb_by.string = e.box ? e.box.y : 0;
                this.eb_button_bx.string = e.button ? e.button.x : 0;
                this.eb_button_by.string = e.button ? e.button.y : 0;
                this.eb_guide.string = e.guide ? e.guide : "";
                this.itemData.color && (this.eb_color.string = this.itemData.color);
                if ("initPos" == t) {
                    this.txt_box.active = !1;
                    this.txt_button.active = !1;
                    this.node_toggle.active = !1;
                    this.node_hero.active = !0;
                    this.itemData.heroAni && (this.eb_heroani.string = this.itemData.heroAni);
                    this.itemData.heroGo && (this.eb_herogo.string = this.itemData.heroGo);
                    this.itemData.heroface && (this.eb_face.string = this.itemData.heroface);
                    this.toggle_dirLeft.isChecked = null != this.itemData.initLeft && this.itemData.initLeft;
                }
                null != this.itemData.isDrag && (this.toggle_drag.isChecked = this.itemData.isDrag);
                null != this.itemData.isClimb && (this.toggle_climb.isChecked = this.itemData.isClimb);
                null != this.itemData.isLoop && (this.toggle_loop.isChecked = this.itemData.isLoop);
                null != this.itemData.isOb && (this.toggle_ob.isChecked = this.itemData.isOb);
                if (this.itemData.lockCount) {
                    this.toggle_lock.isChecked = !0;
                    this.eb_lock.node.active = !0;
                    this.eb_lock.string = this.itemData.lockCount;
                    this.eb_unlock.node.active = !0;
                    this.eb_unlock.string = this.itemData.unlock || "";
                }
                null != this.itemData.isLock && (this.toggle_lock.isChecked = this.itemData.isLock);
                if (null != this.itemData.ani) {
                    this.toggle_ani.isChecked = !0;
                    this.eb_ani.node.active = !0;
                    this.eb_ani.string = this.itemData.ani;
                }
                null != this.itemData.isHide && (this.toggle_hide.isChecked = this.itemData.isHide);
                this.n_update.active = !1;
            };
            e.prototype.createAss = function () {
                if (!this.assObj) {
                    this.assObj = new cc.Node();
                    var t = this.assObj.addComponent(cc.Sprite);
                    "goods" == this.itemData.key && this.toggle_ani.isChecked && "" != this.eb_ani.string && (this.itemData.url = "public/goods/" + this.eb_ani.string);
                    "" != this.itemData.url ? s.default.setSpriteFrame(t, this.itemData.url) : s.default.setSpriteFrame(t, "item/trigger");
                    "initPos" == this.itemData.key && (this.assObj.anchorY = 0);
                    this.updatePos();
                    var e = new cc.Node(), o = e.addComponent(cc.Label);
                    o.string = this.itemData.index;
                    o.fontSize = 27;
                    e.zIndex = 999;
                    this.assObj.addChild(e);
                    this.editManager.addGameItem(this.assObj, this.node);
                    this.n_create.active = !1;
                    this.n_update.active = !0;
                }
            };
            e.prototype.updatePos = function () {
                var t = this;
                this.itemData.name = this.eb_name.string;
                var e, o = Number(this.eb_x.string) - this.editManager.gameWidth / 2, i = -(Number(this.eb_y.string) - this.editManager.gameHeight / 2);
                this.assObj.setPosition(o, i);
                if ("" == this.eb_z.string) {
                    e = -i;
                    this.eb_z.string = e;
                } else e = Number(this.eb_z.string);
                this.assObj.zIndex = e;
                var n = Number(this.eb_sx.string), a = Number(this.eb_sy.string);
                this.assObj.scaleX = n;
                this.assObj.scaleY = a;
                this.itemData.x = o;
                this.itemData.y = i;
                this.itemData.z = e;
                this.itemData.sx = n;
                this.itemData.sy = a;
                var r = Number(this.eb_r.string);
                this.assObj.angle = r;
                this.itemData.r = r;
                if ("initPos" != this.itemData.key) {
                    if (!this.assBox) {
                        this.assBox = new cc.Node();
                        var c = this.assBox.addComponent(cc.Sprite);
                        s.default.setSpriteFrame(c, "item/btrigger");
                        this.assObj.addChild(this.assBox);
                    }
                    this.scheduleOnce(function () {
                        var e = "" != t.eb_bwidth.string ? Number(t.eb_bwidth.string) : t.assObj.width, o = "" != t.eb_bheight.string ? Number(t.eb_bheight.string) : t.assObj.height, i = Number(t.eb_bx.string), n = Number(t.eb_by.string);
                        t.eb_bwidth.string = e;
                        t.eb_bheight.string = o;
                        t.assBox.width = e;
                        t.assBox.height = o;
                        t.assBox.x = i;
                        t.assBox.y = n;
                        if (!t.assMount) {
                            t.assMount = new cc.Node();
                            t.assObj.addChild(t.assMount);
                        }
                        t.assMount.y = -t.assObj.height / 2;
                        var a = Number(t.eb_button_bx.string), r = Number(t.eb_button_by.string);
                        if (0 == a && 0 == r) null != t.assButton && (t.assButton.active = !1); else {
                            if (null == t.assButton) {
                                t.assButton = new cc.Node();
                                var c = t.assButton.addComponent(cc.Sprite);
                                s.default.setSpriteFrame(c, "ui/btn_tbgb");
                                t.assObj.addChild(t.assButton);
                            } else t.assButton.active = !0;
                            t.assButton.x = a;
                            t.assButton.y = r;
                        }
                        t.itemData.box = {
                            width: e,
                            height: o,
                            x: i,
                            y: n
                        };
                        t.itemData.button = {
                            x: a,
                            y: r
                        };
                    }, .2);
                    setTimeout(function () { }, 200);
                }
            };
            e.prototype.updataAni = function () {
                if (this.assDragonBones) {
                    this.assMount.getComponent(dragonBones.ArmatureDisplay) ? this.assMount.removeComponent(dragonBones.ArmatureDisplay) : this.assMount.getComponent(sp.Skeleton) && this.assMount.removeComponent(sp.Skeleton);
                    this.assDragonBones && (this.node.getComponent(r.default) ? this.node.removeComponent(r.default) : this.node.getComponent(c.default) && this.node.removeComponent(c.default));
                }
                if (this.toggle_ani.isChecked && "" != this.eb_ani.string) {
                    var t = !1, e = this.eb_ani.string, o = e.split("|");
                    if (-1 != o[0].indexOf("sp_")) {
                        t = !0;
                        e = o[0].replace("sp_", "");
                    }
                    this.assDragonBones = t ? this.node.addComponent(c.default) : this.node.addComponent(r.default);
                    var i = "" == o[1] ? "daiji" : o[1];
                    this.assDragonBones.initData(this.assMount, i, e);
                }
            };
            e.prototype.getPos = function () {
                return this.assObj ? {
                    x: this.itemData.x,
                    y: this.itemData.y
                } : null;
            };
            e.prototype.updateAss = function () {
                if (this.assObj) {
                    this.updatePos();
                    "collection" == this.itemData.key || "goods" == this.itemData.key ? this.updataImg(this.itemData.key) : "goods" != this.itemData.key && this.updataAni();
                }
            };
            e.prototype.updataImg = function (t) {
                if (this.toggle_ani.isChecked && "" != this.eb_ani.string) {
                    var e = this.assObj.addComponent(cc.Sprite);
                    if ("collection" == t) s.default.setSpriteFrame(e, "item/items/item" + this.eb_ani.string); else if ("goods" == t) {
                        this.itemData.url = "public/goods/" + this.eb_ani.string;
                        s.default.setSpriteFrame(e, this.itemData.url);
                    }
                }
            };
            e.prototype.delObj = function () {
                this.editManager.delObjCall(this.node);
            };
            e.prototype.delSelf = function () {
                this.assObj && this.assObj.destroy();
                this.node.destroy();
            };
            a([d(cc.Label)], e.prototype, "lb_index", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_name", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_x", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_y", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_z", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_r", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_sx", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_sy", void 0);
            a([d(cc.Node)], e.prototype, "n_create", void 0);
            a([d(cc.Node)], e.prototype, "n_update", void 0);
            a([d(cc.Node)], e.prototype, "n_select", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_climb", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_trigger", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_id", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_loop", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_door", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_drag", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_ob", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_ani", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_ani", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_bwidth", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_bheight", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_bx", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_by", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_button_bx", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_button_by", void 0);
            a([d(cc.Node)], e.prototype, "txt_box", void 0);
            a([d(cc.Node)], e.prototype, "txt_button", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_lock", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_lock", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_unlock", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_hide", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_guide", void 0);
            a([d(cc.Node)], e.prototype, "node_toggle", void 0);
            a([d(cc.Node)], e.prototype, "node_hero", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_heroani", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_herogo", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_dirLeft", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_face", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_color", void 0);
            return a([h], e);
        }(cc.Component);
        o.default = p;
        cc._RF.pop();
    }, {
        "./common/ToolsManager": "ToolsManager",
        "./familiar/DragonBonesManager": "DragonBonesManager",
        "./familiar/spineManager": "spineManager"
    }],
    loadScene: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "7aebeC9Z5dB9L23VnKPQcPk", "loadScene");
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
        var s = t("./common/BaseView"), r = t("./common/ConfManager"), c = t("./common/GameData"), l = t("./common/SoundManage"), h = t("./gameExternal/externalGame"), d = cc._decorator, p = d.ccclass, u = d.property, m = function (t) {
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
                return e;
            }
            e.prototype.onLoad = function () {
                var t = this, e = cc.sys.localStorage.getItem("longmarch");
                e && (c.default.playData = JSON.parse(e));
                cc.sys.localStorage.getItem("longmarch_first") && (this.m_isFirst = !0);
                this.btn_skip.active = this.m_isFirst;
                this.cg.node.active = !0;
                this.btn_skip.active && this.btn_skip.runAction(cc.fadeIn(1.2));
                this.cg.setCompleteListener(function () {
                    t._onPlayComplete();
                });
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
                };
                cc.resources.loadDir("sound/effect/ui", function () { });
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
                cc.resources.loadDir(t, function (t, o) {
                    e.onProgress(t / o, "加载游戏资源");
                }, function () {
                    e.loadtip.string = "资源加载完成";
                    e.onComplete();
                });
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
                this.m_loadIndex++;
                this.gotoLoginScene();
            };
            e.prototype.loadGameConfig = function () {
                var t = this;
                cc.resources.loadDir("gameConf", function (e, o) {
                    t.onProgress(e / o, "游戏配置加载");
                }, function (e, o) {
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
                });
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
                        this.m_loadIndex++;
                        this.gotoLoginScene();
                }
            };
            e.prototype.skipBack = function () {
                l.default.playSound("ui/back.mp3");
                this.plot_label.node.active = !1;
                this.m_loadIndex++;
                this.gotoLoginScene();
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
        cc._RF.pop();
    }, {
        "./common/BaseView": "BaseView",
        "./common/ConfManager": "ConfManager",
        "./common/GameData": "GameData",
        "./common/SoundManage": "SoundManage",
        "./gameExternal/externalGame": "externalGame"
    }],
    loopDrop: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "127e5YpCPlH/5FLObjlsYaK", "loopDrop");
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
        var s = t("../common/ToolsManager"), r = cc._decorator, c = r.ccclass, l = (r.property,
            function (t) {
                n(e, t);
                function e() {
                    return null !== t && t.apply(this, arguments) || this;
                }
                e.prototype.start = function () { };
                e.prototype.initData = function (t, e) {
                    this.dropType = t;
                    this.dropRange = "" != e.range ? Number(e.range) : 0;
                    this.dropY = "" != e.y ? Number(e.y) : 100;
                    this.dropSpace = "" != e.space ? Number(e.space) : .5;
                    this.schedule(this.createDrop, this.dropSpace);
                };
                e.prototype.createDrop = function () {
                    var t = this;
                    s.default.createPrefab("effect/dropItem", function (e) {
                        e.x = s.default.mt_rand(-t.dropRange / 2, t.dropRange / 2);
                        t.node.addChild(e);
                        e.runAction(cc.sequence(cc.moveBy(t.dropY / 100 * .2, cc.v2(0, -t.dropY)), cc.callFunc(function () {
                            e.removeFromParent();
                        })));
                    });
                };
                e.prototype.onDestroy = function () {
                    this.node.removeAllChildren();
                    this.unscheduleAllCallbacks();
                };
                return a([c], e);
            }(cc.Component));
        o.default = l;
        cc._RF.pop();
    }, {
        "../common/ToolsManager": "ToolsManager"
    }],
    mainScene: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "bb86aiiq89D5rDbK4MywKHY", "mainScene");
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
        var s = t("./common/BaseView"), r = t("./common/GameData"), c = t("./common/SoundManage"), l = t("./common/ViewManager"), h = t("./familiar/spineManager"), d = cc._decorator, p = d.ccclass, u = d.property, m = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.label_version = null;
                e.sp_state = null;
                e.node_gm = null;
                e.eb_chapter = null;
                e.eb_map = null;
                e.role_node = null;
                return e;
            }
            e.prototype.onLoad = function () {
                this.label_version.string = r.default._version;
                1 == r.default.chapter && 1 == r.default.mapIndex ? this.setSpriteFrame(this.sp_state, "public/btn_xyx") : this.setSpriteFrame(this.sp_state, "public/btn_jxyx");
                this.setClick(this.node);
                cc.debug.setDisplayStats(!1);
            };
            e.prototype.start = function () {
                c.default.gamePlayBGM("home");
                r.default.onlinetm = new Date().getTime();
            };
            e.prototype.roleDragonBones = function () {
                this.role_node.addComponent(h.default);
                this.m_roleDbJs = this.role_node.getComponent(h.default);
                this.role_node.scale = 1.5;
                this.m_roleDbJs.initData(this.role_node, "am01", "ui_ditu", function () { });
            };
            e.prototype.btn_gameBack = function () {
                c.default.playSound("ui/start.mp3");
                console.log("===开始游戏=");
                if ("" != this.eb_chapter.string) {
                    r.default.chapter = Number(this.eb_chapter.string);
                    r.default.Smallplot = "0_" + r.default.chapter;
                }
                "" != this.eb_map.string && (r.default.mapIndex = Number(this.eb_map.string));
                this.gotoLoginScene();
            };
            e.prototype.btn_prop = function () {
                c.default.playSound("ui/click.mp3");
                console.log("==道具=");
                l.default.open("dialog/showpropDialog");
            };
            e.prototype.btn_story = function () {
                c.default.playSound("ui/click.mp3");
                console.log("===历史=");
                l.default.open("dialog/showhistoryDialog");
            };
            e.prototype.btn_chapter = function () {
                c.default.playSound("ui/click.mp3");
                console.log("===章节=");
                l.default.open("dialog/chapterDialog", [!1]);
            };
            e.prototype.btn_menu = function () {
                c.default.playSound("ui/click.mp3");
                console.log("===设置=");
                l.default.open("dialog/setDialog", ["param", function () { }]);
            };
            e.prototype.btn_test = function () {
                l.default.open("view/roadView", ["param", function () { }]);
            };
            e.prototype.gotoLoginScene = function () {
                setTimeout(function () {
                    c.default.stopBGM();
                    cc.director.loadScene("transitionScene", function () {
                        console.log("==1111== gameScene==success=====");
                    });
                }, 200);
            };
            a([u(cc.Label)], e.prototype, "label_version", void 0);
            a([u(cc.Sprite)], e.prototype, "sp_state", void 0);
            a([u(cc.Node)], e.prototype, "node_gm", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_chapter", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_map", void 0);
            a([u(cc.Node)], e.prototype, "role_node", void 0);
            return a([p], e);
        }(s.default);
        o.default = m;
        cc._RF.pop();
    }, {
        "./common/BaseView": "BaseView",
        "./common/GameData": "GameData",
        "./common/SoundManage": "SoundManage",
        "./common/ViewManager": "ViewManager",
        "./familiar/spineManager": "spineManager"
    }],
    node_cloud1: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "06defpxchtH37eKOYAuV9uY", "node_cloud1");
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
        var s = t("../common/ToolsManager"), r = cc._decorator, c = r.ccclass, l = (r.property,
            function (t) {
                n(e, t);
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    e.cloudArr1 = [];
                    e.cloudArr2 = [];
                    e.cloudArr3 = [];
                    e.nodeLength = 2e3;
                    return e;
                }
                e.prototype.start = function () {
                    this.initCloud();
                };
                e.prototype.initCloud = function () {
                    this.createCloudArr(1, 5);
                    this.createCloudArr(2, 4);
                    this.createCloudArr(3, 3);
                    this.schedule(this.cloudAct, 0);
                };
                e.prototype.createCloudArr = function (t, e) {
                    for (var o = 0; o < e; o++) {
                        var i = new cc.Node(), n = i.addComponent(cc.Sprite);
                        s.default.setSpriteFrame(n, "gk/scenes_public/cloud/cloud_" + t + "_" + s.default.mt_rand(1, 3));
                        i.x = -this.nodeLength / 2 + this.nodeLength / e * o + this.nodeLength / e / 2 + s.default.mt_rand(-80, 80);
                        switch (t) {
                            case 1:
                                i.y = s.default.mt_rand(-70, -20);
                                i.zIndex = 3;
                                this.cloudArr1.push(i);
                                break;

                            case 2:
                                i.y = s.default.mt_rand(-150, -90);
                                i.zIndex = 2;
                                this.cloudArr2.push(i);
                                break;

                            case 3:
                                i.y = s.default.mt_rand(-200, -150);
                                i.zIndex = 1;
                                this.cloudArr3.push(i);
                        }
                        this.node.addChild(i);
                    }
                };
                e.prototype.addCloud = function (t) {
                    var e = new cc.Node(), o = e.addComponent(cc.Sprite);
                    s.default.setSpriteFrame(o, "gk/scenes_public/cloud/cloud_" + t + "_" + s.default.mt_rand(1, 3));
                    e.x = this.nodeLength / 2 + s.default.mt_rand(-80, 80);
                    switch (t) {
                        case 1:
                            e.y = s.default.mt_rand(-70, -20);
                            e.zIndex = 3;
                            this.cloudArr1.push(e);
                            break;

                        case 2:
                            e.y = s.default.mt_rand(-150, -90);
                            e.zIndex = 2;
                            this.cloudArr2.push(e);
                            break;

                        case 3:
                            e.y = s.default.mt_rand(-200, -150);
                            e.zIndex = 1;
                            this.cloudArr3.push(e);
                    }
                    this.node.addChild(e);
                };
                e.prototype.cloudAct = function () {
                    for (var t in this.cloudArr1) {
                        (e = this.cloudArr1[t]).x -= .16;
                        if (e.x < -this.nodeLength / 2) {
                            e.removeFromParent();
                            this.cloudArr1.splice(Number(t), 1);
                            this.addCloud(1);
                            break;
                        }
                    }
                    for (var t in this.cloudArr2) {
                        (e = this.cloudArr2[t]).x -= .1;
                        if (e.x < -this.nodeLength / 2) {
                            e.removeFromParent();
                            this.cloudArr2.splice(Number(t), 1);
                            this.addCloud(2);
                            break;
                        }
                    }
                    for (var t in this.cloudArr3) {
                        var e;
                        (e = this.cloudArr3[t]).x -= .07;
                        if (e.x < -this.nodeLength / 2) {
                            e.removeFromParent();
                            this.cloudArr3.splice(Number(t), 1);
                            this.addCloud(3);
                            break;
                        }
                    }
                };
                e.prototype.onDisable = function () {
                    this.unscheduleAllCallbacks();
                };
                return a([c], e);
            }(cc.Component));
        o.default = l;
        cc._RF.pop();
    }, {
        "../common/ToolsManager": "ToolsManager"
    }],
    node_cloud: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "df0c0uTzetDIL9aAwDiiGIt", "node_cloud");
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
        var s = t("../common/ToolsManager"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.nodeLength = 2e3;
                e.cloudArr = [];
                e.cloudType = 1;
                e.cloudCount = 5;
                e.cloudSpeed = .16;
                return e;
            }
            e.prototype.start = function () {
                this.initCloud();
            };
            e.prototype.initCloud = function () {
                this.createCloudArr(this.cloudType, this.cloudCount);
                this.schedule(this.cloudAct, 0);
            };
            e.prototype.createCloudArr = function (t, e) {
                for (var o = 0; o < e; o++) {
                    var i = new cc.Node(), n = i.addComponent(cc.Sprite);
                    s.default.setSpriteFrame(n, "gk/scenes_public/cloud/cloud_" + t + "_" + s.default.mt_rand(1, 3));
                    i.x = -this.nodeLength / 2 + this.nodeLength / e * o + this.nodeLength / e / 2 + s.default.mt_rand(-80, 80);
                    i.y = s.default.mt_rand(-70, -20);
                    this.cloudArr.push(i);
                    this.node.addChild(i);
                }
            };
            e.prototype.addCloud = function (t) {
                var e = new cc.Node(), o = e.addComponent(cc.Sprite);
                s.default.setSpriteFrame(o, "gk/scenes_public/cloud/cloud_" + t + "_" + s.default.mt_rand(1, 3));
                e.x = this.nodeLength / 2 + s.default.mt_rand(-80, 80);
                e.y = s.default.mt_rand(-70, -20);
                this.cloudArr.push(e);
                this.node.addChild(e);
            };
            e.prototype.cloudAct = function () {
                for (var t in this.cloudArr) {
                    var e = this.cloudArr[t];
                    e.x -= Number(this.cloudSpeed);
                    if (e.x < -this.nodeLength / 2) {
                        e.removeFromParent();
                        this.cloudArr.splice(Number(t), 1);
                        this.addCloud(this.cloudType);
                        break;
                    }
                }
            };
            e.prototype.onDisable = function () {
                this.unscheduleAllCallbacks();
            };
            a([l(cc.Integer)], e.prototype, "cloudType", void 0);
            a([l(cc.Integer)], e.prototype, "cloudCount", void 0);
            a([l(cc.Integer)], e.prototype, "cloudSpeed", void 0);
            return a([c], e);
        }(cc.Component);
        o.default = h;
        cc._RF.pop();
    }, {
        "../common/ToolsManager": "ToolsManager"
    }],
    node_leaves1: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "548d75dFJBC7KRrBO7HNIG5", "node_leaves1");
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
        var s = t("../common/ToolsManager"), r = cc._decorator, c = r.ccclass, l = (r.property,
            function (t) {
                n(e, t);
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    e.SPACE_DROP = 12;
                    e.dropCount = e.SPACE_DROP;
                    e.timeCount = 0;
                    e.createCount = 0;
                    e.leavesArr = [];
                    return e;
                }
                e.prototype.start = function () {
                    this.schedule(this.updateLeaves, 1);
                };
                e.prototype.updateLeaves = function () {
                    this.timeCount++;
                    if (this.timeCount >= this.dropCount) {
                        this.createLeavesGroup();
                        this.timeCount = 0;
                        this.dropCount = this.SPACE_DROP + s.default.mt_rand(-2, 2);
                    }
                };
                e.prototype.createLeaves = function () {
                    var t = this;
                    this.createCount--;
                    s.default.createPrefab("leaves/ske_leaves", function (e) {
                        e.x = s.default.mt_rand(-20, 20);
                        e.y = s.default.mt_rand(-20, 20);
                        t.node.addChild(e);
                        t.leavesArr.push(e);
                        s.default.mt_rand(1, 3);
                        e.getComponent(sp.Skeleton).setAnimation(0, "yezi0" + s.default.mt_rand(1, 3), !1);
                    });
                    if (this.createCount > 0) {
                        var e = s.default.mt_rand(4, 12) / 10;
                        this.node.runAction(cc.sequence(cc.delayTime(e), cc.callFunc(function () {
                            t.createLeaves();
                        })));
                    }
                };
                e.prototype.createLeavesGroup = function () {
                    this.cleanLeaves();
                    this.createCount = s.default.mt_rand(2, 4);
                    this.createLeaves();
                };
                e.prototype.cleanLeaves = function () {
                    for (var t = 0, e = this.leavesArr; t < e.length; t++) e[t].removeFromParent();
                    this.leavesArr = [];
                };
                e.prototype.onDisable = function () {
                    this.node.stopAllActions();
                    this.unscheduleAllCallbacks();
                    this.cleanLeaves();
                };
                return a([c], e);
            }(cc.Component));
        o.default = l;
        cc._RF.pop();
    }, {
        "../common/ToolsManager": "ToolsManager"
    }],
    node_netTip: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "6d6e49GxLJB56hHzPi1p45x", "node_netTip");
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
        var s = cc._decorator, r = s.ccclass, c = s.property, l = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.m_callBack = null;
                e.lb_title = null;
                return e;
            }
            e.prototype.start = function () {
                this.node.on(cc.Node.EventType.TOUCH_START, function () { });
            };
            e.prototype.initCallBack = function (t, e) {
                this.m_callBack = null;
                this.m_callBack = t;
                this.lb_title.string = e;
            };
            e.prototype.sureCall = function () {
                this.m_callBack && this.m_callBack();
                this.node.active = !1;
            };
            e.prototype.cancelCall = function () {
                this.node.active = !1;
            };
            a([c(cc.Label)], e.prototype, "lb_title", void 0);
            return a([r], e);
        }(cc.Component);
        o.default = l;
        cc._RF.pop();
    }, {}],
    passDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "d3f6cF/knBMSIonkg8Bl0U1", "passDialog");
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
        var s = t("../common/PopupView"), r = t("../common/SoundManage"), c = t("../common/ViewManager"), l = cc._decorator, h = l.ccclass, d = l.property, p = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.ms_label = null;
                e.testNode = null;
                e.moveIndex = 100;
                return e;
            }
            e.prototype.onLoad = function () { };
            e.prototype.initData = function (t) {
                this.m_data = t;
                this.m_suerBack = t[1];
                this.m_continueBack = t[2];
            };
            e.prototype.start = function () { };
            e.prototype.openAct = function () {
                var t = this;
                this.moveIndex > 0 && setTimeout(function () {
                    t.testNode.x++;
                    t.testNode.scale += .05;
                    t.testNode.rotation += 1;
                    t.openAct();
                }, 100);
            };
            e.prototype.cancelBack = function () {
                this._onClose();
                this.m_continueBack && this.m_continueBack();
            };
            e.prototype.btn_prop = function () {
                console.log("==道具=");
                c.default.open("dialog/showpropDialog");
            };
            e.prototype.btn_story = function () {
                console.log("===历史=");
                c.default.open("dialog/showhistoryDialog");
            };
            e.prototype.mainBack = function () {
                c.default.open("dialog/tipsDialog", ["<b><size=28>是否确定离开，并返回主页？</>", "（谨慎：将会丢失未保存的游戏进度！）", function () {
                    console.log("==确定=回调=");
                    r.default.stopBGM();
                    setTimeout(function () {
                        cc.director.loadScene("mainScene", function () {
                            console.log("==1111== mainScene==success=====");
                        });
                    }, 200);
                }]);
            };
            e.prototype.setBack = function () {
                c.default.open("dialog/setDialog", ["param", function () { }], function () { });
            };
            a([d(cc.Label)], e.prototype, "ms_label", void 0);
            a([d(cc.Node)], e.prototype, "testNode", void 0);
            return a([h], e);
        }(s.default);
        o.default = p;
        cc._RF.pop();
    }, {
        "../common/PopupView": "PopupView",
        "../common/SoundManage": "SoundManage",
        "../common/ViewManager": "ViewManager"
    }],
    pickupDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "07f1eUY+cZCb5dL3y6xcthK", "pickupDialog");
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
        var s = t("../common/GameData"), r = t("../common/PopupView"), c = t("../common/ToolsManager"), l = t("../gameEvent"), h = cc._decorator, d = h.ccclass, p = h.property, u = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.sp_pickup = null;
                e.node_black = null;
                e.label_name1 = null;
                e.label_name2 = null;
                e.label_txt = null;
                e.goodsIndex = 0;
                e.node_goods = null;
                e.isReady = !1;
                e.GOODS_HEIGHT = 92;
                e.GOODS_WIDTH = 90;
                return e;
            }
            e.prototype.initData = function (t) {
                if (t) {
                    this.goodsConf = t[0];
                    console.log("-------- pickup goodsConf ", this.goodsConf);
                    this.setSpriteFrame(this.sp_pickup, "item/itemmax/" + this.goodsConf.imgname);
                }
            };
            e.prototype.start = function () {
                var t = this;
                this.node.on(cc.Node.EventType.TOUCH_START, function () {
                    t.chickOver();
                });
                this.initChapterGoods();
            };
            e.prototype.initChapterGoods = function () {
                var t = this;
                this.label_name1.string = this.goodsConf.name;
                this.label_name2.string = this.goodsConf.name;
                this.label_txt.string = this.goodsConf.ms;
                this.pan_goods = l.default.gameManager.pan_goods;
                this.pan_goods.removeAllChildren();
                for (var e = 100, o = 0, i = this.goodsConf.xjid; ;) {
                    e++;
                    var n = s.default.goodsConf["prop" + e];
                    if (!n) break;
                    if (n.xjid == i) {
                        o++;
                        var a = new cc.Node(), r = a.addComponent(cc.Sprite);
                        c.default.setSpriteFrame(r, "item/items/" + n.imgname);
                        s.default.itemData[n.nameid] || (a.color = cc.color(0, 0, 0));
                        this.pan_goods.addChild(a);
                        if (this.goodsConf.nameid == n.nameid) {
                            a.color = cc.color(0, 0, 0);
                            this.goodsIndex = o;
                            this.node_goods = a;
                        }
                    }
                }
                this.pan_goods.runAction(cc.sequence(cc.moveBy(.2, cc.v2(-664, 0)), cc.callFunc(function () {
                    t.isReady = !0;
                })));
                this.node_black.runAction(cc.fadeIn(.2));
            };
            e.prototype.chickOver = function () {
                var t = this;
                if (this.isReady) {
                    this.node_black.active = !1;
                    var e = l.default.gameManager.mask_goods.x - 664 + 50 + this.goodsIndex * this.GOODS_WIDTH, o = l.default.gameManager.mask_goods.y, i = cc.spawn(cc.scaleTo(.3, .3), cc.moveTo(.3, cc.v2(e, o)));
                    this.sp_pickup.node.runAction(cc.sequence(i, cc.callFunc(function () {
                        t.pan_goods.runAction(cc.sequence(cc.delayTime(1.5), cc.moveTo(.2, cc.v2(0, 0))));
                        if (t.node_goods) {
                            t.node_goods.color = cc.color(255, 255, 255);
                            t.node_goods.runAction(cc.sequence(cc.scaleTo(.1, 1.2), cc.scaleTo(.1, 1)));
                        }
                        t._onClose();
                    })));
                }
            };
            e.prototype.onDisable = function () { };
            a([p(cc.Sprite)], e.prototype, "sp_pickup", void 0);
            a([p(cc.Node)], e.prototype, "node_black", void 0);
            a([p(cc.Label)], e.prototype, "label_name1", void 0);
            a([p(cc.Label)], e.prototype, "label_name2", void 0);
            a([p(cc.Label)], e.prototype, "label_txt", void 0);
            return a([d], e);
        }(r.default);
        o.default = u;
        cc._RF.pop();
    }, {
        "../common/GameData": "GameData",
        "../common/PopupView": "PopupView",
        "../common/ToolsManager": "ToolsManager",
        "../gameEvent": "gameEvent"
    }],
    plotDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "fba22uO+qxEi5L1Ug4tHnkl", "plotDialog");
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
        var s = t("../common/GameData"), r = t("../common/PopupView"), c = t("../common/ToolsManager"), l = cc._decorator, h = l.ccclass, d = l.property, p = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.lb_name = null;
                e.lb_txt = null;
                e.node_left = null;
                e.img_left = null;
                e.node_right = null;
                e.img_right = null;
                e.node_con = null;
                e.curCount = 0;
                e.maxCount = 0;
                e.curTxt = "";
                e.isTxtAct = !0;
                return e;
            }
            e.prototype.onLoad = function () { };
            e.prototype.initData = function (t) {
                if (t) {
                    this.curId = t[0];
                    this.endCallBack = t[1];
                }
                this.nextPlot();
            };
            e.prototype.start = function () {
                var t = this, e = cc.sequence(cc.scaleTo(.7, 1.1), cc.scaleTo(.7, 1)), o = cc.repeatForever(e);
                this.node_con.runAction(o);
                this.node.on(cc.Node.EventType.TOUCH_START, function () {
                    if (t.isTxtAct) {
                        t.lb_txt.node.stopAllActions();
                        t.lb_txt.string = t.curTxt;
                        t.isTxtAct = !1;
                    } else t.nextPlot();
                }, this);
            };
            e.prototype.nextPlot = function () {
                var t = this;
                if (this.curId && "" != this.curId) {
                    var e = s.default.talkConf[this.curId];
                    if (e) {
                        this.curTxt = e.txt;
                        this.maxCount = this.curTxt.length;
                        this.curCount = 0;
                        this.isTxtAct = !0;
                        var o = e.lead;
                        this.node_left.active = "1" == o;
                        this.node_right.active = "1" != o;
                        "1" == o ? this.loadRoleAni(this.img_left, e.img_role) : this.loadRoleAni(this.img_right, e.img_role);
                        this.lb_name.string = e.name + ":";
                        this.lb_txt.node.stopAllActions();
                        this.lb_txt.node.runAction(cc.repeat(cc.sequence(cc.callFunc(function () {
                            t.curCount++;
                            t.lb_txt.string = t.curTxt.substring(0, t.curCount);
                            t.curCount >= t.maxCount && (t.isTxtAct = !1);
                        }), cc.delayTime(.09)), this.maxCount));
                        this.curId = e.next;
                    } else this.jumpCall();
                } else this.jumpCall();
            };
            e.prototype.loadRoleAni = function (t, e) {
                var o = t.getComponent(cc.Sprite);
                c.default.setSpriteFrame(o, "ui/plot/role/" + e);
            };
            e.prototype.jumpCall = function () {
                this._onClose();
                this.endCallBack && this.endCallBack();
            };
            e.prototype.onDisable = function () {
                this.node_con.stopAllActions();
            };
            a([d(cc.Label)], e.prototype, "lb_name", void 0);
            a([d(cc.Label)], e.prototype, "lb_txt", void 0);
            a([d(cc.Node)], e.prototype, "node_left", void 0);
            a([d(cc.Node)], e.prototype, "img_left", void 0);
            a([d(cc.Node)], e.prototype, "node_right", void 0);
            a([d(cc.Node)], e.prototype, "img_right", void 0);
            a([d(cc.Node)], e.prototype, "node_con", void 0);
            return a([h], e);
        }(r.default);
        o.default = p;
        cc._RF.pop();
    }, {
        "../common/GameData": "GameData",
        "../common/PopupView": "PopupView",
        "../common/ToolsManager": "ToolsManager"
    }],
    putOutFire: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "bbb26wtCUhKAKIK8w+uarEY", "putOutFire");
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
        var s = t("../common/GameData"), r = t("../gameEvent"), c = t("./baseEvent"), l = cc._decorator, h = l.ccclass, d = (l.property,
            function (t) {
                n(e, t);
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    e.m_isChick = !1;
                    return e;
                }
                e.prototype.init = function () {
                    this.m_analogyHp = 3;
                    this.schedule(this.recover, 20);
                };
                e.prototype.run = function () {
                    var t = this;
                    if (!this.m_isChick) {
                        this.m_isChick = !0;
                        console.log("====putOutFire=");
                        this.unschedule(this.recover);
                        r.default.gameManager.changeForceWait(!0);
                        r.default.hero_ts.waterRing(function () {
                            r.default.gameManager.changeForceWait(!1);
                            t.m_analogyHp -= 1;
                            if (t.m_analogyHp <= 0) {
                                t.m_isSucceed = !0;
                                r.default.hero_ts.setRoleGoods();
                                "" != t.m_next && r.default.checkNext(t.m_next, 1);
                                t.m_boxJs.playAni("over", -1);
                                t.m_boxJs.delEvent(1);
                            } else {
                                t.m_boxJs.playAni("await" + t.m_analogyHp, 1);
                                t.schedule(t.recover, 20);
                            }
                            t.m_isChick = !1;
                            console.log("泼水回调====");
                        });
                    }
                };
                e.prototype.recover = function () {
                    this.m_isSucceed && this.unschedule(this.recover);
                    if (this.m_analogyHp >= 3) this.m_analogyHp = 3; else {
                        this.m_analogyHp += 1;
                        var t = s.default.plotConf.txt5;
                        r.default.hero_ts.setRoleTips(!0, "label", t, {
                            num: 0,
                            times: 0,
                            interval: 0,
                            pos: "56|320"
                        });
                        this.scheduleOnce(function () {
                            r.default.hero_ts.setRoleTips(!1);
                        }, 4);
                    }
                    this.m_boxJs.playAni("await" + this.m_analogyHp, -1);
                };
                e.prototype.callBack = function () { };
                return a([h], e);
            }(c.default));
        o.default = d;
        cc._RF.pop();
    }, {
        "../common/GameData": "GameData",
        "../gameEvent": "gameEvent",
        "./baseEvent": "baseEvent"
    }],
    roadView: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "56d42Qns/lNW5oivfOInBWM", "roadView");
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
        var s = t("../common/BaseView"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.road_1 = null;
                e.road_2 = null;
                e.ROAD_LEN = 800;
                e.ROAD_SPEED = 3;
                return e;
            }
            e.prototype.onLoad = function () { };
            e.prototype.start = function () {
                this.schedule(this.upRoad, 0);
            };
            e.prototype.initData = function () { };
            e.prototype.upRoad = function () {
                this.road_1.y += this.ROAD_SPEED;
                this.road_2.y += this.ROAD_SPEED;
                this.road_1.y > this.ROAD_LEN && (this.road_1.y = this.road_2.y - this.ROAD_LEN);
                this.road_2.y > this.ROAD_LEN && (this.road_2.y = this.road_1.y - this.ROAD_LEN);
            };
            a([l(cc.Node)], e.prototype, "road_1", void 0);
            a([l(cc.Node)], e.prototype, "road_2", void 0);
            return a([c], e);
        }(s.default);
        o.default = h;
        cc._RF.pop();
    }, {
        "../common/BaseView": "BaseView"
    }],
    role_1: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "21c88vuSidNNr3VcGuI/KNW", "role_1");
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
        var s = t("../common/GameData"), r = t("../common/SoundManage"), c = t("../common/ToolsManager"), l = t("../familiar/spineManager"), h = t("../gameEvent"), d = cc._decorator, p = d.ccclass, u = d.property, m = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.m_goods = null;
                e.m_path = "role1";
                e.isRight = !0;
                e.m_scale = 1;
                e.hero_state = s.default.STATE_NORMAL;
                e.drag_x = 0;
                e.jumpRight = !1;
                e.ladderTop = 0;
                e.ladderBottom = 0;
                e.stopDir = null;
                e.lockDir = null;
                e.controlDir = null;
                e.moveDir = null;
                e.targetX = null;
                e.targetY = null;
                e.ske_run = null;
                e.node_run = null;
                e.spine_guide = null;
                e.node_tips = null;
                e.label_tips = null;
                e.node_sprite = null;
                e.goCount = 20;
                e.goMod = "walk";
                e.goSpeed = s.default.SPEED_WALK;
                e.goWay = s.default.HERO_WALk;
                e.turnType = 0;
                e.goType = 0;
                e.groundType = 0;
                e.followMap = {};
                e.isDrop = !1;
                e.goOrRunTime = 1;
                e.m_isGo = !1;
                e.node_mount = null;
                return e;
            }
            e.prototype.start = function () {
                var t = this;
                this.node.addComponent(l.default);
                this.m_dragonBones = this.node.getComponent(l.default);
                console.log("-------- hero m_path 2 ", this.m_path);
                this.m_dragonBones.m_specialParm = !0;
                this.m_dragonBones.initData(this.node_mount, "await", this.m_path, this.aniComplete.bind(this), 0, 1, function () {
                    if (t.m_goods) {
                        if (t.goods && "3" == t.goods.isthrow) {
                            t.hero_state = s.default.STATE_LOAD;
                            t.setPlay("pail_await");
                        }
                        t.setGoods(t.m_goods);
                    }
                    var e = t.heroConf.heroface;
                    e && "" != e && t.setSwitchHead(e);
                });
                this.setGoSound();
                this.schedule(this.moveAct, 0);
            };
            e.prototype.setControl = function (t) {
                if (t) {
                    this.initMoveData();
                    this.schedule(this.moveAct, 0);
                } else this.unschedule(this.moveAct);
            };
            e.prototype.initHero = function (t, e, o) {
                void 0 === o && (o = null);
                this.heroConf = t;
                var i = t.heroAni || "ani02";
                if (!i) return console.log("initHero==参数错误");
                this.setWalkingMode(t.heroGo);
                this.m_collider = this.node.getComponent(cc.PhysicsCircleCollider);
                this.m_body = this.node.getComponent(cc.RigidBody);
                console.log("-------- hero m_path 1 ", i);
                this.m_path = i;
                this.m_state = e;
                this.m_scale = t.sx || 1;
                this.node_mount.scaleX = h.default.tempHeroLeft ? -this.m_scale : t.initLeft ? -this.m_scale : this.m_scale;
                h.default.tempHeroLeft = !1;
                this.node_mount.scaleY = this.m_scale;
                this.setState(s.default.HERO_STANDBY);
                o && (this.m_goods = o);
                var n = t.color;
                console.log("------------- hero color " + n);
                if (n && "" != n) {
                    var a = n.split("|");
                    this.dColor = [];
                    for (var r = 0, c = a; r < c.length; r++) {
                        var l = c[r];
                        this.dColor.push(Number(l));
                    }
                    this.node_mount.color = cc.color(this.dColor[0], this.dColor[1], this.dColor[2]);
                }
            };
            e.prototype.setInitDir = function (t) {
                this.heroConf.initLeft = t;
            };
            e.prototype.getTempConf = function () {
                console.log("--------- 获取英雄当前配置数据 ", this.heroConf);
                return this.heroConf;
            };
            e.prototype.setPlay = function (t, e, o) {
                void 0 === e && (e = null);
                void 0 === o && (o = null);
                if (this.node_mount && this.node_mount.active && this.m_dragonBones && this.m_dragonBones.m_skeleton && t) {
                    if ("reach" == t) {
                        this.setSwitchSolt(0);
                        this.setHand();
                    } else {
                        this.setHand(1);
                        this.setSwitchSolt();
                    }
                    this.m_dragonBones.setAction(t, e, o || 1);
                } else console.log("setPlay==参数错误");
            };
            e.prototype.setGoSound = function () { };
            e.prototype.setState = function (t, e) {
                var o = this;
                void 0 === e && (e = null);
                this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                if (t != this.m_state) {
                    this.m_state = t;
                    this.ske_run.timeScale = 0;
                    this.ske_run.node.active = !1;
                    this.node_run.active = !1;
                    switch (t) {
                        case s.default.HERO_TURN:
                            1 == this.goType || 2 == this.goType ? this.setPlay("walk_z1", 1) : this.m_isGo ? "run" == this.goMod ? this.setPlay("run_z1", 1) : this.setPlay("walk_z1", 1) : this.setPlay("await_z1", 1);
                            break;

                        case s.default.HERO_TURN2:
                            1 == this.goType || 2 == this.goType ? this.setPlay("walk_z2", 1) : this.m_isGo ? "run" == this.goMod ? this.setPlay("run_z2", 1) : this.setPlay("walk_z2", 1) : this.setPlay("await_z2", 1);
                            break;

                        case s.default.HERO_BZ:
                            this.goods && "3" == this.goods.isthrow ? this.setPlay("pail_run_w", 1) : this.setPlay("run_w", 1);
                            break;

                        case s.default.HERO_START:
                            "walk" == this.goMod || 1 == this.goType ? this.goods && "3" == this.goods.isthrow ? this.setPlay("pail_walk_at", 1) : this.setPlay("walk_at", 1) : "run" == this.goMod ? this.goods && "3" == this.goods.isthrow ? "20" == this.goods.id ? this.setPlay("pail_run_at", 1) : this.setPlay("pail_walk_at", 1) : this.setPlay("run_at", 1) : "squat" == this.goMod ? this.setPlay("qianxing_hd", 1) : "shield" == this.goMod && (this.goods && "3" == this.goods.isthrow ? this.setPlay("pailface_walk_at", 1) : this.setPlay("bkface_walk_at", 1));
                            break;

                        case s.default.HERO_END:
                            "walk" == this.goMod || 1 == this.goType ? this.goods && "3" == this.goods.isthrow ? this.setPlay("pail_walk_at2", 1) : this.setPlay("walk_at2", 1) : "run" == this.goMod ? this.goods && "3" == this.goods.isthrow ? "20" == this.goods.number || "25" == this.goods.number ? this.setPlay("pail_run_at2", 1) : this.setPlay("pail_walk_at2", 1) : this.setPlay("run_at2", 1) : "squat" == this.goMod ? this.setPlay("qianxing_hd2", 1) : "shield" == this.goMod && (this.goods && "3" == this.goods.isthrow ? this.setPlay("pailface_walk_at2", 1) : this.setPlay("bkface_walk_at2", 1));
                            break;

                        case s.default.HERO_STANDBY:
                            "squat" == this.goMod ? this.setPlay("qianxing_d") : "shield" == this.goMod ? this.goods && "3" == this.goods.isthrow ? this.setPlay("pailface_await") : this.setPlay("bkface_await") : this.goods && "3" == this.goods.isthrow ? this.setPlay("pail_await") : this.setPlay("await");
                            break;

                        case s.default.HERO_UP:
                            this.setPlay("panpa", 1);
                            break;

                        case s.default.HERO_PICKUP:
                            this.setPlay("pail_pickup", 1);
                            break;

                        case s.default.HERO_SHIELD:
                            this.goods && "3" == this.goods.isthrow ? this.setPlay("pailface_walk") : this.setPlay("bkface_walk");
                            break;

                        case s.default.HERO_FALL:
                            this.setPlay("xiadun", 1);
                            break;

                        case s.default.HERO_WALk:
                            "shield" == this.goMod ? this.goods && "3" == this.goods.isthrow ? this.setPlay("pailface_walk") : this.setPlay("bkface_walk") : this.goods && "3" == this.goods.isthrow ? this.setPlay("pail_walk") : this.setPlay("walk");
                            this.goOrRunTime = .5;
                            break;

                        case s.default.HERO_RUN:
                            var i = void 0;
                            if (this.goods && "3" == this.goods.isthrow) if ("20" == this.goods.number || "25" == this.goods.number) {
                                this.setPlay("pail_run");
                                i = !0;
                            } else this.setPlay("pail_walk"); else {
                                i = !0;
                                this.setPlay("run");
                            }
                            if (!i) break;
                            this.node_run.scaleX = this.node_mount.scaleX;
                            this.goOrRunTime = 1;
                            this.ske_run.timeScale = 1;
                            this.ske_run.setAnimation(0, "runeffect_1", !0);
                            this.ske_run.node.active = !0;
                            this.node_run.active = !0;
                            break;

                        case s.default.HERO_ATT:
                            var n = "gongji", a = c.default.mt_rand(0, 2);
                            a > 0 && (n += a);
                            this.setPlay(n, 1);
                            break;

                        case s.default.HERO_PICK:
                            this.setPlay("shiqu", 1);
                            break;

                        case s.default.HERO_INTERACT:
                            this.setPlay("shengqi_hd", 1);
                            break;

                        case s.default.HERO_HANDLE:
                            this.setPlay("hudong_hd", 1);
                            break;

                        case s.default.HERO_LADDER1:
                            console.log("----------- param", e);
                            this.setPlay(e ? "climb_down_at2" : "climb_up_at", 1);
                            e && this.node.runAction(cc.sequence(cc.moveBy(.2, cc.v2(0, this.ladderBottom - this.node.y)), cc.callFunc(function () {
                                o.setEntity(!0);
                                o.switchState(s.default.STATE_NORMAL);
                                o.setState(s.default.HERO_STANDBY);
                                console.log("--------------- GameData.HERO_LADDER1");
                            })));
                            break;

                        case s.default.HERO_LADDER2:
                            this.setPlay(e ? "climb_up" : "climb_down");
                            break;

                        case s.default.HERO_LADDER3:
                            this.setPlay(e ? "climb_down_at" : "climb_up_at2", 1);
                            if (!e) {
                                var r = this.isRight ? 80 : -80, l = cc.moveBy(.35, cc.v2(r, this.ladderTop - this.node.y + 5));
                                this.node.runAction(cc.sequence(cc.delayTime(.15), l, cc.callFunc(function () {
                                    o.switchState(s.default.STATE_NORMAL);
                                    o.setState(s.default.HERO_STANDBY);
                                    o.setEntity(!0);
                                    o.m_body.linearVelocity = cc.v2(o.isRight ? 10 : -10, 0);
                                })));
                            }
                            break;

                        case s.default.HERO_TOUZI:
                            this.goWay == s.default.HERO_DOWN ? this.setPlay("qianxing_touzhi", 0) : this.setPlay("touzhi", 0);
                            this.setHand();
                            this.setSwitchSolt(0);
                            break;

                        case s.default.HERO_CLIMB1:
                            this.setPlay("panpa", 1);
                            break;

                        case s.default.HERO_CLIMB2:
                            this.setPlay("panpa_2", 1);
                            break;

                        case s.default.HERO_TOUZI2:
                            this.m_aniCompleteBack = e;
                            if (this.goWay == s.default.HERO_DOWN) this.setPlay("qianxing_touzhi2", 1); else {
                                console.log("==touzhi2=0000=");
                                this.setPlay("touzhi2", 1);
                            }
                            this.scheduleOnce(function () {
                                o.m_aniCompleteBack && o.m_aniCompleteBack();
                                o.setHand(1);
                            }, .13);
                            break;

                        case s.default.HERO_SHENGQI:
                            this.setPlay("shengqi");
                            break;

                        case s.default.HERO_DRAG:
                            this.setPlay(e ? "hudong_f" : "hudong");
                            break;

                        case s.default.HERO_DOOR:
                            this.setPlay("kaimen", 1);
                            break;

                        case s.default.HERO_DEATH:
                            this.setPlay("die", 1);
                            break;

                        case s.default.HERO_BOATING:
                            this.setPlay("huachuan", 0);
                            break;

                        case s.default.HERO_DOWN:
                            this.setPlay("qianxing");
                            break;

                        case s.default.HERO_DOWN_G:
                            this.setPlay("pail_put");
                            break;

                        case s.default.HERO_LOAD:
                            this.setPlay("pail_walk");
                            break;

                        case s.default.HERO_LOAD_K:
                            this.setPlay("pail_run");
                            break;

                        case s.default.HERO_GETWATER:
                            this.setPlay("getwater_await", 1);
                            break;

                        case s.default.HERO_WATERING:
                            this.setPlay("splash_await", 1);
                            break;

                        case s.default.HERO_SHIELD_LOAD:
                            this.setPlay("pailface_walk");
                            break;

                        case s.default.HERO_PAIL_PUT:
                            this.setPlay("pail_put", 1);
                            break;

                        case s.default.HERO_DRAG_NPC:
                            this.setPlay("drag_walk");
                    }
                }
            };
            Object.defineProperty(e.prototype, "heroState", {
                get: function () {
                    return this.hero_state;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.alignPos = function (t, e, o, i, n) {
                var a = this;
                void 0 === o && (o = null);
                void 0 === i && (i = "walk");
                void 0 === n && (n = !1);
                if (!n) {
                    this.isRight = t.x >= this.node.x;
                    this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                }
                null != i && Math.abs(t.x - this.node.x) > 5 && this.setState(s.default.HERO_WALk);
                var r = null != o ? o : Math.abs(t.x - this.node.x) / 200;
                this.node.runAction(cc.sequence(cc.moveTo(r, cc.v2(t.x, t.y)), cc.callFunc(function () {
                    a.setState(s.default.HERO_STANDBY);
                    e && e();
                })));
            };
            e.prototype.switchState = function (t, e) {
                void 0 === e && (e = !1);
                if (e) {
                    if (this.hero_state == t) {
                        switch (t) {
                            case s.default.STATE_DRAG:
                                if (this.item_drag) {
                                    var o = this.item_drag.getComponent(cc.RigidBody);
                                    o.type = cc.RigidBodyType.Static;
                                    console.log("--- Relieve DRAG ", o);
                                    this.item_drag = null;
                                    this.drag_x = 0;
                                    h.default.recoveryOp(!0);
                                }
                        }
                        this.setState(s.default.HERO_STANDBY);
                        this.hero_state = s.default.STATE_NORMAL;
                    }
                } else this.hero_state = t;
            };
            e.prototype.setDragItem = function (t) {
                t.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                this.isRight = t.x > this.node.x;
                this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                this.item_drag = t;
                this.drag_x = this.item_drag.x;
                this.goCount = 10;
                this.switchState(s.default.STATE_DRAG);
                this.setState(s.default.HERO_HANDLE);
            };
            e.prototype.setBrightness = function (t) {
                void 0 === t && (t = null);
                if (t) {
                    t < 0 ? t = 0 : t > 255 && (t = 255);
                    this.node_mount.color = cc.color(t, t, t);
                } else this.dColor ? this.node_mount.color = cc.color(this.dColor[0], this.dColor[1], this.dColor[2]) : this.node_mount.color = cc.color(255, 255, 255);
            };
            e.prototype.initMoveData = function () {
                this.targetX = null;
                this.turnType = 0;
                this.goType = 0;
                this.m_isGo = !1;
                this.goCount = 12;
            };
            e.prototype.initAllState = function (t) {
                var e = this;
                void 0 === t && (t = !1);
                this.initMoveData();
                this.hero_state == s.default.STATE_DRAG ? setTimeout(function () {
                    e.switchState(s.default.STATE_DRAG, !0);
                }, 5) : this.hero_state != s.default.STATE_NORMAL && this.hero_state != s.default.STATE_LOAD || t || this.setState(s.default.HERO_STANDBY);
            };
            e.prototype.stopMove = function () {
                if (this.hero_state == s.default.STATE_NORMAL || this.hero_state == s.default.STATE_LOAD) if ("squat" == this.goMod || "shield" == this.goMod) {
                    this.goCount = 0;
                    this.setState(s.default.HERO_STANDBY);
                } else this.setState(s.default.HERO_END);
                this.initMoveData();
                this.m_body.linearVelocity = cc.v2(0, 0);
                if (this.hero_state == s.default.STATE_DRAG) {
                    if (this.item_drag) {
                        this.m_dragonBones.stopAction();
                        this.m_state = null;
                    }
                } else if (this.hero_state == s.default.EMBARK) {
                    this.setPlay("huachuan_d", 1);
                    this.m_state = s.default.HERO_STANDBY;
                }
            };
            e.prototype.remind = function () {
                console.log("------------------ remind hero !!");
                this.m_body.linearVelocity = cc.v2(0, -1);
            };
            e.prototype.moveAct = function () {
                this.heroState == s.default.STATE_LADDER ? this.moveLadder() : this.move();
            };
            e.prototype.moveLadder = function () {
                if (null != this.targetY) if (this.node.y >= this.ladderTop - 180) {
                    this.setState(s.default.HERO_LADDER3);
                    this.targetY = null;
                } else if (this.node.y <= this.ladderBottom + 1) {
                    this.setState(s.default.HERO_LADDER1, !0);
                    this.targetY = null;
                } else {
                    var t = this.node.y + 120;
                    if (Math.abs(this.targetY - t) <= 3) {
                        this.targetY = null;
                        this.stopMoveLadder();
                    } else if (this.targetY > t) {
                        this.setState(s.default.HERO_LADDER2, !0);
                        this.node.y += 2;
                    } else if (this.targetY < t) {
                        this.setState(s.default.HERO_LADDER2, !1);
                        this.node.y -= 2;
                    }
                }
            };
            e.prototype.posMove = function (t, e) {
                if (this.heroState != s.default.STATE_LADDER) {
                    if (!(this.turnType > 0)) {
                        if (this.isRight && t < this.node.x || !this.isRight && t > this.node.x) {
                            this.goCount = 0;
                            "walk" != this.goMod && "run" != this.goMod || this.hero_state == s.default.STATE_LOAD ? this.hero_state == s.default.STATE_LOAD && (this.node_run.scaleX = -this.node_run.scaleX) : this.turnType = 1;
                        }
                        this.targetX = t;
                        Math.abs(this.targetX - this.node.x) <= 10 ? this.stopMove() : this.checkMove();
                    }
                } else {
                    this.targetY = e;
                    console.log("----- this.targetY ", this.targetY);
                }
            };
            e.prototype.setMove = function (t) {
                this.controlDir = t;
            };
            e.prototype.checkMove = function (t) {
                void 0 === t && (t = !1);
                var e = Math.abs(this.targetX - this.node.x);
                "run" == this.goMod && (e < 150 && e > 18 ? 0 != this.goCount || t ? this.goType = 1 : this.goType = 2 : this.goType = 0);
            };
            e.prototype.move = function () {
                if (null != this.targetX) if (Math.abs(this.targetX - this.node.x) <= 10) this.stopMove(); else {
                    var t = this.targetX >= this.node.x;
                    if (t != this.stopDir) if (this.hero_state == s.default.STATE_NORMAL || this.hero_state == s.default.EMBARK || this.hero_state == s.default.STATE_LOAD) {
                        this.turnType || ("right" == this.lockDir ? this.isRight = !0 : "left" == this.lockDir ? this.isRight = !1 : this.isRight = t);
                        var e;
                        this.turnType ? 1 == this.turnType ? e = s.default.HERO_TURN : 2 == this.turnType && (e = s.default.HERO_TURN2) : e = this.goCount <= 0 ? 2 == this.goType ? s.default.HERO_BZ : 1 == this.goType ? s.default.HERO_WALk : this.goWay : s.default.HERO_START;
                        this.isDrop;
                        if (this.hero_state == s.default.EMBARK && this.m_carrier) {
                            var o = this.m_specialSpeed ? this.m_specialSpeed : this.goSpeed;
                            this.node.x += t ? o : -o;
                            this.m_carrier.x = this.node.x;
                            this.setState(s.default.HERO_BOATING);
                        } else {
                            var i = this.turnType > 0 ? 0 : 1 == this.goType || 2 == this.goType ? s.default.SPEED_WALK : this.goSpeed;
                            if (this.hero_state == s.default.STATE_LOAD) {
                                i = s.default.SPEED_LOAD_K;
                                if (this.goods) if (21 == Number(this.goods.id)) {
                                    i = s.default.SPEED_LOAD;
                                    if ("shield" == this.goMod) {
                                        i = this.goSpeed;
                                        this.node.x += t ? i : -i;
                                    } else this.node.x += t ? i : -i;
                                } else {
                                    i = s.default.SPEED_LOAD_K;
                                    if ("shield" == this.goMod) {
                                        i = this.goSpeed;
                                        this.node.x += t ? i : -i;
                                    } else this.node.x += t ? i : -i;
                                }
                            } else this.node.x += t ? i : -i;
                            this.setState(e);
                        }
                        this.m_isGo = !0;
                    } else if (this.hero_state == s.default.STATE_DRAG) {
                        i = t ? s.default.SPEED_DRAG : -s.default.SPEED_DRAG;
                        t && this.item_drag.x > this.node.x || !t && this.item_drag.x < this.node.x ? this.setState(s.default.HERO_DRAG) : this.setState(s.default.HERO_DRAG, !0);
                        this.node.x += i;
                        this.item_drag.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -1);
                        this.item_drag.x += i;
                        this.goCount--;
                        if (this.goCount <= 0) if (Math.abs(this.item_drag.x - this.drag_x) < s.default.SPEED_DRAG - .1) this.switchState(s.default.STATE_DRAG, !0); else {
                            this.drag_x = this.item_drag.x;
                            this.goCount = 10;
                        }
                    }
                }
            };
            e.prototype.setStopDir = function (t) {
                this.stopDir = t;
            };
            Object.defineProperty(e.prototype, "heroDir", {
                get: function () {
                    return this.isRight;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.setLockDir = function (t) {
                this.lockDir = t;
            };
            e.prototype.aniComplete = function (t) {
                switch (t) {
                    case "run":
                        this.checkMove();
                        break;

                    case "run_w":
                    case "pail_run_w":
                        this.goType = 1;
                        break;

                    case "run_z1":
                    case "await_z1":
                    case "walk_z1":
                        this.isRight = !this.isRight;
                        this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                        this.turnType = 2;
                        break;

                    case "run_z2":
                    case "await_z2":
                    case "walk_z2":
                        this.turnType = 0;
                        this.goType = 0;
                        this.checkMove(!0);
                        break;

                    case "kaimen":
                    case "walk_at2":
                    case "run_at2":
                    case "pail_walk_at2":
                    case "pail_run_at2":
                    case "bkface_walk_at2":
                    case "pailface_walk_at2":
                    case "reach":
                        this.setState(s.default.HERO_STANDBY);
                        break;

                    case "die":
                        this.setDeath(1);
                        break;

                    case "walk_at":
                    case "run_at":
                    case "qianxing_hd":
                    case "pail_run_at":
                    case "pail_walk_at":
                    case "bkface_walk_at":
                    case "pailface_walk_at":
                    case "bkface_await_at":
                        this.goCount = 0;
                        break;

                    case "huachuan_hd":
                    case "huachuan_hd2":
                        h.default.gameManager.gameOperate = !1;
                }
            };
            e.prototype.setWalkingMode = function (t) {
                this.goMod = t;
                if ("squat" == t) {
                    this.goSpeed = s.default.SPEED_SQUAT;
                    this.goWay = s.default.HERO_DOWN;
                    this.setBrightness(170);
                } else if ("walk" == t) {
                    this.goSpeed = s.default.SPEED_WALK;
                    this.goWay = s.default.HERO_WALk;
                    this.setBrightness();
                } else if ("run" == t) {
                    this.goSpeed = s.default.SPEED_RUN;
                    this.goWay = s.default.HERO_RUN;
                    this.setBrightness();
                } else if ("shield" == t) {
                    this.goSpeed = s.default.SPEED_SHIELD;
                    this.goWay = s.default.HERO_SHIELD;
                }
            };
            Object.defineProperty(e.prototype, "walkingMode", {
                get: function () {
                    return this.goMod;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.isEntity = function () {
                return 0 == this.m_collider.sensor;
            };
            e.prototype.setEntity = function (t) {
                if (t) {
                    console.log("----------------- gravityScale 8");
                    this.m_body.gravityScale = 8;
                } else this.m_body.gravityScale = 0;
                this.m_collider.sensor = !t;
                this.m_collider.apply();
            };
            e.prototype.ladderAct = function (t, e, o, i, n, a) {
                this.jumpRight = e;
                this.ladderTop = n;
                this.ladderBottom = a;
                this.switchState(s.default.STATE_LADDER);
                this.setEntity(!1);
                h.default.isGround = !1;
                this.node.x = o ? t + 50 : t - 50;
                this.isRight = !o;
                if (i) {
                    this.node.y = a + 2;
                    this.setState(s.default.HERO_LADDER1);
                } else {
                    this.node.runAction(cc.moveBy(.35, cc.v2(0, -182)));
                    this.setState(s.default.HERO_LADDER3, !0);
                }
            };
            e.prototype.stopMoveLadder = function () {
                if (this.hero_state == s.default.STATE_LADDER && this.m_state == s.default.HERO_LADDER2) {
                    this.m_dragonBones.stopAction();
                    this.m_state = null;
                }
            };
            Object.defineProperty(e.prototype, "ladderState", {
                get: function () {
                    return this.hero_state == s.default.STATE_LADDER;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.interactAct = function () {
                if (this.hero_state == s.default.STATE_OP) {
                    this.switchState(s.default.STATE_NORMAL);
                    this.setState(s.default.HERO_STANDBY);
                } else {
                    this.switchState(s.default.STATE_OP);
                    this.isRight = !0;
                    this.setState(s.default.HERO_INTERACT);
                }
                return this.hero_state == s.default.STATE_OP;
            };
            e.prototype.squatAct = function (t) {
                var e = this;
                void 0 === t && (t = null);
                this.setState(s.default.HERO_FALL);
                this.node.runAction(cc.sequence(cc.delayTime(.3), cc.callFunc(function () {
                    e.setState(s.default.HERO_STANDBY);
                    t && t();
                })));
            };
            e.prototype.attAct = function (t, e) {
                var o = this;
                void 0 === e && (e = null);
                if (this.m_state != s.default.HERO_ATT) {
                    this.isRight = t > this.node.x;
                    this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                    this.setState(s.default.HERO_ATT);
                    this.scheduleOnce(function () {
                        c.default.createPrefab("throw/attCircle", function (t) {
                            if (null != t) {
                                t.y = 150;
                                o.node.addChild(t);
                                o.node.runAction(cc.sequence(cc.callFunc(function () {
                                    t.getComponent(cc.RigidBody).linearVelocity = {
                                        x: o.isRight ? 320 : -320,
                                        y: 0
                                    };
                                }), cc.delayTime(.3), cc.callFunc(function () {
                                    t.removeFromParent();
                                    o.setState(s.default.HERO_STANDBY);
                                    e && e();
                                })));
                            }
                        });
                    }, .2);
                }
            };
            e.prototype.setHeroScale = function (t) {
                this.m_scale = Number(t);
                this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                this.node_mount.scaleY = this.m_scale;
            };
            e.prototype.setDir = function (t) {
                this.isRight = t;
                this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
            };
            e.prototype.dragAct = function (t, e, o) {
                var i = this;
                this.setDir(!e.dragRight);
                this.setState(s.default.HERO_DRAG_NPC);
                var n = Number(e.time), a = e.dragRight ? Number(e.range) : -Number(e.range);
                t.runAction(cc.moveBy(n, cc.v2(a, 0)));
                this.node.runAction(cc.sequence(cc.moveBy(n, cc.v2(a, 0)), cc.callFunc(function () {
                    i.setState(s.default.HERO_STANDBY);
                    o && o();
                })));
            };
            e.prototype.climbAct = function (t, e) {
                var o = this;
                this.isRight = t.x > this.node.x;
                var i = {
                    x: this.node.x + (this.isRight ? 100 : -100),
                    y: t.y
                }, n = cc.moveTo(.1, cc.v2(this.node.x + (this.isRight ? 10 : -10), t.y - 85)), a = cc.moveTo(.2, cc.v2(i.x, i.y + 10));
                this.setEntity(!1);
                h.default.isGround = !1;
                this.setState(s.default.HERO_CLIMB1);
                this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                this.node.runAction(cc.sequence(n, cc.delayTime(.3), cc.callFunc(function () {
                    o.node_mount.scaleX = o.isRight ? o.m_scale : -o.m_scale;
                    o.setState(s.default.HERO_CLIMB2);
                }), a, cc.callFunc(function () {
                    o.node_mount.scaleX = o.isRight ? o.m_scale : -o.m_scale;
                    o.setState(s.default.HERO_STANDBY);
                    o.setEntity(!0);
                    o.m_body.linearVelocity = cc.v2(o.isRight ? 5 : -5, 0);
                    e && e();
                })));
            };
            e.prototype.pickAct = function (t, e, o) {
                var i = this;
                void 0 === o && (o = !1);
                2 != t.isthrow && (this.m_goods = t);
                var n = .33;
                o ? n = .05 : this.setState(s.default.HERO_PICK);
                r.default.playSound("pick.mp3");
                this.node.runAction(cc.sequence(cc.delayTime(n), cc.callFunc(function () {
                    2 != t.isthrow && i.setGoods(t);
                    i.setState(s.default.HERO_STANDBY);
                    e && e();
                })));
            };
            e.prototype.pickedUp = function (t, e) {
                var o = this;
                3 == t.isthrow && (this.m_goods = t);
                this.setState(s.default.HERO_PICKUP);
                this.node.runAction(cc.sequence(cc.delayTime(.33), cc.callFunc(function () {
                    3 == t.isthrow && o.setGoods(t);
                    o.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                        o.hero_state = s.default.STATE_LOAD;
                        o.setState(s.default.HERO_STANDBY);
                        if (e) {
                            console.log("==抱起动作=完成=");
                            e();
                        }
                    })));
                })));
            };
            e.prototype.getWater = function (t) {
                var e = this;
                this.setState(s.default.HERO_GETWATER);
                this.node.runAction(cc.sequence(cc.delayTime(.46), cc.callFunc(function () {
                    e.setGoods(s.default.goodsConf.prop21);
                    e.node.runAction(cc.sequence(cc.delayTime(1.01), cc.callFunc(function () {
                        e.hero_state = s.default.STATE_LOAD;
                        e.setState(s.default.HERO_STANDBY);
                        t && t();
                    })));
                })));
            };
            e.prototype.waterRing = function (t) {
                var e = this;
                this.setState(s.default.HERO_WATERING);
                this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                    e.setGoods(s.default.goodsConf.prop20);
                    e.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                        e.hero_state = s.default.STATE_LOAD;
                        e.setState(s.default.HERO_STANDBY);
                        t && t();
                    })));
                })));
            };
            e.prototype.pail_put = function (t) {
                var e = this;
                this.setState(s.default.HERO_PAIL_PUT);
                this.node.runAction(cc.sequence(cc.delayTime(.53), cc.callFunc(function () {
                    e.setGoods(null);
                    t && t();
                    e.node.runAction(cc.sequence(cc.delayTime(.8), cc.callFunc(function () {
                        e.hero_state = s.default.STATE_NORMAL;
                        e.setState(s.default.HERO_STANDBY);
                        h.default.gameManager.gameOperate = !1;
                    })));
                })));
            };
            e.prototype.setRoleGoods = function () {
                if (this.goods) if (3 == this.goods.isthrow) {
                    this.hero_state = s.default.STATE_NORMAL;
                    this.m_state = null;
                    this.setGoods(null);
                    this.setState(s.default.HERO_STANDBY);
                } else this.setGoods(null);
            };
            e.prototype.squatSwitch = function (t, e) {
                var o = this;
                "squat" == t ? this.setPlay("qianxing_hd", 1) : this.setPlay("qianxing_hd2", 1);
                this.node.runAction(cc.sequence(cc.delayTime(.3), cc.callFunc(function () {
                    o.setState(s.default.HERO_STANDBY);
                    e && e();
                })));
            };
            e.prototype.setGoods = function (t) {
                var e;
                this.m_goods && 3 == this.m_goods.isthrow && (e = this.m_goods);
                this.m_goods = t;
                this.m_goods ? 3 == this.m_goods.isthrow ? this.setSwitchLoad(this.m_goods) : this.setSwitchSolt() : e ? this.setSwitchLoad(e) : this.setSwitchSolt();
                console.log("---- 获得物品 " + t);
                h.default.setItemboxTips();
            };
            Object.defineProperty(e.prototype, "goods", {
                get: function () {
                    return this.m_goods;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.addDragonBones = function (t) {
                var e = this;
                if (t != this.m_path) if (this.node_mount.getComponent(sp.Skeleton)) {
                    this.m_path = t;
                    this.node_mount.removeComponent(sp.Skeleton);
                    this.node.getComponent(l.default) && this.node.removeComponent(l.default);
                    this.scheduleOnce(function () {
                        e.m_dragonBones = e.node.addComponent(l.default);
                        e.m_dragonBones.initData(e.node_mount, "await", e.m_path, e.aniComplete.bind(e), 0, 1, function () {
                            e.m_goods && e.setGoods(e.m_goods);
                        });
                    }, .1);
                } else console.log("==未挂载龙骨=请检查=");
            };
            e.prototype.setSwitchLoad = function (t) {
                var e = this.goods ? 1 : 0;
                this.m_dragonBones.switchLoad(t, 0 != e);
            };
            e.prototype.setSwitchSolt = function (t) {
                void 0 === t && (t = 1);
                var e = this.m_goods ? this.m_goods.id : 0;
                e = t ? e : 0;
                this.m_dragonBones.switchSolt(Number(e));
            };
            e.prototype.setHand = function (t) {
                void 0 === t && (t = 0);
                var e = this.m_goods ? this.m_goods.id : 0;
                t && (e = 0);
                this.m_dragonBones.switchHand(Number(e));
            };
            e.prototype.setGoodsBlink = function () {
                var t = this, e = new sp.spine.Color(220, 0, 100, 255);
                new sp.spine.Color(255, 255, 255, 255);
                this.m_dragonBones.setSlotColor(e);
                this.scheduleOnce(function () {
                    t.m_dragonBones.setSlotColor();
                }, .9);
            };
            e.prototype.setSwitchHead = function (t) {
                this.m_dragonBones.switchHead(t);
            };
            e.prototype.onBeginContact = function (t, e, o) {
                h.default.checkCollision(o);
            };
            e.prototype.onEndContact = function (t, e, o) {
                h.default.leaveCollision(o);
            };
            e.prototype.addDialog = function (t) {
                var e = this;
                if (this.node_dialog) {
                    this.node_dialog.getComponent("dialog").initData(t);
                    c.default.fadeAct(this.node_dialog);
                } else c.default.createPrefab("item/dialog", function (o) {
                    o.y = 330 * e.m_scale;
                    o.x = -10;
                    o.getComponent("dialog").initData(t);
                    e.node_dialog = o;
                    e.node.addChild(o);
                    c.default.fadeAct(e.node_dialog);
                });
            };
            e.prototype.setDrop = function (t) {
                this.isDrop = t;
                this.isDrop && this.initAllState();
            };
            Object.defineProperty(e.prototype, "heroDrop", {
                get: function () {
                    return this.isDrop;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.onDestroy = function () {
                this.m_isGo = !1;
                this.unscheduleAllCallbacks();
            };
            e.prototype.setDeath = function (t) {
                var e = this;
                void 0 === t && (t = 0);
                this.node.stopAllActions();
                this.hero_state = s.default.KNOCK_DOWN;
                this.node.removeComponent(cc.PhysicsCircleCollider);
                this.node.removeComponent(cc.RigidBody);
                if (t) {
                    this.stopMove();
                    this.scheduleOnce(function () {
                        if (e.node_mount.getComponent(sp.Skeleton)) {
                            e.node_mount.removeComponent(sp.Skeleton);
                            e.node.getComponent(l.default) && e.node.removeComponent(l.default);
                        }
                        h.default.gameManager.restartGameDeath();
                    }, .8);
                } else {
                    this.stopMove();
                    this.setState(s.default.HERO_DEATH);
                }
            };
            e.prototype.setCarrier = function (t, e) {
                var o = this;
                void 0 === e && (e = null);
                this.m_carrier = t;
                if (this.hero_state == s.default.EMBARK) {
                    this.m_specialSpeed = null;
                    h.default.gameManager.gameOperate = !0;
                    this.alignPos({
                        x: t.x,
                        y: t.y
                    }, function () {
                        o.setPlay("huachuan_hd2", 1);
                        o.hero_state = s.default.STATE_NORMAL;
                    });
                } else {
                    h.default.gameManager.gameOperate = !0;
                    this.m_specialSpeed = Number(e);
                    this.alignPos({
                        x: t.x,
                        y: t.y
                    }, function () {
                        o.setPlay("huachuan_hd", 1);
                        o.hero_state = s.default.EMBARK;
                    });
                }
            };
            e.prototype.addFollow = function (t, e) {
                this.followMap[t.index] = {
                    conf: t,
                    y: e - this.node.y
                };
            };
            e.prototype.delFollow = function (t) {
                this.followMap[t] && (this.followMap[t] = null);
            };
            e.prototype.switchGround = function (t) {
                var e = Number(t.groundtype);
                if (this.groundType != e) {
                    this.groundType = e;
                    console.log("------- 当前地面信息 ", t);
                }
            };
            e.prototype.setGuideAction = function (t) {
                void 0 === t && (t = !1);
                if (t) this.spine_guide.node.active = !1; else {
                    this.spine_guide.node.active = !0;
                    this.spine_guide.setAnimation(0, "presspull1", !0);
                }
            };
            e.prototype.setRoleTips = function (t, e, o, i) {
                var n = this;
                void 0 === e && (e = null);
                void 0 === o && (o = "");
                void 0 === i && (i = null);
                this.node_tips.active = t;
                this.node_tips.stopAllActions();
                this.node_tips.statr = 1;
                var a = this.node_tips.getChildByName("node_spine");
                a.active = !1;
                this.node_sprite.node.active = !1;
                this.label_tips.node.active = !1;
                if (t) {
                    this.m_eventData = {};
                    if (i) {
                        for (var s in i) this.m_eventData[s] = "pos" == s ? i[s] : Number(i[s]);
                        var r = this.m_eventData.pos.split("|");
                        this.node_tips.x = r[0];
                        this.node_tips.y = r[1];
                    }
                    if (this.node_tips.active) if ("label" == e) {
                        this.label_tips.node.active = !0;
                        this.label_tips.string = o.txt;
                        if (0 == this.m_eventData.num && 0 == this.m_eventData.times && 0 == this.m_eventData.interval) this.node_tips.active = !0; else {
                            this.node_tips.statr = this.m_eventData.num ? 0 : -1;
                            this.setNodeAction();
                        }
                    } else if ("img" == e) {
                        c.default.setSpriteFrame(this.node_sprite, o);
                        this.node_sprite.node.active = !0;
                        this.scheduleOnce(function () {
                            n.node_tips.active = !1;
                            n.node_sprite.node.active = !1;
                        }, 2);
                    } else if ("ani" == e) {
                        a.active = !0;
                        a.addComponent(l.default);
                        var h = a.getComponent(l.default);
                        h.m_specialParm = !0;
                        h.initData(a, "slidepress1", o, this.aniComplete.bind(this), 0, 1, function () { });
                        this.scheduleOnce(function () {
                            n.node_tips.active = !1;
                            a.removeComponent(sp.Skeleton);
                            a.removeComponent(l.default);
                            a.active = !1;
                        }, 2);
                    }
                }
            };
            e.prototype.setNodeAction = function () {
                var t = this;
                if (1 != this.node_tips.statr) {
                    this.node_tips.active = !0;
                    this.node_tips.runAction(cc.sequence(cc.delayTime(this.m_eventData.times), cc.callFunc(function () {
                        t.node_tips.active = !1;
                        if (-1 != t.node_tips.statr) {
                            t.m_eventData.num--;
                            if (t.m_eventData.num <= 0) {
                                t.node_tips.stopAllActions();
                                return;
                            }
                        }
                        t.scheduleOnce(function () {
                            t.setNodeAction();
                        }, t.m_eventData.interval);
                    })));
                }
            };
            e.prototype.changeSound = function (t, e, o) {
                void 0 === o && (o = !1);
                if (o) this.unschedule(this.changeVol); else {
                    this.m_soundId = t;
                    this.m_posAry = e;
                    this.changeVol();
                    this.schedule(this.changeVol, .2);
                }
            };
            e.prototype.changeVol = function () {
                var t = (Math.abs(this.node.x - this.m_posAry[1]) / (this.m_posAry[2] - this.m_posAry[1])).toFixed(1);
                this.m_soundVal = 1 - Number(t) < .1 ? .1 : 1 - Number(t);
                r.default.nowSoundVal = this.m_soundVal;
                console.log("=m_soundVal==", this.m_soundVal);
                r.default.soundMap[this.m_soundId] && r.default.setSoundVolume(this.m_soundId, this.m_soundVal);
            };
            a([u(sp.Skeleton)], e.prototype, "ske_run", void 0);
            a([u(cc.Node)], e.prototype, "node_run", void 0);
            a([u(sp.Skeleton)], e.prototype, "spine_guide", void 0);
            a([u(cc.Node)], e.prototype, "node_tips", void 0);
            a([u(cc.Label)], e.prototype, "label_tips", void 0);
            a([u(cc.Sprite)], e.prototype, "node_sprite", void 0);
            a([u(cc.Node)], e.prototype, "node_mount", void 0);
            return a([p], e);
        }(cc.Component);
        o.default = m;
        cc._RF.pop();
    }, {
        "../common/GameData": "GameData",
        "../common/SoundManage": "SoundManage",
        "../common/ToolsManager": "ToolsManager",
        "../familiar/spineManager": "spineManager",
        "../gameEvent": "gameEvent"
    }],
    role_bg: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "c2e30vY+7VPYb0C9jg3mwkR", "role_bg");
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
        var s = cc._decorator, r = s.ccclass, c = s.property, l = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.node_ani = null;
                e.move_range = 0;
                e.move_space = 0;
                return e;
            }
            e.prototype.start = function () {
                var t = this;
                this.node_ani.scaleX = this.move_range > 0 ? Math.abs(this.node_ani.scaleX) : -Math.abs(this.node_ani.scaleX);
                var e = Math.abs(Number(this.move_range)) / 80;
                this.node_ani.opacity = 0;
                var o = cc.repeatForever(cc.sequence(cc.delayTime(Number(this.move_space)), cc.fadeIn(.3), cc.moveBy(e, cc.v2(Number(this.move_range), 0)), cc.fadeOut(.3), cc.callFunc(function () {
                    t.node_ani.x = 0;
                })));
                this.node_ani.runAction(o);
            };
            e.prototype.onDisable = function () {
                this.node_ani.stopAllActions();
            };
            a([c(cc.Node)], e.prototype, "node_ani", void 0);
            a([c(cc.Integer)], e.prototype, "move_range", void 0);
            a([c(cc.Integer)], e.prototype, "move_space", void 0);
            return a([r], e);
        }(cc.Component);
        o.default = l;
        cc._RF.pop();
    }, {}],
    setDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "5bd727xjeRBfJGOmkvIDHO1", "setDialog");
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
        var s = t("../common/ConfManager"), r = t("../common/GameData"), c = t("../common/PopupView"), l = t("../common/SoundManage"), h = t("../common/ViewManager"), d = cc._decorator, p = d.ccclass, u = d.property, m = function (t) {
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
        cc._RF.pop();
    }, {
        "../common/ConfManager": "ConfManager",
        "../common/GameData": "GameData",
        "../common/PopupView": "PopupView",
        "../common/SoundManage": "SoundManage",
        "../common/ViewManager": "ViewManager"
    }],
    showhistoryDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "f7a08xGBeFNF4nQTIBZKRVh", "showhistoryDialog");
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
        var s = t("../common/GameData"), r = t("../common/PopupView"), c = t("../common/ViewManager"), l = cc._decorator, h = l.ccclass, d = l.property, p = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.label_pr = null;
                e.label_tag = null;
                e.label_chapterName = null;
                e.node_chapter1 = null;
                e.node_chapter2 = null;
                e.node_chapter3 = null;
                e.node_bg = null;
                e.node_bg2 = null;
                e.node_item1 = null;
                e.node_item2 = null;
                e.node_item3 = null;
                e.node_item4 = null;
                e.node_item5 = null;
                e.m_xzChapterId = 1;
                e.m_maxId = 1;
                e.m_prNum = 0;
                e.posY = {
                    1: [271, 256],
                    2: [259, 256],
                    3: [266, 255]
                };
                return e;
            }
            e.prototype.initData = function (t) {
                this.m_Data = t;
                console.log("--------------- this.m_Data ", this.m_Data);
            };
            e.prototype.start = function () {
                var t = 0;
                this.node_bg2.zIndex = -1;
                this.node_bg.zIndex = 0;
                this.label_tag.string = this.m_xzChapterId + "/" + s.default.chapterData[this.m_maxId].length;
                var e = s.default.chapterData[this.m_maxId][this.m_xzChapterId - 1].id;
                this.label_chapterName.string = s.default.chapterName[this.m_xzChapterId - 1] + s.default.chapterMax[e].plotname;
                var o = s.default.storyConfig[this.m_maxId] ? s.default.storyConfig[this.m_maxId][this.m_xzChapterId] : null, i = 0;
                for (var n in o) {
                    this["node_item" + ++i].active = !0;
                    var a = this["node_item" + i].getChildByName("image_zk");
                    a.active = !0;
                    a.getChildByName("label_name").getComponent(cc.Label).string = o[n].history_name;
                    this["node_item" + i].data = o[n];
                    var r = this["node_item" + i].getChildByName("item_sp").getComponent(cc.Sprite), c = o[n].historyid;
                    if (s.default.storyData[o[n].id]) {
                        t++;
                        this.setSpriteFrame(r, "item/storys/" + c);
                        this["node_item" + i].getComponent(cc.Button).interactable = !0;
                    } else {
                        c = "dialog/showhistory/image_zpk";
                        a.active = !1;
                        this.setSpriteFrame(r, c);
                        this["node_item" + i].getComponent(cc.Button).interactable = !1;
                    }
                }
                for (var l = i + 1; l <= 5; l++) this["node_item" + l].active = !1;
                this.label_pr.string = "解锁进度(" + t + "/" + i + ")";
            };
            e.prototype.itemCallBack = function (t) {
                c.default.open("dialog/showstoryDialog", [t.target.data]);
            };
            e.prototype.rightBack = function () {
                this.m_xzChapterId++;
                this.m_xzChapterId > s.default.chapterData[this.m_maxId].length && (this.m_xzChapterId = 1);
                this.start();
            };
            e.prototype.leftBack = function () {
                this.m_xzChapterId--;
                this.m_xzChapterId <= 0 && (this.m_xzChapterId = s.default.chapterData[this.m_maxId].length);
                this.start();
            };
            e.prototype.selectedChapter = function (t, e) {
                for (var o = 1; o < 4; o++) {
                    this["node_chapter" + o].zIndex = -1;
                    var i = this["node_chapter" + o].getChildByName("label_name"), n = this["node_chapter" + o].getChildByName("Background").getComponent(cc.Sprite), a = this["node_chapter" + o].getChildByName("image_num").getComponent(cc.Sprite);
                    i.color = cc.color(36, 29, 29);
                    this.setSpriteFrame(n, "dialog/showprop/image_djzt1");
                    this["node_chapter" + o].y = this.posY[o][1];
                    this.setSpriteFrame(a, "dialog/showprop/image_szz" + o);
                }
                this["node_chapter" + e].y = this.posY[e][0];
                this["node_chapter" + e].zIndex = 1;
                var s = this["node_chapter" + e].getChildByName("label_name"), r = this["node_chapter" + e].getChildByName("Background").getComponent(cc.Sprite), c = this["node_chapter" + e].getChildByName("image_num").getComponent(cc.Sprite);
                s.color = cc.color(255, 255, 255);
                this.setSpriteFrame(r, "dialog/showprop/image_djzt");
                this.setSpriteFrame(c, "dialog/showprop/image_sz" + e);
                this.m_maxId = e;
                this.m_xzChapterId = 1;
                this.start();
            };
            a([d(cc.Label)], e.prototype, "label_pr", void 0);
            a([d(cc.Label)], e.prototype, "label_tag", void 0);
            a([d(cc.Label)], e.prototype, "label_chapterName", void 0);
            a([d(cc.Node)], e.prototype, "node_chapter1", void 0);
            a([d(cc.Node)], e.prototype, "node_chapter2", void 0);
            a([d(cc.Node)], e.prototype, "node_chapter3", void 0);
            a([d(cc.Node)], e.prototype, "node_bg", void 0);
            a([d(cc.Node)], e.prototype, "node_bg2", void 0);
            a([d(cc.Node)], e.prototype, "node_item1", void 0);
            a([d(cc.Node)], e.prototype, "node_item2", void 0);
            a([d(cc.Node)], e.prototype, "node_item3", void 0);
            a([d(cc.Node)], e.prototype, "node_item4", void 0);
            a([d(cc.Node)], e.prototype, "node_item5", void 0);
            return a([h], e);
        }(r.default);
        o.default = p;
        cc._RF.pop();
    }, {
        "../common/GameData": "GameData",
        "../common/PopupView": "PopupView",
        "../common/ViewManager": "ViewManager"
    }],
    showpropDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "a432eh/LkVBe4zFH2oPu98/", "showpropDialog");
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
        var s = t("../common/GameData"), r = t("../common/PopupView"), c = t("../common/SoundManage"), l = cc._decorator, h = l.ccclass, d = l.property, p = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.itemcontent = null;
                e.item_sp = null;
                e.magnify_sp = null;
                e.magnify_name = null;
                e.magnify_ms = null;
                e.magnify_where = null;
                e.scrollview_item = null;
                e.label_tag = null;
                e.label_chapterName = null;
                e.node_chapter1 = null;
                e.node_chapter2 = null;
                e.node_chapter3 = null;
                e.node_bg = null;
                e.node_bg2 = null;
                e.m_xzChapterId = 1;
                e.m_maxId = 1;
                e._magnify_name = "未找到该道具";
                e._magnify_ms = "此道具未找到";
                e._magnify_where = "";
                e.posY = {
                    1: [277, 261],
                    2: [270, 256],
                    3: [265, 254]
                };
                return e;
            }
            e.prototype.initData = function () { };
            e.prototype.start = function () {
                this.node_bg2.zIndex = -1;
                this.node_bg.zIndex = 0;
                this.label_tag.string = this.m_xzChapterId + "/" + s.default.chapterData[this.m_maxId].length;
                var t = s.default.chapterData[this.m_maxId][this.m_xzChapterId - 1].id;
                this.label_chapterName.string = s.default.chapterName[this.m_xzChapterId - 1] + s.default.chapterMax[t].plotname;
                this.itemcontent.removeAllChildren();
                this.m_nowData = s.default.goodsConf;
                for (var e in this.m_nowData) if (this.m_nowData[e].xjid == this.m_xzChapterId && this.m_nowData[e].where == this.m_maxId) {
                    var o = this.itemcontent.children[e], i = this.m_nowData[e].imgname;
                    s.default.itemData[e] || (i = null);
                    if (o) {
                        o.ID = e;
                        var n = i ? "item/items/" + i : "public/dialog/image_wh";
                        (a = o.getChildByName("item_sp")).scale = i ? 1 : .44;
                        a.opacity = i ? 255 : 64;
                        this.setSpriteFrame(a.getComponent(cc.Sprite), n);
                    } else {
                        (o = cc.instantiate(this.item_sp)).x = 0;
                        o.ID = e;
                        var a;
                        n = i ? "item/items/" + i : "public/dialog/image_wh";
                        (a = o.getChildByName("item_sp")).scale = i ? 1 : .44;
                        a.opacity = i ? 255 : 64;
                        this.setSpriteFrame(a.getComponent(cc.Sprite), n);
                        this.itemcontent.addChild(o);
                    }
                }
                var r = this.itemcontent.children[0];
                r.getChildByName("image_xz").active = !0;
                var c = "item/itemmax/" + this.m_nowData[r.ID].imgname;
                this.magnify_sp.opacity = 255;
                if (s.default.itemData[r.ID]) {
                    this._magnify_name = this.m_nowData[r.ID].name;
                    this._magnify_ms = this.m_nowData[r.ID].ms;
                } else {
                    c = "public/dialog/image_wh";
                    this._magnify_name = "未找到该道具";
                    this._magnify_ms = "此道具未找到";
                    this.magnify_sp.opacity = 64;
                }
                var l = this.magnify_sp.getComponent(cc.Sprite);
                this.setSpriteFrame(l, c);
                this.magnify_name.string = this._magnify_name;
                this.magnify_ms.string = this._magnify_ms;
            };
            e.prototype.itemCallBack = function (t) {
                if (!t.target.nounlock) {
                    c.default.playSound("ui/paper.mp3");
                    for (var e in this.itemcontent.children) this.itemcontent.children[e].getChildByName("image_xz").active = !1;
                    var o = t.target.ID;
                    t.target.getChildByName("image_xz").active = !0;
                    var i = s.default.goodsConf[o], n = "item/itemmax/" + i.imgname;
                    this.magnify_sp.opacity = 255;
                    if (!s.default.itemData[o]) {
                        n = "public/dialog/image_wh";
                        this._magnify_name = "未找到该道具";
                        this._magnify_ms = "此道具未找到";
                        this.magnify_sp.opacity = 64;
                        i = null;
                    }
                    var a = this.magnify_sp.getComponent(cc.Sprite);
                    this.setSpriteFrame(a, n);
                    this.magnify_name.string = i ? i.name : this._magnify_name;
                    this.magnify_ms.string = i ? i.ms : this._magnify_ms;
                }
            };
            e.prototype.rightBack = function () {
                c.default.playSound("ui/click.mp3");
                this.m_xzChapterId++;
                this.m_xzChapterId > s.default.chapterData[this.m_maxId].length && (this.m_xzChapterId = 1);
                this.start();
            };
            e.prototype.leftBack = function () {
                c.default.playSound("ui/click.mp3");
                this.m_xzChapterId--;
                this.m_xzChapterId <= 0 && (this.m_xzChapterId = s.default.chapterData[this.m_maxId].length);
                this.start();
            };
            e.prototype.selectedChapter = function (t, e) {
                for (var o = 1; o < 4; o++) {
                    this["node_chapter" + o].zIndex = -1;
                    var i = this["node_chapter" + o].getChildByName("label_name"), n = this["node_chapter" + o].getChildByName("Background").getComponent(cc.Sprite), a = this["node_chapter" + o].getChildByName("image_num").getComponent(cc.Sprite);
                    i.color = cc.color(36, 29, 29);
                    this.setSpriteFrame(n, "dialog/showprop/image_djzt1");
                    this["node_chapter" + o].y = this.posY[o][1];
                    this.setSpriteFrame(a, "dialog/showprop/image_szz" + o);
                }
                this["node_chapter" + e].y = this.posY[e][0];
                this["node_chapter" + e].zIndex = 1;
                var s = this["node_chapter" + e].getChildByName("label_name"), r = this["node_chapter" + e].getChildByName("Background").getComponent(cc.Sprite), c = this["node_chapter" + e].getChildByName("image_num").getComponent(cc.Sprite);
                s.color = cc.color(255, 255, 255);
                this.setSpriteFrame(r, "dialog/showprop/image_djzt");
                this.setSpriteFrame(c, "dialog/showprop/image_sz" + e);
                this.m_maxId = e;
                this.m_xzChapterId = 1;
                this.start();
            };
            a([d(cc.Node)], e.prototype, "itemcontent", void 0);
            a([d(cc.Node)], e.prototype, "item_sp", void 0);
            a([d(cc.Node)], e.prototype, "magnify_sp", void 0);
            a([d(cc.Label)], e.prototype, "magnify_name", void 0);
            a([d(cc.Label)], e.prototype, "magnify_ms", void 0);
            a([d(cc.Label)], e.prototype, "magnify_where", void 0);
            a([d(cc.ScrollView)], e.prototype, "scrollview_item", void 0);
            a([d(cc.Label)], e.prototype, "label_tag", void 0);
            a([d(cc.Label)], e.prototype, "label_chapterName", void 0);
            a([d(cc.Node)], e.prototype, "node_chapter1", void 0);
            a([d(cc.Node)], e.prototype, "node_chapter2", void 0);
            a([d(cc.Node)], e.prototype, "node_chapter3", void 0);
            a([d(cc.Node)], e.prototype, "node_bg", void 0);
            a([d(cc.Node)], e.prototype, "node_bg2", void 0);
            return a([h], e);
        }(r.default);
        o.default = p;
        cc._RF.pop();
    }, {
        "../common/GameData": "GameData",
        "../common/PopupView": "PopupView",
        "../common/SoundManage": "SoundManage"
    }],
    showstoryDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "f5274tLoixOS5OBvNlWoHpg", "showstoryDialog");
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
        var s = t("../common/PopupView"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.image_item = null;
                e.label_name = null;
                e.label_ms = null;
                return e;
            }
            e.prototype.initData = function (t) {
                this.m_Data = t[0];
            };
            e.prototype.start = function () {
                var t = this;
                this.node.on(cc.Node.EventType.TOUCH_START, function () {
                    t._onClose();
                });
                var e = this.m_Data.historyid;
                this.setSpriteFrame(this.image_item, "item/storymax/" + e);
                this.label_name.string = this.m_Data.history_name;
                this.label_ms.string = this.m_Data.ms;
            };
            a([l(cc.Sprite)], e.prototype, "image_item", void 0);
            a([l(cc.Label)], e.prototype, "label_name", void 0);
            a([l(cc.Label)], e.prototype, "label_ms", void 0);
            return a([c], e);
        }(s.default);
        o.default = h;
        cc._RF.pop();
    }, {
        "../common/PopupView": "PopupView"
    }],
    spineManager: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "ea0d2Uw6+JPw7+jEj0ymbqE", "spineManager");
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
        var s = t("../common/GameData"), r = t("../common/SoundManage"), c = cc._decorator, l = c.ccclass, h = (c.property,
            function (t) {
                n(e, t);
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    e.m_timeScale = 1;
                    e.m_path = "dragonBones/";
                    e.m_parentNode = null;
                    e.m_specialParm = !1;
                    e.m_loadAry = ["before", "centre", "after"];
                    return e;
                }
                e.prototype.onLoad = function () {
                    this.m_armatureName = "Armature";
                    this.m_timeScale = 1;
                };
                e.prototype.onDestroy = function () {
                    cc.resources.release(this.m_path);
                };
                e.prototype.start = function () {
                    this.m_parentNode && this.addDragonBones(this.m_parentNode, this.m_path, this._onLoadComplete.bind(this));
                };
                e.prototype.initData = function (t, e, o, i, n, a, s) {
                    void 0 === o && (o = "ani01");
                    void 0 === i && (i = null);
                    void 0 === n && (n = 0);
                    void 0 === a && (a = 1);
                    void 0 === s && (s = null);
                    if (t) {
                        this.m_parentNode = t;
                        this.m_playName = e || "await";
                        this.m_curPlayName = this.m_playName;
                        this.m_path = "dragonBones/" + o;
                        this.m_callBack = i;
                        this.m_playTimes = !n;
                        this.m_timeScale = a;
                        this.m_loadCallBack = s;
                    }
                };
                e.prototype.setAction = function (t, e, o) {
                    void 0 === e && (e = this.m_playTimes);
                    void 0 === o && (o = this.m_timeScale);
                    if (!t) return console.log("=playName=参数错误=");
                    if (this.m_skeleton) {
                        this.m_playTimes = !e && -1 != o;
                        this.m_playName = t;
                        var i = this.m_skeleton.setAnimation(0, this.m_playName, this.m_playTimes);
                        -1 == o && (i.trackTime = i.animationEnd);
                        this.m_skeleton.timeScale = o;
                        this.m_curPlayName = t;
                    } else console.log("=m_skeleton=对象为null=");
                };
                e.prototype.stopAction = function () {
                    this.m_skeleton ? this.m_skeleton.timeScale = 0 : console.log("===stopAction==", this.m_path);
                };
                e.prototype.goOnAction = function () {
                    this.m_skeleton ? this.m_skeleton.timeScale = this.m_timeScale : console.log("===goOnAction==", this.m_path);
                };
                e.prototype.addDragonBones = function (t, e, o) {
                    void 0 === o && (o = null);
                    var i = e, n = this;
                    cc.resources.loadDir(i, sp.SkeletonData, function (e, i) {
                        if (e) console.log("========骨骼动画加载错误==请检查==" + e); else if (t && cc.isValid(t) && t.parent) {
                            t.getComponent(sp.Skeleton) && t.removeComponent(sp.Skeleton);
                            var a = t.addComponent(sp.Skeleton);
                            n.m_attachUtil = a.attachUtil;
                            a.skeletonData = i[0];
                            o && o(a);
                        }
                    });
                };
                e.prototype._onLoadComplete = function (t) {
                    var e = this;
                    this.m_skeleton = t;
                    var o = this.m_playName;
                    if (o && "" != o) {
                        this.m_skeleton.setAnimation(0, o, this.m_playTimes);
                        this.m_curPlayName = o;
                        this.m_specialParm ? this.m_skeleton.setCompleteListener(function () {
                            e._onPlayComplete();
                        }) : this.m_skeleton.setEndListener(function () {
                            e._onPlayComplete();
                        });
                    }
                    this.m_loadCallBack && this.m_loadCallBack();
                    var i = this.m_skeleton.findSlot("body_prop");
                    i && (this.m_spineColor = i.color);
                };
                e.prototype._onPlayComplete = function () {
                    this.m_callBack && this.m_callBack(this.m_curPlayName);
                };
                e.prototype.eventListenerBack = function (t) {
                    void 0 === t && (t = "1");
                    var e = this.m_path.split("/"), o = s.default.soundConf[e[1] + "|" + this.m_playName];
                    o && o.fps != t && r.default.playSound("action/" + o.sound + ".mp3");
                };
                e.prototype.switchSolt = function (t) {
                    void 0 === t && (t = 0);
                    var e = this.m_skeleton.findSlot("body_prop"), o = this.m_skeleton.skeletonData.getRuntimeData(), i = o.findSkin("default"), n = o.findSlotIndex("body_prop"), a = i.getAttachment(n, "prop/prop" + t);
                    e.setAttachment(a);
                };
                e.prototype.switchHand = function (t) {
                    void 0 === t && (t = 0);
                    var e = this.m_skeleton.findSlot("hand_prop"), o = this.m_skeleton.skeletonData.getRuntimeData(), i = o.findSkin("default"), n = o.findSlotIndex("hand_prop"), a = i.getAttachment(n, "prop/prop" + t);
                    e.setAttachment(a);
                };
                e.prototype.setSlotColor = function (t) {
                    void 0 === t && (t = null);
                    var e = this.m_skeleton.findSlot("body_prop");
                    e && (e.color = t || this.m_spineColor);
                };
                e.prototype.switchHead = function (t) {
                    var e = this.m_skeleton.findSlot("tou"), o = this.m_skeleton.skeletonData.getRuntimeData(), i = o.findSkin("default"), n = o.findSlotIndex("tou"), a = i.getAttachment(n, "tou_" + t);
                    e.setAttachment(a);
                };
                e.prototype.switchLoad = function (t, e) {
                    var o, i = t.loadorder.split(",");
                    for (var n in this.m_loadAry) {
                        var a = 0;
                        for (var s in i) {
                            if (this.m_loadAry[n] == i[s]) {
                                o = e ? t.number : 0;
                                this.setAttachment(this.m_loadAry[n], this.m_loadAry[n] + o);
                                break;
                            }
                            ++a >= i.length && this.setAttachment(this.m_loadAry[n], this.m_loadAry[n] + 0);
                        }
                    }
                };
                e.prototype.setAttachment = function (t, e) {
                    console.log(t + "==插槽=图片=" + e);
                    var o = this.m_skeleton.findSlot(t), i = this.m_skeleton.skeletonData.getRuntimeData(), n = i.findSkin("default"), a = i.findSlotIndex(t), s = n.getAttachment(a, e);
                    o.setAttachment(s);
                };
                e.prototype.changeSlot = function () { };
                return a([l], e);
            }(cc.Component));
        o.default = h;
        cc._RF.pop();
    }, {
        "../common/GameData": "GameData",
        "../common/SoundManage": "SoundManage"
    }],
    timingEvent: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "d7a8ecOUvRA8riXtrfl8MoM", "timingEvent");
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
        var s = cc._decorator, r = s.ccclass, c = (s.property, function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.isTiming = !1;
                e.second = 0;
                e.minTime = 0;
                e.maxTime = 0;
                e.itemTs = null;
                e.resultFrame = "";
                e.resultDelay = 0;
                return e;
            }
            e.prototype.start = function () { };
            e.prototype.initData = function (t, e, o, i) {
                var n = t.split("|");
                this.itemTs = e;
                this.resultFrame = o;
                this.resultDelay = Number(i);
                console.log("------------------------------- this.resultDelay " + this.resultDelay);
                this.minTime = Number(n[0]);
                this.maxTime = Number(n[1]);
            };
            e.prototype.checkTiming = function () {
                var t = this;
                if (this.isTiming) {
                    this.isTiming = !1;
                    this.unscheduleAllCallbacks();
                    return this.second < this.minTime ? 1 : this.second > this.maxTime ? 3 : 2;
                }
                this.itemTs.setBubble(!1, 0, !1);
                this.isTiming = !0;
                this.second = 0;
                this.scheduleOnce(function () {
                    t.itemTs.setBubble(!0, 0, !1);
                    t.itemTs.setPaoSprite(t.resultFrame + "_1");
                    t.schedule(t.timingCall, 1);
                }, this.resultDelay);
                return 0;
            };
            e.prototype.timingCall = function () {
                this.second++;
                console.log("------------- timing second " + this.second);
                this.second > this.maxTime ? this.itemTs.setPaoSprite(this.resultFrame + "_3") : this.second >= this.minTime && this.itemTs.setPaoSprite(this.resultFrame + "_2");
            };
            e.prototype.onDestroy = function () {
                this.unscheduleAllCallbacks();
            };
            return a([r], e);
        }(cc.Component));
        o.default = c;
        cc._RF.pop();
    }, {}],
    tipsDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "3704ds9GfdH65gbE3sCzA7b", "tipsDialog");
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
        var s = t("../common/PopupView"), r = t("../common/SoundManage"), c = cc._decorator, l = c.ccclass, h = c.property, d = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.ms_label = null;
                e.caution_label = null;
                e.again_label = null;
                e.suer_node = null;
                e.canel_node = null;
                e.suer1_node = null;
                return e;
            }
            e.prototype.onLoad = function () { };
            e.prototype.initData = function (t) {
                this.m_data = t;
                this.m_suerBack = t[2];
                this.m_continueBack = t[3];
                this.m_againData = t[4];
                this.m_onceSuer = t[5];
            };
            e.prototype.start = function () {
                this.ms_label.string = this.m_data[0];
                this.caution_label.node.active = !1;
                if (this.m_data[1] && "" != this.m_data[1]) {
                    this.caution_label.string = this.m_data[1];
                    this.caution_label.node.active = !0;
                }
                if (this.m_againData) {
                    this.again_label.string = this.m_againData;
                    this.again_label.node.active = !0;
                }
                if (this.m_onceSuer) {
                    this.suer_node.active = !1;
                    this.suer1_node.active = !0;
                    this.canel_node.active = !1;
                }
            };
            e.prototype.sureBack = function () {
                this._onClose();
                r.default.stopBGM();
                this.m_suerBack && this.m_suerBack();
            };
            e.prototype.cancelBack = function () {
                this._onClose();
                this.m_continueBack && this.m_continueBack();
            };
            a([h(cc.RichText)], e.prototype, "ms_label", void 0);
            a([h(cc.Label)], e.prototype, "caution_label", void 0);
            a([h(cc.Label)], e.prototype, "again_label", void 0);
            a([h(cc.Node)], e.prototype, "suer_node", void 0);
            a([h(cc.Node)], e.prototype, "canel_node", void 0);
            a([h(cc.Node)], e.prototype, "suer1_node", void 0);
            return a([l], e);
        }(s.default);
        o.default = d;
        cc._RF.pop();
    }, {
        "../common/PopupView": "PopupView",
        "../common/SoundManage": "SoundManage"
    }],
    transitionScene: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "c9d0buVGbpHsbfa628yONqa", "transitionScene");
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
        var s = t("./common/BaseView"), r = t("./common/GameData"), c = t("./familiar/DragonBonesManager"), l = t("./common/SoundManage"), h = t("./common/ConfManager"), d = t("./gameExternal/externalGame"), p = t("./familiar/spineManager"), u = cc._decorator, m = u.ccclass, _ = u.property, f = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.animation_node = null;
                e.videoComponent = null;
                e.role_node = null;
                e.yun_node = null;
                e.plot_label = null;
                e.layer_black = null;
                e.btn_skip = null;
                e.img_bg = null;
                e.img_icon = null;
                e.btn_speedup = null;
                e.cg_node = null;
                e.titles_label = null;
                e.m_chapterIndex = 0;
                e.m_isLoadIndx = 0;
                e.m_isLoadNeed = 2;
                e.m_animationPath = "animation/animation_1_0";
                e.m_rolePath = "ani01";
                e.m_orderIndex = 0;
                e.m_maxScale = 4;
                e.m_nowScale = 0;
                e.m_isCheck = !1;
                e.m_videoUrl = "";
                e.isGoGame = !1;
                e.m_cgTsAry = [];
                e.m_cgNameIndex = 2;
                e.m_nowCgIndex = 0;
                return e;
            }
            e.prototype.onLoad = function () {
                this.m_plotVal = [];
                this.m_ChapterAry = r.default.Smallplot.split("_");
                this.m_ChapterId = this.m_ChapterAry[1];
                this.setrelease("gk/d" + this.m_ChapterAry[0]);
                if (0 != this.m_ChapterAry[0]) {
                    var t = h.default.getLoadDragonBones(this.m_ChapterAry[0]);
                    for (var e in t) {
                        var o = t[e].split("|");
                        this.setrelease("dragonBones/" + o[0]);
                    }
                }
                this.ctorData("end_");
                this.m_isLoadNeed = this.m_isLoadNeed + (this.m_nowChapterData ? this.m_nowChapterData.length : 0);
                this.ctorData("start_");
                this.m_isLoadNeed = this.m_isLoadNeed + (this.m_nextChapterData ? this.m_nextChapterData.length : 0);
                console.log("==m_isLoadNeed=", this.m_isLoadNeed);
                var i = function (t) {
                    cc.resources.preloadDir(t, function () {
                        console.log("==预加载 ani=完成=");
                    });
                };
                for (var n in this.m_nextChapterData) if (this.m_nextChapterData[n].start_ani && "" != this.m_nextChapterData[n].start_ani) {
                    var a = this.m_nextChapterData[n].start_ani.split("|");
                    for (var e in a) i("dragonBones/transition/" + a[e]);
                }
                this.btn_speedup.active = !1;
                0 != this.m_ChapterAry[0] ? this.loadRes() : this.m_isLoadNeed--;
                var s = h.default.getLoadDragonBones(this.m_ChapterAry[1]);
                for (var n in s) -1 != s[n].indexOf("ani") && i("dragonBones/" + s[n].split("|")[0]);
                this.img_bg.opacity = 0;
                this.img_bg.active = !1;
                cc.debug.setDisplayStats(!1);
                this.setClick(this.node);
            };
            e.prototype.ctorData = function (t) {
                if ("start_" == t) {
                    var e = r.default.chapterMax[Number(this.m_ChapterAry[1]) - 1];
                    this.m_playChapter = e.chaptemax;
                    if (e && "1" != e.state && "" != e.start_order) {
                        this.m_nextChapterData = [];
                        var o = e.start_order.split("|");
                        this.m_rolePath = e.start_role;
                        for (var i in o) for (var n in e) {
                            if ("start_txt" == n && this.m_plotVal.length <= 0) {
                                var a = e[n].split("|");
                                for (var s in a) {
                                    var c = r.default.plotConf["txt" + a[s]];
                                    this.m_plotVal.push(c.txt);
                                }
                            }
                            if (t + o[i] == n) {
                                (l = {})[n] = e[n];
                                this.m_nextChapterData.push(l);
                                "start_video" == n && (this.m_videoUrl = "video_" + e[n]);
                                break;
                            }
                        }
                    }
                } else if ((e = r.default.chapterMax[Number(this.m_ChapterAry[0]) - 1]) && "1" != e.end && "" != e.end_order) {
                    this.m_nowChapterData = [];
                    o = e.end_order.split("|");
                    for (var i in o) for (var n in e) if (t + o[i] == n) {
                        var l;
                        (l = {})[n] = e[n];
                        this.m_nowChapterData.push(l);
                        "end_video" == n && (this.m_videoUrl = "video_" + e[n]);
                        break;
                    }
                }
            };
            e.prototype.start = function () {
                this.m_animationAry = [];
                this.roleDragonBones();
                if (1 == r.default.mapIndex) this.executeEvent(); else {
                    this.m_isLoadNeed = 2;
                    l.default.gamePlayBGM("loadbg");
                    this.m_playSection = this.m_ChapterAry[1];
                    this.runRightAni();
                    this.m_nowChapterData = null;
                    this.m_nextChapterData = null;
                    this.openBg();
                    this.m_fadeOutBack = !0;
                    this.openEffect();
                }
            };
            e.prototype.jumpBack = function () {
                var t = this;
                l.default.playSound("ui/back.mp3");
                console.log("---------------- layer_black 1m_isLoadIndx =", this.m_isLoadIndx);
                console.log("---------------- layer_black2  m_isLoadNeed =", this.m_isLoadNeed);
                this.m_isLoadIndx >= this.m_isLoadNeed ? this.layer_black.active = !0 : this.layer_black.active = !1;
                this.btn_skip.active = !1;
                this.cg_node.active ? this.cg_node.runAction(cc.sequence(cc.fadeOut(.5), cc.callFunc(function () {
                    t.openEffect();
                    t.cg_node.active = !1;
                    t.Complete();
                }))) : this.Complete();
            };
            e.prototype.speedupBack = function (t) {
                void 0 === t && (t = null);
                if (t) {
                    this.m_nowScale += 2;
                    this.m_nowScale = this.m_nowScale > 4 ? 1 : this.m_nowScale;
                    console.log("==当前倍速==" + this.m_nowScale);
                    cc.director.getScheduler().setTimeScale(this.m_nowScale);
                    this.m_nowScale = 1 == this.m_nowScale ? 0 : this.m_nowScale;
                    var e = 0 == this.m_nowScale ? "public/btn_tg1" : "public/btn_js" + this.m_nowScale;
                    this.setSpriteFrame(this.img_icon, e);
                } else {
                    this.m_nowScale = 0;
                    cc.director.getScheduler().setTimeScale(1);
                    this.setSpriteFrame(this.img_icon, "public/btn_tg1");
                }
            };
            e.prototype.setAnimation = function (t) {
                void 0 === t && (t = 1);
                for (var e in this.m_animationAry) {
                    var o = new cc.Node();
                    this.cg_node.addChild(o);
                    o.addComponent(p.default);
                    var i = o.getComponent(p.default);
                    i.m_specialParm = !0;
                    this.m_cgTsAry.push(i);
                    i.initData(o, "C002", "transition/" + this.m_animationAry[e], this.aniComplete.bind(this), 1);
                }
                if (this.m_isLoadIndx > this.m_isLoadNeed) {
                    console.log("====计数超出===11111111==");
                    this.gotoGk();
                }
            };
            e.prototype.aniComplete = function (t) {
                var e = this;
                this.m_nowName != t && this.m_nowCgIndex++;
                console.log("==播放完成的动作==" + t);
                if (this.m_nowCgIndex >= this.m_cgTsAry.length - 1 && this.m_nowName != t) {
                    this.m_nowName = t;
                    this.m_cgNameIndex++;
                    for (var o in this.m_cgTsAry) this.m_cgTsAry[o].setAction("C00" + this.m_cgNameIndex, 1);
                    this.m_nowCgIndex = 0;
                }
                if ("C006" == t) {
                    console.log("==全部播放完成==");
                    this.btn_skip.active = !1;
                    this.cg_node.runAction(cc.sequence(cc.fadeOut(.5), cc.callFunc(function () {
                        e.Complete();
                        e.openEffect();
                        e.cg_node.active = !1;
                    })));
                }
            };
            e.prototype.runRightAni = function () {
                var t = this;
                this.animation_node.addComponent(p.default);
                this.m_animationDbJs = this.animation_node.getComponent(p.default);
                this.m_animationDbJs.m_specialParm = !0;
                this.m_animationDbJs.initData(this.animation_node, "am0" + this.m_playSection, "transition/chapter" + this.m_playChapter, function () {
                    t.aniOnStop();
                }, 1);
            };
            e.prototype.aniOnStop = function () {
                this.m_isLoadIndx++;
                this.gotoGk();
            };
            e.prototype.executeEvent = function () {
                var t, e = this;
                if (this.m_nowChapterData && this.m_nowChapterData[0]) {
                    t = this.m_nowChapterData[0];
                    this.m_playSection = this.m_ChapterAry[0];
                } else if (this.m_nextChapterData && this.m_nextChapterData[0]) {
                    t = this.m_nextChapterData[0];
                    this.m_playSection = this.m_ChapterAry[1];
                } else this.gotoGk();
                for (var o in t) {
                    var i = o.split("_");
                    this.img_bg.opacity = 0;
                    this.img_bg.active = !1;
                    switch (i[1]) {
                        case "ani":
                            this.btn_skip.active = r.default.unlockchapters >= this.m_ChapterId;
                            this.m_animationAry = [];
                            this.m_animationAry = t[o].split("|");
                            this.openEffect();
                            this.setAnimation();
                            break;

                        case "video":
                            d.default.nativeVideo(this.m_videoUrl, function () {
                                e.jumpBack();
                            });
                            break;

                        case "txt":
                            this.runRightAni();
                            this.m_plotVal = [];
                            var n = t[o].split("|");
                            for (var a in n) {
                                var s = r.default.plotConf["txt" + n[a]];
                                this.m_plotVal.push(s.txt);
                            }
                            l.default.gamePlayBGM("loadbg");
                            this.openBg();
                            this.m_fadeOutBack = !0;
                            this.openEffect();
                            break;

                        case "zimu":
                            var c = r.default.plotConf["txt" + t[o]];
                            if (this.m_nextChapterData[1]) this.showTitles(c.txt); else {
                                this.img_bg.opacity = 255;
                                this.img_bg.active = !0;
                                this.m_chapterVideo = c;
                                this.m_isLoadNeed--;
                                this.gotoGk();
                            }
                    }
                    break;
                }
            };
            e.prototype.Complete = function () {
                if (this.m_nowChapterData && this.m_nowChapterData[0]) {
                    this.m_nowChapterData.shift();
                    this.m_isLoadIndx++;
                    this.executeEvent();
                } else if (this.m_nextChapterData && this.m_nextChapterData[0]) {
                    this.m_nextChapterData.shift();
                    this.m_isLoadIndx++;
                    this.executeEvent();
                } else {
                    1 != r.default.mapIndex && this.m_isLoadIndx++;
                    this.gotoGk();
                }
            };
            e.prototype.videoEnd = function (t) {
                void 0 === t && (t = !1);
                this.videoComponent.node.removeFromParent();
                this.videoComponent.node.destroy();
                this.videoComponent = null;
                t && this.Complete();
            };
            e.prototype.aniEnd = function (t) {
                void 0 === t && (t = !1);
                this.animation_node.removeComponent(dragonBones.ArmatureDisplay);
                this.animation_node.removeComponent(c.default);
                this.m_animationDbJs = null;
                if (t) {
                    l.default.stopBGM();
                    this.Complete();
                }
            };
            e.prototype.roleDragonBones = function () {
                var t = this.m_rolePath.split("|");
                for (var e in t) {
                    var o = new cc.Node();
                    o.x = 1 == t.length ? 150 : 150 * Number(e);
                    this.role_node.addChild(o);
                    o.addComponent(p.default);
                    var i = o.getComponent(p.default);
                    o.scale = 1.5;
                    i.initData(o, "walk", t[e], function () { });
                }
            };
            e.prototype.showTitles = function (t) {
                var e = this;
                this.layer_black.active = !0;
                this.layer_black.runAction(cc.sequence(cc.fadeIn(.4), cc.callFunc(function () {
                    e.titles_label.string = t;
                    e.titles_label.node.active = !0;
                    e.scheduleOnce(function () {
                        e.titles_label.node.active = !1;
                        e.Complete();
                    }, 3);
                })));
            };
            e.prototype.setPlot = function () {
                var t = this;
                this.m_plotVal[0] && (this.plot_label.string = this.m_plotVal[0]);
                this.m_plotVal.shift();
                this.scheduleOnce(function () {
                    t.m_plotVal.length > 0 ? t.setPlot() : t.m_plotVal.length <= 0 && t.Complete();
                }, 3);
            };
            e.prototype.openEffect = function () {
                var t = this;
                this.layer_black.active = !0;
                this.layer_black.opacity = 255;
                var e = cc.sequence(cc.fadeOut(.5), cc.callFunc(function () {
                    t.layer_black.opacity = 0;
                    console.log("---------------- layer_black 2");
                    t.layer_black.active = !1;
                    if (t.m_fadeOutBack) {
                        t.setPlot();
                        t.m_fadeOutBack = null;
                    }
                }));
                this.layer_black.runAction(e);
            };
            e.prototype.loadRes = function () {
                var t = "gk/d" + this.m_ChapterAry[1];
                this.loads(t);
            };
            e.prototype.loads = function (t) {
                var e = this;
                cc.resources.loadDir(t, function (t, o) {
                    e.onProgress(t / o, "加载游戏资源");
                }, function () {
                    e.onComplete();
                });
            };
            e.prototype.onProgress = function (t) {
                t = (t = Number((t + "").replace("%", ""))) || 0;
                Number(t.toFixed(2));
            };
            e.prototype.onComplete = function () {
                console.log("资源加载完成");
                r.default.chapter = this.m_ChapterAry[1];
                this.m_isLoadIndx++;
                this.gotoGk();
            };
            e.prototype.gotoGk = function () {
                var t = this;
                console.log("----------- this.m_isLoadIndx " + this.m_isLoadIndx);
                console.log("----------- this.m_isLoadNeed " + this.m_isLoadNeed);
                if (this.m_isLoadIndx == this.m_isLoadNeed) {
                    this.plot_label.string = "点击任意位置继续";
                    var e = cc.sequence(cc.scaleTo(1, 1.15), cc.scaleTo(1, 1));
                    this.plot_label.node.runAction(cc.repeatForever(e));
                    this.img_bg.on(cc.Node.EventType.TOUCH_START, function () {
                        if (!t.m_isCheck) {
                            t.m_isCheck = !0;
                            t.plot_label.node.stopAllActions();
                            t.layer_black.opacity = 255;
                            t.layer_black.active = !0;
                            if (t.m_chapterVideo) t.showTitles(t.m_chapterVideo.txt); else {
                                t.m_isLoadIndx++;
                                t.gotoGk();
                            }
                        }
                    });
                }
                if (!(this.m_isLoadIndx <= this.m_isLoadNeed || this.isGoGame)) {
                    this.isGoGame = !0;
                    this.layer_black.opacity = 255;
                    this.layer_black.active = !0;
                    this.layer_black.runAction(cc.fadeOut(.7));
                    var o = this.yun_node.addComponent(p.default);
                    o.m_specialParm = !0;
                    o.initData(this.yun_node, "daiji", "effect/transition", function () { }, 1);
                    cc.director.preloadScene("gameScene", function () { }, function () {
                        setTimeout(function () {
                            l.default.stopBGM();
                            cc.director.loadScene("gameScene", function () {
                                console.log("==== gameScene==success=====");
                            });
                        }, 1200);
                    });
                }
            };
            e.prototype.openBg = function () {
                var t = this;
                this.img_bg.active = !0;
                var e = cc.sequence(cc.fadeIn(.8), cc.callFunc(function () {
                    t.img_bg.opacity = 255;
                }));
                this.img_bg.runAction(e);
            };
            e.prototype.setrelease = function (t) {
                console.log("=11==释放资源=" + t);
                cc.resources.release(t);
            };
            e.prototype.onVideoPlayerEvent = function (t, e) {
                if (e === cc.VideoPlayer.EventType.COMPLETED) this.videoEnd(!0); else if (e === cc.VideoPlayer.EventType.READY_TO_PLAY) {
                    console.log("=可以播放=1111=");
                    this.videoComponent.node.active && this.videoComponent.play();
                } else cc.VideoPlayer.EventType.PAUSED;
            };
            a([_(cc.Node)], e.prototype, "animation_node", void 0);
            a([_(cc.VideoPlayer)], e.prototype, "videoComponent", void 0);
            a([_(cc.Node)], e.prototype, "role_node", void 0);
            a([_(cc.Node)], e.prototype, "yun_node", void 0);
            a([_(cc.Label)], e.prototype, "plot_label", void 0);
            a([_(cc.Node)], e.prototype, "layer_black", void 0);
            a([_(cc.Node)], e.prototype, "btn_skip", void 0);
            a([_(cc.Node)], e.prototype, "img_bg", void 0);
            a([_(cc.Sprite)], e.prototype, "img_icon", void 0);
            a([_(cc.Node)], e.prototype, "btn_speedup", void 0);
            a([_(cc.Node)], e.prototype, "cg_node", void 0);
            a([_(cc.Label)], e.prototype, "titles_label", void 0);
            return a([m], e);
        }(s.default);
        o.default = f;
        cc._RF.pop();
    }, {
        "./common/BaseView": "BaseView",
        "./common/ConfManager": "ConfManager",
        "./common/GameData": "GameData",
        "./common/SoundManage": "SoundManage",
        "./familiar/DragonBonesManager": "DragonBonesManager",
        "./familiar/spineManager": "spineManager",
        "./gameExternal/externalGame": "externalGame"
    }],
    unlockDialog: [function (t, e, o) {
        "use strict";
        cc._RF.push(e, "7d883EWNJpDf76usmxzrHlh", "unlockDialog");
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
        var s = t("../common/PopupView"), r = t("../common/ToolsManager"), c = cc._decorator, l = c.ccclass, h = c.property, d = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.tipis_label = null;
                e.node_num1 = null;
                e.node_num2 = null;
                e.node_num3 = null;
                e.node_lock = null;
                e.node_body = null;
                e.node_pole = null;
                e.node_btn = null;
                e.numArr1 = [];
                e.numArr2 = [];
                e.numArr3 = [];
                e.isRotate = !1;
                e.m_password0 = 1;
                e.m_password1 = 2;
                e.m_password2 = 3;
                e.m_text = ["", "金", "木", "水", "火", "土"];
                e.m_figure = {
                    1: [7, 8],
                    2: [1, 2],
                    3: [9, 10],
                    4: [3, 4],
                    5: [5, 6]
                };
                return e;
            }
            e.prototype.initData = function (t) {
                this.m_password = t[0];
                this.m_back = t[1];
                this.m_closeBack = t[2];
            };
            e.prototype.onLoad = function () { };
            e.prototype.start = function () {
                var t = this;
                this.node.getChildByName("mask_node").on(cc.Node.EventType.TOUCH_START, function () {
                    if (!t.isRotate) {
                        console.log("==close=");
                        t._onClose();
                    }
                });
                this.uiContent.on(cc.Node.EventType.TOUCH_START, function () { });
                this.initNum();
            };
            e.prototype.initNum = function () {
                for (var t = 1; t <= 3; t++) this.createNum(t, this["m_password" + (t - 1)]);
            };
            e.prototype.createNum = function (t, e, o) {
                void 0 === o && (o = !1);
                var i = new cc.Node(), n = i.addComponent(cc.Sprite);
                r.default.setSpriteFrame(n, "dialog/unlock/z" + t);
                var a = new cc.Node(), s = a.addComponent(cc.Sprite);
                r.default.setSpriteFrame(s, "dialog/unlock/image_wz" + e);
                o && (i.y = -165);
                i.addChild(a);
                this["numArr" + t].push(i);
                this["node_num" + t].addChild(i);
            };
            e.prototype.numAct = function (t) {
                var e = this, o = this["numArr" + t][0];
                o.runAction(cc.sequence(cc.moveBy(.15, cc.v2(0, 180)), cc.callFunc(function () {
                    o.removeFromParent();
                    e["numArr" + t].splice(0, 1);
                    e.isRotate = !1;
                })));
                this["numArr" + t][1].runAction(cc.sequence(cc.moveBy(.15, cc.v2(0, 180)), cc.moveTo(.07, cc.v2(0, 0))));
            };
            e.prototype.addBack = function (t, e) {
                if (!this.isRotate) {
                    this.isRotate = !0;
                    this["m_password" + e] += 1;
                    this["m_password" + e] = this["m_password" + e] > 5 ? 1 : this["m_password" + e];
                    var o = Number(e) + 1;
                    this.createNum(o, this["m_password" + e], !0);
                    this.numAct(o);
                }
            };
            e.prototype.minusBack = function (t, e) {
                this["m_password" + e] -= 1;
                this["m_password" + e] = this["m_password" + e] < 1 ? 5 : this["m_password" + e];
            };
            e.prototype.sureBack = function () {
                var t = this;
                if (this.findVal()) {
                    this.isRotate = !0;
                    this.node_btn.active = !1;
                    this.node_pole.runAction(cc.sequence(cc.moveBy(.2, cc.v2(220, 0)), cc.callFunc(function () {
                        t.node_body.runAction(cc.sequence(cc.spawn(cc.rotateBy(.12, -8), cc.moveBy(.12, cc.v2(0, -16))), cc.spawn(cc.rotateBy(.09, 2), cc.moveBy(.09, cc.v2(0, 2)))));
                    }), cc.delayTime(1), cc.callFunc(function () {
                        t.m_back && t.m_back();
                        t._onClose();
                    })));
                } else {
                    this.setTipis("密码不对噢，请认真观察后重试！");
                    this.node_lock.stopAllActions();
                    this.node_lock.x = 0;
                    this.node_lock.y = 0;
                    var e = cc.sequence(cc.moveBy(.06, cc.v2(-7, -2)), cc.moveBy(.06, cc.v2(14, 3)), cc.moveBy(.06, cc.v2(-13, -2)), cc.moveBy(.06, cc.v2(13, 2)), cc.moveBy(.06, cc.v2(-11, -1)), cc.moveTo(.06, cc.v2(0, 0)));
                    this.node_lock.runAction(e);
                }
            };
            e.prototype.setTipis = function () {
                255 != this.tipis_label.node.opacity && this.tipis_label.node.runAction(cc.sequence(cc.fadeIn(1), cc.delayTime(1.5), cc.fadeOut(.5)));
            };
            e.prototype.findVal = function () {
                var t = this.m_figure[this.m_password0], e = this.m_figure[this.m_password1], o = this.m_figure[this.m_password2], i = 0, n = Number(this.m_password), a = Math.floor(n / 100), s = Math.floor(n % 100 / 10), r = n % 100 % 10, c = function (t, e) {
                    for (var o in t) if (t[o] == e) {
                        i++;
                        break;
                    }
                };
                c(t, a);
                c(e, s);
                c(o, r);
                return i >= 3;
            };
            e.prototype.onDisable = function () {
                this.m_closeBack && this.m_closeBack();
            };
            a([h(cc.Label)], e.prototype, "tipis_label", void 0);
            a([h(cc.Node)], e.prototype, "node_num1", void 0);
            a([h(cc.Node)], e.prototype, "node_num2", void 0);
            a([h(cc.Node)], e.prototype, "node_num3", void 0);
            a([h(cc.Node)], e.prototype, "node_lock", void 0);
            a([h(cc.Node)], e.prototype, "node_body", void 0);
            a([h(cc.Node)], e.prototype, "node_pole", void 0);
            a([h(cc.Node)], e.prototype, "node_btn", void 0);
            return a([l], e);
        }(s.default);
        o.default = d;
        cc._RF.pop();
    }, {
        "../common/PopupView": "PopupView",
        "../common/ToolsManager": "ToolsManager"
    }]
}, {}, ["camera_master", "cloud", "node_cloud", "node_cloud1", "BaseScene", "BaseView", "ConfManager", "DefaultZIndex", "GameData", "PopupView", "SoundManage", "ToolsManager", "ViewManager", "editorScene", "baseEvent", "putOutFire", "DragonBonesManager", "answerDialog", "blackDialog", "cgDialog", "chapterDialog", "checkDialog", "dialog", "explodeBox", "fontFloating", "gameendDialog", "gametipsDialog", "image_sl", "passDialog", "pickupDialog", "plotDialog", "setDialog", "showhistoryDialog", "showpropDialog", "showstoryDialog", "spineManager", "tipsDialog", "unlockDialog", "gameEvent", "externalGame", "gameScene", "GameInfo", "GameUpdata", "HttpGame", "itemEventObj", "itemObj", "bullet", "itemBox", "itemDrop", "loopDrop", "timingEvent", "node_leaves1", "loadScene", "mainScene", "node_netTip", "roadView", "enemy_ai", "role_1", "role_bg", "transitionScene"]);