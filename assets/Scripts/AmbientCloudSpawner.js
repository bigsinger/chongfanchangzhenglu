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
                    e.m_cloudInitialized = !1;
                    return e;
                }
                e.prototype.start = function () {
                    this.initCloud();
                };
                e.prototype.initCloud = function () {
                    this.createCloudArr(1, 5);
                    this.createCloudArr(2, 4);
                    this.createCloudArr(3, 3);
                    this.m_cloudInitialized = !0;
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
                e.prototype.resetCloud = function (t, e) {
                    e.x = this.nodeLength / 2 + s.default.mt_rand(-80, 80);
                    switch (t) {
                        case 1:
                            e.y = s.default.mt_rand(-70, -20);
                            break;

                        case 2:
                            e.y = s.default.mt_rand(-150, -90);
                            break;

                        case 3:
                            e.y = s.default.mt_rand(-200, -150);
                    }
                };
                e.prototype.cloudAct = function () {
                    var o = Math.min(arguments[0] || 1 / 30, .1) * 60;
                    for (var t = 0; t < this.cloudArr1.length; t++) {
                        (e = this.cloudArr1[t]).x -= .16 * o;
                        e.x < -this.nodeLength / 2 && this.resetCloud(1, e);
                    }
                    for (var t = 0; t < this.cloudArr2.length; t++) {
                        (e = this.cloudArr2[t]).x -= .1 * o;
                        e.x < -this.nodeLength / 2 && this.resetCloud(2, e);
                    }
                    for (var t = 0; t < this.cloudArr3.length; t++) {
                        var e;
                        (e = this.cloudArr3[t]).x -= .07 * o;
                        e.x < -this.nodeLength / 2 && this.resetCloud(3, e);
                    }
                };
                e.prototype.onEnable = function () {
                    this.m_cloudInitialized && this.schedule(this.cloudAct, 1 / 30);
                };
                e.prototype.onDisable = function () {
                    this.unschedule(this.cloudAct);
                };
                return a([c], e);
            }(cc.Component));
        o.default = l;
