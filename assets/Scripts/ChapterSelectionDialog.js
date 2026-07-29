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
        var s = require("./GameConfigManager"), r = require("./GameState"), c = require("./PopupView"), l = require("./AudioManager"), h = require("./GameUtilities"), d = require("./DialogManager"), p = require("./CompletionTracker"), u = cc._decorator, m = u.ccclass, _ = u.property, f = function (t) {
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
                e.m_navigationPending = !1;
                e.levelTargets = [];
                e.selectedTarget = null;
                return e;
            }
            e.prototype.initData = function () { };
            e.prototype.start = function () {
                var v = this.scroll_chapter && this.scroll_chapter.getComponent(cc.ScrollView);
                if (v && !v.content) {
                    v.content = this.pan_chapter;
                    console.warn("[ChapterSelectionDialog] repaired missing ScrollView content binding");
                }
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
                this.levelTargets = r.default.getPublishedLevels();
                for (var t = 1; t <= this.CHAPTER_MAX; t++) {
                    var e = this.pan_chapter.getChildByName("node_chapter" + t);
                    this.chapterMap[t] = e;
                    var o = this.levelTargets[t - 1], i = e.getChildByName("node_unlock"), n = e.getChildByName("node_lock"), a = Number(t);
                    if (!o) {
                        e.active = !1;
                        continue;
                    }
                    e.active = !0;
                    e.chapterId = a;
                    e.levelTarget = o;
                    i.active = !0;
                    n.active = !1;
                    e.isUnlock = !0;
                    var s = r.default.chapterUiConf[o.chapter], c = i.getChildByName("img_title");
                    c.getChildByName("label_name").getComponent(cc.Label).string = o.title;
                    c.getChildByName("label_num").getComponent(cc.Label).string = o.chapter + ":" + o.map;
                    var l = i.getChildByName("img_record"), h = s && s.chapter_prop ? s.chapter_prop.split("|") : ["0", "0"], d = null != this.storyCount[o.chapter] ? this.storyCount[o.chapter] : 0, p = null != this.itemCount[o.chapter] ? this.itemCount[o.chapter] : 0;
                    l.getChildByName("rText_story").getComponent(cc.RichText).string = "<color=#8C2122><b>" + d + "</b></color><color=#212121> / " + h[0] + "</color>";
                    l.getChildByName("rText_item").getComponent(cc.RichText).string = "<color=#8C2122><b>" + p + "</b></color><color=#212121> / " + h[1] + "</color>";
                    if (o.chapter == r.default.chapter && o.map == r.default.mapIndex) {
                        this.touchChapter = a;
                        this.selectedTarget = o;
                    }
                }
                this.selectedTarget && this.updateRight();
            };
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
                        this.selectedTarget = i.levelTarget;
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
                var t = this.selectedTarget, e = t && r.default.chapterUiConf[t.chapter];
                if (t && e) {
                    this.label_name_r.string = "第" + t.chapter + "章 " + r.default.maxchapterName[t.chapter - 1] + " · 第" + t.map + "关";
                    this.label_info_r.string = "      " + t.title + "\n\n" + (e.chapter_txt || p.default.shortText(t.chapter));
                    this.label_info_r.enableWrapText = !0;
                    this.label_info_r.overflow = cc.Label.Overflow.SHRINK;
                    this.label_num_r.string = t.chapter + ":" + t.map;
                    var o = e.chapter_prop.split("|");
                    var i = null != this.storyCount[t.chapter] ? this.storyCount[t.chapter] : 0, n = null != this.itemCount[t.chapter] ? this.itemCount[t.chapter] : 0;
                    this.rich_story_r.string = "<color=#8C2122>" + i + "</color><color=#F8E5D9> / " + o[0] + "</color>";
                    this.rich_item_r.string = "<color=#8C2122>" + n + "</color><color=#F8E5D9> / " + o[1] + "</color>";
                }
            };
            e.prototype.goGameCall = function () {
                var t = this, e = this.selectedTarget;
                if (!e) return;
                l.default.playSound("ui/start.mp3");
                d.default.open("dialog/tipsDialog", ["是否载入<size=22> <size=30><b>第" + e.chapter + "章·第" + e.map + "关 " + e.title + "?</>", "", function () {
                    if (t.m_navigationPending) return;
                    t.m_navigationPending = !0;
                    s.default.clearRunState();
                    console.log("==选择=第" + e.chapter + "章·第" + e.map + "关 " + e.title + "进入游戏");
                    r.default.initMapInfo(e.chapter, e.map);
                    r.default.Smallplot = "0_" + e.chapter;
                    cc.director.preloadScene("transitionScene", function () { }, function () {
                        t.scheduleOnce(function () {
                            l.default.stopBGM();
                            cc.director.loadScene("transitionScene", function () {
                                console.log("==== transitionScene==success=====");
                            });
                        }, 1.2);
                    });
                }]);
            };
            a([_(cc.Node)], e.prototype, "pan_chapter", void 0);
            a([_(cc.Node)], e.prototype, "node_right", void 0);
            a([_(cc.Node)], e.prototype, "node_bg", void 0);
            a([_(cc.Node)], e.prototype, "scroll_chapter", void 0);
            a([_(cc.Label)], e.prototype, "label_name_r", void 0);
            a([_(cc.Label)], e.prototype, "label_info_r", void 0);
            a([_(cc.RichText)], e.prototype, "rich_story_r", void 0);
            a([_(cc.RichText)], e.prototype, "rich_item_r", void 0);
            a([_(cc.Label)], e.prototype, "label_num_r", void 0);
            return a([m], e);
        }(c.default);
        o.default = f;
