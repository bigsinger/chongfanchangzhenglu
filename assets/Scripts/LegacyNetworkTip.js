'use strict';

/**
 * 模块职责：兼容旧网络提示预制体的显示接口。
 * 关键约束：离线模式下只提供可关闭反馈，不阻塞加载或剧情。
 */

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
                e.m_callBack = null;
                e.lb_title = null;
                return e;
            }
            e.prototype.start = function () {
                this.node.on(cc.Node.EventType.TOUCH_START, function () { });
            };
            e.prototype.initCallBack = function (t, e) {
                this.m_callBack = null;
                this.m_callBack = t;
                this.lb_title.string = e;
            };
            e.prototype.sureCall = function () {
                this.m_callBack && this.m_callBack();
                this.node.active = !1;
            };
            e.prototype.cancelCall = function () {
                this.node.active = !1;
            };
            a([c(cc.Label)], e.prototype, "lb_title", void 0);
            return a([r], e);
        }(cc.Component);
        o.default = l;
