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
        var s = require("./GameUtilities"), r = cc._decorator, c = r.ccclass, l = (r.property,
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
