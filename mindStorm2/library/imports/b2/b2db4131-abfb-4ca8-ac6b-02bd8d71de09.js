"use strict";
cc._RF.push(module, 'b2db4Exq/tMqKxrAr2Ncd4J', 'friendRankItem');
// Script/UI/start/friendRankItem.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lb_name = null;
        _this.lb_rank = null;
        _this.lb_chickenCount = null;
        _this.headImg = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this.lb_name = this.node.getChildByName("lb_name");
        this.lb_rank = this.node.getChildByName("lb_rank");
        this.lb_chickenCount = this.node.getChildByName("lb_chickenCount");
        this.headImg = this.node.getChildByName("mask").getChildByName("headImg");
    };
    NewClass.prototype.setName = function (name) {
        this.lb_name.getComponent(cc.Label).string = name;
    };
    NewClass.prototype.setRank = function (rank) {
        this.lb_rank.getComponent(cc.Label).string = rank;
    };
    NewClass.prototype.setChickenCount = function (chickenCount) {
        this.lb_chickenCount.getComponent(cc.Label).string = chickenCount;
    };
    NewClass.prototype.setHeadImg = function (headUrl) {
        var sp = this.headImg.getComponent(cc.Sprite);
        cc.loader.load({
            url: headUrl,
            type: 'png'
        }, function (err, texture) {
            sp.spriteFrame = new cc.SpriteFrame(texture);
        });
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();