import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    _btn_close=null;
    _btn_exchange=null;
    _btn_exchangeRecord=null;
    _lb_money=null;

    @property(cc.Prefab)
    exchange2:cc.Prefab=null;

    @property(cc.Prefab)
    exchangeRecord:cc.Prefab=null;

    onLoad(){
        this.initNode();
    }

    initNode(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._btn_exchange=this.node.getChildByName("btn_exchange");
        this._btn_exchangeRecord=this.node.getChildByName("btn_exchangeRecord");
        this._lb_money=this.node.getChildByName("lb_surplusMoney");

        this._lb_money.getComponent(cc.Label).string= "￥"+(GameCtr.realMoney/100).toFixed(2);

        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_exchange);
        this.initBtnEvent(this._btn_exchangeRecord);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
                AudioManager.getInstance().playSound("audio/btnClose");
            }else if(e.target.getName()=="btn_exchange"){
                AudioManager.getInstance().playSound("audio/btn_click");
                if(GameCtr.realMoney<100){
                    GameCtr.getInstance().getGame().showToast("金额不足10元,无法兑换");
                    return;
                }
                if(this.node.getChildByName("exchange2")){return}
                let exchange2=cc.instantiate(this.exchange2);
                exchange2.parent=this.node;
            }else if(e.target.getName()=="btn_exchangeRecord"){
                AudioManager.getInstance().playSound("audio/btn_click");
                if(this.node.getChildByName("exchangeRecord")){return}
                let exchangeRecord=cc.instantiate(this.exchangeRecord);
                exchangeRecord.parent=this.node;
            }
        })
    }




}
