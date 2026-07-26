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
        });
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var a = require("./SoundManage"), s = require("./ViewManager"), r = require("./spineManager"), c = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.m_isChick = !1;
                return e;
            }
            e.prototype.ctor = function () { };
            e.prototype.onLoad = function () { };
            e.prototype.start = function () { };
            e.prototype.openView = function (t, e, o) {
                void 0 === e && (e = []);
                void 0 === o && (o = null);
                s.default.open(t, e, o);
            };
            e.prototype.setClick = function (t, e) {
                var o = this;
                void 0 === e && (e = !1);
                this.m_baseNode = new cc.Node();
                e && (this.m_baseNode.group = "ui");
                t.parent.addChild(this.m_baseNode);
                this.m_baseNode.zIndex = 99999;
                this.m_baseNode.active = !1;
                this.m_baseNode.addComponent(r.default);
                this.m_baseSpineManagerTs = this.m_baseNode.getComponent(r.default);
                this.m_baseSpineManagerTs.m_specialParm = !0;
                this.m_baseSpineManagerTs.initData(this.m_baseNode, "click", "effect/click", function () {
                    o.m_isChick = !1;
                }, 1);
                t.on(cc.Node.EventType.TOUCH_START, function (t) {
                    if (!o.m_isChick) {
                        o.m_isChick = !0;
                        var e = t.getLocation();
                        o.m_baseNode.x = e.x;
                        o.m_baseNode.y = e.y;
                        o.m_baseNode.active = !0;
                        o.m_baseSpineManagerTs.setAction("click", 1);
                    }
                });
            };
            e.prototype.createPrefab = function (t, e) {
                void 0 === e && (e = null);
                cc.resources.load("prefab/" + t, cc.Prefab, function (t, o) {
                    if (t) {
                        console.log("--- err", t);
                        if (!e) return null;
                        e(null);
                        return;
                    }
                    e && e(cc.instantiate(o));
                });
            };
            e.prototype.setSpriteFrame = function (t, e) {
                cc.resources.load(e, cc.SpriteFrame, function (e, o) {
                    e || (t.spriteFrame = o);
                });
            };
            e.prototype.addClickEvent = function (t, e, o, i, n) {
                void 0 === n && (n = null);
                t.on(e, function () {
                    o && o(n);
                }, i, n);
            };
            e.prototype.onClose = function () { };
            e.prototype._onClose = function () {
                a.default.playSound("ui/back.mp3");
                s.default.close(this.node.name);
            };
            return e;
        }(cc.Component);
        o.default = c;
