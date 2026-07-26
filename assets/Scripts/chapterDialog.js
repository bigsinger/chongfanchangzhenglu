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
        var s = require("./ConfManager"), r = require("./GameData"), c = require("./PopupView"), l = require("./SoundManage"), h = require("./ToolsManager"), d = require("./ViewManager"), p = cc._decorator, u = p.ccclass, m = p.property, _ = function (t) {
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
                            h.getChildByName("rText_story").getComponent(cc.RichText).string = "<color=#8C2122><b>" + p + "</b></color><color=#212121> / " + d[0] + "</color>";
                            h.getChildByName("rText_item").getComponent(cc.RichText).string = "<color=#8C2122><b>" + u + "</b></color><color=#212121> / " + d[1] + "</color>";
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
                    var i = null != this.storyCount[this.touchChapter] ? this.storyCount[this.touchChapter] : 0, n = null != this.itemCount[this.touchChapter] ? this.itemCount[this.touchChapter] : 0;
                    this.rich_story_r.string = "<color=#8C2122>" + i + "</color><color=#F8E5D9> / " + o[0] + "</color>";
                    this.rich_item_r.string = "<color=#8C2122>" + n + "</color><color=#F8E5D9> / " + o[1] + "</color>";
                }
            };
            e.prototype.goGameCall = function () {
                var t = this;
                l.default.playSound("ui/start.mp3");
                d.default.open("dialog/tipsDialog", ["是否载入<size=22> <size=30><b>" + r.default.chapterUiConf[this.touchChapter].chapter_name + "?</>", "", function () {
                    s.default.clearRunState();
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
