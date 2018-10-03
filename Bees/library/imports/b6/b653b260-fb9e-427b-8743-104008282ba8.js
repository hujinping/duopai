"use strict";
cc._RF.push(module, 'b653bJg+55Ce4dDEEAIKCuo', 'toast');
// Script/UI/component/toast.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._lb_msg = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this._lb_msg = this.node.getChildByName("lb_msg");
    };
    NewClass.prototype.show = function (msg) {
        this._lb_msg.getComponent(cc.Label).string = msg;
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();