'use strict';

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
    value: !0
});

// The recovered authoring table contains a small number of stale event
// indices left by deleted/reordered editor rows. Keep corrections in one
// declarative table so runtime and the offline graph validator use exactly the
// same migration and the source data remains traceable to the APK.
var i = {
    scenes_d1_1: {
        "1|25": "11|4",
        "10|28": "46|1",
        "15|6": "10|7",
        "31|3": "21|8"
    },
    scenes_d1_3: {
        "4|24": "4|26"
    },
    scenes_d2_3: {
        "15|1": "15|2"
    },
    scenes_d3_4: {
        "27|1": "27|2"
    },
    scenes_d3_5: {
        // This unused dialogue once pointed to deleted NPC 68. Ending the
        // dormant branch is safer than allowing a transition into null.
        "67|2": ""
    }
}, n = {
    scenes_d3_3: [{
        // prop113 existed in the recovered catalogue and chapter total but was
        // never placed in a published map. Put the original Red Star Newspaper
        // collectible on the route through the school/exchange area so the
        // advertised third-section 5/5 completion is actually attainable.
        name: "收藏品-红星报",
        url: "item/items/item3",
        key: "collection",
        eventPre: null,
        eventTrigger: [{
            index: 1,
            key: "5",
            param: "prop113",
            next: "",
            isLoop: !1,
            trigger: "6",
            last: 0,
            delay: 0,
            isWait: !0,
            specialParam: "",
            isNoAct: !1
        }],
        index: 26,
        x: -250,
        y: -145,
        z: 190,
        sx: .7,
        sy: .7,
        r: 0,
        box: {
            width: 91,
            height: 84,
            x: 0,
            y: -20
        },
        button: {
            x: 0,
            y: 0
        },
        isClimb: !1,
        isLoop: !1,
        isOb: !1,
        isDrag: !1,
        ani: "13",
        lockCount: 0,
        isLock: !1,
        isHide: !1,
        guide: "",
        width: 91,
        height: 84,
        color: ""
    }]
}, geometryRepairs = {
    scenes_d3_3: {
        13: {
            // Keep the original collider-driven interaction range. Move the
            // stale queue boundary just behind the exchange clerk so the hero
            // can physically enter the clerk's authored 100x100 sensor. The
            // story later hides this boundary before the supply box is used.
            name: "阻挡",
            x: 835,
            boxWidth: 30
        }
    }
}, a = {
    repairScene: function (t, e, o) {
        var a = i[t], s = n[t], geometry = geometryRepairs[t], r = 0;
        if (!e || !Array.isArray(e.confArr)) return r;
        if (a) for (var c = 0; c < e.confArr.length; c++) {
            var l = e.confArr[c], h = l.eventTrigger || [];
            for (var d = 0; d < h.length; d++) {
                var p = l.index + "|" + h[d].index;
                Object.prototype.hasOwnProperty.call(a, p) && h[d].next !== a[p] && (h[d].next = a[p], r++);
            }
        }
        if (s) for (var u = 0; u < s.length; u++) {
            for (var m = s[u], _ = m.eventTrigger[0].param, f = !1, g = 0; g < e.confArr.length && !f; g++) {
                var y = e.confArr[g], v = y.eventTrigger || [];
                for (var b = 0; b < v.length; b++) v[b].param === _ && (f = !0);
            }
            // Saved item arrays intentionally remove collected props. Do not
            // reinsert a compatibility placement after permanent collection.
            f || o && o[_] || (e.confArr.push(JSON.parse(JSON.stringify(m))), r++);
        }
        if (geometry) for (var w = 0; w < e.confArr.length; w++) {
            var item = e.confArr[w], patch = geometry[item.index];
            if (patch && (!patch.name || patch.name === item.name)) {
                item.x !== patch.x && (item.x = patch.x, r++);
                item.box && item.box.width !== patch.boxWidth && (item.box.width = patch.boxWidth, r++);
            }
        }
        return r;
    },
    repairs: i,
    placements: n,
    geometryRepairs: geometryRepairs
};

o.default = a;
