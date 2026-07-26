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
        var s = require("./ToolsManager"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.nodeLength = 2e3;
                e.cloudArr = [];
                e.cloudType = 1;
                e.cloudCount = 5;
                e.cloudSpeed = .16;
                return e;
            }
            e.prototype.start = function () {
                this.initCloud();
            };
            e.prototype.initCloud = function () {
                this.createCloudArr(this.cloudType, this.cloudCount);
                this.schedule(this.cloudAct, 1 / 30);
            };
            e.prototype.createCloudArr = function (t, e) {
                for (var o = 0; o < e; o++) {
                    var i = new cc.Node(), n = i.addComponent(cc.Sprite);
                    s.default.setSpriteFrame(n, "gk/scenes_public/cloud/cloud_" + t + "_" + s.default.mt_rand(1, 3));
                    i.x = -this.nodeLength / 2 + this.nodeLength / e * o + this.nodeLength / e / 2 + s.default.mt_rand(-80, 80);
                    i.y = s.default.mt_rand(-70, -20);
                    this.cloudArr.push(i);
                    this.node.addChild(i);
                }
            };
            e.prototype.addCloud = function (t) {
                var e = new cc.Node(), o = e.addComponent(cc.Sprite);
                s.default.setSpriteFrame(o, "gk/scenes_public/cloud/cloud_" + t + "_" + s.default.mt_rand(1, 3));
                e.x = this.nodeLength / 2 + s.default.mt_rand(-80, 80);
                e.y = s.default.mt_rand(-70, -20);
                this.cloudArr.push(e);
                this.node.addChild(e);
            };
            e.prototype.cloudAct = function () {
                var o = Math.min(arguments[0] || 1 / 30, .1) * 60;
                for (var t in this.cloudArr) {
                    var e = this.cloudArr[t];
                    e.x -= Number(this.cloudSpeed) * o;
                    if (e.x < -this.nodeLength / 2) {
                        e.removeFromParent();
                        this.cloudArr.splice(Number(t), 1);
                        this.addCloud(this.cloudType);
                        break;
                    }
                }
            };
            e.prototype.onDisable = function () {
                this.unscheduleAllCallbacks();
            };
            a([l(cc.Integer)], e.prototype, "cloudType", void 0);
            a([l(cc.Integer)], e.prototype, "cloudCount", void 0);
            a([l(cc.Integer)], e.prototype, "cloudSpeed", void 0);
            return a([c], e);
        }(cc.Component);
        o.default = h;
