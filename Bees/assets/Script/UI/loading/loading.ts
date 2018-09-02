
import GameCtr from "../../Controller/GameCtr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _progress=null;
    _configTotalCount=4;
    _configIndex=0;

    onLoad(){
        this._progress=this.node.getChildByName("progress");
        this.loadResource();
    }

    loadResource(){
        cc.loader.loadResDir("textures",this.progressCallback.bind(this),this.completeCallback.bind(this));
    }

    progressCallback(completedCount,totalCount,item){
        this._progress.getComponent(cc.ProgressBar).progress=completedCount/totalCount;
    }

    completeCallback(){
        this.loadConfigs();
    }

    loadConfigs(){
        this.loadLevelConfig();
        this.loadmanufacture();
        this.loadCombConfig();
        this.loadOtherConfig();
    }

    loadLevelConfig(){
        cc.loader.loadRes("config/level",(err,res)=>{
            if(err){return}
            GameCtr.levelConfig=res;
            this.checkLoadConfigOver();
        })
    }

    loadmanufacture(){
        cc.loader.loadRes("config/manufacture",(err,res)=>{
            if(err){return}
            GameCtr.manufactureConfig=res;
            this.checkLoadConfigOver();
        })
    }

    loadCombConfig(){
        cc.loader.loadRes("config/comb",(err,res)=>{
            if(err){return}
            GameCtr.combConfig=res;
            this.checkLoadConfigOver();
        })
    }

    loadOtherConfig(){
        cc.loader.loadRes("config/other",(err,res)=>{
            if(err){return}
            GameCtr.otherConfig=res;
            this.checkLoadConfigOver();
        })
    }

    checkLoadConfigOver(){
        this._configIndex++;
        if(this._configIndex==this._configTotalCount){
            cc.director.loadScene("Game");
        }
    }



   
}
