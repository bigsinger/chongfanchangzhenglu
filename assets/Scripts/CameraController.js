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
        var s = cc._decorator, r = s.ccclass, c = (s.property, function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.showWidth = 0;
                e.showHeight = 0;
                e.mapWidth = 0;
                e.mapHeight = 0;
                e.lastX = 0;
                e.lastY = 0;
                e.SPEED_MAX = 20;
                e.xRate = 1;
                e.speedX = e.SPEED_MAX;
                e.speedY = 0;
                e.SPEED_DEFAULT = 25;
                e.trackPos = {
                    x: 0,
                    y: 0
                };
                e.dif_x = 0;
                e.dif_y = 0;
                return e;
            }
            e.prototype.initCamera = function (t, e, o, i, n) {
                this.unscheduleAllCallbacks();
                this.gameManager = n;
                this.camera_ts = this.node.getComponent(cc.Camera);
                this.camera_ts.zoomRatio = 1;
                // Camera focus offsets belong to the previous scripted shot.
                // This component survives map reloads, so retaining them can
                // leave the hero at the edge of the next playable view.
                this.dif_x = 0;
                this.dif_y = 0;
                this.showWidth = t;
                this.showHeight = e;
                this.mapWidth = o;
                this.mapHeight = i;
            };
            e.prototype.getZoom = function () {
                return this.camera_ts.zoomRatio;
            };
            e.prototype.restoreCamera = function (t, e) {
                if (e) {
                    var o = !0;
                    if ("" != e.ss) this.camera_ts.zoomRatio = Number(e.ss); else {
                        o = !1;
                        this.camera_ts.zoomRatio = 1;
                    }
                    if ("" != e.x && "" != e.y) {
                        this.dif_x = Number(e.x) - t.x;
                        this.dif_y = Number(e.y) - t.y;
                        this.checkCamera(Number(e.x), Number(e.y));
                    } else {
                        o = !1;
                        this.checkCamera(t.x, t.y);
                    }
                    o && "" != e.se && "" != e.time && "" != e.mod && this.zoom(Number(e.mod), Number(e.se), null, Number(e.time));
                } else {
                    this.camera_ts.zoomRatio = 1;
                    this.checkCamera(t.x, t.y);
                }
            };
            e.prototype.initTrack = function (t) {
                this.trackPos = t;
                this.xRate = 0;
                this.speedX = 0;
                this.speedY = 0;
            };
            Object.defineProperty(e.prototype, "ratio", {
                get: function () {
                    return this.camera_ts.zoomRatio;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.trackPosAct = function (t) {
                this.checkCamera(t.x + this.dif_x, t.y + this.dif_y);
            };
            e.prototype.restoreHeroTracking = function (t) {
                this.unscheduleAllCallbacks();
                this.dif_x = 0;
                this.dif_y = 0;
                this.trackPosAct(t);
            };
            e.prototype.checkCamera = function (t, e) {
                var o = cc.view.getVisibleSize();
                o && o.width > 0 && o.height > 0 && (this.showWidth = o.width, this.showHeight = o.height);
                var i = Math.max(.01, Number(this.camera_ts.zoomRatio) || 1);
                var n = this.mapHeight / 2, a = this.showHeight / (2 * i), s = Math.max(0, n - a);
                e = Math.max(-s, Math.min(s, e));
                var r = this.mapWidth / 2, c = this.showWidth / (2 * i), l = Math.max(0, r - c);
                t = Math.max(-l, Math.min(l, t));
                this.node.x = t;
                this.node.y = e;
            };
            e.prototype.zoom = function (t, e, o, i, n) {
                var a = this;
                void 0 === o && (o = null);
                void 0 === i && (i = .5);
                void 0 === n && (n = null);
                this.unscheduleAllCallbacks();
                var s = Math.floor(60 * i), r = (e - this.camera_ts.zoomRatio) / s, c = 0, l = 0;
                if (o) {
                    null != o.x && (c = (o.x - this.node.x) / s);
                    null != o.y && (l = (o.y - this.node.y) / s);
                } else {
                    c = -this.dif_x / s;
                    l = -this.dif_y / s;
                }
                var h = 0, d = 0;
                if (1 == t) {
                    c -= (h = c / s) * (s / 2);
                    l -= (d /= s) * (s / 2);
                } else if (2 == t) {
                    c += s / 2 * -(h = -c / s);
                    l += s / 2 * -(d = -d / s);
                }
                this.schedule(function () {
                    a.camera_ts.zoomRatio += r;
                    a.dif_x += c;
                    a.dif_y += l;
                    c += h;
                    l += d;
                    if (--s <= 0) {
                        // Make "return to hero" exact; accumulated fractional
                        // offsets otherwise remain visible on wide screens.
                        if (!o) {
                            a.dif_x = 0;
                            a.dif_y = 0;
                        }
                        n && n();
                    }
                }, 0, s - 1);
            };
            e.prototype.stateBack = function () {
                this.node.x = this.lastX;
                this.node.y = this.lastY;
                this.camera_ts.zoomRatio = 1;
            };
            e.prototype.setCameraZoomRatio = function (t) {
                if (!t) return console.log("=zoomRatioNum=参数错误");
                this.camera_ts.zoomRatio = t;
            };
            return a([r], e);
        }(cc.Component));
        o.default = c;
