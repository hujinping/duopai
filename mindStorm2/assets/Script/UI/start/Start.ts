/**
 * 开始界面
 * 如果有与现有不一样的需求自己拓展实现
 */
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
import ViewManager from "../../Common/ViewManager";
import { MemoryDetector } from "../../Common/MemoryDetector";
import {UILoader} from "../../Common/UILoader";
import Util from "../../Common/Util";
import UserManager from "../../Common/UserManager";
import Http from "../../Common/Http";
import AudioManager from '../../Common/AudioManager'
import ToastView from "../view/ToastView";


const { ccclass, property } = cc._decorator;
enum Direction{
    LEFT,
    RIGHT,
}

@ccclass
export default class Start extends cc.Component {

    @property(cc.Prefab)
    roleCard_1: cc.Prefab = null; 

    @property(cc.Prefab)
    roleCard_2: cc.Prefab = null; 

    @property(cc.Prefab)
    roleCard_3: cc.Prefab = null; 

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
    
    private totalRankNode=null;
    private sliderData = null;
    private roleListEventMask=null;
    private roleListArrowLeft=null;
    private roleListArrowRight=null;
    private lb_roleIndex=null;
    private mask_up=null;
    private mask_down=null;
    private btnsNode=null;
    private tex = null;
    private friendRankNode=null;
    private curRoleCardIndex=2;
    private roleCardDistance=500;
    private roleCardBoundary=1000;
    private lastClickTime=-1;
    private roleCardList=[];
    private roleCardInfoList=[];

    onLoad() {
        GameCtr.getInstance().setStart(this);
        this.initCurrentRoleIndex();
        this.initNode();
        this.initEvent();
        this.initSelfInfo();
        AudioManager.getInstance().playMusic("audio/gameMusic");
    }

    start() {
        WXCtr.getFriendRankingData();                   //获取好友排行榜数据
        this.showGameCount();
        //this.lb_roleIndex.getComponent(cc.Label).string=(GameCtr.roleTag+1)%3+1+"/3";

        if(window.wx != undefined){
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 900;
            window.sharedCanvas.height = 1200;
        }
    }

    //开始游戏
    startGame() {
        GameCtr.startGame();
    }

    initCurrentRoleIndex(){
        
    }

    initNode(){
        this.mask_up=this.node.getChildByName("mask_up");
        this.mask_down=this.node.getChildByName("mask_down");
        this.btnsNode=this.node.getChildByName("btnsNode");
        this.friendRankNode=this.node.getChildByName("friendRankNode");

        this.btnsNode.active=false;
        this.friendRankNode.active=false;

        this.roleCardList.push(this.roleCard_1);
        this.roleCardList.push(this.roleCard_2);
        this.roleCardList.push(this.roleCard_3);
        this.initBtnsNode();
    }

