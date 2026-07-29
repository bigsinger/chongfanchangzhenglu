'use strict';

/**
 * 模块职责：统一输出带级别和上下文的运行日志。
 * 关键约束：高频路径受开关控制，避免原生日志影响帧率和问题定位。
 */

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
    value: !0
});

var i = function () {
    function t() {}
    t.install = function () {
        if (this.installed || "undefined" == typeof console) return;
        this.installed = !0;
        this.original = {
            log: console.log && console.log.bind(console),
            info: console.info && console.info.bind(console),
            warn: console.warn && console.warn.bind(console),
            error: console.error && console.error.bind(console)
        };
        this.restorePreviousSession();
        this.breadcrumb("session-start", {});
        var t = "undefined" != typeof CC_DEBUG && CC_DEBUG || "undefined" != typeof CC_DEV && CC_DEV;
        if (!t) {
            console.log = function () {};
            console.info = function () {};
        }
        var e = this;
        console.warn = function () {
            var t = Array.prototype.slice.call(arguments);
            e.breadcrumb("warning", {
                message: String(t[0] || "")
            }, !0);
            t.unshift(e.prefix("WARN"));
            e.original.warn && e.original.warn.apply(null, t);
        };
        console.error = function () {
            var t = Array.prototype.slice.call(arguments);
            e.breadcrumb("error", {
                message: String(t[0] || "")
            }, !0);
            t.unshift(e.prefix("ERROR"));
            e.original.error && e.original.error.apply(null, t);
        };
        if ("undefined" != typeof window) {
            this.previousOnError = window.onerror;
            window.onerror = function (t, o, i, n) {
                e.breadcrumb("uncaught-js", {
                    message: String(t || ""),
                    source: String(o || ""),
                    line: Number(i) || 0,
                    column: Number(n) || 0
                }, !0);
                return e.previousOnError ? e.previousOnError.apply(this, arguments) : !1;
            };
        }
    };
    t.setContext = function (t) {
        if (!t) return;
        for (var e in t) null == t[e] || "" === t[e] ? delete this.context[e] : this.context[e] = t[e];
    };
    t.prefix = function (t) {
        var e = [], o = this.context;
        o.chapter && e.push("chapter=" + o.chapter);
        o.map && e.push("map=" + o.map);
        o.event && e.push("event=" + o.event);
        return "[LongMarch][" + t + "]" + (e.length ? "[" + e.join(" ") + "]" : "");
    };
    t.restorePreviousSession = function () {
        try {
            var t = cc.sys.localStorage.getItem(this.STORAGE_KEY);
            this.previousSession = t ? JSON.parse(t) : [];
        } catch (e) {
            this.previousSession = [];
        }
        this.breadcrumbs = [];
    };
    t.breadcrumb = function (t, e, o) {
        var i = {
            time: Date.now(),
            code: String(t || "event"),
            context: JSON.parse(JSON.stringify(this.context)),
            fields: e || {}
        };
        this.breadcrumbs.push(i);
        this.breadcrumbs.length > this.MAX_BREADCRUMBS && this.breadcrumbs.shift();
        if (o) try {
            cc.sys.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.breadcrumbs));
        } catch (n) { }
    };
    t.diagnostic = function () {
        return {
            installed: this.installed,
            context: JSON.parse(JSON.stringify(this.context)),
            breadcrumbs: this.breadcrumbs.slice(),
            previousSession: this.previousSession.slice()
        };
    };
    t.installed = !1;
    t.context = {};
    t.breadcrumbs = [];
    t.previousSession = [];
    t.MAX_BREADCRUMBS = 80;
    t.STORAGE_KEY = "longmarch_diagnostics_v1";
    return t;
}();

o.default = i;
