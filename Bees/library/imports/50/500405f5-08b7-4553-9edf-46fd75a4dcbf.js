"use strict";
cc._RF.push(module, '50040X1CLdFU57fRv11pNy/', 'jar');
// Script/UI/component/jar.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.honey = 0;
        _this.money = 0;
        _this.isTransfering = false;
        _this.jar_full = null;
        _this.jar_notFull = null;
        _this.jar_money = null;
        return _this;
    }
    NewClass.prototype.setFull = function () {
        this.jar_money.active = false;
        this.jar_notFull.active = false;
        this.jar_full.active = true;
    };
    NewClass.prototype.setNotFull = function () {
        this.jar_money.active = false;
        this.jar_full.active = false;
        this.jar_notFull.active = true;
    };
    NewClass.prototype.setMoney = function () {
        this.jar_full.active = false;
        this.jar_notFull.active = false;
        this.jar_money.active = true;
    };
    NewClass.prototype.onClilk = function () {
        AudioManager_1.default.getInstance().playSound("audio/open_panel");
        console.log("log-----------点击蜂蜜罐---------");
    };
    __decorate([
        property(Number)
    ], NewClass.prototype, "honey", void 0);
    __decorate([
        property(Boolean)
    ], NewClass.prototype, "isTransfering", void 0);
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "jar_full", void 0);
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "jar_notFull", void 0);
    __decorate([
        property(cc.Node)
    ], NewClass.prototype, "jar_money", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();