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
        var r = require("./ResourceManager"), a = function (t) {
            n(e, t);
            function e() {
                return null !== t && t.apply(this, arguments) || this;
            }
            e.setSpriteFrame = function (t, e) {
                r.default.load(e, cc.SpriteFrame, function (e, o) {
                    e || (t.spriteFrame = o);
                });
            };
            e.createPrefab = function (t, e) {
                r.default.load("prefab/" + t, cc.Prefab, function (t, o) {
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
