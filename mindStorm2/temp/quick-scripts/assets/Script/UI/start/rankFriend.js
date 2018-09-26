(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/start/rankFriend.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ef9639gUA1NsYZTVH9gKL58', 'rankFriend', __filename);
// Script/UI/start/rankFriend.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../../Common/Util");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.imagenode = null;
        _this.lb_chickenCount = null;
        return _this;
        // update (dt) {}
    }
    NewClass.prototype.setChickenCount = function (chickenCount) {
        this.lb_chickenCount.string = chickenCount;
    };
    NewClass.prototype.setHeadImg = function (url) {
        var sp = this.imagenode.getComponent(cc.Sprite);
        Util_1.default.loadImg(sp, url);
    };
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "imagenode", void 0);
    __decorate([
        property(cc.Label)
    ], NewClass.prototype, "lb_chickenCount", void 0);
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
        //# sourceMappingURL=rankFriend.js.map
        