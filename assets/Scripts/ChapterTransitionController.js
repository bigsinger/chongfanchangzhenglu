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
        var s = require("./BaseView"), r = require("./GameState"), c = require("./DragonBonesAnimationManager"), l = require("./AudioManager"), h = require("./GameConfigManager"), d = require("./PlatformBridge"), p = require("./SpineAnimationManager"), y = require("./ResourceManager"), displayAdapter = require("./DisplayAdapter"), u = cc._decorator, m = u.ccclass, _ = u.property, f = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.animation_node = null;
                e.videoComponent = null;
                e.role_node = null;
                e.yun_node = null;
                e.plot_label = null;
                e.layer_black = null;
                e.btn_skip = null;
                e.img_bg = null;
                e.img_icon = null;
                e.btn_speedup = null;
                e.cg_node = null;
                e.titles_label = null;
                e.m_chapterIndex = 0;
                e.m_isLoadIndx = 0;
                e.m_isLoadNeed = 2;
                e.m_animationPath = "animation/animation_1_0";
                e.m_rolePath = "ani01";
                e.m_orderIndex = 0;
                e.m_maxScale = 4;
                e.m_nowScale = 0;
                e.m_isCheck = !1;
                e.m_videoUrl = "";
                e.isGoGame = !1;
                e.m_cgTsAry = [];
                e.m_cgNameIndex = 2;
                e.m_nowCgIndex = 0;
                e.m_gameSceneTransitionPending = !1;
                e.m_cgAnimationToken = 0;
                e.m_rightAnimationToken = 0;
                return e;
            }
            e.prototype.onLoad = function () {
                displayAdapter.default.apply(this.node, {
                    referenceWidth: 1650,
                    coverNodes: [this.img_bg, this.cg_node]
                });
                this.m_plotVal = [];
                this.m_ChapterAry = r.default.Smallplot.split("_");
                this.m_ChapterId = this.m_ChapterAry[1];
                this.setrelease("gk/d" + this.m_ChapterAry[0]);
                if (0 != this.m_ChapterAry[0]) {
                    var t = h.default.getLoadDragonBones(this.m_ChapterAry[0]);
                    for (var e in t) {
                        var o = t[e].split("|");
                        this.setrelease("dragonBones/" + o[0]);
                    }
                }
                this.ctorData("end_");
                this.m_isLoadNeed = this.m_isLoadNeed + (this.m_nowChapterData ? this.m_nowChapterData.length : 0);
                this.ctorData("start_");
                this.m_isLoadNeed = this.m_isLoadNeed + (this.m_nextChapterData ? this.m_nextChapterData.length : 0);
                console.log("==m_isLoadNeed=", this.m_isLoadNeed);
                var i = function (t) {
                    y.default.preloadDir(t, function () {
                        console.log("==预加载 ani=完成=");
                    });
                };
                for (var n in this.m_nextChapterData) if (this.m_nextChapterData[n].start_ani && "" != this.m_nextChapterData[n].start_ani) {
                    var a = this.m_nextChapterData[n].start_ani.split("|");
                    for (var e in a) i("dragonBones/transition/" + a[e]);
                }
                this.btn_speedup.active = !1;
                0 != this.m_ChapterAry[0] ? this.loadRes() : this.m_isLoadNeed--;
                var s = h.default.getLoadDragonBones(this.m_ChapterAry[1]);
                for (var n in s) -1 != s[n].indexOf("ani") && i("dragonBones/" + s[n].split("|")[0]);
                this.img_bg.opacity = 0;
                this.img_bg.active = !1;
                cc.debug.setDisplayStats(!1);
                this.setClick(this.node);
            };
            e.prototype.ctorData = function (t) {
                if ("start_" == t) {
                    var e = r.default.chapterMax[Number(this.m_ChapterAry[1]) - 1];
                    this.m_playChapter = e.chaptemax;
                    if (e && "1" != e.state && "" != e.start_order) {
                        this.m_nextChapterData = [];
                        var o = e.start_order.split("|");
                        this.m_rolePath = e.start_role;
                        for (var i in o) for (var n in e) {
                            if ("start_txt" == n && this.m_plotVal.length <= 0) {
                                var a = e[n].split("|");
                                for (var s in a) {
                                    var c = r.default.plotConf["txt" + a[s]];
                                    this.m_plotVal.push(c.txt);
                                }
                            }
                            if (t + o[i] == n) {
                                (l = {})[n] = e[n];
                                this.m_nextChapterData.push(l);
                                "start_video" == n && (this.m_videoUrl = "video_" + e[n]);
                                break;
                            }
                        }
                    }
                } else if ((e = r.default.chapterMax[Number(this.m_ChapterAry[0]) - 1]) && "1" != e.end && "" != e.end_order) {
                    this.m_nowChapterData = [];
                    o = e.end_order.split("|");
                    for (var i in o) for (var n in e) if (t + o[i] == n) {
                        var l;
                        (l = {})[n] = e[n];
                        this.m_nowChapterData.push(l);
                        "end_video" == n && (this.m_videoUrl = "video_" + e[n]);
                        break;
                    }
                }
            };
            e.prototype.start = function () {
                this.m_animationAry = [];
                this.roleDragonBones();
                if (1 == r.default.mapIndex) this.executeEvent(); else {
                    this.m_isLoadNeed = 2;
                    l.default.gamePlayBGM("loadbg");
                    this.m_playSection = this.m_ChapterAry[1];
                    this.runRightAni();
                    this.m_nowChapterData = null;
                    this.m_nextChapterData = null;
                    this.openBg();
                    this.m_fadeOutBack = !0;
                    this.openEffect();
                }
            };
            e.prototype.jumpBack = function () {
                var t = this;
                this.m_cgAnimationToken++;
                l.default.playSound("ui/back.mp3");
                console.log("---------------- layer_black 1m_isLoadIndx =", this.m_isLoadIndx);
                console.log("---------------- layer_black2  m_isLoadNeed =", this.m_isLoadNeed);
                this.m_isLoadIndx >= this.m_isLoadNeed ? this.layer_black.active = !0 : this.layer_black.active = !1;
                this.btn_skip.active = !1;
                this.cg_node.active ? this.cg_node.runAction(cc.sequence(cc.fadeOut(.5), cc.callFunc(function () {
                    t.openEffect();
                    t.cg_node.active = !1;
                    t.Complete();
                }))) : this.Complete();
            };
            e.prototype.speedupBack = function (t) {
                void 0 === t && (t = null);
                if (t) {
                    this.m_nowScale += 2;
                    this.m_nowScale = this.m_nowScale > 4 ? 1 : this.m_nowScale;
                    console.log("==当前倍速==" + this.m_nowScale);
                    cc.director.getScheduler().setTimeScale(this.m_nowScale);
                    this.m_nowScale = 1 == this.m_nowScale ? 0 : this.m_nowScale;
                    var e = 0 == this.m_nowScale ? "public/btn_tg1" : "public/btn_js" + this.m_nowScale;
                    this.setSpriteFrame(this.img_icon, e);
                } else {
                    this.m_nowScale = 0;
                    cc.director.getScheduler().setTimeScale(1);
                    this.setSpriteFrame(this.img_icon, "public/btn_tg1");
                }
            };
            e.prototype.setAnimation = function (t) {
                void 0 === t && (t = 1);
                var o = this, i = ++this.m_cgAnimationToken;
                for (var e in this.m_animationAry) {
                    var n = new cc.Node();
                    this.cg_node.addChild(n);
                    n.addComponent(p.default);
                    var a = n.getComponent(p.default);
                    a.m_specialParm = !0;
                    this.m_cgTsAry.push(a);
                    a.initData(n, "C002", "transition/" + this.m_animationAry[e], this.aniComplete.bind(this), 1);
                }
                this.scheduleOnce(function () {
                    if (i != o.m_cgAnimationToken || !o.cg_node.active) return;
                    console.warn("------------ 章节 CG 完成回调超时，继续后续流程");
                    o.m_cgAnimationToken++;
                    o.btn_skip.active = !1;
                    o.cg_node.runAction(cc.sequence(cc.fadeOut(.5), cc.callFunc(function () {
                        o.Complete();
                        o.openEffect();
                        o.cg_node.active = !1;
                    })));
                }, 24);
                if (this.m_isLoadIndx > this.m_isLoadNeed) {
                    console.log("====计数超出===11111111==");
                    this.gotoGk();
                }
            };
            e.prototype.aniComplete = function (t) {
                var e = this;
                this.m_nowName != t && this.m_nowCgIndex++;
                console.log("==播放完成的动作==" + t);
                if (this.m_nowCgIndex >= this.m_cgTsAry.length - 1 && this.m_nowName != t) {
                    this.m_nowName = t;
                    this.m_cgNameIndex++;
                    for (var o in this.m_cgTsAry) this.m_cgTsAry[o].setAction("C00" + this.m_cgNameIndex, 1);
                    this.m_nowCgIndex = 0;
                }
                if ("C006" == t) {
                    console.log("==全部播放完成==");
                    this.m_cgAnimationToken++;
                    this.btn_skip.active = !1;
                    this.cg_node.runAction(cc.sequence(cc.fadeOut(.5), cc.callFunc(function () {
                        e.Complete();
                        e.openEffect();
                        e.cg_node.active = !1;
                    })));
                }
            };
            e.prototype.runRightAni = function () {
                var t = this, e = ++this.m_rightAnimationToken;
                this.animation_node.addComponent(p.default);
                this.m_animationDbJs = this.animation_node.getComponent(p.default);
                this.m_animationDbJs.m_specialParm = !0;
                this.m_animationDbJs.initData(this.animation_node, "am0" + this.m_playSection, "transition/chapter" + this.m_playChapter, function () {
                    t.finishRightAnimation(e);
                }, 1);
                this.scheduleOnce(function () {
                    if (e != t.m_rightAnimationToken) return;
                    console.warn("------------ 章节路线动画完成回调超时，继续后续流程");
                    t.finishRightAnimation(e);
                }, 14);
            };
            e.prototype.finishRightAnimation = function (t) {
                if (t != this.m_rightAnimationToken) return;
                this.m_rightAnimationToken++;
                this.aniOnStop();
            };
            e.prototype.aniOnStop = function () {
                this.m_isLoadIndx++;
                this.gotoGk();
            };
            e.prototype.executeEvent = function () {
                var t, e = this;
                if (this.m_nowChapterData && this.m_nowChapterData[0]) {
                    t = this.m_nowChapterData[0];
                    this.m_playSection = this.m_ChapterAry[0];
                } else if (this.m_nextChapterData && this.m_nextChapterData[0]) {
                    t = this.m_nextChapterData[0];
                    this.m_playSection = this.m_ChapterAry[1];
                } else this.gotoGk();
                for (var o in t) {
                    var i = o.split("_");
                    this.img_bg.opacity = 0;
                    this.img_bg.active = !1;
                    switch (i[1]) {
                        case "ani":
                            this.btn_skip.active = r.default.unlockchapters >= this.m_ChapterId;
                            this.m_animationAry = [];
                            this.m_animationAry = t[o].split("|");
                            this.openEffect();
                            this.setAnimation();
                            break;

                        case "video":
                            d.default.nativeVideo(this.m_videoUrl, function () {
                                e.jumpBack();
                            });
                            break;

                        case "txt":
                            this.runRightAni();
                            this.m_plotVal = [];
                            var n = t[o].split("|");
                            for (var a in n) {
                                var s = r.default.plotConf["txt" + n[a]];
                                this.m_plotVal.push(s.txt);
                            }
                            l.default.gamePlayBGM("loadbg");
                            this.openBg();
                            this.m_fadeOutBack = !0;
                            this.openEffect();
                            break;

                        case "zimu":
                            var c = r.default.plotConf["txt" + t[o]];
                            if (this.m_nextChapterData[1]) this.showTitles(c.txt); else {
                                this.img_bg.opacity = 255;
                                this.img_bg.active = !0;
                                this.m_chapterVideo = c;
                                this.m_isLoadNeed--;
                                this.gotoGk();
                            }
                    }
                    break;
                }
            };
            e.prototype.Complete = function () {
                if (this.m_nowChapterData && this.m_nowChapterData[0]) {
                    this.m_nowChapterData.shift();
                    this.m_isLoadIndx++;
                    this.executeEvent();
                } else if (this.m_nextChapterData && this.m_nextChapterData[0]) {
                    this.m_nextChapterData.shift();
                    this.m_isLoadIndx++;
                    this.executeEvent();
                } else {
                    1 != r.default.mapIndex && this.m_isLoadIndx++;
                    this.gotoGk();
                }
            };
            e.prototype.videoEnd = function (t) {
                void 0 === t && (t = !1);
                this.videoComponent.node.removeFromParent();
                this.videoComponent.node.destroy();
                this.videoComponent = null;
                t && this.Complete();
            };
            e.prototype.aniEnd = function (t) {
                void 0 === t && (t = !1);
                this.animation_node.removeComponent(dragonBones.ArmatureDisplay);
                this.animation_node.removeComponent(c.default);
                this.m_animationDbJs = null;
                if (t) {
                    l.default.stopBGM();
                    this.Complete();
                }
            };
            e.prototype.roleDragonBones = function () {
                var t = this.m_rolePath.split("|");
                for (var e in t) {
                    var o = new cc.Node();
                    o.x = 1 == t.length ? 150 : 150 * Number(e);
                    this.role_node.addChild(o);
                    o.addComponent(p.default);
                    var i = o.getComponent(p.default);
                    o.scale = 1.5;
                    i.initData(o, "walk", t[e], function () { });
                }
            };
            e.prototype.showTitles = function (t) {
                var e = this;
                this.layer_black.active = !0;
                this.layer_black.runAction(cc.sequence(cc.fadeIn(.4), cc.callFunc(function () {
                    e.titles_label.string = t;
                    e.titles_label.node.active = !0;
                    e.scheduleOnce(function () {
                        e.titles_label.node.active = !1;
                        e.Complete();
                    }, 3);
                })));
            };
            e.prototype.setPlot = function () {
                var t = this;
                this.m_plotVal[0] && (this.plot_label.string = this.m_plotVal[0]);
                this.m_plotVal.shift();
                this.scheduleOnce(function () {
                    t.m_plotVal.length > 0 ? t.setPlot() : t.m_plotVal.length <= 0 && t.Complete();
                }, 3);
            };
            e.prototype.openEffect = function () {
                var t = this;
                this.layer_black.active = !0;
                this.layer_black.opacity = 255;
                var e = cc.sequence(cc.fadeOut(.5), cc.callFunc(function () {
                    t.layer_black.opacity = 0;
                    console.log("---------------- layer_black 2");
                    t.layer_black.active = !1;
                    if (t.m_fadeOutBack) {
                        t.setPlot();
                        t.m_fadeOutBack = null;
                    }
                }));
                this.layer_black.runAction(e);
            };
            e.prototype.loadRes = function () {
                var t = "gk/d" + this.m_ChapterAry[1];
                this.loads(t);
            };
            e.prototype.loads = function (t, o) {
                var e = this;
                void 0 === o && (o = 0);
                y.default.loadDir(t, function (t, o) {
                    e.onProgress(t / o, "加载游戏资源");
                }, function (i, n) {
                    if (i || !n || !n.length) {
                        if (o < 1) {
                            console.warn("----------- 章节资源加载失败，正在重试 " + t, i);
                            e.scheduleOnce(function () {
                                e.loads(t, o + 1);
                            }, .5);
                            return;
                        }
                        console.error("----------- 章节资源加载失败 " + t, i);
                        e.plot_label.string = "资源加载失败，点击返回主菜单";
                        e.img_bg.active = !0;
                        e.img_bg.once(cc.Node.EventType.TOUCH_START, function () {
                            cc.director.loadScene("mainScene");
                        }, e);
                        return;
                    }
                    e.onComplete();
                }, "chapter:" + t);
            };
            e.prototype.onProgress = function (t) {
                t = (t = Number((t + "").replace("%", ""))) || 0;
                Number(t.toFixed(2));
            };
            e.prototype.onComplete = function () {
                console.log("资源加载完成");
                r.default.chapter = this.m_ChapterAry[1];
                this.m_isLoadIndx++;
                this.gotoGk();
            };
            e.prototype.gotoGk = function () {
                var t = this;
                console.log("----------- this.m_isLoadIndx " + this.m_isLoadIndx);
                console.log("----------- this.m_isLoadNeed " + this.m_isLoadNeed);
                if (this.m_isLoadIndx == this.m_isLoadNeed) {
                    this.plot_label.string = "点击任意位置继续";
                    var e = cc.sequence(cc.scaleTo(1, 1.15), cc.scaleTo(1, 1));
                    this.plot_label.node.runAction(cc.repeatForever(e));
                    this.img_bg.on(cc.Node.EventType.TOUCH_START, function () {
                        if (!t.m_isCheck) {
                            t.m_isCheck = !0;
                            t.plot_label.node.stopAllActions();
                            t.layer_black.opacity = 255;
                            t.layer_black.active = !0;
                            if (t.m_chapterVideo) t.showTitles(t.m_chapterVideo.txt); else {
                                t.m_isLoadIndx++;
                                t.gotoGk();
                            }
                        }
                    });
                }
                if (!(this.m_isLoadIndx <= this.m_isLoadNeed || this.isGoGame)) {
                    this.isGoGame = !0;
                    this.layer_black.opacity = 255;
                    this.layer_black.active = !0;
                    this.layer_black.runAction(cc.fadeOut(.7));
                    var o = this.yun_node.addComponent(p.default);
                    o.m_specialParm = !0;
                    o.initData(this.yun_node, "daiji", "effect/transition", function () { }, 1);
                    cc.director.preloadScene("gameScene", function () { }, function () {
                        t.scheduleOnce(function () {
                            if (t.m_gameSceneTransitionPending) return;
                            t.m_gameSceneTransitionPending = !0;
                            l.default.stopBGM();
                            cc.director.getScheduler().setTimeScale(1);
                            // Creator 2.4.15 releases Spine textures while
                            // destroying a scene. If a transition renderer is
                            // still registered for the current frame,
                            // SkeletonData.isTexturesLoaded() reads the already
                            // cleared texture list on the next render pass and
                            // prevents the new gameplay scene from appearing.
                            // Detach all transition renderers first, let one
                            // complete frame flush RenderFlow, then switch.
                            t.node.stopAllActions();
                            t.node.active = !1;
                            var e = function () {
                                cc.director.loadScene("gameScene", function () {
                                    console.log("==== gameScene==success=====");
                                });
                            };
                            cc.Director && cc.Director.EVENT_AFTER_DRAW ? cc.director.once(cc.Director.EVENT_AFTER_DRAW, e) : setTimeout(e, 80);
                        }, 1.2);
                    });
                }
            };
            e.prototype.openBg = function () {
                var t = this;
                this.img_bg.active = !0;
                var e = cc.sequence(cc.fadeIn(.8), cc.callFunc(function () {
                    t.img_bg.opacity = 255;
                }));
                this.img_bg.runAction(e);
            };
            e.prototype.setrelease = function (t) {
                console.log("=11==释放资源=" + t);
                y.default.releaseDirectory(t);
            };
            e.prototype.onVideoPlayerEvent = function (t, e) {
                if (e === cc.VideoPlayer.EventType.COMPLETED) this.videoEnd(!0); else if (e === cc.VideoPlayer.EventType.READY_TO_PLAY) {
                    console.log("=可以播放=1111=");
                    this.videoComponent.node.active && this.videoComponent.play();
                } else cc.VideoPlayer.EventType.PAUSED;
            };
            a([_(cc.Node)], e.prototype, "animation_node", void 0);
            a([_(cc.VideoPlayer)], e.prototype, "videoComponent", void 0);
            a([_(cc.Node)], e.prototype, "role_node", void 0);
            a([_(cc.Node)], e.prototype, "yun_node", void 0);
            a([_(cc.Label)], e.prototype, "plot_label", void 0);
            a([_(cc.Node)], e.prototype, "layer_black", void 0);
            a([_(cc.Node)], e.prototype, "btn_skip", void 0);
            a([_(cc.Node)], e.prototype, "img_bg", void 0);
            a([_(cc.Sprite)], e.prototype, "img_icon", void 0);
            a([_(cc.Node)], e.prototype, "btn_speedup", void 0);
            a([_(cc.Node)], e.prototype, "cg_node", void 0);
            a([_(cc.Label)], e.prototype, "titles_label", void 0);
            return a([m], e);
        }(s.default);
        o.default = f;
