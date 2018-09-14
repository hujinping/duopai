
const {ccclass, property} = cc._decorator;
import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
import Util from "../../Common/Util";
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    levelUpgrade:cc.Prefab=null;

    private lb_level=null;
    private lb_money=null;
    private lb_time=null;
    private btn_upgrade=null;
    private icon_Arrow=null;
    private progress=null;
    private currentTime=null;
    private money_up=null;
    private curMoney=null;

    onLoad(){
        GameCtr.getInstance().setLevel(this);
        this.initNode();
        this.updateTime();
    }

    initNode(){
        this.lb_level=this.node.getChildByName("lb_level");
        this.lb_money=this.node.getChildByName("lb_money");
        this.lb_time=this.node.getChildByName("lb_time");
        this.btn_upgrade=this.node.getChildByName("btn_upgrade");
        this.icon_Arrow=this.node.getChildByName("icon_arrow");
        this.progress=this.node.getChildByName("progress");

        this.icon_Arrow.active=false;
        this.progress.getComponent(cc.ProgressBar).progress=0;
        this.lb_money.getComponent(cc.Label).string=0;

        if(GameCtr.getInstance().getMoney()){
            this.lb_money.getComponent(cc.Label).string=Util.formatNumber(GameCtr.getInstance().getMoney());
        }
        if(GameCtr.getInstance().getLevelMoney()){
            this.progress.getComponent(cc.ProgressBar).progress=GameCtr.getInstance().getLevelMoney()/GameCtr.levelConfig[GameCtr.level-1].need;
        }

        this.initBtnEvent(this.btn_upgrade);
        this.setLevel();
        this.showBtnUpGrade();
        this.initMoneyVal();
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_upgrade"){

                if(cc.find("Canvas").getChildByName("levelUpgrade")){return;}
                let levelUpgrade=cc.instantiate(this.levelUpgrade);
                levelUpgrade.parent=cc.find("Canvas");
                levelUpgrade.y=-1218;
                levelUpgrade.runAction(cc.moveBy(0.4,cc.p(0,1218)).easing(cc.easeElasticOut(3.0)));
                GameCtr.getInstance().getGame().setMaskVisit(true);
                AudioManager.getInstance().playSound("audio/open_panel");

                if(!GameCtr.getInstance().getGame().isGuideStepOver(4)){
                    GameCtr.getInstance().getGame().completeGuideStep(GameCtr.getInstance().getGame().node,4);
                }
            }
        })
    }

    upgrade(){
        GameCtr.money+=GameCtr.levelConfig[GameCtr.level-1].award;
        GameCtr.rich+=GameCtr.levelConfig[GameCtr.level-1].award;
        GameCtr.levelMoney=0;
        this.setMoney();
        this.showBtnUpGrade();
        GameCtr.level+=1;
        this.setLevel();
        GameCtr.getInstance().setPlayerLevel();
        this.progress.getComponent(cc.ProgressBar).progress=0;
        console.log("upgrade --> GameCtr.level  GameCtr.combConfig[GameCtr.comblevel].needLevel=:",GameCtr.level,GameCtr.combConfig[GameCtr.comblevel].needLevel)

    }



    setLevel(){
        this.lb_level.getComponent(cc.Label).string="Lv"+GameCtr.level;
        this.hideArrow();
        if(GameCtr.combConfig[GameCtr.comblevel].needLevel==GameCtr.level){
            GameCtr.getInstance().getGame().unlockComb();
        }
    }

    setMoney(){
        this.lb_money.target=GameCtr.money;
        if(this.lb_money.value>this.lb_money.target){
            this.lb_money.getComponent(cc.Label).string=Util.formatNumber(this.lb_money.target);
            this.lb_money.value=this.lb_money.target;
        }
        GameCtr.getInstance().getGame().noticeMoneyUpdate();
    } 

    initMoneyVal(){
        this.lb_money.getComponent(cc.Label).string=Util.formatNumber(GameCtr.money);
        this.lb_money.value=GameCtr.money;
    }

    updateMoney(){
        if(this.lb_money.target && this.lb_money.target!=this.lb_money.value){
            this.money_up=null;
            if(Math.abs(this.lb_money.target-this.lb_money.value)<10){
                this.money_up=1;
            }else if(Math.abs(this.lb_money.target-this.lb_money.value)<100){ 
                this.money_up=10;
            }else if(Math.abs(this.lb_money.target-this.lb_money.value)<1000){ 
                this.money_up=100;
            }else if(Math.abs(this.lb_money.target-this.lb_money.value)<10000){ 
                this.money_up=1000;
            }else if(Math.abs(this.lb_money.target-this.lb_money.value)<100000){ 
                this.money_up=10000;
            }else if(Math.abs(this.lb_money.target-this.lb_money.value)<1000000){ 
                this.money_up=100000;
            }else if(Math.abs(this.lb_money.target-this.lb_money.value)<10000000){ 
                this.money_up=1000000;
            }
            this.lb_money.getComponent(cc.Label).string=Util.formatNumber(this.lb_money.value+this.money_up);
            this.lb_money.value+=this.money_up;
        }
    }

    updateLevelProgress(){
        this.progress.getComponent(cc.ProgressBar).progress=GameCtr.levelMoney/GameCtr.levelConfig[GameCtr.level-1].need;
    }

    showArrowAction(){
        this.icon_Arrow.active=true;
        this.icon_Arrow.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.15,1.1),
            cc.callFunc(function(){
                this.icon_Arrow.scale=1.0;
            }.bind(this))
        )))
    }

    hideArrow(){
        this.icon_Arrow.active=false;
        this.icon_Arrow.stopAllActions();
    }

    updateTime(){
        this.currentTime = new Date(Date.now());
        if(this.currentTime.getMinutes()<10){
            this.lb_time.getComponent(cc.Label).string= this.currentTime.getHours()+":0"+this.currentTime.getMinutes();
        }else{
            this.lb_time.getComponent(cc.Label).string= this.currentTime.getHours()+":"+this.currentTime.getMinutes();
        }
        this.scheduleOnce(this.updateTime.bind(this),30)
    }

    showBtnUpGrade(){
        if(GameCtr.levelMoney>=GameCtr.levelConfig[GameCtr.level-1].need){
            this.enabledBtn(true);
            //新手引导4
            if(!cc.find("Canvas").getChildByTag(GameCtr.tipHandTag+4) &&! GameCtr.getInstance().getGame().isGuideStepOver(4)){
                GameCtr.getInstance().getGame().showGuideStep4();
            }
        }else{
            this.enabledBtn(false);
            if(!GameCtr.getInstance().getGame().isGuideStepOver(4)){
                GameCtr.getInstance().getGame().closeGuideStep(GameCtr.getInstance().getGame().node,4);
            }
        }
    }

    enabledBtn(isEffectable){
        this.btn_upgrade.getComponent(cc.Button).interactable=isEffectable;
    }


}
