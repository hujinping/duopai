"use strict";
cc._RF.push(module, 'c0ef1c0uxNHpYalCG2KuUPj', 'eft_honey');
// Script/UI/component/eft_honey.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._aniNode = null;
        _this._ani = null;
        _this._gold = null;
        _this._honey = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this._aniNode = this.node.getChildByName("eft");
        this._gold = this.node.getChildByName("gold");
        this._honey = this.node.getChildByName("honey");
        this._aniNode.active = false;
        this._gold.active = false;
        this._honey.active = false;
        this._gold.scale = 0.5;
        this._ani = this._aniNode.getComponent(cc.Animation);
        this._ani.on("finished", this.onFinish.bind(this));
    };
    NewClass.prototype.play = function () {
        //this._honey.active=true;
        this.bubbleGold();
        this._aniNode.active = true;
        this._ani.play();
    };
    NewClass.prototype.onFinish = function () {
        this._aniNode.active = false;
    };
    NewClass.prototype.bubbleGold = function () {
        this._gold.active = true;
        this._gold.runAction(cc.sequence(cc.moveBy(0.7, cc.p(0, 70)), cc.delayTime(0.3), cc.callFunc(function () {
            this._gold.active = false;
            this._gold.y -= 70;
        }.bind(this))));
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();