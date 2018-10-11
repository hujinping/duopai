import Http from "../Common/Http";
import UserManager from "../Common/UserManager";
import WXCtr from "./WXCtr";
import GameCtr from "./GameCtr";
import ViewManager from "../Common/ViewManager";
import Util from "../Common/Util";

/**
 * 所有Http请求统一控制
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class HttpCtr {

    //登录游戏
    static login(code) {
        console.log("log------------HttpCtr-----LoginCode=:",code);
        Http.send({
            url: Http.UrlConfig.LOGIN,
            
            success: (resp) => {
                if (resp.ret == 1) {
                    UserManager.user_id = resp.data.uid;
                    UserManager.voucher = resp.data.voucher
                    HttpCtr.getUserInfo();
                    HttpCtr.getSettingConfig();
                    WXCtr.getUserInfo();
                   
                    if (WXCtr.launchOption.query) {
                        HttpCtr.invitedByFriend(WXCtr.launchOption.query);
                        HttpCtr.chanelCheck(WXCtr.launchOption.query);
                    }
                }
            },
            data: {
                code: code
            }
        });

    }



    //获取分享配置
    static getShareConfig() {
        Http.send({
            url: Http.UrlConfig.GET_SHARE,
            success: (resp) => {
                console.log("获取分享配置信息", resp);
                WXCtr.shareTitle = resp.data.share_title;
                WXCtr.shareImg = resp.data.share_img;
                WXCtr.setShareAppMessage();
            },
            data: {
                share_type: "index",
            }
        });
    }

    //获取个人信息
    static getUserInfo(callBack = null) {
        Http.send({
            url: Http.UrlConfig.GET_USERINFO,
            success: (resp) => {
                if (resp.success == Http.Code.OK) {
                    console.log("log-----------getUserInfo=:",resp);
                    UserManager.user = resp.user;
                    GameCtr.chickenCount=resp.user.Sum;
                    GameCtr.chickenCount=resp.user.Sum==false?0:GameCtr.chickenCount;
                    GameCtr.joinGameCount=resp.user.SumLog;
                    GameCtr.money=resp.user.money;
                    GameCtr.getInstance().getStart().initSelfInfo();
                    if (callBack) {
                        callBack(resp.user);
                    }
                }
            },
            
            data: {
                uid: UserManager.user_id,
                voucher:UserManager.voucher
            }
        });
    }

    //保存自己的信息（头像，昵称等）到服务器
    static saveUserInfo(data) {
        console.log("log---------------saveUserInfo-----  data=:",data);
        Http.send({
            url: Http.UrlConfig.SET_USER_DATA,
            data:
                {
                    uid: UserManager.user_id,
                    voucher: UserManager.voucher,
                    encryptedData: data.encryptedData,
                    iv: data.iv
                },
            success: () => {
                console.log("log-----------------上传信息成功------------");
            }
        });
    }

    //渠道验证
    static chanelCheck(query) {
        Http.send({
            url: Http.UrlConfig.CHANEL_RECORD,
            data: {
                uid:UserManager.user_id,
                voucher: UserManager.voucher,
                channel_id: query.channel_id,
            },
            success: (resp) => {
                console.log("渠道验证成功", resp);
            }
        });
    }


    static getSettingConfig(){
        Http.send({
            url: Http.UrlConfig.GET_SETTING,
            success: (resp) => {
                console.log("获取游戏配置=：", resp);
                GameCtr.isAudited=resp.ok;
                GameCtr.setting=resp;
                GameCtr.getInstance().getStart().doBanner();
                GameCtr.getInstance().getStart().refreshMoreNewGame();
                let vedioInfo=localStorage.getItem("VideoTimes");
                if(!vedioInfo ){
                    GameCtr.vedioTimes=GameCtr.setting.advSum;
                }else {
                    let obj=JSON.parse(vedioInfo);
                    if(obj.day!=Util.getCurrTimeYYMMDD()){
                        GameCtr.vedioTimes=GameCtr.setting.advSum;
                    }else{
                        GameCtr.vedioTimes=obj.times;
                    }
                }
            }
        });
    }

    //视频渠道验证
    static videoCheck(query) {
        Http.send({
            url: Http.UrlConfig.VideoOpen,
            data: {
                user_id: UserManager.user_id,
                channel_id: query.channel_id,
                cuid: query.cuid,
                cvoucher: query.cvoucher,
                cid: query.cid,
                pid: query.pid
            }
        });
    }

    //分享到群检测
    static shareGroupCheck(encryptedData, iv, callback) {
        Http.send({
            url: Http.UrlConfig.SHARE_GROUP,
            data: {
                user_id: UserManager.user_id,
                encrypted_data: encryptedData,
                iv: iv
            },
            success: (resp) => {
                if (resp.ret == 1) {
                    if (callback) {
                        callback();
                    }
                } else if (resp.ret == 0) {
                    //ViewManager.toast(resp.msg);
                }
            }
        });
    }
    
    // 获取广告配置
    static getAdConfig() {
        Http.send({
            url: Http.UrlConfig.ADConfig,
            success: (res) => {
                console.log("获取广告配置", res);
                WXCtr.setVideoAd();
                if (res.data.advid) {
                    WXCtr.bannerId = res.data.advid;
                    WXCtr.setBannerAd(100,300);
                }
            },
            data: {
                uid: UserManager.user_id,
                voucher: UserManager.voucher
            }
        });
    }

     // 邀请好友
     static invitedByFriend(query) {
        console.log("log----------被好友邀请--inviteID=:",query);
        Http.send({
            url: Http.UrlConfig.INVITED_BY_FRIEND,
            success: () => {},
            data: {
                uid: UserManager.user_id,
                voucher: UserManager.voucher,
                touid: query.invite
            }
        });
    }

    //邀请好友结果
    static getInviteResult(callback = null) {
        Http.send({
            url: Http.UrlConfig.SEEK_LOG,
            success: (res)=>{
                console.log('log-----------邀请好友结果-=:', res);
                if (callback) {
                    callback(res.data);
                }
            },
            data: {
                uid: UserManager.user_id,
                voucher: UserManager.voucher,
            }
        });
    }

    //获取等多游戏导航信息
    static getNevigatorData() {
        Http.send({
            url: Http.UrlConfig.GET_NAVIGATOR,
            success: (res)=>{
                if(res.code == Http.Code.OK){
                    GameCtr.navigatorData = res.data
                }
            },
            data:{
                string: "more_games",
            }
        });
    }

    //关注福利
    static channelGift(query) {
        if (query.channel_id == 88 && query.guanzu) {
            //根据自己实际需求处理
            
        }
    }



    //获取签到列表
    static getLoginAwardList(callback = null) {
        Http.send({
            url: Http.UrlConfig.GET_TODAY,
            success: (res)=>{
                console.log("log---------获取签到列表------res=:",res);
                if(res.ret == 1){
                    if(callback) callback(res);
                }
            },
            data: {
                uid: UserManager.user_id,
                voucher:UserManager.voucher
            }
        });
    }

    //签到
    static sign(callback) {
        Http.send({
            url: Http.UrlConfig.DO_TODAY,
            success: (res)=>{
                console.log("log----------签到res=：",res);
                if(res.ret==1){
                    callback(res.todaySum);
                }else{
                    GameCtr.getInstance().getStart().showToast(res.msg);
                }
            },
            data:{
                uid: UserManager.user_id,
                voucher:UserManager.voucher
            }
        });
    }

    //开始游戏时获取匹配机器人
    static getGameStartInfo(callback){
        Http.send({
            url: Http.UrlConfig.GET_GAME_START,
            success: (res) => { 
                console.log("log------------getGameStartInfo---res=:",res);
                if(res.ret == 1){
                    callback(res.data);
                    GameCtr.getInstance().getGame().setNetTipVisit(false);
                }else{
                    GameCtr.getInstance().getGame().showToast(res.msg);
                }
            },

            error:()=>{
                //网络连接错误 界面中显示网络错误提示 并尝试再次向服务器发送请求
                GameCtr.getInstance().getGame().setNetTipVisit(true);
                GameCtr.getInstance().getGame().getStartInfo();
            },

            data:{
                uid:UserManager.user_id,
                voucher:UserManager.voucher
            }
        });
    }

    //开始游戏时获取匹配机器人
    static GameStart(callback){
        Http.send({
            url: Http.UrlConfig.GAME_START,
            success: (res) => { 
                console.log("log------------GAME_START---res=:",res);
                if(res.ret == 1){
                    GameCtr.joinGameCount++;
                }else{
                    GameCtr.getInstance().getGame().showToast(res.msg);
                }
            },
            data:{
                uid:UserManager.user_id,
                voucher:UserManager.voucher
            }
        });
    }

    static getTitle(callback){
        Http.send({
            url: Http.UrlConfig.GET_TITLE,
            success: (res) => { 
                console.log('log---------getTitle---res=:',res);
                if(res.ret==1){
                    GameCtr.questionAnswer=res.info.ok;
                    callback(res.info.title);
                }else{
                    GameCtr.getInstance().getGame().showToast(res.msg);
                }
            },
            data:{
                uid:UserManager.user_id,
                voucher:UserManager.voucher
            }
        });
    }


    static getGameWin(callback){
        Http.send({
            url: Http.UrlConfig.GAME_WIN,
            success: (res) => { 
                if(res.ret==1){
                    GameCtr.chickenCount++;
                    WXCtr.submitScoreToWx(GameCtr.chickenCount);
                }else{
                    GameCtr.getInstance().getGame().showToast(res.msg);
                }
            },
            data:{
                uid:UserManager.user_id,
                voucher:UserManager.voucher
            }
        });
    }

    static setMoney(_money){
        Http.send({
            url: Http.UrlConfig.SET_GOLD_DATA,
            success: (res) => { 
                if(res.ret==1){
                    console.log("log-----------金币上报成功--------------");
                }else{
                    GameCtr.getInstance().getStart().showToast(res.msg);
                }
            },
            data:{
                uid:UserManager.user_id,
                voucher:UserManager.voucher,
                money:_money
            }
        });
    }







    
    
    // update (dt) {}
}
