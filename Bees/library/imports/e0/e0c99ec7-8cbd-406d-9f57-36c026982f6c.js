"use strict";
cc._RF.push(module, 'e0c997HjL1AbZ9XNsAmmC9s', 'signIn');
// Script/UI/component/signIn.ts

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
        _this._btn_getRedPackage = null;
        _this.redPackage = null;
        _this.getRedPackage = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
        HttpCtr_1.default.getLoginAwardList(this.initRedPackages.bind(this));
    };
    NewClass.prototype.initNode = function () {
        this._btn_close = this.node.getChildByName("btn_close");
        this._btn_getRedPackage = this.node.getChildByName("btn_getRedPackage");
        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_getRedPackage);
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_close") {
                AudioManager_1.default.getInstance().playSound("audio/btnClose");
                GameCtr_1.default.getInstance().getGame().setMaskVisit(false);
                _this.node.destroy();
            }
            else if (e.target.getName() == "btn_getRedPackage") {
                AudioManager_1.default.getInstance().playSound("audio/open_panel");
                HttpCtr_1.default.sign(_this.getPackage.bind(_this));
            }
            else if (e.target.getName() == "redPackage") {
                AudioManager_1.default.getInstance().playSound("audio/open_panel");
                HttpCtr_1.default.sign(_this.getPackage.bind(_this));
            }
        });
    };
    NewClass.prototype.initRedPackages = function (data) {
        console.log("log--------initRedPackages--->data=:", data);
        for (var i = 0; i < 7; i++) {
            var redPackage = cc.instantiate(this.redPackage);
            redPackage.parent = this.node;
            redPackage.x = -225 + i % 3 * 225;
            redPackage.y = 250 - Math.floor(i / 3) * 280;
            redPackage.tag = 1000 + i;
            redPackage.getComponent("redPackage").setTitle("第" + (i + 1) + "天");
            if (i < data.todaySum) {
                redPackage.getComponent("redPackage").setState("on");
            }
            else {
                redPackage.getComponent("redPackage").setState("off");
                //this.initBtnEvent(redPackage);
            }
        }
    };
    NewClass.prototype.getPackage = function (data) {
        console.log("log------------sign data=:", data);
        if (this.node.getChildByName("getRedPackage")) {
            return;
        }
        var getPackage = cc.instantiate(this.getRedPackage);
        getPackage.parent = this.node;
        getPackage.getComponent("getRedPackage").setValue(data.m);
        getPackage.getComponent("getRedPackage").setSurplusMoney();
        GameCtr_1.default.realMoney += data.m;
        GameCtr_1.default.getInstance().getGame().setRealMoney();
        var redPackage = this.node.getChildByTag(1000 + data.todaySum - 1);
        redPackage.getComponent("redPackage").setState("on");
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "redPackage", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "getRedPackage", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();