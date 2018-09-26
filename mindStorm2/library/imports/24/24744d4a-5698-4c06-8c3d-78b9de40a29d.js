"use strict";
cc._RF.push(module, '247441KVphMBow9eLneQKKd', 'revive');
// Script/UI/game/revive.ts

Object.defineProperty(exports, "__esModule", { value: true });
var WXCtr_1 = require("../../Controller/WXCtr");
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lb_time = null;
        _this.timeCount = 10;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initBtns();
        this.lb_time = this.node.getChildByName("lb_time");
    };
    NewClass.prototype.openAction = function () {
        this.node.scale = 0.2;
        this.node.runAction(cc.sequence(cc.scaleTo(0.15, 1.1), cc.scaleTo(0.1, 1.0)));
    };
    NewClass.prototype.initBtns = function () {
        var btn_close = this.node.getChildByName("btn_close");
        var btn_revive = this.node.getChildByName("btn_revive");
        this.initBtnListen(btn_close);
        this.initBtnListen(btn_revive);
    };
    NewClass.prototype.initBtnListen = function (btn) {
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            var btnName = e.target.getName();
            AudioManager_1.default.getInstance().playSound("audio/btnCick");
            if (btnName == "btn_close") {
                this.close();
            }
            else if (btnName == "btn_revive") {
                WXCtr_1.default.share("revive");
            }
        }.bind(this));
    };
    NewClass.prototype.update = function (dt) {
        if (this.timeCount >= 0) {
            this.timeCount -= dt;
            var time = Math.ceil(this.timeCount);
            this.lb_time.getComponent(cc.Label).string = time;
            if (time == 0) {
                this.close();
            }
        }
    };
    NewClass.prototype.close = function () {
        GameCtr_1.default.getInstance().emitEvent("choiceGame", null);
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