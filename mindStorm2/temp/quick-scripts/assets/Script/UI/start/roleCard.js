(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/start/roleCard.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '493f1r8I5NJkKr5rX9swiDU', 'roleCard', __filename);
// Script/UI/start/roleCard.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.icon_role = null;
        _this.icon_unlock = null;
        _this.lb_order = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this.icon_role = this.node.getChildByName("icon_role");
        this.icon_unlock = this.node.getChildByName("icon_unlock");
        this.lb_order = this.node.getChildByName("lb_order");
        this.icon_unlock.active = false;
    };
    NewClass.prototype.setIsUnlock = function (isUnlock) {
        this.icon_unlock.active = isUnlock;
    };
    NewClass.prototype.setOrder = function (order) {
        this.lb_order.getComponent(cc.Label).string = order;
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
        //# sourceMappingURL=roleCard.js.map
        