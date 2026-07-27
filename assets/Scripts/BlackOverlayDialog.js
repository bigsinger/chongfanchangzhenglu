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
        var s = require("./PopupView"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.label_tips = null;
                return e;
            }
            e.prototype.initData = function (t) {
                this.m_Data = t[0] || "";
                this.m_callBack = t[1];
                this.m_time = t[2] || 1.5;
            };
            e.prototype.start = function () {
                var t = this;
                this.label_tips.string = this.m_Data.txt || "";
                var e = cc.sequence(cc.delayTime(this.m_time), cc.fadeOut(.7), cc.callFunc(function () {
                    t.m_callBack && t.m_callBack();
                    t._onClose();
                }));
                this.node.runAction(e);
            };
            a([l(cc.Label)], e.prototype, "label_tips", void 0);
            return a([c], e);
        }(s.default);
        o.default = h;
