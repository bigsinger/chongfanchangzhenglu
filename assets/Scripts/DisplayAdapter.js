'use strict';

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var DESIGN_HEIGHT = 750;

function coverWideScreen(node, referenceWidth) {
    if (!node || !cc.isValid(node, !0)) return;
    var visible = cc.view.getVisibleSize();
    var factor = Math.max(1, visible.width / referenceWidth, visible.height / DESIGN_HEIGHT);
    if (null == node.__longMarchBaseScaleX) {
        node.__longMarchBaseScaleX = node.scaleX;
        node.__longMarchBaseScaleY = node.scaleY;
    }
    node.scaleX = node.__longMarchBaseScaleX * factor;
    node.scaleY = node.__longMarchBaseScaleY * factor;
}

function apply(canvasNode, options) {
    options = options || {};
    var referenceWidth = Number(options.referenceWidth) || 1650;
    if (cc.view.setOrientation && cc.macro.ORIENTATION_LANDSCAPE) {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
    }
    if (cc.view.setDesignResolutionSize && cc.ResolutionPolicy) {
        cc.view.setDesignResolutionSize(referenceWidth, DESIGN_HEIGHT, cc.ResolutionPolicy.FIXED_HEIGHT);
    }
    var canvas = canvasNode && canvasNode.getComponent(cc.Canvas);
    if (canvas) {
        canvas.designResolution = cc.size(referenceWidth, DESIGN_HEIGHT);
        canvas.fitWidth = !1;
        canvas.fitHeight = !0;
    }
    var coverNodes = options.coverNodes || [];
    for (var index = 0; index < coverNodes.length; index++) {
        coverWideScreen(coverNodes[index], referenceWidth);
    }
    console.log("------------ 横屏显示适配 " + Math.round(cc.view.getVisibleSize().width) + "x" + Math.round(cc.view.getVisibleSize().height));
}

exports.default = {
    DESIGN_HEIGHT: DESIGN_HEIGHT,
    apply: apply,
    coverWideScreen: coverWideScreen
};
