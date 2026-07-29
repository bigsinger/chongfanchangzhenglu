'use strict';

/**
 * 模块职责：让主角相关背景或阴影跟随角色状态。
 * 关键约束：表现层不写入角色逻辑，避免视觉节点影响碰撞。
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
                e.node_ani = null;
                e.move_range = 0;
                e.move_space = 0;
                return e;
            }
            e.prototype.start = function () {
                var t = this;
                this.node_ani.scaleX = this.move_range > 0 ? Math.abs(this.node_ani.scaleX) : -Math.abs(this.node_ani.scaleX);
                var e = Math.abs(Number(this.move_range)) / 80;
                this.node_ani.opacity = 0;
                var o = cc.repeatForever(cc.sequence(cc.delayTime(Number(this.move_space)), cc.fadeIn(.3), cc.moveBy(e, cc.v2(Number(this.move_range), 0)), cc.fadeOut(.3), cc.callFunc(function () {
                    t.node_ani.x = 0;
                })));
                this.node_ani.runAction(o);
            };
            e.prototype.onDisable = function () {
                this.node_ani.stopAllActions();
            };
            a([c(cc.Node)], e.prototype, "node_ani", void 0);
            a([c(cc.Integer)], e.prototype, "move_range", void 0);
            a([c(cc.Integer)], e.prototype, "move_space", void 0);
            return a([r], e);
        }(cc.Component);
        o.default = l;
