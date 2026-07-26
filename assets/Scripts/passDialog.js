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
        var s = require("./PopupView"), r = require("./SoundManage"), c = require("./ViewManager"), l = cc._decorator, h = l.ccclass, d = l.property, p = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.ms_label = null;
                e.testNode = null;
                e.moveIndex = 100;
                return e;
            }
            e.prototype.onLoad = function () { };
            e.prototype.initData = function (t) {
                this.m_data = t;
                this.m_suerBack = t[1];
                this.m_continueBack = t[2];
            };
            e.prototype.start = function () { };
            e.prototype.openAct = function () {
                var t = this;
                this.moveIndex > 0 && setTimeout(function () {
                    t.testNode.x++;
                    t.testNode.scale += .05;
                    t.testNode.rotation += 1;
                    t.openAct();
                }, 100);
            };
            e.prototype.cancelBack = function () {
                this._onClose();
                this.m_continueBack && this.m_continueBack();
            };
            e.prototype.btn_prop = function () {
                console.log("==道具=");
                c.default.open("dialog/showpropDialog");
            };
            e.prototype.btn_story = function () {
                console.log("===历史=");
                c.default.open("dialog/showhistoryDialog");
            };
            e.prototype.mainBack = function () {
                c.default.open("dialog/tipsDialog", ["<b><size=28>是否确定离开，并返回主页？</>", "（谨慎：将会丢失未保存的游戏进度！）", function () {
                    console.log("==确定=回调=");
                    r.default.stopBGM();
                    setTimeout(function () {
                        cc.director.loadScene("mainScene", function () {
                            console.log("==1111== mainScene==success=====");
                        });
                    }, 200);
                }]);
            };
            e.prototype.setBack = function () {
                c.default.open("dialog/setDialog", ["param", function () { }], function () { });
            };
            a([d(cc.Label)], e.prototype, "ms_label", void 0);
            a([d(cc.Node)], e.prototype, "testNode", void 0);
            return a([h], e);
        }(s.default);
        o.default = p;
