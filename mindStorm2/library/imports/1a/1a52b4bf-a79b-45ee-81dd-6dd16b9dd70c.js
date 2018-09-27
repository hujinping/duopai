"use strict";
cc._RF.push(module, '1a52bS/p5tF7oHdbdFrndcM', 'ToastView');
// Script/UI/view/ToastView.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Toast提示
 */
var PopupView_1 = require("./PopupView");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ToastView = /** @class */ (function (_super) {
    __extends(ToastView, _super);
    function ToastView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messageLabel = null;
        _this._showTime = 1.5; //显示时长
        return _this;
    }
    ToastView.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
    };
    ToastView.prototype.setMessage = function (message) {
        this.message = message || "提示";
        this.messageLabel.string = message;
    };
    ToastView.prototype.setFontSize = function (fontSize) {
        if (fontSize === void 0) { fontSize = 0; }
        if (fontSize > 0) {
            this.messageLabel.fontSize = fontSize;
            this.messageLabel.lineHeight = fontSize;
        }
    };
    ToastView.prototype.setTextColor = function (textColor) {
        if (textColor === void 0) { textColor = null; }
        if (textColor) {
            this.messageLabel.node.color = textColor;
        }
    };
    ToastView.prototype.show = function (parent) {
        _super.prototype.show.call(this, parent);
        this.unscheduleAllCallbacks();
        this.schedule(this.delayDismiss.bind(this), this._showTime);
    };
    ToastView.prototype.delayDismiss = function () {
        this.dismiss();
    };
    __decorate([
        property(cc.Label)
    ], ToastView.prototype, "messageLabel", void 0);
    ToastView = __decorate([
        ccclass
    ], ToastView);
    return ToastView;
}(PopupView_1.default));
exports.default = ToastView;

cc._RF.pop();