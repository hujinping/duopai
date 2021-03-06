
const {ccclass, property} = cc._decorator;
import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
import Util from "../../Common/Util";
@ccclass
export default class NewClass extends cc.Component {
    lb_des=null;
    _btn_close=null;
    _btn_upgrade=null;
    _lb_cost=null;

    onLoad(){
        this.initNode()
    }

    initNode(){
        this.lb_des=this.node.getChildByName("lb_des");
        this._btn_close=this.node.getChildByName("btn_close");
        this.lb_des.getComponent(cc.Label).string=GameCtr.ManufactureLevel+1;
        if(this.isMaxLevel()){
            this.lb_des.getComponent(cc.Label).string=GameCtr.ManufactureLevel; 
        }
        
        this.showHoneyProfit();
        this.showSpeed();
        this.showCapacity();
        this.showUpgrade();

        this.initBtnEvent(this._btn_close); 
        this.initBtnEvent(this._btn_upgrade);
        this.showBtn();
    }

    showHoneyProfit(){
        let honeyProfit=this.node.getChildByName("honeyProfit")
        let lb_value=honeyProfit.getChildByName("lb_value");
        let lb_add=honeyProfit.getChildByName("lb_add");
        

        lb_value.getComponent(cc.Label).string="$"+Util.formatNumber(Math.ceil(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus-0));
        lb_add.getComponent(cc.Label).string="+$"+Util.formatNumber(Math.ceil(GameCtr.manufactureConfig[GameCtr.ManufactureLevel].perBonus-GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus));
    }

    showSpeed(){
        let speed=this.node.getChildByName("speed")
        let lb_value=speed.getChildByName("lb_value");
        let lb_add=speed.getChildByName("lb_add");

        lb_value.getComponent(cc.Label).string=""+Math.ceil(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].showSpeed*100)+"%";
        lb_add.getComponent(cc.Label).string="+1%";//"+"+Math.ceil((GameCtr.manufactureConfig[GameCtr.ManufactureLevel].showSpeed-GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].showSpeed)*100)+"%";
    }

    showCapacity(){
        let capacity=this.node.getChildByName("capacity")
        let lb_value=capacity.getChildByName("lb_value");
        let lb_add=capacity.getChildByName("lb_add");

        lb_value.getComponent(cc.Label).string=Util.formatNumber(Math.ceil(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus))+""
        lb_add.getComponent(cc.Label).string="+"+Util.formatNumber(Math.ceil(GameCtr.manufactureConfig[GameCtr.ManufactureLevel].perBonus-GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus));
    }

    showUpgrade(){
        let upgrade=this.node.getChildByName("upgrade");
        this._btn_upgrade=upgrade.getChildByName("btn_upgrade");
        this._lb_cost=this._btn_upgrade.getChildByName("lb_cost");
        if(this.isMaxLevel()){return}
        this.lb_des.getComponent(cc.Label).string=GameCtr.ManufactureLevel+1;
        this._lb_cost.getComponent(cc.Label).string="$"+Util.formatNumber(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].cost);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
                GameCtr.getInstance().getGame().setMaskVisit(false);
                GameCtr.getInstance().getGame().clearManufactureUpgrade();
                AudioManager.getInstance().playSound("audio/btnClose");
            }else if(e.target.getName()=="btn_upgrade"){

                if(GameCtr.ManufactureLevel<GameCtr.maxManufactureLevel&&GameCtr.money<GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].cost){
                    GameCtr.getInstance().getGame().showGoldNotEnough();
                    return;
                }

                if(!this._btn_upgrade.getComponent(cc.Button).interactable){return;}

                GameCtr.getInstance().getManufacture().upgrade();
                AudioManager.getInstance().playSound("audio/levelup"); 
                this.showBtn();
                if(this.isMaxLevel()){return}

                this.lb_des.getComponent(cc.Label).string=GameCtr.ManufactureLevel+1;
                this.showHoneyProfit();
                this.showSpeed();
                this.showCapacity();
                this.showUpgrade();
                
            }
        })
    }

    showBtn(){
        if(GameCtr.money>=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].cost){
            this._btn_upgrade.getComponent(cc.Button).interactable=true;
        }else{
            this._btn_upgrade.getComponent(cc.Button).interactable=false;
        }
        if(GameCtr.ManufactureLevel>=GameCtr.maxManufactureLevel){
            this._btn_upgrade.getComponent(cc.Button).interactable=false;
            let lb_cost=this._btn_upgrade.getChildByName("lb_cost");
            let word_fullLevel=this._btn_upgrade.getChildByName("word_fullLevel");
            lb_cost.active=false;
            word_fullLevel.active=true;
        }
    }


    isMaxLevel(){
        return GameCtr.ManufactureLevel==GameCtr.maxManufactureLevel;
    }

    doUpdate(){
        if(this._btn_upgrade.getComponent(cc.Button).interactable){return}
        this.showBtn();
    }
}
