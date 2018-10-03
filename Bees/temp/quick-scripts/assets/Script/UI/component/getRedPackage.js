(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/getRedPackage.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2f254/KMeJHZ6SVLhQys+9r', 'getRedPackage', __filename);
// Script/UI/component/getRedPackage.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var WXCtr_1 = require("../../Controller/WXCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btn_close = null;
        _this._btn_storage = null;
        _this._lb_value = null;
        _this._lb_surplusMoney = null;
        _this._shareGet = false;
        _this._shareGetMoney = 0;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this._btn_close = this.node.getChildByName("btn_close");
        this._btn_storage = this.node.getChildByName("btn_storage");
        this._lb_value = this.node.getChildByName("lb_value");
        this._lb_surplusMoney = this.node.getChildByName("lb_surplusMoney");
        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_storage);
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_close") {
                _this.node.destroy();
                AudioManager_1.default.getInstance().playSound("audio/btnClose");
            }
            else if (e.target.getName() == "btn_storage") {
                if (!_this._shareGet) {
                    AudioManager_1.default.getInstance().playSound("audio/open_panel");
                    GameCtr_1.default.getInstance().getGame().showToast("存入成功");
                    _this.node.destroy();
                }
                else {
                    AudioManager_1.default.getInstance().playSound("audio/open_panel");
                    var callFunc = function () {
                        GameCtr_1.default.realMoney += _this._shareGetMoney;
                        GameCtr_1.default.getInstance().getGame().setRealMoney();
                        _this.node.destroy();
                    };
                    WXCtr_1.default.share({ callback: callFunc });
                }
            }
        });
    };
    NewClass.prototype.setValue = function (value) {
        this._lb_value.getComponent(cc.Label).string = "￥" + value / 100;
    };
    NewClass.prototype.setSurplusMoney = function () {
        this._lb_surplusMoney.getComponent(cc.Label).string = "余额:" + GameCtr_1.default.realMoney / 100;
    };
    NewClass.prototype.shouldShare = function (money) {
        this._shareGet = true;
        this._shareGetMoney = money;
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
        //# sourceMappingURL=getRedPackage.js.map
        