"use strict";
cc._RF.push(module, 'ff555ZYN1NPWrvhCF+qeJOK', 'selfInfo');
// Script/UI/start/selfInfo.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lb_name = null;
        _this.lb_chickenCount = null;
        _this.lb_gameCount = null;
        _this.lb_id = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this.lb_name = this.node.getChildByName("lb_name");
        this.lb_chickenCount = this.node.getChildByName("lb_chickenCount");
        this.lb_gameCount = this.node.getChildByName("lb_gameCount");
        this.lb_id = this.node.getChildByName("lb_id");
        var mask = this.node.getChildByName("mask");
        mask.on(cc.Node.EventType.TOUCH_END, function (e) {
            AudioManager_1.default.getInstance().playSound("audio/btnCick");
            this.node.runAction(cc.sequence(cc.scaleTo(0.1, 0.2), cc.callFunc(function () {
                this.node.destroy();
            }.bind(this))));
        }.bind(this));
    };
    NewClass.prototype.setName = function (name) {
        this.lb_name.getComponent(cc.Label).string = name;
    };
    NewClass.prototype.setChickenCount = function (chickenCount) {
        this.lb_chickenCount.getComponent(cc.Label).string = chickenCount;
    };
    NewClass.prototype.setGameCount = function (gameCount) {
        this.lb_gameCount.getComponent(cc.Label).string = gameCount;
    };
    NewClass.prototype.setID = function (id) {
        this.lb_id.getComponent(cc.Label).string = id;
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();