'use strict';

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = function () {
            function t() { }
            t.open = function (t, e, o) {
                var i = this;
                void 0 === e && (e = []);
                void 0 === o && (o = null);
                var n = "prefab/" + t, a = t;
                this._popupMap[a] && this.close(a);
                cc.resources.load(n, cc.Prefab, function (t, a) {
                    t ? console.log("--- err", t) : i._addPopup(a, e, n, o);
                });
            };
            t._addPopup = function (t, e, o, i) {
                cc.log("open view " + o);
                var n = cc.instantiate(t), a = n.name;
                // Prefab-root group indices are not reliably preserved when
                // Creator 2.4 instantiates a prefab under Canvas on native.
                // A default-group popup is then rendered by the moving world
                // camera and can be covered/cropped by foreground scenery.
                var c = cc.game.groupList ? cc.game.groupList.indexOf("ui") : 2;
                c < 0 && (c = 2);
                var l = function (t) {
                    t.groupIndex = c;
                    for (var e = 0; e < t.childrenCount; e++) l(t.children[e]);
                };
                l(n);
                this._popupMap[a] = {
                    pop: n,
                    prefab: o
                };
                var s = n.getComponent(a);
                s && s.initData(e);
                cc.find("Canvas").addChild(n);
                n.on(cc.Node.EventType.TOUCH_END, function () {
                    console.log("------ click popup " + a);
                }, this);
                i && i(n);
            };
            t.close = function (t) {
                var e = this._popupMap[t];
                if (e) {
                    var o = e.pop;
                    e.prefab;
                    cc.log("close view " + t);
                    delete this._popupMap[t];
                    if (cc.isValid(o)) {
                        var i = o.getComponent(t);
                        i.onClose && i.onClose();
                        o.destroy();
                    }
                    o = null;
                }
            };
            t.hasOpenPopup = function () {
                for (var t in this._popupMap) {
                    var e = this._popupMap[t];
                    if (e && e.pop && cc.isValid(e.pop) && e.pop.activeInHierarchy) return !0;
                }
                return !1;
            };
            t._popupMap = {};
            return t;
        }();
        o.default = i;
