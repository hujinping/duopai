/**
 * 弹窗管理
 */
import PopupView from "../ui/view/PopupView";
import PromptDialog from "../ui/view/PromptDialog";
import BaseDialog from "../ui/view/BaseDialog";
import ToastView from "../UI/view/ToastView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ViewManager extends cc.Component {
    private static mViewManager: ViewManager;

    private static LocalZOrder = {
        PromptDialog: 1000,
        Loading: 1001,
        Toast: 1002
    }

    static readonly View = {
        PromptDialog: "PromptDialog",//提示弹窗
        ToastView: "ToastView",//Toast提示
    }

    @property(cc.Prefab)
    popupView: cc.Prefab = null;//基础弹出界面

    @property(cc.Prefab)
    promptDialog: cc.Prefab = null;//提示弹窗

    @property(cc.Prefab)
    toastView: cc.Prefab = null;//Toast提示

    private popupViewList: Array<PopupView> = new Array<PopupView>();//弹出的窗口列表
    private popupViewMap = {};//弹出窗口集合

    onLoad() {
        ViewManager.mViewManager = this;
        cc.game.addPersistRootNode(this.node);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN as any, this.onKeyDown, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN as any, this.onKeyDown, this);
    }

    //响应系统键盘事件
    private onKeyDown(event) {
        if (event.keyCode == cc.KEY.back) {//响应返回键
            while (this.popupViewList.length > 0) {
                let popupView: PopupView = this.popupViewList.pop();
                this.removeFromMap(popupView);
                if (cc.isValid(popupView)) {
                    popupView.dismiss();
                    break;
                }
            }
        }
    }

    //弹出界面销毁回调
    private onPopupDestroy(popupView: PopupView) {
        this.removeFromMap(popupView);
        this.removeFromArray(popupView);
        
    }

    private show(popupView: PopupView, parent = null as cc.Node) {
        if (!cc.isValid(popupView)) {
            return;
        }
        if (popupView.closeOnKeyBack) {
            this.popupViewList.push(popupView);
        }
        if (ViewManager.getPopupView(popupView.name) != popupView) {
            ViewManager.dismiss(popupView.name);
        }
        if (popupView.name) {
            this.popupViewMap[popupView.name] = popupView;
        }
        popupView.setOnDestroyCallback(this.onPopupDestroy.bind(this));
        popupView.show(parent || ViewManager.getRoot());
    }

    private removeFromMap(popupView: PopupView) {
        if (!popupView) {
            return;
        }
        if (popupView.name) {
            this.popupViewMap[popupView.name] = null;
        }
    }

    private removeFromArray(popupView: PopupView) {
        if (!popupView) {
            return;
        }
        let position = this.popupViewList.indexOf(popupView);
        if (position >= 0) {
            this.popupViewList.splice(position, 1);
        }
    }

    private static checkValid(): boolean {
        return !!ViewManager.mViewManager;
    }

    /**
     * 
     * 显示弹出界面
     */
    static show({
        node = null as cc.Node,//需要显示的界面
        name = null as string,//界面名称，标识界面的唯一性
        parent = null as cc.Node,//弹出父节点
        localZOrder = 0,//节点局部 Z 轴顺序
        data = {} as any,//传入数据
        closeOnTouchOutside = false,//是否点击外面空白区域关闭界面
        closeOnKeyBack = false,//是否响应返回键关闭界面
        mask = true,//是否有蒙层覆盖
        maskOpacity = 200,//蒙层不透明度
        transitionShow = false,//是否显示打开过渡动画
        transitionDismiss = true,//是否显示关闭过渡动画
        showAction = null as cc.FiniteTimeAction,
        showActionTarget = null as cc.Node,
        dismissAction = null as cc.FiniteTimeAction,
        dismissActionTarget = null as cc.Node
    }): PopupView {
        if (!cc.isValid(node)) {
            return;
        }
        if (!ViewManager.checkValid() || !cc.isValid(ViewManager.mViewManager.popupView)) {
            return;
        }
        let popupView: PopupView = node.getComponent(PopupView);
        if (!popupView) {
            let popupNode = cc.instantiate(ViewManager.mViewManager.popupView);
            popupView = popupNode.getComponent(PopupView);
            popupView.contentNode = node;
            popupView.contentNode.parent = popupView.node;
        } else {
            popupView.contentNode = popupView.contentNode
                || popupView.node.getChildByName("ContentNode")
                || popupView.node;
        }
        ViewManager.showPopup({
            popupView,
            name,
            parent,
            localZOrder,
            closeOnTouchOutside,
            closeOnKeyBack,
            mask,
            maskOpacity,
            transitionShow,
            transitionDismiss,
            showAction,
            showActionTarget,
            dismissAction,
            dismissActionTarget
        });
        return popupView;
    }

    static showPopup({
        popupView = null as PopupView,
        name = null as string,//界面名称，标识界面的唯一性
        parent = null as cc.Node,//弹出父节点
        localZOrder = 0,//节点局部 Z 轴顺序
        closeOnTouchOutside = false,//是否点击外面空白区域关闭界面
        closeOnKeyBack = false,//是否响应返回键关闭界面
        mask = true,//是否有蒙层覆盖
        maskOpacity = 200,//蒙层不透明度
        transitionShow = false,//是否显示打开过渡动画
        transitionDismiss = true,//是否显示关闭过渡动画
        showAction = null as cc.FiniteTimeAction,
        showActionTarget = null as cc.Node,
        dismissAction = null as cc.FiniteTimeAction,
        dismissActionTarget = null as cc.Node
    }) {
        if (!ViewManager.checkValid() || !cc.isValid(popupView)) {
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
            showAction = showAction || cc.sequence(
                cc.callFunc(() => { showActionTarget.scale = 0; }),
                cc.scaleTo(0.1, 1, 1).easing(cc.easeOut(3.0))
            );
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

        ViewManager.mViewManager.show(popupView, parent);
    }

    private static dismissPopup(popupView: PopupView) {
        if (!popupView) {
            return;
        }
        if (cc.isValid(popupView)) {
            popupView.dismiss();
        }
        if (!ViewManager.checkValid()) {
            return;
        }
        ViewManager.mViewManager.removeFromMap(popupView);
        ViewManager.mViewManager.removeFromArray(popupView);
    }

    static dismiss(name: string) {
        if (!name) {
            return;
        }
        if (!ViewManager.checkValid()) {
            return;
        }
        let popupView = ViewManager.mViewManager.popupViewMap[name];
        if (cc.isValid(popupView)) {
            popupView.dismiss();
        }
        ViewManager.mViewManager.popupViewMap[name] = null;
        ViewManager.mViewManager.removeFromMap(popupView);
        ViewManager.mViewManager.removeFromArray(popupView);
    }

    static isShow(name: string): boolean {
        if (!name) {
            return false;
        }
        if (!ViewManager.checkValid()) {
            return false;
        }
        return cc.isValid(ViewManager.mViewManager.popupViewMap[name]);
    }

    /**
     * 获取当前正在显示的弹出界面
     * 
     * @param name 弹出界面名称
     */
    public static getPopupView(name: string) {
        if (!name) {
            return null;
        }
        if (!ViewManager.checkValid()) {
            return null;
        }
        if (cc.isValid(ViewManager.mViewManager.popupViewMap[name])) {
            return ViewManager.mViewManager.popupViewMap[name];
        } else if (ViewManager.mViewManager.popupViewMap[name]) {
            ViewManager.mViewManager.popupViewMap[name] = null;
        }
        return null;
    }

    

    static createDialog<T extends BaseDialog>(name: string) {
        if (!ViewManager.checkValid()) {
            return;
        }
        let node;
    }

    

    /**
     * 显示通用提示弹窗
     * 
     * @param data 
     */
    static showPromptDialog(data: {
        message: string,//提示内容
        name?: string,//弹窗名字标识
        leftText?: string,//左边文字
        rightText?: string,//右边文字
        sureButtonClick?: Function,//左边按钮点击事件
        cancelButtonClick?: Function,//右边按钮点击事件
        singleButton?: boolean//是否只显示确认按钮
    }) {
        if (!ViewManager.checkValid()) {
            return;
        }
        let prompt = cc.instantiate(ViewManager.mViewManager.promptDialog);
        let promptDialog = prompt.getComponent(PromptDialog);
        promptDialog.setData(data);
        ViewManager.show({
            node: prompt,
            name: data.name || ViewManager.View.PromptDialog,
            localZOrder: ViewManager.LocalZOrder.PromptDialog,
            mask: true,
            maskOpacity: 200,
            transitionShow: true
        });
    }

    /**
     * 浮层文字提示
     * 
     * @param message 提示内容
     */
    static toast(message: string, textColor: cc.Color = cc.color(255,255,255), fontSize = 0) {
        if (!ViewManager.checkValid()) {
            return;
        }
        let old = ViewManager.getPopupView(ViewManager.View.ToastView);
        let toast;
        let toastView: ToastView;
        if (old instanceof ToastView) {
            toast = old.node;
            toastView = old;
        } else {
            toast = cc.instantiate(ViewManager.mViewManager.toastView);
            toastView = toast.getComponent(ToastView);
        }
        toastView.setMessage(message);
        toastView.setFontSize(fontSize);
        toastView.setTextColor(textColor);
        ViewManager.show({
            node: toast,
            name: ViewManager.View.ToastView,
            localZOrder: ViewManager.LocalZOrder.Toast,
            mask: false,
            transitionDismiss: false
        });
    }

    static getRoot() {
        return cc.director.getScene().getChildByName("Canvas");
    }

}
