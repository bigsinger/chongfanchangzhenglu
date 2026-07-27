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
    _scopeEpochs: {},
    _releasedEpochs: {},
    _scopePending: {},
    _bundleInflight: {},
    _deferredReleases: {},

    createScope: function (t) {
        this._scopeSeed++;
        var e = (t || "scope") + ":" + this._scopeSeed;
        this.beginScope(e);
        return e;
    },

    beginScope: function (t, e, o) {
        var i = this._scopes[t];
        if (!i) {
            var n = (this._scopeEpochs[t] || 0) + 1;
            this._scopeEpochs[t] = n;
            delete this._releasedEpochs[t];
            i = this._scopes[t] = {
                epoch: n,
                directories: {},
                assets: {},
                bundles: {}
            };
        }
        e && (i.directories[e] = !0);
        o && (i.directories[o] = !0);
        return i.epoch;
    },

    trackScopeRequest: function (t, e, o, i) {
        var n = this.beginScope(t, e, o), a = t + "@" + n;
        this._scopePending[a] = (this._scopePending[a] || 0) + 1;
        i && (this._bundleInflight[i] = (this._bundleInflight[i] || 0) + 1);
        return n;
    },

    finishScopeRequest: function (t, e, o) {
        var i = t + "@" + e, n = (this._scopePending[i] || 1) - 1;
        n > 0 ? this._scopePending[i] = n : delete this._scopePending[i];
        if (o) {
            var a = (this._bundleInflight[o] || 1) - 1;
            a > 0 ? this._bundleInflight[o] = a : delete this._bundleInflight[o];
        }
        if (!this._scopePending[i] && this._releasedEpochs[t] === e) {
            delete this._releasedEpochs[t];
            delete this._scopeEpochs[t];
        }
    },

    assetKey: function (t) {
        return t && (t._uuid || t.nativeUrl || t.url || t.name && t.name + ":" + t.__instanceId);
    },

    releaseUnclaimed: function (t, e, o) {
        for (var i = 0; i < (t || []).length; i++) {
            var n = t[i], a = this.assetKey(n);
            a && !this._assetRefs[a] && this.releaseAsset(n);
        }
        e && o && !this._bundleRefs[e] && (this._bundleInflight[e] || 0) <= 1 && (o.releaseAll(), cc.assetManager.removeBundle(o));
    },

    register: function (t, e, o, i, n, a, s) {
        if (!e || !e.length) return;
        null == s && (s = this.beginScope(t, o, a));
        var r = this._scopes[t];
        // A component/scene may be destroyed while its loadDir request is in
        // flight. Never recreate the released scope from a late callback.
        if (!r || s && r.epoch !== s || this._releasedEpochs[t] === s) {
            this.releaseUnclaimed(e, i, n);
            return;
        }
        o && (r.directories[o] = !0);
        a && (r.directories[a] = !0);
        if (i && n && !r.bundles[i]) {
            r.bundles[i] = n;
            var c = this._bundleRefs[i];
            c || (c = this._bundleRefs[i] = {
                bundle: n,
                count: 0
            });
            c.count++;
        }
        for (var l = 0; l < e.length; l++) {
            var h = e[l], d = this.assetKey(h);
            if (d && !r.assets[d]) {
                r.assets[d] = h;
                var p = this._assetRefs[d];
                p || (p = this._assetRefs[d] = {
                    asset: h,
                    count: 0
                });
                p.count++;
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
        var n = this, a = i || t, s = this.resolve(t), r = this.trackScopeRequest(a, t, s.logical, s.bundle);
        this.withBundle(s, function (i, c) {
            if (i) {
                n.finishScopeRequest(a, r, s.bundle);
                o && o(i, null);
                return;
            }
            c.loadDir(s.path, e || function () { }, function (e, i) {
                e || n.register(a, i, t, s.bundle, c, s.logical, r);
                n.finishScopeRequest(a, r, s.bundle);
                o && o(e, i);
            });
        });
    },

    loadDirTyped: function (t, e, o, i, n) {
        var a = this, s = n || t, r = this.resolve(t), c = this.trackScopeRequest(s, t, r.logical, r.bundle);
        this.withBundle(r, function (n, l) {
            if (n) {
                a.finishScopeRequest(s, c, r.bundle);
                i && i(n, null);
                return;
            }
            l.loadDir(r.path, e, o || function () { }, function (e, o) {
                e || a.register(s, o, t, r.bundle, l, r.logical, c);
                a.finishScopeRequest(s, c, r.bundle);
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
        if (this._deferredReleases[t]) {
            clearTimeout(this._deferredReleases[t]);
            delete this._deferredReleases[t];
        }
        var e = this._scopes[t];
        if (!e) return 0;
        this._releasedEpochs[t] = e.epoch;
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
        if (!this._scopePending[t + "@" + e.epoch]) {
            delete this._releasedEpochs[t];
            delete this._scopeEpochs[t];
        }
        return o;
    },

    releaseScopeDeferred: function (t, e) {
        if (!t || !this._scopes[t] || this._deferredReleases[t]) return;
        var o = this;
        this._deferredReleases[t] = setTimeout(function () {
            delete o._deferredReleases[t];
            o.releaseScope(t);
        }, null == e ? 3e3 : e);
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
