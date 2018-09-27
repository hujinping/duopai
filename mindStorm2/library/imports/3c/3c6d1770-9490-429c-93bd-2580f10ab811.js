"use strict";
cc._RF.push(module, '3c6d1dwlJBCnJO9JYDxCrgR', 'Start');
// Script/UI/start/Start.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 开始界面
 * 如果有与现有不一样的需求自己拓展实现
 */
var GameCtr_1 = require("../../Controller/GameCtr");
var WXCtr_1 = require("../../Controller/WXCtr");
var ViewManager_1 = require("../../Common/ViewManager");
var Util_1 = require("../../Common/Util");
var UserManager_1 = require("../../Common/UserManager");
var Http_1 = require("../../Common/Http");
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = 0] = "LEFT";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
})(Direction || (Direction = {}));
var Start = /** @class */ (function (_super) {
    __extends(Start, _super);
    function Start() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.roleCard_1 = null;
        _this.roleCard_2 = null;
        _this.roleCard_3 = null;
        _this.worldRank = null;
        _this.morePower = null;
        _this.selfInfoPrefab = null;
        _this.signIn = null;
        _this.totalRankNode = null;
        _this.sliderData = null;
        _this.roleListEventMask = null;
        _this.roleListArrowLeft = null;
        _this.roleListArrowRight = null;
        _this.lb_roleIndex = null;
        _this.mask_up = null;
        _this.mask_down = null;
        _this.btnsNode = null;
        _this.tex = null;
        _this.friendRankNode = null;
        _this.curRoleCardIndex = 2;
        _this.roleCardDistance = 500;
        _this.roleCardBoundary = 1000;
        _this.lastClickTime = -1;
        _this.roleCardList = [];
        _this.roleCardInfoList = [];
        return _this;
    }
    Start.prototype.onLoad = function () {
        GameCtr_1.default.getInstance().setStart(this);
        this.initCurrentRoleIndex();
        this.initNode();
        this.initEvent();
        this.initSelfInfo();
        AudioManager_1.default.getInstance().playMusic("audio/gameMusic");
    };
    Start.prototype.start = function () {
        WXCtr_1.default.getFriendRankingData(); //获取好友排行榜数据
        this.showGameCount();
        //this.lb_roleIndex.getComponent(cc.Label).string=(GameCtr.roleTag+1)%3+1+"/3";
        if (window.wx != undefined) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 900;
            window.sharedCanvas.height = 1200;
        }
    };
    //开始游戏
    Start.prototype.startGame = function () {
        GameCtr_1.default.startGame();
    };
    Start.prototype.initCurrentRoleIndex = function () {
    };
    Start.prototype.initNode = function () {
        this.mask_up = this.node.getChildByName("mask_up");
        this.mask_down = this.node.getChildByName("mask_down");
        this.btnsNode = this.node.getChildByName("btnsNode");
        this.friendRankNode = this.node.getChildByName("friendRankNode");
        this.btnsNode.active = false;
        this.friendRankNode.active = false;
        this.roleCardList.push(this.roleCard_1);
        this.roleCardList.push(this.roleCard_2);
        this.roleCardList.push(this.roleCard_3);
        this.initBtnsNode();
    };
    Start.prototype.initBtnsNode = function () {
        var btn_start = this.btnsNode.getChildByName("btn_start");
        var btn_role = this.btnsNode.getChildByName("roleFrame");
        var btn_invite = this.btnsNode.getChildByName("btn_invite");
        var btn_signIn = this.btnsNode.getChildByName("btn_signIn");
        var btn_morePower = this.btnsNode.getChildByName("btn_gameCount");
        var btn_totalRank = this.btnsNode.getChildByName("btn_totalRank");
        var btn_gameEntrance1 = this.btnsNode.getChildByName("btn_gameEntrance1");
        var btn_gameEntrance2 = this.btnsNode.getChildByName("btn_gameEntrance2");
        var btn_head = this.node.getChildByName("mask_up").getChildByName("headNode").getChildByName("headFrame");
        this.initBtnsListener(btn_start);
        this.initBtnsListener(btn_totalRank);
        this.initBtnsListener(btn_morePower);
        this.initBtnsListener(btn_head);
        this.initBtnsListener(btn_role);
        this.initBtnsListener(btn_invite);
        this.initBtnsListener(btn_signIn);
        this.initBtnsListener(btn_gameEntrance1);
        this.initBtnsListener(btn_gameEntrance2);
    };
    Start.prototype.initBtnsListener = function (btn) {
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            AudioManager_1.default.getInstance().playSound("audio/btnCick");
            var btnName = e.target.getName();
            if (btnName == "btn_totalRank") {
                this.showWorldRank();
            }
            else if (btnName == "btn_gameCount") {
                if (!GameCtr_1.default.isAudited) {
                    return;
                }
                this.createMorePowerNode();
            }
            else if (btnName == "btn_start") {
                this.startFight();
            }
            else if (btnName == "headFrame") {
                this.creatSelfInfoNode();
            }
            else if (btnName == "arrow_left") {
                this.updateRoleCardPos(Direction.RIGHT);
            }
            else if (btnName == "arrow_right") {
                this.updateRoleCardPos(Direction.LEFT);
            }
            else if (btnName == "btn_invite") {
                console.log("log--------btn_invite  click");
            }
            else if (btnName == "btn_signIn") {
                this.createSignInNode();
            }
            else if (btnName == "btn_gameEntrance1") {
                console.log("log--------btn_gameEntrance1  click");
            }
            else if (btnName == "btn_gameEntrance2") {
                console.log("log--------btn_gameEntrance2  click");
            }
            else if (btnName == "roleFrame") {
                console.log("log--------roleFrame  click");
            }
        }.bind(this));
    };
    Start.prototype.initSelfInfo = function () {
        var selfInfo = GameCtr_1.default.getInstance().getSelfInfoFromLocal();
        if (!selfInfo) {
            return;
        }
        var headNode = this.mask_up.getChildByName("headNode");
        var lb_name = headNode.getChildByName("lb_name");
        var lb_gold = headNode.getChildByName("lb_gold");
        var headImg = headNode.getChildByName("mask").getChildByName("headImg");
        lb_name.getComponent(cc.Label).string = selfInfo.nickName;
        lb_gold.getComponent(cc.Label).string = GameCtr_1.default.money;
        Util_1.default.loadImg(headImg.getComponent(cc.Sprite), selfInfo.avatarUrl);
    };
    Start.prototype.createTotalRankNode = function (totalRanks, selfRank, selfChickenValue) {
        if (this.node.parent.getChildByName("totalRank")) {
            return;
        }
        var visibleSize = cc.director.getVisibleSize();
        var worldRankNode = cc.instantiate(this.worldRank);
        worldRankNode.parent = this.node.parent;
        worldRankNode.getComponent("totalRank").initData(totalRanks, selfRank, selfChickenValue);
        if (!WXCtr_1.default.authed) {
            worldRankNode.getComponent("totalRank").showAuthTip();
        }
        else {
            worldRankNode.getComponent("totalRank").init();
        }
        worldRankNode.scale = 0.2;
        worldRankNode.runAction(cc.sequence(cc.scaleTo(0.15, 1.1), cc.scaleTo(0.1, 1.0)));
    };
    Start.prototype.createMorePowerNode = function () {
        if (this.node.getChildByName("morePower")) {
            return;
        }
        var morePowerNode = cc.instantiate(this.morePower);
        morePowerNode.parent = this.node;
        morePowerNode.setLocalZOrder(20);
    };
    Start.prototype.creatSelfInfoNode = function () {
        if (this.node.parent.getChildByName("btn_head")) {
            return;
        }
        var btn_head = this.node.getChildByName("mask_up").getChildByName("headNode").getChildByName("headFrame");
        var infoNode = cc.instantiate(this.selfInfoPrefab);
        infoNode.parent = this.mask_up;
        var selfInfo = GameCtr_1.default.getInstance().getSelfInfoFromLocal();
        infoNode.getComponent("selfInfo").setID("用户ID:" + UserManager_1.default.user_id);
        infoNode.getComponent("selfInfo").setName(selfInfo.nickName);
        infoNode.getComponent("selfInfo").setGameCount("场次:" + GameCtr_1.default.joinGameCount);
        infoNode.getComponent("selfInfo").setChickenCount(GameCtr_1.default.chickenCount);
        infoNode.x = btn_head.x;
        infoNode.y = btn_head.y - 350;
        infoNode.runAction(cc.sequence(cc.scaleTo(0.1, 1.2), cc.scaleTo(0.1, 1.0)));
    };
    Start.prototype.createSignInNode = function () {
        if (this.node.getChildByName("signIn")) {
            return;
        }
        var signIn = cc.instantiate(this.signIn);
        signIn.parent = this.node;
    };
    Start.prototype.initEvent = function () {
        GameCtr_1.default.getInstance().addListener("showStartFullly", this.onShowStartFullly.bind(this));
        GameCtr_1.default.getInstance().addListener("getSelfInfoSuccess", this.onGetSelfInfoSuccess.bind(this));
        GameCtr_1.default.getInstance().addListener("morePowerSuccess1", this.showGameCount.bind(this));
    };
    Start.prototype.onShowStartFullly = function () {
        this.mask_up.runAction(cc.moveBy(0.5, cc.p(0, 650)));
        this.mask_down.runAction(cc.sequence(cc.moveBy(0.5, cc.p(0, -150)), cc.callFunc(function () {
            // this.btnsNode.setLocalZOrder(1);
            this.showBtnNodeAction();
            //this.playRoleCardAction();
        }.bind(this))));
    };
    Start.prototype.onGetSelfInfoSuccess = function () {
        this.initSelfInfo();
    };
    Start.prototype.roleCardAcion1 = function () {
        for (var i = 0; i < this.roleCardInfoList.length; i++) {
            this.roleCardInfoList[i].node.active = true;
            this.roleCardInfoList[i].node.y = 450;
            this.roleCardInfoList[i].node.runAction(cc.spawn(cc.moveBy(0.2, cc.p(500 * (i - this.curRoleCardIndex), 65 * Math.abs(i - this.curRoleCardIndex))), cc.rotateBy(0.2, -15 * (i - this.curRoleCardIndex))));
        }
    };
    Start.prototype.showRoleCardArrow = function () {
        this.roleListArrowLeft.active = true;
        this.roleListArrowRight.active = true;
        this.lb_roleIndex.active = true;
        this.roleListArrowLeft.opacity = 0;
        this.roleListArrowRight.opacity = 0;
        this.roleListArrowLeft.runAction(cc.fadeIn(0.2));
        this.roleListArrowRight.runAction(cc.fadeIn(0.2));
    };
    Start.prototype.showRankFriendAction = function () {
        var visibleSize = cc.director.getVisibleSize();
        this.friendRankNode.active = true;
        this.friendRankNode.y = -1250;
        this.friendRankNode.runAction(cc.moveTo(0.2, cc.p(0, -960)));
    };
    Start.prototype.showBtnNodeAction = function () {
        this.btnsNode.active = true;
        var btn_start = this.btnsNode.getChildByName("btn_start");
        btn_start.scale = 1.2;
        btn_start.runAction(cc.scaleTo(0.2, 1.0));
    };
    Start.prototype.showWorldRank = function () {
        var _this = this;
        console.log('获取世界排行数据???');
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_RANK_LIST,
            success: function (resp) {
                console.log("getWorldList response == ", resp);
                _this.createTotalRankNode(resp.data, resp.metop, resp.metopvalue);
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
            }
        });
    };
    Start.prototype.startFight = function () {
        if (!WXCtr_1.default.authed) {
            var authTip = this.node.getChildByName("authTip");
            authTip.setLocalZOrder(60);
            authTip.active = true;
            WXCtr_1.default.createUserInfoBtn();
            WXCtr_1.default.onUserInfoBtnTap(this.hideAuthTip.bind(this));
            return;
        }
        if (GameCtr_1.default.powerValue > 0) {
            cc.director.loadScene("Game");
            GameCtr_1.default.powerValue--;
        }
        else {
            if (!GameCtr_1.default.isAudited) {
                ViewManager_1.default.toast("没有体力值");
                return;
            }
            this.createMorePowerNode();
        }
    };
    Start.prototype.hideAuthTip = function () {
        var authTip = this.node.getChildByName("authTip");
        authTip.active = false;
    };
    Start.prototype.showGameCount = function () {
        var lb_gameCount = this.btnsNode.getChildByName("btn_gameCount").getChildByName("lb_gameCount");
        lb_gameCount.getComponent(cc.Label).string = GameCtr_1.default.powerValue + "/10";
    };
    // 刷新子域的纹理
    Start.prototype._updateSubDomainCanvas = function () {
        if (window.sharedCanvas != undefined && this.tex != null) { //&& this.ndRanking.active && this.sprFreindRankScroll.node.active
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            //this.sprFreindRankScroll.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    };
    Start.prototype.update = function () {
        this._updateSubDomainCanvas();
    };
    __decorate([
        property(cc.Prefab)
    ], Start.prototype, "roleCard_1", void 0);
    __decorate([
        property(cc.Prefab)
    ], Start.prototype, "roleCard_2", void 0);
    __decorate([
        property(cc.Prefab)
    ], Start.prototype, "roleCard_3", void 0);
    __decorate([
        property(cc.Prefab)
    ], Start.prototype, "worldRank", void 0);
    __decorate([
        property(cc.Prefab)
    ], Start.prototype, "morePower", void 0);
    __decorate([
        property(cc.Prefab)
    ], Start.prototype, "selfInfoPrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], Start.prototype, "signIn", void 0);
    Start = __decorate([
        ccclass
    ], Start);
    return Start;
}(cc.Component));
exports.default = Start;

cc._RF.pop();