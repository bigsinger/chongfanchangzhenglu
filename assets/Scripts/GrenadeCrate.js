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
        var s = require("./PopupView"), r = require("./AudioManager"), c = require("./SpineAnimationManager"), l = cc._decorator, h = l.ccclass, d = (l.property,
            function (t) {
                n(e, t);
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    e.m_grenade = 5;
                    e.m_index = .55;
                    return e;
                }
                e.prototype.initData = function (t, e, o, i) {
                    void 0 === i && (i = !1);
                    this.m_callBack = t;
                    this.m_endBack = o;
                    this.m_once = !1;
                    this.m_goods = e;
                    this.m_imgPath = "public/goods/" + e.imgname;
                    this.m_isAbandon = i;
                };
                e.prototype.update = function () { };
                e.prototype.start = function () {
                    var t = this;
                    if (3 == this.m_goods.id) {
                        this.m_dragonBones = this.node.addComponent(c.default);
                        this.m_dragonBones.initData(this.node, "daiji", "scani20", function () { });
                    } else this.setSpriteFrame(this.node.getComponent(cc.Sprite), this.m_imgPath);
                    if (this.m_isAbandon) {
                        var e = this.node.getComponent(cc.RigidBody), o = this.node.getComponent(cc.PhysicsBoxCollider);
                        e.gravityScale = 2;
                        o.sensor = !0;
                        o.apply();
                        1 == this.m_goods.isthrow && this.scheduleOnce(function () {
                            t.node.removeFromParent();
                            t.node.destroy();
                        }, 300);
                    }
                };
                e.prototype.onBeginContact = function (t, e, o) {
                    var i = this;
                    if (999 != o.tag && !o.sensor && 1001 != o.tag) {
                        1 == this.m_goods.id && r.default.playSound("grenadebang.mp3");
                        var n = this.node.getComponent(cc.RigidBody), a = this.node.getComponent(cc.PhysicsBoxCollider);
                        if (2 == n.gravityScale) return;
                        n.gravityScale = 2;
                        a.apply();
                        if (this.m_callBack && !this.m_once) {
                            this.m_once = !0;
                            this.setplay();
                            this.m_callBack();
                        }
                        if (0 == o.tag && !a.sensor) {
                            this.scheduleOnce(function () {
                                i.node.removeComponent(cc.PhysicsBoxCollider);
                                i.node.removeComponent(cc.RigidBody);
                            }, .1);
                            this.node.runAction(cc.rotateTo(.1, 0));
                        }
                    }
                };
                e.prototype.BoomBack = function (t) {
                    var e = this;
                    void 0 === t && (t = 1);
                    var o = 1.5 - this.m_index > 0 ? 1.5 - this.m_index : .08;
                    this.scheduleOnce(function () {
                        e.m_index += .2;
                        e.m_grenade--;
                        e.node.color = e.m_grenade % 2 == 0 ? cc.color(255, 255, 255) : cc.color(255, 30, 10);
                        e.m_grenade >= 0 ? e.BoomBack(0) : e.m_endBack && e.m_endBack();
                    }, o);
                };
                e.prototype.setplay = function () {
                    this.m_dragonBones && this.m_dragonBones.setAction("posui", 1);
                };
                e.prototype.onDestroy = function () {
                    this.unscheduleAllCallbacks();
                };
                return a([h], e);
            }(s.default));
        o.default = d;
