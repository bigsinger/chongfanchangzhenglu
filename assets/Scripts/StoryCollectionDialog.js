'use strict';

/**
 * 模块职责：展示已解锁剧情回顾内容。
 * 关键约束：回顾模式不得重放会修改任务状态的事件。
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
                e.image_item = null;
                e.label_name = null;
                e.label_ms = null;
                return e;
            }
            e.prototype.initData = function (t) {
                this.m_Data = t[0];
            };
            e.prototype.start = function () {
                var t = this;
                this.node.on(cc.Node.EventType.TOUCH_START, function () {
                    t._onClose();
                });
                var e = this.m_Data.historyid;
                this.setSpriteFrame(this.image_item, "item/storymax/" + e);
                this.label_name.string = this.m_Data.history_name;
                this.label_ms.string = this.m_Data.ms;
            };
            a([l(cc.Sprite)], e.prototype, "image_item", void 0);
            a([l(cc.Label)], e.prototype, "label_name", void 0);
            a([l(cc.Label)], e.prototype, "label_ms", void 0);
            return a([c], e);
        }(s.default);
        o.default = h;
