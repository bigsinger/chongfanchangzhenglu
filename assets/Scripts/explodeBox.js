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
        var s = require("./DragonBonesManager"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.m_path = "effect/baoza1";
                e.node_mount = null;
                return e;
            }
            e.prototype.start = function () {
                this.node.addComponent(s.default);
                this.m_dragonBones = this.node.getComponent(s.default);
                this.m_dragonBones.initData(this.node_mount, "daiji", this.m_path, this.aniComplete.bind(this), 1);
            };
            e.prototype.aniComplete = function () { };
            e.prototype.initData = function (t, e, o) {
                void 0 === t && (t = null);
                void 0 === e && (e = {
                    width: 160,
                    height: 260
                });
                void 0 === o && (o = "effect/baoza1");
                this.m_callBack = t;
                this.m_path = o;
                var i = this.node.getComponent(cc.PhysicsBoxCollider);
                this.m_width = i.size.width = e.width;
                this.m_height = i.size.height = e.height;
                i.apply();
            };
            e.prototype.onBeginContact = function (t, e, o) {
                o.tag && this.m_callBack && this.m_callBack();
            };
            e.prototype.clear = function (t) {
                var e = this;
                void 0 === t && (t = null);
                this.scheduleOnce(function () {
                    t && t();
                    e.node.removeFromParent();
                    e.node.destroy();
                }, .5);
            };
            e.prototype.onDestroy = function () {
                this.unscheduleAllCallbacks();
            };
            a([l(cc.Node)], e.prototype, "node_mount", void 0);
            return a([c], e);
        }(cc.Component);
        o.default = h;
