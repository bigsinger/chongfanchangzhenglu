'use strict';

// Pure query helpers shared by the scene and event controllers.  Keeping
// engine mutations outside this module makes target selection deterministic
// and lets the behaviour run in Node-based regression tests.

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
    // Authored transfer triggers are sometimes unnamed after save repair, so
    // recognise doors by both their readable name and their event contract.
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
        // The original APK only kept collider candidates while both axes
        // stayed within 300 design units. Prefer that authored contact model
        // when axis limits are supplied; radial reach remains available for
        // isolated non-gameplay callers.
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
