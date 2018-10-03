"use strict";
cc._RF.push(module, '9cbddDBRzVFhaQaHVhLKiY9', 'redPackage');
// Script/UI/component/redPackage.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._state_on = null;
        _this._state_off = null;
        _this._lb_title = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this._state_on = this.node.getChildByName("state_on");
        this._state_off = this.node.getChildByName("state_off");
        this._lb_title = this.node.getChildByName("titleFrame").getChildByName("title");
        this._state_on.active = false;
        this._state_off.active = false;
    };
    NewClass.prototype.setTitle = function (title) {
        this._lb_title.getComponent(cc.Label).string = title;
    };
    NewClass.prototype.setState = function (state) {
        if (state == "on") {
            this._state_on.active = true;
            this._state_off.active = false;
        }
        else if (state == "off") {
            this._state_on.active = false;
            this._state_off.active = true;
        }
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();