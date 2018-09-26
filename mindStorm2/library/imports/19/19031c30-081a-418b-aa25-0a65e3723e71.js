"use strict";
cc._RF.push(module, '19031wwCBpBi6olCmXjcj5x', 'PopupView');
// Script/UI/view/PopupView.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 基础弹出界面
 */
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var PopupView = /** @class */ (function (_super) {
    __extends(PopupView, _super);
    function PopupView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._maskNode = null; //蒙层
        _this._maskOpacity = 0; //蒙层不透明度
        _this._localZOrder = 0;
        return _this;
    }
    PopupView.prototype.onLoad = function () {
        cc.log("PopupView onLoad %s", this.name);
        this._maskNode = this.node.getChildByName("mask");
        if (this._maskNode) {
            this._maskNode.active = this._showMask;
            this._maskNode.opacity = this._maskOpacity;
            this._maskNode.on(cc.Node.EventType.TOUCH_START, this.onTouchMask, this);
            this._maskNode.on(cc.Node.EventType.TOUCH_END, this.onTouchMask, this);
        }
    };
    PopupView.prototype.onDestroy = function () {
        cc.log("PopupView onDestroy %s", this.name);
        if (this._maskNode) {
            this._maskNode.off(cc.Node.EventType.TOUCH_START, this.onTouchMask, this);
            this._maskNode.off(cc.Node.EventType.TOUCH_END, this.onTouchMask, this);
        }
        if (this.destroyCallback) {
            this.destroyCallback(this);
        }
    };
    PopupView.prototype.onTouchMask = function (event) {
        event.stopPropagation();
        if (event.type == cc.Node.EventType.TOUCH_END
            && this.closeOnTouchOutside
            && this.contentNode
            && !cc.rectContainsPoint(this.contentNode.getBoundingBoxToWorld(), event.getLocation())) {
            this.dismiss();
        }
    };
    PopupView.prototype.show = function (parent) {
        if (!cc.isValid(this) || !cc.isValid(parent)) {
            return;
        }
        this.node.parent = parent;
        this.node.setLocalZOrder(this.localZOrder || 0);
        if (cc.isValid(this._showActionTarget) && cc.isValid(this._showAction)) {
            this._showActionTarget.stopAllActions();
            this._showActionTarget.runAction(this._showAction);
        }
    };
    PopupView.prototype.dismiss = function () {
        if (!cc.isValid(this.node)) {
            return;
        }
        if (cc.isValid(this._dismissActionTarget) && cc.isValid(this._dismissAction)) {
            this._dismissActionTarget.stopAllActions();
            this._dismissActionTarget.runAction(this._dismissAction);
        }
        else {
            this.doDismiss();
        }
    };
    PopupView.prototype.doDismiss = function () {
        this.node.destroy();
    };
    PopupView.prototype.setMask = function (showMask, maskOpacity) {
        this._showMask = showMask;
        this._maskOpacity = maskOpacity;
    };
    PopupView.prototype.setShowAction = function (action, target) {
        if (cc.isValid(target) && cc.isValid(action)) {
            this._showAction = action;
            this._showActionTarget = target;
        }
    };
    PopupView.prototype.setDismissAction = function (action, target) {
        var _this = this;
        if (cc.isValid(target) && cc.isValid(action)) {
            this._dismissAction = cc.sequence(action, cc.callFunc(function () { _this.doDismiss(); }));
            this._dismissActionTarget = target;
        }
    };
    PopupView.prototype.setOnDestroyCallback = function (callback) {
        this.destroyCallback = callback;
    };
    Object.defineProperty(PopupView.prototype, "closeOnTouchOutside", {
        get: function () {
            return this._closeOnTouchOutside;
        },
        set: function (value) {
            this._closeOnTouchOutside = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PopupView.prototype, "closeOnKeyBack", {
        get: function () {
            return this._closeOnKeyBack;
        },
        set: function (value) {
            this._closeOnKeyBack = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PopupView.prototype, "localZOrder", {
        get: function () {
            return this._localZOrder;
        },
        set: function (localZOrder) {
            this._localZOrder = localZOrder;
        },
        enumerable: true,
        configurable: true
    });
    PopupView = __decorate([
        ccclass
    ], PopupView);
    return PopupView;
}(cc.Component));
exports.default = PopupView;

cc._RF.pop();