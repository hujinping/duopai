"use strict";
cc._RF.push(module, 'f720eRqKgtA3oGpzEAPoskw', 'goldNotEnough');
// Script/UI/component/goldNotEnough.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../../Common/Util");
var GameCtr_1 = require("../../Controller/GameCtr");
var AudioManager_1 = require("../../Common/AudioManager");
var WXCtr_1 = require("../../Controller/WXCtr");
var HttpCtr_1 = require("../../Controller/HttpCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btn_get = null;
        _this._btn_close = null;
        _this._lb_bonus = null;
        _this._offlineIncome = 0;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this._btn_get = this.node.getChildByName("btn_get");
        this._btn_close = this.node.getChildByName("btn_close");
        this._lb_bonus = this.node.getChildByName("lb_bonus");
        this._lb_bonus.getComponent(cc.Label).string = "";
        this.initBtn(this._btn_get);
        this.initBtn(this._btn_close);
        this.init();
    };
    NewClass.prototype.init = function () {
        var combsUnlock = JSON.parse(GameCtr_1.default.getInstance().getCombsUnlock());
        var manufactures_speed = GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus /
            (GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].productTime +
                GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].transferTime);
        var combs_speed = 0;
        for (var i = 0; i < combsUnlock.length; i++) {
            combs_speed += (GameCtr_1.default.combConfig[i].initialIncome + GameCtr_1.default.combConfig[i].incomeMatrix * (combsUnlock[i].level - 1) * combsUnlock[i].level) / (GameCtr_1.default.combConfig[i].baseSpeed * 2);
        }
        var finalSpeed = combs_speed >= manufactures_speed ? manufactures_speed : combs_speed;
        this._offlineIncome = 5 * 60 * finalSpeed;
        this._lb_bonus.getComponent(cc.Label).string = "$" + Util_1.default.formatNumber(Math.floor(this._offlineIncome));
    };
    NewClass.prototype.initBtn = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_get") {
                var callFunc = function () {
                    GameCtr_1.default.money += Math.floor(_this._offlineIncome);
                    GameCtr_1.default.rich += Math.floor(_this._offlineIncome);
                    GameCtr_1.default.getInstance().getLevel().setMoney();
                    _this.node.destroy();
                };
                WXCtr_1.default.share({ callback: callFunc });
                HttpCtr_1.default.openClick(GameCtr_1.default.clickType.goldNotEnoughShare);
            }
            else if (e.target.getName() == "btn_close") {
                _this.node.destroy();
            }
            AudioManager_1.default.getInstance().playSound("audio/btnClose");
        });
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();