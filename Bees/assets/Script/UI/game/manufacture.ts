const {ccclass, property} = cc._decorator;
import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
import Util from "../../Common/Util";
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    jar_full:cc.Prefab=null;

    @property(cc.Prefab)
    jar_noFull:cc.Prefab=null;

    @property(cc.Prefab)
    jar_yellow:cc.Prefab=null;

    @property(cc.Prefab)
    manufactureUpgrade:cc.Prefab=null;

    @property(cc.Prefab)
    bubbleMoney:cc.Prefab=null;
    _lb_honey=null;
    _lb_upSpeedTime=null;
    _lb_doubleTime=null;
    _btn_upgrade=null;
    _btn_upSpeed=null;
    _btn_doubleIncome=null;
    _icon_arrow=null;
    _timeCount=-1;
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
    _doubleTime=0;
    _speedTime=0;
    
    onLoad(){
        GameCtr.getInstance().setManufacture(this);
        this.initNode();
    }

    initNode(){
        this._lb_honey=this.node.getChildByName("lb_honey");
        this._lb_upSpeedTime=this.node.getChildByName("lb_upSpeedTime");
        this._lb_doubleTime=this.node.getChildByName("lb_doubleTime");
        this._btn_upgrade=this.node.getChildByName("btn_upgrade");
        this._btn_upSpeed=this.node.getChildByName("btn_speedUp")
        this._btn_doubleIncome=this.node.getChildByName("btn_boubleIncome");
        this._mask=this.node.getChildByName("mask");
        this._icon_arrow=this.node.getChildByName("icon_arrow");
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
        this._lb_upSpeedTime.active=false;
        this._lb_doubleTime.active=false;
        this._btn_doubleIncome.getComponent(cc.Button).interactable=false;
        this._btn_upSpeed.active=false;
        // this._icon_arrow.active=false;

        this.initBtnEvent(this._btn_upgrade);
        this.initBtnEvent(this._mask); 
        this.initBtnEvent(this._btn_upSpeed);
        this.initBtnEvent(this._btn_doubleIncome);

        this.showBtn();
    }

    setHoneyValue(){
        this._lb_honey.getComponent(cc.Label).string=Util.formatNumber(GameCtr.honeyValue);
    }

    doWork(){
        if(GameCtr.honeyValue<=0){
            this._isWorking=false;
            return;
        }
        this._isWorking=true;
        let jar=null;
        if(GameCtr.honeyValue>GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus){
            jar=cc.instantiate(this.jar_full);
            GameCtr.honeyValue-=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus;
        }else{
            jar=cc.instantiate(this.jar_noFull);
            GameCtr.honeyValue-=GameCtr.honeyValue;
        }
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
            cc.delayTime(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime/(this._speed*GameCtr.globalSpeedRate)),
            cc.callFunc(()=>{
                jar.removeFromParent();
                GameCtr.money+=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus*GameCtr.incomeRate;
                GameCtr.levelMoney+=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus*GameCtr.incomeRate;
                GameCtr.getInstance().getLevel().setMoney();
                GameCtr.getInstance().getLevel().updateLevelProgress();
                GameCtr.getInstance().emitEvent("moneyUpdate",null);
                this.showBtn()
                this.showBubbleMoney(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].perBonus*GameCtr.incomeRate);
            })
        ))
        this.scheduleOnce(this.doWork.bind(this),GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].productTime/(this._speed*GameCtr.globalSpeedRate));
    }


    showBubbleMoney(money){
        let bubbleMoney=cc.instantiate(this.bubbleMoney);
        bubbleMoney.parent=this.node;
        bubbleMoney.x=450;
        bubbleMoney.getComponent("bubbleMoney").setMoney(money);
        AudioManager.getInstance().playSound("audio/gold");
    }


    initBtnEvent(btn){
        let move_x=0;
        btn.on(cc.Node.EventType.TOUCH_START,(e)=>{
            if(e.target.getName()!="mask"){return;}
            move_x=-1;
        })

        btn.on(cc.Node.EventType.TOUCH_MOVE,(e)=>{
            if(e.target.getName()!="mask"){return;}
            move_x= e.touch._point.x - e.touch._prevPoint.x;
            if(Math.abs(move_x)>=5){
                return;
            }
        })

        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_upgrade"){
                // if(GameCtr.money<GameCtr.manufactureConfig[GameCtr.ManufactureLevel].cost){return;}
                if(cc.find("Canvas").getChildByName("manufactureUpgrade")){return;}
                
                let manufactureUpgrade=cc.instantiate(this.manufactureUpgrade);
                manufactureUpgrade.parent=cc.find("Canvas");
                manufactureUpgrade.y=-1218;
                manufactureUpgrade.runAction(cc.moveBy(0.4,cc.p(0,1218)).easing(cc.easeElasticOut(3.0)));
                GameCtr.getInstance().getGame().setMaskVisit(true);
                GameCtr.getInstance().getGame().setManufactureUpgrade(manufactureUpgrade);
                AudioManager.getInstance().playSound("audio/btn_click");
            }else if(e.target.getName()=="btn_speedUp"){
                GameCtr.globalSpeedRate=2;
                this._speedTime=0;
                this.startSpeedUpTimer(GameCtr.otherConfig.speedUpPersist);
                this._btn_upSpeed.active=false;
                AudioManager.getInstance().playMusic("audio/speeUp");

            }else if(e.target.getName()=="btn_boubleIncome"){
                if(!this._btn_doubleIncome.getComponent(cc.Button).interactable){return;}
                this._doubleTime=0;
                this._btn_doubleIncome.getComponent(cc.Button).interactable=false;
                GameCtr.incomeRate=2;
                this.startDoubleTimer(GameCtr.otherConfig.doublePersist);
            }else if(e.target.getName()=="mask"){
                if(Math.abs(move_x)>=5){
                    this._speedUpTime=Date.now();
                    this._speed=this._speedUpTime>0?GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].speed:1;
                }
            }
        })
    }

    upgrade(){
        GameCtr.money-=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].cost;
        GameCtr.ManufactureLevel+=1;
        this.showBtn();
        GameCtr.getInstance().setManufactureLevel();
    }

    showBtn(){
        if(GameCtr.money>=GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].cost){
            this.enableBtn(true);
        }else{
            this.enableBtn(false);
        }
    }

    enableBtn(isEffectable){
        this._btn_upgrade.getComponent(cc.Button).interactable=isEffectable;
    }

    startSpeedUpTimer(_timeCount){
        this._timeCount=_timeCount;
        this._lb_upSpeedTime.active=true;
        this.countDown();
    }

    startDoubleTimer(_timeCount){
        this._timeCount1=_timeCount;
        this._lb_doubleTime.active=true;
        this.countDown1();
    }

    countDown(){
        if(this._timeCount<0){
            GameCtr.globalSpeedRate=1;
            this._lb_upSpeedTime.active=false;
            AudioManager.getInstance().playMusic("audio/bgMusic");
            return;
        }
        let minStr=Math.floor(this._timeCount/60)<10?"0"+Math.floor(this._timeCount/60):""+Math.floor(this._timeCount/60);
        let secStr=this._timeCount%60<10?"0"+this._timeCount%60:""+this._timeCount%60;

        this._lb_upSpeedTime.getComponent(cc.Label).string=minStr+":"+secStr;
        this._timeCount-=1;
        this.scheduleOnce(this.countDown.bind(this),1);
    }

    countDown1(){
        if(this._timeCount1<0){
            GameCtr.incomeRate=1;
            this._lb_doubleTime.active=false;
            return;
        }
        let minStr=Math.floor(this._timeCount1/60)<10?"0"+Math.floor(this._timeCount1/60):""+Math.floor(this._timeCount1/60);
        let secStr=this._timeCount1%60<10?"0"+this._timeCount1%60:""+this._timeCount1%60;

        this._lb_doubleTime.getComponent(cc.Label).string=minStr+":"+secStr;
        this._timeCount1-=1;
        this.scheduleOnce(this.countDown1.bind(this),1);
    }

    dowork(dt){
        if(!this._upLine){return}
        if(this._speedUpTime>0){
            if((Date.now()-this._speedUpTime)/1000>=1.0){
                this._speedUpTime=-1;
                this._speed=1;
            }
        }
        if(this._doubleTime>=0){
            this._doubleTime+=dt;
            if(this._doubleTime>=GameCtr.otherConfig.doubleInterval){
                this._btn_doubleIncome.getComponent(cc.Button).interactable=true;
                this._doubleTime=-1
            }
        }

        if(this._speedTime>=0){
            this._speedTime+=dt;
            if(this._speedTime>=GameCtr.otherConfig.speedUpInterval){
                this._btn_upSpeed.active=true;
                this._speedTime=-1
            }
        }

        if(!this._isWorking&&GameCtr.honeyValue>0){
            this.unschedule(this.doWork.bind(this));
            this.scheduleOnce(this.doWork.bind(this),1);
            this._isWorking=true;
        }
        

        this._upLine.x+=1080/(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime*60/(this._speed*GameCtr.globalSpeedRate));
        this._downLine.x-=1080/(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime*60/(this._speed*GameCtr.globalSpeedRate));
        if(this._upLine.x>=1080)  {this._upLine.x=0;}
        if(this._downLine.x<=-1080)  this._downLine.x=0;

        for(let i=0;i<this._pulleyList.length;i++){
            this._pulleyList[i].rotation+=360/(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime*60/(this._speed*GameCtr.globalSpeedRate));
        }
        for(let i=0;i<this._jarNode.children.length;i++){
            if(Math.abs(this._jarNode.children[i].y-365)<0.5){
                this._jarNode.children[i].x+=1080/(GameCtr.manufactureConfig[GameCtr.ManufactureLevel-1].transferTime*60/(this._speed*GameCtr.globalSpeedRate));
            }
        }
    }
}
