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
        var s = require("./PopupView"), r = require("./GameUtilities"), c = cc._decorator, l = c.ccclass, h = c.property, d = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.tipis_label = null;
                e.node_num1 = null;
                e.node_num2 = null;
                e.node_num3 = null;
                e.node_lock = null;
                e.node_body = null;
                e.node_pole = null;
                e.node_btn = null;
                e.numArr1 = [];
                e.numArr2 = [];
                e.numArr3 = [];
                e.isRotate = !1;
                e.m_password0 = 1;
                e.m_password1 = 2;
                e.m_password2 = 3;
                e.m_text = ["", "金", "木", "水", "火", "土"];
                e.m_figure = {
                    1: [7, 8],
                    2: [1, 2],
                    3: [9, 10],
                    4: [3, 4],
                    5: [5, 6]
                };
                return e;
            }
            e.prototype.initData = function (t) {
                this.m_password = t[0];
                this.m_back = t[1];
                this.m_closeBack = t[2];
            };
            e.prototype.onLoad = function () { };
            e.prototype.start = function () {
                var t = this;
                this.node.getChildByName("mask_node").on(cc.Node.EventType.TOUCH_START, function () {
                    if (!t.isRotate) {
                        console.log("==close=");
                        t._onClose();
                    }
                });
                this.uiContent.on(cc.Node.EventType.TOUCH_START, function () { });
                this.initNum();
            };
            e.prototype.initNum = function () {
                for (var t = 1; t <= 3; t++) this.createNum(t, this["m_password" + (t - 1)]);
            };
            e.prototype.createNum = function (t, e, o) {
                void 0 === o && (o = !1);
                var i = new cc.Node(), n = i.addComponent(cc.Sprite);
                r.default.setSpriteFrame(n, "dialog/unlock/z" + t);
                var a = new cc.Node(), s = a.addComponent(cc.Sprite);
                r.default.setSpriteFrame(s, "dialog/unlock/image_wz" + e);
                o && (i.y = -165);
                i.addChild(a);
                this["numArr" + t].push(i);
                this["node_num" + t].addChild(i);
            };
            e.prototype.numAct = function (t) {
                var e = this, o = this["numArr" + t][0];
                o.runAction(cc.sequence(cc.moveBy(.15, cc.v2(0, 180)), cc.callFunc(function () {
                    o.removeFromParent();
                    e["numArr" + t].splice(0, 1);
                    e.isRotate = !1;
                })));
                this["numArr" + t][1].runAction(cc.sequence(cc.moveBy(.15, cc.v2(0, 180)), cc.moveTo(.07, cc.v2(0, 0))));
            };
            e.prototype.addBack = function (t, e) {
                if (!this.isRotate) {
                    this.isRotate = !0;
                    this["m_password" + e] += 1;
                    this["m_password" + e] = this["m_password" + e] > 5 ? 1 : this["m_password" + e];
                    var o = Number(e) + 1;
                    this.createNum(o, this["m_password" + e], !0);
                    this.numAct(o);
                }
            };
            e.prototype.minusBack = function (t, e) {
                this["m_password" + e] -= 1;
                this["m_password" + e] = this["m_password" + e] < 1 ? 5 : this["m_password" + e];
            };
            e.prototype.sureBack = function () {
                var t = this;
                if (this.findVal()) {
                    this.isRotate = !0;
                    this.node_btn.active = !1;
                    this.node_pole.runAction(cc.sequence(cc.moveBy(.2, cc.v2(220, 0)), cc.callFunc(function () {
                        t.node_body.runAction(cc.sequence(cc.spawn(cc.rotateBy(.12, -8), cc.moveBy(.12, cc.v2(0, -16))), cc.spawn(cc.rotateBy(.09, 2), cc.moveBy(.09, cc.v2(0, 2)))));
                    }), cc.delayTime(1), cc.callFunc(function () {
                        t.m_back && t.m_back();
                        t._onClose();
                    })));
                } else {
                    this.setTipis("密码不对噢，请认真观察后重试！");
                    this.node_lock.stopAllActions();
                    this.node_lock.x = 0;
                    this.node_lock.y = 0;
                    var e = cc.sequence(cc.moveBy(.06, cc.v2(-7, -2)), cc.moveBy(.06, cc.v2(14, 3)), cc.moveBy(.06, cc.v2(-13, -2)), cc.moveBy(.06, cc.v2(13, 2)), cc.moveBy(.06, cc.v2(-11, -1)), cc.moveTo(.06, cc.v2(0, 0)));
                    this.node_lock.runAction(e);
                }
            };
            e.prototype.setTipis = function () {
                255 != this.tipis_label.node.opacity && this.tipis_label.node.runAction(cc.sequence(cc.fadeIn(1), cc.delayTime(1.5), cc.fadeOut(.5)));
            };
            e.prototype.findVal = function () {
                var t = this.m_figure[this.m_password0], e = this.m_figure[this.m_password1], o = this.m_figure[this.m_password2], i = 0, n = Number(this.m_password), a = Math.floor(n / 100), s = Math.floor(n % 100 / 10), r = n % 100 % 10, c = function (t, e) {
                    for (var o in t) if (t[o] == e) {
                        i++;
                        break;
                    }
                };
                c(t, a);
                c(e, s);
                c(o, r);
                return i >= 3;
            };
            e.prototype.onDisable = function () {
                this.m_closeBack && this.m_closeBack();
            };
            a([h(cc.Label)], e.prototype, "tipis_label", void 0);
            a([h(cc.Node)], e.prototype, "node_num1", void 0);
            a([h(cc.Node)], e.prototype, "node_num2", void 0);
            a([h(cc.Node)], e.prototype, "node_num3", void 0);
            a([h(cc.Node)], e.prototype, "node_lock", void 0);
            a([h(cc.Node)], e.prototype, "node_body", void 0);
            a([h(cc.Node)], e.prototype, "node_pole", void 0);
            a([h(cc.Node)], e.prototype, "node_btn", void 0);
            return a([l], e);
        }(s.default);
        o.default = d;
