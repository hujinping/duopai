
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
    private btn_rank=null;
    // private headImg=null;
    private icon_Arrow=null;
    private progress=null;
    private currentTime=null;

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
        this.btn_rank=this.node.getChildByName("btn_rank");
        this.icon_Arrow=this.node.getChildByName("icon_arrow");
        this.progress=this.node.getChildByName("progress");
        // this.headImg=this.node.getChildByName("headMask").getChildByName("headImg");
        
        this.icon_Arrow.active=false;
        this.progress.getComponent(cc.ProgressBar).progress=0;
        this.lb_money.getComponent(cc.Label).string=0;
        
        this.initBtnEvent(this.btn_upgrade);
        this.initBtnEvent(this.btn_rank);
        this.setLevel();
        this.showBtnUpGrade();
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
                AudioManager.getInstance().playSound("audio/btn_click");
            }else if(e.target.getName()=="btn_rank"){

            }
        })
    }

    upgrade(){
        //GameCtr.money-=GameCtr.levelConfig[GameCtr.level-1].need;
        GameCtr.money+=GameCtr.levelConfig[GameCtr.level-1].award;
        GameCtr.levelMoney=0;
        this.setMoney();
        this.showBtnUpGrade();
        GameCtr.level+=1;
        this.setLevel();
        GameCtr.getInstance().setPlayerLevel();
        this.progress.getComponent(cc.ProgressBar).progress=0;
    }

    // loadHeadImg(imgUrl){
    //     let spr=this.headImg.getComponent(cc.Sprite);
    //     cc.loader.load({
    //         url: imgUrl,
    //         type: 'png'
    //     }, (err, texture) => {
    //         spr.spriteFrame = new cc.SpriteFrame(texture);
    //     });
    // }

    setLevel(){
        this.lb_level.getComponent(cc.Label).string="Lv"+GameCtr.level;
        this.hideArrow();
        if(GameCtr.combConfig[GameCtr.comblevel].needLevel==GameCtr.level){
            GameCtr.getInstance().getGame().unlockComb();
        }
    }

    setMoney(){
        this.lb_money.getComponent(cc.Label).string=Util.formatNumber(GameCtr.money);
        this.showBtnUpGrade();
    }

    updateLevelProgress(){
        console.log("log------------------GameCtr.levelMoney   need=:",GameCtr.levelMoney,GameCtr.levelConfig[GameCtr.level-1].need)
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
        }else{
            this.enabledBtn(false);
        }
    }

    enabledBtn(isEffectable){
        this.btn_upgrade.getComponent(cc.Button).interactable=isEffectable;
    }
    

}
