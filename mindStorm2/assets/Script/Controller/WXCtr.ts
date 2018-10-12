//微信全局方法
import Http from "../Common/Http";
import UserManager from "../Common/UserManager";
import ViewManager from "../Common/ViewManager";
import HttpCtr from "./HttpCtr";
import GameCtr from "./GameCtr";
import Util from "../Common/Util";

const { ccclass, property } = cc._decorator;

enum Message_Type {
    Get_SelfData,                       //获取自己信息
    Get_FriendData,                     //获取好友排行榜数据
    Get_GroupData,                      //获取群排名
    Submit_SelfScore,                   //提交自己得分
    Compare_Score,                      //比较自己与好友得分
    Show_WholeRanking,                  //显示完整排行榜   
    Show_OverRanking,                   //显示结束排行榜
    Close_WholeRanking,                 //关闭好友排行
    Close_OverRanking,                  //关闭结束排行
};

const I6P = {
    w: 375.0,
    h: 667.0
};

@ccclass
export default class WXCtr {

    static wxLoginSuccess: boolean = false;
    static shareTitle;
    static shareImg;
    static onShowCall = null;
    static videoAd = null;
    static videoAdCallback = null;
    static bannerAd = null;
    static bannerId = null;
    static launchOption;
    static userInfoBtn;

    static screenWidth;
    static screenHeight;
    static widthRatio;
    static heightRatio;

    static authed = false;

    constructor() {

    }

    //获取启动参数
    static getLaunchOptionsSync() {
        if (window.wx != undefined) {

            WXCtr.launchOption = window.wx.getLaunchOptionsSync();
            console.log("获取启动参数", WXCtr.launchOption);

            let fileMgr = wx.getFileSystemManager();
            fileMgr.getSavedFileList({
                success: (res) => {
                    console.log("获取本地缓存文件列表成功", res);
                },
            });
        }
    }

    static getSystemInfo() {
        if (window.wx != undefined) {
            wx.getSystemInfo({
                success: (res) => {
                    console.log("获取设备信息成功", res);
                    WXCtr.screenWidth = res.screenWidth;
                    WXCtr.screenHeight = res.screenHeight;
                    WXCtr.widthRatio = WXCtr.screenWidth / I6P.w;
                    WXCtr.heightRatio = WXCtr.screenHeight / I6P.h;
                }
            });
        }
    }

    //退出当前小游戏
    static exitGame() {
        if (window.wx != undefined) {
            wx.exitMiniProgram();
        }
    }

    static getAuthSetting() {
        if (window.wx != undefined) {
            wx.getSetting({
                success: function (res) {
                    var authSetting = res.authSetting
                    if (authSetting['scope.userInfo'] === true) {
                        // 用户已授权
                        WXCtr.authed = true;
                    } else if (authSetting['scope.userInfo'] === false) {
                        // 用户已拒绝授权
                        WXCtr.authed = false;
                    } else {
                        // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
                        WXCtr.authed = false;
                    }
                }
            });
        }
    }

    //创建用户授权按钮
    static createUserInfoBtn() {
        if (window.wx != undefined) {
            console.log("创建用户授权按钮");

            let model;
            wx.getSystemInfo({
                success: (res)=>{
                    console.log("获取设备信息成功", res);
                    model = res.model
                    WXCtr.screenWidth = res.screenWidth;
                    WXCtr.screenHeight = res.screenHeight;
                    WXCtr.widthRatio = WXCtr.screenWidth / I6P.w;
                    WXCtr.heightRatio = WXCtr.screenHeight / I6P.h;
                    //GameCtr.getPhone(model)
                }
            });

            WXCtr.userInfoBtn = wx.createUserInfoButton({
                type: 'image',
                image: 'res/raw-assets/resources/textures/authBtn.png',
                style: {
                    left: (WXCtr.screenWidth / 2-80),
                    top: (WXCtr.screenHeight / 2-40) + (50 * WXCtr.heightRatio),
                    width: 160 * WXCtr.widthRatio,
                    height: 40 * WXCtr.heightRatio,
                }
            });
        }
    }

