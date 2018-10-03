(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/game/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f1f06VxNc1Fi7PAUDkZyb/2', 'Game', __filename);
// Script/UI/game/Game.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 游戏界面
 * 游戏逻辑自己实现
 */
var GameCtr_1 = require("../../Controller/GameCtr");
var AudioManager_1 = require("../../Common/AudioManager");
// import AudioManager from "../../Common/AudioManager";
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._honeycombContent = null;
        _this._pipelineNode = null;
        _this._glassPipeline = null;
        _this._mask = null;
        _this._combUpgrade = null;
        _this._manufactureUpgrade = null;
        _this._combList = [];
        _this.test = null;
        _this.test1 = null;
        _this.honeyComb = null;
        return _this;
    }
    Game.prototype.onLoad = function () {
        GameCtr_1.default.getInstance().setGame(this);
        GameCtr_1.default.getInstance().initEventTarget();
        this.initData();
        this.initNode();
        AudioManager_1.default.getInstance().playMusic("audio/bgMusic");
        //MemoryDetector.showMemoryStatus();
    };
    Game.prototype.initData = function () {
        //window.localStorage.clear();
        if (window.localStorage.getItem("level")) {
            GameCtr_1.default.level = Number(window.localStorage.getItem("level"));
        }
        else {
            GameCtr_1.default.level = 1;
            GameCtr_1.default.getInstance().setPlayerLevel();
        }
        if (window.localStorage.getItem("ManufactureLevel")) {
            GameCtr_1.default.ManufactureLevel = Number(window.localStorage.getItem("ManufactureLevel"));
        }
        else {
            GameCtr_1.default.ManufactureLevel = 1;
            GameCtr_1.default.getInstance().setManufactureLevel();
        }
        if (window.localStorage.getItem("comblevel")) {
            GameCtr_1.default.comblevel = Number(window.localStorage.getItem("comblevel"));
        }
        else {
            GameCtr_1.default.comblevel = 1;
            GameCtr_1.default.getInstance().setCombLevel();
        }
        if (window.localStorage.getItem("combsUnlock")) {
            GameCtr_1.default.combsUnlock = JSON.parse(window.localStorage.getItem("combsUnlock"));
        }
        else {
            GameCtr_1.default.combsUnlock = [];
            GameCtr_1.default.combsUnlock.push(1);
            GameCtr_1.default.getInstance().setCombsUnlock();
            var combsUnlock = GameCtr_1.default.getInstance().getCombsUnlock();
        }
    };
    Game.prototype.initNode = function () {
        this._mask = this.node.getChildByName("mask");
        this._honeycombContent = this.node.getChildByName("honeycombNode").getChildByName("scrollView").getChildByName("view").getChildByName("content");
        this._pipelineNode = this._honeycombContent.getChildByName("pipelineNode");
        this._glassPipeline = this._honeycombContent.getChildByName("glassPipeline");
        this._glassPipeline.setLocalZOrder(0);
        this._pipelineNode.setLocalZOrder(10);
        this.initComb();
    };
    Game.prototype.initComb = function () {
        var combsUnlock = GameCtr_1.default.getInstance().getCombsUnlock();
        for (var level = 0; level < GameCtr_1.default.comblevel + 5; level++) {
            var honeyComb = cc.instantiate(this.honeyComb);
            var unlock = combsUnlock[level] ? combsUnlock[level] : 0;
            honeyComb.tag = GameCtr_1.default.comblevel + level;
            honeyComb.parent = this._honeycombContent;
            honeyComb.setLocalZOrder(2);
            honeyComb.x = 60;
            honeyComb.y = -200 - 408 * level;
            honeyComb.getComponent("honeycomb").setLevel(level + 1, unlock);
            honeyComb.getComponent("honeycomb").initBtn();
            this._combList.push(honeyComb);
        }
    };
    Game.prototype.unlockComb = function () {
        var comb = this._honeycombContent.getChildByTag(GameCtr_1.default.comblevel + 1);
        comb.getComponent("honeycomb").setCanUnlock(true);
        comb.getComponent("honeycomb").showUnlockBtn(true);
        GameCtr_1.default.comblevel++;
    };
    Game.prototype.getComb = function (combLevel) {
        return this._honeycombContent.getChildByTag(combLevel);
    };
    Game.prototype.setMaskVisit = function (isVisit) {
        this._mask.active = isVisit;
    };
    Game.prototype.setCombUpgrade = function (node) {
        this._combUpgrade = node;
    };
    Game.prototype.setManufactureUpgrade = function (node) {
        this._manufactureUpgrade = node;
    };
    Game.prototype.clearCombUpGrade = function () {
        this._combUpgrade = null;
    };
    Game.prototype.clearManufactureUpgrade = function () {
        this._manufactureUpgrade = null;
    };
    Game.prototype.update = function (dt) {
        for (var i = 0; i < this._combList.length; i++) {
            this._combList[i].getComponent("honeycomb").doWork(dt);
        }
        if (this._combUpgrade) {
            this._combUpgrade.getComponent("combUpgrade").doUpdate(dt);
        }
        if (this._manufactureUpgrade) {
            this._manufactureUpgrade.getComponent("manufactureUpgrade").doUpdate(dt);
        }
    };
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "test", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "test1", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "honeyComb", void 0);
    Game = __decorate([
        ccclass
    ], Game);
    return Game;
}(cc.Component));
exports.default = Game;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Game.js.map
        