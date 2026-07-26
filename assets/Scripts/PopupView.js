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
        var s = require("./BaseView"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.uiContent = null;
                e.btn_close = null;
                return e;
            }
            e.prototype.onLoad = function () {
                var t = this;
                if (this.uiContent && this.uiContent.getComponent(cc.Widget)) {
                    console.log("==当前屏幕大小==" + cc.winSize.width);
                    cc.winSize.width <= 1334 && (this.uiContent.scale = cc.winSize.width / 1650);
                }
                var e = this.node.getChildByName("btn_close");
                if (e = e || this.btn_close) {
                    // Several legacy popups are 1650 design units wide while
                    // the migrated game viewport is 1334. Their left-aligned
                    // close button was therefore laid out beyond the screen,
                    // leaving the modal impossible to dismiss by touch.
                    var o = e.getComponent(cc.Widget);
                    !o && e.parent && (o = e.parent.getComponent(cc.Widget));
                    if (o && this.node.width > cc.winSize.width) {
                        var i = (this.node.width - cc.winSize.width) / 2 + 20;
                        o.left = Math.max(Number(o.left) || 0, i);
                    }
                    e.on(cc.Node.EventType.TOUCH_END, function () {
                        t._onClose();
                    });
                }
                if (!cc.find("Canvas").getChildByName("node_control")) {
                    this.node.opacity = 0;
                    this.node.runAction(cc.fadeIn(.35));
                }
            };
            e.prototype.start = function () { };
            a([l(cc.Node)], e.prototype, "uiContent", void 0);
            a([l(cc.Node)], e.prototype, "btn_close", void 0);
            return a([c], e);
        }(s.default);
        o.default = h;
