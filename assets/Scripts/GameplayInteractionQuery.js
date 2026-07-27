'use strict';

// Pure query helpers shared by the scene and event controllers.  Keeping
// engine mutations outside this module makes target selection deterministic
// and lets the behaviour run in Node-based regression tests.

function appendUnique(target, candidate) {
    candidate && target.indexOf(candidate) < 0 && target.push(candidate);
}

function collectCandidates(stack, nearby) {
    var result = Array.isArray(stack) ? stack.slice() : [];
    if (Array.isArray(nearby)) {
        for (var index = 0; index < nearby.length; index++) appendUnique(result, nearby[index]);
    } else if (nearby) {
        for (var key in nearby) {
            if (Object.prototype.hasOwnProperty.call(nearby, key)) appendUnique(result, nearby[key]);
        }
    }
    return result;
}

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
    var resolveComponent = options.resolveComponent;
    var preferredNode = options.preferredNode;
    var candidates = collectCandidates(options.stack, options.nearby);
    appendUnique(candidates, preferredNode);
    var selectedNode = null;
    var selectedOperation = null;
    var selectedDistance = reachSquared;
    var selectedPriority = -1;

    if (!hero || typeof resolveComponent !== 'function') {
        return { node: null, operation: null };
    }

    for (var index = 0; index < candidates.length; index++) {
        var node = candidates[index];
        var component = node && node.activeInHierarchy && resolveComponent(node);
        var operation = component && component.getOpType();
        // ObjectiveManager derives its target from the repaired authored
        // event configuration. A legacy component can temporarily expose a
        // stale eventArr after restoring a save, so allow that already
        // validated objective operation to bridge the one-frame mismatch.
        node === preferredNode && !operation && (operation = options.preferredOperation);
        if (!operation) continue;
        var candidateDistance = distanceSquared(node, hero);
        var candidatePriority = operationPriority(component, options.heldGoods) + (node === preferredNode ? 100 : 0);
        if (candidateDistance < reachSquared &&
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

function scanProximity(options) {
    var hero = options.hero;
    var itemMap = options.itemMap || {};
    var previousTouchActive = options.previousTouchActive || {};
    var touchActive = {};
    var nearby = [];
    var touchEntries = [];
    if (!hero) return { touchActive: touchActive, nearby: nearby, touchEntries: touchEntries };

    for (var key in itemMap) {
        if (!Object.prototype.hasOwnProperty.call(itemMap, key)) continue;
        var node = itemMap[key];
        var component = node && node.activeInHierarchy && options.resolveComponent(node);
        if (!component || !component.itemConf || component.itemConf.lockCount > 0 || !component.eventArr) continue;
        var itemDistance = distanceSquared(node, hero);
        if (itemDistance <= options.operationReachSquared) nearby.push(node);
        var event = unfinishedEvent(component);
        if (event && Number(event.key) <= 1000 && Number(event.trigger) === Number(options.touchOperation) &&
            itemDistance <= options.touchReachSquared) {
            touchActive[key] = true;
            if (!previousTouchActive[key]) {
                touchEntries.push({ key: key, node: node, event: event });
            }
        }
    }

    return {
        touchActive: touchActive,
        nearby: nearby,
        touchEntries: touchEntries
    };
}

module.exports = {
    collectCandidates: collectCandidates,
    distanceSquared: distanceSquared,
    operationPriority: operationPriority,
    selectClosestOperation: selectClosestOperation,
    scanProximity: scanProximity
};
module.exports.default = module.exports;
