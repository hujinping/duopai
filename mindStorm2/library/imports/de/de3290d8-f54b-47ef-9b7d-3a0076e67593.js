"use strict";
cc._RF.push(module, 'de329DY9UtH75t9OgB25nWT', 'head');
// Script/Common/head.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewClass.prototype.setHead = function (headUrl) {
        var headImg = this.node.getChildByName("mask").getChildByName("headImg");
        var sp = headImg.getComponent(cc.Sprite);
        this.loadImg(sp, headUrl);
    };
    NewClass.prototype.loadImg = function (sp, headUrl) {
        if (headUrl == undefined || headUrl == "") {
            return;
        }
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