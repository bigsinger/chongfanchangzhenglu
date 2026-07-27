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
        var s = require("./GameState"), r = require("./PopupView"), c = cc._decorator, l = c.ccclass, h = c.property, d = function (t) {
            n(e, t);
            function e() {
                var e = null !== t && t.apply(this, arguments) || this;
                e.label_question = null;
                e.label_answer1 = null;
                e.label_answer2 = null;
                e.label_answer3 = null;
                e.m_questionIndex = 1;
                return e;
            }
            e.prototype.initData = function (t) {
                this.m_Data = t[0].split("|");
                this.m_callBack = t[1];
            };
            e.prototype.onLoad = function () {
                this.label_question.overflow = cc.Label.Overflow.SHRINK;
                this.label_question.enableWrapText = !0;
                this.label_question.node.height = Math.max(92, this.label_question.node.height);
            };
            e.prototype.start = function () {
                this.m_nowData = s.default.answerConf[this.m_Data[0]];
                this.label_question.string = this.m_questionIndex + "." + this.m_nowData.question;
                this.label_answer1.string = this.m_nowData.answer1;
                this.label_answer2.string = this.m_nowData.answer2;
                this.label_answer3.string = this.m_nowData.answer3;
                this.m_questionIndex++;
            };
            e.prototype.btnBack = function (t, e) {
                if (!this.m_isChick) {
                    this.m_isChick = !0;
                    console.log("==answerDialog==");
                    if (this.answerResults(e)) {
                        this.m_Data.shift();
                        if (this.m_Data.length <= 0) {
                            this.m_callBack(!0);
                            this._onClose();
                            this.m_isChick = !1;
                            console.log("==回答正确=");
                        } else {
                            this.start();
                            this.m_isChick = !1;
                        }
                    } else {
                        var o = this.m_nowData["answer" + this.m_nowData.right], i = this.m_nowData.explanation || "请结合本章史实线索再试一次。", n = this.label_question.color;
                        this.label_question.color = cc.color(255, 214, 126);
                        this.label_question.string = "回答错误，正确答案：" + o + "\n" + i;
                        var a = this;
                        this.scheduleOnce(function () {
                            a.label_question.color = n;
                            a.label_question.string = a.m_questionIndex - 1 + "." + a.m_nowData.question;
                            a.m_isChick = !1;
                        }, 3.2);
                        console.log("==回答错误=");
                    }
                }
            };
            e.prototype.answerResults = function (t) {
                return this.m_nowData.right == t;
            };
            a([h(cc.Label)], e.prototype, "label_question", void 0);
            a([h(cc.Label)], e.prototype, "label_answer1", void 0);
            a([h(cc.Label)], e.prototype, "label_answer2", void 0);
            a([h(cc.Label)], e.prototype, "label_answer3", void 0);
            return a([l], e);
        }(r.default);
        o.default = d;
