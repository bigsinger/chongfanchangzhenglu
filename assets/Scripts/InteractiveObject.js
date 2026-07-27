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
        var s = require("./GameState"), r = require("./PopupView"), c = require("./AudioManager"), l = require("./GameUtilities"), h = require("./DragonBonesAnimationManager"), d = require("./SpineAnimationManager"), p = require("./GameplayEventController"), u = require("./EnemyController"), m = require("./LoopingDropEffect"), assetCatalog = require("./AssetCatalog"), _ = cc._decorator, f = _.ccclass, g = _.property, y = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.node_mount = null;
                e.node_bubble = null;
                e.spine_guide = null;
                e.node_tips = null;
                e.label_tips = null;
                e.node_spine = null;
                e.itemConf = null;
                e.eventData = null;
                e.eventArr = null;
                e.hp = 3;
                e.deadNext = "";
                e.attNext = "";
                e.img_top = null;
                e.isTopLast = !1;
                e.img_blink = null;
                e.isEnemy = !1;
                e.isLastPos = !1;
                e.followType = null;
                e.followY = 0;
                e.m_actickIndex = 0;
                return e;
            }
            e.prototype.start = function () {
                this.node_Guide = [];
                // Native cc.Button hit testing on a world-space bubble uses a
                // stale pre-adaptation transform.  Its effective hit box can
                // cover most of the screen (notably the house portal), causing
                // a road tap to activate an interaction that was visibly far
                // away.  gameScene's camera-aware global listener is now the
                // sole dispatcher; disabling Button keeps the sprite visible.
                var t = this.node_bubble && this.node_bubble.getComponent(cc.Button);
                t && (t.enabled = !1);
            };
            e.prototype.unLock = function (t, e) {
                e && (this.node_bubble.active = !1);
                if (t) {
                    this.itemConf.isHide = !0;
                    this.node.active = !1;
                    p.default.remindHero();
                } else {
                    this.itemConf.lockCount--;
                    if (this.itemConf.lockCount <= 0) {
                        this.itemConf.unlock && "" != this.itemConf.unlock && p.default.checkNext(this.itemConf.unlock, 1);
                        if (1 == this.itemConf.isClimb || 1 == this.itemConf.isOb) {
                            this.m_collider.sensor = !1;
                            this.m_collider.friction = .5;
                            this.m_collider.apply();
                        }
                        if (this.itemConf.isHide) {
                            this.itemConf.isHide = !1;
                            this.node.active = !0;
                        }
                        p.default.remindHero();
                    }
                }
            };
            Object.defineProperty(e.prototype, "lock", {
                get: function () {
                    return this.itemConf.lockCount > 0;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.getConf = function () {
                return this.itemConf;
            };
            e.prototype.getTempConf = function () {
                if (!this.isLastPos) {
                    this.itemConf.x = this.node.x;
                    this.itemConf.y = this.node.y;
                }
                return this.itemConf;
            };
            e.prototype.flipAct = function (t) {
                if (t && "left" != t) {
                    this.node_mount.scaleX = Math.abs(this.node_mount.scaleX);
                    this.node_render.scaleX = Math.abs(this.node_render.scaleX);
                } else {
                    this.node_mount.scaleX = -Math.abs(this.node_mount.scaleX);
                    this.node_render.scaleX = -Math.abs(this.node_render.scaleX);
                }
                this.itemConf.sx = this.node_mount.scaleX;
            };
            e.prototype.blinkAct = function (t) {
                void 0 === t && (t = !1);
                if (!this.img_blink) {
                    this.img_blink = new cc.Node();
                    var e = this.img_blink.addComponent(cc.Sprite), o = this.itemConf.url + "-blink";
                    l.default.setSpriteFrame(e, o);
                    this.img_blink.opacity = 0;
                    this.node_render.addChild(this.img_blink);
                }
                this.img_blink.stopAllActions();
                this.img_blink.opacity = 0;
                var i = cc.repeat(cc.sequence(cc.fadeIn(.5), cc.delayTime(.2), cc.fadeOut(.5)), 5);
                if (t) {
                    var n = cc.repeatForever(i);
                    this.img_blink.runAction(n);
                } else this.img_blink.runAction(i);
            };
            e.prototype.stopBlink = function () {
                if (this.img_blink) {
                    this.img_blink.stopAllActions();
                    this.img_blink.opacity = 0;
                }
            };
            e.prototype.delEvent = function (t) {
                if (this.eventArr) for (var e in this.eventArr) if (this.eventArr[e].index == t) {
                    this.eventArr.splice(e, 1);
                    break;
                }
            };
            e.prototype.findEvent = function (t, e) {
                void 0 === t && (t = null);
                void 0 === e && (e = null);
                if (!this.eventArr) return null;
                for (var o = 0, i = this.eventArr; o < i.length; o++) {
                    var n = i[o];
                    if (t) {
                        if (n.index == t && !n.isFinish) return n;
                    } else if (e && n.key == e && !n.isFinish) return n;
                }
                return null;
            };
            e.prototype.setLastPos = function (t, e) {
                this.itemConf.x = t;
                this.itemConf.y = e;
                this.isLastPos = !0;
            };
            e.prototype.setLastAni = function (t) {
                this.itemConf.lastDz = t;
            };
            e.prototype.setLastDir = function (t) {
                this.itemConf.sx = t && "left" != t ? Math.abs(this.node_mount.scaleX) : -Math.abs(this.node_mount.scaleX);
            };
            e.prototype.setEvent = function (t) {
                this.eventArr = t;
            };
            e.prototype.getEvent = function (t) {
                if (!this.eventArr) return null;
                for (var e = 0, o = this.eventArr; e < o.length; e++) {
                    var i = o[e];
                    if (t) {
                        if (i.index == t && !i.isFinish) {
                            if (this.isTopLast) {
                                this.isTopLast = !1;
                                this.hideTopImg();
                            }
                            this.hideTopGuide();
                            this.followStop();
                            this.eventData = i;
                            return i;
                        }
                    } else if (!i.isFinish) {
                        if (Number(i.key) > 1e3) return null;
                        this.eventData = i;
                        return i;
                    }
                }
                return null;
            };
            e.prototype.getOpType = function () {
                if (!this.eventArr || this.itemConf.lockCount > 0) return null;
                if (this.itemConf.isDrag) return s.default.OP_DRAG;
                for (var t = 0, e = this.eventArr; t < e.length; t++) {
                    var o = e[t];
                    if (!o.isFinish) {
                        if (Number(o.key) > 1e3) return null;
                        var i = Number(o.trigger);
                        if (0 != i && 1 != i) return i;
                    }
                }
                return null;
            };
            e.prototype.switchEvent = function () {
                this.eventData.isFinish = !0;
                this.itemConf.lastEvent = this.eventData.index;
                for (var t = !0, e = 0, o = this.eventArr; e < o.length; e++) {
                    var i = o[e];
                    if (!i.isFinish) {
                        var n = Number(i.trigger);
                        if (0 != n && 1 != n) {
                            var a = this.node_bubble.getChildByName("Background");
                            this.setSpriteFrame(a.getComponent(cc.Sprite), "ui/interact_" + n);
                            t = !1;
                        }
                        break;
                    }
                }
                t && this.setBubble(!1, 0, !1);
            };
            e.prototype.playAni = function (t, e) {
                var o = this;
                console.log(t + "---------- play time " + e);
                if (this.m_dragonBones && (this.m_dragonBones.m_dragonDisplay || this.m_dragonBones.m_skeleton) && this.node_mount) {
                    switch (t) {
                        case "chuihao":
                            c.default.playSound("chuihao.mp3");
                    }
                    this.m_dragonBones.setAction(t, 0 == e ? 1 : 0);
                    e > 0 ? this.scheduleOnce(function () {
                        o.m_dragonBones && o.m_dragonBones.setAction("await", 0);
                    }, e) : -1 == e && (this.itemConf.lastDz = t);
                } else console.log("=没有挂载龙骨动画无法播放请检查！！！==");
            };
            e.prototype.initAni = function (t, e) {
                void 0 === e && (e = null);
                var o = !1, i = t, n = (o = !1, (i = t).split("|"));
                this.m_path = i;
                if (-1 != n[0].indexOf("sp_")) {
                    o = !0;
                    i = n[0].replace("sp_", "");
                }
                if (o) {
                    this.node_mount.addComponent(d.default);
                    this.m_dragonBones = this.node_mount.getComponent(d.default);
                } else {
                    this.node_mount.addComponent(h.default);
                    this.m_dragonBones = this.node_mount.getComponent(h.default);
                }
                var a = null != e ? e : "" == n[1] ? "await" : n[1];
                this.m_dragonBones.initData(this.node_mount, a, i, this.aniComplete.bind(this));
            };
            e.prototype.aniComplete = function (t) {
                switch (this.itemConf.key) {
                    case "scarecrow":
                        switch (t) {
                            case "gongji1":
                                this.m_dragonBones.setAction("daiji2", 1);
                                break;

                            case "gongji2":
                                this.m_dragonBones.setAction("daiji3", 1);
                                break;

                            case "death":
                                this.onclear(this.itemConf.key);
                        }
                        break;

                    default:
                        switch (t) {
                            case "death":
                            case "death1":
                            case "death2":
                                this.onclear(this.itemConf.key);
                        }
                }
                "zhendong" == t && l.default.shockAct();
            };
            e.prototype.setGuideAction = function (t, e) {
                void 0 === e && (e = {
                    x: null,
                    y: null
                });
                switch (t) {
                    case 2:
                        this.spine_guide.node.x = e.x || 0;
                        this.spine_guide.node.y = e.y || 200;
                        this.spine_guide.node.active = !0;
                        this.spine_guide.setAnimation(0, "slidepress1", !0);
                        break;

                    case 3:
                        this.spine_guide.node.x = e.x || 100;
                        this.spine_guide.node.y = e.y || 100;
                        this.spine_guide.node.active = !0;
                        this.spine_guide.setAnimation(0, "slideup1", !0);
                        break;

                    case 4:
                        this.spine_guide.node.x = e.x || -50;
                        this.spine_guide.node.y = e.y || 30;
                        this.spine_guide.node.active = !0;
                        this.spine_guide.setAnimation(0, "slideright1", !0);
                        break;

                    case 5:
                        this.spine_guide.node.x = e.x || 50;
                        this.spine_guide.node.y = e.y || 0;
                        this.spine_guide.node.active = !0;
                        this.spine_guide.setAnimation(0, "slidelelf1", !0);
                        break;

                    case 6:
                    case 7:
                        this.spine_guide.node.x = e.x || 0;
                        this.spine_guide.node.y = e.y || 200;
                        this.spine_guide.node.active = !0;
                        this.spine_guide.setAnimation(0, "slidepress1", !0);
                        break;

                    case 8:
                        p.default.hero_ts.setGuideAction();
                }
            };
            e.prototype.setPaoPos = function (t, e) {
                void 0 === t && (t = null);
                void 0 === e && (e = null);
                null != t && (this.node_bubble.x = t);
                null != e && (this.node_bubble.y = e);
            };
            e.prototype.setPaoSprite = function (t) {
                console.log("------------- setPaoSprite ui/interact_" + t);
                var e = this.node_bubble.getChildByName("Background");
                this.setSpriteFrame(e.getComponent(cc.Sprite), "ui/interact_" + t);
                this.node_bubble.active = !0;
            };
            e.prototype.setBubble = function (t, e, o) {
                void 0 === e && (e = 0);
                void 0 === o && (o = !1);
                t && e > 1 && this.setPaoSprite(e);
                this.node_bubble.active = t;
                e && (this.m_nowOperate = e);
                if (!t && o) {
                    this.spine_guide.node.active = t;
                    p.default.hero_ts.setGuideAction(!0);
                }
            };
            e.prototype.bubbleBack = function () {
                // World-space bubbles are also seen by the global ground-touch
                // listener.  On Android that listener may set btnShield before
                // cc.Button dispatches its click, which made a visible bubble
                // impossible to use.  Debounce the bubble itself instead of
                // rejecting it because another input path touched btnShield.
                var t = Date.now();
                if (this.m_lastBubbleClick && t - this.m_lastBubbleClick < 180) return;
                this.m_lastBubbleClick = t;
                p.default.gameManager.btnShield = Math.max(p.default.gameManager.btnShield, 20);
                p.default.triggerEvent(this.node, this.m_nowOperate || 1);
            };
            e.prototype.setItemScale = function (t) {
                var e = Math.abs(t);
                this.itemConf.sx = this.node_mount.scaleX < 0 ? -e : e;
                this.itemConf.sy = e;
                this.node_render.scaleX = this.itemConf.sx;
                this.node_render.scaleY = this.itemConf.sy;
                this.node_mount.scaleX = this.itemConf.sx;
                this.node_mount.scaleY = this.itemConf.sy;
            };
            e.prototype.setItemZIndex = function (t) {
                this.itemConf.z = t;
                this.node.zIndex = t;
            };
            e.prototype.setConf = function (t, e) {
                this.itemConf = t;
                (this.itemConf.isHide || this.itemConf.isDead) && (this.node.active = !1);
                this.gameManager = e;
                this.node_render = new cc.Node();
                this.node_render.addComponent(cc.Sprite);
                this.node.addChild(this.node_render);
                "collection" != this.itemConf.key ? "" == t.url || null != t.ani && "goods" != t.key || "initPos" == t.key || l.default.setSpriteFrame(this.node_render.getComponent(cc.Sprite), t.url) : l.default.setSpriteFrame(this.node_render.getComponent(cc.Sprite), "item/items/item" + t.ani);
                this.node_render.angle = Number(t.r);
                this.node_mount.angle = Number(t.r);
                this.node.width = t.width;
                this.node.height = t.height;
                this.node_render.scaleX = t.sx;
                this.node_render.scaleY = t.sy;
                this.node_mount.scaleX = t.sx;
                this.node_mount.scaleY = t.sy;
                this.node_mount.y = -this.node.height / 2 * t.sy;
                this.node.zIndex = t.z;
                var o = t.color;
                if (o && "" != o) {
                    var i = o.split("|");
                    this.node_mount.color = cc.color(Number(i[0]), Number(i[1]), Number(i[2]));
                    this.node_render.color = cc.color(Number(i[0]), Number(i[1]), Number(i[2]));
                }
                this.initItemBox();
            };
            e.prototype.initItemBox = function () {
                var t = this, e = this.itemConf.button;
                if (e) {
                    this.node_bubble.x = e.x;
                    this.node_bubble.y = e.y || 200;
                }
                var o = this.itemConf.box;
                this.m_collider = this.node.getComponent(cc.PhysicsBoxCollider);
                var i = this.node.getComponent(cc.RigidBody);
                if (o && "" != o.width && "" != o.height && 0 != o.width && 0 != o.height) {
                    this.m_collider.size.width = o.width * Math.abs(this.itemConf.sx);
                    this.m_collider.size.height = o.height * Math.abs(this.itemConf.sy);
                    this.m_collider.offset.x = o.x;
                    this.m_collider.offset.y = o.y;
                    if (1 == this.itemConf.isClimb || 1 == this.itemConf.isOb) {
                        this.m_collider.sensor = !1;
                        this.m_collider.friction = .5;
                    }
                    this.itemConf.lockCount > 0 && (this.m_collider.sensor = !0);
                } else {
                    this.node.removeComponent(cc.PhysicsBoxCollider);
                    this.node.removeComponent(cc.RigidBody);
                }
                var n = this.itemConf.lastEvent;
                this.eventArr = this.itemConf.eventTrigger;
                for (var a = 0, r = this.eventArr; a < r.length; a++) {
                    var c = r[a], h = s.default.eventConf[c.key], d = Number(h.result);
                    if (40 == d) {
                        console.log("---------- enemy ai " + c.key);
                        // Chapter data intentionally keeps historical component
                        // IDs so old saves remain valid. Resolve the ID only at
                        // the engine boundary after scripts are renamed.
                        this.m_baseEventJs = this.node.addComponent(assetCatalog.default.componentName(c.param));
                        this.m_baseEventJs.initData(c, this.node_mount, this);
                        break;
                    }
                    if (d > 1e3) {
                        console.log("---------- enemy ai " + c.key);
                        this.ai_ts = this.node.addComponent(u.default);
                        this.ai_ts.initData(c, d, this.node_mount, this);
                        this.gameManager.addEnemy(this.node, this.itemConf.index);
                        i.enabledContactListener = !0;
                        this.m_collider.apply();
                        if (1001 == d) {
                            this.hp = 1;
                            this.isEnemy = !0;
                        } else 1002 == d && (this.m_collider.tag = s.default.CO_DEATH);
                        break;
                    }
                    if (3 == d || 0 == d && 0 == c.heroTigger) {
                        i.enabledContactListener = !0;
                        if (3 == d) {
                            this.deadNext = c.next;
                            this.attNext = c.param;
                        }
                    }
                    if (4 == d && c.param && "" != c.param) {
                        var p = s.default.goodsConf[c.param];
                        2 == Number(p.isthrow) && l.default.createPrefab("item/itemEffect", function (e) {
                            e.zIndex = -1;
                            t.node.addChild(e);
                        });
                    }
                    var _ = null;
                    if (n && n == c.index) switch (d) {
                        case 15:
                            this.m_collider.sensor = !0;
                            break;

                        case 20:
                            var f = Number(c.playTime);
                            -1 == f && this.showTopImg(c.param, f);
                            break;

                        case 25:
                            c.isFinish && this.node.addComponent(m.default).initData(c.param, c.drop);
                    }
                    this.itemConf.lastDz && (_ = this.itemConf.lastDz);
                }
                null != this.itemConf.ani && "collection" != this.itemConf.key && "goods" != this.itemConf.key && this.initAni(this.itemConf.ani, _);
                this.m_collider.apply();
            };
            e.prototype.getColliderTop = function (t) {
                void 0 === t && (t = !1);
                return t ? this.m_collider.size.height / 2 + this.m_collider.offset.y : this.node.y + this.m_collider.size.height / 2 + this.m_collider.offset.y;
            };
            e.prototype.getColliderBottom = function () {
                return this.node.y - this.m_collider.size.height / 2 + this.m_collider.offset.y;
            };
            e.prototype.getColliderCenter = function () {
                return {
                    x: this.node.x + this.m_collider.offset.x,
                    y: this.node.y + this.m_collider.offset.y
                };
            };
            e.prototype.isEntity = function () {
                return 0 == this.m_collider.sensor;
            };
            e.prototype.setEntity = function (t) {
                this.m_collider.sensor = !t;
                if (t) this.itemConf.isOb = !0; else {
                    this.itemConf.isClimb = !1;
                    this.itemConf.isDrag = !1;
                    this.itemConf.isOb = !1;
                }
                this.m_collider.apply();
            };
            Object.defineProperty(e.prototype, "isClimb", {
                get: function () {
                    return this.itemConf.isClimb;
                },
                enumerable: !1,
                configurable: !0
            });
            Object.defineProperty(e.prototype, "isAttack", {
                get: function () {
                    return this.isEnemy;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.cleanGuide = function () {
                this.itemConf.guide = "";
                this.spine_guide.node.active = !1;
            };
            e.prototype.spriteByState = function (t) {
                var e = this.itemConf.url, o = e.indexOf("-");
                if (-1 != o) {
                    var i = e.substring(o, e.length), n = e.replace(i, "-" + t);
                    l.default.setSpriteFrame(this.node_render.getComponent(cc.Sprite), n);
                    this.itemConf.url = n;
                    console.log("--------- 替换新纹理 " + n);
                } else console.log("--------- 找不到需要替换的新纹理！");
            };
            e.prototype.moveAct = function (t, e, o, i, n) {
                if (n); else {
                    var a, s = Math.abs(this.node_render.scaleX);
                    a = i ? t >= 0 ? s : -s : t >= this.node.x ? s : -s;
                    this.node_mount.scaleX = a;
                    this.itemConf.sx = a;
                }
                if (i) {
                    this.itemConf.x += t;
                    this.itemConf.y += e;
                    this.node.runAction(cc.moveBy(o, cc.v2(t, e)));
                } else {
                    this.itemConf.x = t;
                    this.itemConf.y = e;
                    this.node.runAction(cc.moveTo(o, cc.v2(t, e)));
                }
                this.isLastPos = !0;
            };
            e.prototype.onHit = function (t) {
                this.hp -= t;
                if (!(this.hp <= -1)) {
                    this.m_actickIndex += t;
                    console.log("==itemConf===", this.itemConf.key);
                    switch (this.itemConf.key) {
                        case "scarecrow":
                            if (3 == this.m_actickIndex) {
                                this.m_dragonBones.setAction("death", 1);
                                this.m_actickIndex = 0;
                            } else this.m_dragonBones.setAction("gongji" + this.m_actickIndex, 1);
                            break;

                        default:
                            if (this.ai_ts) {
                                console.log("==敌人组件===", this.ai_ts.m_aniOder);
                                console.log("==敌人组件==111=", this.ai_ts.m_dzMap.death.name1);
                                this.ai_ts.deathCall();
                                this.m_dragonBones.setAction(this.ai_ts.m_dzMap.death.name1, 1);
                            } else this.hp <= 0 && this.onclear();
                    }
                    this.hp > 0 && "" != this.attNext && p.default.checkNext(this.attNext, 1);
                }
            };
            e.prototype.onBreak = function () {
                console.log("------------ onBreak ");
                this.m_dragonBones && this.m_dragonBones.setAction("death", 1);
            };
            e.prototype.onclear = function (t) {
                var e = this;
                void 0 === t && (t = "");
                this.itemConf.isDead = !0;
                if ("" != this.deadNext) {
                    console.log("------------ this.deadNext ", this.deadNext);
                    p.default.recoveryOp();
                    p.default.checkNext(this.deadNext, 1);
                }
                p.default.removeItemBox(this.itemConf.index);
                if ("scarecrow" != t) if (this.ai_ts) {
                    this.node.removeComponent(cc.PhysicsBoxCollider);
                    this.node.removeComponent(cc.RigidBody);
                    this.m_collider.apply();
                    if (1002 != this.ai_ts.aiType) this.scheduleOnce(function () {
                        e.node.removeFromParent();
                        e.node.destroy();
                    }, 4); else {
                        this.node.removeFromParent();
                        this.node.destroy();
                    }
                } else {
                    console.log("------------ removeFromParent ", this.itemConf.index);
                    this.node.removeFromParent();
                    this.node.destroy();
                } else {
                    this.node.removeComponent(cc.PhysicsBoxCollider);
                    this.node.removeComponent(cc.RigidBody);
                    this.m_collider.apply();
                }
            };
            e.prototype.onBeginContact = function (t, e, o) {
                var i = o.tag;
                if (e.tag != s.default.CO_INDUCTION) {
                    if (e.tag != s.default.CO_SHOWATT) switch (i) {
                        case s.default.CO_ATT:
                            this.onHit(1);
                            break;

                        case s.default.CO_BOOM:
                            if (this.itemConf.ani) if (this.ai_ts && 1003 == this.ai_ts.aiType) {
                                this.m_dragonBones.stopAction();
                                this.ai_ts.onDestroy();
                                this.onHit(0);
                            } else this.onBreak(); else this.onclear();
                            break;

                        case s.default.CO_EMP:
                            this.ai_ts ? this.ai_ts.inductionCall(i, o.node, !0) : p.default.triggerEvent(this.node, s.default.OP_TRIGGER);
                            break;

                        default:
                            p.default.triggerEvent(this.node, s.default.OP_TRIGGER);
                    }
                } else {
                    console.log("------- induction tag " + i);
                    this.ai_ts && this.ai_ts.inductionCall(i, o.node);
                }
            };
            e.prototype.addDialog = function (t) {
                var e = this, o = t.txt;
                if (this.node_dialog) {
                    this.node_dialog.getComponent("SpeechBubble").initData(o);
                    l.default.fadeAct(this.node_dialog);
                } else this.createPrefab("item/dialog", function (t) {
                    if (t) {
                        t.y = 235 * Math.abs(e.node_render.scaleX);
                        t.x = -10;
                        t.getComponent("SpeechBubble").initData(o);
                        e.node_dialog = t;
                        e.node.addChild(t);
                        l.default.fadeAct(e.node_dialog);
                    }
                });
            };
            e.prototype.setGuide = function (t) {
                var e = 0;
                if (t && 0 == this.node_Guide.length) for (var o in t) {
                    var i = s.default.guideJson[Number(t[o]) - 1], n = new cc.Node();
                    n.addComponent(cc.Sprite);
                    this.setSpriteFrame(n.getComponent(cc.Sprite), "guide/" + i.img);
                    console.log("=addGuide=Y" + this.node.height);
                    n.y = this.node.height + e + 70;
                    n.opacity = 0;
                    this.node.addChild(n);
                    n.runAction(cc.fadeIn(.35));
                    e = n.y - 40;
                    this.node_Guide.push(n);
                } else for (var o in this.node_Guide) l.default.fadeAct(this.node_Guide[o], !0);
            };
            e.prototype.showTopImg = function (t, e) {
                var o = this;
                if (!this.img_top) {
                    this.img_top = new cc.Node();
                    this.img_top.addComponent(cc.Sprite);
                    this.img_top.anchorY = 0;
                    this.img_top.y = Math.abs(this.node.height / 2 * this.itemConf.sy) + 40;
                    this.node.addChild(this.img_top);
                }
                this.hideTopImg(!0);
                l.default.createPrefab("guide/guide_" + t, function (t) {
                    // Guide prefabs were authored for the old camera scale.  In
                    // the current native viewport their 283px task card obscures
                    // nearby interaction bubbles, so keep the visual cue compact.
                    t.scale = .55;
                    o.img_top && o.img_top.addChild(t);
                });
                e > 0 ? this.scheduleOnce(function () {
                    o.hideTopImg();
                }, e) : this.isTopLast = !0;
            };
            e.prototype.hideTopImg = function (t) {
                void 0 === t && (t = !1);
                if (this.img_top) {
                    this.img_top.removeAllChildren();
                    this.img_top.active = t;
                }
            };
            e.prototype.hideTopGuide = function () {
                var t = this.itemConf.guide.split("|"), e = Number(t[0]);
                if (e > 1e3 && e <= 2e3) this.hideTopImg(); else if (e > 2e3) switch (e) {
                    case 2001:
                        this.stopBlink();
                        break;

                    case 2002:
                        this.node.opacity = 255;
                }
            };
            e.prototype.showSpecialGuide = function (t) {
                switch (t) {
                    case 2001:
                        this.blinkAct(!0);
                        break;

                    case 2002:
                        this.node.opacity = 100;
                }
            };
            e.prototype.followHero = function () {
                this.followY = this.node.y - p.default.hero.y;
                var t = p.default.hero_ts.m_scale;
                this.setItemScale(t);
                this.node.zIndex = p.default.hero.zIndex - 1;
                this.schedule(this.followCall, 0);
            };
            e.prototype.followCall = function () {
                var t = this.node.x - p.default.hero.x;
                if (Math.abs(t) > s.default.FOLLOW_RANGE) {
                    if (null == this.followType) {
                        this.followType = t > 0 ? "left" : "right";
                        this.flipAct(this.followType);
                        this.playAni("run", -1);
                    }
                } else if (Math.abs(t) < s.default.FOLLOW_RANGE / 2 && null != this.followType) {
                    this.followType = null;
                    this.playAni("await", -1);
                }
                if (null != this.followType) {
                    this.node.x += "left" == this.followType ? -s.default.SPEED_RUN : s.default.SPEED_RUN;
                    var e = this.node.y - (p.default.hero.y + 52);
                    e = Math.abs(e) > 9 ? e > 0 ? -1.2 : 1.2 : 0;
                    this.node.y += e;
                    this.node.zIndex = p.default.hero.zIndex - 1;
                }
                var o = p.default.hero_ts.m_scale;
                Math.abs(this.node_render.scaleX) != o && this.setItemScale(o);
            };
            e.prototype.followStop = function () {
                this.unschedule(this.followCall);
                this.followType = null;
                this.followY = 0;
                p.default.hero_ts.delFollow(this.itemConf.index);
            };
            e.prototype.setBoxTips = function (t, e, o, i) {
                void 0 === e && (e = null);
                void 0 === o && (o = "");
                void 0 === i && (i = null);
                this.node_tips.active = t;
                this.node_tips.stopAllActions();
                this.node_tips.statr = 1;
                this.label_tips.node.active = !1;
                this.node_spine.node.active = !1;
                if (t) {
                    this.m_eventData = {};
                    if (i) {
                        for (var n in i) this.m_eventData[n] = "pos" == n ? i[n] : Number(i[n]);
                        var a = this.m_eventData.pos.split("|");
                        this.node_tips.x = a[0];
                        this.node_tips.y = a[1];
                    }
                    var r = this.node_tips.getChildByName("node_sprite").getComponent(cc.Sprite);
                    if (this.node_tips.active) {
                        r.spriteFrame = null;
                        if ("label" == e) {
                            var c = s.default.plotConf[o];
                            if (!c) return;
                            this.label_tips.node.active = !0;
                            this.label_tips.string = c.txt;
                        } else if ("img" == e) {
                            l.default.setSpriteFrame(r, o);
                            this.node_tips.getChildByName("node_sprite").active = !0;
                        }
                        if (0 == this.m_eventData.num && 0 == this.m_eventData.times && 0 == this.m_eventData.interval) this.node_tips.active = !0; else {
                            this.node_tips.statr = this.m_eventData.num ? 0 : -1;
                            this.setNodeAction();
                        }
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
            e.prototype.onDestroy = function () {
                this.unscheduleAllCallbacks();
            };
            e.prototype.addDragonBones = function (t) {
                var e = this;
                if (t != this.m_path) if (this.node_mount.getComponent(sp.Skeleton)) {
                    this.m_path = t;
                    this.node_mount.removeComponent(sp.Skeleton);
                    if (this.node_mount.getComponent(d.default)) {
                        this.node_mount.removeComponent(d.default);
                        this.m_dragonBones = null;
                    }
                    this.scheduleOnce(function () {
                        e.initAni(e.m_path, "await");
                    }, .1);
                } else console.log("==未挂载龙骨=请检查=");
            };
            a([g(cc.Node)], e.prototype, "node_mount", void 0);
            a([g(cc.Node)], e.prototype, "node_bubble", void 0);
            a([g(sp.Skeleton)], e.prototype, "spine_guide", void 0);
            a([g(cc.Node)], e.prototype, "node_tips", void 0);
            a([g(cc.Label)], e.prototype, "label_tips", void 0);
            a([g(sp.Skeleton)], e.prototype, "node_spine", void 0);
            return a([f], e);
        }(r.default);
        o.default = y;
