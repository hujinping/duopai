"use strict";
cc._RF.push(module, 'e7a76N18wxAD6bqHIHxO/KK', 'HttpCtr');
// Script/Controller/HttpCtr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Http_1 = require("../Common/Http");
var UserManager_1 = require("../Common/UserManager");
var WXCtr_1 = require("./WXCtr");
var GameCtr_1 = require("./GameCtr");
var ViewManager_1 = require("../Common/ViewManager");
/**
 * 所有Http请求统一控制
 */
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var HttpCtr = /** @class */ (function () {
    function HttpCtr() {
    }
    HttpCtr_1 = HttpCtr;
    //登录游戏
    HttpCtr.login = function (code) {
        console.log("log------------HttpCtr-----LoginCode=:", code);
        Http_1.default.send({
            url: Http_1.default.UrlConfig.LOGIN,
            success: function (resp) {
                if (resp.ret == 1) {
                    UserManager_1.default.user_id = resp.data.uid;
                    UserManager_1.default.voucher = resp.data.voucher;
                    HttpCtr_1.getUserInfo();
                    HttpCtr_1.getSettingConfig();
                    WXCtr_1.default.getUserInfo();
                    // HttpCtr.chanelCheck(WXCtr.launchOption.query, UserManager.user_id);
                    // HttpCtr.channelGift(WXCtr.launchOption.query);
                    // HttpCtr.getShareConfig();
                    // HttpCtr.getAdConfig();
                    // HttpCtr.invitedByFriend(WXCtr.launchOption.query);
                }
            },
            data: {
                code: code
            }
        });
    };
    //获取分享配置
    HttpCtr.getShareConfig = function () {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_SHARE,
            success: function (resp) {
                console.log("获取分享配置信息", resp);
                WXCtr_1.default.shareTitle = resp.data.share_title;
                WXCtr_1.default.shareImg = resp.data.share_img;
                WXCtr_1.default.setShareAppMessage();
            },
            data: {
                share_type: "index",
            }
        });
    };
    //获取个人信息
    HttpCtr.getUserInfo = function (callBack) {
        if (callBack === void 0) { callBack = null; }
        console.log("log------uid=:", typeof (UserManager_1.default.user_id));
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_USERINFO,
            success: function (resp) {
                if (resp.success == Http_1.default.Code.OK) {
                    UserManager_1.default.user = resp.user;
                    window.localStorage.setItem("money", resp.user.money);
                    console.log("log------------UserManager.user=:", resp);
                    GameCtr_1.default.chickenCount = resp.user.Sum;
                    GameCtr_1.default.joinGameCount = resp.user.SumLog;
                    GameCtr_1.default.money = resp.user.money;
                    if (callBack) {
                        callBack(resp.user);
                    }
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher
            }
        });
    };
    //保存自己的信息（头像，昵称等）到服务器
    HttpCtr.saveUserInfo = function (data) {
        console.log("log---------------saveUserInfo-----  data=:", data);
        Http_1.default.send({
            url: Http_1.default.UrlConfig.SET_USER_DATA,
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
                encryptedData: data.encryptedData,
                iv: data.iv
            },
            success: function () {
                console.log("log-----------------上传信息成功------------");
            }
        });
    };
    //渠道验证
    HttpCtr.chanelCheck = function (query, userId) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.CHANEL_RECORD,
            data: {
                user_id: userId,
                channel_id: query.channel_id,
                cuid: query.cuid,
                cvoucher: query.cvoucher,
                cid: query.cid,
                pid: query.pid
            },
            success: function (resp) {
                console.log("渠道验证成功", resp);
            }
        });
    };
    HttpCtr.getSettingConfig = function () {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_SETTING,
            success: function (resp) {
                //console.log("获取游戏配置=：", resp);
                GameCtr_1.default.isAudited = resp.ok;
            }
        });
    };
    //视频渠道验证
    HttpCtr.videoCheck = function (query) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.VideoOpen,
            data: {
                user_id: UserManager_1.default.user_id,
                channel_id: query.channel_id,
                cuid: query.cuid,
                cvoucher: query.cvoucher,
                cid: query.cid,
                pid: query.pid
            }
        });
    };
    //分享到群检测
    HttpCtr.shareGroupCheck = function (encryptedData, iv, callback) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.SHARE_GROUP,
            data: {
                user_id: UserManager_1.default.user_id,
                encrypted_data: encryptedData,
                iv: iv
            },
            success: function (resp) {
                if (resp.ret == 1) {
                    if (callback) {
                        callback();
                    }
                }
                else if (resp.ret == 0) {
                    ViewManager_1.default.toast(resp.msg);
                }
            }
        });
    };
    // 获取广告配置
    HttpCtr.getAdConfig = function () {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.ADConfig,
            success: function (res) {
                console.log("获取广告配置", res);
                if (res.data.videoid) {
                    WXCtr_1.default.setVideoAd(res.data.videoid);
                }
                if (res.data.advid) {
                    WXCtr_1.default.bannerId = res.data.advid;
                }
            },
            data: {
                user_id: UserManager_1.default.user_id
            }
        });
    };
    // 邀请好友
    HttpCtr.invitedByFriend = function (query) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.INVITED_BY_FRIEND,
            success: function () { },
            data: {
                user_id: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
                friend_user_id: query.invite
            }
        });
    };
    //邀请好友结果
    HttpCtr.getInviteResult = function (callback) {
        if (callback === void 0) { callback = null; }
        Http_1.default.send({
            url: Http_1.default.UrlConfig.INVITE_RESULT,
            success: function (res) {
            },
            data: {
                user_id: UserManager_1.default.user_id,
            }
        });
    };
    //获取等多游戏导航信息
    HttpCtr.getNevigatorData = function () {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_NAVIGATOR,
            success: function (res) {
                if (res.code == Http_1.default.Code.OK) {
                    GameCtr_1.default.navigatorData = res.data;
                }
            },
            data: {
                string: "more_games",
            }
        });
    };
    //关注福利
    HttpCtr.channelGift = function (query) {
        if (query.channel_id == 88 && query.guanzu) {
            //根据自己实际需求处理
        }
    };
    // //获取我的战绩
    // static getSelfArchieve(callback = null) {
    //     Http.send({
    //         url: Http.UrlConfig.SELF_ARCHIEVE,
    //         success: (res)=>{
    //             if(res.code == Http.Code.OK){
    //                 if(callback) callback(res);
    //             }
    //         },
    //         data: {
    //             user_id: UserManager.user_id,
    //         }
    //     });
    // }
    // //获取今日最强数据
    // static getTodayList(callback = null) {
    //     Http.send({
    //         url: Http.UrlConfig.TODAY_LIST,
    //         success: (res)=>{
    //             if(res.code == Http.Code.OK){
    //                 if(callback) callback(res);
    //             }
    //         },
    //     });
    // }
    //获取历史最强数据
    // static getHistoryList(callback = null) {
    //     Http.send({
    //         url: Http.UrlConfig.HISTORY_LIST,
    //         success: (res)=>{
    //             if(res.code == Http.Code.OK){
    //                 if(callback) callback(res);
    //             }
    //         }
    //     });
    // }
    //获取签到列表
    HttpCtr.getLoginAwardList = function (callback) {
        if (callback === void 0) { callback = null; }
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_TODAY,
            success: function (res) {
                if (res.code == Http_1.default.Code.OK) {
                    if (callback)
                        callback(res);
                }
            },
            data: {
                user_id: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher
            }
        });
    };
    //签到
    HttpCtr.sign = function (callback) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.DO_TODAY,
            success: function (res) {
                if (res.code == Http_1.default.Code.OK) {
                    callback(true);
                }
                else {
                    ViewManager_1.default.toast(res.msg);
                    callback(false);
                }
            },
            data: {
                user_id: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher
            }
        });
    };
    HttpCtr.getRankList = function (type, callback) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_RANK_LIST,
            success: function (res) {
                if (res.code == Http_1.default.Code.OK) {
                    callback(true);
                }
                else {
                    ViewManager_1.default.toast(res.msg);
                    callback(false);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                type: type
            }
        });
    };
    //开始游戏时获取匹配机器人
    HttpCtr.getGameStartInfo = function (callback) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_GAME_START,
            success: function (res) {
                //console.log("log------------getGameStartInfo---res=:",res);
                if (res.ret == 1) {
                    callback(res.data);
                }
                else {
                    ViewManager_1.default.toast(res.msg);
                    //callback(false);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher
            }
        });
    };
    //开始游戏时获取匹配机器人
    HttpCtr.GameStart = function (callback) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GAME_START,
            success: function (res) {
                console.log("log------------GAME_START---res=:", res);
                if (res.ret == 1) {
                    GameCtr_1.default.joinGameCount++;
                }
                else {
                    ViewManager_1.default.toast(res.msg);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher
            }
        });
    };
    HttpCtr.getTitle = function (callback) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_TITLE,
            success: function (res) {
                console.log('log---------getTitle---res=:', res);
                if (res.ret == 1) {
                    GameCtr_1.default.questionAnswer = res.info.ok;
                    callback(res.info.title);
                }
                else {
                    ViewManager_1.default.toast(res.msg);
                    //callback(false);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher
            }
        });
    };
    HttpCtr.getGameWin = function (callback) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GAME_WIN,
            success: function (res) {
                if (res.ret == 1) {
                    GameCtr_1.default.chickenCount++;
                }
                else {
                    ViewManager_1.default.toast(res.msg);
                    //callback(false);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher
            }
        });
    };
    HttpCtr.setMoney = function (_money) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.SET_GOLD_DATA,
            success: function (res) {
                if (res.ret == 1) {
                    console.log("log-----------金币上报成功--------------");
                }
                else {
                    ViewManager_1.default.toast(res.msg);
                    console.log("log-----------金币上报失败--------------");
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
                money: _money
            }
        });
    };
    HttpCtr = HttpCtr_1 = __decorate([
        ccclass
    ], HttpCtr);
    return HttpCtr;
    var HttpCtr_1;
}());
exports.default = HttpCtr;

cc._RF.pop();