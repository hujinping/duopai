import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
import Util from "../../Common/Util";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_getAward=null;
    _lb_des=null;
    _award=null;
    _light=null;
    _starNode=null;
    _awarData=null;

    onLoad(){
        this.initNode();
        this.initStarAction();
    }

    initNode(){
        this._btn_getAward=this.node.getChildByName("btn_get");
        this._lb_des=this.node.getChildByName("lb_des");
        this._award=this.node.getChildByName("award");
        this._light=this.node.getChildByName("light");
        this._starNode=this.node.getChildByName("starNode");
        this.initBtnEvent(this._btn_getAward);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_get"){
                AudioManager.getInstance().playSound("audio/btnClose");
                this.getAward();
                this.node.destroy();
                this.node.parent.destroy();
            }
        })
    }

    initStarAction(){
        this._starNode.children[0].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1.0,1.2),cc.scaleTo(1.5,0.4))));
        this._starNode.children[1].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1.0,0.4),cc.scaleTo(1.5,1.0))))
        this._starNode.children[2].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1.0,0.8),cc.scaleTo(1.5,1.0))))
        this._starNode.children[3].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1.0,1.1),cc.scaleTo(1.5,0.7))))
        this._starNode.children[4].runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1.0,0.3),cc.scaleTo(1.5,0.9))))
    }


    showAward(awardData){
        this._awarData=awardData;
        cc.loader.loadRes("textures/game1/award_"+(awardData.id-1), cc.SpriteFrame,  (err, spriteFrame)=> {
            this._award.getComponent(cc.Sprite).spriteFrame=spriteFrame;
            this._lb_des.getComponent(cc.Label).string=awardData.des;
            if(awardData.gold){
                this._lb_des.getComponent(cc.Label).string=awardData.des;
                let speed=this.getIncomeSpeed();
                this._lb_des.getComponent(cc.Label).string=Util.formatNumber(Math.floor(speed*awardData.gold*60))+"金币";
            }
        });
    }

    getAward(){
        let gold=this._awarData.gold;
        let realMoney=this._awarData.realMoney;
        let speedup=this._awarData.speedup;
        let doubleIncome=this._awarData.doubleIncome;

        if(gold){
            let speed=this.getIncomeSpeed();
            GameCtr.money+=Math.floor(speed*gold*60);
            GameCtr.rich+=Math.floor(speed*gold*60);
        }

        if(realMoney){

        }

        if(speedup){
            GameCtr.globalSpeedRate=2;
            GameCtr.getInstance().getManufacture().resetLineAction();
            let curSpeedUpTime=GameCtr.getInstance().getGame().getCurSpeedUpTime();
            let speedUpTime=curSpeedUpTime>0?speedup*60+curSpeedUpTime:speedup*60;
            GameCtr.getInstance().getGame().startSpeedUpTimer(speedUpTime);
            GameCtr.getInstance().getGame().stopUpSpeedAction();
        }

        if(doubleIncome){
            GameCtr.incomeRate=2;
            GameCtr.getInstance().getManufacture().startDoubleTimer(speedup*60);
            GameCtr.getInstance().getManufacture().disableDoubleIncome();
        }
    }

    getIncomeSpeed(){
        let combsUnlock=JSON.parse(GameCtr.getInstance().getCombsUnlock());
        let manufactures_speed=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus/
                                (GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].productTime+
                                    GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime);

        let combs_speed=0;
        for(let i=0;i<GameCtr.comblevel;i++){
            combs_speed+=(GameCtr.combConfig[i].initialIncome+GameCtr.combConfig[i].incomeMatrix*(combsUnlock[i].level-1)*combsUnlock[i].level)/(GameCtr.combConfig[i].baseSpeed*2)
        }
        let finalSpeed =combs_speed>=manufactures_speed?manufactures_speed:combs_speed;
        return finalSpeed;
    }
}
