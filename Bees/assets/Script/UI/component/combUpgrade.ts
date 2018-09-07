
const {ccclass, property} = cc._decorator;
import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
import Util from "../../Common/Util";
@ccclass
export default class NewClass extends cc.Component {
    _lb_des=null;
    _btn_close=null;
    _btn_upgrade=null;
    _lb_cost=null;
    _level=null;
    _unlockNum=null;

    onLoad(){
        this.initNode()
    }

    initNode(){
        this._lb_des=this.node.getChildByName("lb_des");
        this._btn_close=this.node.getChildByName("btn_close");
        this.initBtnEvent(this._btn_close);
    }

    init(level,unlockNum){
        this._level=level;
        this._unlockNum=unlockNum;

        this._lb_des.getComponent(cc.Label).string=this._unlockNum+1;
        this.showCells();
        this.showSpeed();
        this.showhoneyProduction();
        this.showUpgrade();
        this.updateBtnState();
        this.initBtnEvent(this._btn_upgrade);
    }

    showCells(){
        let cells=this.node.getChildByName("cells")
        let lb_value=cells.getChildByName("lb_value");
        let lb_add=cells.getChildByName("lb_add");

        lb_value.getComponent(cc.Label).string=""+this._unlockNum;
        lb_add.getComponent(cc.Label).string="+"+1;
    }

    showSpeed(){
        let speed=this.node.getChildByName("speed")
        let lb_value=speed.getChildByName("lb_value");
        let lb_add=speed.getChildByName("lb_add");

        lb_value.getComponent(cc.Label).string="100%";
        lb_add.getComponent(cc.Label).string="+"+GameCtr.combConfig[this._level-1].speedMatrix*100+"%";
    }

    showhoneyProduction(){
        let honeyPorduction=this.node.getChildByName("honeyProduction")
        let lb_value=honeyPorduction.getChildByName("lb_value");
        let lb_add=honeyPorduction.getChildByName("lb_add");

        lb_value.getComponent(cc.Label).string=""+Util.formatNumber(GameCtr.combConfig[this._level-1].initialIncome+GameCtr.combConfig[this._level-1].incomeMatrix*(this._unlockNum-1));
        lb_add.getComponent(cc.Label).string="+"+Util.formatNumber(GameCtr.combConfig[this._level-1].incomeMatrix);
    }

    showUpgrade(){
        let upgrade=this.node.getChildByName("upgrade");
        this._btn_upgrade=upgrade.getChildByName("btn_upgrade");
        this._lb_cost=this._btn_upgrade.getChildByName("lb_cost");
        this._lb_cost.getComponent(cc.Label).string="￥"+Util.formatNumber(GameCtr.combConfig[this._level-1].levelUpCost+
            GameCtr.combConfig[this._level-1].upMatrix*(this._unlockNum-1));
        
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
           
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
                GameCtr.getInstance().getGame().setMaskVisit(false);
                GameCtr.getInstance().getGame().clearCombUpGrade();
                AudioManager.getInstance().playSound("audio/btnClose");
            }else if(e.target.getName()=="btn_upgrade"){
                if(!this._btn_upgrade.getComponent(cc.Button).interactable){return}
                AudioManager.getInstance().playSound("audio/btn_click");
                let comb=GameCtr.getInstance().getGame().getComb(this._level);
                comb.getComponent("honeycomb").upgrade();
                this._unlockNum++;
                this._lb_des.getComponent(cc.Label).string=this._unlockNum+1;
                if(this._unlockNum==GameCtr.maxPerCombLevel){
                    this._btn_upgrade.getComponent(cc.Button).interactable=false;
                    this._lb_cost.getComponent(cc.Label).string="已满级"
                    return;
                }
                this.showCells();
                this.showSpeed();
                this.showhoneyProduction();
                this.showUpgrade();
                this.updateBtnState();
            }
        })
    }

    updateBtnState(){
        if(GameCtr.money<GameCtr.combConfig[this._level-1].levelUpCost+GameCtr.combConfig[this._level-1].upMatrix*this._unlockNum){
            this._btn_upgrade.getComponent(cc.Button).interactable=false;
        }else{
            this._btn_upgrade.getComponent(cc.Button).interactable=true;
        }

    }

    doUpdate(dt){
        if(this._btn_upgrade.getComponent(cc.Button).interactable || this._unlockNum>=GameCtr.maxPerCombLevel){return}
        this.updateBtnState();
    }

}
