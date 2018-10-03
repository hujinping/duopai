(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/RankingCell.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '61afc7jnvBPqLy8NzGSRn2f', 'RankingCell', __filename);
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
        _this.lbGrade = null;
        _this.lbtitle = null;
        _this.medalFrames = [];
        _this.bgFrames = [];
        _this.gradeList = ["王\n者", "宗\n师", "大\n师", "进\n阶", "入\n门", "渣\n渣"];
        return _this;
        // start () {
        // }
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    RankingCell.prototype.setData = function (rank, data, boolSetBg) {
        this.createImage(data.avatarUrl);
        this.lbName.string = this.cutstr(data.nickname, 10);
        this.setMedal(rank);
        if (boolSetBg) {
            this.setBg(rank);
        }
        if (!data.KVDataList) {
            return;
        }
        var score = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.lbScore.string = score;
    };
    RankingCell.prototype.setOverData = function (rank, data) {
        if (!data.KVDataList) {
            return;
        }
        this.createImage(data.avatarUrl);
        this.lbName.string = this.cutstr(data.nickname, 10);
        this.setMedal(rank);
        var idx = rank % 2;
        if (idx == 0)
            this.sprBg.spriteFrame = this.bgFrames[idx];
        else
            this.sprBg.spriteFrame = null;
        var score = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.lbScore.string = score;
        return this.setLbGrade(score);
    };
    RankingCell.prototype.setSelfOverData = function (data) {
        if (!data.KVDataList) {
            return;
        }
        this.createImage(data.avatarUrl);
        this.lbName.string = this.cutstr(data.nickname, 10);
        var score = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.setLbGrade(score);
    };
    RankingCell.prototype.setLbGrade = function (score) {
        var lb = this.lbGrade.getComponent(cc.Label);
        if (score < 2000) {
            lb.string = this.gradeList[5];
            return 5;
        }
        else if (score >= 2000 && score < 10000) {
            lb.string = this.gradeList[4];
            return 4;
        }
        else if (score >= 10000 && score < 30000) {
            lb.string = this.gradeList[3];
            return 3;
        }
        else if (score >= 30000 && score < 50000) {
            lb.string = this.gradeList[2];
            return 2;
        }
        else if (score >= 50000 && score < 80000) {
            lb.string = this.gradeList[1];
            return 1;
        }
        else if (score >= 100000) {
            lb.string = this.gradeList[0];
            return 0;
        }
    };
    RankingCell.prototype.setTitle = function (string) {
        this.sprBg.node.active = false;
        this.lbtitle.getComponent(cc.Label).string = string;
    };
    RankingCell.prototype.setBg = function (idx) {
        idx = 0;
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
        property(cc.Label)
    ], RankingCell.prototype, "lbGrade", void 0);
    __decorate([
        property(cc.Label)
    ], RankingCell.prototype, "lbtitle", void 0);
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
        