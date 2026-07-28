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
        var s = require("./GameConfigManager"), r = require("./GameState"), c = require("./AudioManager"), l = require("./DialogManager"), h = require("./DroppedItem"), d = require("./LoopingDropEffect"), p = require("./TimingEvent"), interactionQuery = require("./GameplayInteractionQuery"), u = cc._decorator, m = u.ccclass, _ = (u.property,
            function (t) {
                n(e, t);
                function e() {
                    return null !== t && t.apply(this, arguments) || this;
                }
                o = e;
                e.prototype.start = function () { };
                e.initGameEvent = function (t, e) {
                    this.gameManager && this.gameManager !== t && this.resetTransientState();
                    this.gameManager = t;
                    this.hero = e;
                    this.hero_ts = this.hero ? this.hero.getComponent("PlayerController") : null;
                };
                e.resetTransientState = function () {
                    this.cItem = null;
                    this.interactNode = null;
                    this.itemStack = [];
                    this.blockStack = [];
                    this.blockItem = null;
                    this.isDoor = !1;
                    this.isGround = !0;
                    this.isDrop = !1;
                    this.tempHeroLeft = !1;
                    this.preferredNode = null;
                    this.preferredOperation = null;
                    this.hero = null;
                    this.hero_ts = null;
                };
                e.requestProgressSave = function () {
                    this.gameManager && this.gameManager.requestProgressSave && this.gameManager.requestProgressSave();
                };
                e.remindHero = function () {
                    this.hero_ts.remind();
                };
                e.recoveryOp = function (t) {
                    void 0 === t && (t = !1);
                    (this.gameManager.interact == r.default.OP_ATT || t) && this.gameManager.setInteract(0);
                };
                e.deathEvent = function () {
                    console.log("----------- boom");
                    this.gameManager.changeForceWait(!0);
                    this.gameManager.operateDir = 0;
                    c.default.playSound("kaiqiang.mp3");
                    this.hero_ts.setDeath();
                };
                e.addStack = function (t) {
                    for (var e in this.itemStack) if (this.itemStack[e] == t) {
                        this.selectClosestItem();
                        return;
                    }
                    var o = t.getComponent("InteractiveObject").getOpType();
                    if (o && this.hero_ts.heroState != r.default.STATE_DRAG) {
                        this.itemStack.push(t);
                        this.selectClosestItem();
                    }
                };
                e.selectClosestItem = function (t) {
                    // Some authored blockers stop the hero just outside the
                    // legacy collider of an intended prop (the chapter-3
                    // supply box is about 368 units from the nearest reachable
                    // point, while the chapter-3 newspaper is about 447 units
                    // from the closest saved walk position). Use a slightly
                    // larger manual-operation reach aligned with the
                    // 520-unit navigation/scan radius.
                    // When carrying supplies, a matching task receiver wins
                    // over nearby boxes; distance breaks ties deterministically.
                    var e = interactionQuery.selectClosestOperation({
                        hero: this.hero,
                        heldGoods: this.hero_ts.goods,
                        stack: this.itemStack,
                        nearby: Array.isArray(t) ? t : this.gameManager.itemMap,
                        preferredNode: this.preferredNode,
                        preferredOperation: this.preferredOperation,
                        reachSquared: 520 * 520,
                        resolveComponent: function (t) {
                            return t.getComponent("InteractiveObject");
                        }
                    });
                    // Several legacy props use a small collider centered high
                    // above the walkable ground (for example the rescue shovel
                    // is about 200 units above the hero).  They are visibly in
                    // reach but never enter the physics contact stack in the
                    // migrated runtime. Include nearby map items and keep the
                    // closest valid operation.
                    this.cItem = e.node;
                    e.node ? this.gameManager.setInteract(e.operation) : this.hero_ts.heroState != r.default.STATE_DRAG && this.gameManager.setInteract(0);
                };
                e.outStack = function (t) {
                    var e = !1;
                    for (var o in this.itemStack) if (this.itemStack[o] == t) {
                        this.itemStack.splice(Number(o), 1);
                        e = !0;
                        break;
                    }
                    e && this.selectClosestItem();
                };
                e.cleanStack = function () {
                    this.itemStack = [];
                };
                e.addBlockStack = function (t) {
                    for (var e = 0, o = this.blockStack; e < o.length; e++) if (o[e] == t) return;
                    this.blockStack.push(t);
                };
                e.outBlockStack = function (t) {
                    for (var e in this.blockStack) if (this.blockStack[e] == t) {
                        this.blockStack.splice(Number(e), 1);
                        return;
                    }
                };
                e.checkCollision = function (t) {
                    var e = this, o = t.tag;
                    if (o != r.default.CO_BOOM && o != r.default.CO_DEATH && o != r.default.CO_BULLET) {
                        var i = t.node;
                        if (o != r.default.CO_SHOWATT || "squat" == this.hero_ts.walkingMode) if (this.hero_ts.heroState != r.default.STATE_DRAG && this.hero_ts.heroState != r.default.STATE_LADDER && this.hero_ts.isEntity()) {
                            if (o != r.default.CO_NORMAL && 0 == t.sensor && this.hero_ts.heroState != r.default.STATE_DRAG && i.y > this.hero.y) {
                                this.blockItem = i;
                                this.gameManager.operateDir = 0;
                                this.hero_ts.initAllState();
                                this.hero_ts.setStopDir(i.x > this.hero.x);
                            }
                            if (o == r.default.CO_ITEM) {
                                this.addStack(i);
                                this.triggerEvent(i, 1, 0, !0);
                                var n = i.getComponent("InteractiveObject"), a = n.itemConf.guide;
                                if (a && !n.lock) {
                                    var s = a.split("|"), c = Number(s[0]);
                                    c > 1e3 && c <= 2e3 ? null != n.getEvent() && n.showTopImg(c - 1e3, -1) : c > 2e3 && n.showSpecialGuide(c);
                                }
                                if (0 == t.sensor && n.isClimb && i.y < this.hero.y) {
                                    if (this.isDoor) this.isDoor = !1; else if (this.dropY && this.dropY - this.hero.y > 30) {
                                        this.gameManager.gameOperate = !0;
                                        this.hero_ts.squatAct(function () {
                                            e.gameManager.gameOperate = !1;
                                        });
                                    }
                                    this.isGround = !0;
                                    this.gameManager.setSpecialMode(0);
                                    this.hero_ts.setStopDir(null);
                                }
                            } else if (o > 1e4) {
                                var l = r.default.groundConf[o];
                                l && this.hero_ts.switchGround(l);
                            } else if (o == r.default.CO_NORMAL) {
                                if (this.isDoor) this.isDoor = !1; else if (this.dropY && this.dropY - this.hero.y > 30) {
                                    this.gameManager.gameOperate = !0;
                                    this.hero_ts.squatAct(function () {
                                        e.gameManager.gameOperate = !1;
                                    });
                                }
                                this.isGround = !0;
                            }
                        } else o == r.default.CO_ITEM && this.triggerEvent(i, 1); else {
                            console.log("---------- CO_SHOWATT !!");
                            this.gameManager.setInteract(r.default.OP_ATT);
                        }
                    } else this.deathEvent(o);
                };
                e.leaveCollision = function (t) {
                    if (t.tag != r.default.CO_SHOWATT) {
                        var e = t.node, o = e.getComponent("InteractiveObject");
                        if (t.tag == r.default.CO_ITEM) {
                            o.setBubble(!1, 0, !0);
                            this.checkLeave(e);
                        }
                        if (this.hero_ts.heroState != r.default.STATE_DRAG && this.hero_ts.heroState != r.default.STATE_LADDER && this.hero_ts.isEntity()) {
                            if (this.blockItem == e) {
                                this.hero_ts.setStopDir(null);
                                this.blockItem = null;
                            }
                            if (t.tag == r.default.CO_ITEM) {
                                o.setBubble(!1, 0, !0);
                                e.getComponent("InteractiveObject").hideTopGuide();
                                this.cItem != e || this.cItem.discardIdx || this.cItem.getComponent("InteractiveObject").stopBlink();
                                var i = e.getComponent("InteractiveObject");
                                if (0 == t.sensor && i.isClimb && e.y < this.hero.y) {
                                    this.isGround = !1;
                                    this.dropY = this.hero.y;
                                }
                            } else if (t.tag == r.default.CO_NORMAL) {
                                this.isGround = !1;
                                this.dropY = this.hero.y;
                            }
                        }
                    } else {
                        console.log("---------- leave CO_SHOWATT !!");
                        this.gameManager.setInteract(0);
                    }
                };
                e.checkLeave = function (t) {
                    var e = t.getComponent("InteractiveObject").findEvent(null, "45");
                    e && this.triggerEvent(t, 0, e.index);
                };
                e.setItemboxTips = function () {
                    if (this.cItem && this.cItem.active) {
                        var t = this.cItem.getComponent("InteractiveObject"), e = this.hero_ts.goods ? 0 : 1;
                        e ? t.blinkAct(e) : t.stopBlink();
                    }
                };
                e.analysisEvent = function (t, e) {
                    var o = this;
                    void 0 === e && (e = 4);
                    if (t == r.default.OP_ATT) {
                        this.hero_ts.stopMove();
                        this.gameManager.gameOperate = !0;
                        this.hero_ts.attAct(4 == e ? this.hero.x + 100 : this.hero.x - 100, function () {
                            o.gameManager.gameOperate = !1;
                        });
                    }
                    null != this.cItem && this.triggerEvent(this.cItem, t);
                };
                e.setExpression = function (t, e) {
                    var i;
                    switch (t) {
                        case 1:
                            i = r.default.processConf[e].hintcont;
                            this.hero_ts.setRoleTips(!0, "img", i, {
                                num: 0,
                                times: 0,
                                interval: 0,
                                pos: "56|340"
                            });
                            break;

                        case 3:
                            i = r.default.processConf[e].hintcont;
                            this.hero_ts.setRoleTips(!0, "ani", i, {
                                num: 0,
                                times: 0,
                                interval: 0,
                                pos: "56|340"
                            });
                            break;

                        case 2:
                            var n = r.default.plotConf[r.default.processConf[e].hintcont] || {
                                txt: r.default.processConf[e].hintcont
                            };
                            this.hero_ts.setRoleTips(!0, "label", n, {
                                num: 0,
                                times: 0,
                                interval: 0,
                                pos: "56|340"
                            });
                            this.gameManager.delayHold(2, function () {
                                o.hero_ts.setRoleTips(!1);
                            });
                    }
                };
                e.showRequirementHint = function (t) {
                    var e = this, o = r.default.goodsConf[t], i = this.hero_ts.goods, n = i && r.default.goodsConf[i.nameid], a = o && o.name ? o.name : "指定物品", s = n && n.name ? n.name : i && i.name || "其他物品", c = i ? "需要【" + a + "】\n当前【" + s + "】" : "需要【" + a + "】\n请先找到它";
                    this.hero_ts.setRoleTips(!0, "label", {
                        txt: c
                    }, {
                        num: 0,
                        times: 0,
                        interval: 0,
                        pos: "56|340"
                    });
                    this.gameManager.delayHold(2.6, function () {
                        e.hero_ts.setRoleTips(!1);
                    });
                };
                e.checkTrigger = function (t, e, o, i) {
                    void 0 === o && (o = null);
                    void 0 === i && (i = null);
                    for (var n = 0, a = t; n < a.length; n++) {
                        var s = a[n], c = Number(s), l = !0;
                        if (0 == e) return l;
                        if (1 == c) {
                            if (1 == e) return 1e3;
                        } else if (c > 1 && 1 == e && c != e) return 1;
                        if (c == e) {
                            if (o) {
                                l = !1;
                                if (o.includes("state")) {
                                    var h = o.replace("state", "");
                                    l = Number(h) == this.hero_ts.heroState;
                                } else if (o.includes("prop")) {
                                    var d = this.hero_ts.goods;
                                    if (d && (l = o == d.nameid) && 3 != d.isthrow && "keepgoods" != i) {
                                        this.hero_ts.setGoods(null);
                                        this.gameManager.onRequiredItemDelivered && this.gameManager.onRequiredItemDelivered(o);
                                    }
                                } else "left" == o ? l = !this.hero_ts.heroDir : "right" == o && (l = this.hero_ts.heroDir);
                                l || (r.default.processConf[o] ? this.setExpression(r.default.processConf[o].hintmode, o) : o.includes("prop") ? this.showRequirementHint(o) : console.log("---------------- 配置表找不到提示数据 " + o));
                                l || null == i || "" == i || "keepgoods" == i || this.checkNext(i, 1);
                            }
                            return l;
                        }
                    }
                    return 0;
                };
                e.triggerEvent = function (t, e, o, i) {
                    var n = this;
                    void 0 === o && (o = 0);
                    void 0 === i && (i = !1);
                    var a = t.getComponent("InteractiveObject");
                    if (!a) return console.log("===itemBox=没有脚本");
                    var s = a.getConf();
                    if (1 != a.lock) {
                        if (1 == s.isDrag && this.hero.y < a.getColliderCenter().y && a.isEntity()) {
                            this.cItem = t;
                            a.setBubble(!0, r.default.OP_DRAG);
                            if (e == r.default.OP_DRAG) {
                                this.hero_ts.initMoveData();
                                this.hero_ts.heroState == r.default.STATE_DRAG ? this.hero_ts.switchState(r.default.STATE_DRAG, !0) : this.hero_ts.setDragItem(t);
                                return;
                            }
                        }
                        if (1 == s.isClimb && this.hero.y < a.getColliderCenter().y && a.isEntity()) {
                            console.log("------------ 可攀爬");
                            this.itemStack.push(t);
                            this.cItem = t;
                            this.gameManager.setInteract(r.default.OP_CLIMB);
                            if (e == r.default.OP_CLIMB) {
                                this.gameManager.setInteract(0);
                                this.gameManager.gameOperate = !0;
                                this.gameManager.operateDir = 0;
                                this.hero_ts.stopMove();
                                this.hero_ts.climbAct({
                                    x: t.x,
                                    y: a.getColliderTop()
                                }, function () {
                                    n.gameManager.gameOperate = !1;
                                });
                                this.blockStack = [];
                                return;
                            }
                        }
                        var u = a.getEvent(o);
                        if (null != u) {
                            require("./Logger").default.setContext({
                                event: s.index + "|" + u.index + ":" + u.key
                            });
                            console.log("----------- eventData ", u);
                            var m = u.key, _ = r.default.eventConf[m];
                            if (_) {
                                u.param;
                                var f, g, y = u.specialParam;
                                if (null != this.interactNode && this.interactNode != t) {
                                    g = u.op.split("|");
                                    f = this.checkTrigger(g, e, null);
                                } else this.interactNode == t && (this.interactNode = null);
                                if (f) this.triggerEvent(this.interactNode, 0); else {
                                    g = u.trigger.split("|");
                                    38 == u.key && (w = t.getComponent(p.default)) && w.isTiming && (f = !0);
                                    f || (f = this.checkTrigger(g, e, u.limit, u.limitTigger));
                                    8 == u.key && (t.y > this.hero.y ? a.setPaoPos(null, this.hero.y - t.y + 300) : a.setPaoPos(null, a.getColliderTop(!0) + 30));
                                    if (f) {
                                        var v = a.itemConf.guide;
                                        v && a.setGuideAction(Number(v));
                                        if (i && f < 1e3) {
                                            a.setBubble(!0, g[0]);
                                            return;
                                        }
                                        1e3 == f && a.setBubble(!1);
                                        e > 1 && this.hero_ts.initAllState();
                                        var b = Number(_.result), C = u.param, x = Number(u.last);
                                        if ("initPos" == s.key) {
                                            this.triggerRoleEvent(b, u);
                                            return;
                                        }
                                        a.hideTopGuide();
                                        switch (b) {
                                            case 0:
                                                this.checkNext(C, 1);
                                                break;

                                            case 1:
                                                this.gameManager.setBtnOpacity(0);
                                                this.gameManager.operateDir = 0;
                                                this.gameManager.changeForceWait(!0, u.isHoldDz);
                                                var O = u.next;
                                                this.gameManager.tempCloseUp();
                                                l.default.open("dialog/plotDialog", [C, function () {
                                                    O && "" != O && n.checkNext(O, 1);
                                                    n.gameManager.setBtnOpacity(255);
                                                    n.gameManager.tempCloseUp(!0);
                                                    n.requestProgressSave();
                                                }]);
                                                0 == u.isLoop && a.switchEvent();
                                                return;

                                            case 2:
                                                if (this.gameManager.interact == r.default.OP_ATT) {
                                                    this.gameManager.gameOperate = !0;
                                                    this.hero_ts.attAct(t.x, function () {
                                                        n.gameManager.gameOperate = !1;
                                                    });
                                                }
                                                var D = C;
                                                D && "" != D ? a.playAni(D, Number(u.playTime)) : console.log("---- 动画配置表找不到 " + C + " 此动画");
                                                break;

                                            case 3:
                                                if (this.gameManager.interact == r.default.OP_ATT) {
                                                    this.gameManager.gameOperate = !0;
                                                    this.hero_ts.attAct(t.x, function () {
                                                        n.gameManager.gameOperate = !1;
                                                    });
                                                }
                                                return;

                                            case 4:
                                                this.pickEvent(C, a, u.isNoAct);
                                                break;

                                            case 6:
                                                if (this.hero_ts.heroState != r.default.STATE_OP) {
                                                    this.gameManager.gameOperate = !0;
                                                    this.hero_ts.alignPos({
                                                        x: t.x - this.hero.width / 2 + 20,
                                                        y: this.hero.y
                                                    }, function () {
                                                        n.hero_ts.interactAct();
                                                        n.interactNode = n.gameManager.getTriggerItem(C);
                                                        if (n.interactNode) {
                                                            n.gameManager.setInteract(r.default.OP_RAISE);
                                                            n.gameManager.gameOperate = !1;
                                                        } else {
                                                            console.log("---- 场景内找不到 " + C + " 为key的物件");
                                                            n.interactNode = null;
                                                        }
                                                    });
                                                } else {
                                                    this.hero_ts.interactAct();
                                                    this.gameManager.setInteract(r.default.OP_CONTROL);
                                                    this.interactNode = null;
                                                }
                                                return;

                                            case 7:
                                                var k = u.move, A = {};
                                                if (k.isOp) {
                                                    A.x = null != k.x ? Number(k.x) : 0;
                                                    A.y = null != k.y ? Number(k.y) : 0;
                                                } else {
                                                    (A = this.gameManager.changeEditorPos(k.x, k.y)).x = null != A.x ? A.x : t.x;
                                                    A.y = null != A.y ? A.y : t.y;
                                                }
                                                a.moveAct(A.x, A.y, "" != k.time ? Number(k.time) : 0, k.isOp, k.isUnFlip);
                                                (O = u.next) && "" != O && this.findNext(O);
                                                break;

                                            case 8:
                                                if (this.hero_ts.ladderState) return;
                                                this.gameManager.changeForceWait(!0);
                                                this.hero_ts.stopMove();
                                                var S = u.ladderRight, T = t.y > this.hero.y;
                                                this.hero_ts.alignPos({
                                                    x: S ? T ? t.x + 40 : t.x - 40 : T ? t.x - 40 : t.x + 40,
                                                    y: this.hero.y
                                                }, function () {
                                                    n.hero_ts.ladderAct(t.x, u.jumpRight, S, T, a.getColliderTop(), a.getColliderBottom());
                                                    n.hero_ts.setStopDir(null);
                                                    n.gameManager.changeForceWait(!1);
                                                });
                                                break;

                                            case 9:
                                                this.checkNext(C, 3, u);
                                                break;

                                            case 10:
                                                this.checkNext(C, 2, u);
                                                break;

                                            case 11:
                                                var N = u.camera;
                                                this.gameManager.cameraAct(N, x);
                                                break;

                                            case 12:
                                                this.checkNext(C, 4, u.flipDir);
                                                break;

                                            case 13:
                                                this.tempHeroLeft = u.dirLeft;
                                                this.gameManager.changeMap(C, u.door);
                                                a.setBubble(!1);
                                                break;

                                            case 14:
                                                if (this.gameManager.interact == r.default.OP_ATT) {
                                                    this.gameManager.gameOperate = !0;
                                                    this.hero_ts.attAct(t.x, function () {
                                                        n.gameManager.gameOperate = !1;
                                                    });
                                                } else this.gameManager.interact == r.default.OP_OPEN && this.hero_ts.setDir(t.x > this.hero.x);
                                                a.spriteByState(C);
                                                break;

                                            case 15:
                                                a.setEntity(u.openKnock);
                                                break;

                                            case 16:
                                                this.gameManager.chapterOver(C);
                                                break;

                                            case 17:
                                                this.hero_ts.setWalkingMode(C);
                                                break;

                                            case 18:
                                                this.addCrossEvent({
                                                    cross: Number(u.cross),
                                                    param: C
                                                });
                                                break;

                                            case 19:
                                                this.gameManager.operateDir = 0;
                                                this.gameManager.gameOperate = !0;
                                                O = u.next;
                                                l.default.open("dialog/unlockDialog", [C, function () {
                                                    console.log("==密码匹配成功==");
                                                    a.switchEvent();
                                                    O && "" != O && n.checkNext(O, 1);
                                                    n.requestProgressSave();
                                                }, function () {
                                                    n.gameManager.gameOperate = !1;
                                                }]);
                                                return;

                                            case 20:
                                                a.showTopImg(C, Number(u.playTime));
                                                break;

                                            case 21:
                                                0 == u.isLoop && a.switchEvent();
                                                this.hero_ts.setInitDir(u.dirLeft);
                                                this.gameManager.saveItemConf({
                                                    x: t.x,
                                                    y: t.y
                                                }, this.hero_ts.walkingMode);
                                                this.gameManager.showSave();
                                                break;

                                            case 22:
                                                break;

                                            case 23:
                                                this.gameManager.changeForceWait(!u.relieveWait);
                                                break;

                                            case 24:
                                                this.gameManager.operateDir = 0;
                                                this.gameManager.changeForceWait(!0);
                                                l.default.open("dialog/checkDialog", [C, function () {
                                                    n.gameManager.gameOperate = !1;
                                                }]);
                                                break;

                                            case 25:
                                                var w;
                                                (w = t.addComponent(d.default)).initData(C, u.drop);
                                                break;

                                            case 26:
                                                a.addDragonBones(C);
                                                break;

                                            case 27:
                                                 var P = u.camera_part;
                                                 if (P._active) {
                                                     this.gameManager.camera_part.x = P.x.toFixed(2);
                                                     this.gameManager.camera_part.y = P.y.toFixed(2);
                                                     this.gameManager.camera_part.getComponent(cc.Camera).zoomRatio = Number(P.scale);
                                                     this.gameManager.texture_sp.node.parent.parent.active = !0;
                                                     this.gameManager.setCamera_part();
                                                 } else this.gameManager.texture_sp.node.parent.parent.active = !1;
                                                break;

                                            case 28:
                                                var M = this.gameManager.getTriggerItem(C);
                                                this.hero_ts.setCarrier(M, y);
                                                break;

                                            case 29:
                                                O = u.next;
                                                var E = u.isLoop, R = u.alignLeft, B = 0;
                                                C && "" != C && (B = Number(C));
                                                this.gameManager.changeForceWait(!0);
                                                this.hero_ts.alignPos({
                                                    x: t.x + B,
                                                    y: this.hero.y
                                                }, function () {
                                                    n.hero_ts.setDir(!R);
                                                    0 == E && a.switchEvent();
                                                    O && "" != O && n.checkNext(O, 1);
                                                    n.requestProgressSave();
                                                }, null);
                                                return;

                                            case 30:
                                                var I = C;
                                                "" != I && null != I && a.setItemZIndex(Number(I));
                                                var j = u.att_scale;
                                                "" != j && null != j && a.setItemScale(j);
                                                break;

                                            case 31:
                                                this.hero_ts.setSwitchHead(C);
                                                break;

                                            case 32:
                                                O = u.next;
                                                this.gameManager.changeForceWait(!0);
                                                l.default.open("dialog/cgDialog", [C, function () {
                                                    O && "" != O && n.checkNext(O, 1);
                                                    n.requestProgressSave();
                                                }]);
                                                0 == u.isLoop && a.switchEvent();
                                                return;

                                            case 33:
                                                this.hero_ts.setLockDir(C);
                                                break;

                                            case 34:
                                                t.addComponent(h.default).initData(C, u.dropOne);
                                                break;

                                            case 35:
                                                r.default.storyData[Number(C)] = r.default.story[Number(C) - 1];
                                                r.default.onlinetm = new Date().getTime();
                                                break;

                                            case 36:
                                                var L = C, F = u.sound;
                                                if (F.stop) {
                                                    F.bgm ? c.default.stopBGM() : c.default.gameStopSound(L + ".mp3");
                                                    this.hero_ts.changeSound(L + ".mp3", [], !0);
                                                } else {
                                                    if (F.soundpos) {
                                                        var H = F.soundpos.split("|");
                                                        this.hero_ts.changeSound(L + ".mp3", H);
                                                    }
                                                    if (F.bgm) c.default.gamePlayBGM("gkbg/" + C); else {
                                                        var G = Number(F.time);
                                                        c.default.playSound(L + ".mp3", -1 == G || G > 0);
                                                        G > 0 && this.gameManager.delayHold(G, function () {
                                                            c.default.gameStopSound(L + ".mp3");
                                                        });
                                                    }
                                                }
                                                break;

                                            case 37:
                                                this.gameManager.removeItemData(s.index);
                                                s.index = Number(C);
                                                this.gameManager.addItemData(s.index, t);
                                                this.hero_ts.addFollow(s, t.y);
                                                a.followHero();
                                                break;

                                            case 38:
                                                var z = t.getComponent(p.default);
                                                z || (z = t.addComponent(p.default)).initData(C, a, u.timingFrame, u.timingDelay);
                                                var U = z.checkTiming();
                                                console.log("------------- te_ts r " + U);
                                                switch (U) {
                                                    case 0:
                                                        break;

                                                    case 1:
                                                    case 2:
                                                    case 3:
                                                        a.setPaoSprite(e);
                                                        this.timingResult(u.timing[U - 1], a);
                                                        return;
                                                }
                                                break;

                                            case 39:
                                                this.gameManager.setMasterOpacity(C, y);
                                                break;

                                            case 40:
                                                a.m_baseEventJs.m_next || "" == u.next || (a.m_baseEventJs.m_next = u.next);
                                                if (a.m_baseEventJs.m_analogyHp > 1) {
                                                    a.node_bubble.active = !1;
                                                    this.gameManager.delayHold(.6, function () {
                                                        a.node_bubble.active = !0;
                                                    });
                                                }
                                                a.m_baseEventJs.run();
                                                return;

                                            case 41:
                                                this.gameManager.gameOperate = !0;
                                                this.hero_ts.getWater(function () {
                                                    n.gameManager.gameOperate = !1;
                                                });
                                                break;

                                            case 42:
                                            case 43:
                                                if (0 == Number(C)) 42 == b ? this.hero_ts.setRoleTips(!1) : a.setBoxTips(!1); else {
                                                    var V = C.split("|");
                                                    42 == b ? this.hero_ts.setRoleTips(!0, V[0], r.default.plotConf[V[1]], u.bubble) : a.setBoxTips(!0, V[0], V[1], u.bubble);
                                                }
                                                break;

                                            case 44:
                                                this.gameManager.changeForceWait(!0);
                                                console.log("------------------- 拖拽物件 ");
                                                var X = this.gameManager.getTriggerItem(C), W = u.drag, q = (O = u.next, "" == W.dragX ? 0 : Number(W.dragX));
                                                q = W.dragRight ? q : -q;
                                                this.hero_ts.alignPos({
                                                    x: X.x + q,
                                                    y: this.hero.y
                                                }, function () {
                                                    n.hero_ts.dragAct(X, W, function () {
                                                        O && "" != O && n.checkNext(O, 1);
                                                    });
                                                }, null);
                                                0 == u.isLoop && a.switchEvent();
                                                return;

                                            case 45:
                                                this.checkNext(C, 1);
                                                break;

                                            case 46:
                                                this.gameManager.changeForceWait(!0);
                                                O = u.next;
                                                var Y = u.specialParam;
                                                l.default.open("dialog/answerDialog", [C, function (t) {
                                                    console.log("==答题结束==");
                                                    if (t) {
                                                        a.switchEvent();
                                                        O && "" != O && n.checkNext(O, 1);
                                                    } else Y && "" != Y && n.checkNext(Y, 1);
                                                    n.requestProgressSave();
                                                }]);
                                                return;

                                            case 47:
                                                this.gameManager.changeForceWait(!0);
                                                var K = r.default.plotConf[C], J = u.next;
                                                l.default.open("dialog/blackDialog", [K || {}, function () {
                                                    0 == u.isLoop && a.switchEvent();
                                                    J && "" != J && n.checkNext(J, 1);
                                                    n.requestProgressSave();
                                                }, u.time]);
                                                return;

                                            case 101:
                                                this.gameManager.specialEvent(101);
                                        }
                                        if (0 == u.isLoop) {
                                            a.switchEvent();
                                            e != r.default.OP_TRIGGER && e != r.default.OP_TOUCH && this.gameManager.setInteract(0);
                                            this.requestProgressSave();
                                        }
                                        if (x > 0) {
                                            u.isWait;
                                            this.gameManager.delayHold(x, function () {
                                                u.next && "" != u.next && n.checkNext(u.next, 1);
                                            });
                                        } else u.next && "" != u.next && this.checkNext(u.next, 1);
                                    }
                                }
                            }
                        }
                    }
                };
                e.pickEvent = function (t, e, o) {
                    var i = this;
                    void 0 === o && (o = !1);
                    if (t && "" != t) {
                        var n = r.default.goodsConf[t];
                        if (n) if (this.hero_ts.goods && 2 != n.isthrow) if (n.id == this.hero_ts.goods.id) this.hero_ts.setGoodsBlink(); else {
                            this.gameManager.gameOperate = !0;
                            this.gameManager.instatThrow();
                            3 == n.isthrow ? this.hero_ts.pickedUp(n, function () {
                                i.gameManager.gameOperate = !1;
                            }) : this.hero_ts.pickAct(n, function () {
                                i.gameManager.gameOperate = !1;
                            }, o);
                        } else {
                            this.gameManager.gameOperate = !0;
                            3 == n.isthrow ? this.hero_ts.pickedUp(n, function () {
                                i.gameManager.gameOperate = !1;
                            }) : this.hero_ts.pickAct(n, function () {
                                i.gameManager.gameOperate = !1;
                                if (2 == n.isthrow) {
                                    l.default.open("dialog/pickupDialog", [n]);
                                    if (!r.default.itemData[n.nameid]) {
                                        r.default.itemData[n.nameid] = n;
                                        r.default.onlinetm = new Date().getTime();
                                    }
                                    e.onclear();
                                    i.cItem = null;
                                }
                            }, o);
                        } else console.log("---- 物品配置表找不到 " + t + " 此物品");
                    } else this.hero_ts.setRoleGoods();
                };
                e.timingResult = function (t, e) {
                    t && "" != t && (-1 != t.indexOf("prop") ? this.pickEvent(t, e) : this.checkNext(t, 1));
                };
                e.findNext = function (t) {
                    var e = t.split("|"), o = this.gameManager.getTriggerItem(e[0]);
                    if (o) {
                        var i = o.getComponent("InteractiveObject"), n = i.findEvent(Number(e[1]));
                        if (null != n) {
                            var a = r.default.eventConf[n.key];
                            switch (Number(a.result)) {
                                case 2:
                                    if (-1 == Number(n.playTime)) {
                                        var s = r.default.aniConf[n.param];
                                        s && i.setLastAni(s.name1);
                                    }
                                    break;

                                case 7:
                                    var c = n.move;
                                    if (!c.isOp) {
                                        var l = this.gameManager.changeEditorPos(c.x, c.y), h = null != l.x ? l.x : o.x, d = null != l.y ? l.y : o.y;
                                        i.setLastPos(h, d);
                                    }
                                    break;

                                case 12:
                                    i.setLastDir(n.flipDir);
                            }
                            n.next && "" != n.next && this.findNext(n.next);
                        }
                    }
                };
                e.addCrossEvent = function (t) {
                    this.crossEvent.push(t);
                    s.default.saveCrossData(this.crossEvent);
                };
                e.loadCrossEvent = function () {
                    this.crossEvent = s.default.getCorssData();
                    this.crossEvent || (this.crossEvent = []);
                };
                e.checkCrossEvent = function (t) {
                    if (this.crossEvent) for (var e = 0, o = this.crossEvent; e < o.length; e++) {
                        var i = o[e];
                        t == i.cross && this.checkNext(i.param, 1);
                    }
                };
                e.cleanCrossEvent = function () {
                    this.crossEvent = [];
                };
                e.checkNext = function (t, e, o) {
                    void 0 === o && (o = null);
                    if (t && "" != t && "number" != typeof t) {
                        var i = t.split("|"), n = this.gameManager.getTriggerItem(i[0]);
                        if (n) {
                            var a = n.getComponent("InteractiveObject");
                            switch (e) {
                                case 1:
                                    this.triggerEvent(n, 0, i[1] ? i[1] : 0);
                                    break;

                                case 2:
                                    a.unLock(o.isHide, o.isHideButton);
                                    break;

                                case 3:
                                    if (!a.lock) if (i[1] || o.isDelGuide) {
                                        i[1] && a.delEvent(Number(i[1]));
                                        o.isDelGuide && a.cleanGuide();
                                    } else a.onclear();
                                    break;

                                case 4:
                                    a.flipAct(o);
                                    break;

                                case 5:
                                    a.blinkAct();
                            }
                        } else {
                            this.gameManager.gameOperate = !1;
                            console.log("---- 场景内找不到 " + i[0] + " 为key的物件");
                        }
                    } else {
                        null != this.interactNode && (this.interactNode = null);
                        console.log("==checkNext====");
                        this.gameManager.gameOperate = !1;
                    }
                };
                e.triggerRoleEvent = function (t, e) {
                    var o = this, i = e.param, n = Number(e.last);
                    n > 0 && e.isWait;
                    switch (t) {
                        case 1:
                            var a = r.default.plotConf[i];
                            a ? this.hero_ts.addDialog(a.txt) : console.log("---- 剧情配置表找不到 " + i + " 此对话");
                            break;

                        case 2:
                            var c = i;
                            if (c && "" != c) {
                                var l = Number(e.playTime);
                                this.hero_ts.m_state = null;
                                this.hero_ts.setPlay(c, 0 == l ? 1 : 0);
                            } else console.log("---- 动画配置表找不到 " + i + " 此动画");
                            break;

                        case 7:
                            var h = e.move, d = {};
                            if (h.isOp) {
                                d.x = null != h.x ? Number(h.x) : 0;
                                d.y = null != h.y ? Number(h.y) : 0;
                            } else {
                                (d = this.gameManager.changeEditorPos(h.x, h.y)).x = null != d.x ? d.x : this.hero.x;
                                d.y = null != d.y ? d.y : this.hero.y;
                            }
                            this.hero_ts.alignPos({
                                x: d.x,
                                y: d.y
                            }, function () { }, Number(h.time), null, h.isUnFlip);
                            break;

                        case 12:
                            var p = "right" == e.flipDir;
                            this.hero_ts.setDir(p);
                            break;

                        case 22:
                            this.hero_ts.setBrightness(Number(i));
                            break;

                        case 23:
                            this.gameManager.changeForceWait(!e.relieveWait);
                            break;

                        case 26:
                            this.hero_ts.addDragonBones(i);
                            s.default.saveHeroSpine(i);
                            break;

                        case 30:
                            var u = i;
                            "" != u && null != u && (this.hero.zIndex = Number(u));
                            var m = e.att_scale;
                            "" != m && null != m && this.hero_ts.setHeroScale(m);
                            break;

                        case 35:
                            r.default.storyData[Number(i)] = r.default.story[Number(i) - 1];
                            r.default.onlinetm = new Date().getTime();
                    }
                    n > 0 ? this.gameManager.delayHold(n, function () {
                        console.log("-------------- last call !!!!!!!!");
                        e.next && "" != e.next && o.checkNext(e.next, 1);
                    }) : e.next && "" != e.next && this.checkNext(e.next, 1);
                };
                e.removeItemBox = function (t) {
                    this.gameManager.removeItemData(t);
                };
                var o;
                e.isGround = !0;
                e.isDrop = !1;
                e.cItem = null;
                e.interactNode = null;
                e.lastTime = 0;
                e.lastCallBack = null;
                e.crossEvent = [];
                e.itemStack = [];
                e.blockStack = [];
                e.isDoor = !1;
                e.blockItem = null;
                e.tempHeroLeft = !1;
                return o = a([m], e);
            }(cc.Component));
        o.default = _;
