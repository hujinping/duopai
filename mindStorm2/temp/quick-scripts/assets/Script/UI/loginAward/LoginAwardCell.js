(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/loginAward/LoginAwardCell.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd753fYwlRhGTJnKujjL9l/l', 'LoginAwardCell', __filename);
// Script/UI/loginAward/LoginAwardCell.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LoginAwardCell = /** @class */ (function (_super) {
    __extends(LoginAwardCell, _super);
    function LoginAwardCell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ndSigned = null;
        _this.lbNum = null;
        _this.sprGiftIcon = null;
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    LoginAwardCell.prototype.start = function () {
    };
    LoginAwardCell.prototype.setData = function (data) {
        this.lbNum.string = data.gold_amount + "";
        this.ndSigned.active = data.isSign;
    };
    __decorate([
        property(cc.Node)
    ], LoginAwardCell.prototype, "ndSigned", void 0);
    __decorate([
        property(cc.Label)
    ], LoginAwardCell.prototype, "lbNum", void 0);
    __decorate([
        property(cc.Sprite)
    ], LoginAwardCell.prototype, "sprGiftIcon", void 0);
    LoginAwardCell = __decorate([
        ccclass
    ], LoginAwardCell);
    return LoginAwardCell;
}(cc.Component));
exports.default = LoginAwardCell;

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
        //# sourceMappingURL=LoginAwardCell.js.map
        