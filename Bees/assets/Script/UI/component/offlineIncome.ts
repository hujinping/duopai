import Util from "../../Common/Util";
import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";
import WXCtr from "../../Controller/WXCtr";
import HttpCtr from "../../Controller/HttpCtr";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_get=null;
    _btn_close=null;
    _lb_bonus=null;
    _offlineIncome=0;

    onLoad(){
        this._btn_get=this.node.getChildByName("btn_get");
        this._btn_close=this.node.getChildByName("btn_close")
        this._lb_bonus=this.node.getChildByName("lb_bonus");
        this._lb_bonus.getComponent(cc.Label).string=""
        this.initBtn(this._btn_get);
        this.initBtn(this._btn_close);
        //this._btn_get.active=GameCtr.isAudited;
    }


    init(offlineTime){
        let combsUnlock=JSON.parse(GameCtr.getInstance().getCombsUnlock());
        let manufactures_speed=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus/
                                (GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].productTime+
                                    GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime);
        let combs_speed=0;
        for(let i=0;i<combsUnlock.length;i++){
            combs_speed+=(GameCtr.combConfig[i].initialIncome+GameCtr.combConfig[i].incomeMatrix*(combsUnlock[i].level-1)*combsUnlock[i].level)/(GameCtr.combConfig[i].baseSpeed*2)
        }
        let finalSpeed =combs_speed>=manufactures_speed?manufactures_speed:combs_speed;
        this._offlineIncome =offlineTime*finalSpeed;
        this._lb_bonus.getComponent(cc.Label).string="$"+Util.formatNumber(Math.floor(this._offlineIncome));
    }

    initBtn(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_get"){
                HttpCtr.openClick(GameCtr.clickType.offLineShare);
                let callFunc=()=>{
                    GameCtr.getInstance().getGame().setMaskVisit(false);
                    GameCtr.money+=Math.floor(2*this._offlineIncome);
                    GameCtr.rich+=Math.floor(2*this._offlineIncome);
                    GameCtr.getInstance().getLevel().setMoney();
                    GameCtr.getInstance().getGame().playGoldEft();
                    this.node.destroy();
                }
                if(GameCtr.vedioTimes<=0){
                    if(!GameCtr.isAudited){
                        GameCtr.getInstance().getGame().showToast("今日视频已看完");
                        this.node.destroy();
                        return;
                    }
                    WXCtr.share({callback:callFunc});
                }else{
                    HttpCtr.openClick(GameCtr.clickType.offLineVedio); 
                    if(GameCtr.getInstance().getGame().getVedioCD()>0){
                        if(!GameCtr.isAudited){
                            GameCtr.getInstance().getGame().showToast("视频冷却中...");
                            return;
                        }
                        WXCtr.share({callback:callFunc});
                        return;
                    }
                    WXCtr.offCloseVideo();
                    WXCtr.showVideoAd();
                    WXCtr.onCloseVideo((res) => {
                        if (res) {
                            callFunc();
                        }else{
                            GameCtr.getInstance().getGame().showToast("视频未看完，无法领取奖励");
                        }
                    });
                }
                
            }else if(e.target.getName()=="btn_close"){
                GameCtr.getInstance().getGame().setMaskVisit(false);
                GameCtr.money+=Math.floor(this._offlineIncome);
                GameCtr.rich+=Math.floor(this._offlineIncome);
                GameCtr.getInstance().getLevel().setMoney();
                GameCtr.getInstance().getGame().playGoldEft();
                this.node.destroy();
            }
            AudioManager.getInstance().playSound("audio/btnClose");
        })
    }
}
