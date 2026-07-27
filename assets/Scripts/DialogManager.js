'use strict';

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
                    // A prefab can finish loading after a second open/close
                    // request. Only the newest request may create a node;
                    // otherwise an untracked modal remains over gameplay.
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
                // Prefab-root group indices are not reliably preserved when
                // Creator 2.4 instantiates a prefab under Canvas on native.
                // A default-group popup is then rendered by the moving world
                // camera and can be covered/cropped by foreground scenery.
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
