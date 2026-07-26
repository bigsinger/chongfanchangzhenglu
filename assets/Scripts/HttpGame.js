'use strict';

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = function () {
            function t() { }
            t.saveConfig = function (t, e) {
                t.gametype = this.gametype;
                this.gosend("tool/saveStage", t, e);
            };
            t.checkName = function (t, e) {
                t.gametype = this.gametype;
                this.gosend("tool/findStageByName", t, e);
            };
            t.config = function (t, e) {
                t.gametype = this.gametype;
                this.gosend("tool/config", t, e);
            };
            t.saveAINewResult = function (t, e) {
                t.gametype = this.gametype;
                this.gosend("tool/saveAINewResult", t, e);
            };
            t.gosend = function (t, e, o) {
                var i = this.httpConnect();
                if (this.currenturl != t) {
                    this.currenturl = t;
                    this.errnum = 0;
                }
                this.callback = o;
                i.onreadystatechange = function () {
                    this.completeHandler(this.callback, i);
                }.bind(this);
                i.onerror = this.errorHandler.bind(this);
                i.ontimeout = this.processHandler.bind(this);
                i.open("POST", "https://minigame.buyu777.com/develop/" + t);
                i.setRequestHeader("Access-Control-Allow-Origin", "*");
                i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                i.send(JSON.stringify(e));
            };
            t.httpConnect = function () {
                var t = cc.loader.getXMLHttpRequest();
                t.timeout = 12e3;
                return t;
            };
            t.processHandler = function () { };
            t.errorHandler = function (t) {
                this.errnum++;
                console.log("=请求=超时==" + t);
            };
            t.completeHandler = function (t, e) {
                console.log("---http---- completeHandler e ");
                if (4 == e.readyState && e.status >= 200 && e.status < 400) {
                    var o = e.responseText;
                    if (o) {
                        var i = JSON.parse(o);
                        console.log("解析完毕，执行回调函数" + o);
                        this.callback && this.callback(i);
                    }
                }
            };
            t.gametype = "cz";
            t.errnum = 0;
            return t;
        }();
        o.default = i;
