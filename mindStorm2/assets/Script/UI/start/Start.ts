/**
 * 开始界面
 * 如果有与现有不一样的需求自己拓展实现
 */
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
import ViewManager from "../../Common/ViewManager";
import Util from "../../Common/Util";
import UserManager from "../../Common/UserManager";
import Http from "../../Common/Http";
import AudioManager from '../../Common/AudioManager'


const { ccclass, property } = cc._decorator;
enum Direction{
    LEFT,
    RIGHT,
}

@ccclass
export default class Start extends cc.Component {
    @property(cc.Prefab)
    worldRank: cc.Prefab = null; 
    @property(cc.Prefab)
    morePower: cc.Prefab = null; 

    @property(cc.Prefab)
    selfInfoPrefab: cc.Prefab = null; 

    @property(cc.Prefab)
    signIn: cc.Prefab = null; 

    @property(cc.Prefab)
    invite: cc.Prefab = null; 

    @property(cc.Prefab)
    roleSelete: cc.Prefab = null;

    @property(cc.Prefab)
    ad:cc.Prefab = null; 

    @property(cc.Prefab)
    toast:cc.Prefab=null;

    @property(cc.Prefab)
    bgMusic:cc.Prefab=null;

    private sliderData = null;
    private roleListArrowLeft=null;
    private roleListArrowRight=null;
    private lb_roleIndex=null;
    private btnsNode=null;
    private adNode=null;
    private mask=null;
    private tex = null;
    private friendRankNode=null;
    private curRoleCardIndex=2;
    private roleCardInfoList=[];



    onLoad() {
        GameCtr.roleIndex=Number(localStorage.getItem("roleIndex"));
        GameCtr.getInstance().setStart(this);
       
        this.initNode();
        this.initEvent();
        this.initSelfInfo();
        this.initCurrentRole();
        this.refreshMoreNewGame();
        this.initBgMusic();
    }

    start() {
        WXCtr.getFriendRankingData();                   //获取好友排行榜数据
        if(GameCtr.isFighting){
            this.showGameCount();
        }
        GameCtr.isFighting=false;
    }

    initBgMusic(){
        while(cc.find("Canvas").getChildByTag(999999)){
            cc.find("Canvas").removeChildByTag(999999);
        }
        let bgMusic=cc.instantiate(this.bgMusic);
        bgMusic.parent=cc.find("Canvas");
        bgMusic.tag=999999;
    }

    initEvent(){
        cc.game.on(cc.game.EVENT_SHOW,()=>{
            this.initBgMusic();
        });
        cc.game.on(cc.game.EVENT_HIDE,()=>{
        });  
    }

    //开始游戏
    startGame() {
        GameCtr.startGame();
    }

    initNode(){
        this.mask=this.node.getChildByName("mask");
        this.adNode=this.node.getChildByName("adNode");
        this.btnsNode=this.node.getChildByName("btnsNode");
        this.friendRankNode=this.node.getChildByName("friendRankNode");
        this.mask.active=false;
        this.adNode.active=false;
        this.friendRankNode.active=false;
        this.initBtnsNode();
    }

    initBtnsNode(){
        let btn_role=this.btnsNode.getChildByName("roleFrame");
        let btn_invite=this.btnsNode.getChildByName("btn_invite");
        let btn_signIn=this.btnsNode.getChildByName("btn_signIn");
        let btn_morePower=this.btnsNode.getChildByName("btn_gameCount");
        let btn_totalRank=this.btnsNode.getChildByName("btn_totalRank");
        let btn_gameEntrance1=this.btnsNode.getChildByName("btn_gameEntrance1");
        let btn_gameEntrance2=this.btnsNode.getChildByName("btn_gameEntrance2");
        
        let btn_head=this.btnsNode.getChildByName("headNode").getChildByName("headFrame");

        this.initBtnsListener(btn_totalRank);
        this.initBtnsListener(btn_morePower);
        this.initBtnsListener(btn_head);
        this.initBtnsListener(btn_role); 

        this.initBtnsListener(btn_invite);
        this.initBtnsListener(btn_signIn)
        this.initBtnsListener(btn_gameEntrance1);
        this.initBtnsListener(btn_gameEntrance2);
    }


