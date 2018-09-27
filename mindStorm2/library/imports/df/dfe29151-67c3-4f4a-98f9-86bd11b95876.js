"use strict";
cc._RF.push(module, 'dfe29FRZ8NPSpj5hr0RuVh2', 'BaseDialog');
// Script/UI/view/BaseDialog.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 基础弹窗
 */
var PopupView_1 = require("./PopupView");
var Util_1 = require("../../Common/Util");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var BaseDialog = /** @class */ (function (_super) {
    __extends(BaseDialog, _super);
    function BaseDialog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseDialog_1 = BaseDialog;
    BaseDialog.prototype.onLoad = function () {
        var node = Util_1.default.findChildByName(BaseDialog_1.ButtonTag.SURE, this.node);
        if (node) {
            this._sureButton = node.getComponent(cc.Button);
        }
        node = Util_1.default.findChildByName(BaseDialog_1.ButtonTag.CANCEL, this.node);
        if (node) {
            this._cancelButton = node.getComponent(cc.Button);
        }
        node = Util_1.default.findChildByName(BaseDialog_1.ButtonTag.CLOSE, this.node);
        if (node) {
            this._closeButton = node.getComponent(cc.Button);
        }
        this.initButton(this._sureButton, BaseDialog_1.ButtonTag.SURE);
        this.initButton(this._cancelButton, BaseDialog_1.ButtonTag.CANCEL);
        this.initButton(this._closeButton, BaseDialog_1.ButtonTag.CLOSE);
        this.initData();
    };
    BaseDialog.prototype.initData = function () {
    };
    BaseDialog.prototype.setData = function (data) {
        this._data = data;
    };
    BaseDialog.prototype.dismiss = function () {
        if (!this.node.parent) {
            return;
        }
        var popupView = this.node.parent.getComponent(PopupView_1.default);
        if (!!popupView) {
            popupView.dismiss();
        }
        else {
            this.node.destroy();
        }
    };
    BaseDialog.prototype.onButtonClick = function (event, customData) {
        switch (customData) {
            case BaseDialog_1.ButtonTag.SURE:
                break;
            case BaseDialog_1.ButtonTag.CANCEL:
                this.dismiss();
                break;
            case BaseDialog_1.ButtonTag.CLOSE:
                this.dismiss();
                break;
            default:
                break;
        }
    };
    BaseDialog.prototype.initButton = function (button, tag) {
        if (!cc.isValid(button)) {
            return;
        }
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "BaseDialog"; //这个是代码文件名
        clickEventHandler.handler = "onButtonClick";
        clickEventHandler.customEventData = tag;
        button.clickEvents.push(clickEventHandler);
    };
    BaseDialog.ButtonTag = {
        SURE: "button_sure",
        CANCEL: "button_cancel",
        CLOSE: "button_close"
    };
    BaseDialog = BaseDialog_1 = __decorate([
        ccclass
    ], BaseDialog);
    return BaseDialog;
    var BaseDialog_1;
}(cc.Component));
exports.default = BaseDialog;

cc._RF.pop();