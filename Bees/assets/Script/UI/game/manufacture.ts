const {ccclass, property} = cc._decorator;
import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
import Util from "../../Common/Util";
import WXCtr from "../../Controller/WXCtr";
import HttpCtr from "../../Controller/HttpCtr";
import UserManager from "../../Common/UserManager";
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    jar:cc.Prefab=null;

    @property(cc.Prefab)
    manufactureUpgrade:cc.Prefab=null;

    @property(cc.Prefab)
    bubbleMoney:cc.Prefab=null;

    
    @property(cc.Prefab)
    getRedPackage:cc.Prefab=null;

    _lb_honey=null;
    _lb_doubleTime=null;
    _btn_upgrade=null;
    _btn_doubleIncome=null;
    _icon_arrow=null;

    _timeCount1=-1;
    _speed=1;
    _isWorking=false;
    _mask=null;
    _speedUpTime=-1;
    _upLine=null;
    _downLine=null;
    _plug=null;
    _pulleyList=[];
    _jarNode=null;
    _doubleTime=-1;
    _isActioning=false;
    _initialRedJarTime=null;
    _workTimes=0;
    _canDouble=true;
    
    
    onLoad(){
        this.doCaculateHoneyJar();
        GameCtr.getInstance().setManufacture(this);
        this.initNode();
        if(GameCtr.honeyValue>0){
            this.doWork()
        } 
    }

    initNode(){
        this._lb_honey=this.node.getChildByName("lb_honey");
       
        this._lb_doubleTime=this.node.getChildByName("lb_doubleTime");
        this._btn_upgrade=this.node.getChildByName("btn_upgrade");
        this._icon_arrow=this._btn_upgrade.getChildByName("arrow");
       
        this._btn_doubleIncome=this.node.getChildByName("btn_boubleIncome");
        this._mask=this.node.getChildByName("mask");
        
        this._upLine=this.node.getChildByName("upline");
        this._downLine=this.node.getChildByName("downline");
        this._plug=this.node.getChildByName("plug");
        this._jarNode=this.node.getChildByName("jarNode");
        let pulleyNode=this.node.getChildByName("pulleyNode");
        for(let i=0;i<6;i++){
            let  pulley=pulleyNode.getChildByName("pulley"+i);
            this._pulleyList.push(pulley);
        }
        this._plug.setLocalZOrder(1);
        this._lb_doubleTime.active=false;
        //this._btn_doubleIncome.getComponent(cc.Button).interactable=false;

        
        this.resetLineAction();
        this.initBtnEvent(this._btn_upgrade);
        this.initBtnEvent(this._mask); 
        this.initBtnEvent(this._btn_doubleIncome);
        this.showBtn();
        this.initJars();
        this._btn_doubleIncome.active=true;
    }

    initJars(){
        for(let i=0;i<8;i++){
            GameCtr.jarPool.put(cc.instantiate(this.jar));
        }
    }

    doCaculateHoneyJar(){
        if(!GameCtr.isAudited) {return}
        this._workTimes=0;
        let key="data_"+1;
        if(UserManager.user[key]>0){
            this._initialRedJarTime=null;
        }else{
            this._initialRedJarTime=6+Math.floor(Math.random()*6);
            HttpCtr.setUserDataState(1,1);
        }

        if(GameCtr.comblevel<=25){
            if(GameCtr.comblevel%5==0){
                let key="data_"+(Math.floor(GameCtr.comblevel/5)+1);
                if(UserManager.user[key]>0){
                    this._initialRedJarTime=null;
                }else{
                    this._initialRedJarTime=6+Math.floor(Math.random()*6);
                    HttpCtr.setUserDataState((Math.floor(GameCtr.comblevel/5)+1),1);
                }
            }
        }
    }

    resetLineAction(){
        this._upLine.stopAllActions();
        this._downLine.stopAllActions();
        for(let i =0;i<this._pulleyList.length;i++){
            this._pulleyList[i].stopAllActions();
        }
        this._upLine.runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime/(this._speed*GameCtr.globalSpeedRate),cc.p(1080,0)),
            cc.callFunc((e)=>{
                this._upLine.x=0;
            })
        )))

        this._downLine.runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime/(this._speed*GameCtr.globalSpeedRate),cc.p(-1080,0)),
            cc.callFunc((e)=>{
                this._downLine.x=0;
            })
        )))

        for(let i =0;i<this._pulleyList.length;i++){
            this._pulleyList[i].runAction(cc.repeatForever(cc.rotateBy(0.3/(this._speed*GameCtr.globalSpeedRate),15)));
        }

        for(let i=0;i<this._jarNode.children.length;i++){
            if(this._jarNode.children[i].getComponent("jar").isTransfering){
                this._jarNode.children[i].stopAllActions();
                this._jarNode.children[i].runAction(cc.moveBy(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime/(this._speed*GameCtr.globalSpeedRate),cc.p(1080,0)),)
            }
        }
    }

    setHoneyValue(){
        this._lb_honey.getComponent(cc.Label).string=Util.formatNumber(Math.floor(GameCtr.honeyValue));
        //新手引导1
        if(!cc.find("Canvas").getChildByTag(GameCtr.tipHandTag+1) &&! GameCtr.getInstance().getGame().isGuideStepOver(1)){
            GameCtr.getInstance().getGame().showGuideStep1();
        }
    }

    doWork(){
        if(GameCtr.honeyValue<=0){
            this._isWorking=false;
            return;
        }
        this._isWorking=true;
        this._workTimes++;
        let jar=null;
        if(GameCtr.jarPool.size()>0){
            jar=GameCtr.jarPool.get();
        }else{
            jar=cc.instantiate(this.jar);
            GameCtr.jarPool.put(jar);
        }
        
        if(GameCtr.honeyValue>GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus){
            jar.getComponent("jar").setFull();
            GameCtr.honeyValue-=Math.ceil(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus);
            jar.getComponent("jar").honey=Math.ceil(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus);
        }else{
            jar.getComponent("jar").setNotFull();
            jar.getComponent("jar").honey=Math.ceil(GameCtr.honeyValue);
            GameCtr.honeyValue-=Math.ceil(GameCtr.honeyValue);
        }
        jar.getComponent("jar").money=0;
        if(this._workTimes==this._initialRedJarTime){
            jar.getComponent("jar").setMoney();
            GameCtr.honeyValue+=jar.getComponent("jar").honey;
            jar.getComponent("jar").money=1;
        }
       
        jar.getComponent("jar").isTransfering=false;
        this.setHoneyValue();

        this._speed=this._speedUpTime>0?GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].speed:1;
        jar.parent=this._jarNode;
        jar.x=-203;
        jar.y=545;

        this._plug.runAction(cc.sequence(
            cc.scaleTo(0.2/this._speed*GameCtr.globalSpeedRate,0.8),
            cc.scaleTo(0.1/this._speed*GameCtr.globalSpeedRate,1.0),
            cc.delayTime((GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].productTime-(0.2/this._speed*GameCtr.globalSpeedRate)-(0.1/this._speed*GameCtr.globalSpeedRate))/this._speed*GameCtr.globalSpeedRate),///(this._speed*GameCtr.globalSpeedRate)
        ))
        jar.runAction(cc.sequence(
            cc.delayTime(0.3),
            cc.moveTo(0.2,cc.p(-203,365)),
            cc.callFunc(()=>{
                jar.getComponent("jar").isTransfering=true;
                jar.runAction(cc.moveBy(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime/(this._speed*GameCtr.globalSpeedRate),cc.p(1080,0)))
            }),
        ))
        this.scheduleOnce(this.doWork.bind(this),GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].productTime/(this._speed*GameCtr.globalSpeedRate));
    }



    showBubbleMoney(money){
        let bubbleMoney=null;
        if(GameCtr.bubbleMoneyPool.size()>0){
            bubbleMoney=GameCtr.bubbleMoneyPool.get();
        }else{
            bubbleMoney=cc.instantiate(this.bubbleMoney);
            GameCtr.bubbleMoneyPool.put(bubbleMoney);
        }
        
        bubbleMoney.parent=this.node;
        bubbleMoney.active=true;
        bubbleMoney.x=450;
        bubbleMoney.y=300;
        bubbleMoney.getComponent("bubbleMoney").setMoney(money);
        AudioManager.getInstance().playSound("audio/get_money");
        bubbleMoney.runAction(cc.sequence(
            cc.moveBy(0.3,cc.p(0,80)),
            cc.delayTime(0.2),
            cc.callFunc(()=>{
                bubbleMoney.active=false;
                GameCtr.bubbleMoneyPool.put(bubbleMoney);
            })
        ))   
    }


    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_upgrade"){
                // if(GameCtr.money<GameCtr.manufactureConfig[GameCtr.ManufactureLevel].cost){return;}
                if(cc.find("Canvas").getChildByName("manufactureUpgrade")){return;}

                if(!GameCtr.getInstance().getGame().isGuideStepOver(3)){
                    GameCtr.getInstance().getGame().completeGuideStep(this.node,3);
                }
                
                let manufactureUpgrade=cc.instantiate(this.manufactureUpgrade);
                manufactureUpgrade.parent=cc.find("Canvas");
                manufactureUpgrade.setLocalZOrder(1);
                manufactureUpgrade.y=-1218;
                manufactureUpgrade.runAction(cc.moveBy(0.4,cc.p(0,1218)).easing(cc.easeElasticOut(3.0)));
                GameCtr.getInstance().getGame().setMaskVisit(true);
                GameCtr.getInstance().getGame().setManufactureUpgrade(manufactureUpgrade);
                AudioManager.getInstance().playSound("audio/open_panel");
            }else if(e.target.getName()=="btn_boubleIncome"){
                if(!this._btn_doubleIncome.getComponent(cc.Button).interactable){return;}
                if(GameCtr.incomeRate>1){
                    GameCtr.getInstance().getGame().showToast("双倍收益中...");
                    return;
                }

                let callFunc=()=>{
                    this._doubleTime=0;
                    this._btn_doubleIncome.getComponent(cc.Button).interactable=false;
                    this._btn_doubleIncome.stopAllActions();
                    GameCtr.incomeRate=2;
                    this._canDouble=false;
                    this.startDoubleTimer(GameCtr.otherConfig.doublePersist);
                }
                
                if(GameCtr.vedioTimes<=0){
                    if(!GameCtr.isAudited){
                        GameCtr.getInstance().getGame().showToast("今日视频已看完");
                        return;
                    }
                    WXCtr.share({callback:callFunc});
                }else{
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

            }else if(e.target.getName()=="mask"){
                this._speedUpTime=Date.now();
                this._speed=this._speedUpTime>0?GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].speed:1;
                this.resetLineAction();
                if(!GameCtr.getInstance().getGame().isGuideStepOver(1)){
                    GameCtr.getInstance().getGame().completeGuideStep(cc.find("Canvas"),1);
                }
            }
        })
    }

    upgrade(){
        GameCtr.money-=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].cost;
        GameCtr.ManufactureLevel+=1;
        this.showBtn();
        GameCtr.getInstance().setManufactureLevel();
        GameCtr.getInstance().getLevel().setMoney();
    }

    showBtn(){
        if(this.isMaxLevel()){
            this.enableBtn(false);
            let word_levelUp=this._btn_upgrade.getChildByName("word_levelUp");
            let word_fullFill=this._btn_upgrade.getChildByName("word_fullLevel");
            word_levelUp.active=false;
            word_fullFill.active=true;
            return;
        }
        if(GameCtr.money>=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].cost){
            this.enableBtn(true);
            //新手引导3
            if(!this.node.getChildByTag(GameCtr.tipHandTag+3) &&! GameCtr.getInstance().getGame().isGuideStepOver(3)){
                GameCtr.getInstance().getGame().showGuideStep3();
            }
        }else{
            this.enableBtn(false);
            if(!GameCtr.getInstance().getGame().isGuideStepOver(3)){
                GameCtr.getInstance().getGame().closeGuideStep(this.node,3);
            }
        }
    }

    enableBtn(isEffectable){
        this._btn_upgrade.getComponent(cc.Button).interactable=isEffectable;
        this._icon_arrow.active=isEffectable;

        if(this._icon_arrow.active && !this._isActioning){
            this._isActioning=true;
            this._btn_upgrade.runAction(cc.repeatForever(cc.sequence(
                cc.scaleTo(0.3,1.1),
                cc.scaleTo(0.3,1.0)
            )))
        }else{
            this._btn_upgrade.stopAllActions();
            this._isActioning=false;
        }
    }

    startDoubleTimer(_timeCount){
        this._timeCount1=_timeCount;
        this._lb_doubleTime.active=true;
        this.countDown1();
    }

    countDown1(){
        if(this._timeCount1<0){
            GameCtr.incomeRate=1;
            this._lb_doubleTime.active=false;
            if(this._canDouble){
                this._btn_doubleIncome.getComponent(cc.Button).interactable=true;
            }
            return;
        }
        let minStr=Math.floor(this._timeCount1/60)<10?"0"+Math.floor(this._timeCount1/60):""+Math.floor(this._timeCount1/60);
        let secStr=this._timeCount1%60<10?"0"+this._timeCount1%60:""+this._timeCount1%60;

        this._lb_doubleTime.getComponent(cc.Label).string=minStr+":"+secStr;
        this._timeCount1-=1;
        this.scheduleOnce(this.countDown1.bind(this),1);
    }

    isMaxLevel(){
        return GameCtr.ManufactureLevel==GameCtr.maxManufactureLevel;
    }

    getPackage(data){
        if(cc.find("Canvas").getChildByName("getRedPackage")){return}
        let getPackage=cc.instantiate(this.getRedPackage);
        getPackage.parent=cc.find("Canvas");
        getPackage.setLocalZOrder(1);
        getPackage.getComponent("getRedPackage").setValue(data.m);
        getPackage.getComponent("getRedPackage").setSurplusMoney();
        getPackage.getComponent("getRedPackage").shouldShare(data.m); 
    }

    disableDoubleIncome(){
        this._btn_doubleIncome.getComponent(cc.Button).interactable=false;
    }

    update(dt){
        if(!this._upLine){return}
        if(this._speedUpTime>0){
            if((Date.now()-this._speedUpTime)/1000>=2.0){
                this._speedUpTime=-1;
                this._speed=1;
                this.resetLineAction();
            }
        }
        if(this._doubleTime>=0){
            this._doubleTime+=dt;
            if(this._doubleTime>=GameCtr.otherConfig.doubleInterval){
                this._btn_doubleIncome.getComponent(cc.Button).interactable=true;
                this._canDouble=true;
                this._btn_doubleIncome.runAction(cc.repeatForever(cc.sequence(
                    cc.scaleTo(0.4,1.6),
                    cc.scaleTo(0.4,1.5)
                )))
                this._doubleTime=-1
            }
        }

        
        if(!this._isWorking&&GameCtr.honeyValue>0){
            this.unschedule(this.doWork.bind(this));
            this.scheduleOnce(this.doWork.bind(this),1);
            this._isWorking=true;
        }
    
        for(let i =0;i<this._jarNode.children.length;i++){
            if(this._jarNode.children[i].x>=570){
                GameCtr.money+=this._jarNode.children[i].getComponent("jar").honey*GameCtr.incomeRate;
                GameCtr.rich+=this._jarNode.children[i].getComponent("jar").honey*GameCtr.incomeRate;
                GameCtr.levelMoney+=this._jarNode.children[i].getComponent("jar").honey*GameCtr.incomeRate;
                GameCtr.getInstance().getLevel().setMoney();
                GameCtr.getInstance().getLevel().updateLevelProgress();
                GameCtr.getInstance().getLevel().showBtnUpGrade();
                this.showBtn()
                if(this._jarNode.children[i].getComponent("jar").money>0){
                    HttpCtr.getCash(this.getPackage.bind(this));
                }
                this.showBubbleMoney(this._jarNode.children[i].getComponent("jar").honey*GameCtr.incomeRate);
                this._jarNode.children[i].isTransfering=false;
                this._jarNode.children[i].stopAllActions();
                GameCtr.jarPool.put(this._jarNode.children[i]);
            }
        }

        if(this._upLine.x>=1080)this._upLine.x=0;
        if(this._downLine.x<=-1080)this._downLine.x=0;
    }
}
