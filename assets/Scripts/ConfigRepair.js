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
    repairScene: function (t, e) {
        var o = i[t], n = 0;
        if (!o || !e || !Array.isArray(e.confArr)) return n;
        for (var a = 0; a < e.confArr.length; a++) {
            var s = e.confArr[a], r = s.eventTrigger || [];
            for (var c = 0; c < r.length; c++) {
                var l = s.index + "|" + r[c].index;
                Object.prototype.hasOwnProperty.call(o, l) && r[c].next !== o[l] && (r[c].next = o[l], n++);
            }
        }
        return n;
    },
    repairs: i
};

o.default = n;
