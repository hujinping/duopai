(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/loading/loading.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bc3a3PLYlZNn5Qach8Y1Gdd', 'loading', __filename);
// Script/UI/loading/loading.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameCtr_1 = require("../../Controller/GameCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.btn_go = null;
        _this.loadProgress = null;
        _this.loadProgressIcon = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initNode();
        this.adaptScreen();
    };
    NewClass.prototype.initNode = function () {
        var root = this.node;
        this.btn_go = root.getChildByName("btn_go");
        this.loadProgress = root.getChildByName("loadProgress");
        this.loadProgressIcon = this.loadProgress.getChildByName("icon");
        this.loadProgress.getComponent(cc.ProgressBar).progress = 0;
        this.loadResource();
    };
    NewClass.prototype.loadResource = function () {
        cc.loader.loadResDir("spine", this.progressCallback.bind(this), this.completeCallback.bind(this));
    };
    NewClass.prototype.progressCallback = function (completedCount, totalCount, item) {
        this.loadProgress.getComponent(cc.ProgressBar).progress = completedCount / totalCount;
        this.loadProgressIcon.x = this.loadProgress.getContentSize().width * (completedCount / totalCount) + 25;
    };
    NewClass.prototype.completeCallback = function () {
        GameCtr_1.default.getInstance().emitEvent("loadComplete", null);
    };
    NewClass.prototype.adaptScreen = function () {
        var widget = this.loadProgress.getComponent(cc.Widget);
        widget.target = cc.find("Canvas");
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.left = 67;
        widget.right = 83;
    };
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
        //# sourceMappingURL=loading.js.map
        