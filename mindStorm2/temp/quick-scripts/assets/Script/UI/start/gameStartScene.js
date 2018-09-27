(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/start/gameStartScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bd52dZBbANGsrtIUO+zjLuE', 'gameStartScene', __filename);
// Script/UI/start/gameStartScene.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameCtr_1 = require("../../Controller/GameCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadingNode = null;
        _this.startNode = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
        this.initEvent();
    };
    NewClass.prototype.initNode = function () {
        this.initLoadingNode();
        this.initStartNode();
    };
    NewClass.prototype.initLoadingNode = function () {
        this.loadingNode = cc.instantiate(this.loadingPrefab);
        this.loadingNode.parent = this.node;
    };
    NewClass.prototype.initStartNode = function () {
        this.startNode = cc.instantiate(this.startPrefab);
        this.startNode.parent = this.node;
        this.startNode.y = -GameCtr_1.default.IPONEX_HEIGHT;
    };
    NewClass.prototype.initEvent = function () {
        GameCtr_1.default.getInstance().addListener("loadComplete", this.onLoadComplete.bind(this));
    };
    NewClass.prototype.onLoadComplete = function () {
        //console.log("log--------------------------onLoadComplete------------------");
        this.loadingNode.runAction(cc.moveBy(1.0, cc.p(0, GameCtr_1.default.IPONEX_HEIGHT)));
        this.startNode.runAction(cc.sequence(cc.moveBy(1.0, cc.p(0, GameCtr_1.default.IPONEX_HEIGHT)), cc.callFunc(function () {
            GameCtr_1.default.getInstance().emitEvent("showStartFullly", null);
        })));
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "loadingPrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "startPrefab", void 0);
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
        //# sourceMappingURL=gameStartScene.js.map
        