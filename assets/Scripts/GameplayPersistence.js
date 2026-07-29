'use strict';

/**
 * 模块职责：捕获并提交场景物品、跟随者和主角临时状态。
 * 关键约束：一次交互写入完整快照，避免前台与后台切换留下半完成状态。
 */

// GameplaySceneController 决定何时保存，本模块负责如何捕获并提交完整场景快照。

function captureItems(itemMap, followMap, heroTempProvider) {
    var items = [];
    var followers = followMap || {};
    for (var key in itemMap) {
        if (!Object.prototype.hasOwnProperty.call(itemMap, key)) continue;
        var node = itemMap[key];
        if (!node) continue;
        var component = node.getComponent('InteractiveObject');
        if (!component || typeof component.getTempConf !== 'function') continue;
        var item = component.getTempConf();
        if (!item || followers[item.index] != null) continue;
        if (item.key === 'initPos' && typeof heroTempProvider === 'function') item = heroTempProvider();
        item && items.push(item);
    }
    return items;
}

function saveScene(options) {
    var hero = options.heroController;
    var gameState = options.gameState;
    var config = options.configManager;
    var saveManager = options.saveManager;
    if (!hero || !gameState || !config || !saveManager) {
        throw new Error('GameplayPersistence.saveScene 缺少必要依赖');
    }
    gameState.onlinetm = new Date().getTime();
    var items = captureItems(options.itemMap || {}, hero.followMap, function () {
        return hero.getTempConf();
    });
    config.saveTempData(options.mapName, items, options.heroPosition, options.walkingMode);
    config.saveHeroItem(hero.goods);
    config.saveHeroFollow(hero.followMap);
    config.saveHeroSpine(hero.m_path);
    gameState.saveMapInfo();
    saveManager.commit('game-scene', gameState.playData);
    return items;
}

module.exports = {
    captureItems: captureItems,
    saveScene: saveScene
};
module.exports.default = module.exports;
