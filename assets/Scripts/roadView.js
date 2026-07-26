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
        var s = require("./BaseView"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.road_1 = null;
                e.road_2 = null;
                e.ROAD_LEN = 800;
                e.ROAD_SPEED = 3;
                return e;
            }
            e.prototype.onLoad = function () { };
            e.prototype.start = function () {
                this.schedule(this.upRoad, 1 / 30);
            };
            e.prototype.initData = function () { };
            e.prototype.upRoad = function () {
                var t = Math.min(arguments[0] || 1 / 30, .1) * 60;
                this.road_1.y += this.ROAD_SPEED * t;
                this.road_2.y += this.ROAD_SPEED * t;
                this.road_1.y > this.ROAD_LEN && (this.road_1.y = this.road_2.y - this.ROAD_LEN);
                this.road_2.y > this.ROAD_LEN && (this.road_2.y = this.road_1.y - this.ROAD_LEN);
            };
            a([l(cc.Node)], e.prototype, "road_1", void 0);
            a([l(cc.Node)], e.prototype, "road_2", void 0);
            return a([c], e);
        }(s.default);
        o.default = h;
