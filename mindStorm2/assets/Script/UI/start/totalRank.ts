
import Util from "../../Common/Util";
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
import AudioManager from '../../Common/AudioManager'
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    headPrefab:cc.Prefab;

    @property(cc.Prefab)
    otherRankItem:cc.Prefab;
    private btn_back = null;
    private title=null;
    private rankContent =null;
    private selfRankInfoNode=null;
    private worldRankData=null;
    private selfRank=null;
    private selfChickenValue=null;
    private authTipNode=null;
    private rankNode=null;
    private btn_worldRank=null;
    private btn_friendsRank=null;
    private worldRankNode=null;
    private friendsRankNode=null;

    private tex = null;

    onLoad(){
        this.initNode();
        this.adaptScreen();
        GameCtr.getInstance().addListener("getSelfInfoSuccess1",this.initSelfRankInfo.bind(this));
        WXCtr.showFriendRank();
    }

    start(){
        this.tex=new cc.Texture2D();
        window.sharedCanvas.width = 1080;
        window.sharedCanvas.height = 1920;
    }


    initNode(){
        this.worldRankNode=this.node.getChildByName("worldRankNode");
        this.friendsRankNode=this.node.getChildByName("friendsRankNode");
        this.btn_back=this.node.getChildByName("btn_back");
        this.authTipNode=this.node.getChildByName("authTip");
        this.title=this.node.getChildByName("title");
        this.btn_worldRank=this.title.getChildByName("btn_worldRank");
        this.btn_friendsRank=this.title.getChildByName("btn_friendsRank");

        this.worldRankNode.active=true;
        this.friendsRankNode.active=false;
        this.title.active=false;
        this.btn_worldRank.getComponent(cc.Button).interactable=false;
        this.btn_friendsRank.getComponent(cc.Button).interactable=true;

        this.initBtnEvent(this.btn_back);
        this.initBtnEvent(this.btn_worldRank);
        this.initBtnEvent(this.btn_friendsRank);

        this.initWorldRankNode();
    }

    initWorldRankNode(){

        this.rankNode=this.worldRankNode.getChildByName("rankNode");
        this.selfRankInfoNode=this.worldRankNode.getChildByName("selfRankInfoNode");
        this.rankContent=this.rankNode.getChildByName("scrollView").getChildByName("view").getChildByName("content");

        this.rankNode.active=false;
        this.selfRankInfoNode.active=false;
    }


    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/btnCick");
            if(e.target.getName()=="btn_back"){
                this.close();
            }else if(e.target.getName()=="btn_worldRank"){
                this.worldRankNode.active=true;
                this.friendsRankNode.active=false;
                this.btn_worldRank.getComponent(cc.Button).interactable=false;
                this.btn_friendsRank.getComponent(cc.Button).interactable=true;
            }else if(e.target.getName()=="btn_friendsRank"){
                this.worldRankNode.active=false;
                this.friendsRankNode.active=true;
                this.btn_worldRank.getComponent(cc.Button).interactable=true;
                this.btn_friendsRank.getComponent(cc.Button).interactable=false;
            }
        })
    }

    adaptScreen(){
        let visibleSize=cc.director.getVisibleSize();

        this.title.y=visibleSize.height/2-410;
        this.btn_back.y=visibleSize.height/2-200;
        this.selfRankInfoNode.y=-visibleSize.height/2;

        let rankNode=this.worldRankNode.getChildByName("rankNode");
        rankNode.y=visibleSize.height/2-600;
    }

    init(){
        this.title.active=true;
        this.rankNode.active=true;
        this.selfRankInfoNode.active=true;
        this.authTipNode.active=false;
        this.initSelfRankInfo();
        this.initRank();
    }

    initData(totalRank,selfRank,selfChickenValue){
        this.worldRankData=totalRank;
        this.selfRank=selfRank;
        this.selfChickenValue=selfChickenValue;
    }

    initRank(){
        let rankLength=0;
        for (let i in this.worldRankData){
            rankLength++;
        }
        this.rankContent.setContentSize(cc.size(1080,200*rankLength+400));
        for(let i in this.worldRankData){
            let rankItem=cc.instantiate(this.otherRankItem)
            rankItem.parent=this.rankContent
            rankItem.y=-200*Number(i)+100;
            rankItem.getComponent("otherRank").setName(Util.cutstr(this.worldRankData[Number(i)].nick,6));
            rankItem.getComponent("otherRank").setCity(this.worldRankData[Number(i)].City);
            rankItem.getComponent("otherRank").setRank(this.worldRankData[Number(i)].top);
            rankItem.getComponent("otherRank").setChickenCount(this.worldRankData[Number(i)].value);
            rankItem.getComponent("otherRank").setHeadImg(this.worldRankData[Number(i)].Icon);
        }
    }

    initSelfRankInfo(){
        let selfInfo=GameCtr.getInstance().getSelfInfoFromLocal();
        if(!selfInfo){
            return;
        }
        this.selfChickenValue=!this.selfChickenValue?0:this.selfChickenValue;
        let selfRankInfoNode=this.worldRankNode.getChildByName("selfRankInfoNode");
        let lb_name=selfRankInfoNode.getChildByName("lb_name");
        let lb_city=selfRankInfoNode.getChildByName("lb_city");
        let lb_rank=selfRankInfoNode.getChildByName("lb_rank");
        let lb_chickenCount=selfRankInfoNode.getChildByName("lb_chickenCount");
        let headImg=selfRankInfoNode.getChildByName("mask").getChildByName("headImg");

        let rankStr=this.selfRank==0?"无排名":this.selfRank+""
        
        lb_name.getComponent(cc.Label).string = Util.cutstr(selfInfo.nickName,10);
        lb_city.getComponent(cc.Label).string = selfInfo.province;
        lb_rank.getComponent(cc.Label).string = rankStr;
        lb_chickenCount.getComponent(cc.Label).string = this.selfChickenValue;
        this.loadHeadImg(headImg,selfInfo.avatarUrl)
    }

    loadHeadImg(headNode:cc.Node,headUrl:string){
        let sp=headNode.getComponent(cc.Sprite);
        cc.loader.load({
            url: headUrl,
            type: 'png'
        }, (err, texture) => {
            sp.spriteFrame = new cc.SpriteFrame(texture);
        });
    }



    showAuthTip(){
        this.authTipNode.active=true;
        WXCtr.createUserInfoBtn();
        WXCtr.onUserInfoBtnTap(this.init.bind(this));
    }

    close(){
        GameCtr.getInstance().removeListener("getSelfInfoSuccess1");
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2,0),
            cc.callFunc(function(){
                this.node.destroy();
            }.bind(this))
        ))
    }

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined && this.tex != null && this.friendsRankNode.active ) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.friendsRankNode.getComponent(cc.Sprite).spriteFrame= new cc.SpriteFrame(this.tex);
        }
    }
    update() {
        this._updateSubDomainCanvas();
    }
}
