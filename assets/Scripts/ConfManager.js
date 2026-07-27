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
        var a = require("./GameData"), s = require("./SaveManager"), c = require("./ConfigRepair"), r = function (t) {
            n(e, t);
            function e() {
                return null !== t && t.apply(this, arguments) || this;
            }
            e.readJSON = function (t, e) {
                var o = cc.sys.localStorage.getItem(t);
                if (null == o || "" == o) return e;
                try {
                    var i = JSON.parse(o);
                    return null == i ? e : i;
                } catch (n) {
                    // A truncated/legacy save must not make the whole game
                    // unbootable. Remove only the damaged key and preserve all
                    // other chapter progress.
                    console.warn("------------ 存档损坏，已忽略 " + t, n);
                    cc.sys.localStorage.removeItem(t);
                    return e;
                }
            };
            e.loadMapConf = function (t) {
                var n = 0;
                for (var e = 0, o = t; e < o.length; e++) {
                    var i = o[e];
                    this.confData[i.name] = JSON.parse(i.content);
                    n += c.default.repairScene(i.name, this.confData[i.name]);
                }
                n && console.warn("------------ 已修复失效事件跳转 " + n + " 处");
                console.log("------------ loadMapConf ", this.confData);
            };
            e.setPointConf = function (t, e) {
                console.log("---------- 保存关卡数据 " + t);
                console.log("---------- 保存关卡数据 ", e);
                this.confData[t] = e;
                cc.sys.localStorage.setItem(t, JSON.stringify(e));
            };
            e.getPointConf = function (t) {
                console.log("---------- 读取关卡数据 " + t);
                if (a.default.isTest) return this.confData[t];
                var e = cc.sys.localStorage.getItem(t);
                console.log("---------- 读取关卡数据 ", e);
                return this.readJSON(t, this.confData[t] || null);
            };
            e.loadTempData = function () {
                var t = cc.sys.localStorage.getItem("tempData");
                console.log("-------- loadTempData ", t);
                this.tempData = this.readJSON("tempData", {});
                "object" != typeof this.tempData && (this.tempData = {});
            };
            e.saveTempData = function (t, e, o, i) {
                void 0 === o && (o = null);
                void 0 === i && (i = "walk");
                this.tempData[t] || (this.tempData[t] = {});
                this.tempData[t].itemArr = e;
                null != o && (this.tempData[t].heroPos = o);
                this.tempData[t].gomod = i;
                cc.sys.localStorage.setItem("tempData", JSON.stringify(this.tempData));
                s.default.scheduleCommit("temp-data", a.default.playData);
            };
            e.getTempData = function (t) {
                var e = this.readJSON("tempData", {});
                if (e && "object" == typeof e && e[t]) {
                    this.tempData[t] = e[t];
                    return this.tempData[t];
                }
                return "";
            };
            e.saveCrossData = function (t) {
                cc.sys.localStorage.setItem("cross", JSON.stringify(t));
                s.default.scheduleCommit("cross-data", a.default.playData);
            };
            e.getCorssData = function () {
                return this.readJSON("cross", null);
            };
            e.cleanCorssData = function () {
                cc.sys.localStorage.removeItem("cross");
                s.default.scheduleCommit("clear-cross", a.default.playData);
            };
            e.saveHeroItem = function (t) {
                cc.sys.localStorage.setItem("heroItem", JSON.stringify(t));
                s.default.scheduleCommit("hero-item", a.default.playData);
            };
            e.getHeroItem = function () {
                return this.readJSON("heroItem", null);
            };
            e.cleanHeroItem = function () {
                cc.sys.localStorage.removeItem("heroItem");
                s.default.scheduleCommit("clear-hero-item", a.default.playData);
            };
            e.saveHeroFollow = function (t) {
                cc.sys.localStorage.setItem("heroFollow", JSON.stringify(t));
                s.default.scheduleCommit("hero-follow", a.default.playData);
            };
            e.getHeroFollow = function () {
                return this.readJSON("heroFollow", null);
            };
            e.cleanHeroFollow = function () {
                cc.sys.localStorage.removeItem("heroFollow");
                s.default.scheduleCommit("clear-hero-follow", a.default.playData);
            };
            e.saveHeroSpine = function (t) {
                cc.sys.localStorage.setItem("heroSpine", t);
                s.default.scheduleCommit("hero-spine", a.default.playData);
            };
            e.getHeroSpine = function () {
                return cc.sys.localStorage.getItem("heroSpine");
            };
            e.cleanHeroSpine = function () {
                cc.sys.localStorage.removeItem("heroSpine");
                s.default.scheduleCommit("clear-hero-spine", a.default.playData);
            };
            e.clearRunState = function () {
                cc.sys.localStorage.setItem("tempData", "");
                this.tempData = {};
                cc.sys.localStorage.removeItem("cross");
                this.cleanHeroItem();
                this.cleanHeroFollow();
                this.cleanHeroSpine();
                s.default.scheduleCommit("clear-run-state", a.default.playData);
            };
            e.cleanAllSave = function () {
                this.clearRunState();
                // Only the explicit "reset all progress" action should erase
                // permanent collections, story records and unlocks.
                cc.sys.localStorage.removeItem("longmarch");
                s.default.clearSnapshots();
            };
            e.getLoadDragonBones = function (t) {
                for (var e = "scenes_d" + t + "_", o = 1, i = {}, n = []; ;) {
                    var a = this.confData[e + o];
                    if (!a) break;
                    for (var s = 0, r = a.confArr; s < r.length; s++) {
                        var c = r[s].ani;
                        null != c && "" != c && (i[c] = 1);
                    }
                    o++;
                }
                for (var l in i) n.push(l);
                console.log("--------- getLoadDragonBones ", n);
                return n;
            };
            e.confData = {};
            e.tempData = {};
            return e;
        }(cc.Component);
        o.default = r;
