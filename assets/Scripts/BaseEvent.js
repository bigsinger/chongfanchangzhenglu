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
                return null !== t && t.apply(this, arguments) || this;
            }
            e.prototype.initData = function (t, e, o) {
                this.m_eventData = t;
                this.m_spineNode = e;
                this.m_boxJs = o;
                this.init();
            };
            e.prototype.init = function () { };
            e.prototype.run = function () { };
            e.prototype.callBack = function () { };
            e.prototype.setNext = function (t) {
                this.m_next = t;
            };
            return a([r], e);
        }(cc.Component));
        o.default = c;
