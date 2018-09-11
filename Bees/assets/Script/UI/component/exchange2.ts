import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
import HttpCtr from "../../Controller/HttpCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_close=null;
    _btn_exchange=null;
    _lb_money=null;
    _editeBox_phoneNum=null;

    onLoad(){
        this.initNode();
    }

    initNode(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._btn_exchange=this.node.getChildByName("btn_exchange");
        this._lb_money=this.node.getChildByName("lb_surplusMoney");
        this._editeBox_phoneNum=this.node.getChildByName("phoneNumber");

        this._lb_money.getComponent(cc.Label).string="￥"+(GameCtr.realMoney/100).toFixed(2);
        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_exchange);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
                AudioManager.getInstance().playSound("audio/btnClose");
            }else if(e.target.getName()=="btn_exchange"){
                AudioManager.getInstance().playSound("audio/btn_click");
                this.requestExchange(this._editeBox_phoneNum.getComponent(cc.EditBox).string);
            }
        })
    }

    isPhoneNum(num) {
        if (!/^\d{11}$/i.test(num)) return "电话号码不合法";
    }


    requestExchange(phoneNumber){
        let err = this.isPhoneNum(phoneNumber);
        if (err) {
            GameCtr.getInstance().getGame().showToast("你的电话号码不合法");
            return;
        }

        HttpCtr.doExchange(phoneNumber);
    }


}