    static onUserInfoBtnTap(callback) {
        let call: Function = (res) => {
            console.log("UserInfoBtn tap", res);
            if (res.userInfo) {
                WXCtr.wxGetUsrInfo();
                if(callback){
                    callback(true);
                }
                WXCtr.userInfoBtn.destroy();
            } else {
                //callback(false);
            }
        };
        WXCtr.userInfoBtn.onTap(call);
    }

    static wxGetUsrInfo() {
        if (window.wx != undefined) {
            window.wx.getUserInfo({
                //openIdList: ['selfOpenId'],
                lang:"zh_CN",
                withCredentials: true,
                success: function (res) {
                    let info = res.userInfo;
                    WXCtr.authed = true;
                    HttpCtr.saveUserInfo(res);
                    GameCtr.getInstance().saveSelfInfoToLocal(res.userInfo);
                    GameCtr.getInstance().getStart().initSelfInfo();
                },
                fail: function (res) {
                    console.log("获取自己信息失败", res);
                }
            })
        }
    }

    //登录微信
    static wxOnLogin() {
        if (window.wx != undefined) {
            //登录微信
            window.wx.login({
                success: function (loginResp) {
                    console.log("微信登录返回值res", loginResp);
                    HttpCtr.login(loginResp.code);
                    WXCtr.getShareConfig();
                    WXCtr.getReviveData();
                    HttpCtr.getAdConfig();
                }
            })
        }
    }

    static getUserInfo(){
        //获取用户信息
        window.wx.getUserInfo({
            //openIdList: ['selfOpenId'],
            lang:"zh_CN",
            success: function (res) {
                let info = res.userInfo;
                let data = {
                    avatarUrl: info.avatarUrl,
                    city: info.city,
                    country: info.country,
                    gender: info.gender,
                    language: info.language,
                    nickName: info.nickName,
                    openId: info.openId,
                    province: info.province,
                };
                GameCtr.getInstance().saveSelfInfoToLocal(res.userInfo);
                GameCtr.getInstance().emitEvent("getSelfInfoSuccess",null);
                WXCtr.wxLoginSuccess = true;
                WXCtr.authed = true;
                HttpCtr.saveUserInfo(res);
                //console.log("获取自己信息返回值", res);
            },
            fail: function (res) {
                console.log("获取自己信息失败", res);
            }
        })
    }


    //获取分享配置
    static getShareConfig() {
        Http.send({
            url: Http.UrlConfig.GET_SHARE,
            success: (resp) => {
                console.log("获取分享配置信息", resp);
                WXCtr.shareTitle = resp.data.share_title;
                WXCtr.shareImg = resp.data.share_img;
                wx.onShareAppMessage(function () {
                    return {
                        title: WXCtr.shareTitle,
                        imageUrl: WXCtr.shareImg,
                    }
                });
            },
            data: {
                share_type: "index",
            }
        });
    }

    //获取复活配置
    static getReviveData() {
        Http.send({
            url: Http.UrlConfig.REVIVECONFIG,
            success: (resp) => {
                console.log("获取复活配置信息", resp);
                GameCtr.reviveData = resp.data;
            },

            data:{

            }
        });
    }

    //显示分享按钮
    static showShareMenu() {
        if (window.wx != undefined) {
            console.log("显示分享按钮！！！！！！");
            window.wx.showShareMenu({
                withShareTicket: true,
                success: (res) => {
                    
                },
                fail: (res) => {
                    
                },
                complete: (res) => {
                    
                }
            });
        }
    }

    //设置转发信息（右上角按钮点击->转发）
    static setShareAppMessage() {
        if (window.wx != undefined) {
            wx.onShareAppMessage(function () {
                return {
                    title: WXCtr.shareTitle,
                    imageUrl: WXCtr.shareImg,
                }
            });
        }
    }

    //监听小游戏回到前台的事件
    static onShow(callback = null) {
        console.log("监听小游戏回到前台的事件");
        if (window.wx != undefined) {
            let call: Function = (res) => {
                if (callback) {
                    callback();
                }
            };
            window.wx.onShow(call);

            WXCtr.onShowCall = call;
        }
    }

    //取消监听小游戏回到前台的事件
    static offShow() {
        if (window.wx != undefined) {
            console.log("取消监听小游戏回到前台的事件");
            window.wx.offShow(WXCtr.onShowCall);
        }
    }

