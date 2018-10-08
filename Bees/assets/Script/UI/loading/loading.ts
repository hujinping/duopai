import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";
import WXCtr from "../../Controller/WXCtr";
import HttpCtr from "../../Controller/HttpCtr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _btnStart=null;
    _progress=null;
    _configTotalCount=5;
    _configIndex=0;
    _adNode=null;
    _carouselNode=null;
    _carouseAds=[];
    _carouselIndex=0;

    @property(cc.Prefab)
    ad:cc.Prefab=null;

    onLoad(){
      
        this._progress=this.node.getChildByName("progress");
        this._btnStart=this.node.getChildByName("btn_start");
        this._adNode=this.node.getChildByName("adNode");
        this._carouselNode=this.node.getChildByName("carouselNode")
        this.initData();
        this.loadConf();
        this.initBtnStart();
        GameCtr.getInstance();
        //GameCtr.showLoading();
        GameCtr.getInstance().setLoading(this);
        this._btnStart.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.4,1.05),
            cc.scaleTo(0.4,1.0)
        )))
    }

    initCarousel(){
        if(!GameCtr.isAudited){return;}
        if(!GameCtr.setting.nav.navA||GameCtr.setting.nav.navA<=0){return;}

        for(let i=0;i<GameCtr.setting.nav.navA.length;i++){
            let ad=cc.instantiate(this.ad);
            ad.parent=this._carouselNode;
            ad.scale=1.0;
            ad.getComponent("ad").init(GameCtr.setting.nav.navA[i]);
            ad.x=i==0?0:1800;
            this._carouseAds.push(ad);
        }
        this._carouselIndex=0;
        this.scheduleOnce(()=>{
            this._carouseAds[this._carouselIndex].getComponent("ad").doShake();
        },2)
        this.scheduleOnce(this.doCarousel.bind(this),5);

    }

    doCarousel(){
        if(this._carouseAds.length<=1){ //广告位推荐位大于1个，才有轮播功能
            return 
        }
        this._carouseAds[this._carouselIndex].x=0;
        this._carouseAds[this._carouselIndex].getComponent("ad").doShake();
        for(let i=0;i<this._carouseAds.length;i++){
            if(i==this._carouselIndex){
                continue;
            }
            this._carouseAds[i].rotation=0;
            this._carouseAds[i].getComponent("ad").stopActions();
            this._carouseAds[i].x=1800;//移除屏幕之外
        }

        this._carouselIndex++;
        this._carouselIndex=this._carouselIndex%this._carouseAds.length;
        this.scheduleOnce(this.doCarousel.bind(this),5);
    }




    initBtnStart(){
        this._btnStart.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/open_panel");
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

        console.log("log-------GameCtr.comblebel=:",GameCtr.comblevel);

        if(GameCtr.getInstance().getCombsUnlock()){
            GameCtr.combsUnlock=JSON.parse(GameCtr.getInstance().getCombsUnlock()); 
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

        if(window.localStorage.getItem("honeyValue")){
            GameCtr.honeyValue=GameCtr.getInstance().getHoneyValue();
        }else{
            GameCtr.honeyValue=0;
            GameCtr.getInstance().setHoneyValue();
        }


        GameCtr.rich=GameCtr.getInstance().getRich();
        GameCtr.money=GameCtr.getInstance().getMoney();
        GameCtr.levelMoney=GameCtr.getInstance().getLevelMoney();
        GameCtr.guide=GameCtr.getInstance().getGuide();
        if(!GameCtr.rich) GameCtr.rich=0;
        if(!GameCtr.money) GameCtr.money=0;
        if(!GameCtr.levelMoney) GameCtr.levelMoney=0;
    }

    refreshMoreNewGame(){
        if(!GameCtr.isAudited){return;}
        if(!GameCtr.setting.nav.banner||GameCtr.setting.nav.banner<=0){return;}
        if(!this._adNode){return}
        this._adNode.active=true;
        let adFrame=this._adNode.getChildByName("adFrame");
        for(let i=0;i<GameCtr.setting.nav.banner.length;i++){
            if(i>=4)return;
            let ad=cc.instantiate(this.ad);
            ad.parent=adFrame;
            ad.scale=1.0;
            ad.getComponent("ad").init(GameCtr.setting.nav.banner[i]);
            ad.y=-15;
            if(i==0)ad.x=-292;
            if(i==1)ad.x=-97;
            if(i==2)ad.x=96;
            if(i==3)ad.x=292; 
        
        }
        this.initCarousel();
    }


}
