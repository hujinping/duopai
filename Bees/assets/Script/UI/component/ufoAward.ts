import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
import Util from "../../Common/Util";
import WXCtr from "../../Controller/WXCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _btn_close=null;
    _btn_get=null;
    _lb_bonus=null;
    _bonusValue=null;

    onLoad(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._btn_get=this.node.getChildByName("btn_get");
        this._lb_bonus=this.node.getChildByName("lb_bonus");
        this._btn_get.active=GameCtr.isAudited;

        this.initEvent(this._btn_close);
        this.initEvent(this._btn_get);
        this.initBonusValue();
    }

    initEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
                if(!GameCtr.isAudited){
                    GameCtr.money+=this._bonusValue;
                    GameCtr.rich+=this._bonusValue;
                }
                AudioManager.getInstance().playSound("audio/btnClose");
            }else if(e.target.getName()=="btn_get"){
                let callFunc=()=>{
                    GameCtr.money+=2*this._bonusValue;
                    GameCtr.rich+=2*this._bonusValue;
                    this.node.destroy();
                }
                if(GameCtr.vedioTimes<=0){
                    WXCtr.share({callback:callFunc});
                }else{
                    WXCtr.showVideoAd(callFunc.bind(this));
                }
                AudioManager.getInstance().playSound("audio/open_panel");
            }
        })
    }

    initBonusValue(){
        let combsUnlock=JSON.parse(GameCtr.getInstance().getCombsUnlock());
        let manufactures_speed=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus/
                                (GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].productTime+
                                    GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime);

        let combs_speed=0;
        
        for(let i=0;i<combsUnlock.length;i++){
            combs_speed+=(GameCtr.combConfig[i].initialIncome+GameCtr.combConfig[i].incomeMatrix*(combsUnlock[i].level-1)*combsUnlock[i].level)/(GameCtr.combConfig[i].baseSpeed*2)
        }
        let finalSpeed =combs_speed>=manufactures_speed?manufactures_speed:combs_speed;
        this._bonusValue=Math.floor(finalSpeed*300);
        this._lb_bonus.getComponent(cc.Label).string="$"+Util.formatNumber(Math.floor(finalSpeed*300));
    }
}
