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
        var s = require("./BaseView"), r = require("./GameState"), c = require("./AudioManager"), l = require("./DialogManager"), h = require("./SpineAnimationManager"), d = cc._decorator, p = d.ccclass, u = d.property, m = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.label_version = null;
                e.sp_state = null;
                e.node_gm = null;
                e.eb_chapter = null;
                e.eb_map = null;
                e.role_node = null;
                return e;
            }
            e.prototype.onLoad = function () {
                this.label_version.string = r.default._version;
                1 == r.default.chapter && 1 == r.default.mapIndex ? this.setSpriteFrame(this.sp_state, "public/btn_xyx") : this.setSpriteFrame(this.sp_state, "public/btn_jxyx");
                this.setClick(this.node);
                cc.debug.setDisplayStats(!1);
            };
            e.prototype.start = function () {
                c.default.gamePlayBGM("home");
                r.default.onlinetm = new Date().getTime();
            };
            e.prototype.roleDragonBones = function () {
                this.role_node.addComponent(h.default);
                this.m_roleDbJs = this.role_node.getComponent(h.default);
                this.role_node.scale = 1.5;
                this.m_roleDbJs.initData(this.role_node, "am01", "ui_ditu", function () { });
            };
            e.prototype.btn_gameBack = function () {
                c.default.playSound("ui/start.mp3");
                console.log("===开始游戏=");
                if ("" != this.eb_chapter.string) {
                    r.default.chapter = Number(this.eb_chapter.string);
                    r.default.Smallplot = "0_" + r.default.chapter;
                }
                "" != this.eb_map.string && (r.default.mapIndex = Number(this.eb_map.string));
                this.gotoLoginScene();
            };
            e.prototype.btn_prop = function () {
                c.default.playSound("ui/click.mp3");
                console.log("==道具=");
                l.default.open("dialog/showpropDialog");
            };
            e.prototype.btn_story = function () {
                c.default.playSound("ui/click.mp3");
                console.log("===历史=");
                l.default.open("dialog/showhistoryDialog");
            };
            e.prototype.btn_chapter = function () {
                c.default.playSound("ui/click.mp3");
                console.log("===章节=");
                l.default.open("dialog/chapterDialog", [!1]);
            };
            e.prototype.btn_menu = function () {
                c.default.playSound("ui/click.mp3");
                console.log("===设置=");
                l.default.open("dialog/setDialog", ["param", function () { }]);
            };
            e.prototype.btn_test = function () {
                l.default.open("view/roadView", ["param", function () { }]);
            };
            e.prototype.gotoLoginScene = function () {
                setTimeout(function () {
                    c.default.stopBGM();
                    cc.director.loadScene("transitionScene", function () {
                        console.log("==1111== gameScene==success=====");
                    });
                }, 200);
            };
            a([u(cc.Label)], e.prototype, "label_version", void 0);
            a([u(cc.Sprite)], e.prototype, "sp_state", void 0);
            a([u(cc.Node)], e.prototype, "node_gm", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_chapter", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_map", void 0);
            a([u(cc.Node)], e.prototype, "role_node", void 0);
            return a([p], e);
        }(s.default);
        o.default = m;
