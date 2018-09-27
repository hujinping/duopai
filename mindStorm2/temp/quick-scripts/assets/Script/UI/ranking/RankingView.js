(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/ranking/RankingView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ccb460UQXtHubIzenjgDSa0', 'RankingView', __filename);
// Script/UI/ranking/RankingView.ts

//排行榜界面
Object.defineProperty(exports, "__esModule", { value: true });
var GameCtr_1 = require("../../Controller/GameCtr");
var WXCtr_1 = require("../../Controller/WXCtr");
var Http_1 = require("../../Common/Http");
var UserManager_1 = require("../../Common/UserManager");
var UILoader_1 = require("../../Common/UILoader");
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
        _this.tex = null;
        _this.isGetWorldList = false;
        _this.isGetFriendList = false;
        return _this;
    }
    RankingView.prototype.onLoad = function () {
        GameCtr_1.default.getInstance().setRanking(this);
    };
    RankingView.prototype.start = function () {
        if (window.wx != undefined) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 900;
            window.sharedCanvas.height = 1200;
        }
        this.initRank();
    };
    //初始化界面
    RankingView.prototype.initRank = function () {
        // if (this.friendToggle.isChecked) {
        //     this.showFreindRanking();
        // } else if (this.worldToggle.isChecked) {
        //     this.showWorldRanking();
        // }
        this.showWorldRanking();
    };
    //返回结束
    RankingView.prototype.back = function () {
        this.showAuthTip(false);
        this.isGetFriendList = false;
        WXCtr_1.default.closeFriendRanking();
        GameCtr_1.default.gotoScene(GameCtr_1.default.rankingEntrance);
    };
    //显示世界排行
    RankingView.prototype.showWorldRanking = function () {
        console.log('点击了世界排行榜');
        this.ndWorldScr.active = true;
        this.sprFreindRankScroll.node.active = false;
        if (!WXCtr_1.default.wxLoginSuccess) {
            console.log("未授权，引导获取授权！！！");
            this.showAuthTip(true);
            return;
        }
        if (!this.isGetWorldList) {
            this.getWorldRankingData();
        }
    };
    //
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
        console.log('获取世界排行数据???');
        Http_1.default.send({
            url: Http_1.default.UrlConfig.GET_RANK_LIST,
            success: function (resp) {
                console.log("getWorldList response == ", resp);
                _this.isGetWorldList = true;
                _this.setWorldList(resp.data, resp.metop, resp.metopvalue);
            },
            data: {
                uid: UserManager_1.default.user_id,
                voucher: UserManager_1.default.voucher,
            }
        });
    };
    //设置世界排行
    RankingView.prototype.setWorldList = function (worldRanks, selfRank, selfChickenValue) {
        var _this = this;
        UILoader_1.UILoader.loadRes("prefab/totalRank", cc.Prefab, function (prefab) {
            UILoader_1.UILoader.instantiate(prefab, _this.node, function (node) {
                node.getComponent("totalRank").init(worldRanks, selfRank, selfChickenValue);
            });
        });
    };
    //显示好友排行
    RankingView.prototype.showFreindRanking = function () {
        this.sprFreindRankScroll.node.active = true;
        this.ndWorldScr.active = false;
        this.showAuthTip(false);
        if (!this.isGetFriendList) {
            this.isGetFriendList = true;
            WXCtr_1.default.showFriendRanking();
        }
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
        