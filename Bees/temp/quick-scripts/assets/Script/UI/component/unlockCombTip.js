(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/unlockCombTip.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2b55fz/1CpJhqXVFQR9lx8W', 'unlockCombTip', __filename);
// Script/UI/component/unlockCombTip.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameCtr_1 = require("../../Controller/GameCtr");
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.celebrate = null;
        _this._btn_sure = null;
        _this._bee = null;
        _this._level = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        var _this = this;
        this._bee = this.node.getChildByName("bee");
        this._btn_sure = this.node.getChildByName("btn_sure");
        this._btn_sure.on(cc.Node.EventType.TOUCH_END, function (e) {
            AudioManager_1.default.getInstance().playSound("audio/unlock_hive");
            GameCtr_1.default.getInstance().getGame().setMaskVisit(false);
            var comb = GameCtr_1.default.getInstance().getGame().getComb(_this._level);
            var neetComb = GameCtr_1.default.getInstance().getGame().getComb(_this._level + 1);
            comb.getComponent("honeycomb").setUnlock(true);
            comb.getComponent("honeycomb").upgrade();
            if (neetComb) {
                neetComb.getComponent("honeycomb").initBtnState();
            }
            _this.node.destroy();
        });
    };
    NewClass.prototype.init = function (level) {
        this._level = level;
        this.initBee();
        this.showCelebrate();
    };
    NewClass.prototype.initBee = function () {
        var _this = this;
        cc.loader.loadRes("textures/bees/00" + this._level, cc.SpriteFrame, function (err, spriteFrame) {
            _this._bee.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            _this._bee.scale = 4.0;
        });
    };
    NewClass.prototype.showCelebrate = function () {
        var celebrate = cc.instantiate(this.celebrate);
        celebrate.parent = cc.find("Canvas");
        celebrate.scale = 2;
        var skeleton = celebrate.getChildByName("animation").getComponent(sp.Skeleton);
        skeleton.setCompleteListener(function () {
            celebrate.destroy();
        });
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "celebrate", void 0);
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
        //# sourceMappingURL=unlockCombTip.js.map
        