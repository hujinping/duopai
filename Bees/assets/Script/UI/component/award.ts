import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.SpriteAtlas)
    atlas:cc.SpriteAtlas=null;

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
        let sp=this.atlas.getSpriteFrame("award_"+(awardData.id-1));
        this._award.getComponent(cc.Sprite).spriteFrame=sp;
        this._lb_des.getComponent(cc.Label).string=awardData.des;

        if(awardData.gold){
            this._lb_des.getComponent(cc.Label).string=awardData.des;
            let speed=this.getIncomeSpeed();
            this._lb_des.getComponent(cc.Label).string=Math.floor(speed*awardData.gold*60)+"金币";
        }
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
            GameCtr.getInstance().getGame().startSpeedUpTimer(speedup*60);
        }

        if(doubleIncome){
            GameCtr.incomeRate=2;
            GameCtr.getInstance().getManufacture().startDoubleTimer(speedup*60);
        }
    }

    getIncomeSpeed(){
        let combsUnlock=GameCtr.getInstance().getCombsUnlock();
        let manufactures_speed=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus/
                                (GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].productTime+
                                    GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime);

        let combs_speed=0;
        for(let i=0;i<GameCtr.level;i++){
            combs_speed+=(GameCtr.combConfig[i].initialIncome+GameCtr.combConfig[i].incomeMatrix*(combsUnlock[i].level-1)*combsUnlock[i].level)/(GameCtr.combConfig[i].baseSpeed*2)
        }
        let finalSpeed =combs_speed>=manufactures_speed?manufactures_speed:combs_speed;
        return finalSpeed;
    }

    

}
