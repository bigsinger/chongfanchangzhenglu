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
            case 7:
                return "拾取";
            case 5:
                return e ? "使用" : "拾取";
            case 6:
                return e ? "装水" : "拾取";
            case 8:
                return "取水";
            case 9:
                return "浇水";
            case 15:
                return "翻烤";
            case 17:
                return "救出";
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

    _targetName: function (t) {
        var e = t && t.name || "目标", o = {
            "打水触发": "水源",
            "二虎触发": "二虎",
            "废墟-铁铲": "废墟",
            "铁铲挖掘": "废墟",
            "烤红薯1": "火堆",
            "烤红薯2": "火堆",
            "砍竹子": "竹子",
            "接水": "水源",
            "匹配物品1": "当前患者",
            "匹配物品2": "当前患者",
            "女医生": "赵亦涵医生",
            "医生隐1": "赵亦涵医生",
            "医生隐2": "赵亦涵医生",
            "医生隐3": "赵亦涵医生",
            "王守仓2": "王守仓",
            "王守仓隐": "王守仓",
            "政委1": "政委",
            "政委2": "政委",
            "大妈隐": "大妈",
            "大妈隐1": "大妈",
            "大妈隐2": "大妈"
        };
        return o[e] || e;
    },

    _goodsName: function (t) {
        if (!t) return "物品";
        var e = {
            prop41: "生红薯",
            prop42: "熟红薯",
            prop43: "烤焦红薯",
            prop25: "物资箱",
            prop45: "中药药包",
            prop46: "西药药瓶",
            prop47: "绷带",
            prop48: "银元",
            prop50: "衣物"
        }, o = {
            "红薯_生": "生红薯",
            "红薯_熟": "熟红薯",
            "红薯_糊": "烤焦红薯"
        };
        return e[t.nameid] || o[t.name] || t.name || "物品";
    },

    _collectionName: function (t) {
        var e = {
            prop101: "经济建设公债",
            prop102: "《为开展查田运动》",
            prop103: "红军临时借谷证",
            prop104: "《中国工农红军优待条例》",
            prop105: "20式82毫米迫击炮",
            prop106: "红军八角帽",
            prop107: "紫铜一分硬币",
            prop108: "红军绑腿",
            prop109: "中革军委颁发的红军编制表",
            prop110: "医疗箱",
            prop111: "红军干粮袋",
            prop112: "二角硬币",
            prop113: "红星报"
        };
        return e[t] || "";
    },

    _doorText: function (t, e) {
        var o = t && t.name || "", i = /(?:进|出)图(\d+)门/.exec(o);
        if (!i) return "";
        var n = {
            scenes_d1_1: {
                2: "村屋水源"
            },
            scenes_d1_2: {
                1: "村庄主路"
            },
            scenes_d2_1: {
                2: "山间水源"
            },
            scenes_d2_2: {
                1: "行军主路"
            },
            scenes_d3_1: {
                2: "医疗点"
            },
            scenes_d3_2: {
                1: "白石渡主路",
                3: "小学堂"
            },
            scenes_d3_3: {
                2: "医疗点"
            }
        }, a = n[e] && n[e][Number(i[1])] || "相邻地图";
        return "进入【" + a + "】";
    },

    _actionText: function (t, e, o) {
        if (!t) return "";
        var i = Number(t.event.trigger), n = this._targetName(t.conf), a = this._goodsName(e), s = !!(e && t.event.limit === e.nameid), r = t.conf && t.conf.name, c = this._doorText(t.conf, o);
        if (c) return c;
        if (e && t.event.limit && t.event.limit !== e.nameid) return "当前目标需要【" + this._goodsName({
            nameid: t.event.limit
        }) + "】";
        /^收藏品/.test(r || "") && (n = this._collectionName(t.event.param) || "收藏品");
        if ("门出口" === r) return "进入【相邻地图】";
        if ("门进入" === r) return "返回【主路】";
        if ("剧情胜利" === r) return "观看【胜利剧情】";
        if (!e && 6 === i && !/^收藏品/.test(r || "") && /^prop/.test(t.event.param || "")) return "拾取【" + this._goodsName({
            nameid: t.event.param
        }) + "】";
        if (s) {
            if ("赵亦涵医生" === n) return "把【" + a + "】交给【" + n + "】";
            switch (i) {
            case 3:
                return "竹子" === n ? "用【" + a + "】砍【" + n + "】" : "把【" + a + "】交给【" + n + "】";
            case 5:
                return "用【" + a + "】清理【" + n + "】";
            case 6:
                return "用【" + a + "】在【" + n + "】装水";
            case 8:
                return "用【" + a + "】取水";
            case 9:
                return "向【" + n + "】泼水";
            case 15:
                return "翻烤【" + a + "】";
            case 18:
                return "用【" + a + "】通过【" + n + "】";
            default:
                return "对【" + n + "】使用【" + a + "】";
            }
        }
        return this._verb(i, !!t.event.limit) + "【" + n + "】";
    },

    _heldGoods: function (t) {
        return t && t.hero_ts && t.hero_ts.goods || null;
    },

    _candidate: function (t, e, o) {
        if (!t || !t.hero || !t.itemMap) return null;
        var i = this._heldGoods(t), n = i && i.nameid, a = null, s = Number.MAX_VALUE;
        for (var r in t.itemMap) {
            var c = t.itemMap[r], l = c && c.activeInHierarchy && c.getComponent("InteractiveObject"), h = l && l.getConf();
            if (h && (!o || o(h)) && !(Number(h.lockCount) > 0) && h.eventTrigger) {
                for (var d = 0; d < h.eventTrigger.length; d++) {
                    var p = h.eventTrigger[d], u = Number(p.trigger);
                    if (!p.isFinish && Number(p.key) <= 1e3 && u > 1) {
                        var m = c.x - t.hero.x, _ = c.y - t.hero.y, f = m * m + _ * _;
                        n && p.limit && (f -= p.limit === n ? 2e9 : 1e9);
                        e && e.interactNode === c && (f -= 3e9);
                        /门/.test(h.name || "") && (f += 5e8);
                        // Optional collections must not replace a nearby main
                        // NPC as the chapter objective. They remain directly
                        // pickable through their own bubble and normal nearest
                        // interaction selection.
                        /^收藏品/.test(h.name || "") && (f += 2e8);
                        if (f < s) {
                            s = f;
                            a = {
                                node: c,
                                conf: h,
                                event: p,
                                distance: Math.sqrt(Math.max(0, m * m + _ * _)),
                                deltaX: m,
                                isDoor: /门/.test(h.name || "")
                            };
                        }
                        // InteractiveObject.getEvent() executes the first
                        // unfinished actionable event. Do not advertise a
                        // later delivery merely because it matches the held
                        // item; that makes the HUD disagree with the button.
                        break;
                    }
                }
            }
        }
        return a;
    },

    _storyCandidate: function (t) {
        if (!t || !t.hero || !t.itemMap) return null;
        var e = null, o = Number.MAX_VALUE;
        for (var i in t.itemMap) {
            var n = t.itemMap[i], a = n && n.activeInHierarchy && n.getComponent("InteractiveObject"), s = a && a.getConf();
            if (s && "initPos" !== s.key && !(Number(s.lockCount) > 0) && s.eventTrigger) for (var r = 0; r < s.eventTrigger.length; r++) {
                var c = s.eventTrigger[r];
                if (!c.isFinish && Number(c.key) <= 1e3 && 1 === Number(c.trigger)) {
                    var l = n.x - t.hero.x, h = n.y - t.hero.y, d = l * l + h * h;
                    if (d < o) {
                        o = d;
                        e = {
                            node: n,
                            conf: s,
                            event: c,
                            distance: Math.sqrt(d),
                            deltaX: l,
                            navigationOnly: !0
                        };
                    }
                    break;
                }
            }
        }
        return e;
    },

    _distributionProgress: function (t) {
        if (!t || "scenes_d3_2" !== t.mapName) return null;
        var e = {
            done: 0,
            total: 0
        }, o = {
            done: 0,
            total: 0
        }, i = !1;
        for (var n in t.itemMap) {
            var a = t.itemMap[n], s = a && a.getComponent("InteractiveObject"), r = s && s.getConf();
            if (r && r.eventTrigger) for (var c = 0; c < r.eventTrigger.length; c++) {
                var l = r.eventTrigger[c];
                if ("医生隐2" === r.name && "prop25" === l.limit && l.isFinish) i = !0;
                if (l.limit && Number(l.trigger) === 3) {
                    var h = "匹配物品2" === r.name ? o : "匹配物品1" === r.name ? e : null;
                    h && (h.total++, l.isFinish && h.done++);
                }
            }
        }
        if (e.total && e.done < e.total) return e;
        if (o.total && (i || o.done > 0)) return o;
        return e.total ? {
            done: e.done,
            total: e.total,
            betweenRounds: !0
        } : null;
    },

    describe: function (t, e) {
        var o = this._heldGoods(t), i = this._candidate(t, e), n = this._storyCandidate(t), a = this._distributionProgress(t), s = this._mapTips[t && t.mapName] || "继续探索当前场景";
        !o && i && i.isDoor && n && (i = n);
        i || (i = n);
        if (o && i && i.event.limit === o.nameid) s = this._actionText(i, o, t.mapName); else if (o && i && i.event.limit) s = "当前目标需要【" + this._goodsName({
            nameid: i.event.limit
        }) + "】，当前携带【" + this._goodsName(o) + "】"; else if (o) s = "携带【" + this._goodsName(o) + "】，寻找需要它的人"; else if (i && i.navigationOnly) s = "前往下一处剧情点"; else if (i && i.distance < 520) s = this._actionText(i, o, t.mapName);
        if (!o && a && a.done === a.total) {
            var r = this._candidate(t, e, function (t) {
                return /医生/.test(t.name || "");
            });
            r && !r.event.limit ? (i = r, s = "向【赵亦涵医生】汇报分发情况") : (r = this._candidate(t, e, function (t) {
                return "进图1门" === t.name;
            })) && (i = r, s = 4 === a.total ? "返回【白石渡主路】领取补给任务" : "返回【白石渡主路】完成本章任务");
        }
        a && a.total > 1 && !(i && "prop25" === i.event.limit) && (s += "  " + a.done + "/" + a.total);
        if (i && i.distance >= 260) s += i.deltaX >= 0 ? "  →" : "  ←";
        return {
            objective: s,
            // Required NPCs can sit behind authored queues or invisible
            // blockers. Advertise them as actionable from a forgiving mobile
            // distance; GameplayInteractionQuery still prioritizes the current
            // objective so unrelated nearby props cannot steal the button.
            action: i && !i.navigationOnly && i.distance < 1e3 ? this._actionText(i, o, t.mapName) : "",
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
        if (e) {
            e.preferredNode = o.action && o.candidate ? o.candidate.node : null;
            e.preferredOperation = o.action && o.candidate ? Number(o.candidate.event.trigger) : null;
        }
        var n = "当前目标：" + o.objective;
        t.m_objectiveLabel.string !== n && (t.m_objectiveLabel.string = n);
        if (t.m_actionTargetNode && t.m_actionTargetLabel) {
            var i = !!(o.action && t.btn_user && t.btn_user.activeInHierarchy);
            t.m_actionTargetNode.active = i;
            i && t.m_actionTargetLabel.string !== o.action && (t.m_actionTargetLabel.string = o.action);
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
