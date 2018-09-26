"use strict";
cc._RF.push(module, 'f09f2h7vkZG1YkfzatIKQgu', 'totalRank');
// Script/UI/start/totalRank.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../../Common/Util");
var GameCtr_1 = require("../../Controller/GameCtr");
var WXCtr_1 = require("../../Controller/WXCtr");
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.btn_back = null;
        _this.place_1 = null;
        _this.place_2 = null;
        _this.place_3 = null;
        _this.title = null;
        _this.rankContent = null;
        _this.selfRankInfoNode = null;
        _this.first2ThirdArr = [];
        _this.worldRankData = null;
        _this.selfRank = null;
        _this.selfChickenValue = null;
        _this.authTipNode = null;
        _this.rankNode = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
        this.adaptScreen();
        GameCtr_1.default.getInstance().addListener("getSelfInfoSuccess1", this.initSelfRankInfo.bind(this));
    };
    NewClass.prototype.initNode = function () {
        this.place_1 = this.node.getChildByName("place_1");
        this.place_2 = this.node.getChildByName("place_2");
        this.place_3 = this.node.getChildByName("place_3");
        this.btn_back = this.node.getChildByName("btn_back");
        this.authTipNode = this.node.getChildByName("authTip");
        this.title = this.node.getChildByName("title");
        this.rankNode = this.node.getChildByName("rankNode");
        this.selfRankInfoNode = this.node.getChildByName("selfRankInfoNode");
        this.rankContent = this.node.getChildByName("rankNode").getChildByName("scrollView").getChildByName("view").getChildByName("content");
        this.place_1.setLocalZOrder(10);
        this.place_2.setLocalZOrder(10);
        this.place_3.setLocalZOrder(10);
        this.first2ThirdArr.push(this.place_1);
        this.first2ThirdArr.push(this.place_2);
        this.first2ThirdArr.push(this.place_3);
        this.place_1.active = false;
        this.place_2.active = false;
        this.place_3.active = false;
        this.title.active = false;
        this.rankNode.active = false;
        this.selfRankInfoNode.active = false;
        this.btn_back.on(cc.Node.EventType.TOUCH_END, function (e) {
            AudioManager_1.default.getInstance().playSound("audio/btnCick");
            this.close();
        }.bind(this));
    };
    NewClass.prototype.adaptScreen = function () {
        var visibleSize = cc.director.getVisibleSize();
        this.place_1.y = visibleSize.height / 2 - 250;
        this.place_2.y = visibleSize.height / 2 - 310;
        this.place_3.y = visibleSize.height / 2 - 310;
        this.title.y = visibleSize.height / 2 - 410;
        this.btn_back.y = visibleSize.height / 2 - 200;
        this.selfRankInfoNode.y = -visibleSize.height / 2;
        var rankNode = this.node.getChildByName("rankNode");
        rankNode.y = visibleSize.height / 2 - 600;
    };
    NewClass.prototype.init = function () {
        this.place_1.active = true;
        this.place_2.active = true;
        this.place_3.active = true;
        this.title.active = true;
        this.rankNode.active = true;
        this.selfRankInfoNode.active = true;
        this.authTipNode.active = false;
        this.initRank();
        this.initFirst2ThirdHead();
        this.initSelfRankInfo();
    };
    NewClass.prototype.initData = function (totalRank, selfRank, selfChickenValue) {
        this.worldRankData = totalRank;
        this.selfRank = selfRank;
        this.selfChickenValue = selfChickenValue;
    };
    NewClass.prototype.initFirst2ThirdHead = function () {
        for (var i in this.worldRankData) {
            if (Number(i) - 1 == 3) {
                return;
            }
            ;
            var head = cc.instantiate(this.headPrefab);
            head.parent = this.first2ThirdArr[Number(i) - 1];
            head.active = true;
            head.y = -40;
            head.scale = Number(i) - 1 > 0 ? 0.85 : 1;
            head.getComponent("head").setHead(this.worldRankData[i].Icon);
        }
    };
    NewClass.prototype.initRank = function () {
        this.rankContent.setContentSize(cc.size(1080, 200 * 10 + 400));
        for (var i in this.worldRankData) {
            var rankItem = cc.instantiate(this.otherRankItem);
            rankItem.parent = this.rankContent;
            rankItem.y = -200 * Number(i) + 100;
            rankItem.getComponent("otherRank").setName(Util_1.default.cutstr(this.worldRankData[i].nick, 10));
            rankItem.getComponent("otherRank").setCity(this.worldRankData[i].City);
            rankItem.getComponent("otherRank").setRank(this.worldRankData[i].top);
            rankItem.getComponent("otherRank").setChickenCount(this.worldRankData[i].value);
            rankItem.getComponent("otherRank").setHeadImg(this.worldRankData[i].Icon);
        }
    };
    NewClass.prototype.initSelfRankInfo = function () {
        var selfInfo = GameCtr_1.default.getInstance().getSelfInfoFromLocal();
        if (!selfInfo) {
            return;
        }
        this.selfChickenValue = !this.selfChickenValue ? 0 : this.selfChickenValue;
        var selfRankInfoNode = this.node.getChildByName("selfRankInfoNode");
        var lb_name = selfRankInfoNode.getChildByName("lb_name");
        var lb_city = selfRankInfoNode.getChildByName("lb_city");
        var lb_rank = selfRankInfoNode.getChildByName("lb_rank");
        var lb_chickenCount = selfRankInfoNode.getChildByName("lb_chickenCount");
        var headImg = selfRankInfoNode.getChildByName("mask").getChildByName("headImg");
        var rankStr = this.selfRank == 0 ? "无排名" : this.selfRank + "";
        lb_name.getComponent(cc.Label).string = Util_1.default.cutstr(selfInfo.nickName, 10);
        lb_city.getComponent(cc.Label).string = selfInfo.province;
        lb_rank.getComponent(cc.Label).string = rankStr;
        lb_chickenCount.getComponent(cc.Label).string = this.selfChickenValue;
        this.loadHeadImg(headImg, selfInfo.avatarUrl);
    };
    NewClass.prototype.loadHeadImg = function (headNode, headUrl) {
        var sp = headNode.getComponent(cc.Sprite);
        cc.loader.load({
            url: headUrl,
            type: 'png'
        }, function (err, texture) {
            sp.spriteFrame = new cc.SpriteFrame(texture);
        });
    };
    NewClass.prototype.showAuthTip = function () {
        this.authTipNode.active = true;
        WXCtr_1.default.createUserInfoBtn();
        WXCtr_1.default.onUserInfoBtnTap(this.init.bind(this));
    };
    NewClass.prototype.close = function () {
        GameCtr_1.default.getInstance().removeListener("getSelfInfoSuccess1");
        this.node.runAction(cc.sequence(cc.scaleTo(0.2, 0), cc.callFunc(function () {
            this.node.destroy();
        }.bind(this))));
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "headPrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "otherRankItem", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();