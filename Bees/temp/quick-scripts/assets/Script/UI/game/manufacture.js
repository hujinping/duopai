(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/game/manufacture.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '275a4HhEyhKo51/C8/9e3GH', 'manufacture', __filename);
// Script/UI/game/manufacture.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var Util_1 = require("../../Common/Util");
var WXCtr_1 = require("../../Controller/WXCtr");
var HttpCtr_1 = require("../../Controller/HttpCtr");
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.jar = null;
        _this.manufactureUpgrade = null;
        _this.bubbleMoney = null;
        _this.getRedPackage = null;
        _this._lb_honey = null;
        _this._lb_doubleTime = null;
        _this._btn_upgrade = null;
        _this._btn_doubleIncome = null;
        _this._icon_arrow = null;
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
        _this._isActioning = false;
        _this._initialRedJarTime = null;
        _this._workTimes = 0;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.doCaculateHoneyJar();
        GameCtr_1.default.getInstance().setManufacture(this);
        this.initNode();
        if (GameCtr_1.default.honeyValue > 0) {
            this.doWork();
        }
    };
    NewClass.prototype.initNode = function () {
        this._lb_honey = this.node.getChildByName("lb_honey");
        this._lb_doubleTime = this.node.getChildByName("lb_doubleTime");
        this._btn_upgrade = this.node.getChildByName("btn_upgrade");
        this._icon_arrow = this._btn_upgrade.getChildByName("arrow");
        this._btn_doubleIncome = this.node.getChildByName("btn_boubleIncome");
        this._mask = this.node.getChildByName("mask");
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
        this._lb_doubleTime.active = false;
        this._btn_doubleIncome.getComponent(cc.Button).interactable = false;
        this.resetLineAction();
        this.initBtnEvent(this._btn_upgrade);
        this.initBtnEvent(this._mask);
        this.initBtnEvent(this._btn_doubleIncome);
        this.showBtn();
        this.initJars();
        this._btn_doubleIncome.active = GameCtr_1.default.isAudited;
    };
    NewClass.prototype.initJars = function () {
        for (var i = 0; i < 8; i++) {
            GameCtr_1.default.jarPool.put(cc.instantiate(this.jar));
        }
    };
    NewClass.prototype.doCaculateHoneyJar = function () {
        if (!GameCtr_1.default.isAudited) {
            return;
        }
        if (window.localStorage.getItem("initialRedJar")) {
            this._initialRedJarTime = null;
        }
        else {
            this._initialRedJarTime = 6 + Math.floor(Math.random() * 6);
            window.localStorage.setItem("initialRedJar", "true");
        }
    };
    NewClass.prototype.resetLineAction = function () {
        var _this = this;
        this._upLine.stopAllActions();
        this._downLine.stopAllActions();
        for (var i = 0; i < this._pulleyList.length; i++) {
            this._pulleyList[i].stopAllActions();
        }
        this._upLine.runAction(cc.repeatForever(cc.sequence(cc.moveBy(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].transferTime / (this._speed * GameCtr_1.default.globalSpeedRate), cc.p(1080, 0)), cc.callFunc(function (e) {
            _this._upLine.x = 0;
        }))));
        this._downLine.runAction(cc.repeatForever(cc.sequence(cc.moveBy(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].transferTime / (this._speed * GameCtr_1.default.globalSpeedRate), cc.p(-1080, 0)), cc.callFunc(function (e) {
            _this._downLine.x = 0;
        }))));
        for (var i = 0; i < this._pulleyList.length; i++) {
            this._pulleyList[i].runAction(cc.repeatForever(cc.rotateBy(0.3 / (this._speed * GameCtr_1.default.globalSpeedRate), 15)));
        }
        for (var i = 0; i < this._jarNode.children.length; i++) {
            if (this._jarNode.children[i].getComponent("jar").isTransfering) {
                this._jarNode.children[i].stopAllActions();
                this._jarNode.children[i].runAction(cc.moveBy(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].transferTime / (this._speed * GameCtr_1.default.globalSpeedRate), cc.p(1080, 0)));
            }
        }
    };
    NewClass.prototype.setHoneyValue = function () {
        this._lb_honey.getComponent(cc.Label).string = Util_1.default.formatNumber(Math.floor(GameCtr_1.default.honeyValue));
        //新手引导1
        if (!cc.find("Canvas").getChildByTag(GameCtr_1.default.tipHandTag + 1) && !GameCtr_1.default.getInstance().getGame().isGuideStepOver(1)) {
            GameCtr_1.default.getInstance().getGame().showGuideStep1();
        }
    };
    NewClass.prototype.doWork = function () {
        var _this = this;
        if (GameCtr_1.default.honeyValue <= 0) {
            this._isWorking = false;
            return;
        }
        this._isWorking = true;
        this._workTimes++;
        var jar = null;
        if (GameCtr_1.default.jarPool.size() > 0) {
            jar = GameCtr_1.default.jarPool.get();
        }
        else {
            jar = cc.instantiate(this.jar);
            GameCtr_1.default.jarPool.put(jar);
        }
        if (GameCtr_1.default.honeyValue > GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus) {
            jar.getComponent("jar").setFull();
            GameCtr_1.default.honeyValue -= Math.ceil(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus);
            jar.getComponent("jar").honey = Math.ceil(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].perBonus);
        }
        else {
            jar.getComponent("jar").setNotFull();
            jar.getComponent("jar").honey = Math.ceil(GameCtr_1.default.honeyValue);
            GameCtr_1.default.honeyValue -= Math.ceil(GameCtr_1.default.honeyValue);
        }
        jar.getComponent("jar").money = 0;
        if (this._workTimes == this._initialRedJarTime) {
            jar.getComponent("jar").setMoney();
            GameCtr_1.default.honeyValue += jar.getComponent("jar").honey;
            jar.getComponent("jar").money = 1;
        }
        jar.getComponent("jar").isTransfering = false;
        this.setHoneyValue();
        this._speed = this._speedUpTime > 0 ? GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].speed : 1;
        jar.parent = this._jarNode;
        jar.x = -203;
        jar.y = 545;
        this._plug.runAction(cc.sequence(cc.scaleTo(0.2 / this._speed * GameCtr_1.default.globalSpeedRate, 0.8), cc.scaleTo(0.1 / this._speed * GameCtr_1.default.globalSpeedRate, 1.0), cc.delayTime((GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].productTime - (0.2 / this._speed * GameCtr_1.default.globalSpeedRate) - (0.1 / this._speed * GameCtr_1.default.globalSpeedRate)) / this._speed * GameCtr_1.default.globalSpeedRate)));
        jar.runAction(cc.sequence(cc.delayTime(0.3), cc.moveTo(0.2, cc.p(-203, 365)), cc.callFunc(function () {
            jar.getComponent("jar").isTransfering = true;
            jar.runAction(cc.moveBy(GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].transferTime / (_this._speed * GameCtr_1.default.globalSpeedRate), cc.p(1080, 0)));
        })));
        this.scheduleOnce(this.doWork.bind(this), GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].productTime / (this._speed * GameCtr_1.default.globalSpeedRate));
    };
    NewClass.prototype.showBubbleMoney = function (money) {
        var bubbleMoney = null;
        if (GameCtr_1.default.bubbleMoneyPool.size() > 0) {
            bubbleMoney = GameCtr_1.default.bubbleMoneyPool.get();
        }
        else {
            bubbleMoney = cc.instantiate(this.bubbleMoney);
            GameCtr_1.default.bubbleMoneyPool.put(bubbleMoney);
        }
        bubbleMoney.parent = this.node;
        bubbleMoney.active = true;
        bubbleMoney.x = 450;
        bubbleMoney.y = 300;
        bubbleMoney.getComponent("bubbleMoney").setMoney(money);
        AudioManager_1.default.getInstance().playSound("audio/gold");
        bubbleMoney.runAction(cc.sequence(cc.moveBy(0.3, cc.p(0, 80)), cc.delayTime(0.2), cc.callFunc(function () {
            bubbleMoney.active = false;
            GameCtr_1.default.bubbleMoneyPool.put(bubbleMoney);
        })));
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_upgrade") {
                // if(GameCtr.money<GameCtr.manufactureConfig[GameCtr.ManufactureLevel].cost){return;}
                if (cc.find("Canvas").getChildByName("manufactureUpgrade")) {
                    return;
                }
                if (!GameCtr_1.default.getInstance().getGame().isGuideStepOver(3)) {
                    GameCtr_1.default.getInstance().getGame().completeGuideStep(_this.node, 3);
                }
                var manufactureUpgrade = cc.instantiate(_this.manufactureUpgrade);
                manufactureUpgrade.parent = cc.find("Canvas");
                manufactureUpgrade.y = -1218;
                manufactureUpgrade.runAction(cc.moveBy(0.4, cc.p(0, 1218)).easing(cc.easeElasticOut(3.0)));
                GameCtr_1.default.getInstance().getGame().setMaskVisit(true);
                GameCtr_1.default.getInstance().getGame().setManufactureUpgrade(manufactureUpgrade);
                AudioManager_1.default.getInstance().playSound("audio/open_panel");
            }
            else if (e.target.getName() == "btn_boubleIncome") {
                var callFunc = function () {
                    if (GameCtr_1.default.incomeRate > 1) {
                        GameCtr_1.default.getInstance().getGame().showToast("双倍收益中...");
                        return;
                    }
                    if (!_this._btn_doubleIncome.getComponent(cc.Button).interactable) {
                        return;
                    }
                    _this._doubleTime = 0;
                    _this._btn_doubleIncome.getComponent(cc.Button).interactable = false;
                    _this._btn_doubleIncome.stopAllActions();
                    GameCtr_1.default.incomeRate = 2;
                    _this.startDoubleTimer(GameCtr_1.default.otherConfig.doublePersist);
                };
                if (GameCtr_1.default.vedioTimes <= 0) {
                    WXCtr_1.default.share({ callback: callFunc });
                }
                else {
                    WXCtr_1.default.showVideoAd(callFunc.bind(_this));
                }
            }
            else if (e.target.getName() == "mask") {
                _this._speedUpTime = Date.now();
                _this._speed = _this._speedUpTime > 0 ? GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].speed : 1;
                _this.resetLineAction();
                if (!GameCtr_1.default.getInstance().getGame().isGuideStepOver(1)) {
                    GameCtr_1.default.getInstance().getGame().completeGuideStep(cc.find("Canvas"), 1);
                }
            }
        });
    };
    NewClass.prototype.upgrade = function () {
        GameCtr_1.default.money -= GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].cost;
        GameCtr_1.default.ManufactureLevel += 1;
        this.showBtn();
        GameCtr_1.default.getInstance().setManufactureLevel();
        GameCtr_1.default.getInstance().getLevel().setMoney();
    };
    NewClass.prototype.showBtn = function () {
        if (this.isMaxLevel()) {
            this.enableBtn(false);
            var word_levelUp = this._btn_upgrade.getChildByName("word_levelUp");
            var word_fullFill = this._btn_upgrade.getChildByName("word_fullLevel");
            word_levelUp.active = false;
            word_fullFill.active = true;
            return;
        }
        if (GameCtr_1.default.money >= GameCtr_1.default.manufactureConfig[GameCtr_1.default.ManufactureLevel - 1].cost) {
            this.enableBtn(true);
            //新手引导3
            if (!this.node.getChildByTag(GameCtr_1.default.tipHandTag + 3) && !GameCtr_1.default.getInstance().getGame().isGuideStepOver(3)) {
                GameCtr_1.default.getInstance().getGame().showGuideStep3();
            }
        }
        else {
            this.enableBtn(false);
            if (!GameCtr_1.default.getInstance().getGame().isGuideStepOver(3)) {
                GameCtr_1.default.getInstance().getGame().closeGuideStep(this.node, 3);
            }
        }
    };
    NewClass.prototype.enableBtn = function (isEffectable) {
        this._btn_upgrade.getComponent(cc.Button).interactable = isEffectable;
        this._icon_arrow.active = isEffectable;
        if (this._icon_arrow.active && !this._isActioning) {
            this._isActioning = true;
            this._btn_upgrade.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1.1), cc.scaleTo(0.3, 1.0))));
        }
        else {
            this._btn_upgrade.stopAllActions();
            this._isActioning = false;
        }
    };
    NewClass.prototype.startDoubleTimer = function (_timeCount) {
        this._timeCount1 = _timeCount;
        this._lb_doubleTime.active = true;
        this.countDown1();
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
    NewClass.prototype.isMaxLevel = function () {
        return GameCtr_1.default.ManufactureLevel == GameCtr_1.default.maxManufactureLevel;
    };
    NewClass.prototype.getPackage = function (data) {
        if (this.node.getChildByName("getRedPackage")) {
            return;
        }
        var getPackage = cc.instantiate(this.getRedPackage);
        getPackage.parent = this.node;
        getPackage.getComponent("getRedPackage").setValue(data.m);
        getPackage.getComponent("getRedPackage").setSurplusMoney();
        getPackage.getComponent("getRedPackage").shouldShare(data.m);
    };
    NewClass.prototype.update = function (dt) {
        if (!this._upLine) {
            return;
        }
        if (this._speedUpTime > 0) {
            if ((Date.now() - this._speedUpTime) / 1000 >= 2.0) {
                this._speedUpTime = -1;
                this._speed = 1;
                this.resetLineAction();
            }
        }
        if (this._doubleTime >= 0) {
            this._doubleTime += dt;
            if (this._doubleTime >= GameCtr_1.default.otherConfig.doubleInterval) {
                this._btn_doubleIncome.getComponent(cc.Button).interactable = true;
                this._btn_doubleIncome.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.4, 1.6), cc.scaleTo(0.4, 1.5))));
                this._doubleTime = -1;
            }
        }
        if (!this._isWorking && GameCtr_1.default.honeyValue > 0) {
            this.unschedule(this.doWork.bind(this));
            this.scheduleOnce(this.doWork.bind(this), 1);
            this._isWorking = true;
        }
        for (var i = 0; i < this._jarNode.children.length; i++) {
            if (this._jarNode.children[i].x >= 570) {
                GameCtr_1.default.money += this._jarNode.children[i].getComponent("jar").honey * GameCtr_1.default.incomeRate;
                GameCtr_1.default.rich += this._jarNode.children[i].getComponent("jar").honey * GameCtr_1.default.incomeRate;
                GameCtr_1.default.levelMoney += this._jarNode.children[i].getComponent("jar").honey * GameCtr_1.default.incomeRate;
                GameCtr_1.default.getInstance().getLevel().setMoney();
                GameCtr_1.default.getInstance().getLevel().updateLevelProgress();
                GameCtr_1.default.getInstance().getLevel().showBtnUpGrade();
                this.showBtn();
                if (this._jarNode.children[i].getComponent("jar").money > 0) {
                    HttpCtr_1.default.getCash(this.getPackage.bind(this));
                }
                this.showBubbleMoney(this._jarNode.children[i].getComponent("jar").honey * GameCtr_1.default.incomeRate);
                this._jarNode.children[i].isTransfering = false;
                this._jarNode.children[i].stopAllActions();
                GameCtr_1.default.jarPool.put(this._jarNode.children[i]);
            }
        }
        if (this._upLine.x >= 1080)
            this._upLine.x = 0;
        if (this._downLine.x <= -1080)
            this._downLine.x = 0;
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "jar", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "manufactureUpgrade", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "bubbleMoney", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "getRedPackage", void 0);
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
        