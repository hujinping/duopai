/**
 * 游戏界面
 * 游戏逻辑自己实现
 */
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
// import ViewManager from "../../Common/ViewManager";
import HttpCtr from "../../Controller/HttpCtr";
import Http from "../../Common/Http";
import UserManager from "../../Common/UserManager";
import Util from "../../Common/Util";
import AudioManager from "../../Common/AudioManager";
import { MemoryDetector } from "../../Common/MemoryDetector";
import pfTurntable from "../component/pfTurntable";
const { ccclass, property } = cc._decorator;
@ccclass
export default class Game extends cc.Component {

    _honeycombContent=null;
    _pipelineNode=null;
    _glassPipelineNode=null;
    _authTipNode=null;
    _btn_pfTurntable=null;
    _btn_upSpeed=null;
    _btn_rank=null;
    _btn_sevenLogin=null;
    _btn_exchange=null;
    _btn_invite=null;
    _btn_more=null;
    _lb_upSpeedTime=null;
    _lb_money=null;
    _adNode=null;
    _mask=null;
    _combUpgrade=null;
    _interval3=0;
    _pfTurnableTime=0;
    _manufactureUpgrade=null;
    _speedTime=0;
    _ufoTime=0;
    _timeCount=-1;
    _combList=[];

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

    @property(cc.Prefab)
    pfTurntable:cc.Prefab=null;

    @property(cc.Prefab)
    toast:cc.Prefab=null;

    @property(cc.Prefab)
    tipHand:cc.Prefab=null;

    @property(cc.Prefab)
    signIn:cc.Prefab=null;

    @property(cc.Prefab)
    invite:cc.Prefab=null;

    @property(cc.Prefab)
    exchange:cc.Prefab=null;

    @property(cc.Prefab)
    moreNode:cc.Prefab=null;

    @property(cc.Prefab)
    ufo:cc.Prefab=null;

    @property(cc.Prefab)
    ranking:cc.Prefab=null;

    onLoad(){
        GameCtr.getInstance().setGame(this);
        GameCtr.getInstance().initEventTarget();
        this.initEvent();
        this.initNode();
        this.setRealMoney();
        AudioManager.getInstance().playMusic("audio/bgMusic");
        this.checkOffline();
        GameCtr.getInstance().setPlayTimes();
        this.refreshMoreNewGame();
        WXCtr.getFriendRankingData();                   //获取好友排行榜数据
        this.commitDataToServer();
        this.scheduleOnce(this.updateGameData.bind(this),1);
    }

    initEvent(){
        cc.game.on(cc.game.EVENT_SHOW,()=>{
            this.checkOffline();
        });

        cc.game.on(cc.game.EVENT_HIDE,()=>{
            GameCtr.getInstance().setTimestamp();
        });
    }

