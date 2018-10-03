(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/bubbleMoney.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '05d679GjZhA36ojonrE6hi4', 'bubbleMoney', __filename);
// Script/UI/component/bubbleMoney.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewClass.prototype.onLoad = function () {
        this.doAction();
        this.node.active = true;
    };
    NewClass.prototype.setMoney = function (money) {
        this.node.getComponent(cc.Label).string = "+￥" + money;
    };
    NewClass.prototype.doAction = function () {
        var _this = this;
        this.node.runAction(cc.sequence(cc.moveBy(0.3, cc.p(0, 80)), cc.delayTime(0.2), cc.fadeOut(0.1), cc.delayTime(0.5), cc.fadeIn(0.0), cc.moveBy(0, cc.p(0, -80)), cc.callFunc(function () {
            _this.node.destroy();
        })));
    };
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
        //# sourceMappingURL=bubbleMoney.js.map
        