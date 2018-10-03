"use strict";
cc._RF.push(module, 'd5c16a9v2lI0r79PPg31ZGc', 'exchange1');
// Script/UI/component/exchange1.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btn_close = null;
        _this._btn_exchange = null;
        _this._btn_exchangeRecord = null;
        _this._lb_money = null;
        _this.exchange2 = null;
        _this.exchangeRecord = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this._btn_close = this.node.getChildByName("btn_close");
        this._btn_exchange = this.node.getChildByName("btn_exchange");
        this._btn_exchangeRecord = this.node.getChildByName("btn_exchangeRecord");
        this._lb_money = this.node.getChildByName("lb_surplusMoney");
        this._lb_money.getComponent(cc.Label).string = "￥" + (GameCtr_1.default.realMoney / 100).toFixed(2);
        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_exchange);
        this.initBtnEvent(this._btn_exchangeRecord);
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
                console.log("log----------GameCtr.realMoney=:", GameCtr_1.default.realMoney);
                if (GameCtr_1.default.realMoney < 1000) {
                    GameCtr_1.default.getInstance().getGame().showToast("金额不足10元,无法兑换");
                    return;
                }
                if (_this.node.getChildByName("exchange2")) {
                    return;
                }
                var exchange2 = cc.instantiate(_this.exchange2);
                exchange2.parent = _this.node;
            }
            else if (e.target.getName() == "btn_exchangeRecord") {
                AudioManager_1.default.getInstance().playSound("audio/open_panel");
                if (_this.node.getChildByName("exchangeRecord")) {
                    return;
                }
                var exchangeRecord = cc.instantiate(_this.exchangeRecord);
                exchangeRecord.parent = _this.node;
            }
        });
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "exchange2", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "exchangeRecord", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();