//排行榜界面

import RankingCell from "./RankingCell";
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
import Http from "../../Common/Http";
import UserManager from "../../Common/UserManager";
import { UILoader } from "../../Common/UILoader";

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
        // if (this.friendToggle.isChecked) {
        //     this.showFreindRanking();
        // } else if (this.worldToggle.isChecked) {
        //     this.showWorldRanking();
        // }

        this.showWorldRanking();
    }

    //返回结束
    back() {
        this.showAuthTip(false);
        this.isGetFriendList = false;
        WXCtr.closeFriendRanking();
        GameCtr.gotoScene(GameCtr.rankingEntrance);
    }

    //显示世界排行
    showWorldRanking() {
        console.log('点击了世界排行榜');
        this.ndWorldScr.active = true;
        this.sprFreindRankScroll.node.active = false;
        if (!WXCtr.wxLoginSuccess) {
            console.log("未授权，引导获取授权！！！");
            this.showAuthTip(true);
            return;
        }
        if (!this.isGetWorldList) {
            this.getWorldRankingData();
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
    getWorldRankingData() {
        console.log('获取世界排行数据???');
        Http.send({
            url: Http.UrlConfig.GET_RANK_LIST,
            success: (resp) => {
                console.log("getWorldList response == ", resp);
                this.isGetWorldList = true;
                this.setWorldList(resp.data,resp.metop,resp.metopvalue);
            },
            data: {
                uid: UserManager.user_id,
                voucher:UserManager.voucher,
            }
        });
    }

    //设置世界排行
    setWorldList(worldRanks,selfRank,selfChickenValue) {
        UILoader.loadRes("prefab/totalRank", cc.Prefab, (prefab) => {
            UILoader.instantiate(prefab, this.node, (node) => {
                node.getComponent("totalRank").init(worldRanks,selfRank,selfChickenValue)
            });
        });

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