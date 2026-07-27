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
        var s = require("./GameState"), r = require("./PopupView"), c = require("./GameUtilities"), l = cc._decorator, h = l.ccclass, d = l.property, p = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.lb_name = null;
                e.lb_txt = null;
                e.node_left = null;
                e.img_left = null;
                e.node_right = null;
                e.img_right = null;
                e.node_con = null;
                e.curCount = 0;
                e.maxCount = 0;
                e.curTxt = "";
                e.isTxtAct = !0;
                e.hiddenHudNodes = [];
                return e;
            }
            e.prototype.onLoad = function () {
                // Creator 2.4's native renderer can leak the stencil/scissor
                // state from an active cc.Mask into a later UI-camera pass.
                // goods_mask's right edge was consequently clipping every
                // plot-dialog child at the same vertical line. A modal plot
                // should hide the underlying HUD anyway, so suspend masked HUD
                // nodes while it is alive and restore their state on close.
                var t = this, e = ["Canvas/goods_mask"];
                this.hiddenHudNodes = [];
                e.forEach(function (e) {
                    var o = cc.find(e);
                    o && o.active && (t.hiddenHudNodes.push(o), o.active = !1);
                });
            };
            e.prototype.fitViewport = function () {
                // The scene still has a 1650-wide legacy Canvas while the popup
                // prefab was authored at 1800x900.  Resolve the explicit UI
                // camera (Camera.findCamera may return the moving world camera)
                // and feed it design coordinates, which is what Creator native
                // Touch/Camera APIs use after the 1920 -> 1333 view scale.
                var t = cc.view.getFrameSize(), e = cc.view.getVisibleSize(), o = cc.find("Canvas/camera_ui"), n = o && o.getComponent(cc.Camera), a = null, s = null;
                var g = cc.game.groupList ? cc.game.groupList.indexOf("ui") : 2;
                g < 0 && (g = 2);
                var v = function (t) {
                    t.groupIndex = g;
                    for (var e = 0; e < t.childrenCount; e++) v(t.children[e]);
                };
                v(this.node);
                if (n && this.node.parent) {
                    a = this.node.parent.convertToNodeSpaceAR(n.getScreenToWorldPoint(cc.v2(0, 0)));
                    s = this.node.parent.convertToNodeSpaceAR(n.getScreenToWorldPoint(cc.v2(e.width, e.height)));
                }
                var r = a && s ? Math.abs(s.x - a.x) : e.width, c = a && s ? Math.abs(s.y - a.y) : e.height, l = a && s ? (a.x + s.x) / 2 : 0, h = a && s ? (a.y + s.y) / 2 : 0;
                var i = this.node.getComponent(cc.Widget);
                i && (i.enabled = !1);
                this.node.zIndex = cc.macro.MAX_ZINDEX;
                this.node.setPosition(l, h);
                this.node.setContentSize(r, c);
                var d = this.node.getChildByName("New Layout");
                if (d) {
                    var p = d.getComponent(cc.Widget);
                    p && (p.enabled = !1);
                    d.setPosition(0, 0);
                    d.setContentSize(r, c);
                    var u = d.getComponent(cc.Layout);
                    u && (u.enabled = !1);
                }
                var m = this.node.getChildByName("bg");
                if (m) {
                    var _ = m.getComponent(cc.Widget);
                    _ && (_.enabled = !1);
                    m.width = Math.min(1166, r - 48);
                    m.setPosition(0, -c / 2 + m.height / 2 + 20);
                }
                var y = cc.view.getViewportRect ? cc.view.getViewportRect() : null, f = cc.view.getScaleX ? cc.view.getScaleX() : 0, b = cc.view.getScaleY ? cc.view.getScaleY() : 0, w = cc.find("Canvas");
                var x = d && d.getBoundingBoxToWorld ? d.getBoundingBoxToWorld() : null, S = x && n ? n.getWorldToScreenPoint(cc.v2(x.xMin, x.yMin)) : null, I = x && n ? n.getWorldToScreenPoint(cc.v2(x.xMax, x.yMax)) : null;
                console.log("plotDialog viewport frame=" + t.width + "x" + t.height + " visible=" + Math.round(e.width) + "x" + Math.round(e.height) + " viewport=" + (y ? [Math.round(y.x), Math.round(y.y), Math.round(y.width), Math.round(y.height)].join(",") : "none") + " scale=" + f.toFixed(3) + "," + b.toFixed(3) + " canvas=" + (w ? [Math.round(w.x), Math.round(w.y), Math.round(w.width), Math.round(w.height)].join(",") : "none") + " camera=" + (n ? [n.depth, n.cullingMask, n.rect.x, n.rect.y, n.rect.width, n.rect.height].join(",") : "none") + " local=" + Math.round(r) + "x" + Math.round(c) + " center=" + Math.round(l) + "," + Math.round(h) + " layout=" + (d ? [Math.round(d.x), Math.round(d.y), Math.round(d.width), Math.round(d.height), d.groupIndex].join(",") : "none") + " screenBounds=" + (S && I ? [Math.round(S.x), Math.round(S.y), Math.round(I.x), Math.round(I.y)].join(",") : "none"));
            };
            e.prototype.initData = function (t) {
                if (t) {
                    this.curId = t[0];
                    this.endCallBack = t[1];
                }
                this.nextPlot();
            };
            e.prototype.start = function () {
                this.fitViewport();
                var t = this, e = cc.sequence(cc.scaleTo(.7, 1.1), cc.scaleTo(.7, 1)), o = cc.repeatForever(e);
                this.node_con.runAction(o);
                this.node.on(cc.Node.EventType.TOUCH_START, function () {
                    if (t.isTxtAct) {
                        t.lb_txt.node.stopAllActions();
                        t.lb_txt.string = t.curTxt;
                        t.isTxtAct = !1;
                    } else t.nextPlot();
                }, this);
            };
            e.prototype.nextPlot = function () {
                var t = this;
                if (this.curId && "" != this.curId) {
                    var e = s.default.talkConf[this.curId];
                    if (e) {
                        this.curTxt = e.txt;
                        this.maxCount = this.curTxt.length;
                        this.curCount = 0;
                        this.isTxtAct = !0;
                        var o = e.lead;
                        this.node_left.active = "1" == o;
                        this.node_right.active = "1" != o;
                        "1" == o ? this.loadRoleAni(this.img_left, e.img_role) : this.loadRoleAni(this.img_right, e.img_role);
                        this.lb_name.string = e.name + ":";
                        this.lb_txt.node.stopAllActions();
                        this.lb_txt.node.runAction(cc.repeat(cc.sequence(cc.callFunc(function () {
                            t.curCount++;
                            t.lb_txt.string = t.curTxt.substring(0, t.curCount);
                            t.curCount >= t.maxCount && (t.isTxtAct = !1);
                        }), cc.delayTime(.055)), this.maxCount));
                        this.curId = e.next;
                    } else this.jumpCall();
                } else this.jumpCall();
            };
            e.prototype.loadRoleAni = function (t, e) {
                var o = t.getComponent(cc.Sprite);
                c.default.setSpriteFrame(o, "ui/plot/role/" + e);
            };
            e.prototype.jumpCall = function () {
                this._onClose();
                this.endCallBack && this.endCallBack();
            };
            e.prototype.onDisable = function () {
                this.node_con.stopAllActions();
            };
            e.prototype.onClose = function () {
                for (var t = 0; t < this.hiddenHudNodes.length; t++) {
                    var e = this.hiddenHudNodes[t];
                    cc.isValid(e) && (e.active = !0);
                }
                this.hiddenHudNodes.length = 0;
            };
            a([d(cc.Label)], e.prototype, "lb_name", void 0);
            a([d(cc.Label)], e.prototype, "lb_txt", void 0);
            a([d(cc.Node)], e.prototype, "node_left", void 0);
            a([d(cc.Node)], e.prototype, "img_left", void 0);
            a([d(cc.Node)], e.prototype, "node_right", void 0);
            a([d(cc.Node)], e.prototype, "img_right", void 0);
            a([d(cc.Node)], e.prototype, "node_con", void 0);
            return a([h], e);
        }(r.default);
        o.default = p;
