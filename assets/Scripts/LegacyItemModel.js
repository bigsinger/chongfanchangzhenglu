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
        var s = require("./GameUtilities"), r = require("./DragonBonesAnimationManager"), c = require("./SpineAnimationManager"), l = cc._decorator, h = l.ccclass, d = l.property, p = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.lb_index = null;
                e.eb_name = null;
                e.eb_x = null;
                e.eb_y = null;
                e.eb_z = null;
                e.eb_r = null;
                e.eb_sx = null;
                e.eb_sy = null;
                e.n_create = null;
                e.n_update = null;
                e.n_select = null;
                e.toggle_climb = null;
                e.assObj = null;
                e.assBox = null;
                e.assMount = null;
                e.assDragonBones = null;
                e.assButton = null;
                e.toggle_trigger = null;
                e.eb_id = null;
                e.toggle_loop = null;
                e.eb_door = null;
                e.toggle_drag = null;
                e.toggle_ob = null;
                e.toggle_ani = null;
                e.eb_ani = null;
                e.eb_bwidth = null;
                e.eb_bheight = null;
                e.eb_bx = null;
                e.eb_by = null;
                e.eb_button_bx = null;
                e.eb_button_by = null;
                e.txt_box = null;
                e.txt_button = null;
                e.toggle_lock = null;
                e.eb_lock = null;
                e.eb_unlock = null;
                e.toggle_hide = null;
                e.eb_guide = null;
                e.node_toggle = null;
                e.node_hero = null;
                e.eb_heroani = null;
                e.eb_herogo = null;
                e.toggle_dirLeft = null;
                e.eb_face = null;
                e.eb_color = null;
                return e;
            }
            e.prototype.start = function () {
                this.n_select.active = !1;
            };
            Object.defineProperty(e.prototype, "isCreate", {
                get: function () {
                    return null != this.assObj;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.isAniCall = function (t) {
                var e = t.isChecked;
                this.eb_ani.node.active = e;
            };
            e.prototype.isLockCall = function (t) {
                var e = t.isChecked;
                this.eb_lock.node.active = e;
                this.eb_unlock.node.active = e;
            };
            e.prototype.isDoorCall = function () { };
            e.prototype.updateDoor = function () { };
            e.prototype.isTriggerCall = function (t) {
                var e = t.isChecked;
                this.eb_id.node.active = e;
            };
            e.prototype.addEvent = function (t) {
                this.itemData.eventTrigger = t;
            };
            e.prototype.setEvent = function (t, e) {
                if (null == e) 1 == t ? this.itemData.eventPre = {} : 2 == t && (this.itemData.eventTrigger = {}); else for (var o in e) if (1 == t) {
                    null == this.itemData.eventPre && (this.itemData.eventPre = {});
                    1 == e[o] && (this.itemData.eventPre[o] = 1);
                } else if (2 == t) {
                    null == this.itemData.eventTrigger && (this.itemData.eventTrigger = {});
                    1 == e[o] && (this.itemData.eventTrigger[o] = 1);
                }
                this.editManager.refreshParam(this.itemData);
            };
            e.prototype.getData = function () {
                return this.itemData;
            };
            e.prototype.getConf = function () {
                if (this.assObj) {
                    this.itemData.isClimb = this.toggle_climb.isChecked;
                    this.itemData.isLoop = this.toggle_loop.isChecked;
                    this.itemData.isOb = this.toggle_ob.isChecked;
                    this.itemData.isDrag = this.toggle_drag.isChecked;
                    this.toggle_ani.isChecked && "" != this.eb_ani.string ? this.itemData.ani = this.eb_ani.string : this.itemData.ani = null;
                    if (this.toggle_lock.isChecked && "" != this.eb_lock.string) {
                        this.itemData.lockCount = Number(this.eb_lock.string);
                        this.itemData.unlock = this.eb_unlock.string;
                    } else this.itemData.lockCount = 0;
                    this.itemData.isLock = this.toggle_lock.isChecked;
                    this.itemData.isHide = this.toggle_hide.isChecked;
                    this.itemData.guide = this.eb_guide.string;
                    this.itemData.width = this.assObj.width;
                    this.itemData.height = this.assObj.height;
                    this.itemData.color = this.eb_color.string;
                    this.itemData.name = this.eb_name.string;
                    if ("initPos" == this.itemData.key) {
                        this.itemData.heroAni = this.eb_heroani.string;
                        this.itemData.heroGo = this.eb_herogo.string;
                        this.itemData.initLeft = this.toggle_dirLeft.isChecked;
                        this.itemData.heroface = this.eb_face.string;
                    }
                    return this.itemData;
                }
                return null;
            };
            e.prototype.showSelect = function (t) {
                this.n_select.active = t;
            };
            Object.defineProperty(e.prototype, "itemName", {
                get: function () {
                    return this.itemData.name;
                },
                enumerable: !1,
                configurable: !0
            });
            Object.defineProperty(e.prototype, "itemIndex", {
                get: function () {
                    return this.itemData.index;
                },
                enumerable: !1,
                configurable: !0
            });
            e.prototype.initItemObj = function (t, e, o, i) {
                this.itemData = e;
                this.itemData.key = t;
                this.itemData.eventPre = e.eventPre ? e.eventPre : null;
                this.itemData.eventTrigger = e.eventTrigger ? e.eventTrigger : [];
                this.editManager = i;
                this.lb_index.string = o;
                this.itemData.index = o;
                this.eb_name.string = this.itemData.name;
                this.eb_x.string = (null != e.x ? e.x + i.gameWidth / 2 : 0) + "";
                this.eb_y.string = (null != e.y ? i.gameHeight / 2 - e.y : 0) + "";
                this.eb_z.string = null != e.z ? e.z : "";
                this.eb_r.string = null != e.r ? e.r : 0;
                this.eb_sx.string = (e.sx ? e.sx : 1) + "";
                this.eb_sy.string = (e.sy ? e.sy : 1) + "";
                this.eb_bwidth.string = e.box ? e.box.width : "";
                this.eb_bheight.string = e.box ? e.box.height : "";
                this.eb_bx.string = e.box ? e.box.x : 0;
                this.eb_by.string = e.box ? e.box.y : 0;
                this.eb_button_bx.string = e.button ? e.button.x : 0;
                this.eb_button_by.string = e.button ? e.button.y : 0;
                this.eb_guide.string = e.guide ? e.guide : "";
                this.itemData.color && (this.eb_color.string = this.itemData.color);
                if ("initPos" == t) {
                    this.txt_box.active = !1;
                    this.txt_button.active = !1;
                    this.node_toggle.active = !1;
                    this.node_hero.active = !0;
                    this.itemData.heroAni && (this.eb_heroani.string = this.itemData.heroAni);
                    this.itemData.heroGo && (this.eb_herogo.string = this.itemData.heroGo);
                    this.itemData.heroface && (this.eb_face.string = this.itemData.heroface);
                    this.toggle_dirLeft.isChecked = null != this.itemData.initLeft && this.itemData.initLeft;
                }
                null != this.itemData.isDrag && (this.toggle_drag.isChecked = this.itemData.isDrag);
                null != this.itemData.isClimb && (this.toggle_climb.isChecked = this.itemData.isClimb);
                null != this.itemData.isLoop && (this.toggle_loop.isChecked = this.itemData.isLoop);
                null != this.itemData.isOb && (this.toggle_ob.isChecked = this.itemData.isOb);
                if (this.itemData.lockCount) {
                    this.toggle_lock.isChecked = !0;
                    this.eb_lock.node.active = !0;
                    this.eb_lock.string = this.itemData.lockCount;
                    this.eb_unlock.node.active = !0;
                    this.eb_unlock.string = this.itemData.unlock || "";
                }
                null != this.itemData.isLock && (this.toggle_lock.isChecked = this.itemData.isLock);
                if (null != this.itemData.ani) {
                    this.toggle_ani.isChecked = !0;
                    this.eb_ani.node.active = !0;
                    this.eb_ani.string = this.itemData.ani;
                }
                null != this.itemData.isHide && (this.toggle_hide.isChecked = this.itemData.isHide);
                this.n_update.active = !1;
            };
            e.prototype.createAss = function () {
                if (!this.assObj) {
                    this.assObj = new cc.Node();
                    var t = this.assObj.addComponent(cc.Sprite);
                    "goods" == this.itemData.key && this.toggle_ani.isChecked && "" != this.eb_ani.string && (this.itemData.url = "public/goods/" + this.eb_ani.string);
                    "" != this.itemData.url ? s.default.setSpriteFrame(t, this.itemData.url) : s.default.setSpriteFrame(t, "item/trigger");
                    "initPos" == this.itemData.key && (this.assObj.anchorY = 0);
                    this.updatePos();
                    var e = new cc.Node(), o = e.addComponent(cc.Label);
                    o.string = this.itemData.index;
                    o.fontSize = 27;
                    e.zIndex = 999;
                    this.assObj.addChild(e);
                    this.editManager.addGameItem(this.assObj, this.node);
                    this.n_create.active = !1;
                    this.n_update.active = !0;
                }
            };
            e.prototype.updatePos = function () {
                var t = this;
                this.itemData.name = this.eb_name.string;
                var e, o = Number(this.eb_x.string) - this.editManager.gameWidth / 2, i = -(Number(this.eb_y.string) - this.editManager.gameHeight / 2);
                this.assObj.setPosition(o, i);
                if ("" == this.eb_z.string) {
                    e = -i;
                    this.eb_z.string = e;
                } else e = Number(this.eb_z.string);
                this.assObj.zIndex = e;
                var n = Number(this.eb_sx.string), a = Number(this.eb_sy.string);
                this.assObj.scaleX = n;
                this.assObj.scaleY = a;
                this.itemData.x = o;
                this.itemData.y = i;
                this.itemData.z = e;
                this.itemData.sx = n;
                this.itemData.sy = a;
                var r = Number(this.eb_r.string);
                this.assObj.angle = r;
                this.itemData.r = r;
                if ("initPos" != this.itemData.key) {
                    if (!this.assBox) {
                        this.assBox = new cc.Node();
                        var c = this.assBox.addComponent(cc.Sprite);
                        s.default.setSpriteFrame(c, "item/btrigger");
                        this.assObj.addChild(this.assBox);
                    }
                    this.scheduleOnce(function () {
                        var e = "" != t.eb_bwidth.string ? Number(t.eb_bwidth.string) : t.assObj.width, o = "" != t.eb_bheight.string ? Number(t.eb_bheight.string) : t.assObj.height, i = Number(t.eb_bx.string), n = Number(t.eb_by.string);
                        t.eb_bwidth.string = e;
                        t.eb_bheight.string = o;
                        t.assBox.width = e;
                        t.assBox.height = o;
                        t.assBox.x = i;
                        t.assBox.y = n;
                        if (!t.assMount) {
                            t.assMount = new cc.Node();
                            t.assObj.addChild(t.assMount);
                        }
                        t.assMount.y = -t.assObj.height / 2;
                        var a = Number(t.eb_button_bx.string), r = Number(t.eb_button_by.string);
                        if (0 == a && 0 == r) null != t.assButton && (t.assButton.active = !1); else {
                            if (null == t.assButton) {
                                t.assButton = new cc.Node();
                                var c = t.assButton.addComponent(cc.Sprite);
                                s.default.setSpriteFrame(c, "ui/btn_tbgb");
                                t.assObj.addChild(t.assButton);
                            } else t.assButton.active = !0;
                            t.assButton.x = a;
                            t.assButton.y = r;
                        }
                        t.itemData.box = {
                            width: e,
                            height: o,
                            x: i,
                            y: n
                        };
                        t.itemData.button = {
                            x: a,
                            y: r
                        };
                    }, .2);
                    setTimeout(function () { }, 200);
                }
            };
            e.prototype.updataAni = function () {
                if (this.assDragonBones) {
                    this.assMount.getComponent(dragonBones.ArmatureDisplay) ? this.assMount.removeComponent(dragonBones.ArmatureDisplay) : this.assMount.getComponent(sp.Skeleton) && this.assMount.removeComponent(sp.Skeleton);
                    this.assDragonBones && (this.node.getComponent(r.default) ? this.node.removeComponent(r.default) : this.node.getComponent(c.default) && this.node.removeComponent(c.default));
                }
                if (this.toggle_ani.isChecked && "" != this.eb_ani.string) {
                    var t = !1, e = this.eb_ani.string, o = e.split("|");
                    if (-1 != o[0].indexOf("sp_")) {
                        t = !0;
                        e = o[0].replace("sp_", "");
                    }
                    this.assDragonBones = t ? this.node.addComponent(c.default) : this.node.addComponent(r.default);
                    var i = "" == o[1] ? "daiji" : o[1];
                    this.assDragonBones.initData(this.assMount, i, e);
                }
            };
            e.prototype.getPos = function () {
                return this.assObj ? {
                    x: this.itemData.x,
                    y: this.itemData.y
                } : null;
            };
            e.prototype.updateAss = function () {
                if (this.assObj) {
                    this.updatePos();
                    "collection" == this.itemData.key || "goods" == this.itemData.key ? this.updataImg(this.itemData.key) : "goods" != this.itemData.key && this.updataAni();
                }
            };
            e.prototype.updataImg = function (t) {
                if (this.toggle_ani.isChecked && "" != this.eb_ani.string) {
                    var e = this.assObj.addComponent(cc.Sprite);
                    if ("collection" == t) s.default.setSpriteFrame(e, "item/items/item" + this.eb_ani.string); else if ("goods" == t) {
                        this.itemData.url = "public/goods/" + this.eb_ani.string;
                        s.default.setSpriteFrame(e, this.itemData.url);
                    }
                }
            };
            e.prototype.delObj = function () {
                this.editManager.delObjCall(this.node);
            };
            e.prototype.delSelf = function () {
                this.assObj && this.assObj.destroy();
                this.node.destroy();
            };
            a([d(cc.Label)], e.prototype, "lb_index", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_name", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_x", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_y", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_z", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_r", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_sx", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_sy", void 0);
            a([d(cc.Node)], e.prototype, "n_create", void 0);
            a([d(cc.Node)], e.prototype, "n_update", void 0);
            a([d(cc.Node)], e.prototype, "n_select", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_climb", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_trigger", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_id", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_loop", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_door", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_drag", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_ob", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_ani", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_ani", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_bwidth", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_bheight", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_bx", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_by", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_button_bx", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_button_by", void 0);
            a([d(cc.Node)], e.prototype, "txt_box", void 0);
            a([d(cc.Node)], e.prototype, "txt_button", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_lock", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_lock", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_unlock", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_hide", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_guide", void 0);
            a([d(cc.Node)], e.prototype, "node_toggle", void 0);
            a([d(cc.Node)], e.prototype, "node_hero", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_heroani", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_herogo", void 0);
            a([d(cc.Toggle)], e.prototype, "toggle_dirLeft", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_face", void 0);
            a([d(cc.EditBox)], e.prototype, "eb_color", void 0);
            return a([h], e);
        }(cc.Component);
        o.default = p;
