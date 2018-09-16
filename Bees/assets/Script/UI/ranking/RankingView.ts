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

    private worldListData=[];
    private friendListData=null;
    private tex = null;
    private isGetWorldList = false;
    private isGetFriendList = false;
    private curPageIndex=0;

    onLoad() {
        GameCtr.getInstance().setRanking(this);
        this.friendListData=WXCtr.getFriendData();
        console.log("log-------this.friendListData=:",this.friendListData);
    }

    start() {
        if(window.wx != undefined){
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 900;
            window.sharedCanvas.height = 1200;
        }
        this.initRank();
    }

    //初始化界面
    initRank() {
        if (this.friendToggle.isChecked) {
            this.showFreindRanking();
        } else if (this.worldToggle.isChecked) {
            this.showWorldRanking();
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
            this.getWorldRankingData(1);
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
    getWorldRankingData(page) {
        Http.send({
            url: Http.UrlConfig.GET_RANK_LIST,
            success: (resp) => {
                console.log("getWorldList response == ", resp);
                this.isGetWorldList = true;
                this.setWorldList(resp.data);
                //this.setSelfWorldData(resp.data.user_record.sort - 1, resp.data.user_record);
            },
            data: {
                uid: UserManager.user_id,
                voucher:UserManager.voucher,
            }
        });
    }

    //设置世界排行
    setWorldList(list) {
        console.log("worldRankingList == ", list);
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

     //关闭世界排行
     onCloseRank() {
        this.ndRanking.active = false;
    }



    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined && this.tex != null && this.ndRanking.active && this.sprFreindRankScroll.node.active) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.sprFreindRankScroll.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    }
    update() {
        this._updateSubDomainCanvas();
    }
};