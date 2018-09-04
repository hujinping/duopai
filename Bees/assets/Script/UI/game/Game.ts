/**
 * 游戏界面
 * 游戏逻辑自己实现
 */
import GameCtr from "../../Controller/GameCtr";
// import WXCtr from "../../Controller/WXCtr";
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
    _adNode=null;
    _mask=null;
    _combUpgrade=null;
    _manufactureUpgrade=null;
    _combList=[];

    _interval=null;

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

    onLoad(){
        GameCtr.getInstance().setGame(this);
        GameCtr.getInstance().initEventTarget();
        this.initData();
        this.initNode();
        AudioManager.getInstance().playMusic("audio/bgMusic");
        //MemoryDetector.showMemoryStatus();
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
    }

    initNode(){
        this._mask=this.node.getChildByName("mask");
        this._adNode=this.node.getChildByName("adNode");
        this._honeycombContent=this.node.getChildByName("honeycombNode").getChildByName("content");
        this._pipelineNode=this._honeycombContent.getChildByName("pipelineNode");
        this._glassPipelineNode=this._honeycombContent.getChildByName("glassPipelineNode")
        this._glassPipelineNode.setLocalZOrder(0)
        this._pipelineNode.setLocalZOrder(10);
        this.initCombContentEvent();
        this.initCombs();
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

    getComb(combLevel){
        return this._honeycombContent.getChildByTag(combLevel);
    }

    setMaskVisit(isVisit){
        this._mask.active=isVisit;
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
            this._interval++;
        }
    }

}
