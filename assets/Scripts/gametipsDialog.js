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
        var s = require("./GameData"), r = require("./PopupView"), c = cc._decorator, l = c.ccclass, h = c.property, d = function (t) {
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
                    c.tipData = this.m_tipsData;
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
                    var e = t.target.tipData || this.m_tipsData;
                    this.focus_sp.node.opacity = 255;
                    t.target.getChildByName("image_red").active = !1;
                    this.setSpriteFrame(this.focus_sp, "item/gametips/" + e.url);
                    this.ms_font.active = !0;
                    this.m_fontFloatingJs.initData(["<size=28><color=#ed892C>提示：</><size=28><color=#fdfaea>" + e.ms + "</>"]);
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
