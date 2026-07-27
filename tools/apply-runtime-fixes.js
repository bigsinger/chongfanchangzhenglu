'use strict';

const fs = require('fs');
const path = require('path');

function replaceRequired(source, original, replacement, label) {
  if (source.includes(replacement)) return source;
  if (!source.includes(original)) {
    throw new Error(`Cannot apply runtime fix: ${label}`);
  }
  return source.replace(original, replacement);
}

function patchReliableInput(source) {
  if (source.includes('e.prototype.directionForKey')) return source;
  let updated = source;

  updated = replaceRequired(updated,
    `                e.m_touchState = 0;
                e.m_throwIndex = 0;`,
    `                e.m_touchState = 0;
                e.keyDirections = {};
                e.keyDirection = 0;
                e.m_throwIndex = 0;`,
    'track held directional keys');

  updated = replaceRequired(updated,
    `                    this.isCheck && (this.operateDir = 0);`,
    `                    if (this.isCheck) {
                        this.operateDir = 0;
                        this.hero_ts && this.hero_ts.stopMove();
                    } else this.keyDirection && this.dirCall(this.keyDirection);`,
    'resume a held key after scripted input blocking');

  updated = replaceRequired(updated,
    `            e.prototype.onKeyDown = function (t) {`,
    `            e.prototype.directionForKey = function (t) {
                switch (t) {
                    case cc.macro.KEY.left:
                    case cc.macro.KEY.a:
                        return this.DIR_LEFT;
                    case cc.macro.KEY.right:
                    case cc.macro.KEY.d:
                        return this.DIR_RIGHT;
                    case cc.macro.KEY.up:
                    case cc.macro.KEY.w:
                        return this.DIR_UP;
                    case cc.macro.KEY.down:
                    case cc.macro.KEY.s:
                        return this.DIR_DOWN;
                    default:
                        return 0;
                }
            };
            e.prototype.latestKeyDirection = function () {
                var t = 0;
                for (var e in this.keyDirections) t = this.keyDirections[e];
                return t;
            };
            e.prototype.onKeyDown = function (t) {
                var e = this.directionForKey(t.keyCode);
                if (e) {
                    this.keyDirections[t.keyCode] = e;
                    this.keyDirection = e;
                    this.dirCall(e);
                    return;
                }`,
    'route all directional keys through the held-key state');

  updated = replaceRequired(updated,
    `            e.prototype.onKeyUp = function (t) {`,
    `            e.prototype.onKeyUp = function (t) {
                var e = this.directionForKey(t.keyCode);
                if (e) {
                    delete this.keyDirections[t.keyCode];
                    e = this.latestKeyDirection();
                    this.keyDirection = e;
                    e ? this.dirCall(e) : this.dirEndCall(this.operateDir);
                    return;
                }`,
    'release only the key that actually ended');

  updated = replaceRequired(updated,
    `                this.layer_dir.on(cc.Node.EventType.TOUCH_END, this.controlEnd, this);
                this.btn_pass`,
    `                this.layer_dir.on(cc.Node.EventType.TOUCH_END, this.controlEnd, this);
                this.layer_dir.on(cc.Node.EventType.TOUCH_CANCEL, this.controlCancel, this);
                this.btn_pass`,
    'cancel an interrupted virtual-stick touch');

  updated = replaceRequired(updated,
    `            e.prototype.upGame = function () {`,
    `            e.prototype.controlCancel = function () {
                if (!this.isCheck) {
                    this.nPos = null;
                    this.node_control.active = !1;
                    this.controlAngle = 999;
                    this.btn_control.x = 0;
                    this.pan_control.angle = 0;
                    this.btn_light.active = !1;
                    this.dirEndCall(this.operateDir);
                }
            };
            e.prototype.upGame = function () {`,
    'reset virtual-stick state when a touch is cancelled');

  updated = replaceRequired(updated,
    `            e.prototype.dirEndCall = function (t) {
                2 == this.isToucheLong`,
    `            e.prototype.dirEndCall = function (t) {
                if (this.keyDirection) {
                    this.dirCall(this.keyDirection);
                    return;
                }
                2 == this.isToucheLong`,
    'prevent a touch ending from cancelling a held keyboard direction');

  return updated;
}

