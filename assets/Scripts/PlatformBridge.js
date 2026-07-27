'use strict';

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = function () {
            function t() { }
            t.melogin = function () {
                console.log("===========登录========");
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "melogin:", "") : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "melogin", "()V");
            };
            t.prototype.staticstartlevel = function (t) {
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "startlevel:", t) : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startlevel", "()V");
            };
            t.finishlevel = function (t) {
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "finishlevel:", t) : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "finishlevel", "()V");
            };
            t.faillevel = function (t) {
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "faillevel:", t) : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "faillevel", "()V");
            };
            t.setevent = function (t, e) {
                void 0 === e && (e = null);
                e = e || {};
                console.log("=2=上传事件内容==" + JSON.stringify(e));
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "setevent:", JSON.stringify(e)) : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setevent", "(Ljava/lang/String;)V", JSON.stringify(e));
            };
            t.gotouser = function () {
                if (cc.sys.os == cc.sys.OS_IOS) {
                    var t = {
                        server_id: "LoginProxy.serverId",
                        game_role_id: "playerVo.uid",
                        server_name: "LoginProxy.server.name",
                        game_role_name: "playerVo.name",
                        game_role_lv: "playerVo.level"
                    };
                    console.log("==角色信息==" + JSON.stringify(t));
                    jsb.reflection.callStaticMethod("AppController", "gotouser:", JSON.stringify(t));
                } else cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "gotouser", "()V");
            };
            t.exitgame = function () {
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "exitgame:", "") : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "exitgame", "()V");
            };
            t.init = function () {
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "IAP_SDKInit:", "1") : (cc.sys.os,
                    cc.sys.OS_ANDROID);
            };
            t.testBuy = function () {
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "IAP_testbuy:", "1") : (cc.sys.os,
                    cc.sys.OS_ANDROID);
            };
            t.upuser = function () {
                if (!this.goGame) {
                    this.gotouser();
                    this.goGame = !0;
                }
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "uplv:", "playerVo.level") : (cc.sys.os,
                    cc.sys.OS_ANDROID);
            };
            t.nativeVideo = function (t, e, o) {
                var i = this;
                void 0 === o && (o = 1);
                if (!t || "" == t) return console.log("error 视频参数错误");
                this.m_jumpBack = e;
                if (!cc.sys.isNative && this.m_jumpBack) {
                    setTimeout(function () {
                        i.m_jumpBack();
                    }, 200);
                    return console.log("非移动端暂时不播视频");
                }
                cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "nativeVideo:", t, o) : cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "nativeVideo", "(Ljava/lang/String;Ljava/lang/String;)V", t, o);
            };
            t.jumpCallBack = function () {
                console.log("jumpCallBack");
                this.m_jumpBack && this.m_jumpBack();
            };
            return t;
        }();
        o.default = i;
        cc.externalGame = i;