    //预览图片
    static previewImg(imgUrl) {
        if (window.wx != undefined) {
            wx.previewImage({
                urls: [imgUrl],
                success: (res) => {
                    console.log("预览图片成功回调", res);
                }
            });
        }
    }

    //视频广告
    static setVideoAd() {
        if (window.wx != undefined && wx.createRewardedVideoAd) {
            WXCtr.videoAd = wx.createRewardedVideoAd({ adUnitId:"adunit-cf448a58c6f5d542"});
            WXCtr.videoAd.onLoad(() => {
            });
            WXCtr.videoAd.load();
            WXCtr.videoAd.onError(err => {
                WXCtr.videoAd = null; 
                console.log(err)
            }); 
        }
    }

    static showVideoAd() {
        if (WXCtr.videoAd) {
            WXCtr.videoAd.show();
            GameCtr.vedioTimes--;
            console.log("今天剩余观看视频次数为：", GameCtr.vedioTimes);
            localStorage.setItem("VideoTimes", JSON.stringify({ day: Util.getCurrTimeYYMMDD(), times: GameCtr.vedioTimes }));
            //GameCtr.getInstance().getGame().setVedioCD()
        }
    }

    static onCloseVideo(callback) {
        let call: Function = (res) => {
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                callback(true);
                HttpCtr.videoCheck(WXCtr.launchOption.query);
            }
            else {
                // 播放中途退出，不下发游戏奖励
                callback(false);
            }
        };
        if(WXCtr.videoAd){
            WXCtr.videoAd.onClose(call);
        }
        WXCtr.videoAdCallback = call;
    }

    static offCloseVideo() {
        if (WXCtr.videoAdCallback) {
            if(WXCtr.videoAd){
                WXCtr.videoAd.offClose(WXCtr.videoAdCallback);
            }
            WXCtr.videoAdCallback = null;
        }
    }

    //banner广告
    static setBannerAd(height = null, width = null) {
        if (window.wx != undefined && wx.createBannerAd) {
            if (WXCtr.bannerAd && WXCtr.bannerAd.destroy) {
                WXCtr.bannerAd.destroy();
            }
            let top = 140;
            if (height) top = height;
            let widthNum = 375;
            let left = 0;
            if (width) {
                widthNum = width;
                let realWidth = width * WXCtr.widthRatio;
                realWidth = realWidth < 300 ? 300 : realWidth;
                left = (WXCtr.screenWidth - realWidth) / 2;
            }
            WXCtr.bannerAd = wx.createBannerAd({
                adUnitId:"adunit-4d43fbf2baf8747c",
                style: {
                    left: left,
                    top: WXCtr.screenHeight - top * WXCtr.heightRatio,
                    width: widthNum * WXCtr.widthRatio,
                }
            });
            WXCtr.bannerAd.show();
            WXCtr.bannerAd.onError(() => {
            })
        }
    }

    static hideBannerAd() {
        if (cc.isValid(WXCtr.bannerAd) && WXCtr.bannerAd) {
            WXCtr.bannerAd.hide();
        }
    }

    //分享 
    static share(data?: {
        invite?: boolean,                               //邀请好友
        Challenge?: boolean,                            //挑战 
        callback?: Function
    }) {
        let qureyInfo = "";
        if (data && data.invite) {
            qureyInfo = "invite=";
        }
        if (data && data.Challenge){
            qureyInfo = "Challenge=";
        }
        if (window.wx != undefined) {
            window.wx.shareAppMessage({
                title: WXCtr.shareTitle,
                imageUrl: WXCtr.shareImg,
                query: qureyInfo + UserManager.user_id,
                success: (res) => {
                    if(GameCtr.setting.share){
                        if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                            console.log("shareTickets == ", res.shareTickets);
                            WXCtr.getWxShareInfo(res.shareTickets[0], data.callback);
                        } else {
                            //GameCtr.getInstance().getGame().showToast("请分享到群！");
                        }
                    }else{
                        if(data.callback){
                            data.callback()
                        }
                    }
                   
                },
                complete: () => {
                }
            });
        } else {

        }
    }

    //获取分享转发详细信息
    static getWxShareInfo(shareTicket, callback) {
        if (window.wx != undefined) {
            window.wx.getShareInfo({
                shareTicket: shareTicket,
                success: (resp) => {
                    console.log("获取分享信息成功！！！", resp);
                    HttpCtr.shareGroupCheck(resp.encryptedData, resp.iv, callback);
                },
            });
        }
    }

    //保存数据到本地
    static getStorageData(key, callback = null) {
        if (window.wx != undefined) {
            wx.getStorage({
                key: key,
                success: (resp) => {
                    if (callback) {
                        callback(resp.data);
                    }
                },
                fail: (resp) => {
                    if (callback) {
                        callback(null);
                    }
                },
            });
        }
    }

    //获取本地数据
    static setStorageData(key, data) {
        if (window.wx != undefined) {
            wx.setStorage({
                key: key,
                data: data,
                success: (resp) => {

                }
            });
        }
    }

    //导航到其他小程序
    static gotoOther(data) {
        console.log("data = ", data);
        if (data.appid) {
            wx.navigateToMiniProgram({
                appId: data.appid,
                path: data.path,
                success(res) {
                    // 打开成功
                    console.log('打开成功');

                },
                fail(err) {
                    wx.showToast({
                        title: '打开失败!',
                        icon: 'none'
                    })
                }
            })
        }
    }

    //打开客服消息
    static customService() {
        wx.openCustomerServiceConversation({
            success: () => {
                WXCtr.exitGame();
            }
        });
    }


    /**
     * 子域消息相关方法
     */
    //获取自己信息
    static getSelfData() {
        if (window.wx != undefined) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: Message_Type.Get_SelfData,
            });
        } else {
        }
    }

    //获取群数据
    static getGroupRankingData() {
        console.log("获取群数据！！！！！！");
        if (window.wx != undefined) {
            window.wx.shareAppMessage({
                title: WXCtr.shareTitle,
                imageUrl: WXCtr.shareImg,
                success: (res) => {
                    console.log("分享成功回调返回值", res);
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: Message_Type.Get_GroupData,
                            LIST_KEY: "Rank_Data",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        }
    }

    //获取好友排行榜数据
    static getFriendRankingData() {
        if (window.wx != undefined) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: Message_Type.Get_FriendData,
                LIST_KEY: "Rank_Data"
            });
        }
    }

    //显示好友排行
    static showFriendRank(){
        if(window.wx !=undefined){
            window.wx.postMessage({
                messageType:Message_Type.Show_WholeRanking,
            })
        }
    }

    //显示结束界面好友排行
    static showOverRanking() {
        if (window.wx != undefined) {
            console.log("主域发送消息____显示结束好友排行");
            window.wx.postMessage({
                messageType: Message_Type.Show_OverRanking,
            });
        }
    }

    //关闭End好友排行
    static closeFriendEndRanking() {
        if (window.wx != undefined) {
            console.log("主域发送消息____关闭End好友排行");
            window.wx.postMessage({
                messageType: Message_Type.Close_OverRanking,
            });
        }
    }

    //显示完整好友排行
    static showFriendRanking() {
        if (window.wx != undefined) {
            console.log("主域发送消息____显示好友排行");
            window.wx.postMessage({
                messageType: Message_Type.Show_WholeRanking,
            });
        }
    }

    //关闭好友排行
    static closeFriendRanking() {
        if (window.wx != undefined) {
            console.log("主域发送消息____关闭好友排行");
            window.wx.postMessage({
                messageType: Message_Type.Close_WholeRanking,
            });
        }
    }

    //提交分数到微信
    static submitScoreToWx(score) {
        if (window.wx != undefined) {
            console.log("主域发送消息____提交分数");
            window.wx.postMessage({
                messageType: Message_Type.Submit_SelfScore,
                LIST_KEY: "Rank_Data",
                score: score,
            });
        }
    }

    //保存图片到本地相册
    static saveImge(imgUrl, callback?: Function) {
        if (window.wx != undefined) {
            wx.downloadFile({
                url: imgUrl,
                success: (resp) => {
                    console.log("下载图片成功", resp);
                    wx.saveImageToPhotosAlbum({
                        filePath: resp.tempFilePath,
                        success: (res) => {
                            console.log("图片保存到本地相册成功", res);
                            if (callback) {
                                callback(true);
                            }
                        }
                    });
                },
            });
        }
    }

}
