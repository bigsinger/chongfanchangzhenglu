'use strict';

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
    value: !0
});

// Creator 2.4's cc.resources.release("directory") only tries to release an
// asset whose URL literally equals that directory; it does not undo loadDir.
// Track every concrete asset returned by loadDir and release it only after all
// registered scopes stop using it.
var i = {
    _scopeSeed: 0,
    _scopes: {},
    _assetRefs: {},

    createScope: function (t) {
        this._scopeSeed++;
        return (t || "scope") + ":" + this._scopeSeed;
    },

    assetKey: function (t) {
        return t && (t._uuid || t.nativeUrl || t.url || t.name && t.name + ":" + t.__instanceId);
    },

    register: function (t, e, o) {
        if (!e || !e.length) return;
        var i = this._scopes[t];
        i || (i = this._scopes[t] = {
            directories: {},
            assets: {}
        });
        o && (i.directories[o] = !0);
        for (var n = 0; n < e.length; n++) {
            var a = e[n], s = this.assetKey(a);
            if (s && !i.assets[s]) {
                i.assets[s] = a;
                var r = this._assetRefs[s];
                r || (r = this._assetRefs[s] = {
                    asset: a,
                    count: 0
                });
                r.count++;
            }
        }
    },

    loadDir: function (t, e, o, i) {
        var n = this, a = i || t;
        cc.resources.loadDir(t, e || function () { }, function (e, i) {
            e || n.register(a, i, t);
            o && o(e, i);
        });
    },

    loadDirTyped: function (t, e, o, i, n) {
        var a = this, s = n || t;
        cc.resources.loadDir(t, e, o || function () { }, function (e, o) {
            e || a.register(s, o, t);
            i && i(e, o);
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
            retainedAssets: Object.keys(this._assetRefs).length
        };
    }
};

o.default = i;
