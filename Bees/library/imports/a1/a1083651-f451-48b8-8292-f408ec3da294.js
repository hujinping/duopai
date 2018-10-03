"use strict";
cc._RF.push(module, 'a1083ZR9FFIuIKS9AjsPaKU', 'inviteFriendItem');
// Script/UI/component/inviteFriendItem.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var HttpCtr_1 = require("../../Controller/HttpCtr");
var GameCtr_1 = require("../../Controller/GameCtr");
var WXCtr_1 = require("../../Controller/WXCtr");
var Util_1 = require("../../Common/Util");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btn_get = null;
        _this._lb_name = null;
        _this._lb_count = null;
        _this._head = null;
        _this._name = null;
        _this._url = null;
        _this.getRedPackage = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
    };
    NewClass.prototype.initNode = function () {
        this._btn_get = this.node.getChildByName("btn_get");
        this._lb_name = this.node.getChildByName("lb_name");
        this._lb_count = this.node.getChildByName("lb_count");
        this._head = this.node.getChildByName("head");
        this.initBtnEvent(this._btn_get);
        this._btn_get.active = false;
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_get") {
                HttpCtr_1.default.getCash(_this.showRedPackage.bind(_this));
            }
            else if (e.target.getName() == "head") {
                WXCtr_1.default.share({ invite: true, callback: function () {
                        console.log("log----------------邀请好友---------");
                    } });
            }
            AudioManager_1.default.getInstance().playSound("audio/open_panel");
        });
    };
    NewClass.prototype.initHeadEvent = function () {
        this.initBtnEvent(this._head);
    };
    NewClass.prototype.disableBtn = function () {
        this._btn_get.active = true;
        this._btn_get.getComponent(cc.Button).interactable = false;
        var icon_get = this.node.getChildByName("icon_get");
        icon_get.active = true;
    };
    NewClass.prototype.showRedPackage = function (money) {
        if (cc.find("Canvas").getChildByName("getRedPackage")) {
            return;
        }
        var getPackage = cc.instantiate(this.getRedPackage);
        getPackage.parent = cc.find("Canvas");
        getPackage.getComponent("getRedPackage").setValue(money);
        getPackage.getComponent("getRedPackage").setSurplusMoney();
        GameCtr_1.default.realMoney += money;
        GameCtr_1.default.getInstance().getGame().setRealMoney();
        HttpCtr_1.default.setFriendBonusState(this.node.tag, 10);
        this.disableBtn();
    };
    NewClass.prototype.setName = function (name) {
        if (this._name) {
            return;
        }
        this._name = name;
        this._btn_get.active = true;
        this._lb_name.getComponent(cc.Label).string = Util_1.default.cutstr(name, 4);
    };
    NewClass.prototype.setCount = function (count) {
        this._lb_count.getComponent(cc.Label).string = count;
    };
    NewClass.prototype.setHeadImg = function (url) {
        if (this._url) {
            return;
        }
        this._url = url;
        var sp = this._head.getComponent(cc.Sprite);
        cc.loader.load({
            url: url,
            type: 'png'
        }, function (err, texture) {
            sp.spriteFrame = new cc.SpriteFrame(texture);
        });
    };
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