function patchWakeMovementInput(source) {
  if (source.includes('e.prototype.beginHeroMove')) return source;
  let updated = source;

  updated = replaceRequired(updated,
    `                            this.hero_ts.posMove(t, this.nPos.y);`,
    `                            this.beginHeroMove(t, this.nPos.y);`,
    'wake the role scheduler for delayed ground movement');
  updated = replaceRequired(updated,
    `                            this.hero_ts.posMove(this.hero.x, this.hero.y);`,
    `                            this.beginHeroMove(this.hero.x, this.hero.y);`,
    'wake the role scheduler for a near-hero tap');
  updated = replaceRequired(updated,
    `                        this.hero_ts.posMove(i.x / this.camera_master.zoomRatio + this.camera_master.node.x, i.y / this.camera_master.zoomRatio + this.camera_master.node.y);`,
    `                        this.beginHeroMove(i.x / this.camera_master.zoomRatio + this.camera_master.node.x, i.y / this.camera_master.zoomRatio + this.camera_master.node.y);`,
    'wake the role scheduler for direct ground movement');
  updated = replaceRequired(updated,
    `            e.prototype.dirCall = function (t) {`,
    `            e.prototype.beginHeroMove = function (t, e) {
                if (this.hero_ts && this.hero) {
                    this.hero_ts.setControl(!0);
                    this.hero_ts.posMove(t, e);
                }
            };
            e.prototype.dirCall = function (t) {`,
    'centralize movement scheduler recovery');
  updated = replaceRequired(updated,
    `this.hero_ts && this.hero_ts.ladderState && this.hero_ts.posMove(this.hero.x, 999999);`,
    `this.hero_ts && this.hero_ts.ladderState && this.beginHeroMove(this.hero.x, 999999);`,
    'wake upward movement');
  updated = replaceRequired(updated,
    `this.hero_ts && this.hero_ts.ladderState && this.hero_ts.posMove(this.hero.x, -999999);`,
    `this.hero_ts && this.hero_ts.ladderState && this.beginHeroMove(this.hero.x, -999999);`,
    'wake downward movement');
  updated = replaceRequired(updated,
    `this.hero_ts && this.hero_ts.posMove(-999999, this.hero.y);`,
    `this.beginHeroMove(-999999, this.hero.y);`,
    'wake left movement');
  updated = replaceRequired(updated,
    `this.hero_ts && this.hero_ts.posMove(999999, this.hero.y);`,
    `this.beginHeroMove(999999, this.hero.y);`,
    'wake right movement');
  return updated;
}

function patchCanvasTouchReceiver(source) {
  if (source.includes('e.prototype.surfaceControlStart')) return source;
  let updated = source;

  updated = replaceRequired(updated,
    `                this.layer_dir.on(cc.Node.EventType.TOUCH_START, this.controlStart, this);
                this.layer_dir.on(cc.Node.EventType.TOUCH_MOVE, this.controlMove, this);
                this.layer_dir.on(cc.Node.EventType.TOUCH_END, this.controlEnd, this);
                this.layer_dir.on(cc.Node.EventType.TOUCH_CANCEL, this.controlCancel, this);`,
    `                this.node.on(cc.Node.EventType.TOUCH_START, this.surfaceControlStart, this);
                this.node.on(cc.Node.EventType.TOUCH_MOVE, this.surfaceControlMove, this);
                this.node.on(cc.Node.EventType.TOUCH_END, this.surfaceControlEnd, this);
                this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.surfaceControlCancel, this);`,
    'receive ground touches from Canvas when the restored overlay covers layer_dir');

  updated = replaceRequired(updated,
    `            e.prototype.controlCancel = function () {`,
    `            e.prototype.isGameSurfaceTouch = function (t) {
                return t.target === this.node || t.target === this.layer_dir || t.target && "ani_node" === t.target.name;
            };
            e.prototype.surfaceControlStart = function (t) {
                this.isGameSurfaceTouch(t) && this.controlStart(t);
            };
            e.prototype.surfaceControlMove = function (t) {
                this.isGameSurfaceTouch(t) && this.controlMove(t);
            };
            e.prototype.surfaceControlEnd = function (t) {
                this.isGameSurfaceTouch(t) && this.controlEnd(t);
            };
            e.prototype.surfaceControlCancel = function (t) {
                this.isGameSurfaceTouch(t) && this.controlCancel(t);
            };
            e.prototype.controlCancel = function () {`,
    'route Canvas touch phases through the existing movement controller');

  return updated;
}

