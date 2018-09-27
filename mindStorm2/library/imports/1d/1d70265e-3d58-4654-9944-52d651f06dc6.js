"use strict";
cc._RF.push(module, '1d702ZePVhGVJlEUtZR8G3G', 'eatChicken');
// Script/UI/game/eatChicken.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameCtr_1 = require("../../Controller/GameCtr");
var AudioManager_1 = require("../../Common/AudioManager");
var ViewManager_1 = require("../../Common/ViewManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewClass.prototype.onLoad = function () {
        var light = this.node.getChildByName("light");
        var selfInfo = GameCtr_1.default.getInstance().getSelfInfoFromLocal();
        var headImg = this.node.getChildByName("mask").getChildByName("headImg");
        var btn_back = this.node.getChildByName("frame").getChildByName("btn_back");
        var btn_continue = this.node.getChildByName("frame").getChildByName("btn_continue");
        light.runAction(cc.repeatForever(cc.rotateBy(0.5, 30)));
        this.loadHeadImg(headImg, selfInfo.avatarUrl);
        btn_back.on(cc.Node.EventType.TOUCH_END, function (e) {
            AudioManager_1.default.getInstance().playSound("audio/btnCick");
            cc.director.loadScene("Start");
        });
        btn_continue.on(cc.Node.EventType.TOUCH_END, function (e) {
            AudioManager_1.default.getInstance().playSound("audio/btnCick");
            if (GameCtr_1.default.powerValue > 0) {
                GameCtr_1.default.powerValue--;
                GameCtr_1.default.getInstance().emitEvent("restartGame", null);
                this.node.destroy();
            }
            else {
                if (!GameCtr_1.default.isAudited) {
                    ViewManager_1.default.toast("没有体力值");
                    return;
                }
                if (this.node.parent.getChildByName("morePower")) {
                    return;
                }
                var morePowerNode = cc.instantiate(this.morePower);
                morePowerNode.parent = this.node.parent;
                morePowerNode.setLocalZOrder(80);
            }
        }.bind(this));
    };
    NewClass.prototype.loadHeadImg = function (headNode, headUrl) {
        if (headUrl == undefined || headUrl == "") {
            return;
        }
        var sp = headNode.getComponent(cc.Sprite);
        cc.loader.load({
            url: headUrl,
            type: 'png'
        }, function (err, texture) {
            sp.spriteFrame = new cc.SpriteFrame(texture);
        });
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "morePower", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();