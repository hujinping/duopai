import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";

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

        this.initEvent(this._btn_close);
        this.initEvent(this._btn_get);
        this.initBonusValue();
    }

    initEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
                GameCtr.money+=this._bonusValue;
                GameCtr.rich+=this._bonusValue;
                AudioManager.getInstance().playSound("audio/btnClose");
            }else if(e.target.getName()=="btn_get"){

                AudioManager.getInstance().playSound("audio/open_panel");
                GameCtr.money+=this._bonusValue;
                GameCtr.rich+=this._bonusValue;
                this.node.destroy();
            }

        })
    }

    initBonusValue(){
        let combsUnlock=JSON.parse(GameCtr.getInstance().getCombsUnlock());
        let manufactures_speed=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus/
                                (GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].productTime+
                                    GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime);

        let combs_speed=0;
        
        for(let i=0;i<GameCtr.level;i++){
            combs_speed+=(GameCtr.combConfig[i].initialIncome+GameCtr.combConfig[i].incomeMatrix*(combsUnlock[i].level-1)*combsUnlock[i].level)/(GameCtr.combConfig[i].baseSpeed*2)
        }
        let finalSpeed =combs_speed>=manufactures_speed?manufactures_speed:combs_speed;
        this._bonusValue=Math.floor(finalSpeed*300);
        this._lb_bonus.getComponent(cc.Label).string="￥"+Math.floor(finalSpeed*300);
    }
}
