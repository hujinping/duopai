import AudioManager from "../../Common/AudioManager";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_close=null;
    _btn_storage=null;
    _lb_value=null;
    _lb_surplusMoney=null;

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

                AudioManager.getInstance().playSound("audio/btn_click");
            }
        })
    }

    setValue(value){
        this._lb_value.getComponent(cc.Label).string=value;
    }

    setSurplusMoney(surplusMoney){
        this._lb_surplusMoney.getComponent(cc.Label).string=surplusMoney;
    }

}
