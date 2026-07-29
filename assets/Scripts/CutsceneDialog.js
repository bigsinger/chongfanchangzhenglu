'use strict';

/**
 * 模块职责：播放可跳过的场景剧情动画。
 * 关键约束：跳过和自然结束共用收尾路径，确保临时节点、音频与等待标记都被清理。
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
        var s = require("./PopupView"), r = require("./SpineAnimationManager"), c = cc._decorator, l = c.ccclass, h = c.property, d = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.node_ani = null;
                e.node_black = null;
                e.canSkip = !1;
                e.isClosing = !1;
                e.callbackDispatched = !1;
                e.skipHint = null;
                return e;
            }
            e.prototype.initData = function (t) {
                var e = this;
                if (t) {
                    this.node.runAction(cc.fadeIn(.3));
                    var o = this.node_ani.addComponent(r.default);
                    o.m_specialParm = !0;
                    o.initData(this.node_ani, "daiji", "effect/inbetweening" + t[0], function () {
                        if (e.isClosing) return;
                        e.disposeAnimation();
                        e.closeAct();
                    }, 1);
                    this.closeBack = t[1];
                }
            };
            e.prototype.disposeAnimation = function () {
                if (this.node_ani && cc.isValid(this.node_ani)) {
                    this.node_ani.stopAllActions();
                    this.node_ani.removeFromParent();
                    this.node_ani.destroy();
                }
            };
            e.prototype.skipAnimation = function () {
                if (!this.canSkip || this.isClosing) return;
                this.disposeAnimation();
                this.closeAct();
            };
            e.prototype.closeAct = function () {
                if (this.isClosing) return;
                this.isClosing = !0;
                var t = this;
                this.node_black.active = !0;
                this.node_black.runAction(cc.sequence(cc.fadeOut(.4), cc.callFunc(function () {
                    t._onClose();
                })));
            };
            e.prototype.start = function () {
                var t = this, e = cc.view.getVisibleSize(), o = new cc.Node("skip_hint"), i = o.addComponent(cc.Label);
                i.string = "点击屏幕跳过";
                i.fontSize = 24;
                i.lineHeight = 30;
                i.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                var n = o.addComponent(cc.LabelOutline);
                n.color = cc.Color.BLACK;
                n.width = 2;
                o.color = cc.Color.WHITE;
                o.opacity = 220;
                o.zIndex = cc.macro.MAX_ZINDEX;
                o.setPosition(e.width / 2 - 105, e.height / 2 - 48);
                this.node.addChild(o);
                this.skipHint = o;
                this.node.on(cc.Node.EventType.TOUCH_END, this.skipAnimation, this);
                this.scheduleOnce(function () {
                    t.canSkip = !0;
                }, .35);
            };
            e.prototype.onDisable = function () {
                this.unscheduleAllCallbacks();
                this.node.off(cc.Node.EventType.TOUCH_END, this.skipAnimation, this);
                this.disposeAnimation();
                if (!this.callbackDispatched && this.closeBack) {
                    this.callbackDispatched = !0;
                    this.closeBack();
                }
            };
            a([h(cc.Node)], e.prototype, "node_ani", void 0);
            a([h(cc.Node)], e.prototype, "node_black", void 0);
            return a([l], e);
        }(s.default);
        o.default = d;
