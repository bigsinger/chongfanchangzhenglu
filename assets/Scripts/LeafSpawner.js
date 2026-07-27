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
                    var e = null !== t && t.apply(this, arguments) || this;
                    e.SPACE_DROP = 12;
                    e.dropCount = e.SPACE_DROP;
                    e.timeCount = 0;
                    e.createCount = 0;
                    e.leavesArr = [];
                    return e;
                }
                e.prototype.start = function () {
                    this.schedule(this.updateLeaves, 1);
                };
                e.prototype.updateLeaves = function () {
                    this.timeCount++;
                    if (this.timeCount >= this.dropCount) {
                        this.createLeavesGroup();
                        this.timeCount = 0;
                        this.dropCount = this.SPACE_DROP + s.default.mt_rand(-2, 2);
                    }
                };
                e.prototype.createLeaves = function () {
                    var t = this;
                    this.createCount--;
                    s.default.createPrefab("leaves/ske_leaves", function (e) {
                        if (!e) return;
                        if (!cc.isValid(t.node) || !t.node.activeInHierarchy) {
                            e.destroy();
                            return;
                        }
                        e.x = s.default.mt_rand(-20, 20);
                        e.y = s.default.mt_rand(-20, 20);
                        t.node.addChild(e);
                        t.leavesArr.push(e);
                        s.default.mt_rand(1, 3);
                        e.getComponent(sp.Skeleton).setAnimation(0, "yezi0" + s.default.mt_rand(1, 3), !1);
                    });
                    if (this.createCount > 0) {
                        var e = s.default.mt_rand(4, 12) / 10;
                        this.node.runAction(cc.sequence(cc.delayTime(e), cc.callFunc(function () {
                            t.createLeaves();
                        })));
                    }
                };
                e.prototype.createLeavesGroup = function () {
                    this.cleanLeaves();
                    this.createCount = s.default.mt_rand(2, 4);
                    this.createLeaves();
                };
                e.prototype.cleanLeaves = function () {
                    for (var t = 0, e = this.leavesArr; t < e.length; t++) cc.isValid(e[t]) && e[t].destroy();
                    this.leavesArr = [];
                };
                e.prototype.onDisable = function () {
                    this.node.stopAllActions();
                    this.unscheduleAllCallbacks();
                    this.cleanLeaves();
                };
                return a([c], e);
            }(cc.Component));
        o.default = l;
