(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Common/ViewManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a4f81RHNkJOZ7DAr9pb05OX', 'ViewManager', __filename);
// Script/Common/ViewManager.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 弹窗管理
 */
var PopupView_1 = require("../ui/view/PopupView");
var PromptDialog_1 = require("../ui/view/PromptDialog");
var ToastView_1 = require("../UI/view/ToastView");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ViewManager = /** @class */ (function (_super) {
    __extends(ViewManager, _super);
    function ViewManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.popupView = null; //基础弹出界面
        _this.promptDialog = null; //提示弹窗
        _this.toastView = null; //Toast提示
        _this.popupViewList = new Array(); //弹出的窗口列表
        _this.popupViewMap = {}; //弹出窗口集合
        return _this;
    }
    ViewManager_1 = ViewManager;
    ViewManager.prototype.onLoad = function () {
        ViewManager_1.mViewManager = this;
        cc.game.addPersistRootNode(this.node);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    };
    ViewManager.prototype.onDestroy = function () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    };
    //响应系统键盘事件
    ViewManager.prototype.onKeyDown = function (event) {
        if (event.keyCode == cc.KEY.back) { //响应返回键
            while (this.popupViewList.length > 0) {
                var popupView = this.popupViewList.pop();
                this.removeFromMap(popupView);
                if (cc.isValid(popupView)) {
                    popupView.dismiss();
                    break;
                }
            }
        }
    };
    //弹出界面销毁回调
    ViewManager.prototype.onPopupDestroy = function (popupView) {
        this.removeFromMap(popupView);
        this.removeFromArray(popupView);
    };
    ViewManager.prototype.show = function (popupView, parent) {
        if (parent === void 0) { parent = null; }
        if (!cc.isValid(popupView)) {
            return;
        }
        if (popupView.closeOnKeyBack) {
            this.popupViewList.push(popupView);
        }
        if (ViewManager_1.getPopupView(popupView.name) != popupView) {
            ViewManager_1.dismiss(popupView.name);
        }
        if (popupView.name) {
            this.popupViewMap[popupView.name] = popupView;
        }
        popupView.setOnDestroyCallback(this.onPopupDestroy.bind(this));
        popupView.show(parent || ViewManager_1.getRoot());
    };
    ViewManager.prototype.removeFromMap = function (popupView) {
        if (!popupView) {
            return;
        }
        if (popupView.name) {
            this.popupViewMap[popupView.name] = null;
        }
    };
    ViewManager.prototype.removeFromArray = function (popupView) {
        if (!popupView) {
            return;
        }
        var position = this.popupViewList.indexOf(popupView);
        if (position >= 0) {
            this.popupViewList.splice(position, 1);
        }
    };
    ViewManager.checkValid = function () {
        return !!ViewManager_1.mViewManager;
    };
    /**
     *
     * 显示弹出界面
     */
    ViewManager.show = function (_a) {
        var _b = _a.node, node = _b === void 0 ? null : _b, //需要显示的界面
        _c = _a.name, //需要显示的界面
        name = _c === void 0 ? null : _c, //界面名称，标识界面的唯一性
        _d = _a.parent, //界面名称，标识界面的唯一性
        parent = _d === void 0 ? null : _d, //弹出父节点
        _e = _a.localZOrder, //弹出父节点
        localZOrder = _e === void 0 ? 0 : _e, //节点局部 Z 轴顺序
        _f = _a.data, //节点局部 Z 轴顺序
        data = _f === void 0 ? {} : _f, //传入数据
        _g = _a.closeOnTouchOutside, //传入数据
        closeOnTouchOutside = _g === void 0 ? false : _g, //是否点击外面空白区域关闭界面
        _h = _a.closeOnKeyBack, //是否点击外面空白区域关闭界面
        closeOnKeyBack = _h === void 0 ? false : _h, //是否响应返回键关闭界面
        _j = _a.mask, //是否响应返回键关闭界面
        mask = _j === void 0 ? true : _j, //是否有蒙层覆盖
        _k = _a.maskOpacity, //是否有蒙层覆盖
        maskOpacity = _k === void 0 ? 200 : _k, //蒙层不透明度
        _l = _a.transitionShow, //蒙层不透明度
        transitionShow = _l === void 0 ? false : _l, //是否显示打开过渡动画
        _m = _a.transitionDismiss, //是否显示打开过渡动画
        transitionDismiss = _m === void 0 ? true : _m, //是否显示关闭过渡动画
        _o = _a.showAction, //是否显示关闭过渡动画
        showAction = _o === void 0 ? null : _o, _p = _a.showActionTarget, showActionTarget = _p === void 0 ? null : _p, _q = _a.dismissAction, dismissAction = _q === void 0 ? null : _q, _r = _a.dismissActionTarget, dismissActionTarget = _r === void 0 ? null : _r;
        if (!cc.isValid(node)) {
            return;
        }
        if (!ViewManager_1.checkValid() || !cc.isValid(ViewManager_1.mViewManager.popupView)) {
            return;
        }
        var popupView = node.getComponent(PopupView_1.default);
        if (!popupView) {
            var popupNode = cc.instantiate(ViewManager_1.mViewManager.popupView);
            popupView = popupNode.getComponent(PopupView_1.default);
            popupView.contentNode = node;
            popupView.contentNode.parent = popupView.node;
        }
        else {
            popupView.contentNode = popupView.contentNode
                || popupView.node.getChildByName("ContentNode")
                || popupView.node;
        }
        ViewManager_1.showPopup({
            popupView: popupView,
            name: name,
            parent: parent,
            localZOrder: localZOrder,
            closeOnTouchOutside: closeOnTouchOutside,
            closeOnKeyBack: closeOnKeyBack,
            mask: mask,
            maskOpacity: maskOpacity,
            transitionShow: transitionShow,
            transitionDismiss: transitionDismiss,
            showAction: showAction,
            showActionTarget: showActionTarget,
            dismissAction: dismissAction,
            dismissActionTarget: dismissActionTarget
        });
        return popupView;
    };
    ViewManager.showPopup = function (_a) {
        var _b = _a.popupView, popupView = _b === void 0 ? null : _b, _c = _a.name, name = _c === void 0 ? null : _c, //界面名称，标识界面的唯一性
        _d = _a.parent, //界面名称，标识界面的唯一性
        parent = _d === void 0 ? null : _d, //弹出父节点
        _e = _a.localZOrder, //弹出父节点
        localZOrder = _e === void 0 ? 0 : _e, //节点局部 Z 轴顺序
        _f = _a.closeOnTouchOutside, //节点局部 Z 轴顺序
        closeOnTouchOutside = _f === void 0 ? false : _f, //是否点击外面空白区域关闭界面
        _g = _a.closeOnKeyBack, //是否点击外面空白区域关闭界面
        closeOnKeyBack = _g === void 0 ? false : _g, //是否响应返回键关闭界面
        _h = _a.mask, //是否响应返回键关闭界面
        mask = _h === void 0 ? true : _h, //是否有蒙层覆盖
        _j = _a.maskOpacity, //是否有蒙层覆盖
        maskOpacity = _j === void 0 ? 200 : _j, //蒙层不透明度
        _k = _a.transitionShow, //蒙层不透明度
        transitionShow = _k === void 0 ? false : _k, //是否显示打开过渡动画
        _l = _a.transitionDismiss, //是否显示打开过渡动画
        transitionDismiss = _l === void 0 ? true : _l, //是否显示关闭过渡动画
        _m = _a.showAction, //是否显示关闭过渡动画
        showAction = _m === void 0 ? null : _m, _o = _a.showActionTarget, showActionTarget = _o === void 0 ? null : _o, _p = _a.dismissAction, dismissAction = _p === void 0 ? null : _p, _q = _a.dismissActionTarget, dismissActionTarget = _q === void 0 ? null : _q;
        if (!ViewManager_1.checkValid() || !cc.isValid(popupView)) {
            return;
        }
        //蒙层
        if (closeOnTouchOutside) {
            mask = true;
        }
        popupView.setMask(mask, maskOpacity);
        //打开动画
        showActionTarget = showActionTarget || popupView.contentNode;
        if (transitionShow && cc.isValid(showActionTarget)) {
            showAction = showAction || cc.sequence(cc.callFunc(function () { showActionTarget.scale = 0; }), cc.scaleTo(0.1, 1, 1).easing(cc.easeOut(3.0)));
        }
        popupView.setShowAction(showAction, showActionTarget);
        //关闭动画
        dismissActionTarget = dismissActionTarget || popupView.contentNode;
        if (transitionDismiss) {
            dismissAction = dismissAction || null;
        }
        popupView.setDismissAction(dismissAction, dismissActionTarget);
        popupView.closeOnTouchOutside = closeOnTouchOutside;
        popupView.closeOnKeyBack = closeOnKeyBack;
        popupView.name = name || popupView.name;
        popupView.localZOrder = localZOrder || 0;
        ViewManager_1.mViewManager.show(popupView, parent);
    };
    ViewManager.dismissPopup = function (popupView) {
        if (!popupView) {
            return;
        }
        if (cc.isValid(popupView)) {
            popupView.dismiss();
        }
        if (!ViewManager_1.checkValid()) {
            return;
        }
        ViewManager_1.mViewManager.removeFromMap(popupView);
        ViewManager_1.mViewManager.removeFromArray(popupView);
    };
    ViewManager.dismiss = function (name) {
        if (!name) {
            return;
        }
        if (!ViewManager_1.checkValid()) {
            return;
        }
        var popupView = ViewManager_1.mViewManager.popupViewMap[name];
        if (cc.isValid(popupView)) {
            popupView.dismiss();
        }
        ViewManager_1.mViewManager.popupViewMap[name] = null;
        ViewManager_1.mViewManager.removeFromMap(popupView);
        ViewManager_1.mViewManager.removeFromArray(popupView);
    };
    ViewManager.isShow = function (name) {
        if (!name) {
            return false;
        }
        if (!ViewManager_1.checkValid()) {
            return false;
        }
        return cc.isValid(ViewManager_1.mViewManager.popupViewMap[name]);
    };
    /**
     * 获取当前正在显示的弹出界面
     *
     * @param name 弹出界面名称
     */
    ViewManager.getPopupView = function (name) {
        if (!name) {
            return null;
        }
        if (!ViewManager_1.checkValid()) {
            return null;
        }
        if (cc.isValid(ViewManager_1.mViewManager.popupViewMap[name])) {
            return ViewManager_1.mViewManager.popupViewMap[name];
        }
        else if (ViewManager_1.mViewManager.popupViewMap[name]) {
            ViewManager_1.mViewManager.popupViewMap[name] = null;
        }
        return null;
    };
    ViewManager.createDialog = function (name) {
        if (!ViewManager_1.checkValid()) {
            return;
        }
        var node;
    };
    /**
     * 显示通用提示弹窗
     *
     * @param data
     */
    ViewManager.showPromptDialog = function (data) {
        if (!ViewManager_1.checkValid()) {
            return;
        }
        var prompt = cc.instantiate(ViewManager_1.mViewManager.promptDialog);
        var promptDialog = prompt.getComponent(PromptDialog_1.default);
        promptDialog.setData(data);
        ViewManager_1.show({
            node: prompt,
            name: data.name || ViewManager_1.View.PromptDialog,
            localZOrder: ViewManager_1.LocalZOrder.PromptDialog,
            mask: true,
            maskOpacity: 200,
            transitionShow: true
        });
    };
    /**
     * 浮层文字提示
     *
     * @param message 提示内容
     */
    ViewManager.toast = function (message, textColor, fontSize) {
        if (textColor === void 0) { textColor = cc.color(255, 255, 255); }
        if (fontSize === void 0) { fontSize = 0; }
        if (!ViewManager_1.checkValid()) {
            return;
        }
        var old = ViewManager_1.getPopupView(ViewManager_1.View.ToastView);
        var toast;
        var toastView;
        if (old instanceof ToastView_1.default) {
            toast = old.node;
            toastView = old;
        }
        else {
            toast = cc.instantiate(ViewManager_1.mViewManager.toastView);
            toastView = toast.getComponent(ToastView_1.default);
        }
        toastView.setMessage(message);
        toastView.setFontSize(fontSize);
        toastView.setTextColor(textColor);
        ViewManager_1.show({
            node: toast,
            name: ViewManager_1.View.ToastView,
            localZOrder: ViewManager_1.LocalZOrder.Toast,
            mask: false,
            transitionDismiss: false
        });
    };
    ViewManager.getRoot = function () {
        return cc.director.getScene().getChildByName("Canvas");
    };
    ViewManager.LocalZOrder = {
        PromptDialog: 1000,
        Loading: 1001,
        Toast: 1002
    };
    ViewManager.View = {
        PromptDialog: "PromptDialog",
        ToastView: "ToastView",
    };
    __decorate([
        property(cc.Prefab)
    ], ViewManager.prototype, "popupView", void 0);
    __decorate([
        property(cc.Prefab)
    ], ViewManager.prototype, "promptDialog", void 0);
    __decorate([
        property(cc.Prefab)
    ], ViewManager.prototype, "toastView", void 0);
    ViewManager = ViewManager_1 = __decorate([
        ccclass
    ], ViewManager);
    return ViewManager;
    var ViewManager_1;
}(cc.Component));
exports.default = ViewManager;

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
        //# sourceMappingURL=ViewManager.js.map
        