import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_close=null;
    _btn_storage=null;
    _lb_value=null;
    _lb_surplusMoney=null;

    _shareGet=false;
    _shareGetMoney=0;
    onLoad(){
        this.initNode();
    }

    initNode(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._btn_storage=this.node.getChildByName("btn_storage");

        this._lb_value=this.node.getChildByName("lb_value");
        this._lb_surplusMoney=this.node.getChildByName("lb_surplusMoney");

        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_storage);
    }


    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
                AudioManager.getInstance().playSound("audio/btnClose");
            }else if(e.target.getName()=="btn_storage"){
                if(!this._shareGet){
                    AudioManager.getInstance().playSound("audio/open_panel");
                    GameCtr.getInstance().getGame().showToast("存入成功");
                    this.node.destroy();
                }else{
                    AudioManager.getInstance().playSound("audio/open_panel");
                    let callFunc=()=>{
                        GameCtr.realMoney+=this._shareGetMoney;
                        GameCtr.getInstance().getGame().setRealMoney();
                        this.node.destroy();
                    }
                    WXCtr.share({callback:callFunc});
                } 
            }
        })
    }



    setValue(value){
        this._lb_value.getComponent(cc.Label).string="￥"+value/100;
    }

    setSurplusMoney(){
        this._lb_surplusMoney.getComponent(cc.Label).string="余额:"+GameCtr.realMoney/100;
    }


    shouldShare(money){

        this._shareGet=true;
        this._shareGetMoney=money
    }

}
