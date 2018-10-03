(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Controller/HttpCtr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e7a76N18wxAD6bqHIHxO/KK', 'HttpCtr', __filename);
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
    HttpCtr.login = function (code, showWorldRanking) {
        if (showWorldRanking === void 0) { showWorldRanking = false; }
        Http_1.default.send({
            url: Http_1.default.UrlConfig.LOGIN,
            success: function (resp) {
                if (resp.ret == 1) {
                    console.log("log-------------http:login--->resp=:", resp);
                    UserManager_1.default.user_id = resp.data.uid;
                    UserManager_1.default.voucher = resp.data.voucher;
                    HttpCtr_1.getUserInfo();
                    HttpCtr_1.getSettingConfig();
                    HttpCtr_1.chanelCheck(WXCtr_1.default.launchOption.query);
                    if (showWorldRanking) {
                        GameCtr_1.default.getInstance().getRanking().showWorldRanking();
                    }
                    if (WXCtr_1.default.launchOption.query) {
                        HttpCtr_1.invitedByFriend(WXCtr_1.default.launchOption.query);
                    }
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
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_USERINFO,
            success: function (resp) {
                console.log("log-------getUserInfo--->resp=:", resp);
                if (resp.success == Http_1.default.Code.OK) {
                    UserManager_1.default.user = resp.user;
                    GameCtr_1.default.realMoney = resp.user.cash;
                    console.log("log--------GameCtr.realMoney=:", GameCtr_1.default.realMoney);
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
        console.log("log---------------saveUserInfo-----  data=:", UserManager_1.default.user_id, data);
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
    HttpCtr.chanelCheck = function (query) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.CHANEL_RECORD,
            data: {
                //uid: ,
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
                console.log("获取游戏配置=：", resp);
                GameCtr_1.default.isAudited = resp.ok;
                GameCtr_1.default.setting = resp;
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
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
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
                    GameCtr_1.default.getInstance().getGame().showToast(resp.msg);
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
                uid: UserManager_1.default.user_id
            }
        });
    };
    // 邀请好友
    HttpCtr.invitedByFriend = function (query) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.INVITED_BY_FRIEND,
            success: function (res) {
                console.log("log--------------invitedByFriend=:", res);
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
                touid: query.invite
            }
        });
    };
    //邀请好友结果
    HttpCtr.getInviteResult = function (callback) {
        if (callback === void 0) { callback = null; }
        Http_1.default.send({
            url: Http_1.default.UrlConfig.SEEK_LOG,
            success: function (res) {
                console.log('log-----------邀请好友结果-=:', res);
                if (callback) {
                    callback(res.data);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
            }
        });
    };
    //渠道验证
    HttpCtr.chanelCheck1 = function (query) {
        console.log("log----------渠道验证--------query=", query);
        Http_1.default.send({
            url: Http_1.default.UrlConfig.CHANEL_RECORD,
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
                channel_id: query.channel_id,
            },
            success: function (resp) {
                console.log("渠道验证成功", resp);
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
                if (callback) {
                    callback(res);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher
            }
        });
    };
    //签到
    HttpCtr.sign = function (callback) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.DO_TODAY,
            success: function (res) {
                console.log("log--------res=:", res);
                if (res.m) {
                    callback(res);
                }
                else {
                    GameCtr_1.default.getInstance().getGame().showToast(res.msg);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
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
    HttpCtr.setGold = function (_gold) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.SET_GOLD_DATA,
            success: function (res) {
                if (res.ret == 1) {
                    console.log("log-----------金币上报成功--------------_gold=:", _gold);
                }
                else {
                    ViewManager_1.default.toast(res.msg);
                    console.log("log-----------金币上报失败--------------");
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
                gold: _gold
            }
        });
    };
    HttpCtr.setFriendBonusState = function (idx, value) {
        var sendData = {
            uid: UserManager_1.default.user_id,
            voucher: UserManager_1.default.voucher
        };
        var key = "data_" + idx;
        sendData[key] = value;
        console.log("log----------setFriendBonusState=:", sendData);
        Http_1.default.send({
            url: Http_1.default.UrlConfig.SET_GOLD_DATA,
            success: function (res) {
                if (res.ret == 1) {
                    console.log("log------上报领取邀请奖励成功");
                }
                else {
                    ViewManager_1.default.toast(res.msg);
                }
            },
            data: sendData
        });
    };
    HttpCtr.openRed = function (clickID, callFunc) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.OPEN_RED,
            success: function (res) {
                if (res.m) {
                    callFunc(res.m);
                }
                else {
                    GameCtr_1.default.getInstance().getGame().showToast(res.msg);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
                clickid: clickID
            }
        });
    };
    HttpCtr.doExchange = function (phoneNumber) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.DO_EXCHANGE,
            success: function (res) {
                if (res.ret != 1) {
                    GameCtr_1.default.getInstance().getGame().showToast(res.msg);
                }
                else {
                    GameCtr_1.default.getInstance().getGame().showToast("兑换成功");
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
                rewardid: 1,
                exchangeUser: phoneNumber,
            }
        });
    };
    HttpCtr.openClick = function (_clickid) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.OPEN_CLICK,
            success: function (res) {
                if (res.ret != 1) {
                    GameCtr_1.default.getInstance().getGame().showToast(res.msg);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
                clickid: _clickid,
            }
        });
    };
    HttpCtr.getCash = function (callback) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_CASH,
            success: function (res) {
                if (res.m) {
                    callback(res);
                }
                else {
                    GameCtr_1.default.getInstance().getGame().showToast(res.msg);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
            }
        });
    };
    var HttpCtr_1;
    HttpCtr = HttpCtr_1 = __decorate([
        ccclass
    ], HttpCtr);
    return HttpCtr;
}());
exports.default = HttpCtr;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=HttpCtr.js.map
        