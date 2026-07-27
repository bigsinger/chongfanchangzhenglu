'use strict';

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
    value: !0
});

var i = {
    _mapTips: {
        scenes_d1_1: "在村庄寻找食物和水，帮助沿途百姓",
        scenes_d1_2: "继续向前寻找红军并留意人物气泡",
        scenes_d2_1: "跟随队伍推进，救助受伤的战士",
        scenes_d2_2: "寻找水源并向老农了解长征史实",
        scenes_d3_1: "跟随队伍前进，寻找工具排除障碍",
        scenes_d3_2: "协助医生按患者需要分发物资",
        scenes_d3_3: "收集并兑换物资，找回遗失的蓝布包"
    },

    _verb: function (t, e) {
        switch (Number(t)) {
            case 3:
                return e ? "交给" : "交互";
            case 4:
            case 5:
            case 6:
            case 7:
                return "拾取";
            case 8:
                return "取水";
            case 9:
                return "浇水";
            case 15:
                return "翻烤";
            case 18:
                return "攀爬";
            case 19:
                return "答题";
            case 22:
                return "打开";
            case 23:
                return "进入";
            case 25:
                return "查看";
            default:
                return "操作";
        }
    },

    _heldGoods: function (t) {
        return t && t.hero_ts && t.hero_ts.goods || null;
    },

    _candidate: function (t, e) {
        if (!t || !t.hero || !t.itemMap) return null;
        var o = this._heldGoods(t), i = o && o.nameid, n = null, a = Number.MAX_VALUE;
        for (var s in t.itemMap) {
            var r = t.itemMap[s], c = r && r.activeInHierarchy && r.getComponent("InteractiveObject"), l = c && c.getConf();
            if (l && !(Number(l.lockCount) > 0) && l.eventTrigger) {
                for (var h = 0; h < l.eventTrigger.length; h++) {
                    var d = l.eventTrigger[h], p = Number(d.trigger);
                    if (!d.isFinish && Number(d.key) <= 1e3 && p > 1) {
                        if (i && d.limit && d.limit !== i) continue;
                        var u = r.x - t.hero.x, m = r.y - t.hero.y, _ = u * u + m * m;
                        d.limit && d.limit === i && (_ -= 1e9);
                        e && e.interactNode === r && (_ -= 2e9);
                        if (_ < a) {
                            a = _;
                            n = {
                                node: r,
                                conf: l,
                                event: d,
                                distance: Math.sqrt(Math.max(0, u * u + m * m)),
                                deltaX: u
                            };
                        }
                        break;
                    }
                }
            }
        }
        return n;
    },

    _distributionProgress: function (t) {
        if (!t || "scenes_d3_2" !== t.mapName) return null;
        var e = 0, o = 0;
        for (var i in t.itemMap) {
            var n = t.itemMap[i], a = n && n.getComponent("InteractiveObject"), s = a && a.getConf();
            if (s && s.eventTrigger) for (var r = 0; r < s.eventTrigger.length; r++) {
                var c = s.eventTrigger[r];
                c.limit && Number(c.trigger) === 3 && (o++, c.isFinish && e++);
            }
        }
        return o ? {
            done: e,
            total: o
        } : null;
    },

    describe: function (t, e) {
        var o = this._heldGoods(t), i = this._candidate(t, e), n = this._distributionProgress(t), a = this._mapTips[t && t.mapName] || "继续探索当前场景";
        if (o && i && i.event.limit === o.nameid) a = "把【" + (o.name || "物品") + "】交给【" + (i.conf.name || "任务人物") + "】"; else if (o) a = "携带【" + (o.name || "物品") + "】，寻找需要它的人"; else if (i && i.distance < 520) a = this._verb(i.event.trigger, !!i.event.limit) + "【" + (i.conf.name || "目标") + "】";
        n && n.total > 1 && (a += "  " + n.done + "/" + n.total);
        if (i && i.distance >= 260) a += i.deltaX >= 0 ? "  →" : "  ←";
        return {
            objective: a,
            action: i && i.distance < 440 ? this._verb(i.event.trigger, !!i.event.limit) + "【" + (i.conf.name || "目标") + "】" : "",
            candidate: i
        };
    },

    _makeLabel: function (t, e, o) {
        var i = new cc.Node(t), n = i.addComponent(cc.Label);
        n.fontSize = e;
        n.lineHeight = e + 4;
        n.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        n.verticalAlign = cc.Label.VerticalAlign.CENTER;
        n.overflow = cc.Label.Overflow.SHRINK;
        i.width = o;
        i.height = e + 12;
        var a = i.addComponent(cc.LabelOutline);
        a.color = cc.color(65, 20, 18, 255);
        a.width = 2;
        return {
            node: i,
            label: n
        };
    },

    init: function (t, e) {
        if (!t || !t.camera_ui || t.m_objectiveNode) return;
        var o = new cc.Node("objectiveTracker");
        o.group = "ui";
        o.width = Math.min(820, cc.winSize.width - 300);
        o.height = 48;
        o.y = cc.winSize.height / 2 - 35;
        o.zIndex = 9999;
        var i = o.addComponent(cc.Graphics);
        i.fillColor = cc.color(45, 18, 16, 190);
        i.roundRect(-o.width / 2, -24, o.width, 48, 12);
        i.fill();
        var n = this._makeLabel("objectiveText", 21, o.width - 28);
        n.node.y = 0;
        o.addChild(n.node);
        var a = t;
        o.on(cc.Node.EventType.TOUCH_END, function () {
            a.tipsBack && a.tipsBack();
        }, t);
        t.camera_ui.node.addChild(o);
        t.m_objectiveNode = o;
        t.m_objectiveLabel = n.label;

        if (t.btn_user) {
            var s = this._makeLabel("actionTargetText", 18, 270);
            s.node.y = 76;
            s.node.zIndex = 20;
            t.btn_user.addChild(s.node);
            t.m_actionTargetNode = s.node;
            t.m_actionTargetLabel = s.label;
        }
        this.update(t, e);
    },

    update: function (t, e) {
        if (!t || !t.m_objectiveLabel) return;
        var o = this.describe(t, e);
        t.m_objectiveLabel.string = "当前目标：" + o.objective;
        if (t.m_actionTargetNode && t.m_actionTargetLabel) {
            var i = !!(o.action && t.btn_user && t.btn_user.activeInHierarchy);
            t.m_actionTargetNode.active = i;
            i && (t.m_actionTargetLabel.string = o.action);
        }
    },

    destroy: function (t) {
        if (!t) return;
        t.m_objectiveNode && (t.m_objectiveNode.off(cc.Node.EventType.TOUCH_END), t.m_objectiveNode.destroy());
        t.m_actionTargetNode && t.m_actionTargetNode.destroy();
        t.m_objectiveNode = null;
        t.m_objectiveLabel = null;
        t.m_actionTargetNode = null;
        t.m_actionTargetLabel = null;
    }
};

o.default = i;
