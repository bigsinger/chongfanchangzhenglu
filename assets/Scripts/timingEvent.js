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
        var s = cc._decorator, r = s.ccclass, c = (s.property, function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.isTiming = !1;
                e.second = 0;
                e.minTime = 0;
                e.maxTime = 0;
                e.itemTs = null;
                e.resultFrame = "";
                e.resultDelay = 0;
                return e;
            }
            e.prototype.start = function () { };
            e.prototype.initData = function (t, e, o, i) {
                var n = t.split("|");
                this.itemTs = e;
                this.resultFrame = o;
                this.resultDelay = Number(i);
                console.log("------------------------------- this.resultDelay " + this.resultDelay);
                this.minTime = Number(n[0]);
                this.maxTime = Number(n[1]);
            };
            e.prototype.checkTiming = function () {
                var t = this;
                if (this.isTiming) {
                    this.isTiming = !1;
                    this.unscheduleAllCallbacks();
                    return this.second < this.minTime ? 1 : this.second > this.maxTime ? 3 : 2;
                }
                this.itemTs.setBubble(!1, 0, !1);
                this.isTiming = !0;
                this.second = 0;
                this.scheduleOnce(function () {
                    t.itemTs.setBubble(!0, 0, !1);
                    t.itemTs.setPaoSprite(t.resultFrame + "_1");
                    t.schedule(t.timingCall, 1);
                }, this.resultDelay);
                return 0;
            };
            e.prototype.timingCall = function () {
                this.second++;
                console.log("------------- timing second " + this.second);
                this.second > this.maxTime ? this.itemTs.setPaoSprite(this.resultFrame + "_3") : this.second >= this.minTime && this.itemTs.setPaoSprite(this.resultFrame + "_2");
            };
            e.prototype.onDestroy = function () {
                this.unscheduleAllCallbacks();
            };
            return a([r], e);
        }(cc.Component));
        o.default = c;
