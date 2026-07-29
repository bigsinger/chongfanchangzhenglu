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
        var s = require("./GameState"), r = require("./AudioManager"), c = require("./GameUtilities"), l = require("./SpineAnimationManager"), h = require("./GameplayEventController"), d = cc._decorator, p = d.ccclass, u = d.property, m = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.m_goods = null;
                e.m_path = "role1";
                e.isRight = !0;
                e.m_scale = 1;
                e.hero_state = s.default.STATE_NORMAL;
                e.drag_x = 0;
                e.jumpRight = !1;
                e.ladderTop = 0;
                e.ladderBottom = 0;
                e.stopDir = null;
                e.lockDir = null;
                e.controlDir = null;
                e.moveDir = null;
                e.targetX = null;
                e.targetY = null;
                e.ske_run = null;
                e.node_run = null;
                e.spine_guide = null;
                e.node_tips = null;
                e.label_tips = null;
                e.node_sprite = null;
                e.goCount = 20;
                e.goMod = "walk";
                e.goSpeed = s.default.SPEED_WALK;
                e.goWay = s.default.HERO_WALk;
                e.turnType = 0;
                e.goType = 0;
                e.groundType = 0;
                e.followMap = {};
                e.isDrop = !1;
                e.goOrRunTime = 1;
                e.m_isGo = !1;
                e.m_footstepSound = "";
                e.node_mount = null;
                return e;
            }
            e.prototype.start = function () {
                var t = this;
                this.node.addComponent(l.default);
                this.m_dragonBones = this.node.getComponent(l.default);
                console.log("-------- hero m_path 2 ", this.m_path);
                this.m_dragonBones.m_specialParm = !0;
                this.m_dragonBones.initData(this.node_mount, "await", this.m_path, this.aniComplete.bind(this), 0, 1, function () {
                    if (t.m_goods) {
                        if (t.goods && "3" == t.goods.isthrow) {
                            t.hero_state = s.default.STATE_LOAD;
                            t.setPlay("pail_await");
                        }
                        t.setGoods(t.m_goods);
                    }
                    var e = t.heroConf.heroface;
                    e && "" != e && t.setSwitchHead(e);
                });
                this.schedule(this.moveAct, 0);
            };
            e.prototype.setControl = function (t) {
                if (t) {
                    this.initMoveData();
                    this.schedule(this.moveAct, 0);
                } else this.unschedule(this.moveAct);
            };
            e.prototype.initHero = function (t, e, o) {
                void 0 === o && (o = null);
                this.heroConf = t;
                var i = t.heroAni || "ani02";
                if (!i) return console.log("initHero==参数错误");
                this.setWalkingMode(t.heroGo);
                this.m_collider = this.node.getComponent(cc.PhysicsCircleCollider);
                this.m_body = this.node.getComponent(cc.RigidBody);
                console.log("-------- hero m_path 1 ", i);
                this.m_path = i;
                this.m_state = e;
                this.m_scale = t.sx || 1;
                this.node_mount.scaleX = h.default.tempHeroLeft ? -this.m_scale : t.initLeft ? -this.m_scale : this.m_scale;
                h.default.tempHeroLeft = !1;
                this.node_mount.scaleY = this.m_scale;
                this.setState(s.default.HERO_STANDBY);
                o && (this.m_goods = o);
                var n = t.color;
                console.log("------------- hero color " + n);
                if (n && "" != n) {
                    var a = n.split("|");
                    this.dColor = [];
                    for (var r = 0, c = a; r < c.length; r++) {
                        var l = c[r];
                        this.dColor.push(Number(l));
                    }
                    this.node_mount.color = cc.color(this.dColor[0], this.dColor[1], this.dColor[2]);
                }
            };
            e.prototype.setInitDir = function (t) {
                this.heroConf.initLeft = t;
            };
            e.prototype.getTempConf = function () {
                console.log("--------- 获取英雄当前配置数据 ", this.heroConf);
                return this.heroConf;
            };
            e.prototype.setPlay = function (t, e, o) {
                void 0 === e && (e = null);
                void 0 === o && (o = null);
                if (this.node_mount && this.node_mount.active && this.m_dragonBones && this.m_dragonBones.m_skeleton && t) {
                    if ("reach" == t) {
                        this.setSwitchSolt(0);
                        this.setHand();
                    } else {
                        this.setHand(1);
                        this.setSwitchSolt();
                    }
                    this.m_dragonBones.setAction(t, e, o || 1);
                    // Several legacy turn timelines set before/centre/after to
                    // null. Spine keeps that slot state when the next animation
                    // has no attachment timeline, so the hero can retain the
                    // carrying pose while the bucket/box disappears. Reapply
                    // the held prop after each normal animation switch.
                    if (this.m_goods && "3" == this.m_goods.isthrow && "splash_await" != t) {
                        this.setSwitchLoad(this.m_goods);
                    }
                } else console.log("setPlay==参数错误");
            };
            e.prototype.setState = function (t, e) {
                var o = this;
                void 0 === e && (e = null);
                this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                if (t != this.m_state) {
                    this.m_state = t;
                    this.ske_run.timeScale = 0;
                    this.ske_run.node.active = !1;
                    this.node_run.active = !1;
                    switch (t) {
                        case s.default.HERO_TURN:
                            1 == this.goType || 2 == this.goType ? this.setPlay("walk_z1", 1) : this.m_isGo ? "run" == this.goMod ? this.setPlay("run_z1", 1) : this.setPlay("walk_z1", 1) : this.setPlay("await_z1", 1);
                            break;

                        case s.default.HERO_TURN2:
                            1 == this.goType || 2 == this.goType ? this.setPlay("walk_z2", 1) : this.m_isGo ? "run" == this.goMod ? this.setPlay("run_z2", 1) : this.setPlay("walk_z2", 1) : this.setPlay("await_z2", 1);
                            break;

                        case s.default.HERO_BZ:
                            this.goods && "3" == this.goods.isthrow ? this.setPlay("pail_run_w", 1) : this.setPlay("run_w", 1);
                            break;

                        case s.default.HERO_START:
                            "walk" == this.goMod || 1 == this.goType ? this.goods && "3" == this.goods.isthrow ? this.setPlay("pail_walk_at", 1) : this.setPlay("walk_at", 1) : "run" == this.goMod ? this.goods && "3" == this.goods.isthrow ? "20" == this.goods.id ? this.setPlay("pail_run_at", 1) : this.setPlay("pail_walk_at", 1) : this.setPlay("run_at", 1) : "squat" == this.goMod ? this.setPlay("qianxing_hd", 1) : "shield" == this.goMod && (this.goods && "3" == this.goods.isthrow ? this.setPlay("pailface_walk_at", 1) : this.setPlay("bkface_walk_at", 1));
                            break;

                        case s.default.HERO_END:
                            "walk" == this.goMod || 1 == this.goType ? this.goods && "3" == this.goods.isthrow ? this.setPlay("pail_walk_at2", 1) : this.setPlay("walk_at2", 1) : "run" == this.goMod ? this.goods && "3" == this.goods.isthrow ? "20" == this.goods.number || "25" == this.goods.number ? this.setPlay("pail_run_at2", 1) : this.setPlay("pail_walk_at2", 1) : this.setPlay("run_at2", 1) : "squat" == this.goMod ? this.setPlay("qianxing_hd2", 1) : "shield" == this.goMod && (this.goods && "3" == this.goods.isthrow ? this.setPlay("pailface_walk_at2", 1) : this.setPlay("bkface_walk_at2", 1));
                            break;

                        case s.default.HERO_STANDBY:
                            "squat" == this.goMod ? this.setPlay("qianxing_d") : "shield" == this.goMod ? this.goods && "3" == this.goods.isthrow ? this.setPlay("pailface_await") : this.setPlay("bkface_await") : this.goods && "3" == this.goods.isthrow ? this.setPlay("pail_await") : this.setPlay("await");
                            break;

                        case s.default.HERO_UP:
                            this.setPlay("panpa", 1);
                            break;

                        case s.default.HERO_PICKUP:
                            this.setPlay("pail_pickup", 1);
                            break;

                        case s.default.HERO_SHIELD:
                            this.goods && "3" == this.goods.isthrow ? this.setPlay("pailface_walk") : this.setPlay("bkface_walk");
                            break;

                        case s.default.HERO_FALL:
                            this.setPlay("xiadun", 1);
                            break;

                        case s.default.HERO_WALk:
                            "shield" == this.goMod ? this.goods && "3" == this.goods.isthrow ? this.setPlay("pailface_walk") : this.setPlay("bkface_walk") : this.goods && "3" == this.goods.isthrow ? this.setPlay("pail_walk") : this.setPlay("walk");
                            this.goOrRunTime = .5;
                            break;

                        case s.default.HERO_RUN:
                            var i = void 0;
                            if (this.goods && "3" == this.goods.isthrow) if ("20" == this.goods.number || "25" == this.goods.number) {
                                this.setPlay("pail_run");
                                i = !0;
                            } else this.setPlay("pail_walk"); else {
                                i = !0;
                                this.setPlay("run");
                            }
                            if (!i) break;
                            this.node_run.scaleX = this.node_mount.scaleX;
                            this.goOrRunTime = 1;
                            this.ske_run.timeScale = 1;
                            this.ske_run.setAnimation(0, "runeffect_1", !0);
                            this.ske_run.node.active = !0;
                            this.node_run.active = !0;
                            break;

                        case s.default.HERO_ATT:
                            var n = "gongji", a = c.default.mt_rand(0, 2);
                            a > 0 && (n += a);
                            this.setPlay(n, 1);
                            break;

                        case s.default.HERO_PICK:
                            this.setPlay("shiqu", 1);
                            break;

                        case s.default.HERO_INTERACT:
                            this.setPlay("shengqi_hd", 1);
                            break;

                        case s.default.HERO_HANDLE:
                            this.setPlay("hudong_hd", 1);
                            break;

                        case s.default.HERO_LADDER1:
                            console.log("----------- param", e);
                            this.setPlay(e ? "climb_down_at2" : "climb_up_at", 1);
                            e && this.node.runAction(cc.sequence(cc.moveBy(.2, cc.v2(0, this.ladderBottom - this.node.y)), cc.callFunc(function () {
                                o.setEntity(!0);
                                o.switchState(s.default.STATE_NORMAL);
                                o.setState(s.default.HERO_STANDBY);
                                console.log("--------------- GameData.HERO_LADDER1");
                            })));
                            break;

                        case s.default.HERO_LADDER2:
                            this.setPlay(e ? "climb_up" : "climb_down");
                            break;

                        case s.default.HERO_LADDER3:
                            this.setPlay(e ? "climb_down_at" : "climb_up_at2", 1);
                            if (!e) {
                                var r = this.isRight ? 80 : -80, l = cc.moveBy(.35, cc.v2(r, this.ladderTop - this.node.y + 5));
                                this.node.runAction(cc.sequence(cc.delayTime(.15), l, cc.callFunc(function () {
                                    o.switchState(s.default.STATE_NORMAL);
                                    o.setState(s.default.HERO_STANDBY);
                                    o.setEntity(!0);
                                    o.m_body.linearVelocity = cc.v2(o.isRight ? 10 : -10, 0);
                                })));
                            }
                            break;

                        case s.default.HERO_TOUZI:
                            this.goWay == s.default.HERO_DOWN ? this.setPlay("qianxing_touzhi", 0) : this.setPlay("touzhi", 0);
                            this.setHand();
                            this.setSwitchSolt(0);
                            break;

                        case s.default.HERO_CLIMB1:
                            this.setPlay("panpa", 1);
                            break;

                        case s.default.HERO_CLIMB2:
                            this.setPlay("panpa_2", 1);
                            break;

                        case s.default.HERO_TOUZI2:
                            this.m_aniCompleteBack = e;
                            if (this.goWay == s.default.HERO_DOWN) this.setPlay("qianxing_touzhi2", 1); else {
                                console.log("==touzhi2=0000=");
                                this.setPlay("touzhi2", 1);
                            }
                            this.scheduleOnce(function () {
                                o.m_aniCompleteBack && o.m_aniCompleteBack();
                                o.setHand(1);
                            }, .13);
                            break;

                        case s.default.HERO_SHENGQI:
                            this.setPlay("shengqi");
                            break;

                        case s.default.HERO_DRAG:
                            this.setPlay(e ? "hudong_f" : "hudong");
                            break;

                        case s.default.HERO_DOOR:
                            this.setPlay("kaimen", 1);
                            break;

                        case s.default.HERO_DEATH:
                            this.setPlay("die", 1);
                            break;

                        case s.default.HERO_BOATING:
                            this.setPlay("huachuan", 0);
                            break;

                        case s.default.HERO_DOWN:
                            this.setPlay("qianxing");
                            break;

                        case s.default.HERO_DOWN_G:
                            this.setPlay("pail_put");
                            break;

                        case s.default.HERO_LOAD:
                            this.setPlay("pail_walk");
                            break;

                        case s.default.HERO_LOAD_K:
                            this.setPlay("pail_run");
                            break;

                        case s.default.HERO_GETWATER:
                            this.setPlay("getwater_await", 1);
                            break;

                        case s.default.HERO_WATERING:
                            this.setPlay("splash_await", 1);
                            break;

                        case s.default.HERO_SHIELD_LOAD:
                            this.setPlay("pailface_walk");
                            break;

                        case s.default.HERO_PAIL_PUT:
                            this.setPlay("pail_put", 1);
                            break;

                        case s.default.HERO_DRAG_NPC:
                            this.setPlay("drag_walk");
                    }
                }
            };
            Object.defineProperty(e.prototype, "heroState", {
                get: function () {
                    return this.hero_state;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.alignPos = function (t, e, o, i, n) {
                var a = this;
                void 0 === o && (o = null);
                void 0 === i && (i = "walk");
                void 0 === n && (n = !1);
                if (!n) {
                    this.isRight = t.x >= this.node.x;
                    this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                }
                if (null != i && Math.abs(t.x - this.node.x) > 5) {
                    this.setState(s.default.HERO_WALk);
                    this.setFootstepSound(!0);
                }
                var r = null != o ? o : Math.abs(t.x - this.node.x) / 200;
                this.node.runAction(cc.sequence(cc.moveTo(r, cc.v2(t.x, t.y)), cc.callFunc(function () {
                    a.setFootstepSound(!1);
                    a.setState(s.default.HERO_STANDBY);
                    e && e();
                })));
            };
            e.prototype.switchState = function (t, e) {
                void 0 === e && (e = !1);
                if (e) {
                    if (this.hero_state == t) {
                        switch (t) {
                            case s.default.STATE_DRAG:
                                if (this.item_drag) {
                                    var o = this.item_drag.getComponent(cc.RigidBody);
                                    o.type = cc.RigidBodyType.Static;
                                    console.log("--- Relieve DRAG ", o);
                                    this.item_drag = null;
                                    this.drag_x = 0;
                                    h.default.recoveryOp(!0);
                                }
                        }
                        this.setState(s.default.HERO_STANDBY);
                        this.hero_state = s.default.STATE_NORMAL;
                    }
                } else this.hero_state = t;
            };
            e.prototype.setDragItem = function (t) {
                t.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                this.isRight = t.x > this.node.x;
                this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                this.item_drag = t;
                this.drag_x = this.item_drag.x;
                this.goCount = 10;
                this.switchState(s.default.STATE_DRAG);
                this.setState(s.default.HERO_HANDLE);
            };
            e.prototype.setBrightness = function (t) {
                void 0 === t && (t = null);
                if (t) {
                    t < 0 ? t = 0 : t > 255 && (t = 255);
                    this.node_mount.color = cc.color(t, t, t);
                } else this.dColor ? this.node_mount.color = cc.color(this.dColor[0], this.dColor[1], this.dColor[2]) : this.node_mount.color = cc.color(255, 255, 255);
            };
            e.prototype.setFootstepSound = function (t) {
                var e = t ? "run" == this.goMod && this.hero_state != s.default.STATE_LOAD ? "footsteps-run" : "footsteps-walk" : "";
                if (e == this.m_footstepSound) return;
                this.m_footstepSound && r.default.gameStopSound(this.m_footstepSound);
                this.m_footstepSound = e;
                e && r.default.playSound(e, !0, "footsteps-run" == e ? .42 : .36);
            };
            e.prototype.initMoveData = function () {
                this.setFootstepSound(!1);
                this.targetX = null;
                this.turnType = 0;
                this.goType = 0;
                this.m_isGo = !1;
                this.goCount = 12;
            };
            e.prototype.initAllState = function (t) {
                var e = this;
                void 0 === t && (t = !1);
                this.initMoveData();
                this.hero_state == s.default.STATE_DRAG ? setTimeout(function () {
                    e.switchState(s.default.STATE_DRAG, !0);
                }, 5) : this.hero_state != s.default.STATE_NORMAL && this.hero_state != s.default.STATE_LOAD || t || this.setState(s.default.HERO_STANDBY);
            };
            e.prototype.stopMove = function () {
                if (this.hero_state == s.default.STATE_NORMAL || this.hero_state == s.default.STATE_LOAD) if ("squat" == this.goMod || "shield" == this.goMod) {
                    this.goCount = 0;
                    this.setState(s.default.HERO_STANDBY);
                } else this.setState(s.default.HERO_END);
                this.initMoveData();
                this.m_body.linearVelocity = cc.v2(0, 0);
                if (this.hero_state == s.default.STATE_DRAG) {
                    if (this.item_drag) {
                        this.m_dragonBones.stopAction();
                        this.m_state = null;
                    }
                } else if (this.hero_state == s.default.EMBARK) {
                    this.setPlay("huachuan_d", 1);
                    this.m_state = s.default.HERO_STANDBY;
                }
            };
            e.prototype.remind = function () {
                console.log("------------------ remind hero !!");
                this.m_body.linearVelocity = cc.v2(0, -1);
            };
            e.prototype.moveAct = function () {
                this.heroState == s.default.STATE_LADDER ? this.moveLadder() : this.move();
            };
            e.prototype.moveLadder = function () {
                if (null != this.targetY) if (this.node.y >= this.ladderTop - 180) {
                    this.setState(s.default.HERO_LADDER3);
                    this.targetY = null;
                } else if (this.node.y <= this.ladderBottom + 1) {
                    this.setState(s.default.HERO_LADDER1, !0);
                    this.targetY = null;
                } else {
                    var t = this.node.y + 120;
                    if (Math.abs(this.targetY - t) <= 3) {
                        this.targetY = null;
                        this.stopMoveLadder();
                    } else if (this.targetY > t) {
                        this.setState(s.default.HERO_LADDER2, !0);
                        this.node.y += 2;
                    } else if (this.targetY < t) {
                        this.setState(s.default.HERO_LADDER2, !1);
                        this.node.y -= 2;
                    }
                }
            };
            e.prototype.posMove = function (t, e) {
                if (this.heroState != s.default.STATE_LADDER) {
                    if (!(this.turnType > 0)) {
                        if (this.isRight && t < this.node.x || !this.isRight && t > this.node.x) {
                            this.goCount = 0;
                            "walk" != this.goMod && "run" != this.goMod || this.hero_state == s.default.STATE_LOAD ? this.hero_state == s.default.STATE_LOAD && (this.node_run.scaleX = -this.node_run.scaleX) : this.turnType = 1;
                        }
                        this.targetX = t;
                        Math.abs(this.targetX - this.node.x) <= 10 ? this.stopMove() : this.checkMove();
                    }
                } else {
                    this.targetY = e;
                    console.log("----- this.targetY ", this.targetY);
                }
            };
            e.prototype.setMove = function (t) {
                this.controlDir = t;
            };
            e.prototype.checkMove = function (t) {
                void 0 === t && (t = !1);
                var e = Math.abs(this.targetX - this.node.x);
                "run" == this.goMod && (e < 150 && e > 18 ? 0 != this.goCount || t ? this.goType = 1 : this.goType = 2 : this.goType = 0);
            };
            e.prototype.move = function () {
                if (null != this.targetX) if (Math.abs(this.targetX - this.node.x) <= 10) this.stopMove(); else {
                    var t = this.targetX >= this.node.x;
                    if (t != this.stopDir) if (this.hero_state == s.default.STATE_NORMAL || this.hero_state == s.default.EMBARK || this.hero_state == s.default.STATE_LOAD) {
                        this.turnType || ("right" == this.lockDir ? this.isRight = !0 : "left" == this.lockDir ? this.isRight = !1 : this.isRight = t);
                        var e;
                        this.turnType ? 1 == this.turnType ? e = s.default.HERO_TURN : 2 == this.turnType && (e = s.default.HERO_TURN2) : e = this.goCount <= 0 ? 2 == this.goType ? s.default.HERO_BZ : 1 == this.goType ? s.default.HERO_WALk : this.goWay : s.default.HERO_START;
                        if (this.hero_state == s.default.EMBARK && this.m_carrier) {
                            var o = this.m_specialSpeed ? this.m_specialSpeed : this.goSpeed;
                            this.node.x += t ? o : -o;
                            this.m_carrier.x = this.node.x;
                            this.setState(s.default.HERO_BOATING);
                        } else {
                            var i = this.turnType > 0 ? 0 : 1 == this.goType || 2 == this.goType ? s.default.SPEED_WALK : this.goSpeed;
                            if (this.hero_state == s.default.STATE_LOAD) {
                                i = s.default.SPEED_LOAD_K;
                                if (this.goods) if (21 == Number(this.goods.id)) {
                                    i = s.default.SPEED_LOAD;
                                    if ("shield" == this.goMod) {
                                        i = this.goSpeed;
                                        this.node.x += t ? i : -i;
                                    } else this.node.x += t ? i : -i;
                                } else {
                                    i = s.default.SPEED_LOAD_K;
                                    if ("shield" == this.goMod) {
                                        i = this.goSpeed;
                                        this.node.x += t ? i : -i;
                                    } else this.node.x += t ? i : -i;
                                }
                            } else this.node.x += t ? i : -i;
                            this.setState(e);
                        }
                        this.m_isGo = !0;
                        this.setFootstepSound(!0);
                    } else if (this.hero_state == s.default.STATE_DRAG) {
                        i = t ? s.default.SPEED_DRAG : -s.default.SPEED_DRAG;
                        t && this.item_drag.x > this.node.x || !t && this.item_drag.x < this.node.x ? this.setState(s.default.HERO_DRAG) : this.setState(s.default.HERO_DRAG, !0);
                        this.node.x += i;
                        this.item_drag.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -1);
                        this.item_drag.x += i;
                        this.setFootstepSound(!0);
                        this.goCount--;
                        if (this.goCount <= 0) if (Math.abs(this.item_drag.x - this.drag_x) < s.default.SPEED_DRAG - .1) this.switchState(s.default.STATE_DRAG, !0); else {
                            this.drag_x = this.item_drag.x;
                            this.goCount = 10;
                        }
                    }
                }
            };
            e.prototype.setStopDir = function (t) {
                this.stopDir = t;
            };
            Object.defineProperty(e.prototype, "heroDir", {
                get: function () {
                    return this.isRight;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.setLockDir = function (t) {
                this.lockDir = t;
            };
            e.prototype.aniComplete = function (t) {
                switch (t) {
                    case "run":
                        this.checkMove();
                        break;

                    case "run_w":
                    case "pail_run_w":
                        this.goType = 1;
                        break;

                    case "run_z1":
                    case "await_z1":
                    case "walk_z1":
                        this.isRight = !this.isRight;
                        this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                        this.turnType = 2;
                        break;

                    case "run_z2":
                    case "await_z2":
                    case "walk_z2":
                        this.turnType = 0;
                        this.goType = 0;
                        this.checkMove(!0);
                        break;

                    case "kaimen":
                    case "walk_at2":
                    case "run_at2":
                    case "pail_walk_at2":
                    case "pail_run_at2":
                    case "bkface_walk_at2":
                    case "pailface_walk_at2":
                    case "reach":
                        this.setState(s.default.HERO_STANDBY);
                        break;

                    case "die":
                        this.setDeath(1);
                        break;

                    case "walk_at":
                    case "run_at":
                    case "qianxing_hd":
                    case "pail_run_at":
                    case "pail_walk_at":
                    case "bkface_walk_at":
                    case "pailface_walk_at":
                    case "bkface_await_at":
                        this.goCount = 0;
                        break;

                    case "huachuan_hd":
                    case "huachuan_hd2":
                        h.default.gameManager.gameOperate = !1;
                }
                this.m_goods && "3" == this.m_goods.isthrow && "splash_await" != t && this.setSwitchLoad(this.m_goods);
            };
            e.prototype.setWalkingMode = function (t) {
                this.goMod = t;
                if ("squat" == t) {
                    this.goSpeed = s.default.SPEED_SQUAT;
                    this.goWay = s.default.HERO_DOWN;
                    this.setBrightness(170);
                } else if ("walk" == t) {
                    this.goSpeed = s.default.SPEED_WALK;
                    this.goWay = s.default.HERO_WALk;
                    this.setBrightness();
                } else if ("run" == t) {
                    this.goSpeed = s.default.SPEED_RUN;
                    this.goWay = s.default.HERO_RUN;
                    this.setBrightness();
                } else if ("shield" == t) {
                    this.goSpeed = s.default.SPEED_SHIELD;
                    this.goWay = s.default.HERO_SHIELD;
                }
            };
            Object.defineProperty(e.prototype, "walkingMode", {
                get: function () {
                    return this.goMod;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.isEntity = function () {
                return 0 == this.m_collider.sensor;
            };
            e.prototype.setEntity = function (t) {
                if (t) {
                    console.log("----------------- gravityScale 8");
                    this.m_body.gravityScale = 8;
                } else this.m_body.gravityScale = 0;
                this.m_collider.sensor = !t;
                this.m_collider.apply();
            };
            e.prototype.ladderAct = function (t, e, o, i, n, a) {
                this.jumpRight = e;
                this.ladderTop = n;
                this.ladderBottom = a;
                this.switchState(s.default.STATE_LADDER);
                this.setEntity(!1);
                h.default.isGround = !1;
                this.node.x = o ? t + 50 : t - 50;
                this.isRight = !o;
                if (i) {
                    this.node.y = a + 2;
                    this.setState(s.default.HERO_LADDER1);
                } else {
                    this.node.runAction(cc.moveBy(.35, cc.v2(0, -182)));
                    this.setState(s.default.HERO_LADDER3, !0);
                }
            };
            e.prototype.stopMoveLadder = function () {
                if (this.hero_state == s.default.STATE_LADDER && this.m_state == s.default.HERO_LADDER2) {
                    this.m_dragonBones.stopAction();
                    this.m_state = null;
                }
            };
            Object.defineProperty(e.prototype, "ladderState", {
                get: function () {
                    return this.hero_state == s.default.STATE_LADDER;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.interactAct = function () {
                if (this.hero_state == s.default.STATE_OP) {
                    this.switchState(s.default.STATE_NORMAL);
                    this.setState(s.default.HERO_STANDBY);
                } else {
                    this.switchState(s.default.STATE_OP);
                    this.isRight = !0;
                    this.setState(s.default.HERO_INTERACT);
                }
                return this.hero_state == s.default.STATE_OP;
            };
            e.prototype.squatAct = function (t) {
                var e = this;
                void 0 === t && (t = null);
                this.setState(s.default.HERO_FALL);
                this.node.runAction(cc.sequence(cc.delayTime(.3), cc.callFunc(function () {
                    e.setState(s.default.HERO_STANDBY);
                    t && t();
                })));
            };
            e.prototype.attAct = function (t, e) {
                var o = this;
                void 0 === e && (e = null);
                if (this.m_state != s.default.HERO_ATT) {
                    this.isRight = t > this.node.x;
                    this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                    this.setState(s.default.HERO_ATT);
                    this.scheduleOnce(function () {
                        c.default.createPrefab("throw/attCircle", function (t) {
                            if (null != t) {
                                t.y = 150;
                                o.node.addChild(t);
                                o.node.runAction(cc.sequence(cc.callFunc(function () {
                                    t.getComponent(cc.RigidBody).linearVelocity = {
                                        x: o.isRight ? 320 : -320,
                                        y: 0
                                    };
                                }), cc.delayTime(.3), cc.callFunc(function () {
                                    t.removeFromParent();
                                    o.setState(s.default.HERO_STANDBY);
                                    e && e();
                                })));
                            }
                        });
                    }, .2);
                }
            };
            e.prototype.setHeroScale = function (t) {
                this.m_scale = Number(t);
                this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                this.node_mount.scaleY = this.m_scale;
            };
            e.prototype.setDir = function (t) {
                this.isRight = t;
                this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
            };
            e.prototype.dragAct = function (t, e, o) {
                var i = this;
                this.setDir(!e.dragRight);
                this.setState(s.default.HERO_DRAG_NPC);
                var n = Number(e.time), a = e.dragRight ? Number(e.range) : -Number(e.range);
                t.runAction(cc.moveBy(n, cc.v2(a, 0)));
                this.node.runAction(cc.sequence(cc.moveBy(n, cc.v2(a, 0)), cc.callFunc(function () {
                    i.setState(s.default.HERO_STANDBY);
                    o && o();
                })));
            };
            e.prototype.climbAct = function (t, e) {
                var o = this;
                this.isRight = t.x > this.node.x;
                var i = {
                    x: this.node.x + (this.isRight ? 100 : -100),
                    y: t.y
                }, n = cc.moveTo(.1, cc.v2(this.node.x + (this.isRight ? 10 : -10), t.y - 85)), a = cc.moveTo(.2, cc.v2(i.x, i.y + 10));
                this.setEntity(!1);
                h.default.isGround = !1;
                this.setState(s.default.HERO_CLIMB1);
                this.node_mount.scaleX = this.isRight ? this.m_scale : -this.m_scale;
                this.node.runAction(cc.sequence(n, cc.delayTime(.3), cc.callFunc(function () {
                    o.node_mount.scaleX = o.isRight ? o.m_scale : -o.m_scale;
                    o.setState(s.default.HERO_CLIMB2);
                }), a, cc.callFunc(function () {
                    o.node_mount.scaleX = o.isRight ? o.m_scale : -o.m_scale;
                    o.setState(s.default.HERO_STANDBY);
                    o.setEntity(!0);
                    o.m_body.linearVelocity = cc.v2(o.isRight ? 5 : -5, 0);
                    e && e();
                })));
            };
            e.prototype.pickAct = function (t, e, o) {
                var i = this;
                void 0 === o && (o = !1);
                2 != t.isthrow && (this.m_goods = t);
                var n = .33;
                o ? n = .05 : this.setState(s.default.HERO_PICK);
                r.default.playSound("pick.mp3");
                this.node.runAction(cc.sequence(cc.delayTime(n), cc.callFunc(function () {
                    2 != t.isthrow && i.setGoods(t);
                    i.setState(s.default.HERO_STANDBY);
                    e && e();
                })));
            };
            e.prototype.pickedUp = function (t, e) {
                var o = this;
                3 == t.isthrow && (this.m_goods = t);
                this.setState(s.default.HERO_PICKUP);
                this.node.runAction(cc.sequence(cc.delayTime(.33), cc.callFunc(function () {
                    3 == t.isthrow && o.setGoods(t);
                    o.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                        o.hero_state = s.default.STATE_LOAD;
                        o.setState(s.default.HERO_STANDBY);
                        if (e) {
                            console.log("==抱起动作=完成=");
                            e();
                        }
                    })));
                })));
            };
            e.prototype.getWater = function (t) {
                var e = this;
                this.setState(s.default.HERO_GETWATER);
                this.node.runAction(cc.sequence(cc.delayTime(.46), cc.callFunc(function () {
                    e.setGoods(s.default.goodsConf.prop21);
                    e.node.runAction(cc.sequence(cc.delayTime(1.01), cc.callFunc(function () {
                        e.hero_state = s.default.STATE_LOAD;
                        e.setState(s.default.HERO_STANDBY);
                        t && t();
                    })));
                })));
            };
            e.prototype.waterRing = function (t) {
                var e = this;
                this.setState(s.default.HERO_WATERING);
                this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                    e.setGoods(s.default.goodsConf.prop20);
                    e.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                        e.hero_state = s.default.STATE_LOAD;
                        e.setState(s.default.HERO_STANDBY);
                        t && t();
                    })));
                })));
            };
            e.prototype.pail_put = function (t) {
                var e = this;
                this.setState(s.default.HERO_PAIL_PUT);
                this.node.runAction(cc.sequence(cc.delayTime(.53), cc.callFunc(function () {
                    e.setGoods(null);
                    t && t();
                    e.node.runAction(cc.sequence(cc.delayTime(.8), cc.callFunc(function () {
                        e.hero_state = s.default.STATE_NORMAL;
                        e.setState(s.default.HERO_STANDBY);
                        h.default.gameManager.gameOperate = !1;
                    })));
                })));
            };
            e.prototype.setRoleGoods = function () {
                return this.clearTaskGoods();
            };
            e.prototype.clearTaskGoods = function () {
                if (!this.goods) return !1;
                if (3 == this.goods.isthrow) {
                    this.hero_state = s.default.STATE_NORMAL;
                    this.m_state = null;
                    this.setGoods(null);
                    this.setState(s.default.HERO_STANDBY);
                } else this.setGoods(null);
                return !0;
            };
            e.prototype.squatSwitch = function (t, e) {
                var o = this;
                "squat" == t ? this.setPlay("qianxing_hd", 1) : this.setPlay("qianxing_hd2", 1);
                this.node.runAction(cc.sequence(cc.delayTime(.3), cc.callFunc(function () {
                    o.setState(s.default.HERO_STANDBY);
                    e && e();
                })));
            };
            e.prototype.setGoods = function (t) {
                var e;
                this.m_goods && 3 == this.m_goods.isthrow && (e = this.m_goods);
                this.m_goods = t;
                this.m_goods ? 3 == this.m_goods.isthrow ? this.setSwitchLoad(this.m_goods) : this.setSwitchSolt() : e ? this.setSwitchLoad(e) : this.setSwitchSolt();
                console.log("---- 获得物品 " + t);
                h.default.setItemboxTips();
            };
            Object.defineProperty(e.prototype, "goods", {
                get: function () {
                    return this.m_goods;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.addDragonBones = function (t) {
                var e = this;
                if (t != this.m_path) if (this.node_mount.getComponent(sp.Skeleton)) {
                    this.m_path = t;
                    this.node_mount.removeComponent(sp.Skeleton);
                    this.node.getComponent(l.default) && this.node.removeComponent(l.default);
                    this.scheduleOnce(function () {
                        e.m_dragonBones = e.node.addComponent(l.default);
                        e.m_dragonBones.initData(e.node_mount, "await", e.m_path, e.aniComplete.bind(e), 0, 1, function () {
                            e.m_goods && e.setGoods(e.m_goods);
                        });
                    }, .1);
                } else console.log("==未挂载龙骨=请检查=");
            };
            e.prototype.setSwitchLoad = function (t) {
                var e = this.goods ? 1 : 0;
                this.m_dragonBones.switchLoad(t, 0 != e);
            };
            e.prototype.setSwitchSolt = function (t) {
                void 0 === t && (t = 1);
                var e = this.m_goods ? this.m_goods.id : 0;
                e = t ? e : 0;
                this.m_dragonBones.switchSolt(Number(e));
            };
            e.prototype.setHand = function (t) {
                void 0 === t && (t = 0);
                var e = this.m_goods ? this.m_goods.id : 0;
                t && (e = 0);
                this.m_dragonBones.switchHand(Number(e));
            };
            e.prototype.setGoodsBlink = function () {
                var t = this, e = new sp.spine.Color(220, 0, 100, 255);
                new sp.spine.Color(255, 255, 255, 255);
                this.m_dragonBones.setSlotColor(e);
                this.scheduleOnce(function () {
                    t.m_dragonBones.setSlotColor();
                }, .9);
            };
            e.prototype.setSwitchHead = function (t) {
                this.m_dragonBones.switchHead(t);
            };
            e.prototype.onBeginContact = function (t, e, o) {
                h.default.checkCollision(o);
            };
            e.prototype.onEndContact = function (t, e, o) {
                h.default.leaveCollision(o);
            };
            e.prototype.addDialog = function (t) {
                var e = this;
                if (this.node_dialog) {
                    this.node_dialog.getComponent("SpeechBubble").initData(t);
                    c.default.fadeAct(this.node_dialog);
                } else c.default.createPrefab("item/dialog", function (o) {
                    o.y = 330 * e.m_scale;
                    o.x = -10;
                    o.getComponent("SpeechBubble").initData(t);
                    e.node_dialog = o;
                    e.node.addChild(o);
                    c.default.fadeAct(e.node_dialog);
                });
            };
            e.prototype.setDrop = function (t) {
                this.isDrop = t;
                this.isDrop && this.initAllState();
            };
            Object.defineProperty(e.prototype, "heroDrop", {
                get: function () {
                    return this.isDrop;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.onDestroy = function () {
                this.m_isGo = !1;
                this.unscheduleAllCallbacks();
            };
            e.prototype.setDeath = function (t) {
                var e = this;
                void 0 === t && (t = 0);
                this.node.stopAllActions();
                this.hero_state = s.default.KNOCK_DOWN;
                this.node.removeComponent(cc.PhysicsCircleCollider);
                this.node.removeComponent(cc.RigidBody);
                if (t) {
                    this.stopMove();
                    this.scheduleOnce(function () {
                        if (e.node_mount.getComponent(sp.Skeleton)) {
                            e.node_mount.removeComponent(sp.Skeleton);
                            e.node.getComponent(l.default) && e.node.removeComponent(l.default);
                        }
                        h.default.gameManager.restartGameDeath();
                    }, .8);
                } else {
                    this.stopMove();
                    this.setState(s.default.HERO_DEATH);
                }
            };
            e.prototype.setCarrier = function (t, e) {
                var o = this;
                void 0 === e && (e = null);
                this.m_carrier = t;
                if (this.hero_state == s.default.EMBARK) {
                    this.m_specialSpeed = null;
                    h.default.gameManager.gameOperate = !0;
                    this.alignPos({
                        x: t.x,
                        y: t.y
                    }, function () {
                        o.setPlay("huachuan_hd2", 1);
                        o.hero_state = s.default.STATE_NORMAL;
                    });
                } else {
                    h.default.gameManager.gameOperate = !0;
                    this.m_specialSpeed = Number(e);
                    this.alignPos({
                        x: t.x,
                        y: t.y
                    }, function () {
                        o.setPlay("huachuan_hd", 1);
                        o.hero_state = s.default.EMBARK;
                    });
                }
            };
            e.prototype.addFollow = function (t, e) {
                this.followMap[t.index] = {
                    conf: t,
                    y: e - this.node.y
                };
            };
            e.prototype.delFollow = function (t) {
                this.followMap[t] && (this.followMap[t] = null);
            };
            e.prototype.switchGround = function (t) {
                var e = Number(t.groundtype);
                if (this.groundType != e) {
                    this.groundType = e;
                    console.log("------- 当前地面信息 ", t);
                }
            };
            e.prototype.setGuideAction = function (t) {
                void 0 === t && (t = !1);
                if (t) this.spine_guide.node.active = !1; else {
                    this.spine_guide.node.active = !0;
                    this.spine_guide.setAnimation(0, "presspull1", !0);
                }
            };
            e.prototype.setRoleTips = function (t, e, o, i) {
                var n = this;
                void 0 === e && (e = null);
                void 0 === o && (o = "");
                void 0 === i && (i = null);
                this.node_tips.active = t;
                this.node_tips.stopAllActions();
                this.node_tips.statr = 1;
                var a = this.node_tips.getChildByName("node_spine");
                a.active = !1;
                this.node_sprite.node.active = !1;
                this.label_tips.node.active = !1;
                if (t) {
                    this.m_eventData = {};
                    if (i) {
                        for (var s in i) this.m_eventData[s] = "pos" == s ? i[s] : Number(i[s]);
                        var r = this.m_eventData.pos.split("|");
                        this.node_tips.x = r[0];
                        this.node_tips.y = r[1];
                    }
                    if (this.node_tips.active) if ("label" == e) {
                        this.label_tips.node.active = !0;
                        this.label_tips.string = o.txt;
                        if (0 == this.m_eventData.num && 0 == this.m_eventData.times && 0 == this.m_eventData.interval) this.node_tips.active = !0; else {
                            this.node_tips.statr = this.m_eventData.num ? 0 : -1;
                            this.setNodeAction();
                        }
                    } else if ("img" == e) {
                        c.default.setSpriteFrame(this.node_sprite, o);
                        this.node_sprite.node.active = !0;
                        this.scheduleOnce(function () {
                            n.node_tips.active = !1;
                            n.node_sprite.node.active = !1;
                        }, 2);
                    } else if ("ani" == e) {
                        a.active = !0;
                        a.addComponent(l.default);
                        var h = a.getComponent(l.default);
                        h.m_specialParm = !0;
                        h.initData(a, "slidepress1", o, this.aniComplete.bind(this), 0, 1, function () { });
                        this.scheduleOnce(function () {
                            n.node_tips.active = !1;
                            a.removeComponent(sp.Skeleton);
                            a.removeComponent(l.default);
                            a.active = !1;
                        }, 2);
                    }
                }
            };
            e.prototype.setNodeAction = function () {
                var t = this;
                if (1 != this.node_tips.statr) {
                    this.node_tips.active = !0;
                    this.node_tips.runAction(cc.sequence(cc.delayTime(this.m_eventData.times), cc.callFunc(function () {
                        t.node_tips.active = !1;
                        if (-1 != t.node_tips.statr) {
                            t.m_eventData.num--;
                            if (t.m_eventData.num <= 0) {
                                t.node_tips.stopAllActions();
                                return;
                            }
                        }
                        t.scheduleOnce(function () {
                            t.setNodeAction();
                        }, t.m_eventData.interval);
                    })));
                }
            };
            e.prototype.changeSound = function (t, e, o) {
                void 0 === o && (o = !1);
                if (o) this.unschedule(this.changeVol); else {
                    this.m_soundId = t;
                    this.m_posAry = e;
                    this.changeVol();
                    this.schedule(this.changeVol, .2);
                }
            };
            e.prototype.changeVol = function () {
                var t = (Math.abs(this.node.x - this.m_posAry[1]) / (this.m_posAry[2] - this.m_posAry[1])).toFixed(1);
                var e = 1 - Number(t) < .1 ? .1 : 1 - Number(t);
                // Distance is quantized to tenths, so most 200 ms updates do
                // not change the mix. Avoid a native audio call and log write
                // until the effective volume actually changes.
                if (this.m_soundVal === e) return;
                this.m_soundVal = e;
                r.default.setSoundVolume(this.m_soundId, this.m_soundVal);
            };
            e.prototype.onDisable = function () {
                this.setFootstepSound(!1);
            };
            e.prototype.onDestroy = function () {
                this.setFootstepSound(!1);
            };
            a([u(sp.Skeleton)], e.prototype, "ske_run", void 0);
            a([u(cc.Node)], e.prototype, "node_run", void 0);
            a([u(sp.Skeleton)], e.prototype, "spine_guide", void 0);
            a([u(cc.Node)], e.prototype, "node_tips", void 0);
            a([u(cc.Label)], e.prototype, "label_tips", void 0);
            a([u(cc.Sprite)], e.prototype, "node_sprite", void 0);
            a([u(cc.Node)], e.prototype, "node_mount", void 0);
            return a([p], e);
        }(cc.Component);
        o.default = m;
