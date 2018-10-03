"use strict";
cc._RF.push(module, 'aede1AJKXxKY7Ot4z8YYugy', 'ad');
// Script/UI/component/ad.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameCtr_1 = require("../../Controller/GameCtr");
var WXCtr_1 = require("../../Controller/WXCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._adSprite = null;
        _this._adName = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this._adSprite = this.node.getChildByName("sp");
        this._adName = this.node.getChildByName("name");
        this._adName.active = false;
    };
    NewClass.prototype.init = function (data) {
        var sp = this._adSprite.getComponent(cc.Sprite);
        GameCtr_1.default.loadImg(sp, data.img);
        var obj = { appid: data.appid, path: data.path };
        this._adSprite.on(cc.Node.EventType.TOUCH_START, function () {
            WXCtr_1.default.gotoOther(obj);
        });
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();