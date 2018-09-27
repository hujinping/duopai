(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/start/signIn.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3e155WwZqxG+I6W+90wLQQT', 'signIn', __filename);
// Script/UI/start/signIn.ts

Object.defineProperty(exports, "__esModule", { value: true });
var HttpCtr_1 = require("../../Controller/HttpCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btn_close = null;
        _this._btn_get = null;
        _this._days = [];
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this._btn_close = this.node.getChildByName("btn_close");
        this._btn_get = this.node.getChildByName("btn_get");
        for (var i = 1; i < 8; i++) {
            var day = this.node.getChildByName("day_0" + i);
            this._days.push(day);
        }
        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_get);
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_close") {
                _this.node.destroy();
            }
            else if (e.target.getName() == "btn_get") {
                HttpCtr_1.default.sign(_this.doGetAward.bind(_this));
            }
        });
    };
    NewClass.prototype.doGetAward = function (day) {
        var icon_get = this._days[day].getChildByName("icon_get");
        icon_get.active = true;
        icon_get.scale = 1.5;
        icon_get.runAction(cc.scaleTo(0.5, 1.0));
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
        //# sourceMappingURL=signIn.js.map
        