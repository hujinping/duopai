"use strict";
cc._RF.push(module, '1b2cajueEZKOLiG4CVfbfeh', 'titleNode');
// Script/UI/game/titleNode.ts

Object.defineProperty(exports, "__esModule", { value: true });
var HttpCtr_1 = require("../../Controller/HttpCtr");
var GameCtr_1 = require("../../Controller/GameCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lb_time = null;
        _this.lb_des = null;
        _this.lb_gold = null;
        _this.titleOrderNode = null;
        _this.timeCount = -1;
        _this.matchingTime = 10;
        _this.answerTime = 7;
        _this.titleOrder = 0;
        _this.isBanAnswer = true;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
        this.adaptScreen();
    };
    NewClass.prototype.initNode = function () {
        var titleFrame = this.node.getChildByName("titleFrame");
        this.lb_time = titleFrame.getChildByName("lb_time");
        this.lb_des = titleFrame.getChildByName("lb_des");
        this.lb_gold = titleFrame.getChildByName("lb_gold");
        this.titleOrderNode = this.node.getChildByName("titleOrderFrame");
        this.lb_time.active = false;
        this.lb_des.active = false;
        this.lb_gold.active = false;
        this.titleOrderNode.active = false;
        this.titleOrderNode.y = titleFrame.y - 360;
    };
    NewClass.prototype.adaptScreen = function () {
        var scaleRate = GameCtr_1.default.getInstance().getAdaptScaleRate();
        console.log("log--------titleNode scaleRate=:", scaleRate);
        if (Math.abs(scaleRate - 1) <= 0.1) {
            var titleFrame = this.node.getChildByName("titleFrame");
            var widget = titleFrame.getComponent(cc.Widget);
            widget.top = 30;
        }
    };
    NewClass.prototype.startTimer = function (time) {
        this.lb_time.active = true;
        this.timeCount = time;
        this.lb_time.getComponent(cc.Label).string = time;
        this.unscheduleAllCallbacks();
        this.scheduleOnce(this.countDown.bind(this), 1);
    };
    NewClass.prototype.setGold = function (gold) {
        this.lb_gold.active = true;
        this.lb_gold.getComponent(cc.Label).string = gold;
    };
    NewClass.prototype.setDes = function (title) {
        this.lb_des.active = true;
        this.lb_des.getComponent(cc.Label).string = title;
        GameCtr_1.default.questionDes = title;
        console.log("log--------当前题目=:", GameCtr_1.default.questionDes);
    };
    NewClass.prototype.getTitle = function () {
        this.node.setLocalZOrder(40);
        this.isBanAnswer = false;
        this.lb_gold.active = true;
        GameCtr_1.default.isMatchingOver = true;
        this.titleOrder++;
        this.startTimer(this.answerTime);
        HttpCtr_1.default.getTitle(this.setDes.bind(this));
        this.showTitleOrder();
    };
    NewClass.prototype.showMatching = function () {
        var des = "匹配中...";
        this.startTimer(this.matchingTime);
        this.setDes(des);
    };
    NewClass.prototype.showTitleOrder = function () {
        var titleNode = this.node.getChildByName("titleFrame");
        this.titleOrderNode.active = true;
        this.titleOrderNode.opacity = 255;
        this.titleOrderNode.y = titleNode.y - 360;
        var lb_titleOrder = this.titleOrderNode.getChildByName("lb_titleOrder");
        lb_titleOrder.getComponent(cc.Label).string = "第" + this.titleOrder + "题";
        this.titleOrderNode.scale = 0.2;
        this.titleOrderNode.runAction(cc.sequence(cc.scaleTo(0.2, 1.0), cc.delayTime(0.5), cc.spawn(cc.moveBy(0.2, cc.p(0, 200)), cc.fadeOut(0.2))));
    };
    NewClass.prototype.countDown = function () {
        this.timeCount--;
        if (this.timeCount == -1) {
            if (GameCtr_1.default.isMatchingOver) {
                GameCtr_1.default.getInstance().emitEvent("answerFinish", null);
                this.node.active = false;
                return;
            }
        }
        if (!GameCtr_1.default.isMatchingOver && this.timeCount == 3) {
            GameCtr_1.default.getInstance().emitEvent("matchCountDown", null);
        }
        if (!GameCtr_1.default.isMatchingOver && this.timeCount == 4) {
            GameCtr_1.default.getInstance().emitEvent("showFlag", null);
        }
        if (this.timeCount == 0 && !this.isBanAnswer) {
            GameCtr_1.default.getInstance().emitEvent("banAnswer", null);
            this.isBanAnswer = true;
            this.node.setLocalZOrder(-10);
        }
        this.lb_time.getComponent(cc.Label).string = this.timeCount;
        this.scheduleOnce(this.countDown.bind(this), 1);
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();