    initBtnsNode(){
        let btn_start=this.btnsNode.getChildByName("btn_start");
        let btn_role=this.btnsNode.getChildByName("roleFrame");
        let btn_invite=this.btnsNode.getChildByName("btn_invite");
        let btn_signIn=this.btnsNode.getChildByName("btn_signIn");
        let btn_morePower=this.btnsNode.getChildByName("btn_gameCount");
        let btn_totalRank=this.btnsNode.getChildByName("btn_totalRank");
        let btn_gameEntrance1=this.btnsNode.getChildByName("btn_gameEntrance1");
        let btn_gameEntrance2=this.btnsNode.getChildByName("btn_gameEntrance2");
        
        let btn_head=this.node.getChildByName("mask_up").getChildByName("headNode").getChildByName("headFrame");

        this.initBtnsListener(btn_start);
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
                this.createMorePowerNode();
            }else if(btnName=="btn_start"){
                this.startFight();
            }else if(btnName=="headFrame"){
                this.creatSelfInfoNode();
            }else if(btnName=="arrow_left"){
                this.updateRoleCardPos(Direction.RIGHT);
            }else if(btnName=="arrow_right"){
                this.updateRoleCardPos(Direction.LEFT);
            }else if(btnName=="btn_invite"){
                this.createInviteNode();
                //console.log("log--------btn_invite  click");
            }else if(btnName=="btn_signIn"){
                this.createSignInNode();
            }else if(btnName=="btn_gameEntrance1"){
                console.log("log--------btn_gameEntrance1  click");
            }else if(btnName=="btn_gameEntrance2"){
                console.log("log--------btn_gameEntrance2  click");
            }else if(btnName=="roleFrame"){
                this.createRoleSeleteNode();
            }

        }.bind(this))
    }

    

    initSelfInfo(){
        let selfInfo=GameCtr.getInstance().getSelfInfoFromLocal();
        if(!selfInfo){return;}
        let headNode=this.mask_up.getChildByName("headNode");
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
        let btn_head=this.node.getChildByName("mask_up").getChildByName("headNode").getChildByName("headFrame")
        let infoNode=cc.instantiate(this.selfInfoPrefab);
        infoNode.parent=this.mask_up;
        let selfInfo=GameCtr.getInstance().getSelfInfoFromLocal();
        infoNode.getComponent("selfInfo").setID("用户ID:"+UserManager.user_id);
        infoNode.getComponent("selfInfo").setName(selfInfo.nickName);

        infoNode.getComponent("selfInfo").setGameCount("场次:"+GameCtr.joinGameCount);
        infoNode.getComponent("selfInfo").setChickenCount(GameCtr.chickenCount);

        infoNode.x=btn_head.x;
        infoNode.y=btn_head.y-350;
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


    initEvent(){
        GameCtr.getInstance().addListener("showStartFullly",this.onShowStartFullly.bind(this));
        GameCtr.getInstance().addListener("getSelfInfoSuccess",this.onGetSelfInfoSuccess.bind(this));
        GameCtr.getInstance().addListener("morePowerSuccess1",this.showGameCount.bind(this))
    }

    onShowStartFullly(){
        this.mask_up.runAction(cc.moveBy(0.5,cc.p(0,650)));
        this.mask_down.runAction(cc.sequence(
            cc.moveBy(0.5,cc.p(0,-150)),
            cc.callFunc(function(){
                // this.btnsNode.setLocalZOrder(1);
                this.showBtnNodeAction();
                //this.playRoleCardAction();
            }.bind(this))
        ));
    }

    onGetSelfInfoSuccess(){
        this.initSelfInfo();
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

    showBtnNodeAction(){
        this.btnsNode.active=true;

        let btn_start=this.btnsNode.getChildByName("btn_start");
        btn_start.scale=1.2;
        btn_start.runAction(cc.scaleTo(0.2,1.0)); 
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


    startFight(){
        if(!WXCtr.authed){
            let authTip=this.node.getChildByName("authTip");
            authTip.setLocalZOrder(60);
            authTip.active=true;
            WXCtr.createUserInfoBtn();
            WXCtr.onUserInfoBtnTap(this.hideAuthTip.bind(this));
            return;
        }

        if( GameCtr.powerValue>0){
            cc.director.loadScene("Game");
            GameCtr.powerValue--;
        }else{
            if(!GameCtr.isAudited){
                ViewManager.toast("没有体力值");
                return;
            }
            this.createMorePowerNode();
        }
    }

    hideAuthTip(){
        let authTip=this.node.getChildByName("authTip");
        authTip.active=false;
    }

    showGameCount(){
        let lb_gameCount=this.btnsNode.getChildByName("btn_gameCount").getChildByName("lb_gameCount");
        lb_gameCount.getComponent(cc.Label).string=GameCtr.powerValue+"/10";
    }

      // 刷新子域的纹理
      _updateSubDomainCanvas(){
        if (window.sharedCanvas != undefined && this.tex != null ) {//&& this.ndRanking.active && this.sprFreindRankScroll.node.active
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            //this.sprFreindRankScroll.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    }

    update () {
        this._updateSubDomainCanvas()
    }
}
