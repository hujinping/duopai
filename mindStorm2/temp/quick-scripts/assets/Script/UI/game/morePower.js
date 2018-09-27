(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/game/morePower.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '58a49uVbBRLF7xQ5Ef0Kk0R', 'morePower', __filename);
// Script/UI/game/morePower.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var WXCtr_1 = require("../../Controller/WXCtr");
var GameCtr_1 = require("../../Controller/GameCtr");
var ViewManager_1 = require("../../Common/ViewManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewClass.prototype.onLoad = function () {
        this.initBtns();
        this.initEvent();
        this.showPower();
        this.openAction();
    };
    NewClass.prototype.openAction = function () {
        this.node.scale = 0.2;
        this.node.runAction(cc.sequence(cc.scaleTo(0.15, 1.1), cc.scaleTo(0.1, 1.0)));
    };
    NewClass.prototype.initBtns = function () {
        var btn_close = this.node.getChildByName("btn_close");
        var btn_morePower = this.node.getChildByName("btn_morePower");
        this.initBtnListen(btn_close);
        this.initBtnListen(btn_morePower);
    };
    NewClass.prototype.initBtnListen = function (btn) {
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            AudioManager_1.default.getInstance().playSound("audio/btnCick");
            var btnName = e.target.getName();
            if (btnName == "btn_close") {
                this.close();
            }
            else if (btnName == "btn_morePower") {
                if (GameCtr_1.default.powerValue == 10) {
                    ViewManager_1.default.toast("体力值已满");
                    return;
                }
                WXCtr_1.default.share("morePower");
            }
        }.bind(this));
    };
    NewClass.prototype.initEvent = function () {
        GameCtr_1.default.getInstance().addListener("morePowerSuccess", this.onMorePower.bind(this));
    };
    NewClass.prototype.showPower = function () {
        var lb_powerValue = this.node.getChildByName("lb_power");
        lb_powerValue.getComponent(cc.Label).string = GameCtr_1.default.powerValue + "/10";
    };
    NewClass.prototype.onMorePower = function () {
        this.close();
    };
    NewClass.prototype.close = function () {
        GameCtr_1.default.getInstance().removeListener("morePowerSuccess");
        var mask = this.node.getChildByName("mask");
        mask.setContentSize(cc.size(1080, 2436));
        mask.runAction(cc.fadeOut(0.15));
        this.node.runAction(cc.sequence(cc.scaleTo(0.15, 0.2), cc.callFunc(function () {
            this.node.destroy();
        }.bind(this))));
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

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
        //# sourceMappingURL=morePower.js.map
        