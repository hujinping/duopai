"use strict";
cc._RF.push(module, 'ea049dlKOtItKkSXQ54e5Sr', 'GameCtr');
// Script/Controller/GameCtr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var UserManager_1 = require("../Common/UserManager");
var WXCtr_1 = require("./WXCtr");
var Http_1 = require("../Common/Http");
//import Collide from "../View/game/Collide";
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameCtr = /** @class */ (function () {
    function GameCtr() {
        this.eventTarget = null;
        GameCtr_1.ins = this;
        WXCtr_1.default.getSystemInfo();
        WXCtr_1.default.getLaunchOptionsSync();
        WXCtr_1.default.createUserInfoBtn();
        WXCtr_1.default.getAuthSetting();
        WXCtr_1.default.showShareMenu();
        WXCtr_1.default.wxOnLogin();
        GameCtr_1.honeyPool = new cc.NodePool();
        GameCtr_1.jarPool = new cc.NodePool();
        GameCtr_1.bubbleMoneyPool = new cc.NodePool();
    }
    GameCtr_1 = GameCtr;
    GameCtr.getInstance = function () {
        if (!GameCtr_1.ins) {
            GameCtr_1.ins = new GameCtr_1();
        }
        return GameCtr_1.ins;
    };
    GameCtr.prototype.getAdaptScaleRate = function () {
        var visibleSize = cc.view.getFrameSize();
        var height = 1920 * visibleSize.width / 1080;
        var scaleRate = visibleSize.height / height;
        return scaleRate;
    };
    GameCtr.prototype.initEventTarget = function () {
        this.eventTarget = new cc.EventTarget();
    };
    GameCtr.prototype.getEventTarget = function () {
        return this.eventTarget;
    };
    GameCtr.prototype.emitEvent = function (event, data) {
        this.eventTarget.emit(event, data);
    };
    GameCtr.prototype.addListener = function (event, callFunc) {
        this.eventTarget.on(event, callFunc);
    };
    GameCtr.prototype.removeListener = function (event) {
        this.eventTarget.off(event);
    };
    GameCtr.prototype.setLoading = function (loading) {
        this.mLoading = loading;
    };
    GameCtr.prototype.getLoding = function () {
        return this.mLoading;
    };
    //设置game实例(游戏)
    GameCtr.prototype.setGame = function (game) {
        this.mGame = game;
    };
    //设置蜜蜂工厂实例
    GameCtr.prototype.setManufacture = function (manufacture) {
        this.mManufacture = manufacture;
    };
    //设置end实例（结束）
    GameCtr.prototype.setLevel = function (level) {
        this.mLevel = level;
    };
    GameCtr.prototype.setRanking = function (ranking) {
        this.mRanking = ranking;
    };
    GameCtr.prototype.getRanking = function () {
        return this.mRanking;
    };
    GameCtr.prototype.setCombsUnlock = function () {
        window.localStorage.setItem("combsUnlock", JSON.stringify(GameCtr_1.combsUnlock));
    };
    GameCtr.prototype.getCombsUnlock = function () {
        return window.localStorage.getItem("combsUnlock");
    };
    GameCtr.prototype.setPlayerLevel = function () {
        window.localStorage.setItem("level", GameCtr_1.level);
    };
    GameCtr.prototype.getPlayerLevel = function () {
        return Number(window.localStorage.getItem("level"));
    };
    GameCtr.prototype.setManufactureLevel = function () {
        window.localStorage.setItem("ManufactureLevel", GameCtr_1.ManufactureLevel);
    };
    GameCtr.prototype.getManufactureLevel = function () {
        return Number(window.localStorage.getItem("ManufactureLevel"));
    };
    GameCtr.prototype.setCombLevel = function () {
        window.localStorage.setItem("comblevel", GameCtr_1.comblevel);
    };
    GameCtr.prototype.getCombLevel = function () {
        return Number(window.localStorage.getItem("comblevel"));
    };
    GameCtr.prototype.setTimestamp = function () {
        window.localStorage.setItem("timestamp", Date.now().toString());
    };
    GameCtr.prototype.setPlayTimes = function () {
        var playTimes = window.localStorage.getItem("playTimes");
        if (!playTimes) {
            window.localStorage.setItem("playTimes", 1 + "");
        }
        else {
            window.localStorage.setItem("playTimes", Number(playTimes) + 1 + "");
        }
    };
    GameCtr.prototype.getPlayTimes = function () {
        return window.localStorage.getItem("playTimes");
    };
    GameCtr.prototype.getTimestamp = function () {
        return Number(window.localStorage.getItem("timestamp"));
    };
    GameCtr.prototype.setMoney = function () {
        window.localStorage.setItem("money", GameCtr_1.money + "");
    };
    GameCtr.prototype.getMoney = function () {
        return Number(window.localStorage.getItem("money"));
    };
    GameCtr.prototype.setRich = function () {
        window.localStorage.setItem("rich", GameCtr_1.rich + "");
    };
    GameCtr.prototype.getRich = function () {
        return Number(window.localStorage.getItem("rich"));
    };
    GameCtr.prototype.setLevelMoney = function () {
        window.localStorage.setItem("levelMoney", GameCtr_1.levelMoney + "");
    };
    GameCtr.prototype.getLevelMoney = function () {
        return Number(window.localStorage.getItem("levelMoney"));
    };
    GameCtr.prototype.setHoneyValue = function () {
        window.localStorage.setItem("honeyValue", GameCtr_1.honeyValue + "");
    };
    GameCtr.prototype.getHoneyValue = function () {
        return Number(window.localStorage.getItem("honeyValue"));
    };
    GameCtr.prototype.setGuide = function () {
        window.localStorage.setItem("guide", JSON.stringify(GameCtr_1.guide));
    };
    GameCtr.prototype.getGuide = function () {
        return JSON.parse(window.localStorage.getItem("guide"));
    };
    GameCtr.prototype.getGame = function () {
        return this.mGame;
    };
    GameCtr.prototype.getManufacture = function () {
        return this.mManufacture;
    };
    GameCtr.prototype.getLevel = function () {
        return this.mLevel;
    };
    //场景切换
    GameCtr.gotoScene = function (sceneName) {
        cc.director.loadScene(sceneName);
        //AudioManager.getInstance().stopAll();
    };
    //显示结束界面
    GameCtr.showEnd = function () {
        GameCtr_1.gotoScene("End");
    };
    //显示开始界面
    GameCtr.showStart = function () {
        GameCtr_1.gotoScene("Start");
    };
    // 显示最想王者
    GameCtr.showStrongest = function () {
        GameCtr_1.gotoScene("Strongest");
    };
    //显示复活界面
    GameCtr.showRevive = function () {
        if (GameCtr_1.ins) {
            //GameCtr.ins.mGame.showRevive();
        }
    };
    //根据图片路径设置sprite的spriteFrame
    GameCtr.loadImg = function (spr, imgUrl) {
        cc.loader.load({
            url: imgUrl,
            type: 'png'
        }, function (err, texture) {
            spr.spriteFrame = new cc.SpriteFrame(texture);
        });
    };
    //开始游戏
    GameCtr.startGame = function () {
        GameCtr_1.score = 0;
        GameCtr_1.gotoScene("Game");
    };
    //显示排行榜
    GameCtr.showRanking = function (entrance) {
        GameCtr_1.rankingEntrance = entrance;
        GameCtr_1.gotoScene("Ranking");
    };
    //复活继续游戏
    GameCtr.revive = function () {
        //GameCtr.surplusReviveTimes--;
        //复活逻辑自己处理...
    };
    //播放背景音乐
    GameCtr.playBgm = function () {
        // AudioManager.getInstance().playMusic("audio/bgm", true, 1); 
    };
    //增加分数
    GameCtr.addScore = function (num) {
        if (GameCtr_1.ins) {
            GameCtr_1.score += num;
        }
    };
    //游戏结束
    GameCtr.gameOver = function () {
        if (GameCtr_1.ins) {
            //WXCtr.submitScoreToWx(GameCtr.score);
            //HttpCtr.sendScore();
            // if(GameCtr.surplusReviveTimes > 0) {
            //     GameCtr.showRevive();
            // }
        }
    };
    GameCtr.prototype.saveSelfInfoToLocal = function (info) {
        var selfInfo = {
            avatarUrl: info.avatarUrl,
            city: info.city,
            country: info.country,
            gender: info.gender,
            language: info.language,
            nickName: info.nickName,
            province: info.province,
        };
        window.localStorage.setItem("selfInfo", JSON.stringify(selfInfo));
    };
    GameCtr.prototype.getSelfInfoFromLocal = function () {
        var selfInfo = window.localStorage.getItem("selfInfo");
        if (!selfInfo) {
            return;
        }
        ;
        return JSON.parse(selfInfo);
    };
    //获取广告配置
    GameCtr.getSliderConfig = function (slideType) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_ALL_SLIDES,
            success: function (resp) {
                console.log("getSlider数据", resp);
                if (slideType == "index") {
                    // GameCtr.otherData=resp.data;
                    // GameCtr.ins.mStart.showSlide(resp.data);
                }
                else if (slideType == "settlement") {
                    //GameCtr.ins.mEnd.showSlider(resp.data);
                }
                else if (slideType == "nav") {
                    GameCtr_1.newGameData = resp.data;
                }
            },
            data: {
                slide_type: slideType
            }
        });
    };
    GameCtr.showLoading = function (showMask) {
        if (showMask === void 0) { showMask = true; }
        if (window.wx != undefined) {
            wx.showLoading({
                title: "疯狂加载中",
                mask: showMask
            });
        }
    };
    GameCtr.hideLoading = function () {
        if (window.wx != undefined) {
            wx.hideLoading();
        }
    };
    //分享到群检测
    GameCtr.shareGroupCheck = function (encryptedData, iv, type) {
        Http_1.default.send({
            url: Http_1.default.UrlConfig.SHARE_GROUP,
            data: {
                user_id: UserManager_1.default.user_id,
                encrypted_data: encryptedData,
                iv: iv
            },
            success: function (resp) {
                console.log("分享到群成功", resp);
                console.log(resp.code == 403);
                if (resp.code == 200) {
                    // console.log('走到200');
                    // if(type=='collide'){
                    //     GameCtr.ins.mCollide.shareOk()
                    // }else{
                    //     GameCtr.getGold("group");
                    // }
                }
                else if (resp.code == 403) {
                    // if(type == 'collide'){
                    //     console.log('222222222')
                    //     GameCtr.shareTip('今天已分享过该群，暂无奖励');
                    // }else{
                    //     GameCtr.reviveTip("今天已经分享过这个了！");
                    // }
                }
            }
        });
    };
    //登录游戏
    GameCtr.login = function (code, info, showWorldRanking) {
        if (showWorldRanking === void 0) { showWorldRanking = false; }
        Http_1.default.send({
            url: Http_1.default.UrlConfig.LOGIN,
            success: function (resp) {
                if (resp.code == Http_1.default.Code.OK) {
                    UserManager_1.default.user_id = resp.data.user_id;
                    // if (showWorldRanking) {
                    //     GameCtr.getInstance().getRanking().showWorldRanking();
                    //     console.log("log-------------showWorldRanking-----------");
                    //     GameCtr.getInstance().getRanking().initSelfInfo();
                    // }
                    // Http.send({
                    //     url: Http.UrlConfig.SAVE_INFO,
                    //     data:
                    //     {
                    //         avatar_url: info.avatarUrl,
                    //         city: info.city,
                    //         country: info.country,
                    //         gender: info.gender,
                    //         language: info.language,
                    //         nick_name: info.nickName,
                    //         user_id: UserManager.user_id,
                    //         province: info.province,
                    //     },
                    //     success: () => {
                    //         GameCtr.getShareSwitch();               //登录成功，获取分享开关
                    //         GameCtr.getRandomUser();
                    //         GameCtr.getGameOverShareSwitch();
                    //         console.log("渠道验证成功111", WXCtr.launchOption.query);
                    //         GameCtr.chanelCheck(WXCtr.launchOption.query.channel_id, UserManager.user_id);
                    //         GameCtr.seekJion(WXCtr.launchOption.query.Send_user_id, WXCtr.launchOption.query.isInvite);
                    //         GameCtr.getToolInfo();
                    //         
                    //         GameCtr.getUserInfoCtr();
                    //     }
                    // });
                }
            },
            data: {
                code: code
            }
        });
    };
    GameCtr.selfInfo = null;
    GameCtr.isAudited = false; //已审核
    GameCtr.reviveTimes = 0; //第几次复活
    GameCtr.globalSpeedRate = 1; //游戏全局加速
    GameCtr.incomeRate = 1; //收益倍率
    GameCtr.score = 0;
    GameCtr.rankingEntrance = "Start"; //排行榜界面入口，默认开始界面
    GameCtr.navigatorData = null; //更多游戏导航数据
    GameCtr.challengerData = null; //挑战者信息
    GameCtr.challengeSwitch = false; //挑战开关(有人发起挑战时为true)
    GameCtr.reviveData = null;
    GameCtr.maxPerCombLevel = 30; //最大蜂巢等级
    GameCtr.maxCombsCount = 30; //蜂巢最大数量
    GameCtr.maxPlayerLevel = 145; //人物最大等级
    GameCtr.maxManufactureLevel = 300; //生产线等级
    GameCtr.money = 0; //玩家已经挣到的钱(只是还剩的钱，不包括生产线等级 和蜂巢 )
    GameCtr.levelMoney = 0;
    GameCtr.rich = 0; //玩家总财富
    GameCtr.honeyValue = 0; //蜂蜜值
    GameCtr.level = null;
    GameCtr.ManufactureLevel = null;
    GameCtr.comblevel = null;
    GameCtr.combsUnlock = null;
    GameCtr.levelConfig = null;
    GameCtr.manufactureConfig = null;
    GameCtr.combConfig = null;
    GameCtr.pfTurnTableConfig = null;
    GameCtr.otherConfig = null;
    GameCtr.setting = null;
    GameCtr.upper_boundary = null;
    GameCtr.lower_boundary = null;
    GameCtr.newGameData = null;
    GameCtr.guide = null;
    GameCtr.tipHandTag = 1500;
    GameCtr.realMoney = null;
    GameCtr.vedioTimes = 6;
    GameCtr.honeyPool = null;
    GameCtr.jarPool = null;
    GameCtr.bubbleMoneyPool = null;
    GameCtr.isGetSetting = false;
    GameCtr.advTime = 120;
    GameCtr.advVedioTime = 60;
    GameCtr.clickType = {
        speedUp: 1,
        invite: 2,
        more: 3,
        ufo: 4,
        attention: 5,
        shop: 6,
        rank: 7,
        buy: 8,
        goldNotEnoughShare: 9,
        offLineShare: 10,
        offLineVedio: 11,
        pfTurntable: 12,
    };
    GameCtr = GameCtr_1 = __decorate([
        ccclass
    ], GameCtr);
    return GameCtr;
    var GameCtr_1;
}());
exports.default = GameCtr;

cc._RF.pop();