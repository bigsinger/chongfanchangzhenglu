'use strict';

/**
 * 模块职责：异步加载、显示并跟踪全局弹窗。
 * 关键约束：以请求序号淘汰迟到回调，避免关闭后又出现无法管理的弹窗。
 */

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var r = require("./ResourceManager"), assetCatalog = require("./AssetCatalog"), i = function () {
            function t() { }
            t.open = function (t, e, o) {
                var i = this;
                void 0 === e && (e = []);
                void 0 === o && (o = null);
                var n = "prefab/" + t, a = t, c = ++this._requestSeed, l = cc.director.getScene && cc.director.getScene();
                this.close(a);
                this._pendingMap[a] = c;
                r.default.load(n, cc.Prefab, function (s, r) {
                    // 预制体可能在第二次开关请求后才加载完，只有最新请求可以创建节点，
                    // 否则会留下无法跟踪的模态层覆盖玩法。
                    if (i._pendingMap[a] !== c) return;
                    delete i._pendingMap[a];
                    if (l && cc.director.getScene && l !== cc.director.getScene()) return;
                    if (s || !r) {
                        console.error("------------ 弹窗资源加载失败 " + n, s);
                        return;
                    }
                    i._addPopup(a, r, e, n, o);
                });
            };
            t._addPopup = function (t, e, o, i, n) {
                var a = cc.find("Canvas");
                if (!a || !cc.isValid(a)) {
                    console.error("------------ 弹窗打开失败，Canvas 已销毁 " + t);
                    return;
                }
                cc.log("open view " + i);
                var c = cc.instantiate(e);
                if (!c || !cc.isValid(c)) {
                    console.error("------------ 弹窗实例化失败 " + t);
                    return;
                }
                // 原生端在 Canvas 下实例化预制体时不可靠地保留根节点分组；落入默认组的
                // 弹窗会被移动世界镜头渲染并受前景遮挡，因此需显式恢复 UI 分组。
                var l = cc.game.groupList ? cc.game.groupList.indexOf("ui") : 2;
                l < 0 && (l = 2);
                var s = function (t) {
                    t.groupIndex = l;
                    for (var e = 0; e < t.childrenCount; e++) s(t.children[e]);
                };
                s(c);
                this._popupMap[t] = {
                    pop: c,
                    prefab: i
                };
                this._nodeKeyMap[c.name] = t;
                var r = c.getComponent(assetCatalog.default.componentName(c.name));
                r && r.initData(o);
                a.addChild(c);
                c.on(cc.Node.EventType.TOUCH_END, function () {
                    console.log("------ click popup " + t);
                }, this);
                n && n(c);
            };
            t.close = function (t) {
                var e = this._nodeKeyMap[t] || t;
                delete this._pendingMap[t];
                delete this._pendingMap[e];
                var o = this._popupMap[e];
                if (o) {
                    var i = o.pop;
                    o.prefab;
                    cc.log("close view " + e);
                    delete this._popupMap[e];
                    if (cc.isValid(i)) {
                        delete this._nodeKeyMap[i.name];
                        var n = i.getComponent(assetCatalog.default.componentName(i.name));
                        n && n.onClose && n.onClose();
                        i.destroy();
                    }
                    i = null;
                }
            };
            t.hasOpenPopup = function () {
                for (var t in this._pendingMap) if (this._pendingMap[t]) return !0;
                for (var t in this._popupMap) {
                    var e = this._popupMap[t];
                    if (e && e.pop && cc.isValid(e.pop) && e.pop.activeInHierarchy) return !0;
                }
                return !1;
            };
            t._popupMap = {};
            t._pendingMap = {};
            t._nodeKeyMap = {};
            t._requestSeed = 0;
            return t;
        }();
        o.default = i;
