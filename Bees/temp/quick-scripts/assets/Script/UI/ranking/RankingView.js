(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/ranking/RankingView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ccb460UQXtHubIzenjgDSa0', 'RankingView', __filename);
// Script/UI/ranking/RankingView.ts

//排行榜界面
Object.defineProperty(exports, "__esModule", { value: true });
var RankingCell_1 = require("./RankingCell");
var GameCtr_1 = require("../../Controller/GameCtr");
var WXCtr_1 = require("../../Controller/WXCtr");
var Http_1 = require("../../Common/Http");
var UserManager_1 = require("../../Common/UserManager");
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var RankingView = /** @class */ (function (_super) {
    __extends(RankingView, _super);
    function RankingView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ndRanking = null;
        _this.sprFreindRankScroll = null;
        _this.ndWorldScr = null;
        _this.ndWorldContent = null;
        _this.pfCell = null;
        _this.friendToggle = null;
        _this.worldToggle = null;
        _this.ndAuthTip = null;
        _this.btn_pageUp = null;
        _this.btn_pageDown = null;
        _this.btn_share = null;
        _this.btn_joinRank = null;
        _this.headImg = null;
        _this.lb_name = null;
        _this.lb_location = null;
        _this.worldListData = [];
        _this.friendListData = null;
        _this.tex = null;
        _this.isGetWorldList = false;
        _this.isGetFriendList = false;
        _this.curPageIndex = 0;
        _this.interval = 0;
        return _this;
    }
    RankingView.prototype.onLoad = function () {
        GameCtr_1.default.getInstance().setRanking(this);
        this.btn_share.active = GameCtr_1.default.isAudited;
    };
    RankingView.prototype.start = function () {
        if (window.wx != undefined) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 900;
            window.sharedCanvas.height = 1200;
        }
        this.initRank();
        this.initSelfInfo();
    };
    //初始化界面
    RankingView.prototype.initRank = function () {
        if (this.friendToggle.isChecked) {
            this.curPageIndex = 0;
            this.showFreindRanking();
        }
        else if (this.worldToggle.isChecked) {
            this.curPageIndex = 0;
            this.showWorldRanking();
        }
    };
    RankingView.prototype.initSelfInfo = function () {
        if (UserManager_1.default.user) {
            this.loadImg(this.headImg, UserManager_1.default.user.icon);
            this.lb_name.string = UserManager_1.default.user.nick;
            this.lb_location.string = UserManager_1.default.user.city;
        }
    };
    //返回结束
    RankingView.prototype.back = function () {
        AudioManager_1.default.getInstance().playSound("audio/btnClose");
        this.showAuthTip(false);
        this.isGetFriendList = false;
        this.node.parent.destroy();
    };
    //显示世界排行
    RankingView.prototype.showWorldRanking = function () {
        console.log('点击了世界排行榜');
        this.ndWorldScr.active = true;
        this.sprFreindRankScroll.node.active = false;
        if (!WXCtr_1.default.authed) {
            console.log("未授权，引导获取授权！！！");
            this.btn_joinRank.active = true;
        }
        else {
            this.btn_joinRank.active = false;
        }
        if (!this.isGetWorldList) {
            this.getWorldRankingData();
        }
    };
    RankingView.prototype.onBtnPageUp = function () {
        AudioManager_1.default.getInstance().playSound("audio/open_panel");
        if (this.curPageIndex == 0) {
            return;
        }
        this.curPageIndex--;
        if (this.ndWorldScr.active) {
            this.showRanklist(this.ndWorldScr, this.worldListData, this.curPageIndex);
        }
        if (this.sprFreindRankScroll.node.active) {
            WXCtr_1.default.showFriendRanking(this.curPageIndex);
        }
    };
    RankingView.prototype.onBtnPageDown = function () {
        AudioManager_1.default.getInstance().playSound("audio/open_panel");
        if (this.ndWorldScr.active) {
            if ((this.curPageIndex + 1) * 7 >= this.worldListData.length) {
                return;
            }
        }
        this.curPageIndex++;
        if (this.ndWorldScr.active) {
            this.showRanklist(this.ndWorldScr, this.worldListData, this.curPageIndex);
        }
        if (this.sprFreindRankScroll.node.active) {
            WXCtr_1.default.showFriendRanking(this.curPageIndex);
        }
    };
    RankingView.prototype.onBtnJoinRank = function () {
        AudioManager_1.default.getInstance().playSound("audio/open_panel");
        this.showAuthTip(true);
    };
    RankingView.prototype.onBtnShare = function () {
        AudioManager_1.default.getInstance().playSound("audio/open_panel");
        WXCtr_1.default.share();
    };
    RankingView.prototype.showRanklist = function (parent, rankList, index) {
        if (index === void 0) { index = 0; }
        this.curPageIndex = index;
        parent.removeAllChildren();
        var startIndex = index * 7;
        var endIndex = (index * 7 + 7) > rankList.length ? rankList.length : (index * 7 + 7);
        for (var i = startIndex; i < endIndex; i++) {
            var off_y = i % 7 >= 3 ? -35 : 0;
            var nd = cc.instantiate(this.pfCell);
            parent.addChild(nd);
            nd.x = 2;
            nd.y = 530 + (i % 7) * (-132) + off_y;
            var rankingCell = nd.getComponent(RankingCell_1.default);
            rankingCell.setData(i + 1, rankList[i]);
        }
    };
    RankingView.prototype.showAuthTip = function (isShow) {
        if (isShow === void 0) { isShow = false; }
        this.ndAuthTip.active = isShow;
        if (isShow) {
            WXCtr_1.default.userInfoBtn.show();
        }
        else {
            WXCtr_1.default.userInfoBtn.hide();
        }
    };
    //获取世界排行数据
    RankingView.prototype.getWorldRankingData = function () {
        var _this = this;
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_RANK_LIST,
            success: function (resp) {
                console.log("getWorldList response == ", resp);
                _this.isGetWorldList = true;
                _this.setWorldList(resp.data);
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
            }
        });
    };
    //设置世界排行
    RankingView.prototype.setWorldList = function (list) {
        for (var i in list) {
            this.worldListData.push(list[i]);
        }
        this.showRanklist(this.ndWorldScr, this.worldListData, 0);
    };
    //设置世界排行自己数据
    RankingView.prototype.setSelfWorldData = function (rank, data) {
        var nd = this.ndWorldScr.getChildByName("SelfRanking");
        nd.active = true;
        var rankingCell = nd.getComponent(RankingCell_1.default);
        rankingCell.setData(rank, data);
    };
    //显示好友排行
    RankingView.prototype.showFreindRanking = function () {
        this.sprFreindRankScroll.node.active = true;
        this.ndWorldScr.active = false;
        this.showAuthTip(false);
        if (!this.isGetFriendList) {
            this.isGetFriendList = true;
            WXCtr_1.default.showFriendRanking(this.curPageIndex);
        }
    };
    RankingView.prototype.loadImg = function (spr, imgUrl) {
        if (!imgUrl || imgUrl == "") {
            return;
        }
        cc.loader.load({
            url: imgUrl,
            type: 'jpg'
        }, function (err, texture) {
            spr.spriteFrame = new cc.SpriteFrame(texture);
        });
    };
    //关闭世界排行
    RankingView.prototype.onCloseRank = function () {
        this.ndRanking.active = false;
    };
    // 刷新子域的纹理
    RankingView.prototype._updateSubDomainCanvas = function () {
        if (window.sharedCanvas != undefined && this.tex != null && this.ndRanking.active && this.sprFreindRankScroll.node.active) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.sprFreindRankScroll.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    };
    RankingView.prototype.update = function () {
        this._updateSubDomainCanvas();
    };
    __decorate([
        property(cc.Node)
    ], RankingView.prototype, "ndRanking", void 0);
    __decorate([
        property(cc.Sprite)
    ], RankingView.prototype, "sprFreindRankScroll", void 0);
    __decorate([
        property(cc.Node)
    ], RankingView.prototype, "ndWorldScr", void 0);
    __decorate([
        property(cc.Node)
    ], RankingView.prototype, "ndWorldContent", void 0);
    __decorate([
        property(cc.Prefab)
    ], RankingView.prototype, "pfCell", void 0);
    __decorate([
        property(cc.Toggle)
    ], RankingView.prototype, "friendToggle", void 0);
    __decorate([
        property(cc.Toggle)
    ], RankingView.prototype, "worldToggle", void 0);
    __decorate([
        property(cc.Node)
    ], RankingView.prototype, "ndAuthTip", void 0);
    __decorate([
        property(cc.Node)
    ], RankingView.prototype, "btn_pageUp", void 0);
    __decorate([
        property(cc.Node)
    ], RankingView.prototype, "btn_pageDown", void 0);
    __decorate([
        property(cc.Node)
    ], RankingView.prototype, "btn_share", void 0);
    __decorate([
        property(cc.Node)
    ], RankingView.prototype, "btn_joinRank", void 0);
    __decorate([
        property(cc.Sprite)
    ], RankingView.prototype, "headImg", void 0);
    __decorate([
        property(cc.Label)
    ], RankingView.prototype, "lb_name", void 0);
    __decorate([
        property(cc.Label)
    ], RankingView.prototype, "lb_location", void 0);
    RankingView = __decorate([
        ccclass
    ], RankingView);
    return RankingView;
}(cc.Component));
exports.default = RankingView;
;

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
        //# sourceMappingURL=RankingView.js.map
        