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
        var v = require("./ResourceManager"), s = cc._decorator, r = s.ccclass, c = (s.property, function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.m_timeScale = 1;
                e.m_path = "dragonBones/";
                e.m_resourceScope = "";
                return e;
            }
            e.prototype.onLoad = function () {
                this.m_armatureName = "Armature";
                this.m_playTimes = 0;
                this.m_timeScale = 1;
                this.m_resourceScope = v.default.createScope("dragon-bones");
            };
            e.prototype.onDestroy = function () {
                v.default.releaseScope(this.m_resourceScope);
            };
            e.prototype.start = function () {
                this.addDragonBones(this.m_Node, this.m_path, this._onLoadComplete.bind(this));
            };
            e.prototype.initData = function (t, e, o, i, n, a) {
                void 0 === o && (o = "ani01");
                void 0 === i && (i = null);
                void 0 === n && (n = 0);
                void 0 === a && (a = 1);
                if (t) {
                    this.m_Node = t;
                    this.m_playName = e || "daiji";
                    this.m_curPlayName = this.m_playName;
                    this.m_path = "dragonBones/" + o;
                    this.m_callBcak = i;
                    this.m_playTimes = n;
                    this.m_timeScale = a;
                }
            };
            e.prototype.setAction = function (t, e, o) {
                void 0 === e && (e = this.m_playTimes);
                void 0 === o && (o = this.m_timeScale);
                if (!t) return console.log("=playName=参数错误=");
                if (this.m_dragonDisplay) {
                    this.m_playTimes = e || 0;
                    this.m_dragonDisplay.timeScale = o;
                    this.m_dragonDisplay.playAnimation(t, this.m_playTimes);
                    this.m_curPlayName = t;
                } else console.log("=m_dragonDisplay=对象为null=");
            };
            e.prototype.stopAction = function () {
                this.m_dragonDisplay && (this.m_dragonDisplay.timeScale = 0);
            };
            e.prototype.goOnAction = function () {
                this.m_dragonDisplay && (this.m_dragonDisplay.timeScale = this.m_timeScale);
            };
            e.prototype.addDragonBones = function (t, e, o) {
                void 0 === o && (o = null);
                var i = e, n = this;
                v.default.loadDir(i, function () { }, function (e, i) {
                    if (e) console.log("========龙骨动画加载错误==请检查==" + e); else if (!(i.length <= 0) && t && cc.isValid(t) && t.parent) {
                        t.getComponent(dragonBones.ArmatureDisplay) && t.removeComponent(dragonBones.ArmatureDisplay);
                        var n = t.addComponent(dragonBones.ArmatureDisplay);
                        i.forEach(function (t) {
                            t instanceof dragonBones.DragonBonesAsset && (n.dragonAsset = t);
                            t instanceof dragonBones.DragonBonesAtlasAsset && (n.dragonAtlasAsset = t);
                        });
                        o && o(n);
                    }
                }, n.m_resourceScope);
            };
            e.prototype._onLoadComplete = function (t) {
                this.m_dragonDisplay = t;
                t.timeScale = this.m_timeScale;
                var e = this.m_armatureName;
                "lingyou_item" == t.node.name && (e = "armatureName");
                e && "" != e && (t.armatureName = e);
                var o = this.m_playName;
                if (o && "" != o) {
                    this.m_dragonDisplay.playAnimation(o, this.m_playTimes);
                    this.m_curPlayName = o;
                    this.m_dragonDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this._onPlayComplete, this);
                }
            };
            e.prototype._onPlayComplete = function () {
                this.m_callBcak && this.m_callBcak(this.m_curPlayName);
            };
            e.prototype.switchSolt = function (t) {
                void 0 === t && (t = 0);
                this.m_dragonDisplay.armature().getSlot("body_prop").displayIndex = t;
            };
            e.prototype.switchHand = function (t) {
                void 0 === t && (t = 0);
                this.m_dragonDisplay.armature().getSlot("hand_prop").displayIndex = t;
            };
            e.prototype.setSlotColor = function (t) {
                this.m_dragonDisplay.armature().getSlot("body_prop")._setColor(t);
            };
            return a([r], e);
        }(cc.Component));
        o.default = c;
