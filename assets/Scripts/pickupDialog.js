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
        var s = require("./GameData"), r = require("./PopupView"), c = require("./ToolsManager"), l = require("./gameEvent"), h = cc._decorator, d = h.ccclass, p = h.property, u = function (t) {
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
