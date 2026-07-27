'use strict';

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
    value: !0
});

var n = require("./AssetCatalog");

// Creator 2.4's cc.resources.release("directory") only tries to release an
// asset whose URL literally equals that directory; it does not undo loadDir.
// Track every concrete asset returned by loadDir and release it only after all
// registered scopes stop using it. AssetCatalog also keeps legacy configuration
// paths compatible with the readable source tree and the three chapter bundles.
var i = {
    _scopeSeed: 0,
    _scopes: {},
    _assetRefs: {},
    _bundleRefs: {},
    _bundleRequests: {},

    createScope: function (t) {
        this._scopeSeed++;
        return (t || "scope") + ":" + this._scopeSeed;
    },

    assetKey: function (t) {
        return t && (t._uuid || t.nativeUrl || t.url || t.name && t.name + ":" + t.__instanceId);
    },

    register: function (t, e, o, i, n, a) {
        if (!e || !e.length) return;
        var s = this._scopes[t];
        s || (s = this._scopes[t] = {
            directories: {},
            assets: {},
            bundles: {}
        });
        o && (s.directories[o] = !0);
        a && (s.directories[a] = !0);
        if (i && n && !s.bundles[i]) {
            s.bundles[i] = n;
            var r = this._bundleRefs[i];
            r || (r = this._bundleRefs[i] = {
                bundle: n,
                count: 0
            });
            r.count++;
        }
        for (var c = 0; c < e.length; c++) {
            var l = e[c], h = this.assetKey(l);
            if (h && !s.assets[h]) {
                s.assets[h] = l;
                var d = this._assetRefs[h];
                d || (d = this._assetRefs[h] = {
                    asset: l,
                    count: 0
                });
                d.count++;
            }
        }
    },

    resolve: function (t) {
        return n.default.resolve(t);
    },

    withBundle: function (t, e) {
        if (!t.bundle) {
            e(null, cc.resources);
            return;
        }
        var o = cc.assetManager.getBundle(t.bundle);
        if (o) {
            e(null, o);
            return;
        }
        var i = this._bundleRequests[t.bundle];
        if (i) {
            i.push(e);
            return;
        }
        var n = this;
        this._bundleRequests[t.bundle] = [e];
        cc.assetManager.loadBundle(t.bundle, function (e, o) {
            var i = n._bundleRequests[t.bundle] || [];
            delete n._bundleRequests[t.bundle];
            for (var a = 0; a < i.length; a++) i[a](e, o);
        });
    },

    load: function (t, e, o) {
        var i = this, n = this.resolve(t);
        this.withBundle(n, function (t, a) {
            if (t) {
                o && o(t, null);
                return;
            }
            a.load(n.path, e, function (t, e) {
                o && o(t, e);
            });
        });
    },

    preloadDir: function (t, e, o) {
        var i = this, n = this.resolve(t);
        if (!o) {
            o = e;
            e = null;
        }
        this.withBundle(n, function (t, a) {
            if (t) {
                o && o(t);
                return;
            }
            a.preloadDir(n.path, e || function () { }, o || function () { });
        });
    },

    loadDir: function (t, e, o, i) {
        var n = this, a = i || t, s = this.resolve(t);
        this.withBundle(s, function (i, r) {
            if (i) {
                o && o(i, null);
                return;
            }
            r.loadDir(s.path, e || function () { }, function (e, i) {
                e || n.register(a, i, t, s.bundle, r, s.logical);
                o && o(e, i);
            });
        });
    },

    loadDirTyped: function (t, e, o, i, n) {
        var a = this, s = n || t, r = this.resolve(t);
        this.withBundle(r, function (n, c) {
            if (n) {
                i && i(n, null);
                return;
            }
            c.loadDir(r.path, e, o || function () { }, function (e, o) {
                e || a.register(s, o, t, r.bundle, c, r.logical);
                i && i(e, o);
            });
        });
    },

    registerAsset: function (t, e, o) {
        this.register(t, e ? [e] : [], o || "");
    },

    releaseAsset: function (t) {
        if (!t || !cc.isValid(t)) return;
        if (cc.assetManager && "function" == typeof cc.assetManager.releaseAsset) cc.assetManager.releaseAsset(t); else cc.resources.release(t);
    },

    releaseScope: function (t) {
        var e = this._scopes[t];
        if (!e) return 0;
        var o = 0;
        for (var i in e.assets) {
            var n = this._assetRefs[i];
            if (n) {
                n.count--;
                if (n.count <= 0) {
                    this.releaseAsset(n.asset);
                    delete this._assetRefs[i];
                    o++;
                }
            }
        }
        for (var a in e.bundles) {
            var s = this._bundleRefs[a];
            if (s) {
                s.count--;
                if (s.count <= 0) {
                    s.bundle.releaseAll();
                    cc.assetManager.removeBundle(s.bundle);
                    delete this._bundleRefs[a];
                }
            }
        }
        delete this._scopes[t];
        return o;
    },

    releaseDirectory: function (t) {
        var e = [], o = 0;
        for (var i in this._scopes) this._scopes[i].directories[t] && e.push(i);
        for (var n = 0; n < e.length; n++) o += this.releaseScope(e[n]);
        console.log("------------ 精确释放目录 " + t + "，资源数 " + o);
        return o;
    },

    releasePrefix: function (t) {
        var e = [], o = 0;
        for (var i in this._scopes) {
            var n = this._scopes[i].directories;
            for (var a in n) if (0 === a.indexOf(t)) {
                e.push(i);
                break;
            }
        }
        for (var s = 0; s < e.length; s++) o += this.releaseScope(e[s]);
        return o;
    },

    diagnostics: function () {
        return {
            scopes: Object.keys(this._scopes).length,
            retainedAssets: Object.keys(this._assetRefs).length,
            retainedBundles: Object.keys(this._bundleRefs).length
        };
    }
};

o.default = i;
