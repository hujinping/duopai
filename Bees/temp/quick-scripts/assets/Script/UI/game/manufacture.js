(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/game/manufacture.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '275a4HhEyhKo51/C8/9e3GH', 'manufacture', __filename);
// Script/UI/game/manufacture.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var Util_1 = require("../../Common/Util");
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.jar_black = null;
        _this.jar_yellow = null;
        _this.manufactureUpgrade = null;
        _this.bubbleMoney = null;
        _this._lb_honey = null;
        _this._lb_upSpeedTime = null;
        _this._lb_doubleTime = null;
        _this._btn_upgrade = null;
        _this._btn_upSpeed = null;
        _this._btn_doubleIncome = null;
        _this._icon_arrow = null;
        _this._timeCount = -1;
        _this._timeCount1 = -1;
        _this._speed = 1;
        _this._isWorking = false;
        _this._mask = null;
        _this._speedUpTime = -1;
        _this._upLine = null;
        _this._downLine = null;
        _this._plug = null;
        _this._pulleyList = [];
        _this._jarNode = null;
        _this._doubleTime = 0;
        _this._speedTime = 0;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        GameCtr_1.default.getInstance().setManufacture(this);
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this._lb_honey = this.node.getChildByName("lb_honey");
        this._lb_upSpeedTime = this.node.getChildByName("lb_upSpeedTime");
        this._lb_doubleTime = this.node.getChildByName("lb_doubleTime");
        this._btn_upgrade = this.node.getChildByName("btn_upgrade");
        this._btn_upSpeed = this.node.getChildByName("btn_speedUp");
        this._btn_doubleIncome = this.node.getChildByName("btn_boubleIncome");
        this._mask = this.node.getChildByName("mask");
        this._icon_arrow = this.node.getChildByName("icon_arrow");
        this._upLine = this.node.getChildByName("upline");
        this._downLine = this.node.getChildByName("downline");
        this._plug = this.node.getChildByName("plug");
        this._jarNode = this.node.getChildByName("jarNode");
        var pulleyNode = this.node.getChildByName("pulleyNode");
        for (var i = 0; i < 6; i++) {
            var pulley = pulleyNode.getChildByName("pulley" + i);
            this._pulleyList.push(pulley);
        }
        this._plug.setLocalZOrder(1);
        this._lb_upSpeedTime.active = false;
        this._lb_doubleTime.active = false;
        this._btn_doubleIncome.getComponent(cc.Button).interactable = false;
        this._btn_upSpeed.active = false;
        // this._icon_arrow.active=false;
        this.initBtnEvent(this._btn_upgrade);
        this.initBtnEvent(this._mask);
        this.initBtnEvent(this._btn_upSpeed);
        this.initBtnEvent(this._btn_doubleIncome);
        this.showBtn();
    };
    NewClass.prototype.setHoneyValue = function () {
        this._lb_honey.getComponent(cc.Label).string = Util_1.default.formatNumber(GameCtr_1.default.honeyValue);
    };
    NewClass.prototype.doWork = function () {
        var _this = this;
        if (GameCtr_1.default.honeyValue - GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus < 0) {
            this._isWorking = false;
            return;
        }
        this._isWorking = true;
        var jar = cc.instantiate(this.jar_black);
        this._speed = this._speedUpTime > 0 ? GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].speed : 1;
        jar.parent = this._jarNode;
        jar.x = -203;
        jar.y = 545;
        this._plug.runAction(cc.sequence(cc.scaleTo(0.2 / this._speed * GameCtr_1.default.globalSpeedRate, 0.8), cc.scaleTo(0.1 / this._speed * GameCtr_1.default.globalSpeedRate, 1.0), cc.delayTime((GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].productTime - (0.2 / this._speed * GameCtr_1.default.globalSpeedRate) - (0.1 / this._speed * GameCtr_1.default.globalSpeedRate)) / this._speed * GameCtr_1.default.globalSpeedRate)));
        jar.runAction(cc.sequence(cc.delayTime(0.3), cc.moveTo(0.2, cc.p(-203, 365)), cc.delayTime(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].transferTime / (this._speed * GameCtr_1.default.globalSpeedRate)), cc.callFunc(function () {
            jar.removeFromParent();
            GameCtr_1.default.money += GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus * GameCtr_1.default.incomeRate;
            GameCtr_1.default.levelMoney += GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus * GameCtr_1.default.incomeRate;
            GameCtr_1.default.getInstance().getLevel().setMoney();
            GameCtr_1.default.getInstance().getLevel().updateLevelProgress();
            GameCtr_1.default.getInstance().emitEvent("moneyUpdate", null);
            _this.showBtn();
            _this.showBubbleMoney(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus * GameCtr_1.default.incomeRate);
        })));
        GameCtr_1.default.honeyValue -= GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus;
        this.setHoneyValue();
        this.scheduleOnce(this.doWork.bind(this), GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].productTime / (this._speed * GameCtr_1.default.globalSpeedRate));
    };
    NewClass.prototype.showBubbleMoney = function (money) {
        var bubbleMoney = cc.instantiate(this.bubbleMoney);
        bubbleMoney.parent = this.node;
        bubbleMoney.x = 450;
        bubbleMoney.getComponent("bubbleMoney").setMoney(money);
        AudioManager_1.default.getInstance().playSound("audio/gold");
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        var move_x = 0;
        btn.on(cc.Node.EventType.TOUCH_START, function (e) {
            if (e.target.getName() != "mask") {
                return;
            }
            move_x = -1;
        });
        btn.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            if (e.target.getName() != "mask") {
                return;
            }
            move_x = e.touch._point.x - e.touch._prevPoint.x;
            if (Math.abs(move_x) >= 5) {
                return;
            }
        });
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_upgrade") {
                // if(GameCtr.money<GameCtr.manufactureConfig[GameCtr.ManufactureLevel].cost){return;}
                if (cc.find("Canvas").getChildByName("manufactureUpgrade")) {
                    return;
                }
                var manufactureUpgrade = cc.instantiate(_this.manufactureUpgrade);
                manufactureUpgrade.parent = cc.find("Canvas");
                manufactureUpgrade.y = -1218;
                manufactureUpgrade.runAction(cc.moveBy(0.4, cc.p(0, 1218)).easing(cc.easeElasticOut(3.0)));
                GameCtr_1.default.getInstance().getGame().setMaskVisit(true);
                GameCtr_1.default.getInstance().getGame().setManufactureUpgrade(manufactureUpgrade);
                AudioManager_1.default.getInstance().playSound("audio/btn_click");
            }
            else if (e.target.getName() == "btn_speedUp") {
                GameCtr_1.default.globalSpeedRate = 2;
                _this._speedTime = 0;
                _this.startSpeedUpTimer(GameCtr_1.default.otherConfig.speedUpPersist);
                _this._btn_upSpeed.active = false;
                AudioManager_1.default.getInstance().playMusic("audio/speeUp");
            }
            else if (e.target.getName() == "btn_boubleIncome") {
                if (!_this._btn_doubleIncome.getComponent(cc.Button).interactable) {
                    return;
                }
                _this._doubleTime = 0;
                _this._btn_doubleIncome.getComponent(cc.Button).interactable = false;
                GameCtr_1.default.incomeRate = 2;
                _this.startDoubleTimer(GameCtr_1.default.otherConfig.doublePersist);
            }
            else if (e.target.getName() == "mask") {
                if (Math.abs(move_x) >= 5) {
                    _this._speedUpTime = Date.now();
                    _this._speed = _this._speedUpTime > 0 ? GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].speed : 1;
                }
            }
        });
    };
    NewClass.prototype.upgrade = function () {
        GameCtr_1.default.money -= GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].cost;
        GameCtr_1.default.ManufactureLevel += 1;
        this.showBtn();
        GameCtr_1.default.getInstance().setManufactureLevel();
    };
    NewClass.prototype.showBtn = function () {
        if (GameCtr_1.default.money >= GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].cost) {
            this.enableBtn(true);
        }
        else {
            this.enableBtn(false);
        }
    };
    NewClass.prototype.enableBtn = function (isEffectable) {
        this._btn_upgrade.getComponent(cc.Button).interactable = isEffectable;
    };
    NewClass.prototype.startSpeedUpTimer = function (_timeCount) {
        this._timeCount = _timeCount;
        this._lb_upSpeedTime.active = true;
        this.countDown();
    };
    NewClass.prototype.startDoubleTimer = function (_timeCount) {
        this._timeCount1 = _timeCount;
        this._lb_doubleTime.active = true;
        this.countDown1();
    };
    NewClass.prototype.countDown = function () {
        if (this._timeCount < 0) {
            GameCtr_1.default.globalSpeedRate = 1;
            this._lb_upSpeedTime.active = false;
            AudioManager_1.default.getInstance().playMusic("audio/bgMusic");
            return;
        }
        var minStr = Math.floor(this._timeCount / 60) < 10 ? "0" + Math.floor(this._timeCount / 60) : "" + Math.floor(this._timeCount / 60);
        var secStr = this._timeCount % 60 < 10 ? "0" + this._timeCount % 60 : "" + this._timeCount % 60;
        this._lb_upSpeedTime.getComponent(cc.Label).string = minStr + ":" + secStr;
        this._timeCount -= 1;
        this.scheduleOnce(this.countDown.bind(this), 1);
    };
    NewClass.prototype.countDown1 = function () {
        if (this._timeCount1 < 0) {
            GameCtr_1.default.incomeRate = 1;
            this._lb_doubleTime.active = false;
            return;
        }
        var minStr = Math.floor(this._timeCount1 / 60) < 10 ? "0" + Math.floor(this._timeCount1 / 60) : "" + Math.floor(this._timeCount1 / 60);
        var secStr = this._timeCount1 % 60 < 10 ? "0" + this._timeCount1 % 60 : "" + this._timeCount1 % 60;
        this._lb_doubleTime.getComponent(cc.Label).string = minStr + ":" + secStr;
        this._timeCount1 -= 1;
        this.scheduleOnce(this.countDown1.bind(this), 1);
    };
    NewClass.prototype.update = function (dt) {
        if (!this._upLine) {
            return;
        }
        if (this._speedUpTime > 0) {
            if ((Date.now() - this._speedUpTime) / 1000 >= 1.0) {
                this._speedUpTime = -1;
                this._speed = 1;
            }
        }
        if (this._doubleTime >= 0) {
            this._doubleTime += dt;
            if (this._doubleTime >= GameCtr_1.default.otherConfig.doubleInterval) {
                this._btn_doubleIncome.getComponent(cc.Button).interactable = true;
                this._doubleTime = -1;
            }
        }
        if (this._speedTime >= 0) {
            this._speedTime += dt;
            if (this._speedTime >= GameCtr_1.default.otherConfig.speedUpInterval) {
                this._btn_upSpeed.active = true;
                this._speedTime = -1;
            }
        }
        if (!this._isWorking && GameCtr_1.default.honeyValue > 0) {
            this.unschedule(this.doWork.bind(this));
            this.scheduleOnce(this.doWork.bind(this), 1);
            this._isWorking = true;
        }
        this._upLine.x += 1080 / (GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].transferTime * 60 / (this._speed * GameCtr_1.default.globalSpeedRate));
        this._downLine.x -= 1080 / (GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].transferTime * 60 / (this._speed * GameCtr_1.default.globalSpeedRate));
        if (this._upLine.x >= 1080) {
            this._upLine.x = 0;
        }
        if (this._downLine.x <= -1080)
            this._downLine.x = 0;
        for (var i = 0; i < this._pulleyList.length; i++) {
            this._pulleyList[i].rotation += 360 / (GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].transferTime * 60 / (this._speed * GameCtr_1.default.globalSpeedRate));
        }
        for (var i = 0; i < this._jarNode.children.length; i++) {
            if (Math.abs(this._jarNode.children[i].y - 365) < 0.5) {
                this._jarNode.children[i].x += 1080 / (GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].transferTime * 60 / (this._speed * GameCtr_1.default.globalSpeedRate));
            }
        }
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "jar_black", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "jar_yellow", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "manufactureUpgrade", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "bubbleMoney", void 0);
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
        //# sourceMappingURL=manufacture.js.map
        