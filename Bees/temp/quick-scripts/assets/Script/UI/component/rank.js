(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/rank.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fb738DNWNBIP42w+K3KnAhq', 'rank', __filename);
// Script/UI/component/rank.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var GameCtr_1 = require("../../Controller/GameCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btnClose = null;
        _this._content = null;
        _this.rankItem = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this._btnClose = this.node.getChildByName("btn_close");
        this._content = this.node.getChildByName("scrollView").getChildByName("view").getChildByName("content");
        this.initBtnEvent(this._btnClose);
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_close") {
                AudioManager_1.default.getInstance().playSound("audio/btnClose");
                _this.node.destroy();
                GameCtr_1.default.getInstance().getGame().setMaskVisit(false);
            }
        });
    };
    NewClass.prototype.initRank = function (ranklist) {
        var rankItemCount = 0;
        for (var i in ranklist) {
            rankItemCount++;
        }
        this._content.setContentSize(cc.size(800, rankItemCount * 98));
        for (var i in ranklist) {
            var rankItem = cc.instantiate(this.rankItem);
            rankItem.parent = this._content;
            rankItem.y = -50 - 98 * Number(i);
            rankItem.getComponent("rankItem").setRank(ranklist[i].top);
            rankItem.getComponent("rankItem").setCity(ranklist[i].City);
            rankItem.getComponent("rankItem").setName(ranklist[i].nick);
            rankItem.getComponent("rankItem").setMoney(ranklist[i].value);
            rankItem.getComponent("rankItem").setHeadImg(ranklist[i].Icon);
        }
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "rankItem", void 0);
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
        //# sourceMappingURL=rank.js.map
        