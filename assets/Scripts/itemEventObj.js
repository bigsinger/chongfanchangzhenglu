'use strict';

var e = module;
var o = exports;

var i, n = this && this.__extends || (i = function (t, e) {
            return (i = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function (t, e) {
                t.__proto__ = e;
            } || function (t, e) {
                for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
            })(t, e);
        }, function (t, e) {
            i(t, e);
            function o() {
                this.constructor = t;
            }
            t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
        }), a = this && this.__decorate || function (t, e, o, i) {
            var n, a = arguments.length, s = a < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, i); else for (var r = t.length - 1; r >= 0; r--) (n = t[r]) && (s = (a < 3 ? n(s) : a > 3 ? n(e, o, s) : n(e, o)) || s);
            return a > 3 && s && Object.defineProperty(e, o, s), s;
        };
        Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var s = require("./GameData"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.lb_id = null;
                e.lb_explain = null;
                e.eb_param = null;
                e.eb_specialParam = null;
                e.eb_next = null;
                e.eb_trigger = null;
                e.toggle_loop = null;
                e.att_scale = null;
                e.eb_last = null;
                e.node_move = null;
                e.eb_x = null;
                e.eb_y = null;
                e.eb_time = null;
                e.toggle_op = null;
                e.toggle_unflip = null;
                e.txt_param = null;
                e.txt_specialParam = null;
                e.txt_toggle = null;
                e.eb_op = null;
                e.node_camera = null;
                e.eb_cx = null;
                e.eb_cy = null;
                e.eb_ctime = null;
                e.eb_cscale = null;
                e.tc_cmod = null;
                e.toggle_cunlock = null;
                e.eb_aniTime = null;
                e.node_cameraPart = null;
                e.part_cx = null;
                e.part_cy = null;
                e.part_cscale = null;
                e.part_active = null;
                e.node_ladder = null;
                e.toggle_ladder = null;
                e.toggle_jump = null;
                e.node_door = null;
                e.eb_doorx = null;
                e.eb_doory = null;
                e.node_drop = null;
                e.eb_drop_range = null;
                e.eb_drop_y = null;
                e.eb_drop_space = null;
                e.node_dropOne = null;
                e.eb_dropOne_y = null;
                e.eb_dropOne_time = null;
                e.eb_dropOne_interval = null;
                e.eb_dropOne_pos = null;
                e.eb_delay = null;
                e.eb_limit = null;
                e.eb_limitTigger = null;
                e.eb_cross = null;
                e.toggle_openKnock = null;
                e.toggle_hide = null;
                e.toggle_tigger = null;
                e.toggle_wait = null;
                e.txt_ex = null;
                e.txt_DAni = null;
                e.node_bottom = null;
                e.node_top = null;
                e.node_ai = null;
                e.eb_ai_xmin = null;
                e.eb_ai_xmax = null;
                e.eb_ai_range = null;
                e.eb_ai_space = null;
                e.toggle_ai_right = null;
                e.toggle_reverse = null;
                e.not_editbox = null;
                e.toggle_delguide = null;
                e.editBox_special = null;
                e.ani_editbox = null;
                e.node_flip = null;
                e.toggle_flipLeft = null;
                e.toggle_flipRight = null;
                e.toggle_dirLeft = null;
                e.eb_timing_1 = null;
                e.eb_timing_2 = null;
                e.eb_timing_3 = null;
                e.eb_timingFrame = null;
                e.eb_timingDelay = null;
                e.node_sound = null;
                e.toggle_bgm = null;
                e.toggle_stop = null;
                e.eb_soundTime = null;
                e.eb_soundpos = null;
                e.node_drag = null;
                e.eb_dragRange = null;
                e.eb_dragTime = null;
                e.eb_dragX = null;
                e.toggle_dragRight = null;
                e.node_bubble = null;
                e.eb_num = null;
                e.eb_times = null;
                e.eb_interval = null;
                e.eb_pos = null;
                e.node_black = null;
                e.black_times = null;
                e.eventKey = null;
                e.resultKey = null;
                e.eventIndex = 0;
                return e;
            }
            e.prototype.start = function () { };
            e.prototype.getIndex = function () {
                return this.eventIndex;
            };
            e.prototype.initItemEventObj = function (t, e, o) {
                this.editManager = o;
                this.eventIndex = t.index ? t.index : 0;
                this.eventIndex || (this.eventIndex = e);
                this.lb_id.string = this.eventIndex + "";
                this.eventKey = t.key;
                var i = s.default.eventConf[this.eventKey];
                this.resultKey = Number(i.result);
                this.lb_explain.string = i.explain;
                if (this.resultKey < 1e3) {
                    switch (this.resultKey) {
                        case 1:
                            this.txt_toggle.string = "保持动画";
                            this.toggle_tigger.node.active = !0;
                            this.toggle_tigger.isChecked = null != t.isHoldDz && t.isHoldDz;
                            break;

                        case 2:
                            this.eb_aniTime.node.active = !0;
                            this.eb_aniTime.string = null != t.playTime ? t.playTime : 0;
                            break;

                        case 3:
                            this.txt_param.string = "受击触发";
                            break;

                        case 4:
                            this.txt_toggle.string = "无拾取动作";
                            this.toggle_tigger.node.active = !0;
                            this.toggle_tigger.isChecked = null != t.isNoAct && t.isNoAct;
                            break;

                        case 0:
                            this.txt_param.string = "触发物件";
                            this.toggle_tigger.node.active = !0;
                            this.toggle_tigger.isChecked = null == t.heroTigger || t.heroTigger;
                            break;

                        case 9:
                            this.txt_param.string = "物件/事件";
                            this.toggle_delguide.node.active = !0;
                            this.toggle_delguide.isChecked = null != t.isDelGuide && t.isDelGuide;
                            break;

                        case 10:
                            this.txt_param.string = "物件ID";
                            this.toggle_hide.node.active = !0;
                            this.toggle_hide.isChecked = null != t.isHide && t.isHide;
                            this.txt_toggle.string = "隐藏按钮";
                            this.toggle_tigger.node.active = !0;
                            this.toggle_tigger.isChecked = null != t.isHideButton && t.isHideButton;
                            break;

                        case 6:
                            this.txt_param.string = "操作物件";
                            this.eb_op.node.active = !0;
                            this.eb_op.string = t.op;
                            break;

                        case 7:
                            this.eb_param.node.active = !1;
                            this.node_move.active = !0;
                            var n = t.move;
                            if (n) {
                                this.toggle_op.isChecked = null != n.isOp && n.isOp;
                                this.toggle_unflip.isChecked = null != n.isUnFlip && n.isUnFlip;
                                this.eb_x.string = null == n.x ? "" : n.x;
                                this.eb_y.string = null == n.y ? "" : n.y;
                                this.eb_time.string = n.time;
                            }
                            break;

                        case 8:
                            this.node_ladder.active = !0;
                            this.toggle_jump.isChecked = !!t.jumpRight && t.jumpRight;
                            this.toggle_ladder.isChecked = !!t.ladderRight && t.ladderRight;
                            break;

                        case 11:
                            this.eb_param.node.active = !1;
                            this.node_camera.active = !0;
                            var a = t.camera;
                            if (a) {
                                this.eb_cx.string = null == a.x ? "" : a.x + o.gameWidth / 2 + "";
                                this.eb_cy.string = null == a.y ? "" : o.gameHeight / 2 - a.y + "";
                                this.eb_ctime.string = a.time;
                                this.eb_cscale.string = a.scale;
                                this.toggle_cunlock.isChecked = null != a.unlock && a.unlock;
                                var r = this.tc_cmod.node.children;
                                for (var c in r) if (a.mod == Number(c)) {
                                    r[c].getComponent(cc.Toggle).isChecked = !0;
                                    break;
                                }
                            }
                            break;

                        case 12:
                            this.txt_param.string = "翻转物件";
                            this.node_flip.active = !0;
                            this.toggle_flipLeft.isChecked = null == t.flipDir || "left" == t.flipDir;
                            this.toggle_flipRight.isChecked = "right" == t.flipDir;
                            break;

                        case 13:
                            this.toggle_dirLeft.node.active = !0;
                            this.toggle_dirLeft.isChecked = null != t.dirLeft && t.dirLeft;
                            this.txt_param.string = "地图序号";
                            this.node_door.active = !0;
                            var l = t.door;
                            if (l) {
                                this.eb_doorx.string = l.x;
                                this.eb_doory.string = l.y;
                            }
                            break;

                        case 14:
                            this.txt_param.string = "切换至状态";
                            break;

                        case 15:
                            this.eb_param.node.active = !1;
                            this.toggle_openKnock.node.active = !0;
                            this.toggle_openKnock.isChecked = null != t.openKnock && t.openKnock;
                            break;

                        case 16:
                            this.txt_param.string = "关卡";
                            break;

                        case 17:
                            this.txt_param.string = "行走方式";
                            this.txt_ex.string = "run跑步 walk走路 squat半蹲";
                            this.txt_ex.node.active = !0;
                            break;

                        case 18:
                            this.eb_cross.node.active = !0;
                            this.eb_cross.string = t.cross;
                            break;

                        case 19:
                            this.txt_param.string = "密码";
                            break;

                        case 20:
                            this.eb_aniTime.node.active = !0;
                            this.eb_aniTime.string = null != t.playTime ? t.playTime : 0;
                            this.txt_DAni.active = !1;
                            break;

                        case 21:
                            this.eb_param.node.active = !1;
                            this.toggle_dirLeft.node.active = !0;
                            this.toggle_dirLeft.isChecked = null != t.dirLeft && t.dirLeft;
                            break;

                        case 22:
                            break;

                        case 23:
                            this.txt_toggle.string = "解除等待";
                            this.toggle_tigger.node.active = !0;
                            this.toggle_tigger.isChecked = null != t.relieveWait && t.relieveWait;
                            break;

                        case 25:
                            this.txt_param.string = "掉落类型";
                            this.node_drop.active = !0;
                            var h = t.drop;
                            if (h) {
                                this.eb_drop_range.string = h.range;
                                this.eb_drop_y.string = h.y;
                                this.eb_drop_space.string = h.space;
                            }
                            break;

                        case 26:
                            this.txt_param.string = "动画名";
                            break;

                        case 27:
                            this.eb_param.node.active = !1;
                            this.node_cameraPart.active = !0;
                            var d = t.camera_part;
                            if (d) {
                                this.part_cx.string = null == d.x ? "" : d.x + o.gameWidth / 2 + "";
                                this.part_cy.string = null == d.y ? "" : o.gameHeight / 2 - d.y + "";
                                this.part_cscale.string = d.scale;
                                this.part_active.isChecked = d._active;
                            }
                            break;

                        case 28:
                            this.eb_specialParam.node.active = !0;
                            break;

                        case 29:
                            this.txt_param.string = "x偏移";
                            this.txt_toggle.string = "对齐后朝左";
                            this.toggle_tigger.node.active = !0;
                            this.toggle_tigger.isChecked = null != t.alignLeft && t.alignLeft;
                            break;

                        case 30:
                            this.txt_param.string = "层级";
                            this.att_scale.node.active = !0;
                            this.att_scale.string = t.att_scale ? t.att_scale : 1;
                            break;

                        case 33:
                            this.txt_ex.string = "left锁定朝左 right锁定朝右 不填取消锁定";
                            this.txt_ex.node.active = !0;
                            break;

                        case 34:
                            this.txt_param.string = "掉落物类型";
                            this.node_dropOne.active = !0;
                            var p = t.dropOne;
                            if (p) {
                                this.eb_dropOne_y.string = p.y ? p.y : 0;
                                this.eb_dropOne_time.string = p.time ? p.time : 0;
                                this.eb_dropOne_pos.string = p.pos ? p.pos : "";
                                this.eb_dropOne_interval.string = p.interval ? p.interval : "1";
                            }
                            break;

                        case 36:
                            this.node_sound.active = !0;
                            var u = t.sound;
                            this.eb_soundTime.string = u.time ? u.time : 0;
                            this.toggle_bgm.isChecked = !!u.bgm && u.bgm;
                            this.toggle_stop.isChecked = !!u.stop && u.stop;
                            var m = "";
                            if (u.soundpos && "" != u.soundpos) {
                                var _ = u.soundpos.split("|");
                                m = Number(_[0]) + o.gameWidth / 2 + "|" + (Number(_[1]) + o.gameWidth / 2) + "|" + (Number(_[2]) + o.gameWidth / 2);
                            }
                            this.eb_soundpos.string = m;
                            break;

                        case 37:
                            this.txt_param.string = "跟随ID";
                            break;

                        case 38:
                            this.txt_param.string = "计时区间";
                            this.eb_timing_1.node.active = !0;
                            this.eb_timing_2.node.active = !0;
                            this.eb_timing_3.node.active = !0;
                            this.eb_timingFrame.node.active = !0;
                            this.eb_timingDelay.node.active = !0;
                            var f = t.timing;
                            if (f) {
                                this.eb_timing_1.string = f[0];
                                this.eb_timing_2.string = f[1];
                                this.eb_timing_3.string = f[2];
                            }
                            var g = t.timingFrame;
                            g && (this.eb_timingFrame.string = g);
                            var y = t.timingDelay;
                            this.eb_timingDelay.string = null != y && "" != y ? y : "0";
                            break;

                        case 39:
                            this.txt_param.string = "节点名";
                            this.txt_specialParam.string = "透明度";
                            this.eb_specialParam.node.active = !0;
                            break;

                        case 42:
                        case 43:
                            this.node_bubble.active = !0;
                            var v = t.bubble;
                            if (v) {
                                this.eb_num.string = v.num ? v.num : "0";
                                this.eb_times.string = v.times ? v.times : "0";
                                this.eb_interval.string = v.interval ? v.interval : "0";
                                this.eb_pos.string = v.pos ? v.pos : "56|300";
                            }
                            break;

                        case 44:
                            this.txt_param.string = "拖拽ID";
                            this.node_drag.active = !0;
                            var b = t.drag;
                            if (b) {
                                this.eb_dragRange.string = b.range;
                                this.eb_dragTime.string = b.time;
                                this.eb_dragX.string = null != b.dragX ? b.dragX : 0;
                                this.toggle_dragRight.isChecked = b.dragRight;
                            }
                            break;

                        case 46:
                            this.txt_specialParam.string = "错误next";
                            this.eb_specialParam.node.active = !0;
                            break;

                        case 47:
                            this.node_black.active = !0;
                            this.black_times.node.active = !0;
                            var C = t.black;
                            C && (this.black_times.string = C.times ? C.times : "0");
                    }
                    this.eb_param.string = t.param ? t.param : "";
                    this.eb_next.string = t.next ? t.next : "";
                    this.toggle_loop.isChecked = !!t.isLoop && t.isLoop;
                    this.eb_trigger.string = t.trigger ? t.trigger : "";
                    this.eb_last.string = t.last ? t.last : "";
                    this.eb_delay.string = t.delay ? t.delay : "";
                    this.toggle_wait.isChecked = null == t.isWait || t.isWait;
                    this.eb_specialParam.string = t.specialParam ? t.specialParam : "";
                    t.limit && (this.eb_limit.string = t.limit);
                    t.limitTigger && (this.eb_limitTigger.string = t.limitTigger);
                } else {
                    this.node_bottom.active = !1;
                    this.node_top.active = !1;
                    this.node_ai.active = !0;
                    this.eb_ai_xmin.string = null == t.xmin ? "" : t.xmin + o.gameWidth / 2 + "";
                    this.eb_ai_xmax.string = null == t.xmax ? "" : t.xmax + o.gameWidth / 2 + "";
                    this.eb_ai_range.string = t.range ? t.range : 0;
                    this.eb_ai_space.string = t.space ? t.space : 0;
                    this.toggle_ai_right.isChecked = !!t.initRight && t.initRight;
                    this.editBox_special.string = t.special || "";
                    this.ani_editbox.string = t.ani || "";
                    this.toggle_reverse.isChecked = !!t.reverse && t.reverse;
                    this.not_editbox.string = t.lamp || "";
                }
            };
            e.prototype.getEventData = function () {
                var t;
                if (this.resultKey < 1e3) {
                    t = {
                        index: this.eventIndex,
                        key: this.eventKey,
                        param: this.eb_param.string,
                        next: this.eb_next.string,
                        isLoop: this.toggle_loop.isChecked,
                        trigger: "" != this.eb_trigger.string ? this.eb_trigger.string : "0",
                        last: "" != this.eb_last.string ? this.eb_last.string : 0,
                        delay: "" != this.eb_delay.string ? this.eb_delay.string : 0,
                        isWait: this.toggle_wait.isChecked,
                        specialParam: this.eb_specialParam.string
                    };
                    "" != this.eb_limit.string && (t.limit = this.eb_limit.string);
                    "" != this.eb_limitTigger.string && (t.limitTigger = this.eb_limitTigger.string);
                    switch (this.resultKey) {
                        case 0:
                            t.heroTigger = this.toggle_tigger.isChecked;
                            break;

                        case 1:
                            t.isHoldDz = this.toggle_tigger.isChecked;
                            break;

                        case 6:
                            t.op = this.eb_op.string;
                            break;

                        case 4:
                            t.isNoAct = this.toggle_tigger.isChecked;
                            break;

                        case 7:
                            var e;
                            e = {
                                x: "" != this.eb_x.string ? Number(this.eb_x.string) : null,
                                y: "" != this.eb_y.string ? Number(this.eb_y.string) : null
                            };
                            t.move = {
                                x: e.x,
                                y: e.y,
                                time: this.eb_time.string,
                                isOp: this.toggle_op.isChecked,
                                isUnFlip: this.toggle_unflip.isChecked
                            };
                            break;

                        case 8:
                            t.jumpRight = this.toggle_jump.isChecked;
                            t.ladderRight = this.toggle_ladder.isChecked;
                            break;

                        case 9:
                            t.isDelGuide = this.toggle_delguide.isChecked;
                            break;

                        case 10:
                            t.isHide = this.toggle_hide.isChecked;
                            t.isHideButton = this.toggle_tigger.isChecked;
                            break;

                        case 11:
                            var o = 0, i = this.tc_cmod.node.children;
                            for (var n in i) if (i[n].getComponent(cc.Toggle).isChecked) {
                                o = Number(n);
                                break;
                            }
                            var a = this.changePosToData({
                                x: this.eb_cx.string,
                                y: this.eb_cy.string
                            });
                            t.camera = {
                                scale: this.eb_cscale.string,
                                x: a.x,
                                y: a.y,
                                time: this.eb_ctime.string,
                                mod: o,
                                unlock: this.toggle_cunlock.isChecked
                            };
                            break;

                        case 12:
                            t.flipDir = this.toggle_flipLeft.isChecked ? "left" : "right";
                            break;

                        case 2:
                        case 20:
                            t.playTime = this.eb_aniTime.string;
                            break;

                        case 21:
                            t.dirLeft = this.toggle_dirLeft.isChecked;
                            break;

                        case 13:
                            t.dirLeft = this.toggle_dirLeft.isChecked;
                            t.door = {
                                x: this.eb_doorx.string,
                                y: this.eb_doory.string
                            };
                            break;

                        case 15:
                            t.openKnock = this.toggle_openKnock.isChecked;
                            break;

                        case 18:
                            t.cross = this.eb_cross.string;
                            break;

                        case 23:
                            t.relieveWait = this.toggle_tigger.isChecked;
                            break;

                        case 25:
                            t.drop = {
                                range: this.eb_drop_range.string,
                                y: this.eb_drop_y.string,
                                space: this.eb_drop_space.string
                            };
                            break;

                        case 27:
                            var s = this.changePosToData({
                                x: this.part_cx.string,
                                y: this.part_cy.string
                            });
                            t.camera_part = {
                                scale: this.part_cscale.string,
                                x: s.x,
                                y: s.y,
                                _active: this.part_active.isChecked
                            };
                            break;

                        case 29:
                            t.alignLeft = this.toggle_tigger.isChecked;
                            break;

                        case 30:
                            t.att_scale = this.att_scale.string;
                            break;

                        case 34:
                            t.dropOne = {
                                y: this.eb_dropOne_y.string,
                                time: this.eb_dropOne_time.string,
                                interval: this.eb_dropOne_interval.string,
                                pos: this.eb_dropOne_pos.string
                            };
                            break;

                        case 36:
                            var r = "";
                            if ("" != this.eb_soundpos.string) {
                                var c = this.eb_soundpos.string.split("|"), l = this.changePosToData({
                                    x: c[0],
                                    y: 0
                                }), h = this.changePosToData({
                                    x: c[1],
                                    y: 0
                                }), d = this.changePosToData({
                                    x: c[2],
                                    y: 0
                                });
                                r = l.x + "|" + h.x + "|" + d.x;
                            }
                            t.sound = {
                                time: this.eb_soundTime.string,
                                bgm: this.toggle_bgm.isChecked,
                                stop: this.toggle_stop.isChecked,
                                soundpos: r
                            };
                            break;

                        case 38:
                            t.timing = [this.eb_timing_1.string, this.eb_timing_2.string, this.eb_timing_3.string];
                            t.timingFrame = this.eb_timingFrame.string;
                            t.timingDelay = "" == this.eb_timingDelay.string ? 0 : Number(this.eb_timingDelay.string);
                            break;

                        case 42:
                        case 43:
                            t.bubble = {
                                num: this.eb_num.string,
                                times: this.eb_times.string,
                                interval: this.eb_interval.string,
                                pos: this.eb_pos.string
                            };
                            break;

                        case 44:
                            t.drag = {
                                dragX: this.eb_dragX.string,
                                range: this.eb_dragRange.string,
                                time: this.eb_dragTime.string,
                                dragRight: this.toggle_dragRight.isChecked
                            };
                            break;

                        case 47:
                            t.black = {
                                times: this.black_times.string
                            };
                    }
                } else {
                    var p = "" == this.eb_ai_xmin.string ? null : Number(this.eb_ai_xmin.string) - this.editManager.gameWidth / 2, u = "" == this.eb_ai_xmax.string ? null : Number(this.eb_ai_xmax.string) - this.editManager.gameWidth / 2;
                    t = {
                        index: this.eventIndex,
                        key: this.eventKey,
                        xmin: p,
                        xmax: u,
                        range: Number(this.eb_ai_range.string),
                        space: Number(this.eb_ai_space.string),
                        initRight: this.toggle_ai_right.isChecked,
                        special: this.editBox_special.string,
                        ani: this.ani_editbox.string,
                        reverse: this.toggle_reverse.isChecked,
                        lamp: this.not_editbox.string
                    };
                }
                return t;
            };
            e.prototype.changePosToData = function (t) {
                var e = null, o = null;
                "" != t.x && (e = Number(t.x) - this.editManager.gameWidth / 2);
                "" != t.y && (o = -(Number(t.y) - this.editManager.gameHeight / 2));
                return {
                    x: e,
                    y: o
                };
            };
            e.prototype.moveUp = function () {
                this.editManager.moveUpEvent(this.node);
            };
            e.prototype.delObj = function () {
                this.node.destroy();
            };
            a([l(cc.Label)], e.prototype, "lb_id", void 0);
            a([l(cc.Label)], e.prototype, "lb_explain", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_param", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_specialParam", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_next", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_trigger", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_loop", void 0);
            a([l(cc.EditBox)], e.prototype, "att_scale", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_last", void 0);
            a([l(cc.Node)], e.prototype, "node_move", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_x", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_y", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_time", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_op", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_unflip", void 0);
            a([l(cc.Label)], e.prototype, "txt_param", void 0);
            a([l(cc.Label)], e.prototype, "txt_specialParam", void 0);
            a([l(cc.Label)], e.prototype, "txt_toggle", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_op", void 0);
            a([l(cc.Node)], e.prototype, "node_camera", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_cx", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_cy", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_ctime", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_cscale", void 0);
            a([l(cc.ToggleContainer)], e.prototype, "tc_cmod", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_cunlock", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_aniTime", void 0);
            a([l(cc.Node)], e.prototype, "node_cameraPart", void 0);
            a([l(cc.EditBox)], e.prototype, "part_cx", void 0);
            a([l(cc.EditBox)], e.prototype, "part_cy", void 0);
            a([l(cc.EditBox)], e.prototype, "part_cscale", void 0);
            a([l(cc.Toggle)], e.prototype, "part_active", void 0);
            a([l(cc.Node)], e.prototype, "node_ladder", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_ladder", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_jump", void 0);
            a([l(cc.Node)], e.prototype, "node_door", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_doorx", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_doory", void 0);
            a([l(cc.Node)], e.prototype, "node_drop", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_drop_range", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_drop_y", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_drop_space", void 0);
            a([l(cc.Node)], e.prototype, "node_dropOne", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dropOne_y", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dropOne_time", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dropOne_interval", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dropOne_pos", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_delay", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_limit", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_limitTigger", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_cross", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_openKnock", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_hide", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_tigger", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_wait", void 0);
            a([l(cc.Label)], e.prototype, "txt_ex", void 0);
            a([l(cc.Node)], e.prototype, "txt_DAni", void 0);
            a([l(cc.Node)], e.prototype, "node_bottom", void 0);
            a([l(cc.Node)], e.prototype, "node_top", void 0);
            a([l(cc.Node)], e.prototype, "node_ai", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_ai_xmin", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_ai_xmax", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_ai_range", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_ai_space", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_ai_right", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_reverse", void 0);
            a([l(cc.EditBox)], e.prototype, "not_editbox", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_delguide", void 0);
            a([l(cc.EditBox)], e.prototype, "editBox_special", void 0);
            a([l(cc.EditBox)], e.prototype, "ani_editbox", void 0);
            a([l(cc.Node)], e.prototype, "node_flip", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_flipLeft", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_flipRight", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_dirLeft", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_timing_1", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_timing_2", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_timing_3", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_timingFrame", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_timingDelay", void 0);
            a([l(cc.Node)], e.prototype, "node_sound", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_bgm", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_stop", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_soundTime", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_soundpos", void 0);
            a([l(cc.Node)], e.prototype, "node_drag", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dragRange", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dragTime", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_dragX", void 0);
            a([l(cc.Toggle)], e.prototype, "toggle_dragRight", void 0);
            a([l(cc.Node)], e.prototype, "node_bubble", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_num", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_times", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_interval", void 0);
            a([l(cc.EditBox)], e.prototype, "eb_pos", void 0);
            a([l(cc.Node)], e.prototype, "node_black", void 0);
            a([l(cc.EditBox)], e.prototype, "black_times", void 0);
            return a([c], e);
        }(cc.Component);
        o.default = h;
