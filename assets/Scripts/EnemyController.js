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
        var s = require("./GameState"), r = require("./GameUtilities"), c = require("./GameplayEventController"), l = cc._decorator, h = l.ccclass, d = (l.property,
            function (t) {
                n(e, t);
                function e() {
                    var e = null !== t && t.apply(this, arguments) || this;
                    e.m_bulletNum = 0;
                    e.m_nodeX = 0;
                    e.m_bulletIndex = 0;
                    e.m_CheckOk = !0;
                    e.isDeath = !1;
                    e.isExAct = !1;
                    e.dzTable = {
                        0: {
                            daiji: {
                                name1: "daiji"
                            },
                            zoulu: {
                                name1: "zoulu"
                            },
                            death: {
                                name1: "death"
                            },
                            over: {
                                name1: "over"
                            }
                        },
                        1: {
                            daiji: {
                                name1: "daiji2"
                            },
                            zoulu: {
                                name1: "zoulu2"
                            },
                            death: {
                                name1: "death1"
                            },
                            over: {
                                name1: "over1"
                            }
                        },
                        2: {
                            death: {
                                name1: "death2"
                            },
                            over: {
                                name1: "over2"
                            }
                        }
                    };
                    e.m_flyy = 300;
                    e.m_nowAngle = 0;
                    return e;
                }
                e.prototype.start = function () { };
                e.prototype.initData = function (t, e, o, i) {
                    console.log("enemy ai init ", t);
                    this.aiData = t;
                    this.aiType = e;
                    this.node_ani = o;
                    this.node_ani.scaleX = t.initRight ? Math.abs(this.node_ani.scaleX) : -Math.abs(this.node_ani.scaleX);
                    this.isRight = t.initRight;
                    this.node_ts = i;
                    this.range = t.range;
                    var n = (t.space + "").split("|");
                    this.m_spceTime = n[0];
                    this.m_standbyTime = n[1] || 2;
                    this.speed_walk = (t.xmax - t.xmin) / Number(this.m_spceTime);
                    this.targetX = t.xmin;
                    this.aiState = s.default.AI_NORMAL;
                    this.m_trenchesPos = [];
                    this.m_aniOder = t.ani;
                    var a;
                    a = "" != this.m_aniOder && this.m_aniOder && "0" != this.m_aniOder ? this.m_aniOder : "0";
                    this.m_dzMap = this.dzTable[a];
                    this.m_reverse = t.reverse;
                    this.initAction();
                };
                e.prototype.deathCall = function () {
                    this.isDeath = !0;
                    this.m_CheckOk = !1;
                    this.unscheduleAllCallbacks();
                    this.node.stopAllActions();
                };
                e.prototype.inductionCall = function (t, e, o) {
                    var i = this;
                    void 0 === o && (o = !1);
                    if ((!this.isExAct || 1001 == this.aiType) && t == s.default.CO_EMP) {
                        this.isExAct = !0;
                        this.node.stopAllActions();
                        this.isRight = e.x >= this.node.x;
                        this.node_ani.scaleX = this.isRight ? Math.abs(this.node_ani.scaleX) : -Math.abs(this.node_ani.scaleX);
                        var n, a, r = this.aiData.xmax && "" != this.aiData.xmax ? this.speed_walk : 100;
                        if (1 == e.getComponent("GrenadeCrate").m_goods.id) {
                            this.node_ts.playAni({
                                name1: "shoujing3"
                            }, 0);
                            this.scheduleOnce(function () {
                                n = e.x >= i.node.x ? i.node.x - 300 : i.node.x + 300;
                                a = Math.abs(n - i.node.x) / (5.5 * i.speed_walk);
                                i.node.runAction(cc.sequence(cc.callFunc(function () {
                                    i.isRight = n >= i.node.x;
                                    i.node_ani.scaleX = i.isRight ? Math.abs(i.node_ani.scaleX) : -Math.abs(i.node_ani.scaleX);
                                    i.node_ts.playAni({
                                        name1: "benpao"
                                    }, -1);
                                }), cc.moveTo(a, cc.v2(n, i.node.y)), cc.callFunc(function () {
                                    i.node_ts.playAni({
                                        name1: "pudao"
                                    }, 0);
                                }), cc.delayTime(2.5), cc.callFunc(function () {
                                    i.backAction();
                                })));
                            }, 1);
                        } else if (o) {
                            this.node_ts.playAni({
                                name1: "shoujing1"
                            }, 0);
                            this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                                i.node_ts.playAni({
                                    name1: "zuoyouhuanshi"
                                }, 0);
                            }), cc.delayTime(3), cc.callFunc(function () {
                                i.backAction();
                            })));
                        } else {
                            n = e.x >= this.node.x ? e.x - 35 : e.x + 35;
                            a = Math.abs(e.x - this.node.x) / r;
                            this.node_ts.playAni({
                                name1: "shoujing2"
                            }, 0);
                            this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                                i.node_ts.playAni(i.m_dzMap.zoulu, -1);
                            }), cc.moveTo(a, cc.v2(n, this.node.y)), cc.callFunc(function () {
                                i.node_ts.playAni({
                                    name1: "wangyao"
                                }, 0);
                            }), cc.delayTime(3), cc.callFunc(function () {
                                i.backAction();
                            })));
                        }
                    }
                };
                e.prototype.backAction = function () {
                    var t = this;
                    this.isExAct = !1;
                    if (this.aiData.xmax && "" != this.aiData.xmax) this.backPatrol(); else {
                        var e = this.node_ts.itemConf.x;
                        this.isRight = e >= this.node.x;
                        this.node_ani.scaleX = this.isRight ? Math.abs(this.node_ani.scaleX) : -Math.abs(this.node_ani.scaleX);
                        var o = Math.abs(e - this.node.x) / 100;
                        this.node_ts.playAni(this.m_dzMap.zoulu, -1);
                        this.node.runAction(cc.sequence(cc.moveTo(o, cc.v2(e, this.node.y)), cc.callFunc(function () {
                            t.isRight = t.aiData.initRight;
                            t.node_ani.scaleX = t.isRight ? Math.abs(t.node_ani.scaleX) : -Math.abs(t.node_ani.scaleX);
                            t.node_ts.playAni(t.m_dzMap.daiji, -1);
                        })));
                    }
                };
                e.prototype.initAction = function () {
                    var t = this;
                    switch (this.aiType) {
                        case 1001:
                            var e = new cc.Node(), o = e.addComponent(cc.RigidBody);
                            o.type = cc.RigidBodyType.Dynamic;
                            o.gravityScale = 0;
                            var i = this.node.addComponent(cc.PhysicsBoxCollider);
                            i.size.width = 260;
                            i.size.height = 220;
                            i.sensor = !0;
                            i.tag = s.default.CO_SHOWATT;
                            i.apply();
                            this.node.addChild(e);
                            var n = new cc.Node(), a = n.addComponent(cc.RigidBody);
                            a.type = cc.RigidBodyType.Dynamic;
                            a.gravityScale = 0;
                            a.enabledContactListener = !0;
                            var r = this.node.addComponent(cc.PhysicsBoxCollider);
                            r.size.width = 500;
                            r.size.height = 40;
                            r.sensor = !0;
                            r.offset.y = -60;
                            r.tag = s.default.CO_INDUCTION;
                            r.apply();
                            this.node.addChild(n);
                            this.aiData.xmax && "" != this.aiData.xmax ? this.backPatrol() : this.scheduleOnce(function () {
                                t.node_ts.playAni(t.m_dzMap.daiji, -1);
                            }, 1);
                            this.schedule(this.checkHero, .5);
                            break;

                        case 1002:
                            Number(this.m_spceTime) > 0 && this.setActive(Number(this.m_spceTime));
                            break;

                        case 1003:
                            this.m_bulletNum = 50 * Math.floor(this.aiData.range / 500);
                            this.m_bulletNum = 50;
                            this.m_nodeX = this.node.x - 400;
                            "" != this.aiData.special && (this.m_trenchesPos = this.aiData.special.split(","));
                            this.moveBullet();
                            this.scheduleOnce(function () {
                                t.node_ts.playAni("gongji", -1);
                            }, 2);
                            break;

                        case 1004:
                        case 1006:
                            this.setLamplight();
                            break;

                        case 1005:
                            this.scheduleOnce(function () {
                                t.setSentry();
                            }, 4);
                            this.schedule(this.checkHero, .5);
                    }
                };
                e.prototype.setSentry = function () {
                    var t = this;
                    if (this.node_ts.lock) this.scheduleOnce(function () {
                        t.setSentry();
                    }, Number(this.m_spceTime)); else if (this.m_CheckOk) {
                        this.node_ts.playAni("gongji1", 0);
                        this.m_CheckOk = !1;
                        this.scheduleOnce(function () {
                            t.setSentry();
                        }, Number(this.m_spceTime));
                    } else {
                        this.node_ts.playAni("gongji2", 0);
                        this.node.runAction(cc.sequence(cc.delayTime(this.m_standbyTime), cc.callFunc(function () {
                            t.node_ts.playAni("daiji", -1);
                            t.m_CheckOk = !0;
                            t.scheduleOnce(function () {
                                t.setSentry();
                            }, Number(t.m_spceTime));
                        })));
                    }
                };
                e.prototype.checkHero = function () {
                    switch (this.aiType) {
                        case 1001:
                            var t = c.default.hero, e = c.default.hero_ts;
                            if (Math.abs(t.y + 60 - this.node.y) < 100 && "squat" != e.walkingMode && (this.isRight && t.x > this.node.x || !this.isRight && t.x < this.node.x) && Math.abs(t.x - this.node.x) < this.range) {
                                console.log("--------- catch hero !!!");
                                c.default.deathEvent(s.default.CO_DEATH);
                                this.unscheduleAllCallbacks();
                                this.node.stopAllActions();
                            }
                            break;

                        case 1005:
                            var o = c.default.hero;
                            if ((!this.aiData.xmax || "" == this.aiData.xmax) && this.m_CheckOk && (this.isRight && o.x > this.node.x - 110 || !this.isRight && o.x < this.node.x + 110) && Math.abs(o.x - this.node.x) < this.range) {
                                console.log("--------- catch _hero !!!");
                                c.default.deathEvent(s.default.CO_DEATH);
                                this.unscheduleAllCallbacks();
                                this.node.stopAllActions();
                            }
                    }
                };
                e.prototype.backPatrol = function () {
                    var t = this;
                    this.isExAct = !1;
                    this.node_ts.playAni(this.m_dzMap.daiji, -1);
                    this.targetX = this.targetX == this.aiData.xmin ? this.aiData.xmax : this.aiData.xmin;
                    var e = Math.abs(this.node.x - this.targetX) / this.speed_walk;
                    this.node.runAction(cc.sequence(cc.delayTime(this.m_standbyTime), cc.callFunc(function () {
                        t.isRight = t.targetX >= t.node.x;
                        t.node_ani.scaleX = t.isRight ? Math.abs(t.node_ani.scaleX) : -Math.abs(t.node_ani.scaleX);
                        t.node_ts.playAni(t.m_dzMap.zoulu, -1);
                    }), cc.moveTo(e, cc.v2(this.targetX, this.node.y)), cc.callFunc(function () {
                        t.backPatrol();
                    })));
                };
                e.prototype.setActive = function (t) {
                    var e = this;
                    this.scheduleOnce(function () {
                        if (e.node.active) e.node.runAction(cc.sequence(cc.fadeOut(.5), cc.callFunc(function () {
                            e.node.active = !1;
                            e.setActive(Number(e.m_spceTime));
                        }))); else {
                            e.node.active = !0;
                            e.node.runAction(cc.sequence(cc.fadeIn(.5), cc.callFunc(function () {
                                e.setActive(Number(e.m_spceTime));
                            })));
                        }
                    }, t);
                };
                e.prototype.moveBullet = function () {
                    var t = this;
                    if (this.node_ts.lock) this.scheduleOnce(function () {
                        t.moveBullet();
                    }, Number(this.m_spceTime)); else {
                        this.m_nodeX -= 35;
                        for (var e in this.m_trenchesPos) {
                            var o = this.m_trenchesPos[e].split("|"), i = Number(o[0]) - r.default.gameNode.width / 2;
                            Number(o[1]), r.default.gameNode.width;
                            if (this.m_nodeX <= Number(o[0]) - r.default.gameNode.width / 2 && this.m_nodeX > Number(o[1]) - r.default.gameNode.width / 2) {
                                this.m_nodeX = Number(o[1]) - r.default.gameNode.width / 2;
                                if (Number(e) >= 1) {
                                    this.m_flyy -= 35;
                                    console.log("once111=", i);
                                }
                            }
                        }
                        this.createBullet(.15 + .002 * this.m_bulletIndex);
                        this.scheduleOnce(function () {
                            if (t.m_bulletNum > 0) t.moveBullet(); else {
                                t.m_flyy = 300;
                                t.m_bulletNum = 50;
                                t.m_nodeX = t.node.x - 400;
                                t.m_bulletIndex = 0;
                                t.m_nowAngle = 0;
                                t.node_ts.playAni("sheji1", 0);
                                t.scheduleOnce(function () {
                                    t.node_ts.playAni("sheji2", -1);
                                    t.scheduleOnce(function () {
                                        t.node_ts.playAni("sheji3", -1);
                                        t.scheduleOnce(function () {
                                            t.node_ts.playAni("gongji", -1);
                                            t.moveBullet();
                                        }, .1);
                                    }, Number(t.m_spceTime));
                                }, .3);
                            }
                        }, .15);
                    }
                };
                e.prototype.createBullet = function (t) {
                    var e = this;
                    r.default.createPrefab("throw/bullet", function (o) {
                        if (o) {
                            o.x = e.node.x - 280;
                            o.y = e.node.y + 132;
                            o.angle = r.default.getAngle({
                                x: o.x,
                                y: o.y
                            }, {
                                x: e.m_nodeX,
                                y: o.y - e.m_flyy
                            });
                            Math.abs(o.angle), e.m_nowAngle;
                            e.m_bulletIndex >= 5 && (o.x -= 90);
                            o.zIndex = e.node.zIndex - 1;
                            e.node.parent.addChild(o);
                            o.runAction(cc.sequence(cc.moveTo(t, cc.v2(e.m_nodeX, o.y - e.m_flyy - 20)), cc.callFunc(function (t) {
                                if (t && t.active) {
                                    t.stopAllActions();
                                    t.removeFromParent();
                                    t.destroy();
                                }
                            })));
                            e.m_bulletNum--;
                            e.m_bulletIndex++;
                        }
                    });
                };
                e.prototype.setLamplight = function () {
                    c.default.gameManager.setLayer_Ex();
                    var t = this.aiData.special.split("|");
                    this.m_lampAry = [];
                    var e = new cc.Node(), o = new cc.Node(), i = new cc.Node(), n = i.addComponent(cc.Sprite);
                    r.default.setSpriteFrame(n, "gk/d3/dg_02");
                    i.x = 1004 == this.aiType ? this.node.x : this.node.x + 50;
                    i.y = 1004 == this.aiType ? this.node.y - 30 : this.node.y - 200;
                    i.opacity = 125;
                    i.scale = .6;
                    i.active = !1;
                    i.zIndex = t[0] || 0;
                    this.node.parent.addChild(i);
                    this.m_lampAry.push(i);
                    var a = e.addComponent(cc.Sprite);
                    r.default.setSpriteFrame(a, "gk/d3/dg_02");
                    e.active = !1;
                    e.x = 1004 == this.aiType ? this.node.x : this.node.x + 170;
                    e.y = 1004 == this.aiType ? this.node.y - 70 : this.node.y - 340;
                    e.scale = .95;
                    e.zIndex = t[1] || this.node.zIndex + 1;
                    this.node.parent.addChild(e);
                    this.m_lampAry.push(e);
                    var l = o.addComponent(cc.Sprite);
                    r.default.setSpriteFrame(l, "gk/d3/dg_01");
                    o.x = 1004 == this.aiType ? this.node.x : this.node.x + 220;
                    o.y = 1004 == this.aiType ? this.node.y - 220 : this.node.y - 540;
                    var h = l.addComponent(cc.RigidBody);
                    h.type = cc.RigidBodyType.Dynamic;
                    h.gravityScale = 0;
                    var d = l.addComponent(cc.PhysicsBoxCollider);
                    d.sensor = !0;
                    d.tag = s.default.CO_DEATH;
                    d.size = new cc.Size(300, 60);
                    d.apply();
                    o.active = !1;
                    o.zIndex = t[2] || 0;
                    this.node.parent.addChild(o);
                    this.m_lampAry.push(o);
                    var p = new cc.Node(), u = p.addComponent(cc.Sprite);
                    r.default.setSpriteFrame(u, "gk/d3/dg_03");
                    p.active = !1;
                    p.x = this.node.x + 180;
                    p.y = 1004 == this.aiType ? this.node.y + 40 : this.node.y - 200;
                    c.default.gameManager.layer_ex.addChild(p);
                    this.m_lampAry.push(p);
                    var m = new cc.Node(), _ = m.addComponent(cc.Sprite);
                    r.default.setSpriteFrame(_, "gk/d3/dg_03");
                    m.active = !1;
                    m.x = this.node.x - 250;
                    m.y = 1004 == this.aiType ? this.node.y + 40 : this.node.y - 200;
                    m.scaleX = -1;
                    c.default.gameManager.layer_ex.addChild(m);
                    this.m_lampAry.push(m);
                    var f = new cc.Node(), g = f.addComponent(cc.Sprite);
                    r.default.setSpriteFrame(g, "gk/d3/dg_role");
                    f.zIndex = this.node.zIndex + 1;
                    f.x = this.node.x + 15;
                    f.y = this.node.y + 30;
                    f.scale = .7;
                    this.node.parent.addChild(f);
                    this.m_lampAry.push(f);
                    if (this.m_reverse) {
                        this.m_lampAry[5].x = this.node.x - 20;
                        this.m_lampAry[5].y = this.node.y + 45;
                        this.moveSoldierReverse();
                    } else this.moveSoldier();
                    this.m_lampAry[5].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.8, .7), cc.delayTime(.25), cc.scaleTo(.8, .6))));
                };
                e.prototype.moveSoldier = function () {
                    var t = this;
                    this.node_ts.playAni(s.default.aniConf.dz24, -1);
                    this.targetX = this.targetX == this.aiData.xmin ? this.aiData.xmax : this.aiData.xmin;
                    this.targetX = this.targetX ? this.targetX : this.node.x;
                    var e = this.speed_walk ? Math.abs(this.node.x - this.targetX) / this.speed_walk : Number(this.m_spceTime);
                    this.node.runAction(cc.sequence(cc.delayTime(this.m_standbyTime), cc.callFunc(function () {
                        if (t.speed_walk) t.isRight = t.targetX >= t.node.x; else {
                            t.node_ts.playAni(s.default.aniConf.dz24, -1);
                            t.isRight = !t.isRight;
                        }
                        if (t.isRight) {
                            t.m_lampAry[5].x = t.node.x + 15;
                            t.m_lampAry[5].y = t.node.y + 45;
                            t.m_lampAry[5].zIndex = t.node.zIndex + 1;
                            t.m_lampAry[3].active = !1;
                            t.m_lampAry[4].active = !1;
                            t.speed_walk && (t.node_ani.scaleX = t.isRight ? Math.abs(t.node_ani.scaleX) : -Math.abs(t.node_ani.scaleX));
                            t.node_ts.node_mount.color = cc.color(255, 255, 255);
                            t.m_lampAry[0].x = 1004 == t.aiType ? t.node.x : t.node.x + 60;
                            t.m_lampAry[0].y = 1004 == t.aiType ? t.node.y - 30 : t.node.y - 200;
                            t.getLampState(0) || (t.m_lampAry[0].active = !0);
                            t.getLampState(1) || (t.m_lampAry[1].active = !0);
                            t.m_lampAry[1].x = 1004 == t.aiType ? t.node.x : t.node.x + 170;
                            t.m_lampAry[1].y = 1004 == t.aiType ? t.node.y - 70 : t.node.y - 340;
                            t.m_lampAry[2].x = 1004 == t.aiType ? t.node.x : t.node.x + 220;
                            t.m_lampAry[2].y = 1004 == t.aiType ? t.node.y - 290 : t.node.y - 540;
                            t.getLampState(2) || (t.m_lampAry[2].active = !0);
                            t.aiData.xmin || t.aiData.xmax ? t.m_lampAry[0].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                t.speed_walk && t.node_ts.playAni(s.default.aniConf.dz33, -1);
                                t.m_lampAry[1].runAction(cc.moveTo(e, cc.v2(t.targetX + 320, t.m_lampAry[1].y)));
                                t.m_lampAry[2].runAction(cc.moveTo(e, cc.v2(t.targetX + 360, t.m_lampAry[2].y)));
                                t.m_lampAry[5].runAction(cc.moveTo(e, cc.v2(t.targetX + 15, t.m_lampAry[5].y)));
                            }), cc.moveTo(e, cc.v2(t.targetX + 130, t.m_lampAry[0].y)))) : t.m_lampAry[0].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                t.speed_walk && t.node_ts.playAni(s.default.aniConf.dz33, -1);
                            })));
                        } else {
                            t.m_lampAry[5].x = t.node.x + 20;
                            t.m_lampAry[5].y = t.node.y + 45;
                            t.m_lampAry[5].zIndex = t.node.zIndex - 1;
                            t.m_lampAry[0].active = !1;
                            t.m_lampAry[1].active = !1;
                            t.m_lampAry[2].active = !1;
                            t.node_ts.node_mount.color = cc.color(0, 0, 0);
                            t.m_lampAry[3].x = t.node.x + 180;
                            t.m_lampAry[3].y = 1004 == t.aiType ? t.node.y + 40 : t.node.y - 160;
                            t.getLampState(3) || (t.m_lampAry[3].active = !0);
                            t.aiData.xmin || t.aiData.xmax ? t.m_lampAry[3].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                if (t.speed_walk) {
                                    t.node_ani.scaleX = t.isRight ? Math.abs(t.node_ani.scaleX) : -Math.abs(t.node_ani.scaleX);
                                    t.node_ts.playAni(s.default.aniConf.dz33, -1);
                                }
                                t.m_lampAry[5].x = t.node.x - 20;
                                t.m_lampAry[3].active = !1;
                                t.m_lampAry[4].x = t.node.x - 180;
                                t.m_lampAry[4].y = t.node.y + 40;
                                t.getLampState(4) || (t.m_lampAry[4].active = !0);
                                t.m_lampAry[4].runAction(cc.moveTo(e, cc.v2(t.targetX - 180, t.m_lampAry[3].y)));
                                t.m_lampAry[5].runAction(cc.moveTo(e, cc.v2(t.targetX - 20, t.m_lampAry[5].y)));
                            }))) : t.m_lampAry[3].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                if (t.speed_walk) {
                                    t.node_ani.scaleX = t.isRight ? Math.abs(t.node_ani.scaleX) : -Math.abs(t.node_ani.scaleX);
                                    t.node_ts.playAni(s.default.aniConf.dz33, -1);
                                }
                                t.m_lampAry[5].x = t.node.x - 20;
                                t.m_lampAry[3].active = !1;
                                t.m_lampAry[4].x = t.node.x - 180;
                                t.m_lampAry[4].y = 1004 == t.aiType ? t.node.y + 40 : t.node.y - 160;
                                t.getLampState(4) || (t.m_lampAry[4].active = !0);
                            })));
                        }
                    }), cc.delayTime(.5), cc.moveTo(e, cc.v2(this.targetX, this.node.y)), cc.callFunc(function () {
                        t.moveSoldier();
                    })));
                };
                e.prototype.moveSoldierReverse = function () {
                    var t = this;
                    this.node_ts.playAni(s.default.aniConf.dz24, -1);
                    this.targetX = this.targetX == this.aiData.xmin ? this.aiData.xmax : this.aiData.xmin;
                    this.targetX = this.targetX ? this.targetX : this.node.x;
                    var e = this.speed_walk ? Math.abs(this.node.x - this.targetX) / this.speed_walk : Number(this.m_spceTime);
                    this.node.runAction(cc.sequence(cc.delayTime(this.m_standbyTime), cc.callFunc(function () {
                        if (t.speed_walk) t.isRight = t.targetX <= t.node.x; else {
                            t.node_ts.playAni(s.default.aniConf.dz24, -1);
                            t.isRight = !t.isRight;
                        }
                        if (t.isRight) {
                            t.m_lampAry[5].x = t.node.x - 20;
                            t.m_lampAry[5].y = t.node.y + 45;
                            t.m_lampAry[5].zIndex = t.node.zIndex + 1;
                            t.m_lampAry[3].active = !1;
                            t.m_lampAry[4].active = !1;
                            t.speed_walk && (t.node_ani.scaleX = t.isRight ? -Math.abs(t.node_ani.scaleX) : Math.abs(t.node_ani.scaleX));
                            t.node_ts.node_mount.color = cc.color(255, 255, 255);
                            t.m_lampAry[0].x = t.node.x;
                            t.m_lampAry[0].y = t.node.y - 40;
                            t.getLampState(0) || (t.m_lampAry[0].active = !0);
                            t.getLampState(1) || (t.m_lampAry[1].active = !0);
                            t.m_lampAry[1].x = t.node.x;
                            t.m_lampAry[1].y = t.node.y - 92;
                            t.m_lampAry[2].x = t.node.x;
                            t.m_lampAry[2].y = t.node.y - 290;
                            t.getLampState(2) || (t.m_lampAry[2].active = !0);
                            t.aiData.xmin || t.aiData.xmax ? t.m_lampAry[0].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                t.speed_walk && t.node_ts.playAni(s.default.aniConf.dz33, -1);
                                t.m_lampAry[1].runAction(cc.moveTo(e, cc.v2(t.targetX - 320, t.m_lampAry[1].y)));
                                t.m_lampAry[2].runAction(cc.moveTo(e, cc.v2(t.targetX - 360, t.m_lampAry[2].y)));
                                t.m_lampAry[5].runAction(cc.moveTo(e, cc.v2(t.targetX - 15, t.m_lampAry[5].y)));
                            }), cc.moveTo(e, cc.v2(t.targetX - 130, t.m_lampAry[0].y)))) : t.m_lampAry[0].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                t.speed_walk && t.node_ts.playAni(s.default.aniConf.dz33, -1);
                            })));
                        } else {
                            t.m_lampAry[5].x = t.node.x + 20;
                            t.m_lampAry[5].y = t.node.y + 45;
                            t.m_lampAry[5].zIndex = t.node.zIndex - 1;
                            t.m_lampAry[0].active = !1;
                            t.m_lampAry[1].active = !1;
                            t.m_lampAry[2].active = !1;
                            t.node_ts.node_mount.color = cc.color(0, 0, 0);
                            t.m_lampAry[3].x = t.node.x - 180;
                            t.m_lampAry[3].y = t.node.y + 40;
                            t.m_lampAry[3].scaleX = -1;
                            t.getLampState(3) || (t.m_lampAry[3].active = !0);
                            t.aiData.xmin || t.aiData.xmax ? t.m_lampAry[3].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                if (t.speed_walk) {
                                    t.node_ani.scaleX = t.isRight ? -Math.abs(t.node_ani.scaleX) : Math.abs(t.node_ani.scaleX);
                                    t.node_ts.playAni(s.default.aniConf.dz33, -1);
                                }
                                t.m_lampAry[3].active = !1;
                                t.m_lampAry[4].x = t.node.x + 180;
                                t.m_lampAry[4].y = t.node.y + 80;
                                t.m_lampAry[4].scaleX = 1;
                                t.getLampState(4) || (t.m_lampAry[4].active = !0);
                                t.m_lampAry[4].runAction(cc.moveTo(e, cc.v2(t.targetX + 180, t.m_lampAry[4].y)));
                                t.m_lampAry[5].runAction(cc.moveTo(e, cc.v2(t.targetX + 20, t.m_lampAry[5].y)));
                            }))) : t.m_lampAry[3].runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function () {
                                if (t.speed_walk) {
                                    t.node_ani.scaleX = t.isRight ? -Math.abs(t.node_ani.scaleX) : Math.abs(t.node_ani.scaleX);
                                    t.node_ts.playAni(s.default.aniConf.dz33, -1);
                                }
                                t.m_lampAry[3].active = !1;
                                t.m_lampAry[4].x = t.node.x + 180;
                                t.m_lampAry[4].y = t.node.y + 80;
                                t.m_lampAry[4].scaleX = 1;
                                t.getLampState(4) || (t.m_lampAry[4].active = !0);
                            })));
                        }
                    }), cc.delayTime(.5), cc.moveTo(e, cc.v2(this.targetX, this.node.y)), cc.callFunc(function () {
                        t.moveSoldierReverse();
                    })));
                };
                e.prototype.getLampState = function (t) {
                    if (!this.aiData.lamp || "" == this.aiData.lamp) return !1;
                    this.m_lampObj || (this.m_lampObj = this.aiData.lamp.split("|"));
                    for (var e in this.m_lampObj) if (t == this.m_lampObj[e] && 0 != t) return !0;
                    return !1;
                };
                e.prototype.onDestroy = function () {
                    this.unscheduleAllCallbacks();
                };
                return a([h], e);
            }(cc.Component));
        o.default = d;
