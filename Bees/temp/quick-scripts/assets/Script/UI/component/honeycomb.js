(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/honeycomb.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '416201V29VMn5BZAtBlGiaj', 'honeycomb', __filename);
// Script/UI/component/honeycomb.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameCtr_1 = require("../../Controller/GameCtr");
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._level = null;
        _this._unlockNum = null;
        _this._lb_level = null;
        _this._lb_unlockTip = null;
        _this._btn_upgrade = null;
        _this._word_unlock = null;
        _this._word_levelUp = null;
        _this._word_levelFull = null;
        _this._icon_Arrow = null;
        _this._combsUnlock = null;
        _this._totalComb = null;
        _this._beeNode = null;
        _this._unlock = false;
        _this._speedUpTime = -1;
        _this._combPosArr = [];
        _this._interval = 0;
        _this._speed = 1;
        _this._hadRandom = false;
        _this._isWorking = true;
        _this._isActioning = false;
        _this.bee = null;
        _this.unlockcomb = null;
        _this.combUpgrade = null;
        _this.bubbleHoney = null;
        _this.unlockCombTip = null;
        _this.flyBees = [];
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initData();
        this.initNode();
        this._combsUnlock = JSON.parse(GameCtr_1.default.getInstance().getCombsUnlock());
    };
    NewClass.prototype.initData = function () {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 3; j++) {
                if (j % 2 == 0) {
                    this._combPosArr.push(cc.p(-358 + 75 * i, 19 - 60 * j));
                }
                else {
                    this._combPosArr.push(cc.p(-397 + 75 * i, 19 - 60 * j));
                }
            }
        }
    };
    NewClass.prototype.initNode = function () {
        this._beeNode = this.node.getChildByName("beeNode");
        this._lb_level = this.node.getChildByName("lb_level");
        this._lb_unlockTip = this.node.getChildByName("lb_unlockTip");
        this._totalComb = this.node.getChildByName("totalComb");
        this._btn_upgrade = this.node.getChildByName("btn_upgrade");
        this._icon_Arrow = this._btn_upgrade.getChildByName("arrow");
        this._word_unlock = this._btn_upgrade.getChildByName("word_unlock");
        this._word_levelUp = this._btn_upgrade.getChildByName("word_LeveUP");
        this._word_levelFull = this._btn_upgrade.getChildByName("word_levelFull");
        this._lb_unlockTip.active = false;
        this.showUnlockBtn(false);
        this._beeNode.setLocalZOrder(2);
    };
    NewClass.prototype.initEvent = function () {
        GameCtr_1.default.getInstance().addListener("moneyUpdate" + this._level, this.onMoneyUpdate.bind(this));
    };
    NewClass.prototype.initBtnState = function () {
        var preComb = GameCtr_1.default.getInstance().getGame().getComb(this._level - 1);
        if (preComb && !preComb.getComponent("honeycomb").getUnlock()) {
            return;
        } //如果上一级蜂巢未解锁，这级蜂巢就不能解锁
        if (this._unlockNum == 0 && !this._unlock) { // 此蜂巢还未解锁
            if (GameCtr_1.default.level >= GameCtr_1.default.combConfig[this._level - 1].needLevel) { //此蜂巢满足解锁条件
                this.showUnlockBtn(true);
            }
            else { //此蜂巢不满足解锁条件
                this.showUnlockBtn(false);
            }
        }
    };
    NewClass.prototype.setLevel = function (level, unlockNum, unlock) {
        this._level = level;
        this._unlock = unlock;
        this._unlockNum = unlockNum;
        this._lb_level.getComponent(cc.Label).string = level + '';
        this._lb_unlockTip.getComponent(cc.Label).string = "玩家等级" + GameCtr_1.default.combConfig[this._level - 1].needLevel + "级解锁";
        for (var i = 0; i < unlockNum; i++) {
            this.unlockComb(i);
            this.createBee(i);
        }
        this.initBtnState();
        this.updateBtnState();
        this.initEvent();
        if (unlockNum > 0) {
            this.setUnlock(true);
        }
    };
    NewClass.prototype.setUnlock = function (unlock) {
        this._unlock = unlock;
    };
    NewClass.prototype.getUnlock = function () {
        return this._unlock;
    };
    NewClass.prototype.initBtn = function () {
        this.initBtnEvent(this._btn_upgrade);
        this.initBtnEvent(this._totalComb);
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_upgrade") {
                if (_this._unlockNum == 0 && !_this._unlock) { //解锁蜂巢
                    _this.onUnlockComb();
                }
                else { //升级蜂巢
                    _this.onUpgradeComb();
                    if (!GameCtr_1.default.getInstance().getGame().isGuideStepOver(2)) {
                        GameCtr_1.default.getInstance().getGame().completeGuideStep(_this.node, 2);
                    }
                }
                AudioManager_1.default.getInstance().playSound("audio/open_panel");
            }
            else if (e.target.getName() == "totalComb") {
                _this._speedUpTime = Date.now();
            }
        });
    };
    NewClass.prototype.onUnlockComb = function () {
        if (cc.find("Canvas").getChildByName("unlockCombTip")) {
            return;
        }
        var unlockCombTip = cc.instantiate(this.unlockCombTip);
        unlockCombTip.parent = cc.find("Canvas");
        unlockCombTip.y = -1218;
        unlockCombTip.setLocalZOrder(1);
        unlockCombTip.runAction(cc.moveBy(0.4, cc.p(0, 1218)).easing(cc.easeElasticOut(3.0)));
        unlockCombTip.getComponent("unlockCombTip").init(this._level);
        GameCtr_1.default.getInstance().getGame().setMaskVisit(true);
        this._unlock = true;
        GameCtr_1.default.combsUnlock.push({ level: this._unlockNum, unlock: this._unlock });
        GameCtr_1.default.getInstance().setCombsUnlock();
    };
    NewClass.prototype.onUpgradeComb = function () {
        if (cc.find("Canvas").getChildByName("combUpgrade")) {
            return;
        }
        var combUpgrade = cc.instantiate(this.combUpgrade);
        combUpgrade.parent = cc.find("Canvas");
        combUpgrade.setLocalZOrder(1);
        combUpgrade.getComponent("combUpgrade").init(this._level, this._unlockNum);
        combUpgrade.y = -1218;
        combUpgrade.runAction(cc.moveBy(0.4, cc.p(0, 1218)).easing(cc.easeElasticOut(3.0)));
        GameCtr_1.default.getInstance().getGame().setMaskVisit(true);
        GameCtr_1.default.getInstance().getGame().setCombUpgrade(combUpgrade);
    };
    NewClass.prototype.upgrade = function () {
        console.log("log---------GameCtr.combsUnlock this._level=:", GameCtr_1.default.combsUnlock, this._level);
        this.unlockComb(this._unlockNum);
        this.createBee(this._unlockNum);
        GameCtr_1.default.money -= GameCtr_1.default.combConfig[this._level - 1].levelUpCost + GameCtr_1.default.combConfig[this._level - 1].upMatrix * (this._unlockNum - 1);
        GameCtr_1.default.getInstance().getLevel().setMoney();
        this._unlockNum++;
        GameCtr_1.default.combsUnlock[this._level - 1].level++;
        GameCtr_1.default.getInstance().setCombsUnlock();
        this.updateBtnState();
        this._combsUnlock = JSON.parse(GameCtr_1.default.getInstance().getCombsUnlock());
    };
    NewClass.prototype.unlockComb = function (index) {
        var comb = cc.instantiate(this.unlockcomb);
        comb.parent = this.node;
        comb.setLocalZOrder(0);
        comb.x = this._combPosArr[index].x;
        comb.y = this._combPosArr[index].y;
    };
    NewClass.prototype.createBee = function (index) {
        var _this = this;
        this.node.runAction(cc.sequence(cc.delayTime(Math.random() * 3), cc.callFunc(function () {
            var flyBee = cc.instantiate(_this.flyBees[_this._level - 1]);
            flyBee.parent = _this._beeNode;
            flyBee.tag = index;
            flyBee.setLocalZOrder(1);
            flyBee.x = _this._combPosArr[index].x + 292;
            flyBee.y = _this._combPosArr[index].y + 39;
            var sp_skeleton = flyBee.getComponent(sp.Skeleton);
            sp_skeleton.setEventListener(function (e) {
                _this.doBubbleHoney();
            });
        })));
    };
    NewClass.prototype.showFullFillBtn = function () {
        this._btn_upgrade.active = true;
        this._lb_unlockTip.active = false;
        this._word_unlock.active = false;
        this._word_levelUp.active = false;
        this._word_levelFull.active = true;
        this.enabledBtn(false);
    };
    NewClass.prototype.showUnlockBtn = function (isEffectable) {
        this._btn_upgrade.active = isEffectable;
        this._lb_unlockTip.active = !isEffectable;
        this._word_unlock.active = true;
        this._word_levelUp.active = false;
        this._word_levelFull.active = false;
        this.enabledBtn(isEffectable);
        //this._btn_upgrade.getComponent(cc.Button).interactable=isEffectable;
    };
    NewClass.prototype.doBubbleHoney = function () {
        var _this = this;
        var bubbleHoney = null;
        if (GameCtr_1.default.honeyPool.size() > 0) {
            bubbleHoney = GameCtr_1.default.honeyPool.get();
            bubbleHoney.parent = this.node.parent;
            bubbleHoney.x = -500 + (Math.random() - 0.5) * 60;
            bubbleHoney.y = this.node.y - 50;
            bubbleHoney.runAction(cc.sequence(cc.moveTo(0.4 * this._level, cc.p(bubbleHoney.x, 0)), cc.callFunc(function () {
                GameCtr_1.default.honeyPool.put(bubbleHoney);
                _this.updateHoneyValue();
            })));
        }
    };
    NewClass.prototype.isSpeedUp = function () {
        return this._speedUpTime > 0;
    };
    NewClass.prototype.updateHoneyValue = function () {
        GameCtr_1.default.honeyValue += GameCtr_1.default.combConfig[this._level - 1].initialIncome +
            this._combsUnlock[this._level - 1].level * GameCtr_1.default.combConfig[this._level - 1].incomeMatrix;
        GameCtr_1.default.getInstance().setHoneyValue();
    };
    NewClass.prototype.updateBtnState = function () {
        if (this._unlockNum == 0 && !this._unlock) { // 此蜂巢还未解锁
        }
        else if (this._unlockNum < GameCtr_1.default.maxPerCombLevel) { //此蜂巢已经解锁,但未满级
            this._btn_upgrade.active = true;
            this._word_unlock.active = false;
            this._lb_unlockTip.active = false;
            this._word_levelUp.active = true;
            if (GameCtr_1.default.money >= GameCtr_1.default.combConfig[this._level - 1].levelUpCost + GameCtr_1.default.combConfig[this._level - 1].upMatrix * (this._unlockNum - 1)) {
                this.enabledBtn(true);
                //新手引导2
                if (!this.node.getChildByTag(GameCtr_1.default.tipHandTag + 2) && !GameCtr_1.default.getInstance().getGame().isGuideStepOver(2)) {
                    GameCtr_1.default.getInstance().getGame().showGuideStep2();
                }
            }
            else {
                this.enabledBtn(false);
                if (!GameCtr_1.default.getInstance().getGame().isGuideStepOver(2)) {
                    GameCtr_1.default.getInstance().getGame().closeGuideStep(this.node, 2);
                }
            }
        }
        else { //蜂巢满级
            this.showFullFillBtn();
        }
    };
    NewClass.prototype.enabledBtn = function (isEffectable) {
        this._btn_upgrade.getComponent(cc.Button).interactable = isEffectable;
        this._icon_Arrow.active = isEffectable;
        if (this._icon_Arrow.active && !this._isActioning) {
            this._isActioning = true;
            this._btn_upgrade.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1.1), cc.scaleTo(0.3, 1.0))));
        }
        else {
            this._btn_upgrade.stopAllActions();
            this._isActioning = false;
        }
    };
    NewClass.prototype.stopWork = function () {
        this._beeNode.removeAllChildren();
        this._isWorking = false;
    };
    NewClass.prototype.startWork = function (dt) {
        if (!this._isWorking) {
            for (var i = 0; i < this._unlockNum; i++) {
                if (this._beeNode.getChildByTag(i)) {
                    return;
                }
                this.createBee(i);
            }
            this._isWorking = true;
        }
    };
    NewClass.prototype.onMoneyUpdate = function () {
        this.updateBtnState();
    };
    NewClass.prototype.setSpeedRate = function (rate) {
        for (var i = 0; i < this._beeNode.children.length; i++) {
            var sp_skeleton = this._beeNode.children[i].getComponent(sp.Skeleton);
            sp_skeleton.timeScale = rate;
        }
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "bee", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "unlockcomb", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "combUpgrade", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "bubbleHoney", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "unlockCombTip", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "flyBees", void 0);
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
        //# sourceMappingURL=honeycomb.js.map
        