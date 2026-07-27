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
        var s = cc._decorator, r = s.ccclass, c = s.property, l = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.cloud1_1 = null;
                e.cloud1_2 = null;
                e.cloud2_1 = null;
                e.cloud2_2 = null;
                return e;
            }
            e.prototype.start = function () {
                this.schedule(this.cloudAct, 1 / 30);
            };
            e.prototype.cloudAct = function () {
                var t = Math.min(arguments[0] || 1 / 30, .1) * 60;
                this.cloud1_1.x -= .16 * t;
                this.cloud1_1.x < -18e3 && (this.cloud1_1.x = this.cloud1_2.x + 12e3);
                this.cloud1_2.x -= .16 * t;
                this.cloud1_2.x < -18e3 && (this.cloud1_2.x = this.cloud1_1.x + 12e3);
                this.cloud2_1.x -= .09 * t;
                this.cloud2_1.x < -18e3 && (this.cloud2_1.x = this.cloud2_2.x + 12e3);
                this.cloud2_2.x -= .09 * t;
                this.cloud2_2.x < -18e3 && (this.cloud2_2.x = this.cloud2_1.x + 12e3);
            };
            e.prototype.onDisable = function () {
                this.unscheduleAllCallbacks();
            };
            a([c(cc.Node)], e.prototype, "cloud1_1", void 0);
            a([c(cc.Node)], e.prototype, "cloud1_2", void 0);
            a([c(cc.Node)], e.prototype, "cloud2_1", void 0);
            a([c(cc.Node)], e.prototype, "cloud2_2", void 0);
            return a([r], e);
        }(cc.Component);
        o.default = l;
