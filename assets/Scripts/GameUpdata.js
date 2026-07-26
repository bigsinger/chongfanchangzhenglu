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
        var s = require("./GameInfo"), r = cc._decorator, c = r.ccclass, l = r.property, h = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.configUrl = null;
                e.pro = null;
                e.proLabel = null;
                e.sizeLabel = null;
                e.stateLabel = null;
                e.vesionLabel = null;
                e.failTimes = 0;
                e.erroIdx = 0;
                return e;
            }
            e.prototype.ctor = function () {
                this.failTimes = 0;
                this.hotParms = {};
            };
            e.prototype.onLoad = function () {
                this.pro.node.active = !0;
                this.erroIdx = 0;
            };
            e.prototype.onDestroy = function () {
                this.gameAm;
            };
            e.prototype.hotUpdateProcess = function () {
                console.log("==========hotUpdateProcess===222=====");
                this.startHotUp();
            };
            e.prototype.getHotUpdateParms = function () {
                this.erroIdx++;
                var t = this;
                console.log("===url=111==", "");
                var e = new XMLHttpRequest();
                e.open("GET", "", !0);
                e.send();
                e.onreadystatechange = function () {
                    if (4 === e.readyState) if (e.status >= 200 && e.status < 300) {
                        this.hotParms = JSON.parse(e.responseText);
                        console.log("===hotParms==" + JSON.stringify(this.hotParms));
                        this.startHotUp();
                    } else {
                        console.log("====payXhr.status==" + e.status);
                        this.erroIdx++;
                        this.again();
                    }
                }.bind(this);
                e.ontimeout = function () {
                    console.log("===获取参数超时");
                    t.again();
                };
                e.onerror = function () {
                    console.log("===获取参数出错");
                    t.again();
                };
            };
            e.prototype.again = function () { };
            e.prototype.Compare = function (t, e) {
                console.log("当前版本 :  " + t + " , 远程版本 : " + e);
                for (var o = t.split("."), i = e.split("."), n = 0; n < o.length && n < i.length; ++n) if (parseInt(o[n]) !== parseInt(i[n])) return -1;
                return i.length > o.length ? -1 : 0;
            };
            e.prototype.setVerifycb = function (t, e) {
                var o = e.compressed, i = e.md5, n = e.path, a = e.size;
                console.log("assetPath", t);
                console.log("assetSize:", a);
                if (o) {
                    this.stateLabel.string = "检查压缩 : " + n;
                    return !0;
                }
                this.stateLabel.string = "检查压缩 : " + n + " (" + i + ")";
                return !0;
            };
            e.prototype.startHotUp = function () {
                if (!this.gameAm) {
                    var t = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
                    console.log("Storage path for remote asset : " + t);
                    this.gameAm = new jsb.AssetsManager("", t, this.Compare);
                    this.gameAm.setVerifyCallback(this.setVerifycb.bind(this));
                    console.log(jsb.AssetsManager.State.UNINITED + "==getState=" + this.gameAm.getState());
                    console.log("==nativeUrl=" + JSON.stringify(this.configUrl));
                    if (this.gameAm.getState() === jsb.AssetsManager.State.UNINITED) {
                        var e = this.configUrl.nativeUrl;
                        console.info("check manifestUrl is: " + e);
                        var o = cc.loader;
                        o.md5Pipe && (e = o.md5Pipe.transformURL(e));
                        console.info("2222check manifestUrl is: " + e);
                        this.gameAm.loadLocalManifest(e);
                    }
                    var i = this.gameAm.getLocalManifest();
                    if (i && i.isLoaded()) {
                        console.log("热更新参数设置:");
                        console.log(i.getPackageUrl());
                        console.log(i.getManifestFileUrl());
                        console.log(i.getVersionFileUrl());
                        console.log("重新设置:");
                        i.setPackageUrl("https://minigame.buyu777.com/appupdate/data/longmarch/hotup20201224180913/zip/");
                        i.setManifestFileUrl("https://minigame.buyu777.com/appupdate/data/longmarch/hotup20201224180913/zip/project.manifest");
                        i.setVersionFileUrl("https://minigame.buyu777.com/appupdate/data/longmarch/hotup20201224180913/zip/version.manifest");
                        console.log(i.getPackageUrl());
                        console.log(i.getManifestFileUrl());
                        console.log(i.getVersionFileUrl());
                        s.default._version = "V_S_" + i.getVersion();
                        this.vesionLabel.string = s.default._version;
                        this.gameAm.setEventCallback(this.checkCb.bind(this));
                        this.gameAm.checkUpdate();
                    } else console.log("加载本地配置失败");
                }
            };
            e.prototype.checkCb = function (t) {
                switch (t.getEventCode()) {
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        console.log("未找到本地配置表,跳过热更");
                        this.enterGameProcess();
                        break;

                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                        console.log("下载远程配置表失败,跳过热更");
                        this.enterGameProcess();
                        break;

                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        console.log("解析远程配置表失败,跳过热更");
                        this.enterGameProcess();
                        break;

                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                        console.log("已是最新版本");
                        this.enterGameProcess();
                        break;

                    case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                        console.log("发现新版本1111");
                        this.setState("发现新版本");
                        this.gameAm.setEventCallback(null);
                        this.onHotUpdate();
                        break;

                    default:
                        return;
                }
            };
            e.prototype.onHotUpdate = function () {
                if (this.gameAm) {
                    console.log("11=gameAm=");
                    this.gameAm.setEventCallback(this.updateCb.bind(this));
                    console.log("=State=" + this.gameAm.getState());
                    if (this.gameAm.getState() === jsb.AssetsManager.State.UNINITED) {
                        var t = this.configUrl.nativeUrl;
                        console.log("hotUpdate" + t);
                        cc.loader.md5Pipe && (t = cc.loader.md5Pipe.transformURL(t));
                        this.gameAm.loadLocalManifest(t);
                    }
                    this.gameAm.update();
                }
            };
            e.prototype.updateCb = function (t) {
                var e = !1, o = !1;
                switch (t.getEventCode()) {
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        console.log("什么鬼");
                        o = !0;
                        break;

                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        var i = t.getDownloadedBytes(), n = t.getTotalBytes();
                        n && this.setProGress(i, n);
                        break;

                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        console.log("下载远程配置表失败,跳过热更");
                        o = !0;
                        break;

                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                        console.log("已经是最新版本");
                        o = !0;
                        break;

                    case jsb.EventAssetsManager.ASSET_UPDATED:
                        console.log("单个文件更新成功 " + t.getAssetId() + ", " + t.getMessage());
                        break;

                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        console.log("更新完成 " + t.getMessage());
                        var a = t.getTotalBytes();
                        a && this.setProGress(a, a);
                        this.setState("更新完成");
                        e = !0;
                        break;

                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        console.log("更新失败 " + t.getMessage());
                        if (this.failTimes > 3) this.setState("更新失败"); else {
                            this.failTimes++;
                            console.log("热更失败次数:" + this.failTimes);
                        }
                        break;

                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        console.log("更新出错 " + t.getAssetId() + ", " + t.getMessage());
                        break;

                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        console.log("解压出错" + t.getMessage());
                }
                if (o) {
                    console.log("111已是最新版本");
                    this.setState("已是最新版本");
                    this.gameAm.setEventCallback(null);
                    this.enterGameProcess();
                }
                if (e) {
                    console.log("===needRestart===");
                    this.gameAm.setEventCallback(null);
                    var s = jsb.fileUtils.getSearchPaths(), r = this.gameAm.getLocalManifest().getSearchPaths();
                    console.log(JSON.stringify(r));
                    Array.prototype.unshift(s, r);
                    cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(s));
                    jsb.fileUtils.setSearchPaths(s);
                    console.log(JSON.stringify(jsb.fileUtils.getSearchPaths()));
                    cc.audioEngine.stopAll();
                    setTimeout(function () {
                        console.log("==111=重启game===");
                        cc.game.restart();
                    }, 500);
                }
            };
            e.prototype.setProGress = function (t, e) {
                var o = t / e;
                this.pro && (this.pro.progress = o);
                if (this.proLabel) {
                    this.proLabel.node.active = !0;
                    this.proLabel.string = Number(100 * o) + "%";
                }
                if (this.sizeLabel) {
                    this.sizeLabel.node.active = !0;
                    var i = this.holdDecimal(t / 1024, 100);
                    if (i >= 1024) var n = (i = this.holdDecimal(i / 1024, 10)) + "M"; else n = i + "KB";
                    var a = this.holdDecimal(e / 1024, 100);
                    if (a >= 1024) var s = (a = this.holdDecimal(a / 1024, 10)) + "M"; else s = a + "KB";
                    this.sizeLabel.string = n + "/" + s;
                }
                t == e && this.setState("解压中....");
            };
            e.prototype.setState = function (t) {
                if (this.stateLabel) {
                    this.stateLabel.node.active = !0;
                    this.stateLabel.string = t;
                }
            };
            e.prototype.enterGameProcess = function () {
                this.node.getComponent("GameLoadScene").loadGameConfig();
            };
            e.prototype.holdDecimal = function (t, e) {
                if (!t || !e) return t;
                for (var o = parseInt(t * e + "") / e, i = 0; e >= 10;) {
                    e /= 10;
                    i++;
                }
                return o.toFixed(i);
            };
            a([l(cc.Asset)], e.prototype, "configUrl", void 0);
            a([l(cc.ProgressBar)], e.prototype, "pro", void 0);
            a([l(cc.Label)], e.prototype, "proLabel", void 0);
            a([l(cc.Label)], e.prototype, "sizeLabel", void 0);
            a([l(cc.Label)], e.prototype, "stateLabel", void 0);
            a([l(cc.Label)], e.prototype, "vesionLabel", void 0);
            return a([c], e);
        }(cc.Component);
        o.default = h;
