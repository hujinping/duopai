"use strict";
cc._RF.push(module, '31f9f5AnaRKtZm39HiZkXn2', 'RankingCell');
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
        _this.lbCity = null;
        _this.lbScore = null;
        _this.medalFrames = [];
        return _this;
        // createImage(avatarUrl) {
        //     if (window.wx != undefined) {
        //         try {
        //             let image = wx.createImage();
        //             image.onload = () => {
        //                 try {
        //                     let texture = new cc.Texture2D();
        //                     texture.initWithElement(image);
        //                     texture.handleLoadedTexture();
        //                     this.sprHead.spriteFrame = new cc.SpriteFrame(texture);
        //                 } catch (e) {
        //                     cc.log(e);
        //                     this.sprHead.node.active = false;
        //                 }
        //             };
        //             image.src = avatarUrl;
        //         } catch (e) {
        //             cc.log(e);
        //             this.sprHead.node.active = false;
        //         }
        //     } else {
        //         cc.loader.load({
        //             url: avatarUrl,
        //             type: 'jpg'
        //         }, (err, texture) => {
        //             this.sprHead.spriteFrame = new cc.SpriteFrame(texture);
        //         });
        //     }
        // }
        // start () {
        // }
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    RankingCell.prototype.setData = function (rank, data) {
        // this.setBgColor(rank);
        var name = data.nick ? data.nick : data.nickname;
        var icon = data.Icon ? data.Icon : data.avatarUrl;
        var city = data.City ? data.City : data.KVDataList[0].value;
        var value = data.value ? data.value : data.KVDataList[1].value;
        this.lbCity.string = city;
        this.lbName.string = Util_1.default.cutstr(name, 10);
        this.lbScore.string = Util_1.default.formatNumber(value) + "";
        this.setMedal(rank);
        this.loadImg(this.sprHead, icon);
        // this.createImage(icon);
    };
    RankingCell.prototype.setMedal = function (idx) {
        if (idx <= 3) {
            this.sprMedal.node.active = true;
            this.sprMedal.spriteFrame = this.medalFrames[idx - 1];
            this.lbRank.node.active = true;
            this.lbRank.string = "";
        }
        else {
            this.lbRank.node.active = true;
            this.lbRank.string = idx;
            this.sprMedal.node.active = false;
        }
    };
    //根据index设置背景色
    RankingCell.prototype.setBgColor = function (idx) {
        idx = idx % 2;
        this.sprBg.node.color = (idx == 0) ? cc.hexToColor("#1966EE") : cc.hexToColor("#5990F1");
    };
    RankingCell.prototype.loadImg = function (spr, imgUrl) {
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
    ], RankingCell.prototype, "lbCity", void 0);
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