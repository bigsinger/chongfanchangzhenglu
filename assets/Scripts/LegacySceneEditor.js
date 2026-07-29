'use strict';

/**
 * 模块职责：保留关卡编辑辅助组件及其序列化数据结构。
 * 关键约束：运行时不扩展编辑行为，只确保旧场景组件能够安全加载。
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
        var s = require("./BaseScene"), r = require("./GameConfigManager"), c = require("./GameState"), l = require("./LegacyHttpClient"), h = require("./LegacyNetworkTip"), d = cc._decorator, p = d.ccclass, u = d.property, m = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.node_show = null;
                e.node_game = null;
                e.eb_width = null;
                e.eb_height = null;
                e.slider_width = null;
                e.slider_height = null;
                e.scroll_obj = null;
                e.slider_obj = null;
                e.scroll_eventObj = null;
                e.slider_event = null;
                e.pan_item = null;
                e.lb_pos = null;
                e.sx = 0;
                e.sy = 0;
                e.ix = 0;
                e.iy = 0;
                e.gameWidth = 1e3;
                e.gameHeight = 600;
                e.label_locTime = null;
                e.label_netTime = null;
                e.eb_seach = null;
                e.pan_seach = null;
                e.node_seach = null;
                e.label_seach = null;
                e.btn_pre = null;
                e.itemData = null;
                e.itemList = {
                    initPos: {
                        name: "初始位置",
                        url: "role/role_1"
                    },
                    trigger: {
                        name: "触发器",
                        url: ""
                    },
                    goods: {
                        name: "场景道具",
                        url: ""
                    },
                    collection: {
                        name: "收藏品",
                        url: "item/items/item3"
                    },
                    prop20: {
                        name: "空水桶",
                        url: "public/goods/prop_pail1"
                    },
                    prop44: {
                        name: "铁锹",
                        url: "public/goods/prop_shovel"
                    },
                    prop41: {
                        name: "红薯",
                        url: "public/goods/prop_cooked1"
                    }
                };
                e.chooseList = {};
                e.editItem = null;
                e.node_data = null;
                e.lb_name = null;
                e.node_item = null;
                e.pan_obj = null;
                e.index_obj = 0;
                e.pan_eventobj = null;
                e.node_event = null;
                e.pan_event = null;
                e.chooseEvent = {};
                e.node_param = null;
                e.lb_ePre = null;
                e.lb_eTrigger = null;
                e.lb_index = null;
                e.eventMod = 0;
                e.selectObj = null;
                e.eb_map = null;
                e.isImport = !1;
                e.mapKey = "";
                e.node_org = null;
                e.node_camera = null;
                e.eb_camera_x = null;
                e.eb_camera_y = null;
                e.eb_camera_start = null;
                e.eb_camera_end = null;
                e.eb_camera_time = null;
                e.eb_camera_mod = null;
                e.eb_px = null;
                e.eb_py = null;
                e.node_netTip = null;
                return e;
            }
            e.prototype.start = function () {
                this.eb_px.string = "0";
                this.eb_py.string = "0";
                r.default.loadTempData();
                cc.resources.loadDir("config", function (t, e) {
                    t && console.log("--- error ", t);
                    for (var o = 0, i = e; o < i.length; o++) {
                        var n = i[o];
                        switch (n.name) {
                            case "eventConf":
                                c.default.loadEvent(n.json);
                                break;

                            case "doorConf":
                                c.default.loadDoor(n.json);
                                break;

                            case "plotConf":
                                c.default.loadPlot(n.json);
                                break;

                            case "goodsConf":
                                c.default.loadGoods(n.json);
                                break;

                            case "chapterConf":
                                c.default.loadChapter(n.json);
                                break;

                            case "aniConf":
                                c.default.loadAni(n.json);
                                break;

                            case "guideConf":
                                c.default.loadGuide(n.json);
                                break;

                            case "chapterMax":
                                c.default.chapterMax = n.json;
                                c.default.ctorChapter();
                                break;

                            case "talkConf":
                                c.default.loadTalk(n.json);
                                break;

                            case "story":
                                c.default.story = n.json;
                                c.default.ctorStory();
                                break;

                            case "item":
                                c.default.item = n.json;
                                break;

                            case "gametips":
                                c.default.gametipsJson = n.json;
                                break;

                            case "comConf":
                                c.default.loadCom(n.json);
                                break;

                            case "processConf":
                                c.default.loadprocess(n.json);
                                break;

                            case "chapterUi":
                                c.default.loadChapterUi(n.json);
                                break;

                            case "answer":
                                c.default.loadanswer(n.json);
                                break;

                            case "cgtitle":
                                c.default.cgtitleConfig = n.json;
                                c.default.ctorCgtitle();
                                break;

                            case "groundConf":
                                c.default.loadGround(n.json);
                                break;

                            case "sound":
                                c.default.soundJson = n.json;
                        }
                    }
                    this.initItems();
                    this.initEvent();
                    this.showNodeParam(!1);
                    this.hideNodeEvent();
                    this.hideEdit();
                    this.hideNodeItem();
                }.bind(this));
            };
            e.prototype.loadViewPrefab = function (t, e, o) {
                var i = this;
                this.createPrefab("view/" + t, function (n) {
                    if (null != n) {
                        i.mapKey = t;
                        c.default.mapKey = t;
                        i.node_game.width = n.width;
                        i.node_game.height = n.height;
                        i.gameWidth = n.width;
                        i.gameHeight = n.height;
                        if (o) {
                            i.node_camera.active = !0;
                            i.eb_camera_x.string = null == o.x || "" == o.x ? "" : Number(o.x) + i.gameWidth / 2 + "";
                            i.eb_camera_y.string = null == o.y || "" == o.y ? "" : i.gameHeight / 2 - Number(o.y) + "";
                            i.eb_camera_start.string = o.ss;
                            i.eb_camera_end.string = o.se;
                            i.eb_camera_time.string = o.time;
                            i.eb_camera_mod.string = o.mod || "0";
                        }
                        i.eb_px.string = i.gameWidth / 2 + "";
                        i.eb_py.string = i.gameHeight / 2 + "";
                        i.node_org.x = -i.gameWidth / 2;
                        i.node_org.y = i.gameHeight / 2 + 30;
                        n.zIndex = -9999;
                        i.node_game.addChild(n);
                        if (null != e) {
                            var a = function () {
                                var t = e[s], o = i.itemList[t.key];
                                t.url = o.url;
                                i.createPrefab("itemObj", function (e) {
                                    i.pan_obj.addChild(e);
                                    e.getComponent("LegacyItemModel").initItemObj(t.key, t, t.index, i);
                                    e.on(cc.Node.EventType.TOUCH_END, i.itemObjCall, i);
                                    e.getComponent("LegacyItemModel").createAss();
                                    t.index > i.index_obj && (i.index_obj = t.index);
                                });
                            };
                            for (var s in e) a();
                        }
                        i.scheduleOnce(function () {
                            i.btn_pre.active = !0;
                        }, 3);
                    } else i.isImport = !1;
                });
            };
            e.prototype.cleanSaveCall = function () {
                r.default.cleanAllSave();
            };
            e.prototype.downloadCall = function () {
                l.default.config({
                    gametype: "cz"
                }, function (t) {
                    console.log("downloadCall res ---- ", JSON.stringify(t));
                    if (1 == t.code) {
                        var e = document.createElement("a");
                        e.download = "czconfig.json";
                        e.style.display = "none";
                        var o = new Blob([JSON.stringify(t.data)]);
                        e.href = URL.createObjectURL(o);
                        document.body.appendChild(e);
                        e.click();
                        document.body.removeChild(e);
                    }
                });
            };
            e.prototype.downLocalCall = function () {
                this.saveConf(null, 2);
            };
            e.prototype.importCall = function (t, e) {
                var o = this;
                if (!this.isImport) {
                    this.isImport = !0;
                    var i = this.eb_map.string;
                    if ("" != i && null != i) if (c.default.isConfNet && 1 == Number(e)) {
                        console.log("----- 开始从服务器导入数据 -----");
                        var n = !1;
                        l.default.checkName({
                            name: i
                        }, function (t) {
                            if (1 == t.code) {
                                var e = t.data;
                                if (e.content) {
                                    n = !0;
                                    var a = JSON.parse(e.content), s = a.confArr;
                                    o.loadViewPrefab(i, s, a.initCamera);
                                } else console.log("----- 找不到关卡配置数据！", i);
                            }
                            n || o.loadViewPrefab(i, null, null);
                        });
                    } else {
                        console.log("----- 开始从本地导入数据 -----");
                        var a = r.default.getPointConf(i);
                        if (a) {
                            var s = a.confArr;
                            this.loadViewPrefab(i, s, a.initCamera);
                        } else this.loadViewPrefab(i, null, null);
                    } else this.isImport = !1;
                }
            };
            e.prototype.preCall = function () {
                this.saveConf(null, 0);
                this.isImport && "" != this.mapKey && cc.director.loadScene("gameScene");
            };
            e.prototype.saveNetCall = function () {
                var t = this;
                if (this.isImport && "" != this.mapKey) {
                    this.node_netTip.active = !0;
                    this.node_netTip.getComponent(h.default).initCallBack(function () {
                        t.saveConf(null, 1);
                    }, "是否确认要保存至服务器？");
                }
            };
            e.prototype.saveConf = function (t, e) {
                this.addObjEvent();
                var o = {}, i = [];
                if (this.isImport && "" != this.mapKey) {
                    for (var n = 0, a = this.pan_obj.children; n < a.length; n++) {
                        var s = a[n].getComponent("LegacyItemModel").getConf();
                        null != s && i.push(s);
                    }
                    o.confArr = i;
                    var h = "", d = "";
                    "" != this.eb_camera_x.string && (h = Number(this.eb_camera_x.string) - this.gameWidth / 2 + "");
                    "" != this.eb_camera_y.string && (d = -(Number(this.eb_camera_y.string) - this.gameHeight / 2) + "");
                    o.initCamera = {
                        x: h,
                        y: d,
                        ss: this.eb_camera_start.string,
                        se: this.eb_camera_end.string,
                        time: this.eb_camera_time.string,
                        mod: this.eb_camera_mod.string
                    };
                    console.log("----- initCamera ", o.initCamera);
                    if (c.default.isConfNet && 1 == Number(e)) if ("scenes_d99_99" == this.mapKey) alert("测试关卡数据不上传服务器！！"); else {
                        console.log("----- 保存数据至服务器 -----");
                        l.default.saveConfig({
                            name: this.mapKey,
                            surpass: 0,
                            sortno: 1,
                            content: JSON.stringify(o)
                        }, function (t) {
                            console.log("------res ", t);
                            if (1 == t.code) alert("保存成功!"); else {
                                alert("保存失败!");
                                console.log("---- msg ", t.msg);
                            }
                        });
                    } else if (0 == Number(e)) {
                        console.log("----- 保存数据至本地 -----");
                        r.default.setPointConf(this.mapKey, o);
                    } else if (2 == Number(e)) {
                        console.log("----- 下载本地文档 -----");
                        var p = document.createElement("a");
                        p.download = this.mapKey + ".json";
                        p.style.display = "none";
                        var u = new Blob([JSON.stringify(o)]);
                        p.href = URL.createObjectURL(u);
                        document.body.appendChild(p);
                        p.click();
                        document.body.removeChild(p);
                    }
                    var m = new Date().toLocaleString();
                    if (0 == Number(e)) {
                        this.label_locTime.string = m;
                        cc.sys.localStorage.setItem("saveLocTime", JSON.stringify(m));
                    } else if (1 == Number(e)) if (c.default.isConfNet) {
                        if ("scenes_d99_99" != this.mapKey) {
                            this.label_netTime.string = m;
                            cc.sys.localStorage.setItem("saveNetTime", JSON.stringify(m));
                        }
                    } else this.label_netTime.string = "离线模式";
                }
            };
            e.prototype.initEvent = function () {
                var t = this, e = c.default.eventConf, o = function () {
                    var o = n, a = e[n];
                    i.createPrefab("itemEvent", function (e) {
                        e.getChildByName("lb_index").getComponent(cc.Label).string = a.id;
                        e.getChildByName("lb_res").getComponent(cc.Label).string = a.explain;
                        t.pan_event.addChild(e);
                        e.eventKey = o;
                        e.isChoose = !1;
                        e.getChildByName("sp_g").active = !1;
                        e.on(cc.Node.EventType.TOUCH_END, t.eventStartCall, t);
                    });
                }, i = this;
                for (var n in e) o();
            };
            e.prototype.addObjEvent = function () {
                if (this.selectObj) {
                    for (var t = [], e = 0, o = this.pan_eventobj.children; e < o.length; e++) {
                        var i = o[e];
                        t.push(i.getComponent("LegacyItemEventModel").getEventData());
                    }
                    this.selectObj.getComponent("LegacyItemModel").addEvent(t);
                }
            };
            e.prototype.moveUpEvent = function (t) {
                if (this.selectObj) {
                    var e = 0, o = this.pan_eventobj.children;
                    for (var i in o) if (t == o[i]) {
                        e = Number(i);
                        break;
                    }
                    if (e > 0) {
                        var n = o[e - 1];
                        o[e - 1] = t;
                        o[e] = n;
                        o[e].y += 100;
                    }
                }
            };
            e.prototype.saveEventConf = function () {
                this.addObjEvent();
                this.saveConf(null, 0);
            };
            e.prototype.eventAddCall = function () {
                var t = this;
                if (this.selectObj) {
                    for (var e = 0, o = 0, i = this.pan_eventobj.children; o < i.length; o++) {
                        var n = i[o].getComponent("LegacyItemEventModel").getIndex();
                        n >= e && (e = n);
                    }
                    var a = function () {
                        var o = r;
                        1 == s.chooseEvent[r] && s.createPrefab("itemEventObj", function (i) {
                            t.pan_eventobj.addChild(i);
                            e++;
                            i.getComponent("LegacyItemEventModel").initItemEventObj({
                                key: o
                            }, e, t);
                        });
                    }, s = this;
                    for (var r in this.chooseEvent) a();
                    this.chooseEvent = {};
                    this.initEventState();
                    this.hideNodeEvent();
                }
            };
            e.prototype.eventDelCall = function () {
                this.selectObj;
            };
            e.prototype.showNodeEvent = function (t, e) {
                this.node_event.active = !0;
                this.eventMod = e;
            };
            e.prototype.hideNodeEvent = function () {
                this.node_event.active = !1;
            };
            e.prototype.initEventState = function () {
                for (var t = 0, e = this.pan_event.children; t < e.length; t++) {
                    var o = e[t];
                    o.isChoose = !1;
                    o.getChildByName("sp_g").active = !1;
                }
            };
            e.prototype.eventStartCall = function (t) {
                var e = t.currentTarget;
                if (e.isChoose) {
                    e.isChoose = !1;
                    this.chooseEvent[e.eventKey] = 0;
                    console.log("----- 取消event " + e.eventKey);
                } else {
                    e.isChoose = !0;
                    this.chooseEvent[e.eventKey] = 1;
                    console.log("----- 选中event " + e.eventKey);
                }
                e.getChildByName("sp_g").active = e.isChoose;
            };
            e.prototype.initItems = function () {
                var t = this, e = function () {
                    var e = i, n = o.itemList[i];
                    o.createPrefab("item", function (o) {
                        t.setSpriteFrame(o.getChildByName("sp_item").getComponent(cc.Sprite), n.url);
                        o.getChildByName("lb_name").getComponent(cc.Label).string = n.name;
                        t.pan_item.addChild(o);
                        o.dataKey = e;
                        o.isChoose = !1;
                        o.getChildByName("sp_g").active = !1;
                        o.on(cc.Node.EventType.TOUCH_END, t.itemStartCall, t);
                    });
                }, o = this;
                for (var i in this.itemList) e();
            };
            e.prototype.initItemState = function () {
                for (var t = 0, e = this.pan_item.children; t < e.length; t++) {
                    var o = e[t];
                    o.isChoose = !1;
                    o.getChildByName("sp_g").active = !1;
                }
            };
            e.prototype.itemAddCall = function () {
                var t = this, e = function () {
                    var e = i, n = o.itemList[e], a = {};
                    for (var s in n) a[s] = n[s];
                    1 == o.chooseList[i] && o.createPrefab("itemObj", function (o) {
                        t.pan_obj.addChild(o);
                        t.index_obj++;
                        o.getComponent("LegacyItemModel").initItemObj(e, a, t.index_obj, t);
                        o.on(cc.Node.EventType.TOUCH_END, t.itemObjCall, t);
                    });
                }, o = this;
                for (var i in this.chooseList) e();
                this.chooseList = {};
                this.initItemState();
                this.hideNodeItem();
            };
            e.prototype.showNodeParam = function (t) {
                this.node_param.active = t;
            };
            e.prototype.itemObjCall = function (t, e) {
                for (var o = t.currentTarget, i = this.pan_obj.children, n = i.length, a = -1, s = 0, r = i; s < r.length; s++) {
                    var c = r[s];
                    a++;
                    c.getComponent("LegacyItemModel").showSelect(c == o);
                    if (c == o && o != this.selectObj) {
                        this.selectObj = o;
                        this.refreshParam(o.getComponent("LegacyItemModel").getData());
                        this.showNodeParam(o.getComponent("LegacyItemModel").isCreate);
                        var l = o.getComponent("LegacyItemModel").getPos();
                        l && this.locationObj(l.x, l.y);
                        if (e) {
                            e = !1;
                            this.scroll_obj.scrollToPercentVertical(1 - a / n, 0);
                        }
                    }
                }
            };
            e.prototype.delObjCall = function (t) {
                var e = this, o = t.getComponent("LegacyItemModel");
                this.node_netTip.active = !0;
                this.node_netTip.getComponent(h.default).initCallBack(function () {
                    e.checkObjParam(t);
                    o.delSelf();
                }, "是否要删除 " + o.itemIndex + " 号组件？");
            };
            e.prototype.checkObjParam = function (t) {
                if (this.selectObj == t) {
                    this.selectObj = null;
                    this.showNodeParam(!1);
                }
            };
            e.prototype.copyObjCall = function () {
                var t = this;
                if (this.selectObj) {
                    var e = this.selectObj.getComponent("LegacyItemModel").getData(), o = {};
                    for (var i in e) o[i] = e[i];
                    o.x += 100;
                    this.createPrefab("itemObj", function (e) {
                        t.pan_obj.addChild(e);
                        t.index_obj++;
                        e.getComponent("LegacyItemModel").initItemObj(o.key, o, t.index_obj, t);
                        e.on(cc.Node.EventType.TOUCH_END, t.itemObjCall, t);
                        e.getComponent("LegacyItemModel").createAss();
                    });
                }
            };
            e.prototype.refreshParam = function (t) {
                var e = this;
                this.pan_eventobj.removeAllChildren();
                var o = 0, i = t.eventTrigger, n = function () {
                    var t = i[s];
                    a.createPrefab("itemEventObj", function (i) {
                        e.pan_eventobj.addChild(i);
                        o++;
                        i.getComponent("LegacyItemEventModel").initItemEventObj(t, o, e);
                    });
                }, a = this;
                for (var s in i) n();
            };
            e.prototype.oneKeyObj = function () {
                for (var t = 0, e = this.pan_obj.children; t < e.length; t++) e[t].getComponent("LegacyItemModel").createAss();
            };
            e.prototype.oneKeyUpdateAss = function () {
                for (var t = 0, e = this.pan_obj.children; t < e.length; t++) e[t].getComponent("LegacyItemModel").updateAss();
            };
            e.prototype.closeSeach = function () {
                this.node_seach.active = !1;
            };
            e.prototype.seachCall = function () {
                var t = this;
                if ("" != this.eb_seach.string) {
                    for (var e = this.eb_seach.string, o = [], i = 0, n = 0, a = this.pan_obj.children; n < a.length; n++) {
                        var s = a[n];
                        if (s.getComponent("LegacyItemModel").itemName.indexOf(e) >= 0) {
                            o.push(s);
                            i++;
                        }
                    }
                    this.label_seach.string = "搜索找到" + i + "个";
                    this.pan_seach.removeAllChildren();
                    for (var r = function (e) {
                        var o = e, i = {
                            index: e.getComponent("LegacyItemModel").itemIndex,
                            name: e.getComponent("LegacyItemModel").itemName
                        };
                        c.createPrefab("itemSeach", function (e) {
                            t.pan_seach.addChild(e);
                            e.getChildByName("lb_index").getComponent(cc.Label).string = i.index;
                            e.getChildByName("lb_name").getComponent(cc.Label).string = i.name;
                            e.link = o;
                            e.on(cc.Node.EventType.TOUCH_END, t.seachObjCall, t);
                        });
                    }, c = this, l = 0, h = o; l < h.length; l++) r(h[l]);
                    this.node_seach.active = !0;
                }
            };
            e.prototype.seachObjCall = function (t) {
                var e = t.currentTarget;
                e.link && this.itemObjCall({
                    currentTarget: e.link
                }, !0);
            };
            e.prototype.itemStartCall = function (t) {
                var e = t.currentTarget;
                if (e.isChoose) {
                    e.isChoose = !1;
                    this.chooseList[e.dataKey] = 0;
                    console.log("----- 取消 " + e.dataKey);
                } else {
                    e.isChoose = !0;
                    this.chooseList[e.dataKey] = 1;
                    console.log("----- 选中 " + e.dataKey);
                }
                e.getChildByName("sp_g").active = e.isChoose;
            };
            e.prototype.itemMoveCall = function () { };
            e.prototype.itemEndCall = function (t) {
                var e = t.getLocation();
                this.node_game.convertToNodeSpaceAR(e);
            };
            e.prototype.initGameItem = function (t, e, o) {
                var i = t.addComponent(cc.Sprite);
                this.setSpriteFrame(i, o.url);
                t.setPosition(e.x, e.y);
                this.node_game.addChild(t);
                t.itemData = o;
                t.itemData.zIndex = 3;
                t.on(cc.Node.EventType.TOUCH_START, this.editStartCall, this);
                t.on(cc.Node.EventType.TOUCH_MOVE, this.editMoveCall, this);
                t.on(cc.Node.EventType.TOUCH_END, this.editEndCall, this);
                t.on(cc.Node.EventType.TOUCH_CANCEL, this.editEndCall, this);
            };
            e.prototype.addGameItem = function (t, e) {
                this.node_game.addChild(t);
                this.locationObj(t.x, t.y);
                if (this.selectObj == e) {
                    this.refreshParam(e.getComponent("LegacyItemModel").getData());
                    this.showNodeParam(!0);
                }
            };
            e.prototype.locationObj = function (t, e) {
                this.node_game.x = -t;
                this.node_game.y = -e;
                this.slider_width.progress = t / this.gameWidth + .5;
                this.slider_height.progress = e / this.gameHeight + .5;
                this.eb_px.string = t + this.gameWidth / 2 + "";
                this.eb_py.string = -e + this.gameHeight / 2 + "";
            };
            e.prototype.locationPos = function () {
                var t = Number(this.eb_px.string) - this.gameWidth / 2, e = this.gameHeight / 2 - Number(this.eb_py.string);
                this.locationObj(t, e);
            };
            e.prototype.editStartCall = function (t) {
                this.editItem = t.currentTarget;
                this.editItem.runAction(cc.sequence(cc.scaleTo(.15, 1.15), cc.scaleTo(.15, 1)));
                this.showEdit();
            };
            e.prototype.editMoveCall = function (t) {
                if (null != this.editItem) {
                    var e = t.getLocation(), o = this.node_game.convertToNodeSpaceAR(e);
                    this.editItem.setPosition(o);
                }
            };
            e.prototype.editEndCall = function () { };
            e.prototype.sliderObjCall = function (t) {
                this.scroll_obj.scrollToPercentVertical(t.progress, 0);
            };
            e.prototype.sliderEventCall = function (t) {
                this.scroll_eventObj.scrollToPercentVertical(t.progress, 0);
            };
            e.prototype.sliderWidthCall = function (t) {
                this.node_game.x = -this.gameWidth * (t.progress - .5);
                var e = Math.floor(-this.node_game.x), o = Math.floor(-this.node_game.y);
                this.eb_px.string = e + this.gameWidth / 2 + "";
                this.eb_py.string = -o + this.gameHeight / 2 + "";
            };
            e.prototype.sliderHeightCall = function (t) {
                this.node_game.y = -this.gameHeight * (t.progress - .5);
                var e = Math.floor(-this.node_game.x), o = Math.floor(-this.node_game.y);
                this.eb_px.string = e + this.gameWidth / 2 + "";
                this.eb_py.string = -o + this.gameHeight / 2 + "";
            };
            e.prototype.btnSizeCall = function () {
                var t = Number(this.eb_width.string), e = Number(this.eb_height.string);
                if (t > 0 && e > 0) {
                    this.gameWidth = t;
                    this.gameHeight = e;
                    this.node_game.width = t;
                    this.node_game.height = e;
                    this.node_game.x = 0;
                    this.node_game.y = 0;
                    this.slider_width.progress = 0;
                    this.slider_height.progress = 0;
                }
            };
            e.prototype.showEdit = function () {
                this.node_data.active = !0;
            };
            e.prototype.hideEdit = function () {
                this.node_data.active = !1;
            };
            e.prototype.showNodeItem = function () {
                this.isImport && (this.node_item.active = !0);
            };
            e.prototype.hideNodeItem = function () {
                this.node_item.active = !1;
            };
            e.prototype.toggleItemCall = function (t, e) {
                null != this.editItem && (this.editItem.zIndex = e);
            };
            e.prototype.delItemCall = function () {
                if (null != this.editItem) {
                    this.editItem.destroy();
                    this.editItem = null;
                    this.hideEdit();
                }
            };
            a([u(cc.Node)], e.prototype, "node_show", void 0);
            a([u(cc.Node)], e.prototype, "node_game", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_width", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_height", void 0);
            a([u(cc.Slider)], e.prototype, "slider_width", void 0);
            a([u(cc.Slider)], e.prototype, "slider_height", void 0);
            a([u(cc.ScrollView)], e.prototype, "scroll_obj", void 0);
            a([u(cc.Slider)], e.prototype, "slider_obj", void 0);
            a([u(cc.ScrollView)], e.prototype, "scroll_eventObj", void 0);
            a([u(cc.Slider)], e.prototype, "slider_event", void 0);
            a([u(cc.Node)], e.prototype, "pan_item", void 0);
            a([u(cc.Label)], e.prototype, "lb_pos", void 0);
            a([u(cc.Label)], e.prototype, "label_locTime", void 0);
            a([u(cc.Label)], e.prototype, "label_netTime", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_seach", void 0);
            a([u(cc.Node)], e.prototype, "pan_seach", void 0);
            a([u(cc.Node)], e.prototype, "node_seach", void 0);
            a([u(cc.Label)], e.prototype, "label_seach", void 0);
            a([u(cc.Node)], e.prototype, "btn_pre", void 0);
            a([u(cc.Node)], e.prototype, "node_data", void 0);
            a([u(cc.Label)], e.prototype, "lb_name", void 0);
            a([u(cc.Node)], e.prototype, "node_item", void 0);
            a([u(cc.Node)], e.prototype, "pan_obj", void 0);
            a([u(cc.Node)], e.prototype, "pan_eventobj", void 0);
            a([u(cc.Node)], e.prototype, "node_event", void 0);
            a([u(cc.Node)], e.prototype, "pan_event", void 0);
            a([u(cc.Node)], e.prototype, "node_param", void 0);
            a([u(cc.Label)], e.prototype, "lb_ePre", void 0);
            a([u(cc.Label)], e.prototype, "lb_eTrigger", void 0);
            a([u(cc.Label)], e.prototype, "lb_index", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_map", void 0);
            a([u(cc.Node)], e.prototype, "node_org", void 0);
            a([u(cc.Node)], e.prototype, "node_camera", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_camera_x", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_camera_y", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_camera_start", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_camera_end", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_camera_time", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_camera_mod", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_px", void 0);
            a([u(cc.EditBox)], e.prototype, "eb_py", void 0);
            a([u(cc.Node)], e.prototype, "node_netTip", void 0);
            return a([p], e);
        }(s.default);
        o.default = m;
