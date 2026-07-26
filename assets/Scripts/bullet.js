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
        var s = require("./spineManager"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.img_bullet = null;
                return e;
            }
            e.prototype.initData = function (t) {
                this.m_data = t;
                this.m_Index = t[0];
            };
            e.prototype.start = function () {
                this.m_Sprkle = this.node.parent;
            };
            e.prototype.onBeginContact = function (t, e, o) {
                if (!o.sensor && (0 == o.tag || 1 == o.tag)) {
                    var i = {
                        x: this.node.x,
                        y: this.node.y
                    };
                    this.createSparkle(i);
                    this.node.stopAllActions();
                    this.node.removeFromParent();
                    this.node.destroy();
                }
            };
            e.prototype.onDestroy = function () {
                this.node && this.node.stopAllActions();
            };
            e.prototype.update = function () {
                this.node.angle <= -170 || (this.img_bullet.width = 60);
                this.img_bullet.width += 20;
                !(this.img_bullet.height >= 20) || (this.img_bullet.height -= 1);
            };
            e.prototype.createSparkle = function (t) {
                var e = new cc.Node();
                e.addComponent(s.default);
                var o = e.getComponent(s.default);
                o.m_specialParm = !0;
                o.initData(e, "shouji1", "ani18_1", function () {
                    e.removeFromParent();
                    e.destroy();
                }, 1);
                e.x = t.x;
                e.y = t.y;
                this.m_Sprkle.addChild(e);
            };
            a([l(cc.Node)], e.prototype, "img_bullet", void 0);
            return a([c], e);
        }(cc.Component);
        o.default = h;
