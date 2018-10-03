"use strict";
cc._RF.push(module, '6103fx89L1DrJnsjs3q0z35', 'level');
// Script/UI/game/level.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var Util_1 = require("../../Common/Util");
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.levelUpgrade = null;
        _this.lb_level = null;
        _this.lb_money = null;
        _this.lb_time = null;
        _this.btn_upgrade = null;
        _this.icon_Arrow = null;
        _this.progress = null;
        _this.currentTime = null;
        _this.money_up = null;
        _this.curMoney = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        GameCtr_1.default.getInstance().setLevel(this);
        this.initNode();
        this.updateTime();
    };
    NewClass.prototype.initNode = function () {
        this.lb_level = this.node.getChildByName("lb_level");
        this.lb_money = this.node.getChildByName("lb_money");
        this.lb_time = this.node.getChildByName("lb_time");
        this.btn_upgrade = this.node.getChildByName("btn_upgrade");
        this.icon_Arrow = this.btn_upgrade.getChildByName("arrow");
        this.progress = this.node.getChildByName("progress");
        this.icon_Arrow.active = false;
        this.progress.getComponent(cc.ProgressBar).progress = 0;
        this.lb_money.getComponent(cc.Label).string = 0;
        if (GameCtr_1.default.getInstance().getMoney()) {
            this.lb_money.getComponent(cc.Label).string = Util_1.default.formatNumber(GameCtr_1.default.getInstance().getMoney());
        }
        if (GameCtr_1.default.getInstance().getLevelMoney()) {
            this.progress.getComponent(cc.ProgressBar).progress = GameCtr_1.default.getInstance().getLevelMoney() / GameCtr_1.default.levelConfig[GameCtr_1.default.level - 1].need;
        }
        this.initBtnEvent(this.btn_upgrade);
        this.setLevel();
        this.showBtnUpGrade();
        this.initMoneyVal();
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_upgrade") {
                if (!_this.btn_upgrade.getComponent(cc.Button).interactable) {
                    return;
                }
                if (cc.find("Canvas").getChildByName("levelUpgrade")) {
                    return;
                }
                if (_this.isMaxLevel()) {
                    return;
                }
                var levelUpgrade = cc.instantiate(_this.levelUpgrade);
                levelUpgrade.parent = cc.find("Canvas");
                levelUpgrade.y = -1218;
                levelUpgrade.runAction(cc.moveBy(0.4, cc.p(0, 1218)).easing(cc.easeElasticOut(3.0)));
                GameCtr_1.default.getInstance().getGame().setMaskVisit(true);
                AudioManager_1.default.getInstance().playSound("audio/open_panel");
                if (!GameCtr_1.default.getInstance().getGame().isGuideStepOver(4)) {
                    GameCtr_1.default.getInstance().getGame().completeGuideStep(GameCtr_1.default.getInstance().getGame().node, 4);
                }
            }
        });
    };
    NewClass.prototype.upgrade = function () {
        GameCtr_1.default.money += GameCtr_1.default.levelConfig[GameCtr_1.default.level - 1].award;
        GameCtr_1.default.rich += GameCtr_1.default.levelConfig[GameCtr_1.default.level - 1].award;
        GameCtr_1.default.levelMoney = 0;
        this.setMoney();
        GameCtr_1.default.level += 1;
        this.showBtnUpGrade();
        this.setLevel();
        GameCtr_1.default.getInstance().setPlayerLevel();
        this.progress.getComponent(cc.ProgressBar).progress = 0;
    };
    NewClass.prototype.setLevel = function () {
        this.lb_level.getComponent(cc.Label).string = "Lv" + GameCtr_1.default.level;
        if (GameCtr_1.default.combConfig[GameCtr_1.default.comblevel].needLevel == GameCtr_1.default.level) {
            GameCtr_1.default.getInstance().getGame().unlockComb();
        }
    };
    NewClass.prototype.setMoney = function () {
        this.lb_money.target = Math.floor(GameCtr_1.default.money);
        if (this.lb_money.value > this.lb_money.target) {
            this.lb_money.getComponent(cc.Label).string = Util_1.default.formatNumber(this.lb_money.target);
            this.lb_money.value = this.lb_money.target;
        }
        GameCtr_1.default.getInstance().getGame().noticeMoneyUpdate();
    };
    NewClass.prototype.initMoneyVal = function () {
        this.lb_money.getComponent(cc.Label).string = Util_1.default.formatNumber(GameCtr_1.default.money);
        this.lb_money.value = GameCtr_1.default.money;
    };
    NewClass.prototype.updateMoney = function () {
        if (this.lb_money.target && this.lb_money.target != this.lb_money.value) {
            this.money_up = null;
            for (var i = 1; i < 50; i++) {
                if (this.lb_money.target - this.lb_money.value < Math.pow(10, i)) {
                    this.money_up = i == 1 ? 1 : Math.pow(10, i - 1);
                    break;
                }
            }
            this.lb_money.getComponent(cc.Label).string = Util_1.default.formatNumber(this.lb_money.value + this.money_up);
            this.lb_money.value += this.money_up;
        }
    };
    NewClass.prototype.updateLevelProgress = function () {
        if (GameCtr_1.default.level >= GameCtr_1.default.maxPlayerLevel) {
            return;
        }
        this.progress.getComponent(cc.ProgressBar).progress = GameCtr_1.default.levelMoney / GameCtr_1.default.levelConfig[GameCtr_1.default.level - 1].need;
    };
    NewClass.prototype.updateTime = function () {
        this.currentTime = new Date(Date.now());
        if (this.currentTime.getMinutes() < 10) {
            this.lb_time.getComponent(cc.Label).string = this.currentTime.getHours() + ":0" + this.currentTime.getMinutes();
        }
        else {
            this.lb_time.getComponent(cc.Label).string = this.currentTime.getHours() + ":" + this.currentTime.getMinutes();
        }
        this.scheduleOnce(this.updateTime.bind(this), 30);
    };
    NewClass.prototype.showBtnUpGrade = function () {
        if (this.isMaxLevel()) {
            var word_levelUP = this.btn_upgrade.getChildByName("word_levelUp");
            var word_fullLevel = this.btn_upgrade.getChildByName("word_fullLevel");
            word_levelUP.active = false;
            word_fullLevel.active = true;
            this.enabledBtn(false);
            return;
        }
        if (GameCtr_1.default.levelMoney >= GameCtr_1.default.levelConfig[GameCtr_1.default.level - 1].need) {
            this.enabledBtn(true);
            //新手引导4
            if (!cc.find("Canvas").getChildByTag(GameCtr_1.default.tipHandTag + 4) && !GameCtr_1.default.getInstance().getGame().isGuideStepOver(4)) {
                GameCtr_1.default.getInstance().getGame().showGuideStep4();
            }
        }
        else {
            this.enabledBtn(false);
            if (!GameCtr_1.default.getInstance().getGame().isGuideStepOver(4)) {
                GameCtr_1.default.getInstance().getGame().closeGuideStep(GameCtr_1.default.getInstance().getGame().node, 4);
            }
        }
    };
    NewClass.prototype.enabledBtn = function (isEffectable) {
        this.btn_upgrade.getComponent(cc.Button).interactable = isEffectable;
        this.icon_Arrow.active = isEffectable;
        if (this.icon_Arrow.active) {
            this.btn_upgrade.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1.1), cc.scaleTo(0.3, 1.0))));
        }
        else {
            this.btn_upgrade.stopAllActions();
        }
    };
    NewClass.prototype.isMaxLevel = function () {
        return GameCtr_1.default.level == GameCtr_1.default.maxPlayerLevel;
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "levelUpgrade", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();