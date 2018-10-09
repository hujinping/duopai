"use strict";
cc._RF.push(module, 'e7a76N18wxAD6bqHIHxO/KK', 'HttpCtr');
// Script/Controller/HttpCtr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Http_1 = require("../Common/Http");
var UserManager_1 = require("../Common/UserManager");
var WXCtr_1 = require("./WXCtr");
var GameCtr_1 = require("./GameCtr");
var ViewManager_1 = require("../Common/ViewManager");
var Util_1 = require("../Common/Util");
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
                    HttpCtr_1.getUserInfo(null, showWorldRanking);
                    HttpCtr_1.getSettingConfig();
                    HttpCtr_1.chanelCheck(WXCtr_1.default.launchOption.query);
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
    HttpCtr.getUserInfo = function (callBack, showWorldRanking) {
        if (callBack === void 0) { callBack = null; }
        if (showWorldRanking === void 0) { showWorldRanking = false; }
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
                    if (showWorldRanking) {
                        console.log("log---------排行授权  刷新排行");
                        GameCtr_1.default.getInstance().getRanking().showWorldRanking();
                        GameCtr_1.default.getInstance().getRanking().initSelfInfo();
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
                console.log("获取游戏配置 GameCtr.isAudited=：", GameCtr_1.default.isAudited);
                GameCtr_1.default.setting = resp;
                GameCtr_1.default.advTime = resp.advTime;
                GameCtr_1.default.advVedioTime = resp.advVideoTime;
                GameCtr_1.default.isGetSetting = true;
                GameCtr_1.default.getInstance().getLoding().refreshMoreNewGame();
                var vedioInfo = localStorage.getItem("VideoTimes");
                if (!vedioInfo) {
                    GameCtr_1.default.vedioTimes = GameCtr_1.default.setting.advSum;
                }
                else {
                    var obj = JSON.parse(vedioInfo);
                    if (obj.day != Util_1.default.getCurrTimeYYMMDD()) {
                        GameCtr_1.default.vedioTimes = GameCtr_1.default.setting.advSum;
                    }
                    else {
                        GameCtr_1.default.vedioTimes = obj.times;
                    }
                }
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
                WXCtr_1.default.setVideoAd();
                if (res.data.advid) {
                    WXCtr_1.default.bannerId = res.data.advid;
                    WXCtr_1.default.setBannerAd(100, 300);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher
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
                console.log("log-------DO_TODAY-res=:", res);
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
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
                gold: _gold
            }
        });
    };
    HttpCtr.setUserDataState = function (idx, value) {
        var sendData = {
            uid: UserManager_1.default.user_id,
            voucher: UserManager_1.default.voucher
        };
        var key = "data_" + idx;
        sendData[key] = value;
        console.log("log---------sendData=:", sendData);
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
                    GameCtr_1.default.realMoney -= 1000;
                    GameCtr_1.default.getInstance().getGame().showToast("兑换成功");
                    GameCtr_1.default.getInstance().getGame().setRealMoney(0);
                    var exchange1 = cc.find("Canvas").getChildByName("exchange1");
                    if (exchange1) {
                        exchange1.getComponent("exchange1").setRealyMoney();
                        var exchange2 = exchange1.getChildByName("exchange2");
                        if (exchange2) {
                            exchange2.getComponent("exchange2").setRealMoney();
                        }
                    }
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
    HttpCtr.openClick = function (_clickid, _appid) {
        if (_appid === void 0) { _appid = null; }
        if (!GameCtr_1.default.setting) {
            return;
        }
        if (_appid || GameCtr_1.default.setting.onclick) {
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
                    appid: _appid
                }
            });
        }
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
    HttpCtr.pushMsg = function (callback) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.PUSH_MSG,
            success: function (res) {
                console.log("log---------pushMsg -->res=:", res);
                if (res.ret == 1) {
                    callback(res.data);
                }
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
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