    initBtnsListener(btn:cc.Node){
        btn.on(cc.Node.EventType.TOUCH_END,function(e){
            AudioManager.getInstance().playSound("audio/btnCick");
            let btnName=e.target.getName();
            if(btnName=="btn_totalRank"){
                this.showWorldRank();
            }else if(btnName=="btn_gameCount"){
                if(!GameCtr.isAudited){return}
                this.setMaskVisit(true);
                this.createMorePowerNode();
            }else if(btnName=="headFrame"){
                this.creatSelfInfoNode();
            }else if(btnName=="btn_invite"){
                this.setMaskVisit(true);
                this.createInviteNode();
            }else if(btnName=="btn_signIn"){
                this.setMaskVisit(true);
                this.createSignInNode();
            }else if(btnName=="btn_gameEntrance1"){
                this.startFight();
            }else if(btnName=="btn_gameEntrance2"){
                this.startFight();
            }else if(btnName=="roleFrame"){
                this.setMaskVisit(true);
                this.createRoleSeleteNode();
            }

        }.bind(this))
    }

    

    initSelfInfo(){
        let selfInfo=GameCtr.getInstance().getSelfInfoFromLocal();
        if(!selfInfo){return;}
        let headNode=this.btnsNode.getChildByName("headNode");
        let lb_name=headNode.getChildByName("lb_name");
        let lb_gold=headNode.getChildByName("lb_gold");
        let headImg=headNode.getChildByName("mask").getChildByName("headImg");

        lb_name.getComponent(cc.Label).string=selfInfo.nickName;
        lb_gold.getComponent(cc.Label).string=GameCtr.money;
        Util.loadImg(headImg.getComponent(cc.Sprite),selfInfo.avatarUrl);
    }

    createTotalRankNode(totalRanks,selfRank,selfChickenValue){
        if(this.node.parent.getChildByName("totalRank")){return;}
        
        let visibleSize=cc.director.getVisibleSize();
        let worldRankNode=cc.instantiate(this.worldRank);
        worldRankNode.parent=this.node.parent;
        worldRankNode.getComponent("totalRank").initData(totalRanks,selfRank,selfChickenValue);
        if(!WXCtr.authed){
            worldRankNode.getComponent("totalRank").showAuthTip();
        }else{
            worldRankNode.getComponent("totalRank").init();
        }

        worldRankNode.scale=0.2;
        worldRankNode.runAction(cc.sequence(
            cc.scaleTo(0.15,1.1),
            cc.scaleTo(0.1,1.0),
        ))
    }

    createMorePowerNode(){
        if(this.node.getChildByName("morePower")){return}
        let morePowerNode=cc.instantiate(this.morePower);
        morePowerNode.parent=this.node;
        morePowerNode.setLocalZOrder(20);
    }

    creatSelfInfoNode(){
        if(this.node.parent.getChildByName("btn_head")){return;}
        let headNode=this.btnsNode.getChildByName("headNode");
        let btn_head=headNode.getChildByName("headFrame");
        
        let infoNode=cc.instantiate(this.selfInfoPrefab);
        infoNode.parent=headNode;
        let selfInfo=GameCtr.getInstance().getSelfInfoFromLocal();
        let name=selfInfo?selfInfo.nickName:"未授权玩家";
        infoNode.getComponent("selfInfo").setID("用户ID:"+UserManager.user_id);
        infoNode.getComponent("selfInfo").setName(name);

        infoNode.getComponent("selfInfo").setGameCount("场次:"+GameCtr.joinGameCount);
        infoNode.getComponent("selfInfo").setChickenCount(GameCtr.chickenCount);

        infoNode.x=btn_head.x;
        infoNode.y=btn_head.y-100;
        infoNode.runAction(cc.sequence(
            cc.scaleTo(0.1,1.2),
            cc.scaleTo(0.1,1.0),
        ))
    }

    createSignInNode(){
        if(this.node.getChildByName("signIn")){return;}
        let signIn =cc.instantiate(this.signIn);
        signIn.parent=this.node;
    }

    createInviteNode(){
        if(this.node.getChildByName("invite")){return;}
        let invite =cc.instantiate(this.invite);
        invite.parent=this.node;
    }


    createRoleSeleteNode(){
        if(this.node.getChildByName("roleSelete")){return;}
        let roleSelete = cc.instantiate(this.roleSelete);
        roleSelete.parent=this.node;
    }

    getMorePower(){
        return this.node.getChildByName("morePower");
    }

