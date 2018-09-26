(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/view/PromptDialog.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '107f6idJYdHi6R3QKRQ4W4g', 'PromptDialog', __filename);
// Script/UI/view/PromptDialog.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 提示弹窗
 */
var BaseDialog_1 = require("./BaseDialog");
var Util_1 = require("../../Common/Util");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var PromptDialog = /** @class */ (function (_super) {
    __extends(PromptDialog, _super);
    function PromptDialog() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.promptLabel = null;
        _this._promptText = '';
        _this.singleButton = false; //是否只显示确认按钮
        return _this;
    }
    PromptDialog.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
    };
    PromptDialog.prototype.initData = function () {
        var sureText = "确定";
        var cancelText = "取消";
        if (this._data) {
            this.cancelButtonClick = this._data.cancelButtonClick;
            this.sureButtonClick = this._data.sureButtonClick;
            this.singleButton = !!this._data.singleButton;
            if (typeof (this._data["message"]) === "string") {
                this._promptText = this._data["message"];
                this.promptLabel.string = this._promptText;
            }
            sureText = this._data["rightText"] || sureText;
            cancelText = this._data["leftText"] || cancelText;
        }
        if (this._sureButton) {
            Util_1.default.setString(Util_1.default.findChildByName("Label", this._sureButton.node), sureText);
        }
        if (this._cancelButton) {
            Util_1.default.setString(Util_1.default.findChildByName("Label", this._cancelButton.node), cancelText);
        }
        if (this.singleButton) {
            if (cc.isValid(this._sureButton)) {
                this._sureButton.node.x = 0;
            }
            if (cc.isValid(this._cancelButton)) {
                this._cancelButton.node.active = false;
            }
        }
    };
    PromptDialog.prototype.onButtonClick = function (event, customData) {
        switch (customData) {
            case BaseDialog_1.default.ButtonTag.SURE:
                if (this.sureButtonClick && this.sureButtonClick()) {
                    return;
                }
                this.dismiss();
                break;
            case BaseDialog_1.default.ButtonTag.CANCEL:
                if (this.cancelButtonClick && this.cancelButtonClick()) {
                    return;
                }
                this.dismiss();
                break;
            case BaseDialog_1.default.ButtonTag.CLOSE:
                this.dismiss();
                break;
            default:
                break;
        }
    };
    __decorate([
        property(cc.Label)
    ], PromptDialog.prototype, "promptLabel", void 0);
    PromptDialog = __decorate([
        ccclass
    ], PromptDialog);
    return PromptDialog;
}(BaseDialog_1.default));
exports.default = PromptDialog;

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
        //# sourceMappingURL=PromptDialog.js.map
        