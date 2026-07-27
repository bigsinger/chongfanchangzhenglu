'use strict';

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
    value: !0
});

var i = require("./GameData"), n = {
    prop101: "第一节·村落废墟",
    prop102: "第一节·村落水井附近",
    prop103: "第一节·战场沿途",
    prop104: "第一节·村屋附近",
    prop105: "第二节·炮兵阵地",
    prop106: "第三节·行军道路",
    prop107: "第二节·隐蔽道路",
    prop108: "第二节·战场后方",
    prop109: "第三节·队伍驻地",
    prop110: "第三节·医疗点",
    prop111: "第二节·补给区域",
    prop112: "第三节·营地附近",
    prop113: "第三节·报刊宣传点",
    prop114: "第四节·队伍驻地",
    prop115: "第四节·湘江沿岸",
    prop116: "第四节·临时课堂",
    prop117: "第四节·战场遗址",
    prop118: "第四节·桂北村落"
}, a = function () {
    function t() {}
    t.collectibles = function (t) {
        var e = [];
        for (var o in i.default.goodsConf) {
            var n = i.default.goodsConf[o];
            n && String(n.xjid) == String(t) && e.push({
                key: o,
                data: n,
                found: !!i.default.itemData[o]
            });
        }
        return e;
    };
    t.stories = function (t) {
        var e = 0, o = 0;
        for (var n in i.default.story || {}) {
            var a = i.default.story[n];
            a && String(a.xjid) == String(t) && (o++, i.default.storyData[Number(a.id)] && e++);
        }
        return {
            found: e,
            total: o
        };
    };
    t.chapter = function (t) {
        var e = this.collectibles(t), o = this.stories(t), n = 0, a = [];
        for (var s = 0; s < e.length; s++) e[s].found ? n++ : a.push(e[s]);
        return {
            chapter: Number(t),
            itemsFound: n,
            itemsTotal: e.length,
            storiesFound: o.found,
            storiesTotal: o.total,
            missing: a
        };
    };
    t.clue = function (t) {
        if (!t) return "";
        return n[t.key] || "第" + t.data.xjid + "节·主线道路附近";
    };
    t.shortText = function (t) {
        var e = this.chapter(t), o = "收藏 " + e.itemsFound + "/" + e.itemsTotal + " · 故事 " + e.storiesFound + "/" + e.storiesTotal;
        return e.missing.length && (o += "\n遗漏线索：" + this.clue(e.missing[0])), o;
    };
    t.endingText = function () {
        var t = Number(i.default.chapter || 1), e = this.chapter(t), o = "本节完成！收藏 " + e.itemsFound + "/" + e.itemsTotal + "，故事 " + e.storiesFound + "/" + e.storiesTotal + "。";
        return e.missing.length ? o + "\n可返回探索：" + this.clue(e.missing[0]) + "。" : o + "\n本节内容已全部收集。";
    };
    return t;
}();

o.default = a;
