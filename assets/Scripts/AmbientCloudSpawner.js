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
                    e.cloudArr1 = [];
                    e.cloudArr2 = [];
                    e.cloudArr3 = [];
                    e.nodeLength = 2e3;
                    return e;
                }
                e.prototype.start = function () {
                    this.initCloud();
                };
                e.prototype.initCloud = function () {
                    this.createCloudArr(1, 5);
                    this.createCloudArr(2, 4);
                    this.createCloudArr(3, 3);
                    this.schedule(this.cloudAct, 1 / 30);
                };
                e.prototype.createCloudArr = function (t, e) {
                    for (var o = 0; o < e; o++) {
                        var i = new cc.Node(), n = i.addComponent(cc.Sprite);
                        s.default.setSpriteFrame(n, "gk/scenes_public/cloud/cloud_" + t + "_" + s.default.mt_rand(1, 3));
                        i.x = -this.nodeLength / 2 + this.nodeLength / e * o + this.nodeLength / e / 2 + s.default.mt_rand(-80, 80);
                        switch (t) {
                            case 1:
                                i.y = s.default.mt_rand(-70, -20);
                                i.zIndex = 3;
                                this.cloudArr1.push(i);
                                break;

                            case 2:
                                i.y = s.default.mt_rand(-150, -90);
                                i.zIndex = 2;
                                this.cloudArr2.push(i);
                                break;

                            case 3:
                                i.y = s.default.mt_rand(-200, -150);
                                i.zIndex = 1;
                                this.cloudArr3.push(i);
                        }
                        this.node.addChild(i);
                    }
                };
                e.prototype.addCloud = function (t) {
                    var e = new cc.Node(), o = e.addComponent(cc.Sprite);
                    s.default.setSpriteFrame(o, "gk/scenes_public/cloud/cloud_" + t + "_" + s.default.mt_rand(1, 3));
                    e.x = this.nodeLength / 2 + s.default.mt_rand(-80, 80);
                    switch (t) {
                        case 1:
                            e.y = s.default.mt_rand(-70, -20);
                            e.zIndex = 3;
                            this.cloudArr1.push(e);
                            break;

                        case 2:
                            e.y = s.default.mt_rand(-150, -90);
                            e.zIndex = 2;
                            this.cloudArr2.push(e);
                            break;

                        case 3:
                            e.y = s.default.mt_rand(-200, -150);
                            e.zIndex = 1;
                            this.cloudArr3.push(e);
                    }
                    this.node.addChild(e);
                };
                e.prototype.cloudAct = function () {
                    var o = Math.min(arguments[0] || 1 / 30, .1) * 60;
                    for (var t in this.cloudArr1) {
                        (e = this.cloudArr1[t]).x -= .16 * o;
                        if (e.x < -this.nodeLength / 2) {
                            e.removeFromParent();
                            this.cloudArr1.splice(Number(t), 1);
                            this.addCloud(1);
                            break;
                        }
                    }
                    for (var t in this.cloudArr2) {
                        (e = this.cloudArr2[t]).x -= .1 * o;
                        if (e.x < -this.nodeLength / 2) {
                            e.removeFromParent();
                            this.cloudArr2.splice(Number(t), 1);
                            this.addCloud(2);
                            break;
                        }
                    }
                    for (var t in this.cloudArr3) {
                        var e;
                        (e = this.cloudArr3[t]).x -= .07 * o;
                        if (e.x < -this.nodeLength / 2) {
                            e.removeFromParent();
                            this.cloudArr3.splice(Number(t), 1);
                            this.addCloud(3);
                            break;
                        }
                    }
                };
                e.prototype.onDisable = function () {
                    this.unscheduleAllCallbacks();
                };
                return a([c], e);
            }(cc.Component));
        o.default = l;
