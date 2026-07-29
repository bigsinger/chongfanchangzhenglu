'use strict';

/**
 * 模块职责：显示通用确认与取消选择。
 * 关键约束：输入锁定到第一次选择，防止快速连点触发两个相反结果。
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
        var s = require("./PopupView"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.sp_check = null;
                return e;
            }
            e.prototype.initData = function (t) {
                if (t) {
                    this.setSpriteFrame(this.sp_check, "gk/scenes_public/check/check_" + t[0]);
                    this.closeBack = t[1];
                } else console.log("----- 检视图片参数有误");
            };
            e.prototype.start = function () {
                var t = this;
                this.node.on(cc.Node.EventType.TOUCH_START, function () {
                    t._onClose();
                });
            };
            e.prototype.onDisable = function () {
                this.closeBack && this.closeBack();
            };
            a([l(cc.Sprite)], e.prototype, "sp_check", void 0);
            return a([c], e);
        }(s.default);
        o.default = h;
