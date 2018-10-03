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
        return _this;
        // update (dt) {}
    }
    Ranking.prototype.loadRanking = function (data, index) {
        if (index * 7 >= data.length) {
            return;
        }
        this.ndContent.removeAllChildren();
        var startIndex = index * 7;
        var endIndex = (index * 7 + 7) > data.length ? data.length : (index * 7 + 7);
        for (var i = startIndex; i < endIndex; i++) {
            var off_y = i % 7 >= 3 ? -35 : 0;
            var cell = cc.instantiate(this.pfCell);
            this.ndContent.addChild(cell);
            cell.x = 2;
            cell.y = 672 + (i % 7) * (-132) + off_y;
            var info = data[i];
            var comp = cell.getComponent(RankingCell_1.default);
            comp.setData(i, info);
        }
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
        