'use strict';

Object.defineProperty(exports, "__esModule", {
    value: !0
});

// Keep the historical configuration strings compatible while exposing
// descriptive, extension-free resource paths to the runtime.
var effectAliases = {
    "action/dig-hands-rubble": "dig-hands",
    "action/fire": "burn",
    "action/bucket-getwater": "fetch-water",
    "action/bucket-splash": "splash-water",
    "action/bucket-outfire": "extinguish",
    "action/pickup": "pick",
    "action/dig-shovel-rubble": "dig-shovel",
    "action/dig-hands-earth": "dig-hands",
    "action/mortar-fire": "mortar-fire",
    "action/climb": "climb",
    "action/pull-tree": "pull-tree",
    "action/cut-bamboo": "cut",
    "action/die": "die",
    "action/shot-gun": "rifle-shot",
    "dig-hands-rubble": "dig-hands",
    "fire": "burn",
    "bucket-getwater": "fetch-water",
    "bucket-splash": "splash-water",
    "bucket-outfire": "extinguish",
    "pickup": "pick",
    "dig-shovel-rubble": "dig-shovel",
    "dig-hands-earth": "dig-hands",
    "cut-bamboo": "cut",
    "shot-gun": "rifle-shot",
    "walk": "footsteps-walk",
    "path": "footsteps-walk",
    "run": "footsteps-run",
    "chuihao": "bugle-call",
    "hanyang": "hanyang-rifle",
    "kaiqiang": "rifle-shot",
    "zhongzheng": "zhongzheng-rifle",
    "grenadeso": "grenade-throw",
    "grenadebang": "grenade-impact",
    "grenadeboom": "grenade-explosion"
};

var musicAliases = {
    "home": "main-menu-theme",
    "loadbg": "loading-theme",
    "cg/cgbgm": "cutscenes/opening-theme",
    "gkbg/bgm1": "gameplay/main-theme",
    "transitionbg/transition-1-0": "chapter-transitions/chapter-1-part-0",
    "transitionbg/transition-1-1": "chapter-transitions/chapter-1-part-1",
    "transitionbg/transition-1-2": "chapter-transitions/chapter-1-part-2",
    "transitionbg/transition-1-3": "chapter-transitions/chapter-1-part-3"
};

function normalize(value) {
    return String(value || "")
        .replace(/\\/g, "/")
        .replace(/\.(mp3|wav|ogg)$/i, "")
        .replace(/_/g, "-")
        .replace(/^sound\/effect\//i, "")
        .replace(/^audio\/effect\//i, "")
        .replace(/^sound\//i, "")
        .replace(/^audio\//i, "")
        .toLowerCase();
}

function effectKey(value) {
    var normalized = normalize(value);
    return effectAliases[normalized] || normalized;
}

function musicKey(value) {
    var normalized = normalize(value);
    return musicAliases[normalized] || normalized;
}

exports.default = {
    effectKey: effectKey,
    effectPath: function (value) {
        return "audio/effect/" + effectKey(value);
    },
    musicKey: musicKey,
    musicPath: function (value) {
        return "audio/" + musicKey(value);
    },
    effectAliases: effectAliases,
    musicAliases: musicAliases
};
