"use strict";
cc._RF.push(module, '72df96VCohGKZ0lXgGMMfP+', 'moreNode');
// Script/UI/component/moreNode.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._mask = null;
        _this._btn_close = null;
        _this._content = null;
        _this.ad = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this._mask = this.node.getChildByName("mask");
        this._btn_close = this.node.getChildByName("btn_close");
        this._content = this.node.getChildByName("scrollView").getChildByName("view").getChildByName('content');
        this.initBtnEvent(this._mask);
        this.initBtnEvent(this._btn_close);
        this.initAds();
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            _this.node.destroy();
            AudioManager_1.default.getInstance().playSound("audio/btnClose");
        });
    };
    NewClass.prototype.initAds = function () {
        //this._content.setContentSize(cc.size(752,230*Math.ceil(GameCtr.setting.nav.nav.length/4)));
        for (var i = 0; i < GameCtr_1.default.setting.nav.nav.length; i++) {
            var ad = cc.instantiate(this.ad);
            ad.parent = this._content;
            ad.x = i % 4 * 190 - 285;
            ad.y = Math.floor(i / 4) * (-230) - 100;
            ad.getComponent("ad").init(GameCtr_1.default.setting.nav.nav[i]);
        }
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "ad", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();