'use strict';

/**
 * 模块职责：以版本化完整快照保存进度并恢复损坏存档。
 * 关键约束：当前代与上一有效代双份保留，保证进程中断后仍能恢复一致状态。
 */

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
    value: !0
});

// 原生 LocalStorage 由 SQLite 支撑，替换单值具有原子性，连续写多个旧键却没有。
// 因此将版本化完整快照写入一个键，保留上一有效代，同时镜像旧键以兼容检查点和工具。
var i = {
    SCHEMA_VERSION: 2,
    CURRENT_KEY: "longmarch_save_v2_current",
    PREVIOUS_KEY: "longmarch_save_v2_previous",
    PUBLISHED_MAP_COUNTS: {
        1: 2,
        2: 2,
        3: 3
    },
    MAX_UNLOCKED_CHAPTER: 2,
    _commitTimer: null,
    _lastReason: "",
    _lifecycleInstalled: !1,
    _lifecycleState: null,
    _onAppHide: null,

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

    writeIfChanged: function (t, e) {
        var o = String(e);
        cc.sys.localStorage.getItem(t) !== o && cc.sys.localStorage.setItem(t, e);
    },

    removeIfPresent: function (t) {
        null != cc.sys.localStorage.getItem(t) && cc.sys.localStorage.removeItem(t);
    },

    isPlainObject: function (t) {
        return !!t && "object" == typeof t && !Array.isArray(t);
    },

    isPublishedLocation: function (t, e) {
        t = Number(t);
        e = Number(e);
        return Number.isFinite(t) && Number.isFinite(e) && Math.floor(t) === t && Math.floor(e) === e && !!this.PUBLISHED_MAP_COUNTS[t] && e >= 1 && e <= this.PUBLISHED_MAP_COUNTS[t];
    },

    normalizePlayData: function (t, e) {
        var o = this.isPlainObject(t) ? t : this.clone(e, {});
        this.isPlainObject(o) || (o = {});
        this.isPlainObject(o.itemData) || (o.itemData = {});
        Array.isArray(o.storyData) || (o.storyData = []);
        Array.isArray(o.gametips) || (o.gametips = []);
        Number.isFinite(Number(o.chapterCur)) && Number(o.chapterCur) >= 1 ? o.chapterCur = Math.min(3, Math.floor(Number(o.chapterCur))) : o.chapterCur = 1;
        Number.isFinite(Number(o.unlockchapters)) && Number(o.unlockchapters) >= 0 ? o.unlockchapters = Math.min(this.MAX_UNLOCKED_CHAPTER, Math.floor(Number(o.unlockchapters))) : o.unlockchapters = 0;
        return o;
    },

    checksum: function (t) {
        // FNV-1a 32 位在当前 JavaScript 运行时中体积小且结果稳定，仅用于发现截断或
        // 跨代快照，不作为密码学签名。
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
        e = this.normalizePlayData(e, t);
        var o = this.readNumber("chapter", Number(e.chapter) || 1, 1), i = this.readNumber("mapIndex", Number(e.mapIndex) || 1, 1);
        this.isPublishedLocation(o, i) || (o = 1, i = 1);
        e.chapter = o;
        e.mapIndex = i;
        var c = Math.min(this.MAX_UNLOCKED_CHAPTER, this.readNumber("unlockchapters", Number(e.unlockchapters) || 0, 0));
        e.unlockchapters = c;
        var n = this.parseJSON(cc.sys.localStorage.getItem("tempData"), {}), a = this.parseJSON(cc.sys.localStorage.getItem("cross"), null), s = this.parseJSON(cc.sys.localStorage.getItem("heroItem"), null), r = this.parseJSON(cc.sys.localStorage.getItem("heroFollow"), null);
        this.isPlainObject(n) || (n = {});
        null == a || Array.isArray(a) || (a = null);
        null == s || this.isPlainObject(s) || (s = null);
        null == r || this.isPlainObject(r) || (r = null);
        return {
            playData: e,
            tempData: n,
            cross: a,
            heroItem: s,
            heroFollow: r,
            heroSpine: cc.sys.localStorage.getItem("heroSpine") || null,
            chapter: o,
            mapIndex: i,
            unlockchapters: c
        };
    },

    isStateValid: function (t) {
        if (!this.isPlainObject(t) || !this.isPlainObject(t.playData) || !this.isPlainObject(t.tempData)) return !1;
        if (!this.isPlainObject(t.playData.itemData) || !Array.isArray(t.playData.storyData) || !Array.isArray(t.playData.gametips)) return !1;
        if (null != t.cross && !Array.isArray(t.cross) || null != t.heroItem && !this.isPlainObject(t.heroItem) || null != t.heroFollow && !this.isPlainObject(t.heroFollow)) return !1;
        if (null != t.heroSpine && "string" != typeof t.heroSpine || !this.isPublishedLocation(t.chapter, t.mapIndex)) return !1;
        if (Number(t.playData.chapter) !== Number(t.chapter) || Number(t.playData.mapIndex) !== Number(t.mapIndex) || Number(t.playData.unlockchapters) !== Number(t.unlockchapters)) return !1;
        return Number.isFinite(Number(t.unlockchapters)) && Number(t.unlockchapters) >= 0 && Number(t.unlockchapters) <= this.MAX_UNLOCKED_CHAPTER;
    },

    isValid: function (t) {
        if (!t || Number(t.schemaVersion) !== this.SCHEMA_VERSION || !this.isStateValid(t.state)) return !1;
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
        if (!this.isStateValid(t)) return;
        var e = t.playData;
        this.writeIfChanged("longmarch", JSON.stringify(e));
        this.writeIfChanged("tempData", JSON.stringify(t.tempData && "object" == typeof t.tempData ? t.tempData : {}));
        this.writeIfChanged("cross", JSON.stringify(null == t.cross ? null : t.cross));
        this.writeIfChanged("heroItem", JSON.stringify(null == t.heroItem ? null : t.heroItem));
        this.writeIfChanged("heroFollow", JSON.stringify(null == t.heroFollow ? null : t.heroFollow));
        null == t.heroSpine || "" === t.heroSpine ? this.removeIfPresent("heroSpine") : this.writeIfChanged("heroSpine", t.heroSpine);
        this.writeIfChanged("chapter", Number(t.chapter) || 1);
        this.writeIfChanged("mapIndex", Number(t.mapIndex) || 1);
        this.writeIfChanged("unlockchapters", Math.max(0, Number(t.unlockchapters) || 0));
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
            // 用上一有效代修复损坏或缺失的当前槽，并保持其修订号不变。
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

    installLifecycle: function (t) {
        this._lifecycleState = t || this._lifecycleState;
        if (this._lifecycleInstalled || !cc.game || !cc.game.on) return;
        var e = this;
        this._onAppHide = function () {
            var t = e._lifecycleState && e._lifecycleState.playData || {};
            e.flush("app-hide", t);
        };
        cc.game.on(cc.game.EVENT_HIDE, this._onAppHide, this);
        this._lifecycleInstalled = !0;
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
