"use strict";
cc._RF.push(module, 'f1f06VxNc1Fi7PAUDkZyb/2', 'Game');
// Script/UI/game/Game.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 游戏界面
 * 游戏逻辑自己实现
 */
var GameCtr_1 = require("../../Controller/GameCtr");
var WXCtr_1 = require("../../Controller/WXCtr");
// import ViewManager from "../../Common/ViewManager";
var HttpCtr_1 = require("../../Controller/HttpCtr");
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._honeycombContent = null;
        _this._pipelineNode = null;
        _this._glassPipelineNode = null;
        _this._noticeNode = null;
        _this._authTipNode = null;
        _this._bonusFrame = null;
        _this._btn_bonus = null;
        _this._btn_pfTurntable = null;
        _this._btn_upSpeed = null;
        _this._btn_rank = null;
        _this._btn_sevenLogin = null;
        _this._btn_exchange = null;
        _this._btn_invite = null;
        _this._btn_more = null;
        _this._lb_upSpeedTime = null;
        _this._lb_money = null;
        _this._lb_notice = null;
        _this._exchange = null;
        _this._mask = null;
        _this._combUpgrade = null;
        _this._otherNode = null;
        _this._carouselNode = null;
        _this._carouselIndex = 0;
        _this._interval3 = 0;
        _this._pfTurnableTime = 0;
        _this._manufactureUpgrade = null;
        _this._ufoTime = 0;
        _this._timeCount = -1;
        _this._speedTime = -1;
        _this._bannerTime = 0;
        _this._combList = [];
        _this._pusgMsg = [];
        _this._carouseAds = [];
        _this._canUpSpeed = true;
        _this.honeyComb = null;
        _this.pipeline = null;
        _this.glassPipeline = null;
        _this.rocket = null;
        _this.offlineIncome = null;
        _this.pfTurntable = null;
        _this.toast = null;
        _this.tipHand = null;
        _this.signIn = null;
        _this.invite = null;
        _this.exchange = null;
        _this.moreNode = null;
        _this.ufo = null;
        _this.ranking = null;
        _this.bubbleHoney = null;
        _this.goldNotEnough = null;
        _this.bgMusic = null;
        _this.ad = null;
        return _this;
    }
    Game.prototype.onLoad = function () {
        GameCtr_1.default.getInstance().setGame(this);
        GameCtr_1.default.getInstance().initEventTarget();
        this.initEvent();
        this.initNode();
        this.initBubbleHoneys();
        this.setRealMoney(0);
        this.checkOffline();
        GameCtr_1.default.getInstance().setPlayTimes();
        WXCtr_1.default.getFriendRankingData(); //获取好友排行榜数据
        this.commitDataToServer();
        this.scheduleOnce(this.updateGameData.bind(this), 1);
        this.initBgMusic();
        this.refreshBanner();
    };
    Game.prototype.start = function () {
        //GameCtr.hideLoading();
    };
    Game.prototype.initBgMusic = function () {
        while (this.node.getChildByTag(999999)) {
            this.node.removeChildByTag(999999);
        }
        var bgMusic = cc.instantiate(this.bgMusic);
        bgMusic.parent = this.node;
        bgMusic.tag = 999999;
    };
    Game.prototype.initEvent = function () {
        var _this = this;
        cc.game.on(cc.game.EVENT_SHOW, function () {
            _this.checkOffline();
            _this.initBgMusic();
        });
        cc.game.on(cc.game.EVENT_HIDE, function () {
            GameCtr_1.default.getInstance().setTimestamp();
        });
    };
    Game.prototype.initNode = function () {
        this._otherNode = this.node.getChildByName("otherNode");
        this._mask = this._otherNode.getChildByName("mask");
        this._bonusFrame = this._otherNode.getChildByName("bonusFrame");
        this._btn_pfTurntable = this._bonusFrame.getChildByName("btn_pfTurntable");
        this._btn_sevenLogin = this._bonusFrame.getChildByName("btn_sevenLogin");
        this._btn_invite = this._bonusFrame.getChildByName("btn_invite");
        this._btn_rank = this._bonusFrame.getChildByName("btn_rank");
        this._btn_bonus = this._otherNode.getChildByName("btn_bonus");
        this._btn_upSpeed = this._otherNode.getChildByName("btn_speedUp");
        this._btn_more = this._otherNode.getChildByName("btn_more");
        this._exchange = this._otherNode.getChildByName("exchange");
        this._carouselNode = this._otherNode.getChildByName("carouselNode");
        this._btn_exchange = this._exchange.getChildByName("btn_exchange");
        this._lb_money = this._otherNode.getChildByName("exchange").getChildByName("lb_money");
        this._lb_upSpeedTime = this._otherNode.getChildByName("lb_upSpeedTime");
        this._authTipNode = this.node.getChildByName("authTipNode");
        this._honeycombContent = this.node.getChildByName("honeycombNode").getChildByName("content");
        this._pipelineNode = this._honeycombContent.getChildByName("pipelineNode");
        this._glassPipelineNode = this._honeycombContent.getChildByName("glassPipelineNode");
        this._btn_bonus.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.p(20, 0)), cc.moveBy(0.5, cc.p(-20, 0)))));
        this._btn_upSpeed.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.2, 1.15), cc.scaleTo(0.2, 1.0))));
        this._btn_more.runAction(cc.repeatForever(cc.sequence(cc.rotateBy(0.1, -10), cc.rotateBy(0.2, 20), cc.rotateBy(0.1, -10), cc.rotateBy(0.05, -10), cc.rotateBy(0.1, 20), cc.rotateBy(0.05, -10), cc.delayTime(2))));
        this._lb_upSpeedTime.active = false;
        this._authTipNode.active = false;
        this._pipelineNode.tag = 1000;
        this._glassPipelineNode.tag = 1000;
        this._otherNode.setLocalZOrder(1);
        this._glassPipelineNode.setLocalZOrder(0);
        this._pipelineNode.setLocalZOrder(10);
        this.initCombContentEvent();
        this.initBtnEvent(this._btn_bonus);
        this.initBtnEvent(this._btn_pfTurntable);
        this.initBtnEvent(this._btn_sevenLogin);
        this.initBtnEvent(this._btn_invite);
        this.initBtnEvent(this._btn_upSpeed);
        this.initBtnEvent(this._btn_rank);
        this.initBtnEvent(this._btn_exchange);
        this.initBtnEvent(this._btn_more);
        this._btn_sevenLogin.active = GameCtr_1.default.isAudited;
        this._btn_pfTurntable.active = GameCtr_1.default.isAudited;
        this._btn_invite.active = GameCtr_1.default.isAudited;
        this._exchange.active = GameCtr_1.default.isAudited;
        this._btn_more.active = GameCtr_1.default.isAudited;
        this._btn_upSpeed.active = GameCtr_1.default.isAudited;
        this._btn_bonus.active = GameCtr_1.default.isAudited;
        this._btn_upSpeed.active = true;
        this.initCombs();
        this.initCarousel();
    };
    Game.prototype.initCarousel = function () {
        var _this = this;
        if (!GameCtr_1.default.isAudited) {
            return;
        }
        if (!GameCtr_1.default.setting.nav.navB || GameCtr_1.default.setting.nav.navB <= 0) {
            return;
        }
        for (var i = 0; i < GameCtr_1.default.setting.nav.navB.length; i++) {
            var ad = cc.instantiate(this.ad);
            ad.parent = this._carouselNode;
            ad.scale = 1.0;
            ad.x = i == 0 ? 0 : -1800;
            ad.getComponent("ad").init(GameCtr_1.default.setting.nav.navB[i]);
            this._carouseAds.push(ad);
        }
        this._carouselIndex = 0;
        this.scheduleOnce(function () {
            _this._carouseAds[_this._carouselIndex].getComponent("ad").doScale();
        }, 2);
        this.scheduleOnce(this.doCarousel.bind(this), 5);
    };
    Game.prototype.doCarousel = function () {
        if (this._carouseAds.length <= 1) { //广告位推荐位大于1个，才有轮播功能
            return;
        }
        this._carouseAds[this._carouselIndex].x = 0;
        this._carouseAds[this._carouselIndex].getComponent("ad").doScale();
        for (var i = 0; i < this._carouseAds.length; i++) {
            if (i == this._carouselIndex) {
                continue;
            }
            this._carouseAds[i].scale = 1;
            this._carouseAds[i].getComponent("ad").stopActions();
            this._carouseAds[i].x = -1800; //移除屏幕之外
        }
        this._carouselIndex++;
        this._carouselIndex = this._carouselIndex % this._carouseAds.length;
        this.scheduleOnce(this.doCarousel.bind(this), 5);
    };
    Game.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            AudioManager_1.default.getInstance().playSound("audio/open_panel");
            if (e.target.getName() == "btn_speedUp") {
                if (!_this._btn_upSpeed.getComponent(cc.Button).interactable) {
                    return;
                }
                if (GameCtr_1.default.globalSpeedRate > 1) {
                    _this.showToast("正在加速中...");
                    return;
                }
                var callFunc_1 = function () {
                    GameCtr_1.default.globalSpeedRate = 2;
                    GameCtr_1.default.getInstance().getManufacture().resetLineAction();
                    _this._speedTime = 0;
                    _this.startSpeedUpTimer(GameCtr_1.default.otherConfig.speedUpPersist);
                    _this._btn_upSpeed.getComponent(cc.Button).interactable = false;
                    _this._btn_upSpeed.stopAllActions();
                    _this._canUpSpeed = false;
                };
                _this._bonusFrame.active = false;
                if (GameCtr_1.default.vedioTimes <= 0) {
                    if (!GameCtr_1.default.isAudited) {
                        GameCtr_1.default.getInstance().getGame().showToast("今日视频已看完");
                        return;
                    }
                    WXCtr_1.default.share({ callback: callFunc_1 });
                }
                else {
                    WXCtr_1.default.offCloseVideo();
                    WXCtr_1.default.showVideoAd();
                    WXCtr_1.default.onCloseVideo(function (res) {
                        console.log("log------------dianji------res=:", res);
                        if (res) {
                            callFunc_1();
                        }
                        else {
                            _this.showToast("视频未看完，无法领取奖励");
                        }
                    });
                }
                HttpCtr_1.default.openClick(GameCtr_1.default.clickType.speedUp);
            }
            else if (e.target.getName() == "btn_rank") {
                _this._bonusFrame.active = false;
                if (cc.find("Canvas").getChildByName("ranking")) {
                    return;
                }
                var ranking = cc.instantiate(_this.ranking);
                ranking.parent = cc.find("Canvas");
                ranking.setLocalZOrder(10);
                HttpCtr_1.default.openClick(GameCtr_1.default.clickType.rank);
            }
            else if (e.target.getName() == "btn_pfTurntable") {
                _this._bonusFrame.active = false;
                if (!_this._btn_pfTurntable.getComponent(cc.Button).interactable) {
                    _this.showToast("转盘冷却中...");
                    return;
                }
                if (cc.find("Canvas").getChildByName("pfTurntable")) {
                    return;
                }
                var pfTurntable_1 = cc.instantiate(_this.pfTurntable);
                pfTurntable_1.setLocalZOrder(1);
                pfTurntable_1.parent = cc.find("Canvas");
            }
            else if (e.target.getName() == "btn_sevenLogin") {
                _this._bonusFrame.active = false;
                if (cc.find("Canvas").getChildByName("signIn")) {
                    return;
                }
                _this.setMaskVisit(true);
                var signin = cc.instantiate(_this.signIn);
                signin.parent = cc.find("Canvas");
                signin.setLocalZOrder(1);
            }
            else if (e.target.getName() == "btn_invite") {
                _this._bonusFrame.active = false;
                if (cc.find("Canvas").getChildByName("invite")) {
                    return;
                }
                _this.setMaskVisit(true);
                var invite = cc.instantiate(_this.invite);
                invite.parent = cc.find("Canvas");
                invite.setLocalZOrder(1);
                HttpCtr_1.default.openClick(GameCtr_1.default.clickType.invite);
            }
            else if (e.target.getName() == "btn_exchange") {
                _this._bonusFrame.active = false;
                if (cc.find("Canvas").getChildByName("exchange1")) {
                    return;
                }
                var exchange = cc.instantiate(_this.exchange);
                exchange.parent = cc.find("Canvas");
                exchange.setLocalZOrder(1);
            }
            else if (e.target.getName() == "btn_more") {
                _this._bonusFrame.active = false;
                if (cc.find("Canvas").getChildByName("moreNode")) {
                    return;
                }
                var moreNode = cc.instantiate(_this.moreNode);
                moreNode.parent = cc.find("Canvas");
                moreNode.setLocalZOrder(1);
                HttpCtr_1.default.openClick(GameCtr_1.default.clickType.more);
            }
            else if (e.target.getName() == "btn_bonus") {
                _this._bonusFrame.active = !_this._bonusFrame.active;
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_END, function (e) {
            _this._bonusFrame.active = false;
        });
    };
    Game.prototype.initBubbleHoneys = function () {
        for (var i = 0; i < 5; i++) {
            var bubbleHoney = cc.instantiate(this.bubbleHoney);
            GameCtr_1.default.honeyPool.put(bubbleHoney);
        }
    };
    Game.prototype.initCombContentEvent = function () {
        var _this = this;
        this._honeycombContent.on(cc.Node.EventType.TOUCH_START, function (e) {
        });
        this._honeycombContent.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            if (_this._honeycombContent.y <= 0 && e.touch._point.y - e.touch._prevPoint.y < 0) {
                return;
            }
            if (_this._honeycombContent.y >= 408 * (GameCtr_1.default.comblevel + 4) && e.touch._point.y - e.touch._prevPoint.y > 0) {
                return;
            }
            _this._honeycombContent.y += (e.touch._point.y - e.touch._prevPoint.y);
            if (_this._honeycombContent.y <= 0) {
                _this._honeycombContent.y = 0;
            }
            if (_this._honeycombContent.y >= 408 * (GameCtr_1.default.comblevel + 4)) {
                _this._honeycombContent.y = 408 * (GameCtr_1.default.comblevel + 4);
            }
        });
        this._honeycombContent.on(cc.Node.EventType.TOUCH_END, function (e) {
        });
        this._honeycombContent.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
        });
    };
    Game.prototype.initCombs = function () {
        for (var level = 0; level < GameCtr_1.default.comblevel + 5; level++) { //
            this.initComb(level);
        }
        this._honeycombContent.setContentSize(cc.size(1080, 408 * (GameCtr_1.default.comblevel + 5) + 200));
    };
    Game.prototype.initComb = function (level) {
        var combsUnlock = JSON.parse(GameCtr_1.default.getInstance().getCombsUnlock());
        var pipeline = cc.instantiate(this.pipeline);
        var honeyComb = cc.instantiate(this.honeyComb);
        var glassPipeline = cc.instantiate(this.glassPipeline);
        pipeline.parent = this._pipelineNode;
        honeyComb.parent = this._honeycombContent;
        glassPipeline.parent = this._glassPipelineNode;
        pipeline.x = -460;
        pipeline.y = -190 - 408 * level;
        honeyComb.x = 60;
        honeyComb.y = -220 - 408 * level;
        glassPipeline.x = -492;
        glassPipeline.y = -190 - 408 * level;
        var unlockNum = combsUnlock[level] ? combsUnlock[level].level : 0;
        var unlock = combsUnlock[level] ? combsUnlock[level].unlock : false;
        honeyComb.tag = level;
        honeyComb.setLocalZOrder(2);
        honeyComb.getComponent("honeycomb").setLevel(level + 1, unlockNum, unlock);
        honeyComb.getComponent("honeycomb").initBtn();
        this._combList.push(honeyComb);
    };
    Game.prototype.unlockComb = function () {
        if (GameCtr_1.default.comblevel >= 30) {
            return;
        }
        GameCtr_1.default.comblevel++;
        GameCtr_1.default.getInstance().getManufacture().doCaculateHoneyJar();
        var comb = this.getComb(GameCtr_1.default.comblevel);
        var preComb = this.getComb(GameCtr_1.default.comblevel - 1);
        if (preComb && preComb.getComponent("honeycomb").getUnlock()) {
            comb.getComponent("honeycomb").showUnlockBtn(true);
        }
        if (GameCtr_1.default.comblevel + 4 < 30) {
            this.initComb(GameCtr_1.default.comblevel + 4);
            this._honeycombContent.setContentSize(cc.size(1080, 408 * (GameCtr_1.default.comblevel + 5) + 200));
            GameCtr_1.default.getInstance().setCombLevel();
        }
    };
    Game.prototype.startSpeedUpTimer = function (_timeCount) {
        this._timeCount = _timeCount;
        this._lb_upSpeedTime.active = true;
        GameCtr_1.default.getInstance().emitEvent("startSpeedUp", null);
        this.setCombsSpeed(2);
        this.countDown();
    };
    Game.prototype.countDown = function () {
        var _this = this;
        this._lb_upSpeedTime.stopAllActions();
        var minStr = Math.floor(this._timeCount / 60) < 10 ? "0" + Math.floor(this._timeCount / 60) : "" + Math.floor(this._timeCount / 60);
        var secStr = this._timeCount % 60 < 10 ? "0" + this._timeCount % 60 : "" + this._timeCount % 60;
        this._lb_upSpeedTime.getComponent(cc.Label).string = minStr + ":" + secStr;
        this._lb_upSpeedTime.runAction(cc.repeat(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
            _this._timeCount -= 1;
            var minStr = Math.floor(_this._timeCount / 60) < 10 ? "0" + Math.floor(_this._timeCount / 60) : "" + Math.floor(_this._timeCount / 60);
            var secStr = _this._timeCount % 60 < 10 ? "0" + _this._timeCount % 60 : "" + _this._timeCount % 60;
            _this._lb_upSpeedTime.getComponent(cc.Label).string = minStr + ":" + secStr;
            if (_this._timeCount < 0) {
                _this.setCombsSpeed(1);
                GameCtr_1.default.globalSpeedRate = 1;
                _this._btn_upSpeed.getComponent(cc.Button).interactable = false;
                _this._btn_upSpeed.stopAllActions();
                _this._lb_upSpeedTime.active = false;
                GameCtr_1.default.getInstance().getManufacture().resetLineAction();
                GameCtr_1.default.getInstance().emitEvent("stopSpeedUp", null);
                _this._lb_upSpeedTime.stopAllActions();
                if (_this._canUpSpeed) {
                    _this._btn_upSpeed.getComponent(cc.Button).interactable = true;
                    _this._btn_upSpeed.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.2, 1.15), cc.scaleTo(0.2, 1.0))));
                }
            }
        })), this._timeCount + 2));
    };
    Game.prototype.stopUpSpeedAction = function () {
        this._btn_upSpeed.getComponent(cc.Button).interactable = false;
        this._btn_upSpeed.stopAllActions();
    };
    Game.prototype.showGoldNotEnough = function () {
        if (!GameCtr_1.default.isAudited) {
            return;
        }
        ;
        if (cc.find("Canvas").getChildByName("goldNotEnough")) {
            return;
        }
        ;
        var goldNotEnough = cc.instantiate(this.goldNotEnough);
        goldNotEnough.parent = cc.find("Canvas");
        goldNotEnough.setLocalZOrder(1);
    };
    Game.prototype.refreshBanner = function () {
        this._bannerTime++;
        if (this._bannerTime >= GameCtr_1.default.advTime) {
            WXCtr_1.default.setBannerAd(100, 300);
            this._bannerTime = 0;
        }
        this.scheduleOnce(this.refreshBanner.bind(this), 1);
    };
    Game.prototype.getCurSpeedUpTime = function () {
        return this._timeCount;
    };
    Game.prototype.checkOffline = function () {
        if (!GameCtr_1.default.getInstance().getPlayTimes()) {
            return;
        }
        if (cc.find("Canvas").getChildByName("offlineIncome")) {
            return;
        }
        var offlineTime = (Date.now() - GameCtr_1.default.getInstance().getTimestamp()) / 1000;
        if (offlineTime < 120) {
            return;
        }
        offlineTime = offlineTime > (8 * 60 * 60) ? 8 * 60 * 60 : offlineTime;
        var offlineIncome = cc.instantiate(this.offlineIncome);
        offlineIncome.parent = cc.find("Canvas");
        offlineIncome.setLocalZOrder(1);
        offlineIncome.getComponent("offlineIncome").init(offlineTime);
    };
    Game.prototype.getComb = function (combLevel) {
        return this._honeycombContent.getChildByTag(combLevel - 1);
    };
    Game.prototype.setMaskVisit = function (isVisit) {
        this._mask.active = isVisit;
    };
    Game.prototype.setRealMoney = function (add) {
        GameCtr_1.default.realMoney += add;
        var notice = cc.find("Canvas").getChildByName("noticeNode");
        notice.getComponent("notice").addNotice(add);
        if (GameCtr_1.default.realMoney) {
            this._lb_money.getComponent(cc.Label).string = (GameCtr_1.default.realMoney / 100).toFixed(2);
        }
    };
    Game.prototype.showAuthTip = function () {
        this._authTipNode.active = true;
    };
    Game.prototype.hideAuthTip = function () {
        this._authTipNode.active = false;
    };
    Game.prototype.setCombUpgrade = function (node) {
        this._combUpgrade = node;
    };
    Game.prototype.setManufactureUpgrade = function (node) {
        this._manufactureUpgrade = node;
    };
    Game.prototype.clearCombUpGrade = function () {
        this._combUpgrade = null;
    };
    Game.prototype.clearManufactureUpgrade = function () {
        this._manufactureUpgrade = null;
    };
    Game.prototype.showToast = function (msg) {
        if (cc.find("Canvas").getChildByName("toast")) {
            return;
        }
        var toast = cc.instantiate(this.toast);
        toast.parent = cc.find("Canvas");
        toast.setLocalZOrder(1000);
        toast.getComponent("toast").show(msg);
        toast.runAction(cc.sequence(cc.delayTime(1.0), cc.fadeOut(0.3), cc.callFunc(function () {
            toast.destroy();
        })));
    };
    Game.prototype.noticeMoneyUpdate = function () {
        for (var i = 0; i < GameCtr_1.default.comblevel; i++) {
            GameCtr_1.default.getInstance().emitEvent("moneyUpdate" + (i + 1), null);
        }
    };
    Game.prototype.setCombsSpeed = function (rate) {
        for (var i = 0; i < this._combList.length; i++) {
            this._combList[i].getComponent("honeycomb").setSpeedRate(rate);
        }
    };
    /**********************guide start *********************/
    Game.prototype.createTipHand = function (parent) {
        var tipHand = cc.instantiate(this.tipHand);
        tipHand.parent = parent;
        var sp = tipHand.getChildByName("sp");
        sp.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.3), cc.callFunc(function () {
            sp.y += 40;
        }), cc.delayTime(0.3), cc.callFunc(function () {
            sp.y -= 40;
        }))));
        return tipHand;
    };
    Game.prototype.showGuideStep1 = function () {
        var hand = this.createTipHand(cc.find("Canvas"));
        hand.tag = GameCtr_1.default.tipHandTag + 1;
        hand.active = false;
        hand.scale = 0.6;
        hand.x = 200;
        hand.y = 300;
        this.scheduleOnce(function () {
            hand.active = true;
        }, 3);
    };
    Game.prototype.showGuideStep2 = function () {
        var hand = this.createTipHand(this.getComb(1));
        hand.setLocalZOrder(50);
        hand.tag = GameCtr_1.default.tipHandTag + 2;
        hand.scale = 0.6;
        hand.x = 300;
        hand.y = 0;
    };
    Game.prototype.showGuideStep3 = function () {
        var hand = this.createTipHand(GameCtr_1.default.getInstance().getManufacture().node);
        hand.tag = GameCtr_1.default.tipHandTag + 3;
        hand.scale = 0.6;
        hand.x = -400;
        hand.y = 150;
    };
    Game.prototype.showGuideStep4 = function () {
        var hand = this.createTipHand(this.node);
        hand.tag = GameCtr_1.default.tipHandTag + 4;
        hand.scale = 0.6;
        hand.x = 12;
        hand.y = 565;
    };
    Game.prototype.closeGuideStep = function (parent, step) {
        while (parent.getChildByTag(GameCtr_1.default.tipHandTag + step)) {
            parent.removeChildByTag(GameCtr_1.default.tipHandTag + step);
        }
    };
    Game.prototype.completeGuideStep = function (parent, step) {
        this.closeGuideStep(parent, step);
        GameCtr_1.default.guide.push(step);
        GameCtr_1.default.getInstance().setGuide();
    };
    Game.prototype.isGuideStepOver = function (step) {
        for (var i = 0; i < GameCtr_1.default.guide.length; i++) {
            if (step == GameCtr_1.default.guide[i]) {
                return true;
            }
        }
        return false;
    };
    /**********************guide end*********************/
    Game.prototype.startPfTurntableTime = function () {
        this._pfTurnableTime = 0;
        this.countPfTurnableTime();
    };
    Game.prototype.countPfTurnableTime = function () {
        this._pfTurnableTime++;
        if (this._pfTurnableTime >= GameCtr_1.default.otherConfig.pfTurntableInterval) {
            this._btn_pfTurntable.getComponent(cc.Button).interactable = true;
            return;
        }
        this.unschedule(this.countPfTurnableTime.bind(this));
        this.scheduleOnce(this.countPfTurnableTime.bind(this), 1);
    };
    Game.prototype.disableBtnPfturnable = function () {
        this._btn_pfTurntable.getComponent(cc.Button).interactable = false;
    };
    Game.prototype.updateSpeedUpState = function (dt) {
        if (this._speedTime >= 0) {
            this._speedTime += dt;
            if (this._speedTime >= GameCtr_1.default.otherConfig.speedUpInterval) {
                this._canUpSpeed = true;
                if (GameCtr_1.default.globalSpeedRate == 1) {
                    this._btn_upSpeed.getComponent(cc.Button).interactable = true;
                    this._btn_upSpeed.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.2, 1.15), cc.scaleTo(0.2, 1.0))));
                }
                this._speedTime = -1;
            }
        }
    };
    Game.prototype.updateUfoTime = function (dt) {
        if (this._ufoTime >= 0) {
            this._ufoTime += dt;
            if (this._ufoTime >= GameCtr_1.default.advVedioTime) {
                var ufo = cc.instantiate(this.ufo);
                ufo.parent = this.node;
                this._ufoTime = 0;
            }
        }
    };
    Game.prototype.caculateHideHoney = function () {
        var combsUnlock = JSON.parse(GameCtr_1.default.getInstance().getCombsUnlock());
        for (var i = 0; i < combsUnlock.length; i++) {
            if (this._honeycombContent.y >= (i + 1) * 408) {
                GameCtr_1.default.honeyValue += (GameCtr_1.default.combConfig[i].initialIncome + GameCtr_1.default.combConfig[i].incomeMatrix * (combsUnlock[i].level - 1) * combsUnlock[i].level) / (GameCtr_1.default.combConfig[i].baseSpeed * 2);
            }
            if (i - Math.floor(this._honeycombContent.y / 408) > 2) {
                GameCtr_1.default.honeyValue += (GameCtr_1.default.combConfig[i].initialIncome + GameCtr_1.default.combConfig[i].incomeMatrix * (combsUnlock[i].level - 1) * combsUnlock[i].level) / (GameCtr_1.default.combConfig[i].baseSpeed * 2);
            }
        }
    };
    Game.prototype.upgradeNodeUpdate = function () {
        if (this._combUpgrade) {
            this._combUpgrade.getComponent("combUpgrade").doUpdate();
        }
        if (this._manufactureUpgrade) {
            this._manufactureUpgrade.getComponent("manufactureUpgrade").doUpdate();
        }
    };
    Game.prototype.updateGameData = function () {
        GameCtr_1.default.getInstance().setRich();
        GameCtr_1.default.getInstance().setMoney();
        GameCtr_1.default.getInstance().setTimestamp();
        GameCtr_1.default.getInstance().setLevelMoney();
        this.updateSpeedUpState(1);
        this.updateUfoTime(1);
        this.caculateHideHoney();
        this.upgradeNodeUpdate();
        this.unschedule(this.updateGameData.bind(this));
        this.scheduleOnce(this.updateGameData.bind(this), 1);
    };
    Game.prototype.commitDataToServer = function () {
        HttpCtr_1.default.setGold(GameCtr_1.default.rich);
        WXCtr_1.default.submitScoreToWx(GameCtr_1.default.rich);
        this.unschedule(this.commitDataToServer.bind(this));
        this.scheduleOnce(this.commitDataToServer.bind(this), 10);
    };
    Game.prototype.playGoldEft = function () {
        for (var i = 1; i <= 2; i++) {
            var goldEft = this.node.getChildByName("otherNode").getChildByName("offLineEft" + i);
            var particle = goldEft.getComponent(cc.ParticleSystem);
            particle.resetSystem();
            for (var j = 0; j < particle.totalParticles; j++) {
                particle.addParticle();
            }
        }
        AudioManager_1.default.getInstance().playSound("audio/gold");
    };
    Game.prototype.update = function (dt) {
        this._interval3 += dt;
        for (var i = 0; i < GameCtr_1.default.comblevel; i++) {
            if (this._honeycombContent.y >= (i + 1) * 408) {
                this._combList[i].getComponent("honeycomb").stopWork();
                continue;
            }
            if (i - Math.floor(this._honeycombContent.y / 408) > 2) {
                this._combList[i].getComponent("honeycomb").stopWork();
                continue;
            }
            this._combList[i].getComponent("honeycomb").startWork(dt);
        }
        if (this._interval3 >= 0.1) {
            GameCtr_1.default.getInstance().getLevel().updateMoney();
            this._interval3 = 0;
        }
    };
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "honeyComb", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "pipeline", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "glassPipeline", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "rocket", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "offlineIncome", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "pfTurntable", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "toast", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "tipHand", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "signIn", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "invite", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "exchange", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "moreNode", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "ufo", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "ranking", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "bubbleHoney", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "goldNotEnough", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "bgMusic", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "ad", void 0);
    Game = __decorate([
        ccclass
    ], Game);
    return Game;
}(cc.Component));
exports.default = Game;

cc._RF.pop();