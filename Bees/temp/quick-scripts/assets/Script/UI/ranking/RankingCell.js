(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/ranking/RankingCell.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '31f9f5AnaRKtZm39HiZkXn2', 'RankingCell', __filename);
// Script/UI/ranking/RankingCell.ts

//排行榜单条数据信息
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../../Common/Util");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var RankingCell = /** @class */ (function (_super) {
    __extends(RankingCell, _super);
    function RankingCell() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.sprBg = null;
        _this.sprMedal = null;
        _this.sprHead = null;
        _this.lbRank = null;
        _this.lbName = null;
        _this.lbScore = null;
        _this.medalFrames = [];
        return _this;
        // start () {
        // }
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    RankingCell.prototype.setData = function (rank, data) {
        // this.setBgColor(rank);
        this.setMedal(rank);
        this.createImage(data.Icon);
        this.lbName.string = Util_1.default.cutstr(data.nick, 10);
        this.lbScore.string = data.value + "";
    };
    RankingCell.prototype.setMedal = function (idx) {
        if (idx < 3) {
            this.sprMedal.node.active = true;
            this.sprMedal.spriteFrame = this.medalFrames[idx];
            this.lbRank.node.active = true;
            this.lbRank.string = idx + 1;
        }
        else {
            this.lbRank.node.active = true;
            this.lbRank.string = idx + 1;
            this.sprMedal.node.active = false;
        }
    };
    //根据index设置背景色
    RankingCell.prototype.setBgColor = function (idx) {
        idx = idx % 2;
        this.sprBg.node.color = (idx == 0) ? cc.hexToColor("#1966EE") : cc.hexToColor("#5990F1");
    };
    RankingCell.prototype.createImage = function (avatarUrl) {
        var _this = this;
        if (window.wx != undefined) {
            try {
                var image_1 = wx.createImage();
                image_1.onload = function () {
                    try {
                        var texture = new cc.Texture2D();
                        texture.initWithElement(image_1);
                        texture.handleLoadedTexture();
                        _this.sprHead.spriteFrame = new cc.SpriteFrame(texture);
                    }
                    catch (e) {
                        cc.log(e);
                        _this.sprHead.node.active = false;
                    }
                };
                image_1.src = avatarUrl;
            }
            catch (e) {
                cc.log(e);
                this.sprHead.node.active = false;
            }
        }
        else {
            cc.loader.load({
                url: avatarUrl,
                type: 'jpg'
            }, function (err, texture) {
                _this.sprHead.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    };
    __decorate([
        property(cc.Sprite)
    ], RankingCell.prototype, "sprBg", void 0);
    __decorate([
        property(cc.Sprite)
    ], RankingCell.prototype, "sprMedal", void 0);
    __decorate([
        property(cc.Sprite)
    ], RankingCell.prototype, "sprHead", void 0);
    __decorate([
        property(cc.Label)
    ], RankingCell.prototype, "lbRank", void 0);
    __decorate([
        property(cc.Label)
    ], RankingCell.prototype, "lbName", void 0);
    __decorate([
        property(cc.Label)
    ], RankingCell.prototype, "lbScore", void 0);
    __decorate([
        property([cc.SpriteFrame])
    ], RankingCell.prototype, "medalFrames", void 0);
    RankingCell = __decorate([
        ccclass
    ], RankingCell);
    return RankingCell;
}(cc.Component));
exports.default = RankingCell;

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
        //# sourceMappingURL=RankingCell.js.map
        