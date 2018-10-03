"use strict";
cc._RF.push(module, '61afc7jnvBPqLy8NzGSRn2f', 'RankingCell');
// Script/RankingCell.ts

Object.defineProperty(exports, "__esModule", { value: true });
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
        _this.bgFrames = [];
        return _this;
        // start () {
        // }
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    RankingCell.prototype.setData = function (rank, data) {
        this.createImage(data.avatarUrl);
        this.lbName.string = this.cutstr(data.nickname, 10);
        this.setMedal(rank);
        //this.setBg(rank);
        if (!data.KVDataList) {
            return;
        }
        var score = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.lbScore.string = this.formatNumber(Number(score)) + '';
    };
    RankingCell.prototype.setBg = function (idx) {
        idx = idx % 2;
        this.sprBg.spriteFrame = this.bgFrames[idx];
    };
    RankingCell.prototype.setMedal = function (idx) {
        if (idx < 3) {
            this.sprMedal.node.active = true;
            this.sprMedal.spriteFrame = this.medalFrames[idx];
            this.lbRank.node.active = false;
        }
        else {
            this.lbRank.node.active = true;
            this.lbRank.string = idx + 1;
            this.sprMedal.node.active = false;
        }
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
    //裁剪字符串，超出指定长度之后显示...(每个中文字符长度为2）
    RankingCell.prototype.cutstr = function (str, len) {
        var str_length = 0;
        var str_len = 0;
        var str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            var a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4 
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length > len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        // //如果给定字符串小于指定长度，则返回源字符串； 
        // if (str_length < len) {
        //     return str;
        // }
        return str;
    };
    RankingCell.prototype.formatNumber = function (number) {
        if (number > Math.pow(10, 33)) {
            return (number / Math.pow(10, 33)).toFixed(1) + "gg";
        }
        if (number > Math.pow(10, 30)) {
            return (number / Math.pow(10, 30)).toFixed(1) + "ff";
        }
        else if (number > Math.pow(10, 27)) {
            return (number / Math.pow(10, 27)).toFixed(1) + "ee";
        }
        else if (number > Math.pow(10, 24)) {
            return (number / Math.pow(10, 24)).toFixed(1) + "dd";
        }
        else if (number > Math.pow(10, 21)) {
            return (number / Math.pow(10, 21)).toFixed(1) + "cc";
        }
        else if (number > Math.pow(10, 18)) {
            return (number / Math.pow(10, 18)).toFixed(1) + "bb";
        }
        else if (number > Math.pow(10, 15)) {
            return (number / Math.pow(10, 15)).toFixed(1) + "aa";
        }
        else if (number > Math.pow(10, 12)) {
            return (number / Math.pow(10, 12)).toFixed(1) + "T";
        }
        else if (number > Math.pow(10, 9)) { //十亿
            return (number / Math.pow(10, 9)).toFixed(1) + "B";
        }
        else if (number > Math.pow(10, 6)) { //百万
            return (number / Math.pow(10, 6)).toFixed(1) + "M";
        }
        else if (number > Math.pow(10, 3)) { //千
            return (number / Math.pow(10, 3)).toFixed(1) + "K";
        }
        return number;
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
    __decorate([
        property([cc.SpriteFrame])
    ], RankingCell.prototype, "bgFrames", void 0);
    RankingCell = __decorate([
        ccclass
    ], RankingCell);
    return RankingCell;
}(cc.Component));
exports.default = RankingCell;

cc._RF.pop();