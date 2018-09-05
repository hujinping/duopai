/**
 * 游戏界面
 * 游戏逻辑自己实现
 */
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
// import ViewManager from "../../Common/ViewManager";
// import HttpCtr from "../../Controller/HttpCtr";
// import UserManager from "../../Common/UserManager";
import Util from "../../Common/Util";
import AudioManager from "../../Common/AudioManager";
import { MemoryDetector } from "../../Common/MemoryDetector";

// import AudioManager from "../../Common/AudioManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Game extends cc.Component {

    _honeycombContent=null;
    _pipelineNode=null;
    _glassPipelineNode=null;
    _authTipNode=null;
    _btn_upSpeed=null;
    _btn_rank=null;
    _lb_upSpeedTime=null;
    _adNode=null;
    _mask=null;
    _combUpgrade=null;
    _interval=null;
    _manufactureUpgrade=null;
    _speedTime=0;
    _timeCount=-1;
    _combList=[];
    @property(cc.Prefab)
    test:cc.Prefab=null;

    @property(cc.Prefab)
    test1:cc.Prefab=null;

    @property(cc.Prefab)
    honeyComb:cc.Prefab=null;

    @property(cc.Prefab)
    pipeline:cc.Prefab=null;

    @property(cc.Prefab)
    glassPipeline:cc.Prefab=null;

    @property(cc.Prefab)
    rocket:cc.Prefab=null;

    @property(cc.Prefab)
    offlineIncome:cc.Prefab=null;

    @property(cc.Prefab)
    rank:cc.Prefab=null;

    onLoad(){
        GameCtr.getInstance().setGame(this);
        GameCtr.getInstance().initEventTarget();
        this.initEvent();
        this.initData();
        this.initNode();
        AudioManager.getInstance().playMusic("audio/bgMusic");
        this.checkOffline();
        GameCtr.getInstance().setPlayTimes();
        //MemoryDetector.showMemoryStatus();
    }

    initEvent(){
        cc.game.on(cc.game.EVENT_SHOW,()=>{
            this.checkOffline();
        });

        cc.game.on(cc.game.EVENT_HIDE,()=>{
            GameCtr.getInstance().setTimestamp();
        });
    }

    initData(){
        //window.localStorage.clear();
        if(window.localStorage.getItem("level")){
            GameCtr.level=Number(window.localStorage.getItem("level")); 
        }else{
            GameCtr.level=1;
            GameCtr.getInstance().setPlayerLevel();
        }

        if(window.localStorage.getItem("ManufactureLevel")){
            GameCtr.ManufactureLevel=Number(window.localStorage.getItem("ManufactureLevel")); 
        }else{
            GameCtr.ManufactureLevel=1;
            GameCtr.getInstance().setManufactureLevel();
        }

        if(window.localStorage.getItem("comblevel")){
            GameCtr.comblevel=Number(window.localStorage.getItem("comblevel")); 
        }else{
            GameCtr.comblevel=1;
            GameCtr.getInstance().setCombLevel();
        }

        if(window.localStorage.getItem("combsUnlock")){
            GameCtr.combsUnlock=JSON.parse(window.localStorage.getItem("combsUnlock")); 
        }else{
            GameCtr.combsUnlock=[];
            GameCtr.combsUnlock.push({level:1,unlock:true});
            GameCtr.getInstance().setCombsUnlock();
        }

        GameCtr.money=GameCtr.getInstance().getMoney();
        GameCtr.levelMoney=GameCtr.getInstance().getLevelMoney();
    }

    initNode(){
        this._adNode=this.node.getChildByName("adNode");
        this._mask=this.node.getChildByName("otherNode").getChildByName("mask");
        this._btn_upSpeed=this.node.getChildByName("otherNode").getChildByName("btn_speedUp");
        this._btn_rank=this.node.getChildByName("otherNode").getChildByName("btn_rank");
        this._lb_upSpeedTime=this.node.getChildByName("otherNode").getChildByName("lb_upSpeedTime");
        this._authTipNode=this.node.getChildByName("authTipNode");
        this._honeycombContent=this.node.getChildByName("honeycombNode").getChildByName("content");
        this._pipelineNode=this._honeycombContent.getChildByName("pipelineNode");
        this._glassPipelineNode=this._honeycombContent.getChildByName("glassPipelineNode")

        this._lb_upSpeedTime.active=false;
        this._btn_upSpeed.active=false;
        this._authTipNode.active=false;

        this._glassPipelineNode.setLocalZOrder(0)
        this._pipelineNode.setLocalZOrder(10);
        this.initCombContentEvent();
        this.initBtnEvent(this._btn_upSpeed);
        this.initBtnEvent(this._btn_rank)
        this.initCombs();
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/btn_click");
            if(e.target.getName()=="btn_speedUp"){
                GameCtr.globalSpeedRate=2;
                this._speedTime=0;
                this.startSpeedUpTimer(GameCtr.otherConfig.speedUpPersist);
                this._btn_upSpeed.active=false;
                AudioManager.getInstance().playMusic("audio/speeUp");
                this.showRocketAction();
            }else if(e.target.getName()=="btn_rank"){
                if(!WXCtr.authed){
                    this.showAuthTip();
                    return;
                }
                if(cc.find("Canvas").getChildByName("rank")){return;}
                let rank=cc.instantiate(this.rank);
                rank.parent=cc.find("Canvas");
                rank.y=-1218;
                rank.runAction(cc.moveBy(0.4,cc.p(0,1218)).easing(cc.easeElasticOut(3.0)));
                GameCtr.getInstance().getGame().setMaskVisit(true);
            }
        })
    }

    initCombContentEvent(){
        this._honeycombContent.on(cc.Node.EventType.TOUCH_START,(e)=>{
            //console.log("log----------------touch_start");
        });

        this._honeycombContent.on(cc.Node.EventType.TOUCH_MOVE,(e)=>{
            if(this._honeycombContent.y<=0 && e.touch._point.y-e.touch._prevPoint.y<0){
                return;
            }
            if(this._honeycombContent.y>=408*(GameCtr.comblevel+4) && e.touch._point.y-e.touch._prevPoint.y>0){
                return;
            }
            this._honeycombContent.y+=(e.touch._point.y-e.touch._prevPoint.y);

            if(this._honeycombContent.y<=0){
                this._honeycombContent.y=0
            }
            if(this._honeycombContent.y>=408*(GameCtr.comblevel+4)){
                this._honeycombContent.y=408*(GameCtr.comblevel+4);
            }
            
        });

        this._honeycombContent.on(cc.Node.EventType.TOUCH_END,(e)=>{
            //console.log("log----------------touch_end");
        });

        this._honeycombContent.on(cc.Node.EventType.TOUCH_CANCEL,(e)=>{
            //console.log("log----------------touch_cancle");
        });
    }

    initCombs(){
        for(let level=0;level<GameCtr.comblevel+5;level++){
            this.initComb(level);
        }
        this._honeycombContent.setContentSize(cc.size(1080,408*(GameCtr.comblevel+5)+200))
    }

    initComb(level){
        let combsUnlock=GameCtr.getInstance().getCombsUnlock();
        let pipeline=cc.instantiate(this.pipeline);
        let honeyComb=cc.instantiate(this.honeyComb);
        let glassPipeline=cc.instantiate(this.glassPipeline);
       
        pipeline.parent=this._pipelineNode;
        honeyComb.parent=this._honeycombContent;
        glassPipeline.parent=this._glassPipelineNode;

        pipeline.x=-460;
        pipeline.y=-190-408*level;

        honeyComb.x=60;
        honeyComb.y=-220-408*level;

        glassPipeline.x=-492;
        glassPipeline.y=-190-408*level;

        let unlockNum=combsUnlock[level]?combsUnlock[level].level:0;
        let unlock=combsUnlock[level]?combsUnlock[level].unlock:false;
        honeyComb.tag=GameCtr.comblevel+level;
        honeyComb.setLocalZOrder(2);
        honeyComb.getComponent("honeycomb").setLevel(level+1,unlockNum,unlock);
        honeyComb.getComponent("honeycomb").initBtn();
        this._combList.push(honeyComb);
    }

    unlockComb(){
        let comb=this._honeycombContent.getChildByTag(GameCtr.comblevel+1);
        comb.getComponent("honeycomb").setCanUnlock(true);
        comb.getComponent("honeycomb").showUnlockBtn(true);
        GameCtr.comblevel++;
        this.initComb(GameCtr.comblevel+4);
        this._honeycombContent.setContentSize(cc.size(1080,408*(GameCtr.comblevel+5)+200))
    }

    startSpeedUpTimer(_timeCount){
        this._timeCount=_timeCount;
        this._lb_upSpeedTime.active=true;
        this.countDown();
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

    showRocketAction(){
        let rocket=cc.instantiate(this.rocket);
        rocket.parent=cc.find("Canvas");
        rocket.x=45;
        rocket.y=-613;
        rocket.runAction(cc.sequence(
            cc.moveTo(0.5,cc.p(0,1300)),
            cc.callFunc(()=>{
                rocket.destroy();
            })
        ))
    }

    checkOffline(){
        if(!GameCtr.getInstance().getPlayTimes()){return;}
        if(cc.find("Canvas").getChildByName("offlineIncome")){return;}

        let offlineTime=(Date.now()-GameCtr.getInstance().getTimestamp())/1000;
        if(offlineTime>10){
            let offlineIncome=cc.instantiate(this.offlineIncome);
            offlineIncome.parent=cc.find("Canvas");
            offlineIncome.getComponent("offlineIncome").init(offlineTime);
        }
    }

    getComb(combLevel){
        return this._honeycombContent.getChildByTag(combLevel);
    }

    setMaskVisit(isVisit){
        this._mask.active=isVisit;
    }

    showAuthTip(){
        this._authTipNode.active=true;
    }

    hideAuthTip(){
        this._authTipNode.active=false;
    }

    setCombUpgrade(node){
        this._combUpgrade=node;
    }

    setManufactureUpgrade(node){
        this._manufactureUpgrade=node;
    }

    clearCombUpGrade(){
        this._combUpgrade=null;
    }

    clearManufactureUpgrade(){
        this._manufactureUpgrade=null;
    }

    updateSpeedUpState(dt){
        if(this._speedTime>=0){
            this._speedTime+=dt;
            if(this._speedTime>=GameCtr.otherConfig.speedUpInterval){
                this._btn_upSpeed.active=true;
                this._speedTime=-1;
            }
        }
    }

    update(dt){
        this._interval++;
        if(this._interval>0.3){
            for(let i=0;i<this._combList.length;i++){
                this._combList[i].getComponent("honeycomb").doWork(dt);
            }
            if(this._combUpgrade){
                this._combUpgrade.getComponent("combUpgrade").doUpdate(dt)
            }
    
            if(this._manufactureUpgrade){
                this._manufactureUpgrade.getComponent("manufactureUpgrade").doUpdate(dt);
            }
            GameCtr.getInstance().getManufacture().dowork(dt);
            GameCtr.getInstance().setTimestamp();
            GameCtr.getInstance().setMoney();
            GameCtr.getInstance().setLevelMoney();
            this.updateSpeedUpState(dt);
            this._interval++;
        }
    }

}
