'use strict';

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
    value: !0
});

// LocalStorage is backed by SQLite on native builds, so replacing one value is
// atomic while a sequence of legacy keys is not. Keep a complete versioned
// snapshot in one key, retain the previous valid generation, and continue
// mirroring the original keys so old checkpoints and tools remain compatible.
var i = {
    SCHEMA_VERSION: 2,
    CURRENT_KEY: "longmarch_save_v2_current",
    PREVIOUS_KEY: "longmarch_save_v2_previous",
    _commitTimer: null,
    _lastReason: "",

    parseJSON: function (t, e) {
        if (null == t || "" === t) return e;
        try {
            return JSON.parse(t);
        } catch (o) {
            return e;
        }
    },

    clone: function (t, e) {
        if (null == t) return e;
        try {
            return JSON.parse(JSON.stringify(t));
        } catch (o) {
            return e;
        }
    },

    checksum: function (t) {
        // FNV-1a 32-bit is intentionally small and deterministic on the old
        // JavaScript runtime. It detects truncated/cross-generation snapshots;
        // it is not intended as a cryptographic signature.
        for (var e = 2166136261, o = 0; o < t.length; o++) {
            e ^= t.charCodeAt(o);
            e = Math.imul(e, 16777619);
        }
        return ("00000000" + (e >>> 0).toString(16)).slice(-8);
    },

    readNumber: function (t, e, o) {
        var i = Number(cc.sys.localStorage.getItem(t));
        return Number.isFinite(i) && i >= o ? Math.floor(i) : e;
    },

    readState: function (t) {
        var e = this.parseJSON(cc.sys.localStorage.getItem("longmarch"), null);
        e && "object" == typeof e && !Array.isArray(e) || (e = this.clone(t, {}));
        return {
            playData: e,
            tempData: this.parseJSON(cc.sys.localStorage.getItem("tempData"), {}),
            cross: this.parseJSON(cc.sys.localStorage.getItem("cross"), null),
            heroItem: this.parseJSON(cc.sys.localStorage.getItem("heroItem"), null),
            heroFollow: this.parseJSON(cc.sys.localStorage.getItem("heroFollow"), null),
            heroSpine: cc.sys.localStorage.getItem("heroSpine") || null,
            chapter: this.readNumber("chapter", Number(e.chapter) || 1, 1),
            mapIndex: this.readNumber("mapIndex", Number(e.mapIndex) || 1, 1),
            unlockchapters: this.readNumber("unlockchapters", Number(e.unlockchapters) || 0, 0)
        };
    },

    isValid: function (t) {
        if (!t || Number(t.schemaVersion) !== this.SCHEMA_VERSION || !t.state || "object" != typeof t.state) return !1;
        return t.checksum === this.checksum(JSON.stringify(t.state)) && Number.isFinite(Number(t.revision)) && Number(t.revision) >= 1;
    },

    readSnapshot: function (t) {
        var e = this.parseJSON(cc.sys.localStorage.getItem(t), null);
        return this.isValid(e) ? e : null;
    },

    bestSnapshot: function () {
        var t = this.readSnapshot(this.CURRENT_KEY), e = this.readSnapshot(this.PREVIOUS_KEY);
        return t && e ? Number(t.revision) >= Number(e.revision) ? t : e : t || e;
    },

    writeLegacy: function (t) {
        if (!t || "object" != typeof t) return;
        var e = t.playData && "object" == typeof t.playData ? t.playData : {};
        cc.sys.localStorage.setItem("longmarch", JSON.stringify(e));
        cc.sys.localStorage.setItem("tempData", JSON.stringify(t.tempData && "object" == typeof t.tempData ? t.tempData : {}));
        cc.sys.localStorage.setItem("cross", JSON.stringify(null == t.cross ? null : t.cross));
        cc.sys.localStorage.setItem("heroItem", JSON.stringify(null == t.heroItem ? null : t.heroItem));
        cc.sys.localStorage.setItem("heroFollow", JSON.stringify(null == t.heroFollow ? null : t.heroFollow));
        null == t.heroSpine || "" === t.heroSpine ? cc.sys.localStorage.removeItem("heroSpine") : cc.sys.localStorage.setItem("heroSpine", t.heroSpine);
        cc.sys.localStorage.setItem("chapter", Number(t.chapter) || 1);
        cc.sys.localStorage.setItem("mapIndex", Number(t.mapIndex) || 1);
        cc.sys.localStorage.setItem("unlockchapters", Math.max(0, Number(t.unlockchapters) || 0));
    },

    restoreOrMigrate: function (t, e) {
        this.flush();
        if (e) {
            var o = this.readState(t);
            this.writeLegacy(o);
            this.commit("checkpoint-legacy-import", t);
            return this.clone(o.playData, this.clone(t, {}));
        }
        var i = this.bestSnapshot();
        if (i) {
            this.writeLegacy(i.state);
            // Repair a damaged/missing current slot from the last valid
            // generation without changing its revision.
            cc.sys.localStorage.setItem(this.CURRENT_KEY, JSON.stringify(i));
            return this.clone(i.state.playData, this.clone(t, {}));
        }
        var n = this.readState(t);
        this.writeLegacy(n);
        this.commit("migrate-v1", t);
        return this.clone(n.playData, this.clone(t, {}));
    },

    commit: function (t, e) {
        if (this._commitTimer) {
            clearTimeout(this._commitTimer);
            this._commitTimer = null;
        }
        var o = this.readState(e || {}), i = this.bestSnapshot(), n = i ? Number(i.revision) + 1 : 1, a = {
            schemaVersion: this.SCHEMA_VERSION,
            revision: n,
            savedAt: Date.now(),
            reason: t || this._lastReason || "state-change",
            state: o
        };
        a.checksum = this.checksum(JSON.stringify(a.state));
        i && cc.sys.localStorage.setItem(this.PREVIOUS_KEY, JSON.stringify(i));
        cc.sys.localStorage.setItem(this.CURRENT_KEY, JSON.stringify(a));
        this._lastReason = "";
        return a;
    },

    scheduleCommit: function (t, e) {
        var o = this;
        this._lastReason = t || this._lastReason || "state-change";
        this._commitTimer || (this._commitTimer = setTimeout(function () {
            o._commitTimer = null;
            o.commit(o._lastReason, e);
        }, 0));
    },

    flush: function (t, e) {
        if (!this._commitTimer) return null;
        clearTimeout(this._commitTimer);
        this._commitTimer = null;
        return this.commit(t || this._lastReason, e);
    },

    clearSnapshots: function () {
        this._commitTimer && clearTimeout(this._commitTimer);
        this._commitTimer = null;
        this._lastReason = "";
        cc.sys.localStorage.removeItem(this.CURRENT_KEY);
        cc.sys.localStorage.removeItem(this.PREVIOUS_KEY);
    },

    getDiagnostics: function () {
        var t = this.bestSnapshot();
        return t ? {
            schemaVersion: t.schemaVersion,
            revision: t.revision,
            savedAt: t.savedAt,
            reason: t.reason
        } : null;
    }
};

o.default = i;
