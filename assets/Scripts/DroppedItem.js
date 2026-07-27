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
        var s = require("./GameState"), r = require("./GameUtilities"), c = require("./AudioManager"), l = require("./GameplayEventController"), h = cc._decorator, d = h.ccclass, p = (h.property,
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
                                var i = t.getComponent("ExplosiveCrate");
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
                        var o = e.getComponent("GrenadeCrate");
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
