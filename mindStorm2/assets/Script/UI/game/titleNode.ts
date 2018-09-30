import HttpCtr from "../../Controller/HttpCtr";
import { UILoader } from "../../Common/UILoader";
import UserManager from "../../Common/UserManager";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    private lb_time=null;
    private lb_des=null;
    private lb_gold=null;
    private titleOrderNode=null;
   

    private timeCount=-1;
    private matchingTime=10;
    private answerTime=7;
    private titleOrder=0;
    private isBanAnswer=true;
    


    onLoad(){
        this.initNode();
        this.adaptScreen();
    }

    initNode(){
        let titleFrame=this.node.getChildByName("titleFrame");
        this.lb_time=titleFrame.getChildByName("lb_time");
        this.lb_des=titleFrame.getChildByName("lb_des");
        this.lb_gold=titleFrame.getChildByName("lb_gold");
        this.titleOrderNode=this.node.getChildByName("titleOrderFrame");
        
        this.lb_time.active=false;
        this.lb_des.active=false;
        this.lb_gold.active=false;
        this.titleOrderNode.active=false;
        this.titleOrderNode.y=titleFrame.y-360;
    }

    adaptScreen(){
        let scaleRate=GameCtr.getInstance().getAdaptScaleRate();
        console.log("log--------titleNode scaleRate=:",scaleRate);
        if(Math.abs(scaleRate-1)<=0.1){
            let titleFrame=this.node.getChildByName("titleFrame");
            let widget=titleFrame.getComponent(cc.Widget);
            widget.top=30;
        }
    }


    startTimer(time:number){
        this.lb_time.active=true;
        this.timeCount=time;
        this.lb_time.getComponent(cc.Label).string=time;
        this.unscheduleAllCallbacks();
        this.scheduleOnce(this.countDown.bind(this),1);
    }

    setGold(gold:number){
        this.lb_gold.active=true;
        this.lb_gold.getComponent(cc.Label).string=gold;
    }

    setDes(title){
        this.lb_des.active=true;
        this.lb_des.getComponent(cc.Label).string=title;
        GameCtr.questionDes=title;
        console.log("log--------当前题目=:",GameCtr.questionDes);
    }

    getTitle(){
        this.node.setLocalZOrder(40);
        this.isBanAnswer=false;
        this.lb_gold.active=true;
        GameCtr.isMatchingOver=true;
        this.titleOrder++;
        this.startTimer(this.answerTime);
        HttpCtr.getTitle(this.setDes.bind(this));
        this.showTitleOrder();
    }

    

    showMatching(){
        let des="匹配中..."
        this.startTimer(this.matchingTime);
        this.setDes(des);
    }

    showTitleOrder(){
        let titleNode=this.node.getChildByName("titleFrame")
        this.titleOrderNode.active=true;
        this.titleOrderNode.opacity=255;
        this.titleOrderNode.y=titleNode.y-360;
        let lb_titleOrder=this.titleOrderNode.getChildByName("lb_titleOrder");
        lb_titleOrder.getComponent(cc.Label).string="第"+this.titleOrder+"题";
        this.titleOrderNode.scale=0.2;
        this.titleOrderNode.runAction(cc.sequence(
            cc.scaleTo(0.2,1.0),
            cc.delayTime(0.5),
            cc.spawn(
                cc.moveBy(0.2,cc.p(0,200)),
                cc.fadeOut(0.2)
            )
        ));
    }


    countDown(){
        this.timeCount--;
        if(this.timeCount == -1){
            if(GameCtr.isMatchingOver){
                GameCtr.getInstance().emitEvent("answerFinish",null);
                this.node.active=false;
                return;
            }
        }

        if(!GameCtr.isMatchingOver&& this.timeCount==3){
            GameCtr.getInstance().emitEvent("matchCountDown",null);
        }

        if(!GameCtr.isMatchingOver&& this.timeCount==4){
            GameCtr.getInstance().emitEvent("showFlag",null);
        }

        if(this.timeCount==0 && !this.isBanAnswer){
            GameCtr.getInstance().emitEvent("banAnswer",null);
            this.isBanAnswer=true;
            this.node.setLocalZOrder(-10);
        }
        this.lb_time.getComponent(cc.Label).string=this.timeCount;
        this.scheduleOnce(this.countDown.bind(this),1);
    }

}