'use strict';

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
        var t = "undefined" != typeof CC_DEBUG && CC_DEBUG || "undefined" != typeof CC_DEV && CC_DEV;
        if (!t) {
            console.log = function () {};
            console.info = function () {};
        }
        var e = this;
        console.warn = function () {
            var t = Array.prototype.slice.call(arguments);
            t.unshift(e.prefix("WARN"));
            e.original.warn && e.original.warn.apply(null, t);
        };
        console.error = function () {
            var t = Array.prototype.slice.call(arguments);
            t.unshift(e.prefix("ERROR"));
            e.original.error && e.original.error.apply(null, t);
        };
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
    t.diagnostic = function () {
        return {
            installed: this.installed,
            context: JSON.parse(JSON.stringify(this.context))
        };
    };
    t.installed = !1;
    t.context = {};
    return t;
}();

o.default = i;