function patchGlobalTouchListener(source) {
  if (source.includes('e.prototype.getInteractiveBubble')) return source;
  let updated = source;

  updated = replaceRequired(updated,
    `                this.node.on(cc.Node.EventType.TOUCH_START, this.surfaceControlStart, this);
                this.node.on(cc.Node.EventType.TOUCH_MOVE, this.surfaceControlMove, this);
                this.node.on(cc.Node.EventType.TOUCH_END, this.surfaceControlEnd, this);
                this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.surfaceControlCancel, this);`,
    `                this.installGlobalTouchControls();`,
    'bypass the restored full-screen Spine node when receiving ground touches');

  updated = replaceRequired(updated,
    `            e.prototype.isGameSurfaceTouch = function (t) {`,
    `            e.prototype.installGlobalTouchControls = function () {
                var t = this;
                this.m_globalTouchListener && cc.eventManager.removeListener(this.m_globalTouchListener);
                this.m_globalTouchListener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: !1,
                    onTouchBegan: function (e) {
                        var o = t.getInteractiveBubble(e);
                        if (o) {
                            o.bubbleBack();
                            return !1;
                        }
                        if (t.isUiControlTouch(e)) return !1;
                        t.controlStart(e);
                        return !0;
                    },
                    onTouchMoved: function (e) {
                        t.controlMove(e);
                    },
                    onTouchEnded: function (e) {
                        t.controlEnd(e);
                    },
                    onTouchCancelled: function () {
                        t.controlCancel();
                    }
                });
                cc.eventManager.addListener(this.m_globalTouchListener, -1);
            };
            e.prototype.getInteractiveBubble = function (t) {
                if (!this.itemMap) return null;
                var e = t.getLocation();
                for (var o in this.itemMap) {
                    var i = this.itemMap[o], n = i && i.getComponent("itemBox"), a = n && n.node_bubble;
                    if (a && a.activeInHierarchy && a.getBoundingBoxToWorld().contains(e)) return n;
                }
                return null;
            };
            e.prototype.isUiControlTouch = function (t) {
                var e = t.getLocation(), o = [this.btn_user, this.btn_throw, this.btn_climb, this.btn_pass, this.btn_tips];
                for (var i = 0; i < o.length; i++) {
                    var n = o[i];
                    if (n && n.activeInHierarchy && n.getBoundingBoxToWorld().contains(e)) return !0;
                }
                return !1;
            };
            e.prototype.onDestroy = function () {
                this.m_globalTouchListener && cc.eventManager.removeListener(this.m_globalTouchListener);
                this.m_globalTouchListener = null;
            };
            e.prototype.isGameSurfaceTouch = function (t) {`,
    'install a lifecycle-managed global ground-touch listener');

  return updated;
}

function patchInteractionControls(source) {
  if (source.includes('e.prototype.isUiControlTouch')) return source;
  return replaceRequired(source,
    `            e.prototype.setInteract = function () { };`,
    `            e.prototype.setInteract = function (t) {
                void 0 === t && (t = 0);
                this.interactMod = t || c.default.OP_USE;
                var e = t > 0;
                this.btn_user.active = e && t != c.default.OP_CLIMB;
                this.btn_climb.active = e && t == c.default.OP_CLIMB;
                if (e) {
                    var o = t == c.default.OP_CLIMB ? this.img_special : this.img_user;
                    o && h.default.setSpriteFrame(o, "ui/interact_" + t);
                }
            };`,
    'restore the operation HUD when the player enters an item collider');
}

