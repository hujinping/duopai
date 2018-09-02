/**
 * 提示弹窗
 */
import BaseDialog from "./BaseDialog";
import Util from "../../Common/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PromptDialog extends BaseDialog {

    @property(cc.Label)
    promptLabel: cc.Label = null;

    private _promptText: string = '';

    private cancelButtonClick: Function;//左边按钮点击事件（取消按钮）
    private sureButtonClick: Function;//右边按钮点击事件（确认按钮）
    private singleButton = false;//是否只显示确认按钮

    onLoad() {
        super.onLoad();
    }

    protected initData() {
        let sureText = "确定";
        let cancelText = "取消";
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
            Util.setString(Util.findChildByName("Label", this._sureButton.node), sureText);
        }
        if (this._cancelButton) {
            Util.setString(Util.findChildByName("Label", this._cancelButton.node), cancelText);
        }
        if (this.singleButton) {
            if (cc.isValid(this._sureButton)) {
                this._sureButton.node.x = 0;
            }
            if (cc.isValid(this._cancelButton)) {
                this._cancelButton.node.active = false;
            }
        }
    }

    protected onButtonClick(event, customData) {
        switch (customData) {
            case BaseDialog.ButtonTag.SURE:
                if (this.sureButtonClick && this.sureButtonClick()) {
                    return;
                }
                this.dismiss();
                break;
            case BaseDialog.ButtonTag.CANCEL:
                if (this.cancelButtonClick && this.cancelButtonClick()) {
                    return;
                }
                this.dismiss();
                break;
            case BaseDialog.ButtonTag.CLOSE:
                this.dismiss();
                break;
            default:
                break;
        }
    }
}
