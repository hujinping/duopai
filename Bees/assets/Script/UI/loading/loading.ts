import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _btnStart=null;
    _progress=null;
    _configTotalCount=4;
    _configIndex=0;

    onLoad(){
        this._progress=this.node.getChildByName("progress");
        this._btnStart=this.node.getChildByName("btn_start");
        this.initData();
        this.loadResource();
        this.initBtnStart();
        GameCtr.getInstance();
    }

    initBtnStart(){
        this._btnStart.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/btn_click");
            if(this._configIndex<this._configTotalCount){
                //todo 提示
                return;
            }
            cc.director.loadScene("Game");
        })
    }

    loadResource(){
        cc.loader.loadResDir("textures",this.progressCallback.bind(this),this.completeCallback.bind(this));
    }

    progressCallback(completedCount,totalCount,item){
        this._progress.getComponent(cc.ProgressBar).progress=completedCount/totalCount;
    }

    completeCallback(){
        this.loadConf();
    }

    loadConf(){
        this.loadLevelConf();
        this.loadmanufactureConf();
        this.loadCombConf();
        this.loadPfTurntableConf()
        this.loadOtherConf();
    }

    loadLevelConf(){
        cc.loader.loadRes("config/level",(err,res)=>{
            if(err){return}
            GameCtr.levelConfig=res;
            this.checkLoadConfigOver();
        })
    }

    loadmanufactureConf(){
        cc.loader.loadRes("config/manufacture",(err,res)=>{
            if(err){return}
            GameCtr.manufactureConfig=res;
            this.checkLoadConfigOver();
        })
    }

    loadCombConf(){
        cc.loader.loadRes("config/comb",(err,res)=>{
            if(err){return}
            GameCtr.combConfig=res;
            this.checkLoadConfigOver();
        })
    }

    loadPfTurntableConf(){
        cc.loader.loadRes("config/pfTurnTable",(err,res)=>{
            if(err){return}
            GameCtr.pfTurnTableConfig=res;
            console.log("log----------GameCtr.pfTurnTableConfig=:",GameCtr.pfTurnTableConfig);
            this.checkLoadConfigOver();
        }) 
    }

    loadOtherConf(){
        cc.loader.loadRes("config/other",(err,res)=>{
            if(err){return}
            GameCtr.otherConfig=res;
            this.checkLoadConfigOver();
        })
    }

    checkLoadConfigOver(){
        this._configIndex++;
    }


    initData(){
        if(GameCtr.getInstance().getPlayerLevel()){
            GameCtr.level=GameCtr.getInstance().getPlayerLevel(); 
        }else{
            GameCtr.level=1;
            GameCtr.getInstance().setPlayerLevel();
        }

        if(GameCtr.getInstance().getManufactureLevel()){
            GameCtr.ManufactureLevel=GameCtr.getInstance().getManufactureLevel(); 
        }else{
            GameCtr.ManufactureLevel=1;
            GameCtr.getInstance().setManufactureLevel();
        }

        if(GameCtr.getInstance().getCombLevel()){
            GameCtr.comblevel=GameCtr.getInstance().getCombLevel(); 
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

        if(window.localStorage.getItem("guide")){
            GameCtr.guide=JSON.parse(window.localStorage.getItem("guide"))
        }else{
            GameCtr.guide=[];
            GameCtr.getInstance().setGuide();
        }


        GameCtr.rich=GameCtr.getInstance().getRich();
        GameCtr.money=GameCtr.getInstance().getMoney();
        GameCtr.levelMoney=GameCtr.getInstance().getLevelMoney();
        GameCtr.guide=GameCtr.getInstance().getGuide();

        if(!GameCtr.rich) GameCtr.rich=0;
        if(!GameCtr.money) GameCtr.money=0;
        if(!GameCtr.levelMoney) GameCtr.levelMoney=0;
    }
}
