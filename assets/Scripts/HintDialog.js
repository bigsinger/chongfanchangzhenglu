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
        var s = require("./PopupView"), r = require("./AudioManager"), c = cc._decorator, l = c.ccclass, h = c.property, d = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.ms_label = null;
                e.caution_label = null;
                e.again_label = null;
                e.suer_node = null;
                e.canel_node = null;
                e.suer1_node = null;
                return e;
            }
            e.prototype.onLoad = function () { };
            e.prototype.initData = function (t) {
                this.m_data = t;
                this.m_suerBack = t[2];
                this.m_continueBack = t[3];
                this.m_againData = t[4];
                this.m_onceSuer = t[5];
            };
            e.prototype.start = function () {
                this.ms_label.string = this.m_data[0];
                this.caution_label.node.active = !1;
                if (this.m_data[1] && "" != this.m_data[1]) {
                    this.caution_label.string = this.m_data[1];
                    this.caution_label.node.active = !0;
                }
                if (this.m_againData) {
                    this.again_label.string = this.m_againData;
                    this.again_label.node.active = !0;
                }
                if (this.m_onceSuer) {
                    this.suer_node.active = !1;
                    this.suer1_node.active = !0;
                    this.canel_node.active = !1;
                }
            };
            e.prototype.sureBack = function () {
                this._onClose();
                r.default.stopBGM();
                this.m_suerBack && this.m_suerBack();
            };
            e.prototype.cancelBack = function () {
                this._onClose();
                this.m_continueBack && this.m_continueBack();
            };
            a([h(cc.RichText)], e.prototype, "ms_label", void 0);
            a([h(cc.Label)], e.prototype, "caution_label", void 0);
            a([h(cc.Label)], e.prototype, "again_label", void 0);
            a([h(cc.Node)], e.prototype, "suer_node", void 0);
            a([h(cc.Node)], e.prototype, "canel_node", void 0);
            a([h(cc.Node)], e.prototype, "suer1_node", void 0);
            return a([l], e);
        }(s.default);
        o.default = d;
