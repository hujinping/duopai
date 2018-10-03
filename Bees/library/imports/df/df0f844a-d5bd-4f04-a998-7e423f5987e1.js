"use strict";
cc._RF.push(module, 'df0f8RK1b1PBKmYfkI/WYfh', 'rankItem');
// Script/UI/component/rankItem.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._lb_name = null;
        _this._lb_city = null;
        _this._lb_rank = null;
        _this._lb_money = null;
        _this._headImg = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this._lb_name = this.node.getChildByName("lb_name");
        this._lb_city = this.node.getChildByName("lb_city");
        this._lb_rank = this.node.getChildByName("lb_rank");
        this._lb_money = this.node.getChildByName("lb_money");
        this._headImg = this.node.getChildByName("mask").getChildByName("headImg");
    };
    NewClass.prototype.setName = function (name) {
        this._lb_name.getComponent(cc.Label).string = name;
    };
    NewClass.prototype.setCity = function (city) {
        this._lb_city.getComponent(cc.Label).string = city;
    };
    NewClass.prototype.setRank = function (rank) {
        this._lb_rank.getComponent(cc.Label).string = rank;
    };
    NewClass.prototype.setMoney = function (money) {
        this._lb_money.getComponent(cc.Label).string = money;
    };
    NewClass.prototype.setHeadImg = function (headUrl) {
        if (headUrl == undefined || headUrl == "") {
            return;
        }
        var sp = this._headImg.getComponent(cc.Sprite);
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