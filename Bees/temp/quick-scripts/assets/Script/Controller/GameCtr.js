(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Controller/GameCtr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ea049dlKOtItKkSXQ54e5Sr', 'GameCtr', __filename);
// Script/Controller/GameCtr.ts

Object.defineProperty(exports, "__esModule", { value: true });
//游戏全局控制类
var AudioManager_1 = require("../Common/AudioManager");
var UserManager_1 = require("../Common/UserManager");
var WXCtr_1 = require("./WXCtr");
var Http_1 = require("../Common/Http");
//import Collide from "../View/game/Collide";
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameCtr = /** @class */ (function () {
    function GameCtr() {
        this.eventTarget = null;
        GameCtr_1.ins = this;
        WXCtr_1.default.getLaunchOptionsSync();
        WXCtr_1.default.getAuthSetting();
        WXCtr_1.default.showShareMenu();
        WXCtr_1.default.wxOnLogin();
        WXCtr_1.default.getSelfData();
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
    GameCtr.prototype.setCombsUnlock = function () {
        window.localStorage.setItem("combsUnlock", JSON.stringify(GameCtr_1.combsUnlock));
    };
    GameCtr.prototype.getCombsUnlock = function () {
        return JSON.parse(window.localStorage.getItem("combsUnlock"));
    };
    GameCtr.prototype.setPlayerLevel = function () {
        window.localStorage.setItem("level", GameCtr_1.level);
    };
    GameCtr.prototype.setManufactureLevel = function () {
        window.localStorage.setItem("ManufactureLevel", GameCtr_1.ManufactureLevel);
    };
    GameCtr.prototype.setCombLevel = function () {
        window.localStorage.setItem("comblevel", GameCtr_1.comblevel);
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
        AudioManager_1.default.getInstance().stopAll();
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
            WXCtr_1.default.submitScoreToWx(GameCtr_1.score);
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
    GameCtr.money = null; //玩家已经挣到的钱
    GameCtr.honeyValue = 0; //蜂蜜值
    GameCtr.level = null;
    GameCtr.ManufactureLevel = null;
    GameCtr.comblevel = null;
    GameCtr.combsUnlock = null;
    GameCtr.levelMoney = 0;
    GameCtr.levelConfig = null;
    GameCtr.manufactureConfig = null;
    GameCtr.combConfig = null;
    GameCtr.otherConfig = null;
    GameCtr = GameCtr_1 = __decorate([
        ccclass
    ], GameCtr);
    return GameCtr;
    var GameCtr_1;
}());
exports.default = GameCtr;

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
        //# sourceMappingURL=GameCtr.js.map
        