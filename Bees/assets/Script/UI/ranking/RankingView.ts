//排行榜界面

import RankingCell from "./RankingCell";
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
import Http from "../../Common/Http";
import UserManager from "../../Common/UserManager";

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

    private worldListData=[];

    private tex = null;
    private isGetWorldList = false;
    private isGetFriendList = false;
    
    onLoad() {
        GameCtr.getInstance().setRanking(this);
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

        console.log('show-------back-----');
        this.showAuthTip(false);
        this.isGetFriendList = false;
        WXCtr.closeFriendRanking();
        GameCtr.gotoScene("Game");
    }

    //显示世界排行
    showWorldRanking() {
        console.log('点击了世界排行榜');
        this.ndWorldScr.active = true;
        this.sprFreindRankScroll.node.active = false;
        if (!WXCtr.authed) {
            console.log("未授权，引导获取授权！！！");
            this.showAuthTip(true);
            return;
        }
        if (!this.isGetWorldList) {
            this.getWorldRankingData(1);
        }
    }

    //
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
        this.worldListData=list;
    }

    showWorldList(index){
        this.ndWorldContent.removeAllChildren();
        let startIndex=index*7;
        let endIndex=(index*7+7)>this.worldListData.length?this.worldListData.length:(index*7+7)
        for(let i=index*7;i<endIndex;i++){
            let nd = cc.instantiate(this.pfCell);
            this.ndWorldContent.addChild(nd);
            let rankingCell: RankingCell = nd.getComponent(RankingCell);
            let data = this.worldListData[i];
            rankingCell.setData(i, data);
        }
        // for (let i in this.worldListData) {
            
        //     let nd = cc.instantiate(this.pfCell);
        //     this.ndWorldContent.addChild(nd);
        //     let rankingCell: RankingCell = nd.getComponent(RankingCell);
        //     let data = list[i];
        //     rankingCell.setData(i, data);
        // }
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
        if (!this.isGetFriendList) {
            this.isGetFriendList = true;
            WXCtr.showFriendRanking();
        }
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