"use strict";
cc._RF.push(module, '86ccfvGEopB25+T4d8VMLcQ', 'friendRank');
// Script/UI/start/friendRank.ts

Object.defineProperty(exports, "__esModule", { value: true });
var UILoader_1 = require("../../Common/UILoader");
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scrollViewContent = null;
        _this.btn_close = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.scrollViewContent = this.node.getChildByName("scrollView").getChildByName("view").getChildByName("content");
        this.btn_close = this.node.getChildByName("btn_close");
        this.btn_close.on(cc.Node.EventType.TOUCH_END, function (e) {
            this.close();
            AudioManager_1.default.getInstance().playSound("audio/btnCick");
        }.bind(this));
    };
    NewClass.prototype.showRank = function (rankList) {
        var _this = this;
        this.scrollViewContent.setContentSize(cc.size(740, 170 * 2 + 50)); //rankList.length
        var _loop_1 = function (i) {
            UILoader_1.UILoader.loadRes("prefab/friendRankItem", cc.Prefab, function (prefab) {
                UILoader_1.UILoader.instantiate(prefab, _this.scrollViewContent, function (node) {
                    // node.setLocalZOrder(10);
                    // this.reviveNode=node;
                    node.y = -100 - (170 * i);
                });
            });
        };
        for (var i = 0; i < 2; i++) {
            _loop_1(i);
        }
    };
    NewClass.prototype.close = function () {
        this.node.runAction(cc.sequence(cc.scaleTo(0.2, 0), cc.callFunc(function () {
            UILoader_1.UILoader.destroy(this.node);
        }.bind(this))));
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();