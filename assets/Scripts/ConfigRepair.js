'use strict';

/**
 * 模块职责：集中修补配置中的断链、缺失收藏和错误阻挡。
 * 关键约束：修补保持幂等并区分新档与已收集存档，不能让永久物品重新出现。
 */

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
    value: !0
});

// 配置表中有少量因编辑行删除或重排留下的过期事件索引。修补集中在声明式表中，
// 使运行时和离线事件图校验使用同一迁移，并保持原始数据可追溯。
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
        // 未使用对白指向已删除的 NPC 68；在此结束休眠分支，避免切入空目标。
        "67|2": ""
    }
}, n = {
    scenes_d3_3: [{
        // prop113 已计入图鉴和章节总数，却未放入任何发布地图；将红星报放在小学堂
        // 兑换路线，使第三节 5/5 完成度确实可达。
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
            // 保留碰撞驱动的原作交互范围，只把过期队列边界移到兑换员身后，使主角能
            // 进入其 100x100 传感器；剧情会在使用物资箱前隐藏该边界。
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
            // 存档物品数组会主动移除已收藏物，永久收藏后不能因兼容修补再次放回。
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
