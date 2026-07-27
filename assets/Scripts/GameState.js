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
        });
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var a = require("./SaveManager"), s = function (t) {
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
                    a.default.writeIfChanged("longmarch", JSON.stringify(this.playData));
                    a.default.scheduleCommit("play-data", this.playData);
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
            e.saveMapInfo = function (t) {
                void 0 === t && (t = !1);
                console.log("------------ 小节 " + this.chapter);
                console.log("------------ 地图 " + this.mapIndex);
                a.default.writeIfChanged("chapter", this.chapter);
                a.default.writeIfChanged("mapIndex", this.mapIndex);
                a.default.writeIfChanged("unlockchapters", this.unlockchapters);
                t ? a.default.commit("map-info-critical", this.playData) : a.default.scheduleCommit("map-info", this.playData);
            };
            e.loadMapInfo = function () {
                var t = Number(cc.sys.localStorage.getItem("chapter") || this.playData.chapter || 1), e = Number(cc.sys.localStorage.getItem("mapIndex") || this.playData.mapIndex || 1), o = Number(cc.sys.localStorage.getItem("unlockchapters") || this.playData.unlockchapters || 0);
                Number.isFinite(t) && t >= 1 || (t = 1);
                Number.isFinite(e) && e >= 1 || (e = 1);
                Number.isFinite(o) && o >= 0 || (o = 0);
                this.maxchapterName && this.maxchapterName.length && (t = Math.min(t, this.maxchapterName.length));
                this.maxchapterName && this.maxchapterName.length && (o = Math.min(o, this.maxchapterName.length - 1));
                var i = this.publishedMapCounts[t] || 1;
                e = Math.min(e, i);
                this.chapter = Math.floor(t);
                this.mapIndex = Math.floor(e);
                this.Smallplot = "0_" + this.chapter;
                this.unlockchapters = Math.floor(o);
            };
            e.saveUnlockChapter = function () {
                a.default.writeIfChanged("unlockchapters", this.unlockchapters);
                a.default.commit("unlock-chapter-critical", this.playData);
            };
            e.initMapInfo = function (t) {
                void 0 === t && (t = 1);
                this.chapter = Number(t);
                this.mapIndex = 1;
                this.saveMapInfo(!0);
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
            e.publishedMapCounts = {
                1: 2,
                2: 2,
                3: 3
            };
            e.chapterName = ["第一节 ", "第二节 ", "第三节 ", "第四节 ", "第五节 "];
            return e;
        }(cc.Component);
        o.default = s;
