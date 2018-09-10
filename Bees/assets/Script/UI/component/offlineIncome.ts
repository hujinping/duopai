import Util from "../../Common/Util";
import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_get=null;
    _lb_bonus=null;
    _offlineIncome=0;
    onLoad(){
        this._btn_get=this.node.getChildByName("btn_get");
        this._lb_bonus=this._btn_get.getChildByName("lb_bonus");
        this._lb_bonus.getComponent(cc.Label).string="";//"￥"+Util.formatNumber(GameCtr.levelConfig[GameCtr.level-1].award);
        this.initBtn(this._btn_get);
    }


    init(offlineTime){
        
        let combsUnlock=GameCtr.getInstance().getCombsUnlock();
        let manufactures_speed=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus/
                                (GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].productTime+
                                    GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime);

        let combs_speed=0;
        for(let i=0;i<GameCtr.level;i++){
            combs_speed+=(GameCtr.combConfig[i].initialIncome+GameCtr.combConfig[i].incomeMatrix*(combsUnlock[i].level-1)*combsUnlock[i].level)/(GameCtr.combConfig[i].baseSpeed*2)
        }
        let finalSpeed =combs_speed>=manufactures_speed?manufactures_speed:combs_speed;
        this._offlineIncome =offlineTime*finalSpeed;
        this._lb_bonus.getComponent(cc.Label).string="￥"+Math.floor(this._offlineIncome);
    }

    initBtn(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_get"){
                AudioManager.getInstance().playSound("audio/btnClose");
                this.node.destroy();
                GameCtr.getInstance().getGame().setMaskVisit(false);
                GameCtr.money+=Math.floor(this._offlineIncome);
                GameCtr.rich+=Math.floor(this._offlineIncome);
                GameCtr.getInstance().getLevel().setMoney();
            }
        })
    }
}
