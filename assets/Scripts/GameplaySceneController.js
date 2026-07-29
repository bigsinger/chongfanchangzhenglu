'use strict';

/**
 * 模块职责：装载关卡地图并协调输入、事件、镜头、目标和存档。
 * 关键约束：所有异步回调先检查场景代次，防止上张地图的迟到结果污染当前场景。
 */

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
        var s = require("./BaseView"), r = require("./GameConfigManager"), c = require("./GameState"), l = require("./AudioManager"), h = require("./GameUtilities"), d = require("./DialogManager"), p = require("./SpineAnimationManager"), u = require("./GameplayEventController"), v = require("./SaveManager"), w = require("./ObjectiveManager"), timingEvent = require("./TimingEvent"), gameplayPersistence = require("./GameplayPersistence"), displayAdapter = require("./DisplayAdapter"), m = cc._decorator, _ = m.ccclass, f = m.property, g = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.camera_master = null;
                e.camera_ui = null;
                e.btn_up = null;
                e.btn_down = null;
                e.btn_left = null;
                e.btn_right = null;
                e.btn_throw = null;
                e.btn_pass = null;
                e.btn_tips = null;
                e.btn_story = null;
                e.btn_goods = null;
                e.node_control = null;
                e.pan_control = null;
                e.btn_control = null;
                e.btn_light = null;
                e.node_dir = null;
                e.btn_user = null;
                e.btn_climb = null;
                e.img_user = null;
                e.img_special = null;
                e.layer_black = null;
                e.layer_dir = null;
                e.m_guideNode = null;
                e.node_save = null;
                e.guidetips_node = null;
                e.camera_part = null;
                e.texture_sp = null;
                e.itemBox = null;
                e.pan_goods = null;
                e.mask_goods = null;
                e.ani_node = null;
                e.DIR_UP = 1;
                e.DIR_DOWN = 2;
                e.DIR_LEFT = 3;
                e.DIR_RIGHT = 4;
                e.touchX = 0;
                e.touchY = 0;
                e.tx = 0;
                e.ty = 0;
                e.controlAngle = 999;
                e.gameWidth = 0;
                e.gameHeight = 0;
                e.isCheck = !1;
                e.isCamera = !1;
                e.layer_master = null;
                e.layer_static = null;
                e.layer_static0 = null;
                e.layer_static1 = null;
                e.layer_near0 = null;
                e.layer_near = null;
                e.layer_far0 = null;
                e.layer_far1 = null;
                e.layer_far2 = null;
                e.layer_far3 = null;
                e.layer_ob = null;
                e.isLockCamera = !0;
                e.btnShield = 90;
                e.itemCount = 0;
                e.itemMap = {};
                e.enemyMap = {};
                e.interactMod = c.default.OP_USE;
                e.specialMode = c.default.OP_CLIMB;
                e.operateDir = 0;
                e.mapName = "";
                e.horizonY = 0;
                e.forceWaitTime = 0;
                e.forceWaitCb = null;
                e.isGesture = !1;
                e.gestureCount = 0;
                e.nPos = null;
                e.isToucheLong = 0;
                e.m_angle = 45;
                e.m_forceX = 6e3;
                e.m_forceY = 6e3;
                e.m_MaxX = 8e3;
                e.m_MaxY = 11e3;
                e.m_MiniX = 2e3;
                e.m_MiniY = 3e3;
                e.m_MaxZindex = 999;
                e.m_isTimeTouch = 0;
                e.initCameraData = null;
                e.m_moveSavePending = !1;
                e.m_moveSaveFrames = 0;
                e.m_progressSavePending = !1;
                e.m_progressSaveFrames = 0;
                e.m_gameReady = !1;
                e.m_objectiveFrame = 0;
                e.m_objectiveNode = null;
                e.m_objectiveLabel = null;
                e.m_actionTargetNode = null;
                e.m_actionTargetLabel = null;
                e.m_onGameHide = null;
                e.m_onGameShow = null;
                e.m_canvasNode = null;
                e.m_canvasTouchStart = null;
                e.m_isRestoredScene = !1;
                e.m_interactionValidationFrame = 0;
                e.m_lastParallaxX = null;
                e.m_lastParallaxY = null;
                e.m_chapterTransitionPending = !1;
                e.m_transitionSceneLoadStarted = !1;
                e.m_cameraTrackPosition = {
                    x: 0,
                    y: 0
                };
                e.m_partSpriteFrame = null;
                e.cameraCurScale = 1;
                e.layer_ex = null;
                e.cameraIndex = 1;
                e.m_isThrow = 0;
                e.m_touchState = 0;
                e.keyDirections = {};
                e.keyDirection = 0;
                e.m_throwIndex = 0;
                e.m_discardIdx = 5e3;
                return e;
            }
            e.prototype.onLoad = function () {
                displayAdapter.default.apply(this.node, {
                    referenceWidth: 1334
                });
                // 弹窗和 HUD 必须高于所有世界镜头；场景原先给两台镜头设置了相同深度，
                // 而原生渲染器并不保证同深度镜头的顺序。
                this.camera_ui && (this.camera_ui.depth = 100, this.camera_ui.cullingMask = 4);
                this.gameWidth = cc.winSize.width;
                this.gameHeight = cc.winSize.height;
                cc.director.getPhysicsManager().enabled = !0;
                if (!c.default.isTest) {
                    cc.director.getPhysicsManager().debugDrawFlags = 16 | cc.PhysicsManager.DrawBits.e_shapeBit | cc.PhysicsManager.DrawBits.e_jointBit;
                    cc.director.getCollisionManager().enabledDrawBoundingBox = !0;
                }
                cc.director.getPhysicsManager().enabledAccumulator = !0;
                cc.PhysicsManager.FIXED_TIME_STEP = 1 / 30;
                cc.PhysicsManager.VELOCITY_ITERATIONS = 8;
                cc.PhysicsManager.POSITION_ITERATIONS = 8;
                cc.debug.setDisplayStats(!1);
                this.setClick(this.node, !0);
                // Android 进入后台时立即保存完整场景，否则尚未触发移动或切图的拾取、
                // 对话结果只存在内存中，进程被回收后会丢失。
                var t = this;
                this.m_onGameHide = function () {
                    t.resetActiveInput();
                    if (t.m_gameReady && t.hero && t.gameNode && t.mapName) {
                        t.saveItemConf({
                            x: t.hero.x,
                            y: t.hero.y
                        }, t.hero_ts.walkingMode);
                        t.m_progressSavePending = !1;
                        t.m_moveSavePending = !1;
                        console.log("------------ 应用进入后台，游戏进度已保存");
                    }
                    v.default.flush("gameplay-hide", c.default.playData);
                };
                this.m_onGameShow = function () {
                    t.resetActiveInput();
                };
                cc.game.on(cc.game.EVENT_HIDE, this.m_onGameHide, this);
                cc.game.on(cc.game.EVENT_SHOW, this.m_onGameShow, this);
            };
            e.prototype.start = function () {
                var t = this;
                this.m_canvasNode = cc.find("Canvas");
                this.m_canvasTouchStart = function () {
                    t.m_isTimeTouch = 0;
                };
                this.m_canvasNode.on(cc.Node.EventType.TOUCH_START, this.m_canvasTouchStart, this);
                this.m_nowMod = [];
                u.default.loadCrossEvent();
                this.initControl();
                if (c.default.isTest) this.initData(["scenes_d" + c.default.chapter + "_" + c.default.mapIndex]); else {
                    var e = c.default.mapKey, o = (e = e.replace("scenes_d", "")).split("_"), i = o[0], n = o[1];
                    c.default.chapter = Number(i);
                    c.default.mapIndex = Number(n);
                    this.initData([c.default.mapKey]);
                }
            };
            e.prototype.initTouchData = function () {
                this.m_forceX = 6e3;
                this.m_forceY = 5e3;
                this.m_MaxX = 8e3;
                this.m_MaxY = 11e3;
                this.m_MiniX = 2e3;
                this.m_MiniY = 3e3;
                this.m_throwNode && this.m_throwNode.destroy();
                this.m_throwNode = null;
                this.m_ThrowPos = [];
            };
            e.prototype.openEffect = function (t, e) {
                var o = this;
                void 0 === t && (t = .6);
                void 0 === e && (e = null);
                var i = cc.sequence(cc.delayTime(t), cc.fadeOut(.7), cc.callFunc(function () {
                    o.layer_black.active = !1;
                    e && e();
                }));
                this.layer_black.active = !0;
                this.layer_black.opacity = 255;
                this.layer_black.runAction(i);
            };
            e.prototype.removeItemData = function (t) {
                this.itemMap[t] = null;
            };
            e.prototype.addItemData = function (t, e) {
                this.itemMap[t] = e;
            };
            e.prototype.delayHold = function (t, e) {
                this.scheduleOnce(e, t);
            };
            e.prototype.resumeGame = function () {
                this.node.resumeAllActions();
                cc.director.getScheduler().resumeTarget(this);
                this.recursionNode(this.gameNode, !1);
            };
            e.prototype.pauseGame = function () {
                this.node.pauseAllActions();
                cc.director.getScheduler().pauseTarget(this);
                this.recursionNode(this.gameNode, !0);
            };
            e.prototype.recursionNode = function (t, e) {
                for (var o = 0, i = t.children; o < i.length; o++) {
                    var n = i[o], a = n.getComponent("DragonBonesAnimationManager"), s = n.getComponent("SpineAnimationManager"), r = n.getComponent("InteractiveObject"), c = n.getComponent("EnemyController"), l = cc.director.getScheduler();
                    if (e) {
                        n.pauseAllActions();
                        a && a.stopAction();
                        s && s.stopAction();
                        r && l.pauseTarget(r);
                        c && l.pauseTarget(c);
                    } else {
                        n.resumeAllActions();
                        a && a.goOnAction();
                        s && s.goOnAction();
                        r && l.resumeTarget(r);
                        c && l.resumeTarget(c);
                    }
                    n.childrenCount > 0 && this.recursionNode(n, e);
                }
            };
            e.prototype.initData = function (t) {
                var e = this;
                this.btnShield = 999999;
                cc.game.setFrameRate(60);
                this.gameOperate = !0;
                this.m_gameReady = !1;
                this.m_progressSavePending = !1;
                this.m_progressSaveFrames = 0;
                this.m_lastParallaxX = null;
                this.m_lastParallaxY = null;
                var o = t[0], i = t[1];
                require("./Logger").default.setContext({
                    chapter: c.default.chapter,
                    map: o,
                    event: null
                });
                this.camera_master_ts = this.camera_master.getComponent("CameraController");
                this.m_throwAry = [];
                this.m_ThrowPos = [];
                this.m_isRestoredScene = !1;
                var n = new cc.Node();
                n.name = "throwParent";
                this.layer_black.active && (this.ani_node.node.active = !1);
                this.createPrefab("view/" + o, function (t) {
                    if (null != t) {
                        e.gameNode = t;
                        h.default.gameNode = t;
                        e.layer_master = e.gameNode.getChildByName("node_master").getChildByName("node_obj");
                        e.layer_static = e.gameNode.getChildByName("node_static");
                        e.layer_static0 = e.gameNode.getChildByName("node_static0");
                        e.layer_static1 = e.gameNode.getChildByName("node_static1");
                        e.layer_near0 = e.gameNode.getChildByName("node_near0");
                        e.layer_near = e.gameNode.getChildByName("node_near");
                        e.layer_far0 = e.gameNode.getChildByName("node_far0");
                        e.layer_far1 = e.gameNode.getChildByName("node_far1");
                        e.layer_far2 = e.gameNode.getChildByName("node_far2");
                        e.layer_far3 = e.gameNode.getChildByName("node_far3");
                        e.layer_ob = e.gameNode.getChildByName("node_ob");
                        e.layer_ob.opacity = 0;
                        if (i) {
                            i.x = Number(i.x) - e.gameNode.width / 2;
                            i.y = -(Number(i.y) - e.gameNode.height / 2);
                        }
                        e.node.addChild(t);
                        e.gameNode.setSiblingIndex(Math.min(4, e.node.childrenCount - 1));
                        console.log("------------- heroPos ", i);
                        var a = r.default.getTempData(o), s = null, l = null;
                        e.m_isRestoredScene = !!(a && a.heroPos);
                        e.initCameraData = null;
                        if (a && "" != a) {
                            s = a.itemArr;
                            i || (i = a.heroPos);
                            l = a.gomod;
                        }
                        if (!s) {
                            var d = r.default.getPointConf(o);
                            s = d.confArr;
                            e.initCameraData = d.initCamera;
                        }
                        e.mapName = o;
                        e.itemCount = s.length;
                        console.log("------------- confArr ", s);
                        e.layer_master.addChild(n);
                        e.m_ParentNode = n;
                        e.m_ParentNode.zIndex = e.m_MaxZindex;
                        u.default.initGameEvent(e, null);
                        var p = 0, m = [];
                        for (var _ in s) m.push(s[_]);
                        for (var f = function () {
                            var t = v;
                            e.createPrefab("item/itemBox", function (o) {
                                if (!o) {
                                    console.error("------------- 物件预制体加载失败，已跳过 index=" + t.index);
                                    p++;
                                    e.checkLoadItem(p);
                                    return;
                                }
                                o.x = t.x;
                                o.y = t.y;
                                e.layer_master.addChild(o);
                                o.getComponent("InteractiveObject").setConf(t, e);
                                e.itemMap[t.index] = o;
                                p++;
                                e.checkLoadItem(p);
                            });
                            if ("initPos" == t.key) {
                                var o = t;
                                console.log("------------- heroConf ", o);
                                o.heroGo = l || o.heroGo || "walk";
                                e.createPrefab(o.url, function (t) {
                                    if (!t) {
                                        console.error("------------- 主角预制体加载失败 " + o.url);
                                        c.default.initMapInfo(1);
                                        cc.director.loadScene("mainScene");
                                        return;
                                    }
                                    e.hero = t;
                                    if (i) {
                                        e.hero.x = i.x;
                                        e.hero.y = i.y;
                                    } else {
                                        e.hero.x = o.x;
                                        e.hero.y = o.y;
                                    }
                                    var n = r.default.getHeroSpine();
                                    n && "" != n && (o.heroAni = n);
                                    e.hero.zIndex = o.z;
                                    e.hero_ts = e.hero.getComponent("PlayerController");
                                    u.default.initGameEvent(e, e.hero);
                                    e.hero_ts.initHero(o, c.default.HERO_STANDBY, r.default.getHeroItem());
                                    e.layer_master.addChild(e.hero);
                                    p++;
                                    e.checkLoadItem(p);
                                });
                            }
                        }, g = 0, y = m; g < y.length; g++) {
                            var v = y[g];
                            f();
                        }
                        e.layer_black.active && e.openEffect();
                    } else {
                        console.error("------------- 地图预制体不存在 " + o + "，已返回主菜单");
                        c.default.initMapInfo(1);
                        cc.director.loadScene("mainScene");
                    }
                });
            };
            e.prototype.checkLoadItem = function (t) {
                if (t > this.itemCount) {
                    this.checkFollow();
                    this.initGame();
                }
            };
            e.prototype.changeEditorPos = function (t, e) {
                var o = null, i = null;
                null != t && (o = Number(t) - this.gameNode.width / 2);
                null != e && (i = -(Number(e) - this.gameNode.height / 2));
                return {
                    x: o,
                    y: i
                };
            };
            e.prototype.cameraTargetForHero = function (t) {
                // 主角只需略低于画面中心。旧的半屏 58% 偏移在高屏设备的 1.6 倍入口
                // 镜头中会裁掉脚部和地面；按缩放限制偏移还能给高道具与交互气泡留空间。
                var e = this.camera_master_ts ? Math.max(.01, Number(this.camera_master_ts.getZoom()) || 1) : 1, o = cc.view.getVisibleSize(), i = Math.min(120, o.height / (2 * e) * .28);
                return {
                    x: t.x,
                    y: t.y + i
                };
            };
            e.prototype.tempCloseUp = function (t) {
                void 0 === t && (t = !1);
                if (t) this.camera_master_ts.zoom(0, this.cameraCurScale, null, .3); else {
                    this.cameraCurScale = this.camera_master_ts.getZoom();
                    var e = 1.5 * this.cameraCurScale;
                    this.camera_master_ts.zoom(0, e, null, .5);
                }
            };
            e.prototype.checkFollow = function () {
                var t = this, e = r.default.getHeroFollow();
                this.hero_ts.followMap = e || {};
                var o, i = function () {
                    if (null == e[a]) return "continue";
                    if (null == n.itemMap[a]) {
                        var i = e[a].conf;
                        o = e[a].y;
                        n.createPrefab("item/itemBox", function (e) {
                            if (!e) {
                                console.error("------------- 跟随物件预制体加载失败 index=" + i.index);
                                return;
                            }
                            e.x = t.hero.x + h.default.mt_rand(-80, 80);
                            e.y = t.hero.y + o;
                            e.zIndex = i.z;
                            t.layer_master.addChild(e);
                            var n = e.getComponent("InteractiveObject");
                            n.setConf(i, t);
                            t.itemMap[i.index] = e;
                            n.followHero(t.hero.y);
                        });
                    } else n.itemMap[a].getComponent("InteractiveObject").followHero(n.hero.y);
                }, n = this;
                for (var a in e) i();
            };
            e.prototype.stopNodeRuntime = function (t) {
                if (!t || !cc.isValid(t, !0)) return;
                t.stopAllActions();
                var e = t.getComponents(cc.Component);
                for (var o = 0; o < e.length; o++) e[o].unscheduleAllCallbacks && e[o].unscheduleAllCallbacks();
                var s = t.children.slice();
                for (var r = 0; r < s.length; r++) this.stopNodeRuntime(s[r]);
            };
            e.prototype.cleanGame = function () {
                this.unschedule(this.upGame);
                this.m_gameReady = !1;
                this.m_progressSavePending = !1;
                this.m_progressSaveFrames = 0;
                this.operateDir = 0;
                // 章节切换可能发生在事件回调内，此时旧移动动作仍在运行。销毁节点前先停
                // 动作并停用场景，否则 Creator 可能再更新一次动作并访问已释放的刚体。
                this.stopNodeRuntime(this.gameNode);
                // 停用场景是 Creator 正式支持的刚体解绑方式；它会产生最后一批接触回调，
                // 因此必须等停用完成后再清除事件控制器中的主角引用。
                this.gameNode.active = !1;
                u.default.resetTransientState();
                this.itemMap = {};
                this.gameNode.removeAllChildren();
                this.gameNode.removeFromParent();
                this.gameNode.destroy();
            };
            e.prototype.cameraAct = function (t, e) {
                void 0 === e && (e = 0);
                this.isLockCamera = !t.unlock;
                var o = {};
                if (null == t.x && null == t.y) o = null; else {
                    null != t.x && (o.x = Number(t.x));
                    null != t.y && (o.y = Number(t.y));
                }
                var i = this;
                this.camera_master_ts.zoom(t.mod, Number(t.scale), o, Number(t.time), function () {
                    if (!o && i.hero) i.camera_master_ts.restoreHeroTracking(i.cameraTargetForHero(i.hero));
                });
            };
            e.prototype.specialEvent = function (t) {
                switch (t) {
                    case 101:
                        for (var e, o, i = -105, n = function () {
                            var t = new cc.Node();
                            t.x = -a.gameNode.width / 2 - h.default.mt_rand(200, 600);
                            e = 120 + 135 * (1 - (-65 - i) / 350);
                            t.color = cc.color(e, e, e);
                            i -= h.default.mt_rand(25, 40);
                            t.y = i;
                            t.zIndex = -i;
                            t.scale = .8 * (.35 + Math.abs(i) / 400);
                            o = h.default.mt_rand(1, 4) / 10;
                            var n = cc.sequence(cc.delayTime(o), cc.callFunc(function () {
                                var e = t.addComponent(p.default), o = 1 == h.default.mt_rand(1, 2) ? "benpao" : "benpao2";
                                e.initData(t, o, "ani05");
                            }), cc.moveBy(4, cc.v2(2500, h.default.mt_rand(-20, 20))), cc.callFunc(function () {
                                t.stopAllActions();
                                t.destroy();
                            }));
                            t.runAction(n);
                            a.layer_master.addChild(t);
                        }, a = this, s = 0; s < 7; s++) n();
                }
            };
            e.prototype.saveItemConf = function (t, e) {
                void 0 === t && (t = null);
                void 0 === e && (e = "walk");
                console.log("------------ 保存地图信息 " + this.mapName);
                console.log("------------ 保存主角坐标 ", t);
                gameplayPersistence.saveScene({
                    mapName: this.mapName,
                    itemMap: this.itemMap,
                    heroPosition: t,
                    walkingMode: e,
                    heroController: this.hero_ts,
                    configManager: r.default,
                    gameState: c.default,
                    saveManager: v.default
                });
            };
            e.prototype.changeMap = function (t, e) {
                var o = this;
                void 0 === e && (e = {
                    x: "",
                    y: ""
                });
                this.changeForceWait(!0);
                var i = "scenes_d" + c.default.chapter + "_" + t;
                u.default.cleanStack();
                u.default.isDoor = !0;
                if (this.mapName == i) {
                    this.hero_ts.initAllState();
                    this.hero.runAction(cc.sequence(cc.fadeOut(.7), cc.callFunc(function () {
                        o.hero.x = Number(e.x) - o.gameNode.width / 2;
                        o.hero.y = -(Number(e.y) - o.gameNode.height / 2);
                        o.isLockCamera = !0;
                        o.camera_master_ts.restoreCamera(o.cameraTargetForHero(o.hero), null);
                        o.alignLayer();
                    }), cc.fadeIn(.7), cc.callFunc(function () {
                        o.changeForceWait(!1);
                        u.default.isGround = !0;
                    })));
                    var n = this.hero_ts.followMap, a = function () {
                        if (null != n[r]) {
                            var t = s.itemMap[r];
                            t.runAction(cc.sequence(cc.fadeOut(.71), cc.callFunc(function () {
                                t.x = Number(e.x) - o.gameNode.width / 2;
                                t.y = 52 - (Number(e.y) - o.gameNode.height / 2);
                            }), cc.fadeIn(.69)));
                        }
                    }, s = this;
                    for (var r in n) a();
                } else {
                    c.default.mapIndex = Number(t);
                    this.saveItemConf(null, this.hero_ts.walkingMode);
                    this.showSave();
                    this.layer_black.opacity = 0;
                    this.layer_black.active = !0;
                    this.layer_black.runAction(cc.fadeIn(.5));
                    this.delayHold(.5, function () {
                        if (null != e.x && "" != e.x && null != e.y && "" != e.y) {
                            o.cleanGame();
                            o.initData([i, {
                                x: e.x,
                                y: e.y
                            }]);
                        } else {
                            o.cleanGame();
                            o.initData([i]);
                        }
                    });
                }
            };
            e.prototype.goTransitionScene = function (t) {
                void 0 === t && (t = "");
                var transitionHost = this;
                var e = t.split("_"), o = Number(e[0]), i = Number(e[1]);
                if (t && (e.length != 2 || !c.default.publishedMapCounts[i] || i != o + 1)) {
                    console.error("------------ 无效的章节出口参数 " + t);
                    t = "";
                }
                this.cleanGame();
                r.default.cleanHeroItem();
                r.default.cleanCorssData();
                r.default.cleanHeroFollow();
                if (!t || "" == t) {
                    this.openEffect(.01, function () {
                        var t = require("./CompletionTracker").default.endingText();
                        d.default.open("dialog/tipsDialog", ["<b><size=26>" + t + "</>", "", function () {
                            console.log("==确定=回调=");
                            r.default.clearRunState();
                            c.default.chapter = 1;
                            c.default.mapIndex = 1;
                            c.default.Smallplot = "0_1";
                            l.default.stopBGM();
                            c.default.initMapInfo();
                            transitionHost.delayHold(.2, function () {
                                cc.director.loadScene("mainScene", function () {
                                    console.log("==1111== mainScene==success=====");
                                });
                            });
                        }, null, null, !0]);
                    });
                    return console.log("111关卡结束未配置参数");
                }
                c.default.Smallplot = t;
                // 进入过场前先保存目标地图，确保 Android 在章节动画中回收进程后，重启
                // 仍进入新章节，而不是返回已经完成的结尾。
                c.default.chapter = i;
                c.default.mapIndex = 1;
                if (i > c.default.chapterCur) {
                    c.default.chapterCur = i;
                    console.log("------------- chapterCur " + c.default.chapterCur);
                }
                o > c.default.unlockchapters && (c.default.unlockchapters = o);
                c.default.saveMapInfo(!0);
                c.default.saveUnlockChapter();
                l.default.stopBGM();
                this.layer_black.opacity = 0;
                this.layer_black.active = !0;
                this.layer_black.runAction(cc.fadeIn(1.5));
                var n = function () {
                    if (transitionHost.m_transitionSceneLoadStarted) return;
                    transitionHost.m_transitionSceneLoadStarted = !0;
                    transitionHost.delayHold(.2, function () {
                        cc.director.loadScene("transitionScene", function () {
                            console.log("==章节过场 transitionScene==success=====");
                        });
                    });
                };
                cc.director.preloadScene("transitionScene", function () { }, function (t) {
                    t && console.warn("------------ 章节过场预加载失败，将直接加载", t);
                    n();
                });
                // 个别 Android 图形驱动在销毁旧场景时会丢失预载完成回调，超时兜底避免
                // 玩家永久停在无法操作的黑屏。
                this.scheduleOnce(function () {
                    if (!transitionHost.m_transitionSceneLoadStarted) {
                        console.warn("------------ 章节过场预加载超时，直接进入");
                        n();
                    }
                }, 4);
            };
            Object.defineProperty(e.prototype, "gameOperate", {
                get: function () {
                    return this.isCheck;
                },
                set: function (t) {
                    this.isCheck = t;
                    console.log("------------- 设置阻断 ", this.isCheck);
                    if (this.isCheck) {
                        this.operateDir = 0;
                        this.hero_ts && this.hero_ts.stopMove();
                    } else this.keyDirection && this.dirCall(this.keyDirection);
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.getTriggerItem = function (t) {
                if (this.itemMap && this.itemMap[t]) return this.itemMap[t];
            };
            e.prototype.showSave = function () {
                var t = this;
                this.node_save.active = !0;
                this.delayHold(3, function () {
                    t.node_save.active = !1;
                });
            };
            e.prototype.setBtnOpacity = function (t) {
                this.btn_user.opacity = t;
            };
            e.prototype.fitInteractionHud = function () {
                // 场景 Canvas 宽 1650，而当前 Android 可视设计区约宽 1334，旧 Widget
                // 偏移会把操作键放进裁切区。直接使用 UI 镜头设计坐标可避免原生端二次缩放。
                var t = cc.view.getVisibleSize(), e = this.node, o = this.camera_ui, n = cc.game.groupList ? cc.game.groupList.indexOf("ui") : -1;
                n < 0 && (n = 2);
                var a = function (t) {
                    if (!t) return;
                    t.groupIndex = n;
                    for (var e = 0; e < t.childrenCount; e++) a(t.children[e]);
                }, i = function (i, n, s) {
                    if (!i || !i.parent || !e || !o) return;
                    var r = i.getComponent(cc.Widget);
                    r && (r.enabled = !1);
                    i.parent != e && i.setParent(e);
                    a(i);
                    i.zIndex = cc.macro.MAX_ZINDEX;
                    var c = o.getScreenToWorldPoint(cc.v2(t.width - n, s)), l = e.convertToNodeSpaceAR(c);
                    i.setPosition(l.x, l.y, 0);
                    i.opacity = 255;
                    var h = i.getChildByName("Background");
                    if (h) {
                        h.color = cc.color(45, 35, 35);
                        h.opacity = 235;
                    }
                };
                i(this.btn_user, 105, 105);
                i(this.btn_climb, 245, 105);
                i(this.btn_throw, 105, 245);
            };
            e.prototype.setInteract = function (t) {
                void 0 === t && (t = 0);
                this.interactMod = t || c.default.OP_USE;
                var e = t > 0;
                // 碰撞选中物品后同步显示 HUD 操作键，不能只留下世界空间提示。
                this.fitInteractionHud();
                this.btn_user.active = e && t != c.default.OP_CLIMB;
                this.btn_climb.active = e && t == c.default.OP_CLIMB;
                if (e) {
                    var o = t == c.default.OP_CLIMB ? this.img_special : this.img_user;
                    if (o) {
                        o.node.opacity = 255;
                        h.default.setSpriteFrame(o, "ui/interact_" + t);
                    }
                }
                w.default.update(this, u.default);
            };
            Object.defineProperty(e.prototype, "interact", {
                get: function () {
                    return this.interactMod;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.setSpecialMode = function (t) {
                this.specialMode = t;
            };
            e.prototype.resumeInterruptedDelayedEvents = function () {
                if (!this.itemMap) return;
                var t = {}, e = [], o = {};
                for (var i in this.itemMap) {
                    var n = this.itemMap[i], a = n && n.getComponent("InteractiveObject"), s = a && a.getConf();
                    if (s && "initPos" != s.key && Number(s.index) < 1e4 && s.eventTrigger) {
                        for (var r = 0; r < s.eventTrigger.length; r++) {
                            var c = s.eventTrigger[r];
                            t[s.index + "|" + c.index] = c;
                        }
                    }
                }
                for (var l in this.itemMap) {
                    var h = this.itemMap[l], d = h && h.getComponent("InteractiveObject"), p = d && d.getConf();
                    if (p && "initPos" != p.key && Number(p.index) < 1e4 && p.eventTrigger) {
                        for (var m = 0; m < p.eventTrigger.length; m++) {
                            var _ = p.eventTrigger[m], f = _ && _.next, g = f && t[f];
                            // 事件会在延迟的 next 回调前保存为完成；若进程在延迟期间停止，
                            // 回调消失后流程将无法继续。“正延迟且前驱已完成”可作为明确恢复
                            // 标记，但 initPos 角色事件的临时动画本就不应保存，需要排除。
                            if (_.isFinish && Number(_.last) > 0 && f && g && !g.isFinish && !o[f]) {
                                o[f] = !0;
                                e.push(f);
                            }
                        }
                    }
                }
                for (var v = 0; v < e.length; v++) {
                    console.log("------------ 恢复中断的延时事件 " + e[v]);
                    u.default.checkNext(e[v], 1);
                }
            };
            e.prototype.initGame = function () {
                this.ani_node.node.active && this.ani_node.setAnimation(0, "daiji2", !1);
                console.log("------- gameWidth " + this.gameWidth);
                console.log("------- gameHeight " + this.gameHeight);
                this.isLockCamera = !0;
                this.camera_master_ts.initCamera(this.gameWidth, this.gameHeight, this.gameNode.width, this.gameNode.height, this);
                var t = this.hero.getPosition();
                this.camera_master_ts.restoreCamera(this.cameraTargetForHero(t), this.initCameraData);
                l.default.gamePlayBGM("gameplay/main-theme");
                this.horizonY = this.hero.y;
                this.saveItemConf({
                    x: this.hero.x,
                    y: this.hero.y
                }, this.hero_ts.walkingMode);
                this.m_gameReady = !0;
                w.default.init(this, u.default);
                this.btnShield = null != this.initCameraData && "" != this.initCameraData.time ? 60 * this.initCameraData.time : 90;
                this.schedule(this.upGame, 0);
                this.gameOperate = !1;
                if (this.m_isRestoredScene) {
                    var t = this;
                    this.delayHold(.35, function () {
                        t.resumeInterruptedDelayedEvents();
                    });
                }
                this.delayHold(.6, function () {
                    u.default.checkCrossEvent(c.default.mapIndex);
                });
            };
            e.prototype.setMasterOpacity = function (t, e) {
                if (t && null != e && "" != e) {
                    var o = this.layer_master.getChildByName(t);
                    o && (o.opacity = Number(e));
                }
            };
            e.prototype.chapterOver = function (t) {
                console.log("-------- chapterOver !!", t);
                if (this.m_chapterTransitionPending) return;
                this.m_chapterTransitionPending = !0;
                this.operateDir = 0;
                this.gameOperate = !0;
                // 章节结束事件可能正在 cc.Action 回调内；同一个 ActionManager 更新周期
                // 销毁物理目标会留下过期更新，因此推迟到当前动作帧结束后的调度周期清理。
                var e = this;
                this.scheduleOnce(function () {
                    e.goTransitionScene(t);
                }, .05);
            };
            e.prototype.alignLayer = function () {
                var t = this.camera_master.node.x, e = this.camera_master.node.y;
                // 剧情场景经常长时间静止，镜头未移动时不重复写入十余个视差节点变换。
                if (this.m_lastParallaxX === t && this.m_lastParallaxY === e) return;
                this.m_lastParallaxX = t;
                this.m_lastParallaxY = e;
                this.layer_static.x = t;
                if (this.layer_static0) {
                    this.layer_static0.x = t;
                    this.layer_static0.y = e;
                }
                if (this.layer_static1) {
                    this.layer_static1.x = t;
                    this.layer_static1.y = e;
                }
                this.layer_near0 && (this.layer_near0.x = .6 * -t);
                this.layer_near.x = .2 * -t;
                this.layer_far0.x = .15 * t;
                this.layer_far1.x = .25 * t;
                this.layer_far2.x = .5 * t;
                this.layer_far3.x = .8 * t;
                this.layer_static.y = e;
                this.layer_far0.y = .1 * e;
                this.layer_far1.y = .2 * e;
                this.layer_far2.y = .3 * e;
                this.layer_far3.y = .4 * e;
            };
            e.prototype.alignCamera = function () {
                // 部分剧情镜头在恢复操作后仍关闭跟随；主角越过水平安全区时自动恢复跟随，
                // 避免可控制角色走到视口边缘。
                if (!this.hero) {
                    this.alignLayer();
                    return;
                }
                var t = this.m_cameraTrackPosition;
                var e = this.cameraTargetForHero(this.hero);
                t.x = e.x;
                t.y = e.y;
                if (!this.isLockCamera && !this.isCheck && this.hero && Math.abs(this.hero.x - this.camera_master.node.x) > .28 * this.gameWidth) {
                    this.isLockCamera = !0;
                    this.camera_master_ts.restoreHeroTracking(t);
                    console.log("------------ 人物超出镜头安全区，已恢复跟随");
                }
                this.isLockCamera && this.camera_master_ts.trackPosAct(t);
                this.alignLayer();
            };
            e.prototype.directionForKey = function (t) {
                switch (t) {
                    case cc.macro.KEY.left:
                    case cc.macro.KEY.a:
                    case 1000:
                        return this.DIR_LEFT;
                    case cc.macro.KEY.right:
                    case cc.macro.KEY.d:
                    case 1001:
                        return this.DIR_RIGHT;
                    case cc.macro.KEY.up:
                    case cc.macro.KEY.w:
                    case 1003:
                        return this.DIR_UP;
                    case cc.macro.KEY.down:
                    case cc.macro.KEY.s:
                    case 1004:
                        return this.DIR_DOWN;
                    default:
                        return 0;
                }
            };
            e.prototype.latestKeyDirection = function () {
                var t = 0;
                for (var e in this.keyDirections) t = this.keyDirections[e];
                return t;
            };
            e.prototype.onKeyDown = function (t) {
                if (d.default.hasOpenPopup && d.default.hasOpenPopup()) return;
                var e = this.directionForKey(t.keyCode);
                if (e) {
                    this.keyDirections[t.keyCode] = e;
                    this.keyDirection = e;
                    this.dirCall(e);
                    return;
                }
                switch (t.keyCode) {
                    case cc.macro.KEY.r:
                        this.throwBack();
                        break;
                    case cc.macro.KEY.t:
                        this.startBack();
                }
            };
            e.prototype.onKeyUp = function (t) {
                var e = this.directionForKey(t.keyCode);
                if (e) {
                    delete this.keyDirections[t.keyCode];
                    e = this.latestKeyDirection();
                    this.keyDirection = e;
                    e ? this.dirCall(e) : this.dirEndCall(this.operateDir);
                    return;
                }
                t.keyCode == cc.macro.KEY.t && this.endBack();
            };
            e.prototype.initControl = function () {
                cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
                cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
                this.fitFixedHud();
                this.btn_user.on(cc.Node.EventType.TOUCH_START, this.startBack, this);
                this.btn_user.on(cc.Node.EventType.TOUCH_END, this.endBack, this);
                this.btn_user.on(cc.Node.EventType.TOUCH_CANCEL, this.endBack, this);
                this.btn_throw.on(cc.Node.EventType.TOUCH_START, this.throwBack, this);
                this.btn_climb.on(cc.Node.EventType.TOUCH_START, this.startClimbBack, this);
                // 全屏 Spine 层在 Android 节点命中测试中会覆盖地面，因此地面改用不吞噬
                // 事件的全局监听器。
                this.installGlobalTouchControls();
                this.setThrowBtn(!1);
                this.btn_user.active = !1;
                this.btn_climb.active = !1;
                this.m_partTexture = new cc.RenderTexture();
                this.m_partTexture.setPremultiplyAlpha(!0);
                this.m_partTexture.initWithSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
                this.camera_part.getComponent(cc.Camera).targetTexture = this.m_partTexture;
                this.m_partSpriteFrame = new cc.SpriteFrame();
                this.m_partSpriteFrame.setTexture(this.m_partTexture);
                this.texture_sp.node.scaleY = -1;
                this.texture_sp.spriteFrame = this.m_partSpriteFrame;
            };
            e.prototype.fitFixedHud = function () {
                var e = cc.view.getVisibleSize(), o = this.camera_ui, i = cc.game.groupList ? cc.game.groupList.indexOf("ui") : 2;
                i < 0 && (i = 2);
                this.btn_story = this.btn_story || this.node.getChildByName("btn_story");
                this.btn_goods = this.btn_goods || this.node.getChildByName("btn_goods");
                var n = function (t) {
                    if (!t) return;
                    t.groupIndex = i;
                    for (var e = 0; e < t.childrenCount; e++) n(t.children[e]);
                }, a = function (e, i, n) {
                    if (!e || !e.parent || !o) return;
                    var s = e.getComponent(cc.Widget);
                    s && (s.enabled = !1);
                    var r = e.getComponent(cc.Button);
                    r && (r.enabled = !1);
                    var c = o.getScreenToWorldPoint(cc.v2(i, n)), l = e.parent.convertToNodeSpaceAR(c);
                    e.setPosition(l.x, l.y);
                    e.zIndex = cc.macro.MAX_ZINDEX;
                };
                n(this.btn_pass);
                n(this.btn_tips);
                n(this.btn_story);
                n(this.btn_goods);
                a(this.btn_pass, 58, e.height - 58);
                a(this.btn_tips, e.width - 70, e.height - 105);
                a(this.btn_goods, e.width - 70, e.height - 70);
                a(this.btn_story, e.width - 70, e.height - 190);
            };
            e.prototype.getFixedUiTouch = function (t) {
                var e = t.getLocation(), o = this.camera_ui, i = [this.btn_pass, this.btn_tips, this.btn_story, this.btn_goods], n = null, a = Number.MAX_VALUE;
                for (var s = 0; s < i.length; s++) {
                    var r = i[s];
                    if (r && r.activeInHierarchy) {
                        var c = r.getBoundingBoxToWorld(), l = o ? o.getWorldToScreenPoint(cc.v2(c.xMin, c.yMin)) : cc.v2(c.xMin, c.yMin), h = o ? o.getWorldToScreenPoint(cc.v2(c.xMax, c.yMax)) : cc.v2(c.xMax, c.yMax), d = cc.rect(Math.min(l.x, h.x) - 12, Math.min(l.y, h.y) - 12, Math.abs(h.x - l.x) + 24, Math.abs(h.y - l.y) + 24);
                        if (d.contains(e)) {
                            var p = e.x - (d.xMin + d.xMax) / 2, u = e.y - (d.yMin + d.yMax) / 2, m = p * p + u * u;
                            m < a && (a = m, n = r);
                        }
                    }
                }
                return n;
            };
            e.prototype.installGlobalTouchControls = function () {
                var t = this;
                // 2.4.15 访问已移除的 cc.eventManager 属性会主动记录 ERROR；底层兼容
                // 分发器仍由 cc.internal 暴露，使用同一实例可保留“不吞噬触摸”的能力。
                var e = cc.internal && cc.internal.eventManager;
                if (!e) {
                    console.error("[GameplaySceneController] 全局触摸分发器不可用");
                    return;
                }
                this.m_globalTouchListener && e.removeListener(this.m_globalTouchListener);
                this.m_globalTouchListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: !1,
                    onTouchBegan: function (e) {
                        // 弹窗使用 UI 镜头，而全局监听位于节点分发器下层；显式检查模态状态，
                        // 防止一次触摸既关闭拾取卡又触发底层移动、使用或暂停。
                        if (d.default.hasOpenPopup && d.default.hasOpenPopup()) {
                            t.controlCancel();
                            return !1;
                        }
                        var o = t.getFixedUiTouch(e);
                        if (o) {
                            o == t.btn_pass ? t.passBack() : o == t.btn_tips ? t.tipsBack() : o == t.btn_story ? t.storyBack() : o == t.btn_goods && t.propBack();
                            return !1;
                        }
                        o = t.getUiControlTouch(e);
                        if (o) {
                            o == t.btn_user ? t.startBack() : o == t.btn_climb ? t.startClimbBack() : o == t.btn_throw && t.throwBack();
                            return !1;
                        }
                        o = t.getCurrentInteractionTouch(e);
                        if (o) {
                            t.startBack();
                            return !1;
                        }
                        o = t.getInteractiveBubble(e);
                        if (o) {
                            o.bubbleBack();
                            return !1;
                        }
                        if (t.isUiControlTouch(e)) return !1;
                        t.controlStart(e);
                        return !0;
                    },
                    onTouchMoved: function (e) {
                        t.controlMove(e);
                    },
                    onTouchEnded: function (e) {
                        t.controlEnd(e);
                    },
                    onTouchCancelled: function () {
                        t.controlCancel();
                    }
                });
                e.addListener(this.m_globalTouchListener, -1);
            };
            e.prototype.getCurrentInteractionTouch = function (t) {
                var e = u.default.cItem, o = e && e.activeInHierarchy && e.getComponent("InteractiveObject"), i = o && o.getOpType();
                if (!e || !o || !i || !this.hero || !this.camera_master) return null;
                var n = e.x - this.hero.x, a = e.y - this.hero.y;
                if (Math.abs(n) > 300 || Math.abs(a) > 300) return null;
                var s = this.camera_master.getComponent(cc.Camera), r = e.parent ? e.parent.convertToWorldSpaceAR(e.position) : e.position, c = s ? s.getWorldToScreenPoint(r) : r, l = t.getLocation();
                // 命中区覆盖可见躯干和腿部，同时保留周围道路用于移动；只绑定当前 cItem，
                // 避免无关景物消耗触摸。
                return cc.rect(c.x - 110, c.y - 45, 220, 310).contains(l) ? o : null;
            };
            e.prototype.getInteractiveBubble = function (t) {
                if (!this.itemMap) return null;
                var e = t.getLocation(), o = e, i = this.camera_master && this.camera_master.getComponent(cc.Camera), n = cc.view.getScaleX ? cc.view.getScaleX() : 1, a = cc.view.getScaleY ? cc.view.getScaleY() : 1;
                // 物品气泡位于滚动世界中，需用镜头投影后的触点比较世界边界。Android
                // JSB 与 Creator 镜头在这里都使用设计坐标，额外乘除缩放会把远处道路
                // 触摸错误折算到附近入口气泡。
                i && (o = i.getScreenToWorldPoint(e));
                var r = [e];
                var l = null, h = Number.MAX_VALUE, d = null;
                for (var p in this.itemMap) {
                    var u = this.itemMap[p], m = u && u.getComponent("InteractiveObject"), _ = m && m.node_bubble;
                    if (_ && _.activeInHierarchy) {
                        var f = _.getBoundingBoxToWorld(), g = _.getChildByName("Background"), v = g && g.getBoundingBoxToWorld();
                        if (i) {
                            // Creator 原生镜头投影与 Touch 返回同一设计坐标；再次除以视图
                            // 缩放会让可见 NPC 气泡向左上偏移数百像素。
                            var b = v || f, y = i.getWorldToScreenPoint(cc.v2(b.xMin, b.yMin)), w = i.getWorldToScreenPoint(cc.v2(b.xMax, b.yMax));
                            // 适量设计坐标边距兼顾手指点击，又不会在抬高的物品提示周围形成
                            // 不可见的半屏阻挡。
                            var S = 26, I = 32, C = cc.rect(Math.min(y.x, w.x) - S, Math.min(y.y, w.y) - I, Math.abs(w.x - y.x) + 2 * S, Math.abs(w.y - y.y) + 2 * I), M = cc.v2((C.xMin + C.xMax) / 2, (C.yMin + C.yMax) / 2);
                            d || (d = p + " touch=" + Math.round(e.x) + "," + Math.round(e.y) + " projected=" + Math.round(C.xMin) + "," + Math.round(C.yMin) + "," + Math.round(C.width) + "," + Math.round(C.height) + " scale=" + n.toFixed(3) + "," + a.toFixed(3));
                            for (var x = 0; x < r.length; x++) if (C.contains(r[x])) {
                                var T = cc.v2(r[x].x - M.x, r[x].y - M.y).magSqr();
                                T < h && (h = T, l = m);
                            }
                        }
                        if (f.contains(e) || f.contains(o) || v && (v.contains(e) || v.contains(o))) {
                            var k = cc.v2(e.x - f.x - f.width / 2, e.y - f.y - f.height / 2).magSqr();
                            k < h && (h = k, l = m);
                        }
                    }
                }
                if (l) {
                    console.log("------------ 点击命中交互气泡");
                    return l;
                }
                d && console.log("------------ 交互气泡未命中 " + d);
                return null;
            };
            e.prototype.getUiControlTouch = function (t) {
                var e = t.getLocation(), o = cc.view.getVisibleSize(), i = [{
                    node: this.btn_user,
                    x: o.width - 105,
                    y: 105
                }, {
                    node: this.btn_climb,
                    x: o.width - 245,
                    y: 105
                }, {
                    node: this.btn_throw,
                    x: o.width - 105,
                    y: 245
                }], n = null, a = Number.MAX_VALUE;
                // 旧预制体在约 130 像素圆盘外还有约 283 像素透明节点，原生 Button
                // 边界会吞掉附近道路触摸。三个 HUD 控件均已按圆心定位，84 像素半径
                // 足以兼顾准确性和手指操作。
                for (var s = 0; s < i.length; s++) {
                    var r = i[s], c = r.node, l = e.x - r.x, h = e.y - r.y, p = l * l + h * h;
                    c && c.activeInHierarchy && p <= 84 * 84 && p < a && (a = p, n = c);
                }
                n && console.log("------------ 点击命中操作按钮 " + n.name);
                return n;
            };
            e.prototype.isUiControlTouch = function (t) {
                if (this.getUiControlTouch(t)) return !0;
                var e = t.getLocation(), o = [this.btn_user, this.btn_throw, this.btn_climb, this.btn_pass, this.btn_tips, this.btn_story, this.btn_goods];
                for (var i = 0; i < o.length; i++) {
                    var n = o[i];
                    if (n && n.activeInHierarchy && n.getBoundingBoxToWorld().contains(e)) return !0;
                }
                return !1;
            };
            e.prototype.onDestroy = function () {
                cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
                cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
                this.m_canvasNode && this.m_canvasTouchStart && this.m_canvasNode.off(cc.Node.EventType.TOUCH_START, this.m_canvasTouchStart, this);
                this.m_canvasNode = null;
                this.m_canvasTouchStart = null;
                this.btn_user && this.btn_user.off(cc.Node.EventType.TOUCH_START, this.startBack, this);
                this.btn_user && this.btn_user.off(cc.Node.EventType.TOUCH_END, this.endBack, this);
                this.btn_user && this.btn_user.off(cc.Node.EventType.TOUCH_CANCEL, this.endBack, this);
                this.btn_throw && this.btn_throw.off(cc.Node.EventType.TOUCH_START, this.throwBack, this);
                this.btn_climb && this.btn_climb.off(cc.Node.EventType.TOUCH_START, this.startClimbBack, this);
                var e = cc.internal && cc.internal.eventManager;
                this.m_globalTouchListener && e && e.removeListener(this.m_globalTouchListener);
                this.m_globalTouchListener = null;
                this.m_onGameHide && cc.game.off(cc.game.EVENT_HIDE, this.m_onGameHide, this);
                this.m_onGameHide = null;
                this.m_onGameShow && cc.game.off(cc.game.EVENT_SHOW, this.m_onGameShow, this);
                this.m_onGameShow = null;
                u.default.resetTransientState();
                l.default.stopSceneSounds();
                w.default.destroy(this);
                // Cocos 会在节点树开始拆除后调用 onDestroy；序列化子节点引用此时可能仍
                // 为真，但内部组件数组已消失。访问引擎对象前必须防御检查，避免快速切场
                // 查询或销毁无效原生对象。
                if (this.camera_part && cc.isValid(this.camera_part, !0)) {
                    var t = this.camera_part.getComponent(cc.Camera);
                    t && cc.isValid(t, !0) && (t.targetTexture = null);
                }
                this.texture_sp && cc.isValid(this.texture_sp, !0) && (this.texture_sp.spriteFrame = null);
                this.m_partSpriteFrame && cc.isValid(this.m_partSpriteFrame, !0) && this.m_partSpriteFrame.destroy();
                this.m_partSpriteFrame = null;
                this.m_partTexture && cc.isValid(this.m_partTexture, !0) && this.m_partTexture.destroy();
                this.m_partTexture = null;
            };
            e.prototype.isGameSurfaceTouch = function (t) {
                return t.target === this.node || t.target === this.layer_dir || t.target && "ani_node" === t.target.name;
            };
            e.prototype.surfaceControlStart = function (t) {
                this.isGameSurfaceTouch(t) && this.controlStart(t);
            };
            e.prototype.surfaceControlMove = function (t) {
                this.isGameSurfaceTouch(t) && this.controlMove(t);
            };
            e.prototype.surfaceControlEnd = function (t) {
                this.isGameSurfaceTouch(t) && this.controlEnd(t);
            };
            e.prototype.surfaceControlCancel = function (t) {
                this.isGameSurfaceTouch(t) && this.controlCancel(t);
            };
            e.prototype.controlCancel = function () {
                if (!this.isCheck) {
                    this.nPos = null;
                    this.node_control.active = !1;
                    this.controlAngle = 999;
                    this.btn_control.x = 0;
                    this.pan_control.angle = 0;
                    this.btn_light.active = !1;
                    this.dirEndCall(this.operateDir);
                }
            };
            e.prototype.resetActiveInput = function () {
                var t = this.operateDir;
                this.keyDirections = {};
                this.keyDirection = 0;
                this.nPos = null;
                this.m_touchState = 0;
                this.isGesture = !1;
                this.isToucheLong = 0;
                this.m_tochDir = 0;
                this.operateDir = 0;
                if (this.node_control) {
                    this.node_control.active = !1;
                    this.btn_control && (this.btn_control.x = 0);
                    this.pan_control && (this.pan_control.angle = 0);
                    this.btn_light && (this.btn_light.active = !1);
                    this.controlAngle = 999;
                }
                if (this.hero_ts) if (t == this.DIR_UP || t == this.DIR_DOWN) {
                    this.hero_ts.targetY = null;
                    this.hero_ts.stopMoveLadder();
                } else {
                    this.hero_ts.targetX = null;
                    this.hero_ts.stopMove();
                }
            };
            e.prototype.revalidateInteractionStack = function () {
                if (!this.hero || this.isCheck || this.gameOperate || d.default.hasOpenPopup && d.default.hasOpenPopup()) return;
                // 交互候选仍只来自物理接触开始/结束。本轮只清理节点销毁、传送或漏回调
                // 产生的过期接触，不会主动发现远处地图物体。
                for (var t = u.default.itemStack.length - 1; t >= 0; t--) {
                    var e = u.default.itemStack[t];
                    if (!e || !e.activeInHierarchy || Math.abs(e.x - this.hero.x) > 300 || Math.abs(e.y - this.hero.y) > 300) {
                        u.default.itemStack.splice(t, 1);
                    }
                }
                u.default.selectClosestItem();
            };
            e.prototype.upGame = function () {
                this.m_isTimeTouch++;
                36e3 == this.m_isTimeTouch && this.passBack();
                this.btnShield > 0 && this.btnShield--;
                if (++this.m_interactionValidationFrame >= 12) {
                    this.m_interactionValidationFrame = 0;
                    this.revalidateInteractionStack();
                }
                if (++this.m_objectiveFrame >= 30) {
                    this.m_objectiveFrame = 0;
                    w.default.update(this, u.default);
                }
                if (this.gestureCount < 2 * c.default.G_COUNT) {
                    this.gestureCount++;
                    if (!this.m_isThrow && null != this.nPos && !this.isGesture && this.gestureCount == c.default.G_COUNT + 1) {
                        this.gestureCount = 0;
                        var t = this.nPos.x + this.camera_master.node.x;
                        if (Math.abs(t - this.hero.x) > 30) {
                            t = t > this.hero.x ? 9999 : -9999;
                            this.beginHeroMove(t, this.nPos.y);
                        } else {
                            this.nPos = null;
                            this.beginHeroMove(this.hero.x, this.hero.y);
                        }
                    }
                }
                this.alignCamera();
                if (this.m_moveSavePending && this.hero_ts && null == this.hero_ts.targetX && null == this.hero_ts.targetY && !this.isCheck && !this.gameOperate) {
                    // 连续短点地面合并为一次存档，进入后台时仍强制立即快照。
                    if (++this.m_moveSaveFrames >= 45) {
                        this.m_moveSavePending = !1;
                        this.m_moveSaveFrames = 0;
                        this.m_progressSavePending = !1;
                        this.m_progressSaveFrames = 0;
                        this.saveItemConf({
                            x: this.hero.x,
                            y: this.hero.y
                        }, this.hero_ts.walkingMode);
                        console.log("------------ 移动落点已自动存档");
                    }
                } else this.m_moveSaveFrames = 0;
                if (this.m_progressSavePending && this.hero_ts && null == this.hero_ts.targetX && null == this.hero_ts.targetY && !this.isCheck && !this.gameOperate && !(d.default.hasOpenPopup && d.default.hasOpenPopup())) {
                    if (++this.m_progressSaveFrames >= 30) {
                        this.m_progressSavePending = !1;
                        this.m_progressSaveFrames = 0;
                        this.saveItemConf({
                            x: this.hero.x,
                            y: this.hero.y
                        }, this.hero_ts.walkingMode);
                        console.log("------------ 交互进度已自动存档");
                    }
                } else this.m_progressSavePending && (this.m_progressSaveFrames = 0);
                if (!(this.isCheck || this.btnShield > 20)) {
                    if (this.texture_sp.node.parent.parent.active) {
                        this.cameraIndex % 3 == 0 && this.setCamera_part();
                        this.cameraIndex++;
                    } else this.cameraIndex = 0;
                }
            };
            e.prototype.setCamera_part = function () {
                this.camera_part.getComponent(cc.Camera).render();
            };
            e.prototype.refreshControl = function (t) {
                this.node_control.setPosition(this.touchX - this.gameWidth / 2, this.touchY - this.gameHeight / 2);
                if (1 != t) {
                    var e = h.default.getAngle({
                        x: this.touchX,
                        y: this.touchY
                    }, {
                        x: this.tx,
                        y: this.ty
                    });
                    this.btn_control.x = 79;
                    this.controlAngle = e;
                    this.pan_control.angle = e;
                    this.btn_light.active = !0;
                    var o;
                    o = this.controlAngle <= 45 && this.controlAngle >= -45 ? this.DIR_RIGHT : this.controlAngle > 45 && this.controlAngle < 135 ? this.DIR_UP : this.controlAngle > -135 && this.controlAngle < -45 ? this.DIR_DOWN : this.DIR_LEFT;
                    if (this.operateDir != o) {
                        0 != this.operateDir && this.dirEndCall(this.operateDir);
                        this.dirCall(o);
                    }
                }
            };
            e.prototype.findTouchHero = function (t) {
                var e = 0;
                t.x <= this.hero_ts.node.x + 40 && t.y >= this.hero_ts.node.y && e++;
                t.x <= this.hero_ts.node.x + 20 && t.y <= this.hero_ts.node.y + 180 && e++;
                t.x >= this.hero_ts.node.x - 40 && t.y >= this.hero_ts.node.y && e++;
                t.x >= this.hero_ts.node.x - 40 && t.y <= this.hero_ts.node.y + 180 && e++;
                return e >= 4;
            };
            e.prototype.refreshThrow = function (t) {
                t.x - this.m_TouchPos.x > 0 ? (this.hero_ts.isRight, this.m_forceX > this.m_MiniX && (this.m_forceX -= 50)) : this.m_TouchPos.x - t.x > 0 && (this.hero_ts.isRight,
                    this.m_forceX < this.m_MaxX && (this.m_forceX += 50));
                t.y - this.m_TouchPos.y > 0 ? this.m_forceY > this.m_MiniY && (this.m_forceY -= 50) : this.m_TouchPos.y - t.y > 0 && this.m_forceY < this.m_MaxY && (this.m_forceY += 50);
                this.updateLine();
                this.m_TouchPos = t;
            };
            e.prototype.controlStart = function (t) {
                if (!(this.isCheck || this.btnShield > 0)) {
                    this.btnShield = 20;
                    this.isGesture = !1;
                    this.gestureCount = 0;
                    var e = t.getLocation();
                    this.touchX = e.x;
                    this.touchY = e.y;
                    this.nPos = this.layer_master.convertToNodeSpaceAR(e);
                    this.node_control.active = !0;
                    this.refreshControl(1);
                    if (this.findTouchHero({
                        x: this.nPos.x + this.camera_master.node.x,
                        y: this.nPos.y + this.camera_master.node.y
                    }) && this.hero_ts.goods) if ("1" == this.hero_ts.goods.isthrow) {
                        this.m_TouchPos = {
                            x: this.touchX,
                            y: this.touchY
                        };
                        this.m_isThrow = 1;
                    } else "3" == this.hero_ts.goods.isthrow && (this.m_touchState = 1);
                    return !0;
                }
            };
            e.prototype.controlMove = function (t) {
                if (!this.isCheck) {
                    var e = t.getLocation();
                    this.tx = e.x;
                    this.ty = e.y;
                    this.nPos = this.layer_master.convertToNodeSpaceAR(e);
                    if (this.findTouchHero({
                        x: this.nPos.x + this.camera_master.node.x,
                        y: this.nPos.y + this.camera_master.node.y
                    }) || !(this.tx - this.touchX >= 50 || this.touchX - this.tx >= 50) || 1 != this.m_isThrow && 3 != this.m_isThrow) {
                        if (this.findTouchHero({
                            x: this.nPos.x + this.camera_master.node.x,
                            y: this.nPos.y + this.camera_master.node.y
                        }) && 2 == this.m_isThrow) {
                            this.m_isThrow = 3;
                            if (this.m_throwAry.length > 0) for (var o = 0; o < this.m_throwAry.length; o++) this.m_throwAry[o].destroy();
                            this.m_throwAry = [];
                            this.m_touchState = 0;
                        } else if (!this.isGesture && this.gestureCount < c.default.G_COUNT && Math.sqrt(Math.pow(Math.abs(this.tx - this.touchX), 2) + Math.pow(Math.abs(this.ty - this.touchY), 2)) > c.default.G_RANGE) {
                            this.isGesture = !0;
                            this.checkGesture();
                        }
                    } else {
                        this.nPos.x + this.camera_master.node.x > this.hero_ts.node.x ? this.hero_ts.isRight = !1 : this.hero_ts.isRight = !0;
                        this.throwBack();
                        this.m_isThrow = 2;
                    }
                    this.refreshControl(2);
                    2 == this.m_isThrow && 1 == this.isToucheLong && this.refreshThrow({
                        x: this.tx,
                        y: this.ty
                    });
                }
            };
            e.prototype.controlEnd = function (t) {
                var e = this;
                if (!this.isCheck) {
                    this.nPos = null;
                    this.node_control.active = !1;
                    this.controlAngle = 999;
                    this.btn_control.x = 0;
                    this.pan_control.angle = 0;
                    this.btn_light.active = !1;
                    this.dirEndCall(this.operateDir);
                    if (1 == this.isToucheLong && 2 == this.m_isThrow) this.hero_ts.setState(c.default.HERO_TOUZI2, function () {
                        e.setThrow();
                    }); else if (3 == this.m_isThrow) {
                        console.log("==取消投掷==");
                        this.setThrowEnd();
                        this.m_isThrow = 0;
                        this.m_TouchPos = null;
                    } else if (!this.isGesture) if (1 == this.m_touchState) {
                        console.log("====点击主角===");
                        this.m_touchState = 0;
                        this.gameOperate = !0;
                        this.instatThrow();
                    } else {
                        var o = t.getLocation(), i = this.layer_master.convertToNodeSpaceAR(o);
                        this.beginHeroMove(i.x / this.camera_master.zoomRatio + this.camera_master.node.x, i.y / this.camera_master.zoomRatio + this.camera_master.node.y);
                    }
                }
            };
            e.prototype.checkGesture = function () {
                if (!(this.isCheck || this.hero_ts.goods && 3 != this.hero_ts.goods.isthrow)) {
                    var t = null, e = (h.default.getAngle({
                        x: this.touchX,
                        y: this.touchY
                    }, {
                        x: this.tx,
                        y: this.ty
                    }), 0);
                    if (this.controlAngle <= 45 && this.controlAngle >= -45) {
                        t = c.default.OP_ATT;
                        e = this.DIR_RIGHT;
                        console.log("------------------ 形成手势！！！！！--- 右");
                    } else if (this.controlAngle > 45 && this.controlAngle < 135) {
                        t = c.default.OP_CLIMB;
                        e = this.DIR_UP;
                        console.log("------------------ 形成手势！！！！！--- 上");
                    } else if (this.controlAngle > -135 && this.controlAngle < -45) {
                        e = this.DIR_DOWN;
                        console.log("------------------ 形成手势！！！！！--- 下");
                    } else {
                        t = c.default.OP_ATT;
                        e = this.DIR_LEFT;
                        console.log("------------------ 形成手势！！！！！--- 左");
                    }
                    null != t && u.default.analysisEvent(t, e);
                }
            };
            e.prototype.tryDeadTreeDescent = function (t) {
                var e = this;
                if ("scenes_d2_2" != this.mapName || !this.hero || !this.hero_ts || t <= this.hero.x + 50 || this.hero.x < -1650 || this.hero.x > -1500 || this.hero.y < -50) return !1;
                var o = this.itemMap && this.itemMap[11], i = o && o.getComponent("InteractiveObject"), n = i && i.getConf();
                if (!n || 7 != Number(n.lastEvent)) return !1;
                // 倒树连接上层平台与瀑布下路，但其动画碰撞形状无法由静态地图碰撞体复现，
                // 普通行走会卡在 x=-1593。持续向右输入时执行一次短距离单向坡道穿越。
                this.changeForceWait(!0);
                this.hero_ts.setEntity(!1);
                this.hero_ts.alignPos({
                    // 落点越过瀑布岩石的宽静态碰撞体；x=-900 看似空旷仍会与右缘重叠。
                    x: -600,
                    y: -530
                }, function () {
                    e.hero_ts.setEntity(!0);
                    e.changeForceWait(!1);
                    e.isLockCamera = !0;
                    e.camera_master_ts.restoreHeroTracking(e.cameraTargetForHero(e.hero));
                    e.saveItemConf({
                        x: e.hero.x,
                        y: e.hero.y
                    }, e.hero_ts.walkingMode);
                    console.log("------------ 已沿枯树进入瀑布下层");
                }, 2.8, "walk");
                return !0;
            };
            e.prototype.beginHeroMove = function (t, e) {
                if (d.default.hasOpenPopup && d.default.hasOpenPopup()) return;
                if (this.hero_ts && this.hero) {
                    if (this.tryDeadTreeDescent(t)) return;
                    // 个别脚本特写缺少对应恢复事件；自由输入恢复后，将主角和附近交互界面
                    // 保持在可玩安全区内。
                    if (!this.gameOperate) {
                        this.isLockCamera = !0;
                        this.camera_master_ts.restoreHeroTracking(this.cameraTargetForHero(this.hero));
                    }
                    // 剧情事件可能取消 role_1.moveAct() 调度，新玩家输入在设置目标前必须
                    // 重新启用移动更新。
                    this.hero_ts.setControl(!0);
                    this.hero_ts.posMove(t, e);
                    this.m_moveSavePending = !0;
                    this.m_moveSaveFrames = 0;
                }
            };
            e.prototype.requestProgressSave = function () {
                if (this.m_gameReady) {
                    this.m_progressSavePending = !0;
                    this.m_progressSaveFrames = 0;
                    w.default.update(this, u.default);
                }
            };
            e.prototype.onRequiredItemDelivered = function (deliveredItem) {
                var t = this;
                r.default.cleanHeroItem();
                this.requestProgressSave();
                console.log("[Gameplay] delivered task item and cleared carry state: " + deliveredItem);
                if ("scenes_d3_2" === this.mapName) this.delayHold(1.1, function () {
                    var e = w.default._distributionProgress(t);
                    if (e && e.done >= 2 && e.done < e.total && !t.gameOperate && t.hero_ts && !t.hero_ts.goods) {
                        t.hero_ts.setRoleTips(!0, "label", {
                            txt: "分发进度 " + e.done + "/" + e.total + "\n自动返回物资箱区"
                        }, {
                            num: 0,
                            times: 0,
                            interval: 0,
                            pos: "56|340"
                        });
                        t.delayHold(1.8, function () {
                            t.hero_ts && t.hero_ts.setRoleTips(!1);
                        });
                        t.beginHeroMove(4380, t.hero.y);
                    }
                });
            };
            e.prototype.dirCall = function (t) {
                if (this.isCheck) this.operateDir = 0; else {
                    this.m_tochDir = t;
                    switch (t) {
                        case this.DIR_UP:
                            this.operateDir = this.DIR_UP;
                            this.hero_ts && this.hero_ts.ladderState && this.beginHeroMove(this.hero.x, 999999);
                            break;

                        case this.DIR_DOWN:
                            this.operateDir = this.DIR_DOWN;
                            this.hero_ts && this.hero_ts.ladderState && this.beginHeroMove(this.hero.x, -999999);
                            break;

                        case this.DIR_LEFT:
                            this.operateDir = this.DIR_LEFT;
                            this.beginHeroMove(-999999, this.hero.y);
                            break;

                        case this.DIR_RIGHT:
                            this.operateDir = this.DIR_RIGHT;
                            this.beginHeroMove(999999, this.hero.y);
                    }
                }
            };
            e.prototype.dirEndCall = function (t) {
                if (this.keyDirection) {
                    this.dirCall(this.keyDirection);
                    return;
                }
                2 == this.isToucheLong && (this.isToucheLong = 1);
                this.m_tochDir = 0;
                if (this.isCheck || this.isToucheLong && this.isToucheLong < 3) this.operateDir != this.DIR_RIGHT && this.operateDir != this.DIR_LEFT || (this.operateDir = 0); else {
                    switch (t) {
                        case this.DIR_UP:
                        case this.DIR_DOWN:
                        case this.DIR_LEFT:
                        case this.DIR_RIGHT:
                    }
                    this.camera_master_ts.initTrack(this.hero.position);
                    this.operateDir = 0;
                }
                if (this.hero_ts) if (t == this.DIR_UP || t == this.DIR_DOWN) {
                    this.hero_ts.targetY = null;
                    this.hero_ts.stopMoveLadder();
                } else (t == this.DIR_LEFT || t == this.DIR_RIGHT) && this.hero_ts.stopMove();
            };
            e.prototype.insPoint = function () {
                var t = new cc.Node();
                t.addComponent(cc.Sprite);
                var e = t.getComponent(cc.Sprite);
                this.setSpriteFrame(e, "public/image_tz5");
                return t;
            };
            e.prototype.updateLine = function (t) {
                void 0 === t && (t = 1);
                var e = 0, o = 0;
                if (this.m_throwAry.length <= 0) for (var i = 0; i < 50; i++) {
                    e += .25;
                    o += .09;
                    var n = this.hero_ts.isRight ? this.m_forceX / 16.1 * o + this.hero.x - 20 : -this.m_forceX / 16.1 * o + this.hero.x + 20, a = this.m_forceY / 16.1 * o - 200 * o * o + this.hero.y + 160;
                    this.m_ThrowPos.push([n, a]);
                    if (i < 7) {
                        (c = this.insPoint()).zIndex = this.m_MaxZindex;
                        c.setParent(this.m_ParentNode);
                        var s = this.hero_ts.isRight ? this.m_forceX / 16.1 * e + this.hero.x - 20 : -this.m_forceX / 16.1 * e + this.hero.x + 20, r = this.m_forceY / 16.1 * e - 200 * e * e + this.hero.y + 160;
                        c.setPosition(s, r);
                        this.m_throwAry.push(c);
                    }
                } else for (i = 0; i < 50; i++) {
                    e += .25;
                    o += .09;
                    if (i < 7) {
                        var c = this.m_throwAry[i];
                        s = this.hero_ts.isRight ? this.m_forceX / 16.1 * e + this.hero.x - 20 : -this.m_forceX / 16.1 * e + this.hero.x + 20,
                            r = this.m_forceY / 16.1 * e - 200 * e * e + this.hero.y + 160;
                        c.setPosition(s, r);
                    }
                    n = this.hero_ts.isRight ? this.m_forceX / 16.1 * o + this.hero.x - 20 : -this.m_forceX / 16.1 * o + this.hero.x + 20,
                        a = this.m_forceY / 16.1 * o - 200 * o * o + this.hero.y + 160;
                    this.m_ThrowPos[i] = [n, a];
                }
            };
            e.prototype.throwBack = function () {
                if (d.default.hasOpenPopup && d.default.hasOpenPopup()) return;
                if (!(this.isCheck || this.btnShield > 0) && this.hero_ts.goods) {
                    this.btnShield = 30;
                    this.operateDir = 0;
                    this.hero_ts.stopMove();
                    this.isToucheLong = 1;
                    this.updateLine(1);
                    this.hero_ts.setState(c.default.HERO_TOUZI);
                }
            };
            e.prototype.startBack = function () {
                if (d.default.hasOpenPopup && d.default.hasOpenPopup()) return;
                // 计时玩法运行时会主动锁定场景，但可见操作键仍要接受第二次按下；否则
                // 只能点击很小的世界气泡，HUD 会表现得像失效。
                var t = u.default.cItem, e = t && t.getComponent(timingEvent.default), o = !!(e && e.isTiming);
                if (!((this.isCheck && !o) || this.isToucheLong || this.btnShield > 0)) {
                    this.btnShield = 25;
                    u.default.analysisEvent(this.interactMod);
                }
            };
            e.prototype.endBack = function () { };
            e.prototype.startClimbBack = function () {
                if (d.default.hasOpenPopup && d.default.hasOpenPopup()) return;
                if (!(this.isCheck || this.btnShield > 0)) {
                    this.btnShield = 25;
                    if (this.m_guideNode.x < 1e4) {
                        this.btn_climb.active = !1;
                        this.m_guideNode.x = 1e4;
                    }
                    u.default.analysisEvent(this.specialMode);
                }
            };
            e.prototype.createExplodeBox = function (t, e) {
                var o = this;
                void 0 === e && (e = !0);
                this.createPrefab("effect/explodeBox", function (i) {
                    if (null != i) {
                        var n = i.getComponent("ExplosiveCrate");
                        n.initData();
                        i.x = o.m_throwNode.x;
                        i.y = o.m_throwNode.y + 30;
                        i.zIndex = o.m_MaxZindex;
                        t.addChild(i);
                        n.clear();
                        e && o.delayHold(1, function () {
                            o.cameraAct({
                                scale: 1,
                                time: .7
                            });
                            o.isToucheLong = 0;
                        });
                    }
                    o.initTouchData();
                });
            };
            e.prototype.setThrowEnd = function (t) {
                var e = this;
                void 0 === t && (t = !1);
                if (3 == this.isToucheLong) if (t) {
                    this.delayHold(.2, function () {
                        e.cameraAct({
                            scale: 1,
                            time: .7
                        });
                        e.isToucheLong = 0;
                    });
                    this.initTouchData();
                } else this.createExplodeBox(this.layer_master); else {
                    this.m_guideNode.opacity = 0;
                    this.hero_ts.setHand(1);
                    this.hero_ts.setSwitchSolt();
                    this.m_tochDir = 0;
                    if (this.m_throwAry.length > 0) for (var o = 0; o < this.m_throwAry.length; o++) this.m_throwAry[o].destroy();
                    this.m_throwAry = [];
                    this.initTouchData();
                    this.hero_ts.setState(c.default.HERO_STANDBY);
                    this.cameraAct({
                        scale: 1,
                        time: .7
                    });
                    this.isToucheLong = 0;
                }
            };
            e.prototype.setThrow = function () {
                var t = this;
                this.setThrowBtn(!1);
                this.isToucheLong = 3;
                l.default.playSound("grenadeso.mp3");
                if (this.m_throwAry.length > 0) for (var e = 0; e < this.m_throwAry.length; e++) this.m_throwAry[e].destroy();
                this.m_throwAry = [];
                this.m_throwNode && this.m_throwNode.destroy();
                this.m_throwNode = null;
                this.hero_ts.setHand(1);
                this.createPrefab("throw/image_sl", function (e) {
                    if (null != e && t.m_ThrowPos[0]) {
                        e.x = t.m_ThrowPos[0][0];
                        e.y = t.m_ThrowPos[0][1];
                        e.zIndex = t.m_MaxZindex;
                        var o = e.getComponent("GrenadeCrate");
                        o.initData(function () {
                            t.m_throwNode.stopAllActions();
                            t.unschedule(t.timeCallBack);
                            t.m_throwIndex = 0;
                            o.m_goods && 1 == o.m_goods.id ? o.BoomBack() : t.delayHold(.18, function () {
                                t.setThrowEnd(!0);
                            });
                        }, t.hero_ts.goods, function () {
                            if (t.m_throwNode && t.m_throwNode.active) {
                                l.default.playSound("grenadeboom.mp3");
                                h.default.shockAct();
                                t.setThrowEnd();
                            }
                        });
                        t.m_throwNode = e;
                        t.layer_master.addChild(t.m_throwNode);
                        t.simulation();
                        t.hero_ts.setGoods(null);
                        t.delayHold(5, function () {
                            if (t.m_throwNode && t.m_throwNode.active) {
                                var e = !o.m_goods || 1 != o.m_goods.id;
                                if (!e) {
                                    l.default.playSound("grenadeboom.mp3");
                                    h.default.shockAct();
                                }
                                t.setThrowEnd(e);
                            }
                        });
                    } else t.isToucheLong = 0;
                });
            };
            e.prototype.simulation = function (t) {
                void 0 === t && (t = null);
                if (!t) {
                    var e = cc.rotateBy(1, 360), o = cc.repeat(e, 1.5);
                    this.m_throwNode.runAction(o);
                }
                this.schedule(this.timeCallBack, .02);
            };
            e.prototype.timeCallBack = function () {
                if (this.m_throwNode && this.m_throwNode.active) if (this.m_ThrowPos[this.m_throwIndex]) {
                    this.m_throwNode.x = this.m_ThrowPos[this.m_throwIndex][0];
                    this.m_throwNode.y = this.m_ThrowPos[this.m_throwIndex][1];
                    this.m_throwIndex++;
                } else {
                    this.m_throwNode.stopAllActions();
                    this.unschedule(this.timeCallBack);
                    this.m_throwIndex = 0;
                }
            };
            e.prototype.setThrowBtn = function (t) {
                null != t && (this.btn_throw.active = t);
            };
            e.prototype.btnUseCall = function () {
                this.isCheck || u.default.analysisEvent(2);
            };
            e.prototype.btnQuitCall = function () {
                this._onClose();
            };
            e.prototype.instatThrow = function () {
                var t = this, e = this.hero_ts.goods;
                if (e && "4" != e.isthrow && "2" != e.isthrow) {
                    this.hero_ts.initAllState();
                    this.m_discardIdx++;
                    var o = {
                        ani: null,
                        box: {
                            width: 60,
                            height: 60,
                            x: 0,
                            y: 0
                        },
                        doorId: null,
                        eventPre: null,
                        eventTrigger: [{
                            delay: 0,
                            index: 1,
                            isLoop: !1,
                            isWait: !0,
                            key: "5",
                            last: 0,
                            next: this.m_discardIdx + "|2",
                            param: this.hero_ts.goods.nameid,
                            trigger: "6"
                        }, {
                            delay: 0,
                            index: 2,
                            isLoop: !1,
                            isWait: !0,
                            key: "9",
                            last: 0,
                            next: "",
                            param: this.m_discardIdx + "",
                            trigger: "0"
                        }],
                        guide: "",
                        height: 30,
                        index: this.m_discardIdx,
                        isClimb: !1,
                        isDrag: !1,
                        isHide: !1,
                        isLock: !1,
                        isLoop: !1,
                        isOb: !1,
                        key: "box1",
                        name: "derelict",
                        sx: 1 == e.isthrow ? .6 : 1,
                        sy: 1 == e.isthrow ? .6 : 1,
                        url: "public/goods/" + this.hero_ts.goods.imgname,
                        width: 60,
                        x: this.hero.x,
                        y: this.hero.y + 90,
                        z: 800,
                        r: 0
                    }, i = cc.instantiate(this.itemBox);
                    i.x = o.x;
                    i.y = o.y;
                    i.zIndex = this.hero_ts.node.zIndex - 1;
                    i.discardIdx = this.m_discardIdx;
                    var n = i.getComponent("InteractiveObject");
                    n.setConf(o, this);
                    i.active = !1;
                    this.layer_master.addChild(i);
                    this.itemMap[o.index] = i;
                    if (3 == e.isthrow) {
                        this.gameOperate = !0;
                        this.hero_ts.pail_put(function () {
                            i.x = t.hero_ts.isRight ? t.hero.x + 85 : t.hero.x - 85;
                            i.y = t.hero.y + 40;
                            i.active = !0;
                        });
                    } else {
                        i.active = !0;
                        var a = this.hero_ts.isRight ? cc.v2(this.hero.x - 120, this.hero.y) : cc.v2(this.hero.x + 120, this.hero.y);
                        if (1 == e.isthrow) i.runAction(cc.sequence(cc.jumpTo(.6, a, 50, 1), cc.callFunc(function () {
                            n.onclear();
                        }))); else {
                            var s = this.hero_ts.isRight ? cc.v2(this.hero.x - 50, this.hero.y + 20) : cc.v2(this.hero.x + 50, this.hero.y);
                            i.runAction(cc.jumpTo(.15, s, 5, 1));
                        }
                    }
                }
            };
            e.prototype.changeForceWait = function (t, e) {
                void 0 === e && (e = !1);
                this.gameOperate = t;
                this.nPos = null;
                this.gestureCount = 0;
                if (t) {
                    this.operateDir = 0;
                    this.hero_ts.setControl(!1);
                    this.hero_ts.initAllState(e);
                    console.log("------------- 进入强制等待");
                } else {
                    this.hero_ts.setControl(!0);
                    console.log("------------- 解除强制等待");
                }
            };
            e.prototype.addForceWait = function (t) {
                this.gameOperate = !0;
                this.operateDir = 0;
                this.forceWaitTime += t;
                if (null == this.forceWaitCb) {
                    this.hero_ts.initAllState();
                    this.forceWaitCb = function () {
                        if (this.forceWaitTime <= 0) {
                            this.unschedule(this.forceWaitCb);
                            this.forceWaitCb = null;
                            this.forceWaitTime = 0;
                            this.gameOperate = !1;
                        } else this.forceWaitTime -= .5;
                    };
                    this.schedule(this.forceWaitCb, .5);
                }
            };
            e.prototype.storyBack = function () {
                d.default.open("dialog/showhistoryDialog");
            };
            e.prototype.passBack = function () {
                var t = this;
                if (!cc.find("Canvas").getChildByName("passDialog")) {
                    this.layer_black.active = !0;
                    this.layer_black.opacity = 180;
                    this.pauseGame();
                    d.default.open("dialog/passDialog", ["您确定暂停游戏吗。", function () { }, function () {
                        t.m_isTimeTouch = 0;
                        t.resumeGame();
                        t.openEffect(.1);
                    }], function () { });
                }
            };
            e.prototype.tipsBack = function () {
                var t = {
                    scenes_d1_1: 1,
                    scenes_d1_2: 2,
                    scenes_d2_1: 3,
                    scenes_d2_2: 4,
                    scenes_d3_1: 5,
                    scenes_d3_2: 6,
                    scenes_d3_3: 7
                }, e = t[this.mapName] || 1;
                d.default.open("dialog/gametipsDialog", [e]);
            };
            e.prototype.restartGameDeath = function () {
                var t = this;
                this.layer_black.active = !0;
                this.layer_black.opacity = 200;
                var e = "scenes_d" + c.default.chapter + "_" + c.default.mapIndex;
                this.cleanGame();
                r.default.cleanHeroItem();
                this.texture_sp.node.parent.parent.active = !1;
                this.delayHold(1, function () {
                    t.initData([e]);
                    t.openEffect();
                });
            };
            e.prototype.setTroveMove = function (t, e) {
                if (!c.default.itemData[t.nameid]) {
                    c.default.itemData[t.nameid] = t;
                    c.default.onlinetm = new Date().getTime();
                }
                var o = new cc.Node(), i = o.addComponent(cc.Sprite);
                h.default.setSpriteFrame(i, "item/items/" + t.imgname);
                var n = this.camera_master.getWorldToCameraPoint(new cc.Vec2(e.x, e.y));
                o.x = n.x;
                o.y = n.y;
                o.group = "ui";
                this.camera_ui.node.addChild(o);
                o.runAction(cc.sequence(cc.spawn(cc.scaleTo(.8, 1.2), cc.moveTo(.8, cc.v2(0, 80))), cc.delayTime(1.5), cc.moveTo(.3, cc.v2(-680, 263)), cc.callFunc(function () {
                    o.removeFromParent();
                    o.destroy();
                })));
            };
            e.prototype.addEnemy = function (t, e) {
                this.enemyMap[e] = t;
            };
            e.prototype.setLayer_Ex = function (t) {
                void 0 === t && (t = -1);
                var e = this.gameNode.getChildByName("node_master");
                this.layer_ex = e.getChildByName("node_ex");
            };
            e.prototype.propBack = function () {
                d.default.open("dialog/showpropDialog");
            };
            a([f(cc.Camera)], e.prototype, "camera_master", void 0);
            a([f(cc.Camera)], e.prototype, "camera_ui", void 0);
            a([f(cc.Button)], e.prototype, "btn_up", void 0);
            a([f(cc.Button)], e.prototype, "btn_down", void 0);
            a([f(cc.Button)], e.prototype, "btn_left", void 0);
            a([f(cc.Button)], e.prototype, "btn_right", void 0);
            a([f(cc.Node)], e.prototype, "btn_throw", void 0);
            a([f(cc.Node)], e.prototype, "btn_pass", void 0);
            a([f(cc.Node)], e.prototype, "btn_tips", void 0);
            a([f(cc.Node)], e.prototype, "node_control", void 0);
            a([f(cc.Node)], e.prototype, "pan_control", void 0);
            a([f(cc.Node)], e.prototype, "btn_control", void 0);
            a([f(cc.Node)], e.prototype, "btn_light", void 0);
            a([f(cc.Node)], e.prototype, "node_dir", void 0);
            a([f(cc.Node)], e.prototype, "btn_user", void 0);
            a([f(cc.Node)], e.prototype, "btn_climb", void 0);
            a([f(cc.Sprite)], e.prototype, "img_user", void 0);
            a([f(cc.Sprite)], e.prototype, "img_special", void 0);
            a([f(cc.Node)], e.prototype, "layer_black", void 0);
            a([f(cc.Node)], e.prototype, "layer_dir", void 0);
            a([f(cc.Node)], e.prototype, "m_guideNode", void 0);
            a([f(cc.Node)], e.prototype, "node_save", void 0);
            a([f(cc.Node)], e.prototype, "guidetips_node", void 0);
            a([f(cc.Node)], e.prototype, "camera_part", void 0);
            a([f(cc.Sprite)], e.prototype, "texture_sp", void 0);
            a([f(cc.Prefab)], e.prototype, "itemBox", void 0);
            a([f(cc.Node)], e.prototype, "pan_goods", void 0);
            a([f(cc.Node)], e.prototype, "mask_goods", void 0);
            a([f(sp.Skeleton)], e.prototype, "ani_node", void 0);
            return a([_], e);
        }(s.default);
        o.default = g;
