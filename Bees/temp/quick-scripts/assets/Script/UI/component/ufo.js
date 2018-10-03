(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/ufo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c812eR++pxB5YEMBvGDIlgW', 'ufo', __filename);
// Script/UI/component/ufo.ts

Object.defineProperty(exports, "__esModule", { value: true });
var AudioManager_1 = require("../../Common/AudioManager");
var HttpCtr_1 = require("../../Controller/HttpCtr");
var GameCtr_1 = require("../../Controller/GameCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ufoAward = null;
        _this.treatureBox = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        var _this = this;
        this.treatureBox = this.node.getChildByName("treatureBox");
        this.node.runAction(cc.sequence(cc.delayTime(3.5), cc.callFunc(function () {
            _this.treatureBox.runAction(cc.sequence(cc.moveTo(0.5, cc.p(0, 0)).easing(cc.easeElasticOut(3.0)), cc.callFunc(function () {
                _this.treatureBox.on(cc.Node.EventType.TOUCH_END, function (e) {
                    AudioManager_1.default.getInstance().playSound("audio/open_panel");
                    _this.treatureBox.active = false;
                    if (cc.find("Canvas").getChildByName("ufoAward")) {
                        return;
                    }
                    ;
                    var ufoAward = cc.instantiate(_this.ufoAward);
                    ufoAward.parent = cc.find("Canvas");
                    HttpCtr_1.default.openClick(GameCtr_1.default.clickType.ufo);
                });
                _this.treatureBox.runAction(cc.repeatForever(cc.sequence(cc.rotateBy(0.1, -10), cc.rotateBy(0.2, 20), cc.rotateBy(0.1, -10), cc.rotateBy(0.05, -10), cc.rotateBy(0.1, 20), cc.rotateBy(0.05, -10), cc.delayTime(4))));
            })));
        })));
        var spineSkeleton = this.node.getChildByName("spine").getComponent(sp.Skeleton);
        spineSkeleton.setCompleteListener(function () {
            _this.node.destroy();
        });
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "ufoAward", void 0);
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
        //# sourceMappingURL=ufo.js.map
        