
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
    private place_1 = null;
    private place_2 = null;
    private place_3 = null;
    private title=null;
    private rankContent =null;
    private selfRankInfoNode=null;
    private first2ThirdArr=[];
    private worldRankData=null;
    private selfRank=null;
    private selfChickenValue=null;

    private authTipNode=null;
    private rankNode=null;

    onLoad(){
        this.initNode();
        this.adaptScreen();
        GameCtr.getInstance().addListener("getSelfInfoSuccess1",this.initSelfRankInfo.bind(this));
    }


    initNode(){
        this.place_1=this.node.getChildByName("place_1");
        this.place_2=this.node.getChildByName("place_2");
        this.place_3=this.node.getChildByName("place_3");
        this.btn_back=this.node.getChildByName("btn_back");
        this.authTipNode=this.node.getChildByName("authTip");
        this.title=this.node.getChildByName("title");
        this.rankNode=this.node.getChildByName("rankNode");
        this.selfRankInfoNode=this.node.getChildByName("selfRankInfoNode");
        this.rankContent=this.node.getChildByName("rankNode").getChildByName("scrollView").getChildByName("view").getChildByName("content");

        this.place_1.setLocalZOrder(10);
        this.place_2.setLocalZOrder(10);
        this.place_3.setLocalZOrder(10);

        this.first2ThirdArr.push(this.place_1);
        this.first2ThirdArr.push(this.place_2);
        this.first2ThirdArr.push(this.place_3);

        this.place_1.active=false;
        this.place_2.active=false;
        this.place_3.active=false;
        this.title.active=false;
        this.rankNode.active=false;
        this.selfRankInfoNode.active=false;

        
        this.btn_back.on(cc.Node.EventType.TOUCH_END,function(e){
            AudioManager.getInstance().playSound("audio/btnCick");
            this.close();
        }.bind(this))
    }

    adaptScreen(){
        let visibleSize=cc.director.getVisibleSize();
        this.place_1.y=visibleSize.height/2-250;
        this.place_2.y=visibleSize.height/2-310;
        this.place_3.y=visibleSize.height/2-310;
        this.title.y=visibleSize.height/2-410;
        this.btn_back.y=visibleSize.height/2-200;
        this.selfRankInfoNode.y=-visibleSize.height/2;

        let rankNode=this.node.getChildByName("rankNode");
        rankNode.y=visibleSize.height/2-600;
    }

    init(){
        this.place_1.active=true;
        this.place_2.active=true;
        this.place_3.active=true;
        this.title.active=true;
        this.rankNode.active=true;
        this.selfRankInfoNode.active=true;
        this.authTipNode.active=false;

        this.initRank();
        this.initFirst2ThirdHead();
        this.initSelfRankInfo();
    }

    initData(totalRank,selfRank,selfChickenValue){
        this.worldRankData=totalRank;
        this.selfRank=selfRank;
        this.selfChickenValue=selfChickenValue;
    }

    initFirst2ThirdHead(){
        for(let i in this.worldRankData){
            if(Number(i)-1==3){return};
            let head= cc.instantiate(this.headPrefab);
            head.parent=this.first2ThirdArr[Number(i)-1];
            head.active=true;
            head.y=-40;
            head.scale=Number(i)-1>0?0.85:1;
            head.getComponent("head").setHead(this.worldRankData[i].Icon);
        }
    }

    initRank(){
        this.rankContent.setContentSize(cc.size(1080,200*10+400));
        for(let i in this.worldRankData){
            let rankItem=cc.instantiate(this.otherRankItem)
            rankItem.parent=this.rankContent
            rankItem.y=-200*Number(i)+100;
            rankItem.getComponent("otherRank").setName(Util.cutstr(this.worldRankData[i].nick,10));
            rankItem.getComponent("otherRank").setCity(this.worldRankData[i].City);
            rankItem.getComponent("otherRank").setRank(this.worldRankData[i].top);
            rankItem.getComponent("otherRank").setChickenCount(this.worldRankData[i].value);
            rankItem.getComponent("otherRank").setHeadImg(this.worldRankData[i].Icon);
        }
    }

    initSelfRankInfo(){
        let selfInfo=GameCtr.getInstance().getSelfInfoFromLocal();
        if(!selfInfo){
            return;
        }
        this.selfChickenValue=!this.selfChickenValue?0:this.selfChickenValue;
        let selfRankInfoNode=this.node.getChildByName("selfRankInfoNode");
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
}
