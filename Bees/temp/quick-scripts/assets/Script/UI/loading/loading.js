(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/loading/loading.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0b7913O/QlNjLISQVO2P7o9', 'loading', __filename);
// Script/UI/loading/loading.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameCtr_1 = require("../../Controller/GameCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._progress = null;
        _this._configTotalCount = 4;
        _this._configIndex = 0;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this._progress = this.node.getChildByName("progress");
        this.loadResource();
    };
    NewClass.prototype.loadResource = function () {
        cc.loader.loadResDir("textures", this.progressCallback.bind(this), this.completeCallback.bind(this));
    };
    NewClass.prototype.progressCallback = function (completedCount, totalCount, item) {
        this._progress.getComponent(cc.ProgressBar).progress = completedCount / totalCount;
    };
    NewClass.prototype.completeCallback = function () {
        this.loadConfigs();
    };
    NewClass.prototype.loadConfigs = function () {
        this.loadLevelConfig();
        this.loadmanufacture();
        this.loadCombConfig();
        this.loadOtherConfig();
    };
    NewClass.prototype.loadLevelConfig = function () {
        var _this = this;
        cc.loader.loadRes("config/level", function (err, res) {
            if (err) {
                return;
            }
            GameCtr_1.default.levelConfig = res;
            _this.checkLoadConfigOver();
        });
    };
    NewClass.prototype.loadmanufacture = function () {
        var _this = this;
        cc.loader.loadRes("config/manufacture", function (err, res) {
            if (err) {
                return;
            }
            GameCtr_1.default.manufactureConfig = res;
            _this.checkLoadConfigOver();
        });
    };
    NewClass.prototype.loadCombConfig = function () {
        var _this = this;
        cc.loader.loadRes("config/comb", function (err, res) {
            if (err) {
                return;
            }
            GameCtr_1.default.combConfig = res;
            _this.checkLoadConfigOver();
        });
    };
    NewClass.prototype.loadOtherConfig = function () {
        var _this = this;
        cc.loader.loadRes("config/other", function (err, res) {
            if (err) {
                return;
            }
            GameCtr_1.default.otherConfig = res;
            _this.checkLoadConfigOver();
        });
    };
    NewClass.prototype.checkLoadConfigOver = function () {
        this._configIndex++;
        if (this._configIndex == this._configTotalCount) {
            cc.director.loadScene("Game");
        }
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
        