    initNode(){
        this._adNode=this.node.getChildByName("adNode");
        this._mask=this.node.getChildByName("otherNode").getChildByName("mask");
        this._btn_pfTurntable=this.node.getChildByName("otherNode").getChildByName("btn_pfTurntable");
        this._btn_sevenLogin=this.node.getChildByName("otherNode").getChildByName("btn_sevenLogin");
        this._btn_invite=this.node.getChildByName("otherNode").getChildByName("btn_invite");
        this._btn_upSpeed=this.node.getChildByName("otherNode").getChildByName("btn_speedUp");
        this._btn_rank=this.node.getChildByName("otherNode").getChildByName("btn_rank");
        this._btn_more=this.node.getChildByName("otherNode").getChildByName("btn_more");
        this._btn_exchange=this.node.getChildByName("otherNode").getChildByName("exchange").getChildByName("btn_exchange");
        this._lb_money=this.node.getChildByName("otherNode").getChildByName("exchange").getChildByName("lb_money");
        this._lb_upSpeedTime=this.node.getChildByName("otherNode").getChildByName("lb_upSpeedTime");
        this._authTipNode=this.node.getChildByName("authTipNode");
        this._honeycombContent=this.node.getChildByName("honeycombNode").getChildByName("content");
        this._pipelineNode=this._honeycombContent.getChildByName("pipelineNode");
        this._glassPipelineNode=this._honeycombContent.getChildByName("glassPipelineNode")

        this._lb_upSpeedTime.active=false;
        this._btn_upSpeed.active=false;
        this._authTipNode.active=false;

        this._pipelineNode.tag=1000;
        this._glassPipelineNode.tag=1000;
        this._glassPipelineNode.setLocalZOrder(0);
        this._pipelineNode.setLocalZOrder(10);

        this.initCombContentEvent();
        this.initBtnEvent(this._btn_pfTurntable);
        this.initBtnEvent(this._btn_sevenLogin);
        this.initBtnEvent(this._btn_invite);
        this.initBtnEvent(this._btn_upSpeed);
        this.initBtnEvent(this._btn_rank);
        this.initBtnEvent(this._btn_exchange);
        this.initBtnEvent(this._btn_more);
        this.initCombs();
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/open_panel");
            if(e.target.getName()=="btn_speedUp"){
                if(GameCtr.globalSpeedRate>1){
                    this.showToast("正在加速中...");
                    return;
                }
                GameCtr.globalSpeedRate=2;
                GameCtr.getInstance().getManufacture().resetLineAction();
                this._speedTime=0;
                this.startSpeedUpTimer(GameCtr.otherConfig.speedUpPersist);
                this._btn_upSpeed.active=false;
                this._btn_upSpeed.stopAllActions();
                this.showRocketAction();
            }else if(e.target.getName()=="btn_rank"){
                if(cc.find("Canvas").getChildByName("ranking")){return}
                let ranking=cc.instantiate(this.ranking);
                ranking.parent=cc.find("Canvas");
                ranking.setLocalZOrder(10);
            }else if(e.target.getName()=="btn_pfTurntable"){
                if(!this._btn_pfTurntable.getComponent(cc.Button).interactable){
                    this.showToast("转盘冷却中...");
                    return;
                }
                if(cc.find("Canvas").getChildByName("pfTurntable")){return}
                let pfTurntable=cc.instantiate(this.pfTurntable);
                pfTurntable.parent=cc.find("Canvas");
            }else if(e.target.getName()=="btn_sevenLogin"){
                if(cc.find("Canvas").getChildByName("signIn")){return}
                this.setMaskVisit(true);
                let signin=cc.instantiate(this.signIn);
                signin.parent=cc.find("Canvas");
                signin.setLocalZOrder(50);
            }else if(e.target.getName()=="btn_invite"){
                if(cc.find("Canvas").getChildByName("invite")){return}
                this.setMaskVisit(true);
                let invite=cc.instantiate(this.invite);
                invite.parent=cc.find("Canvas");
            }else if(e.target.getName()=="btn_exchange"){
                if(cc.find("Canvas").getChildByName("exchange1")){return}
                let exchange=cc.instantiate(this.exchange);
                exchange.parent=cc.find("Canvas");
            }else if(e.target.getName()=="btn_more"){
                if(cc.find("Canvas").getChildByName("moreNode")){return}
                let moreNode=cc.instantiate(this.moreNode);
                moreNode.parent=cc.find("Canvas");
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
        for(let level=0;level<GameCtr.comblevel+5;level++){//
            this.initComb(level);
        }
        this._honeycombContent.setContentSize(cc.size(1080,408*(GameCtr.comblevel+5)+200))
    }

    initComb(level){
        let combsUnlock=JSON.parse(GameCtr.getInstance().getCombsUnlock());
        
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
        honeyComb.tag=level;
        honeyComb.setLocalZOrder(2);
        honeyComb.getComponent("honeycomb").setLevel(level+1,unlockNum,unlock);
        honeyComb.getComponent("honeycomb").initBtn();
        this._combList.push(honeyComb);
    }

    unlockComb(){
        if(GameCtr.comblevel>=30){return}
        GameCtr.comblevel++;
        let comb=this.getComb(GameCtr.comblevel);
        let preComb=this.getComb(GameCtr.comblevel-1);
        if(preComb && preComb.getComponent("honeycomb").getUnlock()){
            comb.getComponent("honeycomb").showUnlockBtn(true);
        }
        if(GameCtr.comblevel+4<30){
            this.initComb(GameCtr.comblevel+4);
            this._honeycombContent.setContentSize(cc.size(1080,408*(GameCtr.comblevel+5)+200))
            GameCtr.getInstance().setCombLevel();
        }
    }

    startSpeedUpTimer(_timeCount){
        this._timeCount=_timeCount;
        this._lb_upSpeedTime.active=true;
        AudioManager.getInstance().playMusic("audio/speeUp");
        GameCtr.getInstance().emitEvent("startSpeedUp",null);
        this.setCombsSpeed(2);
        this.countDown();
        
    }

    countDown(){
        if(this._timeCount<0){
            this.setCombsSpeed(1);
            GameCtr.globalSpeedRate=1;
            this._lb_upSpeedTime.active=false;
            GameCtr.getInstance().getManufacture().resetLineAction();
            AudioManager.getInstance().playMusic("audio/bgMusic");
            GameCtr.getInstance().emitEvent("stopSpeedUp",null);
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
        if(offlineTime<120){return;}
        offlineTime=offlineTime>(8*60*60)?8*60*60:offlineTime;

        let offlineIncome=cc.instantiate(this.offlineIncome);
        offlineIncome.parent=cc.find("Canvas");
        offlineIncome.getComponent("offlineIncome").init(offlineTime);
    }

    getComb(combLevel){
        return this._honeycombContent.getChildByTag(combLevel-1);
    }


    setMaskVisit(isVisit){
        this._mask.active=isVisit;
    }

    setRealMoney(){
        if(GameCtr.realMoney){
            this._lb_money.getComponent(cc.Label).string="￥"+(GameCtr.realMoney/100).toFixed(2);
        }
    }

    showWorldRank() {
        console.log('获取世界排行数据???');
        Http.send({
            url: Http.UrlConfig.GET_RANK_LIST,
            success: (resp) => {
                console.log("getWorldList response == ", resp);
                this.creatRankNode(resp.data);
            },
            data: {
                uid: UserManager.user_id,
                voucher:UserManager.voucher,
            }
        });
    }

    creatRankNode(rankList){
        let rank=cc.instantiate(this.rank);
        rank.parent=cc.find("Canvas");
        rank.y=-1218;
        rank.runAction(cc.moveBy(0.4,cc.p(0,1218)).easing(cc.easeElasticOut(3.0))); 
        rank.getComponent("rank").initRank(rankList);
        GameCtr.getInstance().getGame().setMaskVisit(true);
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


    showToast(msg){
        if(cc.find("Canvas").getChildByName("toast")){return}
        let toast=cc.instantiate(this.toast);
        toast.parent=cc.find("Canvas");
        toast.setLocalZOrder(1000);
        toast.getComponent("toast").show(msg);
        toast.runAction(cc.sequence(
            cc.delayTime(1.0),
            cc.fadeOut(0.3),
            cc.callFunc(()=>{
                toast.destroy();
            })
        ));
    }

    noticeMoneyUpdate(){
        for(let i=0;i<GameCtr.comblevel;i++){
            GameCtr.getInstance().emitEvent("moneyUpdate"+(i+1),null)
        }
    }

    setCombsSpeed(rate){
        for(let i =0;i<this._combList.length;i++){
            this._combList[i].getComponent("honeycomb").setSpeedRate(rate);
        }
    }
    /**********************guide start *********************/
    createTipHand(parent){
        let tipHand=cc.instantiate(this.tipHand);
        tipHand.parent=parent;
        let sp=tipHand.getChildByName("sp");
        sp.runAction(cc.repeatForever(cc.sequence(
            cc.delayTime(0.3),
            cc.callFunc(()=>{
                sp.y+=40;
            }),
            cc.delayTime(0.3),
            cc.callFunc(()=>{
                sp.y-=40;
            }),
        )))
        return tipHand;
    }

    showGuideStep1(){
        let hand=this.createTipHand(cc.find("Canvas"));
        hand.tag=GameCtr.tipHandTag+1;
        hand.scale=0.6;
        hand.x=400;
        hand.y=300;
    }

    showGuideStep2(){
        let hand=this.createTipHand(this.getComb(1));
        hand.setLocalZOrder(50);
        hand.tag=GameCtr.tipHandTag+2
        hand.scale=0.6;
        hand.x=300;
        hand.y=0;
    }

    showGuideStep3(){
        let hand=this.createTipHand(GameCtr.getInstance().getManufacture().node);
        hand.tag=GameCtr.tipHandTag+3
        hand.scale=0.6;
        hand.x=-400;
        hand.y=150;
    }

    showGuideStep4(){
        let hand=this.createTipHand(this.node);
        hand.tag=GameCtr.tipHandTag+4
        hand.scale=0.6;
        hand.x=380;
        hand.y=650;
    }

    closeGuideStep(parent,step){
        while(parent.getChildByTag(GameCtr.tipHandTag+step)){
            parent.removeChildByTag(GameCtr.tipHandTag+step)
        }
    }

    completeGuideStep(parent,step){
        this.closeGuideStep(parent,step);
        GameCtr.guide.push(step);
        GameCtr.getInstance().setGuide();
    }



    
    isGuideStepOver(step){
        for(let i =0;i<GameCtr.guide.length;i++){
            if(step==GameCtr.guide[i]){
                return true;
            }
        }
        return false;
    }

    /**********************guide end*********************/

    startPfTurntableTime(){
        this._pfTurnableTime=0;
        this.countPfTurnableTime();
    }

    countPfTurnableTime(){
        this._pfTurnableTime++;
        if(this._pfTurnableTime>=GameCtr.otherConfig.pfTurntableInterval){
            this._btn_pfTurntable.getComponent(cc.Button).interactable=true;
            return;
        }
        this.unschedule(this.countPfTurnableTime.bind(this));
        this.scheduleOnce(this.countPfTurnableTime.bind(this),1);
    }

    disableBtnPfturnable(){
        this._btn_pfTurntable.getComponent(cc.Button).interactable=false;
    }

    updateSpeedUpState(dt){
        if(this._speedTime>=0){
            this._speedTime+=dt;
            if(this._speedTime>=GameCtr.otherConfig.speedUpInterval){
                this._btn_upSpeed.active=true;
                this._btn_upSpeed.runAction(cc.repeatForever(cc.sequence(
                    cc.scaleTo(0.2,1.15),
                    cc.scaleTo(0.2,1.0)
                )))
                this._speedTime=-1;
            }
        }
    }

    updateUfoTime(dt){
        if(this._ufoTime>=0){
            this._ufoTime+=dt;
            if(this._ufoTime>=GameCtr.otherConfig.ufoInterval){
                let ufo =cc.instantiate(this.ufo);
                ufo.parent=this.node;
                ufo.scale=2.0;
                ufo.x=-600;
                ufo.y=600;
                ufo.runAction(cc.sequence(
                    cc.moveTo(6,cc.p(600,600)),
                    cc.callFunc((e)=>{
                        ufo.destroy();
                    })
                ));
                this._ufoTime=-1;
            }
        }
    }

    caculateHideHoney(){
        let combsUnlock=JSON.parse(GameCtr.getInstance().getCombsUnlock());
        for(let i=0;i<GameCtr.comblevel;i++){//
            if(this._honeycombContent.y>=(i+1)*408){  
                GameCtr.honeyValue+=(GameCtr.combConfig[i].initialIncome+GameCtr.combConfig[i].incomeMatrix*(combsUnlock[i].level-1)*combsUnlock[i].level)/(GameCtr.combConfig[i].baseSpeed*2)
            }
            if(i-Math.floor(this._honeycombContent.y/408)>2){
                GameCtr.honeyValue+=(GameCtr.combConfig[i].initialIncome+GameCtr.combConfig[i].incomeMatrix*(combsUnlock[i].level-1)*combsUnlock[i].level)/(GameCtr.combConfig[i].baseSpeed*2)
            }
        }
    }

    refreshMoreNewGame(){
        if(!GameCtr.setting){return;}
        if(!GameCtr.setting.nav.banner||GameCtr.setting.nav.banner<=0){return;}
        this._adNode.active=true;
        let children = this._adNode.getChildByName("adFrame").children;

        for(let i=0;i<GameCtr.setting.nav.banner.length;i++){
            if(i>=4)return;
            let node = children[i];
            let sp = node.getComponent(cc.Sprite);
            GameCtr.loadImg(sp,GameCtr.setting.nav.banner[i].img)
            let obj = {appid:GameCtr.setting.nav.banner[i].appid,path:GameCtr.setting.nav.banner[i].path}
            console.log("%%%",obj)
            node.on(cc.Node.EventType.TOUCH_START, ()=>{
                WXCtr.gotoOther(obj);
            });
        }
    }

    upgradeNodeUpdate(){
        if(this._combUpgrade){
            this._combUpgrade.getComponent("combUpgrade").doUpdate()
        }
        if(this._manufactureUpgrade){
            this._manufactureUpgrade.getComponent("manufactureUpgrade").doUpdate();
        }
    }

    updateGameData(){
        GameCtr.getInstance().setRich();
        GameCtr.getInstance().setMoney();
        GameCtr.getInstance().setTimestamp();
        GameCtr.getInstance().setLevelMoney();
        this.updateSpeedUpState(1);
        this.updateUfoTime(1);
        this.caculateHideHoney();
        this.upgradeNodeUpdate()

        this.unschedule(this.updateGameData.bind(this));
        this.scheduleOnce(this.updateGameData.bind(this),1);
    }

    commitDataToServer(){
        HttpCtr.setGold(GameCtr.rich);
        //WXCtr.submitScoreToWx(GameCtr.rich,UserManager.user.city);
        this.unschedule(this.commitDataToServer.bind(this));
        this.scheduleOnce(this.commitDataToServer.bind(this),10);
    }


    update(dt){
        this._interval3+=dt;
        //GameCtr.getInstance().getManufacture().dowork(dt);
        for(let i=0;i<GameCtr.comblevel;i++){
            if(this._honeycombContent.y>=(i+1)*408){ this._combList[i].getComponent("honeycomb").stopWork(); continue;}
            if(i-Math.floor(this._honeycombContent.y/408)>2){this._combList[i].getComponent("honeycomb").stopWork();continue;}
            this._combList[i].getComponent("honeycomb").startWork();
        }
        
        if(this._interval3>=0.1){
            GameCtr.getInstance().getLevel().updateMoney();
            this._interval3=0;
        }
    }

}
