import Http from "../Common/Http";
import UserManager from "../Common/UserManager";
import WXCtr from "./WXCtr";
import GameCtr from "./GameCtr";
import ViewManager from "../Common/ViewManager";

/**
 * 所有Http请求统一控制
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class HttpCtr {

    //登录游戏
    static login(code,showWorldRanking=false) {
        Http.send({
            url: Http.UrlConfig.LOGIN,
            success: (resp) => {
                if (resp.ret == 1) {
                    console.log("log-------------http:login--->resp=:", resp);
                    UserManager.user_id = resp.data.uid;
                    UserManager.voucher = resp.data.voucher
                    HttpCtr.getUserInfo();
                    HttpCtr.getSettingConfig();
                    if(showWorldRanking){
                        GameCtr.getInstance().getRanking().showWorldRanking();
                    }
                    if (WXCtr.launchOption.query) {
                        HttpCtr.invitedByFriend(WXCtr.launchOption.query);
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
                console.log("log-------getUserInfo--->resp=:",resp);
                if (resp.success == Http.Code.OK) {
                    UserManager.user = resp.user;
                    GameCtr.realMoney=resp.user.money;
                    console.log("log--------GameCtr.realMoney=:",GameCtr.realMoney);
                    if (callBack) {
                        callBack(resp.user);
                    }
                }
            },

            data: {
                uid: UserManager.user_id,
                voucher: UserManager.voucher
            }
        });
    }

    //保存自己的信息（头像，昵称等）到服务器
    static saveUserInfo(data) {
        console.log("log---------------saveUserInfo-----  data=:", UserManager.user_id,data);
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
    static chanelCheck(query, userId) {
        Http.send({
            url: Http.UrlConfig.CHANEL_RECORD,
            data: {
                user_id: userId,
                channel_id: query.channel_id,
                cuid: query.cuid,
                cvoucher: query.cvoucher,
                cid: query.cid,
                pid: query.pid
            },
            success: (resp) => {
                console.log("渠道验证成功", resp);
            }
        });
    }


    static getSettingConfig() {
        Http.send({
            url: Http.UrlConfig.GET_SETTING,
            success: (resp) => {
                console.log("获取游戏配置=：", resp);
                GameCtr.isAudited =resp.ok;
                GameCtr.setting = resp;
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
                uid: UserManager.user_id,
                voucher: UserManager.voucher,
                encrypted_data: encryptedData,
                iv: iv
            },
            success: (resp) => {
                if (resp.ret == 1) {
                    if (callback) {
                        callback();
                    }
                }else if (resp.ret == 0) {
                    GameCtr.getInstance().getGame().showToast(resp.msg);
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
                if (res.data.videoid) {
                    WXCtr.setVideoAd(res.data.videoid);
                }
                if (res.data.advid) {
                    WXCtr.bannerId = res.data.advid;
                }
            },
            data: {
                uid: UserManager.user_id
            }
        });
    }

    // 邀请好友
    static invitedByFriend(query) {
        Http.send({
            url: Http.UrlConfig.INVITED_BY_FRIEND,
            success: (res) => {
                console.log("log--------------invitedByFriend=:",res);
            },
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
            success: (res) => {
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



    //关注福利
    static channelGift(query) {
        if (query.channel_id == 88 && query.guanzu) {
            //根据自己实际需求处理

        }
    }

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
    static getLoginAwardList(callback = null) {
        Http.send({
            url: Http.UrlConfig.GET_TODAY,
            success: (res) => {
                if (callback) {
                    callback(res)
                }
            },
            data: {
                uid: UserManager.user_id,
                voucher: UserManager.voucher
            }
        });
    }

    //签到
    static sign(callback) {
        Http.send({
            url: Http.UrlConfig.DO_TODAY,
            success: (res) => {
                console.log("log--------res=:", res);
                if (res.m) {
                    callback(res);
                } else {
                    GameCtr.getInstance().getGame().showToast(res.msg);
                }
            },
            data: {
                uid: UserManager.user_id,
                voucher: UserManager.voucher
            }
        });
    }


    static getRankList(type, callback) {
        Http.send({
            url: Http.UrlConfig.GET_RANK_LIST,
            success: (res) => {
                if (res.code == Http.Code.OK) {
                    callback(true);
                } else {
                    ViewManager.toast(res.msg);
                    callback(false);
                }
            },
            data: {
                uid: UserManager.user_id,
                type: type
            }
        });
    }







    static setGold(_gold) {
        Http.send({
            url: Http.UrlConfig.SET_GOLD_DATA,
            success: (res) => {
                if (res.ret == 1) {
                    console.log("log-----------金币上报成功--------------_gold=:", _gold);
                } else {
                    ViewManager.toast(res.msg);
                    console.log("log-----------金币上报失败--------------");
                }
            },
            data: {
                uid: UserManager.user_id,
                voucher: UserManager.voucher,
                gold: _gold
            }
        });
    }

    static setFriendBonusState(idx, value) {
        let sendData = {
            uid: UserManager.user_id,
            voucher: UserManager.voucher
        };
        let key = "data_" + idx;
        sendData[key] = value;
        console.log("log----------setFriendBonusState=:",sendData);
        Http.send({
            url: Http.UrlConfig.SET_GOLD_DATA,
            success: (res) => {
                if (res.ret == 1) {
                    console.log("log------上报领取邀请奖励成功");
                } else {
                    ViewManager.toast(res.msg);
                }
            },
            data: sendData
        });
    }


    static openRed(clickID,callFunc){
        Http.send({
            url: Http.UrlConfig.OPEN_RED,
            success: (res) => {
                if (res.m) {
                    callFunc(res.m);
                } else {
                    GameCtr.getInstance().getGame().showToast(res.msg);
                }
            },
            data: {
                uid: UserManager.user_id,
                voucher: UserManager.voucher,
                clickid:clickID
            }
        });
    }

    
    static doExchange(phoneNumber){
        Http.send({
            url: Http.UrlConfig.DO_EXCHANGE,
            success: (res) => {
                if(res.ret!=1){
                    GameCtr.getInstance().getGame().showToast(res.msg);
                }else{
                    GameCtr.getInstance().getGame().showToast("兑换成功");
                }
            },
            data: {
                uid: UserManager.user_id,
                voucher: UserManager.voucher,
                rewardid:1,
                exchangeUser:phoneNumber,
            }
        });
    }

    static openClick(_clickid){
        Http.send({
            url: Http.UrlConfig.OPEN_CLICK,
            success: (res) => {
                if(res.ret!=1){
                    GameCtr.getInstance().getGame().showToast(res.msg);
                }
                
            },

            data: {
                uid: UserManager.user_id,
                voucher: UserManager.voucher,
                clickid:_clickid,
            }
        });
    }

    // update (dt) {}
}
