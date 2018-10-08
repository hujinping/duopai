(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/manufactureUpgrade.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '26ee5KMbq9KT5d5w6ZGfISn', 'manufactureUpgrade', __filename);
// Script/UI/component/manufactureUpgrade.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var Util_1 = require("../../Common/Util");
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lb_des = null;
        _this._btn_close = null;
        _this._btn_upgrade = null;
        _this._lb_cost = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this.lb_des = this.node.getChildByName("lb_des");
        this._btn_close = this.node.getChildByName("btn_close");
        this.lb_des.getComponent(cc.Label).string = GameCtr_1.default.ManufactureLevel + 1;
        if (this.isMaxLevel()) {
            this.lb_des.getComponent(cc.Label).string = GameCtr_1.default.ManufactureLevel;
        }
        this.showHoneyProfit();
        this.showSpeed();
        this.showCapacity();
        this.showUpgrade();
        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_upgrade);
        this.showBtn();
    };
    NewClass.prototype.showHoneyProfit = function () {
        var honeyProfit = this.node.getChildByName("honeyProfit");
        var lb_value = honeyProfit.getChildByName("lb_value");
        var lb_add = honeyProfit.getChildByName("lb_add");
        lb_value.getComponent(cc.Label).string = "$" + Util_1.default.formatNumber(Math.ceil(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus - 0));
        lb_add.getComponent(cc.Label).string = "+$" + Util_1.default.formatNumber(Math.ceil(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel].perBonus - GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus));
    };
    NewClass.prototype.showSpeed = function () {
        var speed = this.node.getChildByName("speed");
        var lb_value = speed.getChildByName("lb_value");
        var lb_add = speed.getChildByName("lb_add");
        lb_value.getComponent(cc.Label).string = "" + Math.ceil(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].showSpeed * 100) + "%";
        lb_add.getComponent(cc.Label).string = "+1%"; //"+"+Math.ceil((GameCtr.manufactureConfig[GameCtr.ManufactureLevel].showSpeed-GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].showSpeed)*100)+"%";
    };
    NewClass.prototype.showCapacity = function () {
        var capacity = this.node.getChildByName("capacity");
        var lb_value = capacity.getChildByName("lb_value");
        var lb_add = capacity.getChildByName("lb_add");
        lb_value.getComponent(cc.Label).string = Util_1.default.formatNumber(Math.ceil(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus)) + "";
        lb_add.getComponent(cc.Label).string = "+" + Util_1.default.formatNumber(Math.ceil(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel].perBonus - GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus));
    };
    NewClass.prototype.showUpgrade = function () {
        var upgrade = this.node.getChildByName("upgrade");
        this._btn_upgrade = upgrade.getChildByName("btn_upgrade");
        this._lb_cost = this._btn_upgrade.getChildByName("lb_cost");
        if (this.isMaxLevel()) {
            return;
        }
        this.lb_des.getComponent(cc.Label).string = GameCtr_1.default.ManufactureLevel + 1;
        this._lb_cost.getComponent(cc.Label).string = "$" + Util_1.default.formatNumber(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].cost);
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_close") {
                _this.node.destroy();
                GameCtr_1.default.getInstance().getGame().setMaskVisit(false);
                GameCtr_1.default.getInstance().getGame().clearManufactureUpgrade();
                AudioManager_1.default.getInstance().playSound("audio/btnClose");
            }
            else if (e.target.getName() == "btn_upgrade") {
                if (GameCtr_1.default.ManufactureLevel < GameCtr_1.default.maxManufactureLevel && GameCtr_1.default.money < GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].cost) {
                    GameCtr_1.default.getInstance().getGame().showGoldNotEnough();
                    return;
                }
                if (!_this._btn_upgrade.getComponent(cc.Button).interactable) {
                    return;
                }
                GameCtr_1.default.getInstance().getManufacture().upgrade();
                AudioManager_1.default.getInstance().playSound("audio/levelup");
                _this.showBtn();
                if (_this.isMaxLevel()) {
                    return;
                }
                _this.lb_des.getComponent(cc.Label).string = GameCtr_1.default.ManufactureLevel + 1;
                _this.showHoneyProfit();
                _this.showSpeed();
                _this.showCapacity();
                _this.showUpgrade();
            }
        });
    };
    NewClass.prototype.showBtn = function () {
        if (GameCtr_1.default.money >= GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].cost) {
            this._btn_upgrade.getComponent(cc.Button).interactable = true;
        }
        else {
            this._btn_upgrade.getComponent(cc.Button).interactable = false;
        }
        if (GameCtr_1.default.ManufactureLevel >= GameCtr_1.default.maxManufactureLevel) {
            this._btn_upgrade.getComponent(cc.Button).interactable = false;
            var lb_cost = this._btn_upgrade.getChildByName("lb_cost");
            var word_fullLevel = this._btn_upgrade.getChildByName("word_fullLevel");
            lb_cost.active = false;
            word_fullLevel.active = true;
        }
    };
    NewClass.prototype.isMaxLevel = function () {
        return GameCtr_1.default.ManufactureLevel == GameCtr_1.default.maxManufactureLevel;
    };
    NewClass.prototype.doUpdate = function () {
        if (this._btn_upgrade.getComponent(cc.Button).interactable) {
            return;
        }
        this.showBtn();
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

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
        //# sourceMappingURL=manufactureUpgrade.js.map
        