    roleCardAcion1(){
        for(let i=0;i<this.roleCardInfoList.length;i++){
            this.roleCardInfoList[i].node.active=true;
            this.roleCardInfoList[i].node.y=450;
            this.roleCardInfoList[i].node.runAction(cc.spawn(
                cc.moveBy(0.2,cc.p(500*(i-this.curRoleCardIndex),65*Math.abs(i-this.curRoleCardIndex))),  
                cc.rotateBy(0.2,-15*(i-this.curRoleCardIndex))
            ));
        }
    }

    showRoleCardArrow(){
        this.roleListArrowLeft.active=true;
        this.roleListArrowRight.active=true;
        this.lb_roleIndex.active=true;

        this.roleListArrowLeft.opacity=0;
        this.roleListArrowRight.opacity=0;

        this.roleListArrowLeft.runAction(cc.fadeIn(0.2));
        this.roleListArrowRight.runAction(cc.fadeIn(0.2));
    }

    showRankFriendAction(){
        let visibleSize=cc.director.getVisibleSize();
       
        this.friendRankNode.active=true;
        this.friendRankNode.y=-1250;
        this.friendRankNode.runAction(cc.moveTo(0.2,cc.p(0,-960)));
    }

    setMaskVisit(bool){
        this.mask.active=bool;
    }

    showWorldRank() {
        console.log('获取世界排行数据???');
        Http.send({
            url: Http.UrlConfig.GET_RANK_LIST,
            success: (resp) => {
                console.log("getWorldList response == ", resp);
                this.createTotalRankNode(resp.data,resp.metop,resp.metopvalue);
            },
            data: {
                uid: UserManager.user_id,
                voucher:UserManager.voucher,
            }
        });
    }

    doBanner(){
        this.unschedule(this.refreshBanner.bind(this));
        this.schedule(this.refreshBanner.bind(this),GameCtr.setting.advTime);
    }


    startFight(){
        // if(!WXCtr.authed){
        //     let authTip=this.node.getChildByName("authTip");
        //     authTip.setLocalZOrder(60);
        //     authTip.active=true;
        //     WXCtr.createUserInfoBtn();
        //     WXCtr.onUserInfoBtnTap(this.hideAuthTip.bind(this));
        //     return;
        // }
        if( GameCtr.powerValue>0){
            cc.director.loadScene("Game");
            GameCtr.powerValue--;
            localStorage.setItem("powerInfo",JSON.stringify({day:Util.getCurrTimeYYMMDD(),powerValue:GameCtr.powerValue}))
        }else{
            if(!GameCtr.isAudited){
                GameCtr.getInstance().getStart().showToast("没有体力值");
                return;
            }
            this.createMorePowerNode();
        }
    }

    initCurrentRole(){
        let roleHead=this.btnsNode.getChildByName("mask").getChildByName("headImg");
        cc.loader.loadRes("textures/role_"+GameCtr.roleIndex, cc.SpriteFrame,  (err, spriteFrame)=> {
            roleHead.getComponent(cc.Sprite).spriteFrame=spriteFrame;
        });
    }

    hideAuthTip(){
        let authTip=this.node.getChildByName("authTip");
        authTip.active=false;
    }

    showGameCount(){
        let lb_gameCount=this.btnsNode.getChildByName("btn_gameCount").getChildByName("lb_gameCount");
        lb_gameCount.getComponent(cc.Label).string=GameCtr.powerValue+"/10";
    }

    refreshMoreNewGame(){
        if(!GameCtr.isAudited){return;}
        if(!GameCtr.setting.nav.banner||GameCtr.setting.nav.banner<=0){return;}
        if(!this.adNode){return}
        this.adNode.active=true;
        
        for(let i=0;i<GameCtr.setting.nav.banner.length;i++){
            if(i>=4)return;
            let ad=cc.instantiate(this.ad);
            ad.parent=this.adNode;
            ad.scale=1.0;
            ad.getComponent("ad").init(GameCtr.setting.nav.banner[i]);
            ad.y=-15;
            if(i==0)ad.x=-292;
            if(i==1)ad.x=-97;
            if(i==2)ad.x=96;
            if(i==3)ad.x=292; 
        }
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

    refreshBanner(){
        WXCtr.setBannerAd(300,100);
        this.unschedule(this.refreshBanner.bind(this));
        this.scheduleOnce(this.refreshBanner.bind(this),GameCtr.setting.advTime)
    }
}
