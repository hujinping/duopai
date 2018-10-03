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
        _this.btn_rank = null;
        // private headImg=null;
        _this.icon_Arrow = null;
        _this.progress = null;
        _this.currentTime = null;
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
        this.btn_rank = this.node.getChildByName("btn_rank");
        this.icon_Arrow = this.node.getChildByName("icon_arrow");
        this.progress = this.node.getChildByName("progress");
        // this.headImg=this.node.getChildByName("headMask").getChildByName("headImg");
        this.icon_Arrow.active = false;
        this.progress.getComponent(cc.ProgressBar).progress = 0;
        this.lb_money.getComponent(cc.Label).string = 0;
        this.initBtnEvent(this.btn_upgrade);
        this.initBtnEvent(this.btn_rank);
        this.setLevel();
        this.showBtnUpGrade();
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_upgrade") {
                if (cc.find("Canvas").getChildByName("levelUpgrade")) {
                    return;
                }
                var levelUpgrade = cc.instantiate(_this.levelUpgrade);
                levelUpgrade.parent = cc.find("Canvas");
                levelUpgrade.y = -1218;
                levelUpgrade.runAction(cc.moveBy(0.4, cc.p(0, 1218)).easing(cc.easeElasticOut(3.0)));
                GameCtr_1.default.getInstance().getGame().setMaskVisit(true);
                AudioManager_1.default.getInstance().playSound("audio/btn_click");
            }
            else if (e.target.getName() == "btn_rank") {
            }
        });
    };
    NewClass.prototype.upgrade = function () {
        //GameCtr.money-=GameCtr.levelConfig[GameCtr.level-1].need;
        GameCtr_1.default.money += GameCtr_1.default.levelConfig[GameCtr_1.default.level - 1].award;
        GameCtr_1.default.levelMoney = 0;
        this.setMoney();
        this.showBtnUpGrade();
        GameCtr_1.default.level += 1;
        this.setLevel();
        GameCtr_1.default.getInstance().setPlayerLevel();
        this.progress.getComponent(cc.ProgressBar).progress = 0;
    };
    // loadHeadImg(imgUrl){
    //     let spr=this.headImg.getComponent(cc.Sprite);
    //     cc.loader.load({
    //         url: imgUrl,
    //         type: 'png'
    //     }, (err, texture) => {
    //         spr.spriteFrame = new cc.SpriteFrame(texture);
    //     });
    // }
    NewClass.prototype.setLevel = function () {
        this.lb_level.getComponent(cc.Label).string = "Lv" + GameCtr_1.default.level;
        this.hideArrow();
        if (GameCtr_1.default.combConfig[GameCtr_1.default.comblevel].needLevel == GameCtr_1.default.level) {
            GameCtr_1.default.getInstance().getGame().unlockComb();
        }
    };
    NewClass.prototype.setMoney = function () {
        this.lb_money.getComponent(cc.Label).string = Util_1.default.formatNumber(GameCtr_1.default.money);
        this.showBtnUpGrade();
    };
    NewClass.prototype.updateLevelProgress = function () {
        console.log("log------------------GameCtr.levelMoney   need=:", GameCtr_1.default.levelMoney, GameCtr_1.default.levelConfig[GameCtr_1.default.level - 1].need);
        this.progress.getComponent(cc.ProgressBar).progress = GameCtr_1.default.levelMoney / GameCtr_1.default.levelConfig[GameCtr_1.default.level - 1].need;
    };
    NewClass.prototype.showArrowAction = function () {
        this.icon_Arrow.active = true;
        this.icon_Arrow.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.15, 1.1), cc.callFunc(function () {
            this.icon_Arrow.scale = 1.0;
        }.bind(this)))));
    };
    NewClass.prototype.hideArrow = function () {
        this.icon_Arrow.active = false;
        this.icon_Arrow.stopAllActions();
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
        if (GameCtr_1.default.levelMoney >= GameCtr_1.default.levelConfig[GameCtr_1.default.level - 1].need) {
            this.enabledBtn(true);
        }
        else {
            this.enabledBtn(false);
        }
    };
    NewClass.prototype.enabledBtn = function (isEffectable) {
        this.btn_upgrade.getComponent(cc.Button).interactable = isEffectable;
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