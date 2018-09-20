//排行榜界面

import RankingCell from "./RankingCell";
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
import Http from "../../Common/Http";
import UserManager from "../../Common/UserManager";
import AudioManager from "../../Common/AudioManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class RankingView extends cc.Component {
    @property(cc.Node)
    ndRanking: cc.Node = null
    @property(cc.Sprite)
    sprFreindRankScroll: cc.Sprite = null;
    @property(cc.Node)
    ndWorldScr: cc.Node = null;
    @property(cc.Node)
    ndWorldContent: cc.Node = null;
    @property(cc.Prefab)
    pfCell: cc.Prefab = null;
    @property(cc.Toggle)
    friendToggle: cc.Toggle = null;
    @property(cc.Toggle)
    worldToggle: cc.Toggle = null;
    @property(cc.Node)
    ndAuthTip: cc.Node = null;
    @property(cc.Node)
    btn_pageUp :cc.Node=null;
    @property(cc.Node)
    btn_pageDown:cc.Node=null;
    @property(cc.Node)
    btn_share :cc.Node=null;
    @property(cc.Node)
    btn_joinRank:cc.Node=null;


    @property(cc.Sprite)
    headImg :cc.Sprite=null;
    @property(cc.Label)
    lb_name:cc.Label=null;
    @property(cc.Label)
    lb_location:cc.Label=null;

    private worldListData=[];
    private friendListData=null;
    private tex = null;
    private isGetWorldList = false;
    private isGetFriendList = false;
    private curPageIndex=0;

    onLoad() {
        GameCtr.getInstance().setRanking(this);
        this.friendListData=WXCtr.getFriendData();
        console.log("log---------------this.friendListData=:",this.friendListData);

        if(this.friendListData && this.friendListData.length>=2){
            for(let i =0;i<this.friendListData.length;i++){
                for(let j=i+1;j<this.friendListData.length;j++){
                    if(Number(this.friendListData[i].KVDataList[1].value)<Number(this.friendListData[j].KVDataList[1].value)){
                        let temp=this.friendListData[i];
                        this.friendListData[i]=this.friendListData[j];
                        this.friendListData[j]=temp;
                    }
                }
            }
        }
    }

    start() {
        this.initRank();
        this.initSelfInfo();
    }

    //初始化界面
    initRank() {
        if (this.friendToggle.isChecked) {
            this.showFreindRanking();
        } else if (this.worldToggle.isChecked) {
            this.showWorldRanking();
        }
    }

    initSelfInfo(){
        if(UserManager.user){
            this.loadImg(this.headImg,UserManager.user.icon);
            this.lb_name.string=UserManager.user.nick;
            this.lb_location.string=UserManager.user.city;
        }
    }

    //返回结束
    back() {
        AudioManager.getInstance().playSound("audio/btnClose");
        this.showAuthTip(false);
        this.isGetFriendList = false;
        this.node.parent.destroy();
    }

    //显示世界排行
    showWorldRanking() {
        console.log('点击了世界排行榜');
        this.ndWorldScr.active = true;
        this.sprFreindRankScroll.node.active = false;
        if (!WXCtr.authed) {
            console.log("未授权，引导获取授权！！！");
            this.btn_joinRank.active=true; 
        }else{
            this.btn_joinRank.active=false; 
        }
        if (!this.isGetWorldList) {
            this.getWorldRankingData();
        }
    }

    onBtnPageUp(){
        AudioManager.getInstance().playSound("audio/open_panel");
        if(this.curPageIndex==0){return}
        this.curPageIndex--
        if(this.ndWorldScr.active){
            this.showRanklist(this.ndWorldScr,this.worldListData,this.curPageIndex);
        }

        if(this.sprFreindRankScroll.node.active){
            this.showRanklist(this.sprFreindRankScroll.node,this.friendListData,this.curPageIndex);
        }
        
    }

    onBtnPageDown(){
        AudioManager.getInstance().playSound("audio/open_panel");
        if(this.ndWorldScr.active){
            if((this.curPageIndex+1)*7>=this.worldListData.length){return;}
        }
        if(this.sprFreindRankScroll.node.active){
            if((this.curPageIndex+1)*7>=this.friendListData.length){return;}
        }
        
        this.curPageIndex++
        if(this.ndWorldScr.active){
            this.showRanklist(this.ndWorldScr,this.worldListData,this.curPageIndex);
        }

        if(this.sprFreindRankScroll.node.active){
            this.showRanklist(this.sprFreindRankScroll.node,this.friendListData,this.curPageIndex);
        }
    }

    onBtnJoinRank(){
        AudioManager.getInstance().playSound("audio/open_panel");
        this.showAuthTip(true);
    }

    onBtnShare(){
        AudioManager.getInstance().playSound("audio/open_panel");
        WXCtr.share();
    }

    showRanklist(parent,rankList,index=0){
        this.curPageIndex=index;
        parent.removeAllChildren();
        let startIndex=index*7;
        let endIndex=(index*7+7)>rankList.length?rankList.length:(index*7+7);
        for(let i=startIndex;i<endIndex;i++){
            let off_y=i%7>=3?-35:0;
            let nd = cc.instantiate(this.pfCell);
            parent.addChild(nd);
            nd.x=2;
            nd.y=530+(i%7)*(-132)+off_y;
            let rankingCell: RankingCell = nd.getComponent(RankingCell);
            rankingCell.setData(i+1, rankList[i]);
        }
    }

    showAuthTip(isShow = false) {
        this.ndAuthTip.active = isShow;
        if(isShow) {
            WXCtr.userInfoBtn.show();
        }else{
            WXCtr.userInfoBtn.hide();
        }
    }

    //获取世界排行数据
    getWorldRankingData() {
        Http.send({
            url: Http.UrlConfig.GET_RANK_LIST,
            success: (resp) => {
                console.log("getWorldList response == ", resp);
                this.isGetWorldList = true;
                this.setWorldList(resp.data);
            },
            data: {
                uid: UserManager.user_id,
                voucher:UserManager.voucher,
            }
        });
    }

    //设置世界排行
    setWorldList(list) {
        for(let i in list){
            this.worldListData.push(list[i])
        }
        this.showRanklist(this.ndWorldScr,this.worldListData,0);
    }

    //设置世界排行自己数据
    setSelfWorldData(rank, data) {
        let nd = this.ndWorldScr.getChildByName("SelfRanking");
        nd.active = true;
        let rankingCell: RankingCell = nd.getComponent(RankingCell);
        rankingCell.setData(rank, data);
    }

    //显示好友排行
    showFreindRanking() {
        this.sprFreindRankScroll.node.active = true;
        this.ndWorldScr.active = false;
        this.showAuthTip(false);
        this.showRanklist(this.sprFreindRankScroll.node,this.friendListData,0);
    }

    loadImg(spr, imgUrl) {
        console.log("log--------imgUrl=:",imgUrl);
        if(!imgUrl||imgUrl==""){return;}
        cc.loader.load({
            url: imgUrl,
            type: 'jpg'
        }, (err, texture) => {
            spr.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    //关闭世界排行
    onCloseRank() {
        this.ndRanking.active = false;
    }

};