"use strict";
cc._RF.push(module, '05d679GjZhA36ojonrE6hi4', 'bubbleMoney');
// Script/UI/component/bubbleMoney.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../../Common/Util");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewClass.prototype.onLoad = function () {
        this.node.active = true;
    };
    NewClass.prototype.setMoney = function (money) {
        this.node.getComponent(cc.Label).string = "+$" + Util_1.default.formatNumber(money);
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();