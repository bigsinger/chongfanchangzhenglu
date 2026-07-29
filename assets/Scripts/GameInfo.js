'use strict';

/**
 * 模块职责：提供应用版本、渠道和运行环境等只读信息。
 * 关键约束：运行信息集中导出，避免各界面产生不一致版本文案。
 */

var e = module;
var o = exports;

Object.defineProperty(o, "__esModule", {
            value: !0
        });
        var i = function () {
            function t() { }
            t._version = "V_S_1.2.0";
            t.nowGkId = 1;
            return t;
        }();
        o.default = i;
