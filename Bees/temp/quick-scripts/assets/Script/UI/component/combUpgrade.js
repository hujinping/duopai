(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/combUpgrade.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '40cb7pLa8JN2axI5Uo8PUBD', 'combUpgrade', __filename);
// Script/UI/component/combUpgrade.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var Util_1 = require("../../Common/Util");
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._lb_des = null;
        _this._btn_close = null;
        _this._btn_upgrade = null;
        _this._lb_cost = null;
        _this._level = null;
        _this._unlockNum = null;
        _this._interval = 0;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this._lb_des = this.node.getChildByName("lb_des");
        this._btn_close = this.node.getChildByName("btn_close");
        this.initBtnEvent(this._btn_close);
    };
    NewClass.prototype.init = function (level, unlockNum) {
        this._level = level;
        this._unlockNum = unlockNum;
        this._lb_des.getComponent(cc.Label).string = this._unlockNum + 1;
        this.showCells();
        this.showSpeed();
        this.showhoneyProduction();
        this.showUpgrade();
        this.updateBtnState();
        this.initBtnEvent(this._btn_upgrade);
    };
    NewClass.prototype.showCells = function () {
        var cells = this.node.getChildByName("cells");
        var lb_value = cells.getChildByName("lb_value");
        var lb_add = cells.getChildByName("lb_add");
        lb_value.getComponent(cc.Label).string = "" + this._unlockNum;
        lb_add.getComponent(cc.Label).string = "+" + 1;
    };
    NewClass.prototype.showSpeed = function () {
        var speed = this.node.getChildByName("speed");
        var lb_value = speed.getChildByName("lb_value");
        var lb_add = speed.getChildByName("lb_add");
        lb_value.getComponent(cc.Label).string = "100%";
        lb_add.getComponent(cc.Label).string = "+0%";
    };
    NewClass.prototype.showhoneyProduction = function () {
        var honeyPorduction = this.node.getChildByName("honeyProduction");
        var lb_value = honeyPorduction.getChildByName("lb_value");
        var lb_add = honeyPorduction.getChildByName("lb_add");
        lb_value.getComponent(cc.Label).string = "" + Util_1.default.formatNumber(GameCtr_1.default.combConfig[this._level - 1].initialIncome + GameCtr_1.default.combConfig[this._level - 1].incomeMatrix * (this._unlockNum - 1));
        lb_add.getComponent(cc.Label).string = "+" + Util_1.default.formatNumber(GameCtr_1.default.combConfig[this._level - 1].incomeMatrix);
    };
    NewClass.prototype.showUpgrade = function () {
        var upgrade = this.node.getChildByName("upgrade");
        this._btn_upgrade = upgrade.getChildByName("btn_upgrade");
        this._lb_cost = this._btn_upgrade.getChildByName("lb_cost");
        this._lb_cost.getComponent(cc.Label).string = "￥" + Util_1.default.formatNumber(GameCtr_1.default.combConfig[this._level - 1].levelUpCost + GameCtr_1.default.combConfig[this._level - 1].upMatrix * (this._unlockNum));
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_close") {
                _this.node.destroy();
                GameCtr_1.default.getInstance().getGame().setMaskVisit(false);
                GameCtr_1.default.getInstance().getGame().clearCombUpGrade();
                AudioManager_1.default.getInstance().playSound("audio/btnClose");
            }
            else if (e.target.getName() == "btn_upgrade") {
                if (!_this._btn_upgrade.getComponent(cc.Button).interactable) {
                    return;
                }
                AudioManager_1.default.getInstance().playSound("audio/btn_click");
                var comb = GameCtr_1.default.getInstance().getGame().getComb(_this._level);
                comb.getComponent("honeycomb").upgrade();
                _this._unlockNum++;
                _this._lb_des.getComponent(cc.Label).string = _this._unlockNum + 1;
                if (_this._unlockNum == GameCtr_1.default.maxPerCombLevel) {
                    _this._btn_upgrade.getComponent(cc.Button).interactable = false;
                    _this._lb_cost.getComponent(cc.Label).string = "已满级";
                    return;
                }
                _this.showCells();
                _this.showSpeed();
                _this.showhoneyProduction();
                _this.showUpgrade();
                _this.updateBtnState();
            }
        });
    };
    NewClass.prototype.updateBtnState = function () {
        if (GameCtr_1.default.money < GameCtr_1.default.combConfig[this._level - 1].levelUpCost + GameCtr_1.default.combConfig[this._level - 1].upMatrix * this._unlockNum) {
            this._btn_upgrade.getComponent(cc.Button).interactable = false;
        }
        else {
            this._btn_upgrade.getComponent(cc.Button).interactable = true;
        }
    };
    NewClass.prototype.doUpdate = function (dt) {
        if (this._btn_upgrade.getComponent(cc.Button).interactable || this._unlockNum >= GameCtr_1.default.maxPerCombLevel) {
            return;
        }
        this._interval += dt;
        if (this._interval >= 0.5) {
            this.updateBtnState();
            this._interval = 0;
        }
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
        //# sourceMappingURL=combUpgrade.js.map
        