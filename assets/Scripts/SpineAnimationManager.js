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
        var s = require("./GameState"), r = require("./AudioManager"), v = require("./ResourceManager"), c = cc._decorator, l = c.ccclass, h = (c.property,
            function (t) {
                n(e, t);
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    e.m_timeScale = 1;
                    e.m_path = "dragonBones/";
                    e.m_parentNode = null;
                    e.m_specialParm = !1;
                    e.m_loadAry = ["before", "centre", "after"];
                    e.m_resourceScope = "";
                    return e;
                }
                e.prototype.onLoad = function () {
                    this.m_armatureName = "Armature";
                    this.m_timeScale = 1;
                    this.m_resourceScope = v.default.createScope("spine");
                };
                e.prototype.onDestroy = function () {
                    // Scene changes can destroy the outgoing Spine component
                    // immediately before the incoming scene requests the same
                    // cached SkeletonData (notably role_erwa1 between chapters
                    // 2 and 3). Creator 2.4.15 clears SkeletonData.textures on
                    // release, so a same-frame reload can receive a poisoned
                    // cached asset and fail in isTexturesLoaded every frame.
                    // A short grace period lets the next owner register its
                    // reference while keeping abandoned assets bounded.
                    v.default.releaseScopeDeferred(this.m_resourceScope);
                };
                e.prototype.start = function () {
                    this.m_parentNode && this.addDragonBones(this.m_parentNode, this.m_path, this._onLoadComplete.bind(this));
                };
                e.prototype.initData = function (t, e, o, i, n, a, s) {
                    void 0 === o && (o = "ani01");
                    void 0 === i && (i = null);
                    void 0 === n && (n = 0);
                    void 0 === a && (a = 1);
                    void 0 === s && (s = null);
                    if (t) {
                        this.m_parentNode = t;
                        this.m_playName = e || "await";
                        this.m_curPlayName = this.m_playName;
                        this.m_path = "dragonBones/" + o;
                        this.m_callBack = i;
                        this.m_playTimes = !n;
                        this.m_timeScale = a;
                        this.m_loadCallBack = s;
                    }
                };
                e.prototype.setAction = function (t, e, o) {
                    void 0 === e && (e = this.m_playTimes);
                    void 0 === o && (o = this.m_timeScale);
                    if (!t) return console.log("=playName=参数错误=");
                    if (this.m_skeleton) {
                        this.m_playTimes = !e && -1 != o;
                        this.m_playName = t;
                        var i = this.m_skeleton.setAnimation(0, this.m_playName, this.m_playTimes);
                        -1 == o && (i.trackTime = i.animationEnd);
                        this.m_skeleton.timeScale = o;
                        this.m_curPlayName = t;
                    } else console.log("=m_skeleton=对象为null=");
                };
                e.prototype.stopAction = function () {
                    this.m_skeleton ? this.m_skeleton.timeScale = 0 : console.log("===stopAction==", this.m_path);
                };
                e.prototype.goOnAction = function () {
                    this.m_skeleton ? this.m_skeleton.timeScale = this.m_timeScale : console.log("===goOnAction==", this.m_path);
                };
                e.prototype.addDragonBones = function (t, e, o) {
                    void 0 === o && (o = null);
                    var i = e, n = this;
                    v.default.loadDirTyped(i, sp.SkeletonData, function () { }, function (e, i) {
                        if (e) console.log("========骨骼动画加载错误==请检查==" + e); else if (t && cc.isValid(t) && t.parent) {
                            t.getComponent(sp.Skeleton) && t.removeComponent(sp.Skeleton);
                            var a = t.addComponent(sp.Skeleton);
                            n.m_attachUtil = a.attachUtil;
                            a.skeletonData = i[0];
                            o && o(a);
                        }
                    }, n.m_resourceScope);
                };
                e.prototype._onLoadComplete = function (t) {
                    var e = this;
                    this.m_skeleton = t;
                    var o = this.m_playName;
                    if (o && "" != o) {
                        this.m_skeleton.setAnimation(0, o, this.m_playTimes);
                        this.m_curPlayName = o;
                        this.m_specialParm ? this.m_skeleton.setCompleteListener(function () {
                            e._onPlayComplete();
                        }) : this.m_skeleton.setEndListener(function () {
                            e._onPlayComplete();
                        });
                    }
                    this.m_loadCallBack && this.m_loadCallBack();
                    var i = this.m_skeleton.findSlot("body_prop");
                    i && i.color && (this.m_spineColor = {
                        r: i.color.r,
                        g: i.color.g,
                        b: i.color.b,
                        a: i.color.a
                    });
                };
                e.prototype._onPlayComplete = function () {
                    this.m_callBack && this.m_callBack(this.m_curPlayName);
                };
                e.prototype.eventListenerBack = function (t) {
                    void 0 === t && (t = "1");
                    var e = this.m_path.split("/"), o = s.default.soundConf[e[1] + "|" + this.m_playName];
                    o && o.fps != t && r.default.playSound("action/" + o.sound + ".mp3");
                };
                e.prototype.switchSolt = function (t) {
                    void 0 === t && (t = 0);
                    var e = this.m_skeleton.findSlot("body_prop"), o = this.m_skeleton.skeletonData.getRuntimeData(), i = o.findSkin("default"), n = o.findSlotIndex("body_prop"), a = i.getAttachment(n, "prop/prop" + t);
                    e.setAttachment(a);
                };
                e.prototype.switchHand = function (t) {
                    void 0 === t && (t = 0);
                    var e = this.m_skeleton.findSlot("hand_prop"), o = this.m_skeleton.skeletonData.getRuntimeData(), i = o.findSkin("default"), n = o.findSlotIndex("hand_prop"), a = i.getAttachment(n, "prop/prop" + t);
                    e.setAttachment(a);
                };
                e.prototype.setSlotColor = function (t) {
                    void 0 === t && (t = null);
                    // The Creator 2.4 Android Spine binding exposes a native
                    // Color proxy whose assignment throws and whose mutation
                    // can crash under Houdini translation.  This tint is only
                    // optional "already carrying this item" feedback, so keep
                    // native gameplay safe and leave the attachment unchanged.
                    if (cc.sys && cc.sys.isNative) return;
                    var e = this.m_skeleton.findSlot("body_prop"), o = t || this.m_spineColor;
                    if (e && e.color && o) {
                        // Creator 2.4's native Spine binding exposes Slot.color
                        // as a getter-only object.  Assigning the whole property
                        // throws on Android; mutate the returned Color instead.
                        var i = e.color;
                        "function" == typeof i.setFromColor ? i.setFromColor(o) : "function" == typeof i.set ? i.set(o.r, o.g, o.b, o.a) : (i.r = o.r, i.g = o.g, i.b = o.b, i.a = o.a);
                    }
                };
                e.prototype.switchHead = function (t) {
                    var e = this.m_skeleton.findSlot("tou"), o = this.m_skeleton.skeletonData.getRuntimeData(), i = o.findSkin("default"), n = o.findSlotIndex("tou"), a = i.getAttachment(n, "tou_" + t);
                    e.setAttachment(a);
                };
                e.prototype.switchLoad = function (t, e) {
                    var o, i = t.loadorder.split(",");
                    for (var n in this.m_loadAry) {
                        var a = 0;
                        for (var s in i) {
                            if (this.m_loadAry[n] == i[s]) {
                                o = e ? t.number : 0;
                                this.setAttachment(this.m_loadAry[n], this.m_loadAry[n] + o);
                                break;
                            }
                            ++a >= i.length && this.setAttachment(this.m_loadAry[n], this.m_loadAry[n] + 0);
                        }
                    }
                };
                e.prototype.setAttachment = function (t, e) {
                    console.log(t + "==插槽=图片=" + e);
                    var o = this.m_skeleton.findSlot(t), i = this.m_skeleton.skeletonData.getRuntimeData(), n = i.findSkin("default"), a = i.findSlotIndex(t), s = n.getAttachment(a, e);
                    o.setAttachment(s);
                };
                e.prototype.changeSlot = function () { };
                return a([l], e);
            }(cc.Component));
        o.default = h;
