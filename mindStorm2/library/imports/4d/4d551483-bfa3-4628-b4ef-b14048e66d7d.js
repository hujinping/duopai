"use strict";
cc._RF.push(module, '4d551SDv6NGKLTvsUBI5m19', 'LoginAward');
// Script/UI/loginAward/LoginAward.ts

Object.defineProperty(exports, "__esModule", { value: true });
var HttpCtr_1 = require("../../Controller/HttpCtr");
var PopupView_1 = require("../view/PopupView");
var LoginAwardCell_1 = require("./LoginAwardCell");
var Util_1 = require("../../Common/Util");
var ViewManager_1 = require("../../Common/ViewManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LoginAward = /** @class */ (function (_super) {
    __extends(LoginAward, _super);
    function LoginAward() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ndContent = null;
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    LoginAward.prototype.onLoad = function () {
        this.setAwardDatas();
    };
    LoginAward.prototype.setAwardDatas = function () {
        var _this = this;
        HttpCtr_1.default.getLoginAwardList(function (res) {
            var list = res.data.sign_days;
            for (var i = 0; i < list.length; i++) {
                var data = list[i];
                var cell = _this.ndContent.children[i];
                var comp = cell.getComponent(LoginAwardCell_1.default);
                comp.setData(data);
            }
        });
    };
    LoginAward.prototype.signIn = function (event) {
        var _this = this;
        var btn = event.target.getComponent(cc.Button);
        btn.interactable = false;
        HttpCtr_1.default.sign(Util_1.default.getCurrTimeYYMMDD(), function (res) {
            btn.interactable = true;
            if (res) {
                ViewManager_1.default.toast("签到成功");
                _this.setAwardDatas();
            }
        });
    };
    LoginAward.prototype.close = function () {
        if (!this.node.parent) {
            return;
        }
        var popupView = this.node.parent.getComponent(PopupView_1.default);
        if (!!popupView) {
            popupView.dismiss();
        }
        else {
            this.node.destroy();
        }
    };
    __decorate([
        property(cc.Node)
    ], LoginAward.prototype, "ndContent", void 0);
    LoginAward = __decorate([
        ccclass
    ], LoginAward);
    return LoginAward;
}(cc.Component));
exports.default = LoginAward;

cc._RF.pop();