"use strict";
cc._RF.push(module, 'e659baZaMVDzKDI5WvkuwsU', 'WXCtr');
// Script/Controller/WXCtr.ts

Object.defineProperty(exports, "__esModule", { value: true });
//微信全局方法
var Http_1 = require("../Common/Http");
var UserManager_1 = require("../Common/UserManager");
var HttpCtr_1 = require("./HttpCtr");
var GameCtr_1 = require("./GameCtr");
var Util_1 = require("../Common/Util");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Message_Type;
(function (Message_Type) {
    Message_Type[Message_Type["Get_SelfData"] = 0] = "Get_SelfData";
    Message_Type[Message_Type["Get_FriendData"] = 1] = "Get_FriendData";
    Message_Type[Message_Type["Get_GroupData"] = 2] = "Get_GroupData";
    Message_Type[Message_Type["Submit_SelfScore"] = 3] = "Submit_SelfScore";
    Message_Type[Message_Type["Compare_Score"] = 4] = "Compare_Score";
    Message_Type[Message_Type["Show_WholeRanking"] = 5] = "Show_WholeRanking";
    Message_Type[Message_Type["Show_OverRanking"] = 6] = "Show_OverRanking";
    Message_Type[Message_Type["Close_WholeRanking"] = 7] = "Close_WholeRanking";
    Message_Type[Message_Type["Close_OverRanking"] = 8] = "Close_OverRanking";
})(Message_Type || (Message_Type = {}));
;
var I6P = {
    w: 375.0,
    h: 667.0
};
var WXCtr = /** @class */ (function () {
    function WXCtr() {
        if (WXCtr_1.videoAdCallback == null) {
            WXCtr_1.videoAdCallback = function (res) {
                WXCtr_1.onCloseVideo(res);
            };
        }
    }
    WXCtr_1 = WXCtr;
    //获取启动参数
    WXCtr.getLaunchOptionsSync = function () {
        if (window.wx != undefined) {
            WXCtr_1.launchOption = window.wx.getLaunchOptionsSync();
            console.log("获取启动参数", WXCtr_1.launchOption);
            var fileMgr = wx.getFileSystemManager();
            fileMgr.getSavedFileList({
                success: function (res) {
                    console.log("获取本地缓存文件列表成功", res);
                },
            });
        }
    };
    WXCtr.getSystemInfo = function () {
        if (window.wx != undefined) {
            wx.getSystemInfo({
                success: function (res) {
                    console.log("获取设备信息成功", res);
                    WXCtr_1.screenWidth = res.screenWidth;
                    WXCtr_1.screenHeight = res.screenHeight;
                    WXCtr_1.widthRatio = WXCtr_1.screenWidth / I6P.w;
                    WXCtr_1.heightRatio = WXCtr_1.screenHeight / I6P.h;
                }
            });
        }
    };
    //退出当前小游戏
    WXCtr.exitGame = function () {
        if (window.wx != undefined) {
            wx.exitMiniProgram();
        }
    };
    WXCtr.getAuthSetting = function () {
        if (window.wx != undefined) {
            wx.getSetting({
                success: function (res) {
                    var authSetting = res.authSetting;
                    if (authSetting['scope.userInfo'] === true) {
                        // 用户已授权
                        WXCtr_1.authed = true;
                    }
                    else if (authSetting['scope.userInfo'] === false) {
                        // 用户已拒绝授权
                        WXCtr_1.authed = false;
                    }
                    else {
                        // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
                        WXCtr_1.authed = false;
                    }
                }
            });
        }
    };
    //创建用户授权按钮
    WXCtr.createUserInfoBtn = function () {
        if (window.wx != undefined) {
            var screenWidth_1;
            var screenHeight_1;
            var widthRatio_1;
            var heightRatio_1;
            wx.getSystemInfo({
                success: function (res) {
                    WXCtr_1.Height = res.windowHeight;
                    console.log("获取设备信息成功", res);
                    screenWidth_1 = res.screenWidth;
                    screenHeight_1 = res.screenHeight;
                    widthRatio_1 = screenWidth_1 / I6P.w;
                    heightRatio_1 = screenHeight_1 / I6P.h;
                }
            });
            WXCtr_1.userInfoBtn = wx.createUserInfoButton({
                type: 'image',
                image: 'res/raw-assets/resources/textures/rank/authBtn.png',
                style: {
                    left: (screenWidth_1 / 2 - 80),
                    top: (screenHeight_1 / 2 - 40) + (50 * heightRatio_1),
                    width: 160 * widthRatio_1,
                    height: 40 * heightRatio_1,
                }
            });
            WXCtr_1.userInfoBtn.hide();
            WXCtr_1.userInfoBtn.onTap(function (res) {
                console.log("UserInfoBtn tap", res);
                if (res.userInfo) {
                    GameCtr_1.default.getInstance().getRanking().showAuthTip(false);
                    WXCtr_1.wxOnLogin(res.userInfo, true);
                }
            });
        }
    };
    //登录微信
    WXCtr.wxOnLogin = function (userInfo, showWorldRanking) {
        if (userInfo === void 0) { userInfo = null; }
        if (showWorldRanking === void 0) { showWorldRanking = false; }
        if (window.wx != undefined) {
            //登录微信
            if (userInfo) {
                WXCtr_1.wxLoginSuccess = true;
            }
            window.wx.login({
                success: function (loginResp) {
                    console.log("微信登录返回值res", loginResp);
                    HttpCtr_1.default.login(loginResp.code, showWorldRanking);
                    WXCtr_1.getUserInfo();
                    WXCtr_1.getSelfData();
                    WXCtr_1.getShareConfig();
                    HttpCtr_1.default.getAdConfig();
                }
            });
        }
    };
    WXCtr.getUserInfo = function () {
        //获取用户信息
        window.wx.getUserInfo({
            openIdList: ['selfOpenId'],
            withCredentials: true,
            lang: "zh_CN",
            success: function (res) {
                var info = res.userInfo;
                var data = {
                    avatarUrl: info.avatarUrl,
                    city: info.city,
                    country: info.country,
                    gender: info.gender,
                    language: info.language,
                    nickName: info.nickName,
                    openId: info.openId,
                    province: info.province,
                };
                GameCtr_1.default.getInstance().saveSelfInfoToLocal(res.userInfo);
                //GameCtr.getInstance().emitEvent("getSelfInfoSuccess",null);
                WXCtr_1.wxLoginSuccess = true;
                WXCtr_1.authed = true;
                HttpCtr_1.default.saveUserInfo(res);
                //console.log("获取自己信息返回值", res);
            },
            fail: function (res) {
                console.log("获取自己信息失败", res);
            }
        });
    };
    //获取分享配置
    WXCtr.getShareConfig = function () {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_SHARE,
            success: function (resp) {
                console.log("获取分享配置信息", resp);
                WXCtr_1.shareTitle = resp.data.share_title;
                WXCtr_1.shareImg = resp.data.share_img;
                wx.onShareAppMessage(function () {
                    return {
                        title: WXCtr_1.shareTitle,
                        imageUrl: WXCtr_1.shareImg,
                    };
                });
            },
            data: {
                share_type: "index",
            }
        });
    };
    //获取复活配置
    WXCtr.getReviveData = function () {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.REVIVECONFIG,
            success: function (resp) {
                console.log("获取复活配置信息", resp);
                GameCtr_1.default.reviveData = resp.data;
            }
        });
    };
    //显示分享按钮
    WXCtr.showShareMenu = function () {
        if (window.wx != undefined) {
            console.log("显示分享按钮！！！！！！");
            window.wx.showShareMenu({
                withShareTicket: true,
                success: function (res) {
                },
                fail: function (res) {
                },
                complete: function (res) {
                }
            });
        }
    };
    //设置转发信息（右上角按钮点击->转发）
    WXCtr.setShareAppMessage = function () {
        if (window.wx != undefined) {
            wx.onShareAppMessage(function () {
                return {
                    title: WXCtr_1.shareTitle,
                    imageUrl: WXCtr_1.shareImg,
                };
            });
        }
    };
    //监听小游戏回到前台的事件
    WXCtr.onShow = function (callback) {
        if (callback === void 0) { callback = null; }
        console.log("监听小游戏回到前台的事件");
        if (window.wx != undefined) {
            var call = function (res) {
                if (callback) {
                    callback();
                }
            };
            window.wx.onShow(call);
            WXCtr_1.onShowCall = call;
        }
    };
    //取消监听小游戏回到前台的事件
    WXCtr.offShow = function () {
        if (window.wx != undefined) {
            console.log("取消监听小游戏回到前台的事件");
            window.wx.offShow(WXCtr_1.onShowCall);
        }
    };
    //预览图片
    WXCtr.previewImg = function (imgUrl) {
        if (window.wx != undefined) {
            wx.previewImage({
                urls: [imgUrl],
                success: function (res) {
                    console.log("预览图片成功回调", res);
                }
            });
        }
    };
    WXCtr.showBannerAd = function () {
        if (cc.isValid(WXCtr_1.bannerAd) && WXCtr_1.bannerAd) {
            WXCtr_1.bannerAd.show();
        }
    };
    WXCtr.hideBannerAd = function () {
        if (cc.isValid(WXCtr_1.bannerAd) && WXCtr_1.bannerAd) {
            WXCtr_1.bannerAd.hide();
        }
    };
    //banner广告
    WXCtr.setBannerAd = function (height, width) {
        if (height === void 0) { height = null; }
        if (width === void 0) { width = null; }
        if (window.wx != undefined && wx.createBannerAd) {
            if (WXCtr_1.bannerAd && WXCtr_1.bannerAd.destroy) {
                WXCtr_1.bannerAd.destroy();
            }
            var top = 140;
            if (height)
                top = height;
            var widthNum = 375;
            var left = 0;
            if (width) {
                widthNum = width;
                var realWidth = width * WXCtr_1.widthRatio;
                realWidth = realWidth < 300 ? 300 : realWidth;
                left = (WXCtr_1.screenWidth - realWidth) / 2;
            }
            WXCtr_1.bannerAd = wx.createBannerAd({
                adUnitId: "adunit-4d43fbf2baf8747c",
                style: {
                    left: left,
                    top: WXCtr_1.screenHeight - top * WXCtr_1.heightRatio,
                    width: widthNum * WXCtr_1.widthRatio,
                }
            });
            WXCtr_1.bannerAd.show();
            WXCtr_1.bannerAd.onError(function () {
            });
        }
    };
    //分享 
    WXCtr.share = function (data) {
        var qureyInfo = "";
        if (data && data.invite) {
            qureyInfo = "invite=";
        }
        if (data && data.Challenge) {
            qureyInfo = "Challenge=";
        }
        if (window.wx != undefined) {
            window.wx.shareAppMessage({
                title: WXCtr_1.shareTitle,
                imageUrl: WXCtr_1.shareImg,
                query: qureyInfo + UserManager_1.default.user_id,
                success: function (res) {
                    if (GameCtr_1.default.setting.share) {
                        if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                            console.log("shareTickets == ", res.shareTickets);
                            WXCtr_1.getWxShareInfo(res.shareTickets[0], data.callback);
                        }
                        else {
                            GameCtr_1.default.getInstance().getGame().showToast("请分享到群！");
                        }
                    }
                    else {
                        if (data.callback) {
                            data.callback();
                        }
                    }
                },
                complete: function () {
                }
            });
        }
        else {
        }
    };
    //获取分享转发详细信息
    WXCtr.getWxShareInfo = function (shareTicket, callback) {
        if (window.wx != undefined) {
            window.wx.getShareInfo({
                shareTicket: shareTicket,
                success: function (resp) {
                    console.log("获取分享信息成功！！！", resp);
                    HttpCtr_1.default.shareGroupCheck(resp.encryptedData, resp.iv, callback);
                },
            });
        }
    };
    WXCtr.showToast = function (msg) {
        if (window.wx != undefined) {
            window.wx.showToast({
                title: msg,
                duration: 2,
                fail: function (res) {
                    WXCtr_1.showToast(msg);
                },
                success: function (res) {
                    return;
                }
            });
        }
    };
    //保存数据到本地
    WXCtr.getStorageData = function (key, callback) {
        if (callback === void 0) { callback = null; }
        if (window.wx != undefined) {
            wx.getStorage({
                key: key,
                success: function (resp) {
                    if (callback) {
                        callback(resp.data);
                    }
                },
                fail: function (resp) {
                    if (callback) {
                        callback(null);
                    }
                },
            });
        }
    };
    //获取本地数据
    WXCtr.setStorageData = function (key, data) {
        if (window.wx != undefined) {
            wx.setStorage({
                key: key,
                data: data,
                success: function (resp) {
                }
            });
        }
    };
    //导航到其他小程序
    WXCtr.gotoOther = function (data) {
        console.log("data = ", data);
        if (data.appid) {
            wx.navigateToMiniProgram({
                appId: data.appid,
                path: data.path,
                success: function (res) {
                    // 打开成功
                    console.log('打开成功');
                },
                fail: function (err) {
                    wx.showToast({
                        title: '打开失败!',
                        icon: 'none'
                    });
                }
            });
        }
    };
    //打开客服消息
    WXCtr.customService = function () {
        wx.openCustomerServiceConversation({
            success: function () {
                WXCtr_1.exitGame();
            }
        });
    };
    WXCtr.setVideoAd = function () {
        if (window.wx != undefined && wx.createRewardedVideoAd) {
            WXCtr_1.videoAd = wx.createRewardedVideoAd({ adUnitId: "adunit-cf448a58c6f5d542" });
            WXCtr_1.videoAd.onLoad(function () {
            });
            WXCtr_1.videoAd.load();
            WXCtr_1.videoAd.onError(function (err) {
                WXCtr_1.videoAd = null;
                console.log(err);
            });
        }
    };
    WXCtr.showVideoAd = function () {
        if (WXCtr_1.videoAd) {
            WXCtr_1.videoAd.show();
            GameCtr_1.default.vedioTimes--;
            console.log("今天剩余观看视频次数为：", GameCtr_1.default.vedioTimes);
            localStorage.setItem("VideoTimes", JSON.stringify({ day: Util_1.default.getCurrTimeYYMMDD(), times: GameCtr_1.default.vedioTimes }));
            GameCtr_1.default.getInstance().getGame().setVedioCD();
        }
    };
    WXCtr.onCloseVideo = function (callback) {
        var call = function (res) {
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                callback(true);
                HttpCtr_1.default.videoCheck(WXCtr_1.launchOption.query);
            }
            else {
                // 播放中途退出，不下发游戏奖励
                callback(false);
            }
        };
        if (WXCtr_1.videoAd) {
            WXCtr_1.videoAd.onClose(call);
        }
        WXCtr_1.videoAdCallback = call;
    };
    WXCtr.offCloseVideo = function () {
        if (WXCtr_1.videoAdCallback) {
            if (WXCtr_1.videoAd) {
                WXCtr_1.videoAd.offClose(WXCtr_1.videoAdCallback);
            }
            WXCtr_1.videoAdCallback = null;
        }
    };
    /**
     * 子域消息相关方法
     */
    /**
     * 子域消息相关方法
     */
    WXCtr.initSharedCanvas = function () {
        if (window.wx != undefined) {
            window.sharedCanvas.width = 880;
            window.sharedCanvas.height = 1000;
        }
    };
    //获取自己信息
    WXCtr.getSelfData = function () {
        if (window.wx != undefined) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: Message_Type.Get_SelfData,
            });
        }
    };
    //获取群数据
    WXCtr.getGroupRankingData = function () {
        console.log("获取群数据！！！！！！");
        if (window.wx != undefined) {
            window.wx.shareAppMessage({
                title: WXCtr_1.shareTitle,
                imageUrl: WXCtr_1.shareImg,
                success: function (res) {
                    console.log("分享成功回调返回值", res);
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: Message_Type.Get_GroupData,
                            SCORE_KEY: "Rank_SCORE",
                            LOCATION_KEY: "LOACTION",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        }
    };
    //获取好友排行榜数据
    WXCtr.getFriendRankingData = function () {
        if (window.wx != undefined) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: Message_Type.Get_FriendData,
                LIST_KEY: "Rank_Data"
            });
        }
    };
    //显示结束界面好友排行
    WXCtr.showOverRanking = function () {
        if (window.wx != undefined) {
            console.log("主域发送消息____显示结束好友排行");
            window.wx.postMessage({
                messageType: Message_Type.Show_OverRanking,
            });
        }
    };
    //显示完整好友排行
    WXCtr.showFriendRanking = function (_pageIndex) {
        if (window.wx != undefined) {
            console.log("主域发送消息____显示好友排行");
            window.wx.postMessage({
                messageType: Message_Type.Show_WholeRanking,
                pageIndex: _pageIndex,
            });
        }
    };
    //关闭好友排行
    WXCtr.closeFriendRanking = function () {
        if (window.wx != undefined) {
            console.log("主域发送消息____关闭好友排行");
            window.wx.postMessage({
                messageType: Message_Type.Close_WholeRanking,
            });
        }
    };
    //提交分数到微信
    WXCtr.submitScoreToWx = function (score) {
        if (window.wx != undefined) {
            console.log("主域发送消息____提交分数");
            window.wx.postMessage({
                messageType: Message_Type.Submit_SelfScore,
                LIST_KEY: "Rank_Data",
                score: score,
            });
        }
    };
    //对比自己的分数和好友的Compare_Score
    WXCtr.submitScoreToWxComparetFriend = function (score) {
        if (window.wx != undefined) {
            console.log("主域发送消息____提交分数");
            window.wx.postMessage({
                messageType: Message_Type.Compare_Score,
                LIST_KEY: "Rank_Data",
                score: score,
            });
        }
    };
    WXCtr.wxLoginSuccess = false;
    WXCtr.onShowCall = null;
    WXCtr.videoAd = null;
    WXCtr.videoAdCallback = null;
    WXCtr.bannerAd = null;
    WXCtr.bannerId = null;
    WXCtr.authed = false;
    WXCtr.outvideoAdCallback = null;
    WXCtr = WXCtr_1 = __decorate([
        ccclass
    ], WXCtr);
    return WXCtr;
    var WXCtr_1;
}());
exports.default = WXCtr;

cc._RF.pop();