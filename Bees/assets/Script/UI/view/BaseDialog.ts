/**
 * 基础弹窗
 */
import PopupView from "./PopupView";
import Util from "../../Common/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseDialog extends cc.Component {

    protected static readonly ButtonTag = {
        SURE: "button_sure",
        CANCEL: "button_cancel",
        CLOSE: "button_close"
    }

    protected _sureButton: cc.Button;
    protected _cancelButton: cc.Button;
    private _closeButton: cc.Button;
    protected _data;//传入数据

    onLoad() {
        let node = Util.findChildByName(BaseDialog.ButtonTag.SURE, this.node);
        if (node) {
            this._sureButton = node.getComponent(cc.Button);
        }
        node = Util.findChildByName(BaseDialog.ButtonTag.CANCEL, this.node);
        if (node) {
            this._cancelButton = node.getComponent(cc.Button);
        }
        node = Util.findChildByName(BaseDialog.ButtonTag.CLOSE, this.node);
        if (node) {
            this._closeButton = node.getComponent(cc.Button);
        }

        this.initButton(this._sureButton, BaseDialog.ButtonTag.SURE);
        this.initButton(this._cancelButton, BaseDialog.ButtonTag.CANCEL);
        this.initButton(this._closeButton, BaseDialog.ButtonTag.CLOSE);

        this.initData();
    }

    protected initData() {

    }

    setData(data) {
        this._data = data;
    }

    dismiss() {
        if (!this.node.parent) {
            return;
        }
        let popupView = this.node.parent.getComponent(PopupView);
        if (!!popupView) {
            popupView.dismiss();
        } else {
            this.node.destroy();
        }
    }

    protected onButtonClick(event, customData) {
        switch (customData) {
            case BaseDialog.ButtonTag.SURE:
                break;
            case BaseDialog.ButtonTag.CANCEL:
                this.dismiss();
                break;
            case BaseDialog.ButtonTag.CLOSE:
                this.dismiss();
                break;
            default:
                break;
        }
    }

    private initButton(button: cc.Button, tag: string) {
        if (!cc.isValid(button)) {
            return;
        }
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;//这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "BaseDialog";//这个是代码文件名
        clickEventHandler.handler = "onButtonClick";
        clickEventHandler.customEventData = tag;
        button.clickEvents.push(clickEventHandler);
    }

}
