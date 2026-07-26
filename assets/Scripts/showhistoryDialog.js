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
        var s = require("./GameData"), r = require("./PopupView"), c = require("./ViewManager"), l = cc._decorator, h = l.ccclass, d = l.property, p = function (t) {
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
