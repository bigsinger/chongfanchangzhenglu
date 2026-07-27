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
        var s = require("./GameData"), r = require("./PopupView"), c = require("./SoundManage"), l = require("./CompletionTracker"), h = cc._decorator, d = h.ccclass, p = h.property, u = function (t) {
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
                this.updateWhere(r.ID, !!s.default.itemData[r.ID]);
            };
            e.prototype.updateWhere = function (t, e) {
                if (!this.magnify_where) return;
                var o = s.default.goodsConf[t];
                this.magnify_where.string = o ? e ? "发现于：" + l.default.clue({
                    key: t,
                    data: o
                }) : "线索：" + l.default.clue({
                    key: t,
                    data: o
                }) : "";
                this.magnify_where.enableWrapText = !0;
                this.magnify_where.overflow = cc.Label.Overflow.SHRINK;
            };
            e.prototype.itemCallBack = function (t) {
                // Native touch dispatch can report the slot's icon/selection
                // child as the event target (and the touch that opens this
                // popup can occasionally reach it). Resolve the owning slot
                // and ignore clicks outside a configured item.
                var e = t && t.target;
                while (e && e.parent != this.itemcontent && e != this.itemcontent) e = e.parent;
                if (!e || e == this.itemcontent || null == e.ID || !s.default.goodsConf[e.ID]) return;
                if (!e.nounlock) {
                    c.default.playSound("ui/paper.mp3");
                    for (var o in this.itemcontent.children) this.itemcontent.children[o].getChildByName("image_xz").active = !1;
                    var i = e.ID;
                    e.getChildByName("image_xz").active = !0;
                    var n = s.default.goodsConf[i], a = "item/itemmax/" + n.imgname;
                    this.magnify_sp.opacity = 255;
                    if (!s.default.itemData[i]) {
                        a = "public/dialog/image_wh";
                        this._magnify_name = "未找到该道具";
                        this._magnify_ms = "此道具未找到";
                        this.magnify_sp.opacity = 64;
                        n = null;
                    }
                    var r = this.magnify_sp.getComponent(cc.Sprite);
                    this.setSpriteFrame(r, a);
                    this.magnify_name.string = n ? n.name : this._magnify_name;
                    this.magnify_ms.string = n ? n.ms : this._magnify_ms;
                    this.updateWhere(i, !!n);
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
            a([p(cc.Node)], e.prototype, "itemcontent", void 0);
            a([p(cc.Node)], e.prototype, "item_sp", void 0);
            a([p(cc.Node)], e.prototype, "magnify_sp", void 0);
            a([p(cc.Label)], e.prototype, "magnify_name", void 0);
            a([p(cc.Label)], e.prototype, "magnify_ms", void 0);
            a([p(cc.Label)], e.prototype, "magnify_where", void 0);
            a([p(cc.ScrollView)], e.prototype, "scrollview_item", void 0);
            a([p(cc.Label)], e.prototype, "label_tag", void 0);
            a([p(cc.Label)], e.prototype, "label_chapterName", void 0);
            a([p(cc.Node)], e.prototype, "node_chapter1", void 0);
            a([p(cc.Node)], e.prototype, "node_chapter2", void 0);
            a([p(cc.Node)], e.prototype, "node_chapter3", void 0);
            a([p(cc.Node)], e.prototype, "node_bg", void 0);
            a([p(cc.Node)], e.prototype, "node_bg2", void 0);
            return a([d], e);
        }(r.default);
        o.default = u;
