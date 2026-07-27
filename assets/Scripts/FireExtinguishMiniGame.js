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
        var s = require("./GameState"), r = require("./GameplayEventController"), c = require("./baseEvent"), l = cc._decorator, h = l.ccclass, d = (l.property,
            function (t) {
                n(e, t);
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    e.m_isChick = !1;
                    return e;
                }
                e.prototype.init = function () {
                    this.m_analogyHp = 3;
                    this.schedule(this.recover, 20);
                };
                e.prototype.run = function () {
                    var t = this;
                    if (!this.m_isChick) {
                        this.m_isChick = !0;
                        console.log("====putOutFire=");
                        this.unschedule(this.recover);
                        r.default.gameManager.changeForceWait(!0);
                        r.default.hero_ts.waterRing(function () {
                            r.default.gameManager.changeForceWait(!1);
                            t.m_analogyHp -= 1;
                            if (t.m_analogyHp <= 0) {
                                t.m_isSucceed = !0;
                                r.default.hero_ts.setRoleGoods();
                                "" != t.m_next && r.default.checkNext(t.m_next, 1);
                                t.m_boxJs.playAni("over", -1);
                                t.m_boxJs.delEvent(1);
                            } else {
                                t.m_boxJs.playAni("await" + t.m_analogyHp, 1);
                                t.schedule(t.recover, 20);
                            }
                            t.m_isChick = !1;
                            console.log("泼水回调====");
                        });
                    }
                };
                e.prototype.recover = function () {
                    this.m_isSucceed && this.unschedule(this.recover);
                    if (this.m_analogyHp >= 3) this.m_analogyHp = 3; else {
                        this.m_analogyHp += 1;
                        var t = s.default.plotConf.txt5;
                        r.default.hero_ts.setRoleTips(!0, "label", t, {
                            num: 0,
                            times: 0,
                            interval: 0,
                            pos: "56|320"
                        });
                        this.scheduleOnce(function () {
                            r.default.hero_ts.setRoleTips(!1);
                        }, 4);
                    }
                    this.m_boxJs.playAni("await" + this.m_analogyHp, -1);
                };
                e.prototype.callBack = function () { };
                return a([h], e);
            }(c.default));
        o.default = d;
