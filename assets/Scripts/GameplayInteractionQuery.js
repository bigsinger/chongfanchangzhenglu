'use strict';

/**
 * 模块职责：提供无引擎副作用的交互目标查询算法。
 * 关键约束：纯函数设计保证运行时选择与 Node 回归测试使用同一套规则。
 */

// 场景和事件控制器共享这些纯查询；把引擎修改留在模块之外，可让目标选择稳定复现，
// 并直接运行于 Node 回归测试。

function distanceSquared(node, hero) {
    var offsetX = node.x - hero.x;
    var offsetY = node.y - hero.y;
    return offsetX * offsetX + offsetY * offsetY;
}

function unfinishedEvent(component) {
    if (!component || !Array.isArray(component.eventArr)) return null;
    for (var index = 0; index < component.eventArr.length; index++) {
        if (!component.eventArr[index].isFinish) return component.eventArr[index];
    }
    return null;
}

function receiverPriority(component, heldGoods) {
    if (!heldGoods) return 0;
    var event = unfinishedEvent(component);
    if (!event || !event.limit || String(event.limit).indexOf('prop') !== 0) return 0;
    return event.limit == heldGoods.nameid ? 2 : 1;
}

function operationPriority(component, heldGoods) {
    var receiver = receiverPriority(component, heldGoods);
    if (receiver) return receiver + 2;
    var conf = component && typeof component.getConf === 'function' ? component.getConf() : component && component.itemConf;
    var event = unfinishedEvent(component);
    // 存档修补后的传送触发器可能没有名称，因此同时按可读名称和事件契约识别入口。
    var isDoor = conf && /门/.test(conf.name || "") ||
        event && (Number(event.trigger) === 10 || Number(event.key) === 13);
    return isDoor ? 0 : 1;
}

function selectClosestOperation(options) {
    var hero = options.hero;
    var reachSquared = options.reachSquared;
    var maxDeltaX = Number(options.maxDeltaX);
    var maxDeltaY = Number(options.maxDeltaY);
    var resolveComponent = options.resolveComponent;
    var candidates = Array.isArray(options.stack) ? options.stack.slice() : [];
    var selectedNode = null;
    var selectedOperation = null;
    var selectedDistance = Number.isFinite(reachSquared) ? reachSquared : Number.POSITIVE_INFINITY;
    var selectedPriority = -1;

    if (!hero || typeof resolveComponent !== 'function') {
        return { node: null, operation: null };
    }

    for (var index = 0; index < candidates.length; index++) {
        var node = candidates[index];
        var component = node && node.activeInHierarchy && resolveComponent(node);
        var operation = component && component.getOpType();
        if (!operation) continue;
        var candidateDistance = distanceSquared(node, hero);
        var candidatePriority = operationPriority(component, options.heldGoods);
        var deltaX = Math.abs(node.x - hero.x);
        var deltaY = Math.abs(node.y - hero.y);
        // 原作仅保留两轴都在 300 设计单位内的碰撞候选；提供轴向限制时优先该接触模型，
        // 径向范围只供非玩法的独立调用者使用。
        var isReachable = Number.isFinite(maxDeltaX) && Number.isFinite(maxDeltaY) ?
            deltaX <= maxDeltaX && deltaY <= maxDeltaY :
            candidateDistance < reachSquared;
        if (isReachable &&
            (candidatePriority > selectedPriority ||
                candidatePriority === selectedPriority && candidateDistance < selectedDistance)) {
            selectedPriority = candidatePriority;
            selectedDistance = candidateDistance;
            selectedNode = node;
            selectedOperation = operation;
        }
    }

    return {
        node: selectedNode,
        operation: selectedOperation,
        distanceSquared: selectedNode ? selectedDistance : null,
        priority: selectedNode ? selectedPriority : null
    };
}

module.exports = {
    distanceSquared: distanceSquared,
    operationPriority: operationPriority,
    selectClosestOperation: selectClosestOperation
};
module.exports.default = module.exports;
