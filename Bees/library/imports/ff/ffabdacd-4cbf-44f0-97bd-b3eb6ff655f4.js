"use strict";
cc._RF.push(module, 'ffabdrNTL9E8Je9s+tv9lX0', 'role');
// Script/UI/component/role.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var DieWay;
(function (DieWay) {
    DieWay[DieWay["CAVE"] = 0] = "CAVE";
    DieWay[DieWay["CACTI"] = 1] = "CACTI";
})(DieWay || (DieWay = {}));
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = null;
        _this.lb_name = null;
        _this.headImg = null;
        _this.headFrame = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        // this.lb_name=this.node.getChildByName("lb_name");
        // this.headFrame=this.node.getChildByName("headFrame");
        // this.headImg=this.node.getChildByName("mask").getChildByName("heading");
        // this.headFrame.active=false;
    };
    NewClass.prototype.setName = function (name) {
        this.lb_name.getComponent(cc.Label).string = name;
    };
    NewClass.prototype.setID = function (id) {
        this.id = id;
    };
    NewClass.prototype.getID = function () {
        return this.id;
    };
    NewClass.prototype.setHeadImg = function (url) {
        this.headFrame.active = true;
        var spr = this.headImg.getComponent(cc.Sprite);
        cc.loader.load({
            url: url,
            type: 'png'
        }, function (err, texture) {
            spr.spriteFrame = new cc.SpriteFrame(texture);
        });
    };
    NewClass.prototype.die = function (dieWay, die) {
        if (die === void 0) { die = true; }
        if (dieWay == DieWay.CAVE) {
            this.node.runAction(cc.sequence(cc.delayTime(0.1 * Math.floor(Math.random() * 3)), cc.scaleTo(0.2, 0), cc.callFunc(function () {
                AudioManager_1.default.getInstance().playSound("audio/scream");
                if (die) {
                    this.node.destroy();
                }
                else {
                    this.node.active = false;
                    this.node.scale = 1;
                    this.node.rotation = 0;
                }
            }.bind(this))));
        }
        else {
            this.node.runAction(cc.sequence(cc.delayTime(0.1 * Math.floor(Math.random() * 3)), cc.spawn(cc.moveBy(0.2, cc.p(Math.random() * 500 - 250, Math.random() * 200 + 800)), cc.rotateBy(0.2, Math.random() * 90 - 45), cc.scaleTo(0.2, 0.5 * Math.floor(Math.random()) + 0.3)), cc.callFunc(function () {
                AudioManager_1.default.getInstance().playSound("audio/scream");
                if (die) {
                    this.node.destroy();
                }
                else {
                    this.node.active = false;
                    this.node.scale = 1;
                    this.node.rotation = 0;
                }
            }.bind(this))));
        }
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();