function patchGameScene(source) {
  let updated = source;

  // The reliable-input pass below is already present in the checked-in scene.
  // Treat it as the canonical, idempotent result so normal incremental builds
  // do not try to reapply the older, narrower key-handler substitutions.
  if (updated.includes('e.prototype.directionForKey')) return patchGlobalTouchListener(patchInteractionControls(patchCanvasTouchReceiver(patchWakeMovementInput(updated))));

  updated = replaceRequired(updated,
    `                        e.node.addChild(t);
                        console.log("------------- heroPos ", i);`,
    `                        e.node.addChild(t);
                        e.gameNode.setSiblingIndex(Math.min(4, e.node.childrenCount - 1));
                        console.log("------------- heroPos ", i);`,
    'keep the gameplay map behind the touch and UI layers');

  updated = replaceRequired(updated,
    `                    case cc.macro.KEY.a:
                        this.dirCall(this.DIR_LEFT);`,
    `                    case cc.macro.KEY.left:
                    case cc.macro.KEY.a:
                        this.dirCall(this.DIR_LEFT);`,
    'add Left Arrow keyboard movement');

  updated = replaceRequired(updated,
    `                    case cc.macro.KEY.d:
                        this.dirCall(this.DIR_RIGHT);
                        break;

                    case cc.macro.KEY.r:`,
    `                    case cc.macro.KEY.right:
                    case cc.macro.KEY.d:
                        this.dirCall(this.DIR_RIGHT);
                        break;

                    case cc.macro.KEY.up:
                    case cc.macro.KEY.w:
                        this.dirCall(this.DIR_UP);
                        break;

                    case cc.macro.KEY.down:
                    case cc.macro.KEY.s:
                        this.dirCall(this.DIR_DOWN);
                        break;

                    case cc.macro.KEY.r:`,
    'add Right/Up/Down keyboard movement');

  updated = replaceRequired(updated,
    `                    case cc.macro.KEY.a:
                        this.dirEndCall(this.DIR_LEFT);`,
    `                    case cc.macro.KEY.left:
                    case cc.macro.KEY.a:
                        this.operateDir == this.DIR_LEFT && this.dirEndCall(this.DIR_LEFT);`,
    'stop Left Arrow keyboard movement');

  updated = replaceRequired(updated,
    `                    case cc.macro.KEY.d:
                        this.dirEndCall(this.DIR_RIGHT);
                        break;

                    case cc.macro.KEY.r:`,
    `                    case cc.macro.KEY.right:
                    case cc.macro.KEY.d:
                        this.operateDir == this.DIR_RIGHT && this.dirEndCall(this.DIR_RIGHT);
                        break;

                    case cc.macro.KEY.up:
                    case cc.macro.KEY.w:
                        this.operateDir == this.DIR_UP && this.dirEndCall(this.DIR_UP);
                        break;

                    case cc.macro.KEY.down:
                    case cc.macro.KEY.s:
                        this.operateDir == this.DIR_DOWN && this.dirEndCall(this.DIR_DOWN);
                        break;

                    case cc.macro.KEY.r:`,
    'stop Right/Up/Down keyboard movement');

  updated = replaceRequired(updated,
    `                    this.nPos = this.layer_master.convertToNodeSpaceAR(e);
                    this.refreshControl(1);`,
    `                    this.nPos = this.layer_master.convertToNodeSpaceAR(e);
                    this.node_control.active = !0;
                    this.refreshControl(1);`,
    'show the original virtual joystick');

  updated = replaceRequired(updated,
    `                        case this.DIR_UP:
                            this.operateDir = this.DIR_UP;
                            break;

                        case this.DIR_DOWN:
                            this.operateDir = this.DIR_DOWN;
                            break;

                        case this.DIR_LEFT:
                            this.operateDir = this.DIR_LEFT;
                            break;

                        case this.DIR_RIGHT:
                            this.operateDir = this.DIR_RIGHT;`,
    `                        case this.DIR_UP:
                            this.operateDir = this.DIR_UP;
                            this.hero_ts && this.hero_ts.ladderState && this.hero_ts.posMove(this.hero.x, 999999);
                            break;

                        case this.DIR_DOWN:
                            this.operateDir = this.DIR_DOWN;
                            this.hero_ts && this.hero_ts.ladderState && this.hero_ts.posMove(this.hero.x, -999999);
                            break;

                        case this.DIR_LEFT:
                            this.operateDir = this.DIR_LEFT;
                            this.hero_ts && this.hero_ts.posMove(-999999, this.hero.y);
                            break;

                        case this.DIR_RIGHT:
                            this.operateDir = this.DIR_RIGHT;
                            this.hero_ts && this.hero_ts.posMove(999999, this.hero.y);`,
    'connect direction state to the role movement controller');

  updated = replaceRequired(updated,
    `                    this.camera_master_ts.initTrack(this.hero.position);
                    this.operateDir = 0;
                }
            };
            e.prototype.insPoint`,
    `                    this.camera_master_ts.initTrack(this.hero.position);
                    this.operateDir = 0;
                }
                if (this.hero_ts) if (t == this.DIR_UP || t == this.DIR_DOWN) {
                    this.hero_ts.targetY = null;
                    this.hero_ts.stopMoveLadder();
                } else (t == this.DIR_LEFT || t == this.DIR_RIGHT) && this.hero_ts.stopMove();
            };
            e.prototype.insPoint`,
    'stop role movement when direction input ends');

  return patchGlobalTouchListener(patchCanvasTouchReceiver(patchWakeMovementInput(patchReliableInput(updated))));
}

function applyRuntimeFixes(projectRoot = path.resolve(__dirname, '..')) {
  const gameScenePath = path.join(projectRoot, 'assets', 'Scripts', 'GameplaySceneController.js');
  const original = fs.readFileSync(gameScenePath, 'utf8');
  const updated = patchGameScene(original);
  if (updated !== original) fs.writeFileSync(gameScenePath, updated, 'utf8');
  return {
    changed: updated !== original,
    files: [path.relative(projectRoot, gameScenePath).replace(/\\/g, '/')],
  };
}

if (require.main === module) {
  const result = applyRuntimeFixes();
  console.log(`${result.changed ? 'Applied' : 'Verified'} runtime input fixes: ${result.files.join(', ')}`);
}

module.exports = { applyRuntimeFixes, patchGameScene };
