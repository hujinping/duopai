(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/levelUpgrade.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'eef43DCv9JOsKuckFSf1Gct', 'levelUpgrade', __filename);
// Script/UI/component/levelUpgrade.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../../Common/Util");
var GameCtr_1 = require("../../Controller/GameCtr");
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btn_upgrade = null;
        _this._btn_close = null;
        _this._lb_bonus = null;
        _this._word_levelFull = null;
        _this._interval = 0;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this._btn_close = this.node.getChildByName("btn_close");
        this._btn_upgrade = this.node.getChildByName("btn_upgrade");
        this._lb_bonus = this._btn_upgrade.getChildByName("lb_bonus");
        this._word_levelFull = this._btn_upgrade.getChildByName("word_levelFull");
        this._lb_bonus.getComponent(cc.Label).string = "$" + Util_1.default.formatNumber(GameCtr_1.default.levelConfig[GameCtr_1.default.level - 1].award);
        this.initBtn(this._btn_close);
        this.initBtn(this._btn_upgrade);
        this.showBtn();
    };
    NewClass.prototype.initBtn = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_close") {
                AudioManager_1.default.getInstance().playSound("audio/btnClose");
            }
            else if (e.target.getName() == "btn_upgrade") {
                if (_this._btn_upgrade.getComponent(cc.Button).interactable) {
                    GameCtr_1.default.getInstance().getLevel().upgrade();
                    AudioManager_1.default.getInstance().playSound("audio/user_levelup");
                    _this.showBtn();
                }
            }
            _this.node.destroy();
            GameCtr_1.default.getInstance().getGame().setMaskVisit(false);
        });
    };
    NewClass.prototype.showBtn = function () {
        if (GameCtr_1.default.levelMoney < GameCtr_1.default.levelConfig[GameCtr_1.default.level - 1].need) {
            this._btn_upgrade.getComponent(cc.Button).interactable = false;
        }
        else {
            this._btn_upgrade.getComponent(cc.Button).interactable = true;
        }
        if (GameCtr_1.default.level >= GameCtr_1.default.maxPlayerLevel) {
            this._btn_upgrade.getComponent(cc.Button).interactable = false;
            this._lb_bonus.active = false;
            this._word_levelFull.active = true;
        }
    };
    NewClass.prototype.update = function (dt) {
        if (this._btn_upgrade.getComponent(cc.Button).interactable) {
            return;
        }
        this._interval += dt;
        if (this._interval >= 0.5) {
            this.showBtn();
            this._interval = 0;
        }
    };
    NewClass.prototype.start = function () {
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
        //# sourceMappingURL=levelUpgrade.js.map
        