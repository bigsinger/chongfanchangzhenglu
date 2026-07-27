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
                e.isTiming = !1;
                e.second = 0;
                e.minTime = 0;
                e.maxTime = 0;
                e.itemTs = null;
                e.resultFrame = "";
                e.resultDelay = 0;
                e.m_timingHud = null;
                e.m_timingGraphics = null;
                e.m_timingLabel = null;
                return e;
            }
            e.prototype.start = function () { };
            e.prototype.initData = function (t, e, o, i) {
                var n = t.split("|");
                this.itemTs = e;
                this.resultFrame = o;
                this.resultDelay = Number(i);
                console.log("------------------------------- this.resultDelay " + this.resultDelay);
                this.minTime = Number(n[0]);
                this.maxTime = Number(n[1]);
            };
            e.prototype.checkTiming = function () {
                var t = this;
                if (this.isTiming) {
                    this.isTiming = !1;
                    this.unscheduleAllCallbacks();
                    var e = this.second < this.minTime ? 1 : this.second > this.maxTime ? 3 : 2;
                    this.drawTimingHud(e);
                    this.scheduleOnce(function () {
                        t.destroyTimingHud();
                    }, 1.2);
                    return e;
                }
                this.itemTs.setBubble(!1, 0, !1);
                this.isTiming = !0;
                this.second = 0;
                this.ensureTimingHud();
                this.drawTimingHud(0);
                if (!cc.sys.localStorage.getItem("tutorial_cooking_v1")) {
                    cc.sys.localStorage.setItem("tutorial_cooking_v1", "1");
                    var e = this.itemTs.gameManager, o = e && e.hero_ts;
                    o && o.setRoleTips(!0, "label", {
                        txt: "烤制计时开始\n蓝色=生  绿色=熟  红色=焦\n指针进入绿色区间后再次点击"
                    }, {
                        num: 0,
                        times: 0,
                        interval: 0,
                        pos: "56|340"
                    });
                    e && e.delayHold(4, function () {
                        o && o.setRoleTips(!1);
                    });
                }
                this.scheduleOnce(function () {
                    t.itemTs.setBubble(!0, 0, !1);
                    t.itemTs.setPaoSprite(t.resultFrame + "_1");
                    t.schedule(t.timingCall, 1);
                }, this.resultDelay);
                return 0;
            };
            e.prototype.timingCall = function () {
                this.second++;
                console.log("------------- timing second " + this.second);
                this.second > this.maxTime ? this.itemTs.setPaoSprite(this.resultFrame + "_3") : this.second >= this.minTime && this.itemTs.setPaoSprite(this.resultFrame + "_2");
                this.drawTimingHud(0);
            };
            e.prototype.ensureTimingHud = function () {
                if (this.m_timingHud && cc.isValid(this.m_timingHud)) return;
                var t = this.itemTs && this.itemTs.gameManager, e = t && t.camera_ui && t.camera_ui.node;
                if (e) {
                    var o = new cc.Node("cookingTimingHud");
                    o.group = "ui";
                    o.y = cc.winSize.height / 2 - 105;
                    o.zIndex = 9999;
                    var i = o.addComponent(cc.Graphics);
                    i.lineCap = cc.Graphics.LineCap.ROUND;
                    var n = new cc.Node("timingText"), a = n.addComponent(cc.Label);
                    a.fontSize = 18;
                    a.lineHeight = 22;
                    a.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                    n.width = 190;
                    n.height = 48;
                    n.x = 105;
                    var s = n.addComponent(cc.LabelOutline);
                    s.color = cc.color(60, 20, 18);
                    s.width = 2;
                    o.addChild(n);
                    e.addChild(o);
                    this.m_timingHud = o;
                    this.m_timingGraphics = i;
                    this.m_timingLabel = a;
                }
            };
            e.prototype.drawTimingHud = function (t) {
                if (!this.m_timingGraphics) return;
                var e = this.m_timingGraphics, o = Math.max(this.maxTime + 3, 1), i = Math.min(1, this.minTime / o), n = Math.min(1, this.maxTime / o), a = -Math.PI / 2;
                e.clear();
                e.lineWidth = 10;
                e.strokeColor = cc.color(80, 160, 255);
                e.arc(0, 0, 32, a, a + 2 * Math.PI * i, !1);
                e.stroke();
                e.strokeColor = cc.color(72, 210, 118);
                e.arc(0, 0, 32, a + 2 * Math.PI * i, a + 2 * Math.PI * n, !1);
                e.stroke();
                e.strokeColor = cc.color(242, 83, 72);
                e.arc(0, 0, 32, a + 2 * Math.PI * n, a + 2 * Math.PI, !1);
                e.stroke();
                var s = a + 2 * Math.PI * Math.min(1, this.second / o);
                e.fillColor = cc.color(255, 255, 255);
                e.circle(32 * Math.cos(s), 32 * Math.sin(s), 5);
                e.fill();
                var r = this.second < this.minTime ? "生" : this.second > this.maxTime ? "焦" : "熟";
                1 === t ? r = "生：还需烤制" : 2 === t ? r = "熟：恰到好处" : 3 === t && (r = "焦：时间过长");
                this.m_timingLabel.string = r + "\n" + this.second + " 秒";
            };
            e.prototype.destroyTimingHud = function () {
                this.m_timingHud && cc.isValid(this.m_timingHud) && this.m_timingHud.destroy();
                this.m_timingHud = null;
                this.m_timingGraphics = null;
                this.m_timingLabel = null;
            };
            e.prototype.onDestroy = function () {
                this.unscheduleAllCallbacks();
                this.destroyTimingHud();
            };
            return a([r], e);
        }(cc.Component));
        o.default = c;
