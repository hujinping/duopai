(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/award.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e825eK36zpNLZPA0J3dYF6G', 'award', __filename);
// Script/UI/component/award.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btn_getAward = null;
        _this._lb_des = null;
        _this._award = null;
        _this._light = null;
        _this._starNode = null;
        _this._awarData = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
        this.initStarAction();
    };
    NewClass.prototype.initNode = function () {
        this._btn_getAward = this.node.getChildByName("btn_get");
        this._lb_des = this.node.getChildByName("lb_des");
        this._award = this.node.getChildByName("award");
        this._light = this.node.getChildByName("light");
        this._starNode = this.node.getChildByName("starNode");
        this.initBtnEvent(this._btn_getAward);
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_get") {
                AudioManager_1.default.getInstance().playSound("audio/btnClose");
                _this.getAward();
                _this.node.destroy();
                _this.node.parent.destroy();
            }
        });
    };
    NewClass.prototype.initStarAction = function () {
        this._starNode.children[0].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1.0, 1.2), cc.scaleTo(1.5, 0.4))));
        this._starNode.children[1].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1.0, 0.4), cc.scaleTo(1.5, 1.0))));
        this._starNode.children[2].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1.0, 0.8), cc.scaleTo(1.5, 1.0))));
        this._starNode.children[3].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1.0, 1.1), cc.scaleTo(1.5, 0.7))));
        this._starNode.children[4].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1.0, 0.3), cc.scaleTo(1.5, 0.9))));
    };
    NewClass.prototype.showAward = function (awardData) {
        var _this = this;
        this._awarData = awardData;
        cc.loader.loadRes("textures/game1/award_" + (awardData.id - 1), cc.SpriteFrame, function (err, spriteFrame) {
            _this._award.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            _this._lb_des.getComponent(cc.Label).string = awardData.des;
            if (awardData.gold) {
                _this._lb_des.getComponent(cc.Label).string = awardData.des;
                var speed = _this.getIncomeSpeed();
                _this._lb_des.getComponent(cc.Label).string = Math.floor(speed * awardData.gold * 60) + "金币";
            }
        });
    };
    NewClass.prototype.getAward = function () {
        var gold = this._awarData.gold;
        var realMoney = this._awarData.realMoney;
        var speedup = this._awarData.speedup;
        var doubleIncome = this._awarData.doubleIncome;
        if (gold) {
            var speed = this.getIncomeSpeed();
            GameCtr_1.default.money += Math.floor(speed * gold * 60);
            GameCtr_1.default.rich += Math.floor(speed * gold * 60);
        }
        if (realMoney) {
        }
        if (speedup) {
            GameCtr_1.default.globalSpeedRate = 2;
            GameCtr_1.default.getInstance().getManufacture().resetLineAction();
            var curSpeedUpTime = GameCtr_1.default.getInstance().getGame().getCurSpeedUpTime();
            var speedUpTime = curSpeedUpTime > 0 ? speedup * 60 + curSpeedUpTime : speedup * 60;
            GameCtr_1.default.getInstance().getGame().startSpeedUpTimer(speedUpTime);
        }
        if (doubleIncome) {
            GameCtr_1.default.incomeRate = 2;
            GameCtr_1.default.getInstance().getManufacture().startDoubleTimer(speedup * 60);
        }
    };
    NewClass.prototype.getIncomeSpeed = function () {
        var combsUnlock = JSON.parse(GameCtr_1.default.getInstance().getCombsUnlock());
        var manufactures_speed = GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus /
            (GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].productTime +
                GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].transferTime);
        var combs_speed = 0;
        for (var i = 0; i < GameCtr_1.default.comblevel; i++) {
            combs_speed += (GameCtr_1.default.combConfig[i].initialIncome + GameCtr_1.default.combConfig[i].incomeMatrix * (combsUnlock[i].level - 1) * combsUnlock[i].level) / (GameCtr_1.default.combConfig[i].baseSpeed * 2);
        }
        var finalSpeed = combs_speed >= manufactures_speed ? manufactures_speed : combs_speed;
        return finalSpeed;
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
        //# sourceMappingURL=award.js.map
        