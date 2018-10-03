(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/invite.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4395eZb9n1DpZTENkJQzIiP', 'invite', __filename);
// Script/UI/component/invite.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameCtr_1 = require("../../Controller/GameCtr");
var AudioManager_1 = require("../../Common/AudioManager");
var WXCtr_1 = require("../../Controller/WXCtr");
var HttpCtr_1 = require("../../Controller/HttpCtr");
var UserManager_1 = require("../../Common/UserManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btn_close = null;
        _this._btn_invite = null;
        _this._friendNode = null;
        _this.inviteFriendItem = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
        this.initFriendItems();
        this.requestFriendList();
    };
    NewClass.prototype.initNode = function () {
        this._btn_close = this.node.getChildByName("btn_close");
        this._btn_invite = this.node.getChildByName("btn_invite");
        this._friendNode = this.node.getChildByName("friendNode").getChildByName("view").getChildByName("content");
        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_invite);
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_close") {
                _this.node.destroy();
                GameCtr_1.default.getInstance().getGame().setMaskVisit(false);
                AudioManager_1.default.getInstance().playSound("audio/btnClose");
            }
            else if (e.target.getName() == "btn_invite") {
                AudioManager_1.default.getInstance().playSound("audio/open_panel");
                WXCtr_1.default.share({ invite: true, callback: function () {
                        console.log("log----------------邀请好友---------");
                    } });
            }
        });
    };
    NewClass.prototype.initFriendItems = function () {
        for (var i = 0; i < 10; i++) {
            var friendItem = cc.instantiate(this.inviteFriendItem);
            friendItem.parent = this._friendNode;
            friendItem.tag = 10 + i;
            friendItem.x = 102 + 176 * i;
            friendItem.y = 20;
            var key = "data_" + friendItem.tag;
            if (UserManager_1.default.user[key] > 0) {
                friendItem.getComponent("inviteFriendItem").disableBtn();
            }
        }
    };
    NewClass.prototype.requestFriendList = function () {
        var _this = this;
        HttpCtr_1.default.getInviteResult(function (friendList) {
            for (var i = 0; i < friendList.length; i++) {
                if (friendList[i].Icon && _this._friendNode.children[i]) {
                    _this._friendNode.children[i].getComponent("inviteFriendItem").setName(friendList[i].nick);
                    _this._friendNode.children[i].getComponent("inviteFriendItem").setHeadImg(friendList[i].Icon);
                }
                else {
                    _this._friendNode.children[i].getComponent("inviteFriendItem").initHeadEvent();
                }
            }
        });
        this.scheduleOnce(this.requestFriendList.bind(this), 1.0);
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "inviteFriendItem", void 0);
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
        //# sourceMappingURL=invite.js.map
        