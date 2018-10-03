(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/ufoAward.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '372d5nHoUtOraAgUzirUS6R', 'ufoAward', __filename);
// Script/UI/component/ufoAward.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var Util_1 = require("../../Common/Util");
var WXCtr_1 = require("../../Controller/WXCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btn_close = null;
        _this._btn_get = null;
        _this._lb_bonus = null;
        _this._bonusValue = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this._btn_close = this.node.getChildByName("btn_close");
        this._btn_get = this.node.getChildByName("btn_get");
        this._lb_bonus = this.node.getChildByName("lb_bonus");
        this._btn_get.active = GameCtr_1.default.isAudited;
        this.initEvent(this._btn_close);
        this.initEvent(this._btn_get);
        this.initBonusValue();
    };
    NewClass.prototype.initEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_close") {
                _this.node.destroy();
                if (!GameCtr_1.default.isAudited) {
                    GameCtr_1.default.money += _this._bonusValue;
                    GameCtr_1.default.rich += _this._bonusValue;
                }
                AudioManager_1.default.getInstance().playSound("audio/btnClose");
            }
            else if (e.target.getName() == "btn_get") {
                var callFunc = function () {
                    GameCtr_1.default.money += 2 * _this._bonusValue;
                    GameCtr_1.default.rich += 2 * _this._bonusValue;
                    _this.node.destroy();
                };
                if (GameCtr_1.default.vedioTimes <= 0) {
                    WXCtr_1.default.share({ callback: callFunc });
                }
                else {
                    WXCtr_1.default.showVideoAd(callFunc.bind(_this));
                }
                AudioManager_1.default.getInstance().playSound("audio/open_panel");
            }
        });
    };
    NewClass.prototype.initBonusValue = function () {
        var combsUnlock = JSON.parse(GameCtr_1.default.getInstance().getCombsUnlock());
        var manufactures_speed = GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus /
            (GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].productTime +
                GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].transferTime);
        var combs_speed = 0;
        for (var i = 0; i < combsUnlock.length; i++) {
            combs_speed += (GameCtr_1.default.combConfig[i].initialIncome + GameCtr_1.default.combConfig[i].incomeMatrix * (combsUnlock[i].level - 1) * combsUnlock[i].level) / (GameCtr_1.default.combConfig[i].baseSpeed * 2);
        }
        var finalSpeed = combs_speed >= manufactures_speed ? manufactures_speed : combs_speed;
        this._bonusValue = Math.floor(finalSpeed * 300);
        this._lb_bonus.getComponent(cc.Label).string = "$" + Util_1.default.formatNumber(Math.floor(finalSpeed * 300));
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
        //# sourceMappingURL=ufoAward.js.map
        