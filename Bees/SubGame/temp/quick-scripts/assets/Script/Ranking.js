(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Ranking.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f4f54uObghLbJK7HnlIlACQ', 'Ranking', __filename);
// Script/Ranking.ts

Object.defineProperty(exports, "__esModule", { value: true });
var RankingCell_1 = require("./RankingCell");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Ranking = /** @class */ (function (_super) {
    __extends(Ranking, _super);
    function Ranking() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ndContent = null;
        _this.pfCell = null;
        _this.gradeList = ["王者", "宗师", "大师", "进阶", "入门", "渣渣"];
        _this.level = 0;
        return _this;
        // update (dt) {}
    }
    // LIFE-CYCLE CALLBACKS:
    Ranking.prototype.loadRanking = function (data) {
        for (var i = 0; i < data.length; i++) {
            var cell = cc.instantiate(this.pfCell);
            this.ndContent.addChild(cell);
            var info = data[i];
            var comp = cell.getComponent(RankingCell_1.default);
            comp.setData(i, info, true);
        }
    };
    Ranking.prototype.loadOverRanking = function (data) {
        this.level = 0;
        this.setTitle();
        for (var i = 0; i < data.length; i++) {
            var cell = cc.instantiate(this.pfCell);
            var info = data[i];
            var comp = cell.getComponent(RankingCell_1.default);
            var k = comp.setOverData(i, info);
            if (this.level != k) {
                if (i == data.length - 1) {
                    k = 5;
                }
                while (true) {
                    this.level++;
                    this.setTitle();
                    if (this.level >= k) {
                        break;
                    }
                }
            }
            this.ndContent.addChild(cell);
        }
    };
    Ranking.prototype.setTitle = function () {
        var cell = cc.instantiate(this.pfCell);
        this.ndContent.addChild(cell);
        var comp = cell.getComponent(RankingCell_1.default);
        comp.setTitle(this.gradeList[this.level]);
    };
    Ranking.prototype.clear = function () {
        this.ndContent.removeAllChildren();
    };
    Ranking.prototype.onLoad = function () {
    };
    Ranking.prototype.start = function () {
    };
    __decorate([
        property(cc.Node)
    ], Ranking.prototype, "ndContent", void 0);
    __decorate([
        property(cc.Prefab)
    ], Ranking.prototype, "pfCell", void 0);
    Ranking = __decorate([
        ccclass
    ], Ranking);
    return Ranking;
}(cc.Component));
exports.default = Ranking;

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
        //# sourceMappingURL=Ranking.js.map
        