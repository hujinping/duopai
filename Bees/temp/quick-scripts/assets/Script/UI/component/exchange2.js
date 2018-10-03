(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/exchange2.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '89904K3bHtPI4+yM8KqANYe', 'exchange2', __filename);
// Script/UI/component/exchange2.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var HttpCtr_1 = require("../../Controller/HttpCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btn_close = null;
        _this._btn_exchange = null;
        _this._lb_money = null;
        _this._editeBox_phoneNum = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this._btn_close = this.node.getChildByName("btn_close");
        this._btn_exchange = this.node.getChildByName("btn_exchange");
        this._lb_money = this.node.getChildByName("lb_surplusMoney");
        this._editeBox_phoneNum = this.node.getChildByName("phoneNumber");
        this._lb_money.getComponent(cc.Label).string = "￥" + (GameCtr_1.default.realMoney / 100).toFixed(2);
        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_exchange);
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_close") {
                _this.node.destroy();
                AudioManager_1.default.getInstance().playSound("audio/btnClose");
            }
            else if (e.target.getName() == "btn_exchange") {
                AudioManager_1.default.getInstance().playSound("audio/open_panel");
                _this.requestExchange(_this._editeBox_phoneNum.getComponent(cc.EditBox).string);
            }
        });
    };
    NewClass.prototype.isPhoneNum = function (num) {
        if (!/^\d{11}$/i.test(num))
            return "电话号码不合法";
    };
    NewClass.prototype.requestExchange = function (phoneNumber) {
        var err = this.isPhoneNum(phoneNumber);
        if (err) {
            GameCtr_1.default.getInstance().getGame().showToast("你的电话号码不合法");
            return;
        }
        HttpCtr_1.default.doExchange(phoneNumber);
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
        //# sourceMappingURL=exchange2.js.map
        