"use strict";
cc._RF.push(module, '416201V29VMn5BZAtBlGiaj', 'honeycomb');
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
        _this._btn_upgrade = null;
        _this._word_unlock = null;
        _this._word_levelUp = null;
        _this._word_levelFull = null;
        _this._combsUnlock = null;
        _this._totalComb = null;
        _this._beeNode = null;
        _this._canUnlock = false;
        _this._speedUpTime = -1;
        _this._combPosArr = [];
        _this._interval = 0;
        _this._speed = 1;
        _this.bee = null;
        _this.unlockcomb = null;
        _this.combUpgrade = null;
        _this.bubbleHoney = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this.initData();
        this.initNode();
        this._combsUnlock = GameCtr_1.default.getInstance().getCombsUnlock();
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
        this._totalComb = this.node.getChildByName("totalComb");
        this._btn_upgrade = this.node.getChildByName("btn_upgrade");
        this._word_unlock = this._btn_upgrade.getChildByName("word_unlock");
        this._word_levelUp = this._btn_upgrade.getChildByName("word_LeveUP");
        this._word_levelFull = this._btn_upgrade.getChildByName("word_levelFull");
        this._beeNode.setLocalZOrder(2);
    };
    NewClass.prototype.setLevel = function (level, unlockNum) {
        this._level = level;
        this._unlockNum = unlockNum;
        this._lb_level.getComponent(cc.Label).string = level + '';
        for (var i = 0; i < unlockNum; i++) {
            this.unlockComb(i);
            this.createBee(i, true);
        }
        this.updateBtnState();
    };
    NewClass.prototype.setCanUnlock = function (canUnlock) {
        this._canUnlock = canUnlock;
    };
    NewClass.prototype.initBtn = function () {
        this.initBtnEvent(this._btn_upgrade);
        this.initBtnEvent(this._totalComb);
    };
    NewClass.prototype.initBtnEvent = function (btn) {
        var _this = this;
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (e.target.getName() == "btn_upgrade") {
                if (cc.find("Canvas").getChildByName("combUpgrade")) {
                    return;
                }
                var combUpgrade = cc.instantiate(_this.combUpgrade);
                combUpgrade.parent = cc.find("Canvas");
                combUpgrade.getComponent("combUpgrade").init(_this._level, _this._unlockNum);
                combUpgrade.y = -1218;
                combUpgrade.runAction(cc.moveBy(0.4, cc.p(0, 1218)).easing(cc.easeElasticOut(3.0)));
                GameCtr_1.default.getInstance().getGame().setMaskVisit(true);
                GameCtr_1.default.getInstance().getGame().setCombUpgrade(combUpgrade);
                AudioManager_1.default.getInstance().playSound("audio/btn_click");
            }
            else if (e.target.getName() == "totalComb") {
                _this._speedUpTime = Date.now();
            }
        });
    };
    NewClass.prototype.upgrade = function () {
        if (this._unlockNum == 0) {
            GameCtr_1.default.combsUnlock[this._level - 1] = 0;
        }
        this.unlockComb(this._unlockNum);
        this.createBee(this._unlockNum, false);
        GameCtr_1.default.money -= GameCtr_1.default.combConfig[this._level - 1].levelUpCost + GameCtr_1.default.combConfig[this._level - 1].upMatrix * this._unlockNum;
        GameCtr_1.default.getInstance().getLevel().setMoney();
        this._unlockNum++;
        GameCtr_1.default.combsUnlock[this._level - 1]++;
        GameCtr_1.default.getInstance().setCombsUnlock();
        this.updateBtnState();
        this._combsUnlock = GameCtr_1.default.getInstance().getCombsUnlock();
    };
    NewClass.prototype.unlockComb = function (index) {
        var comb = cc.instantiate(this.unlockcomb);
        comb.parent = this.node;
        comb.setLocalZOrder(0);
        comb.x = this._combPosArr[index].x;
        comb.y = this._combPosArr[index].y;
    };
    NewClass.prototype.createBee = function (index, needDelay) {
        var _this = this;
        var delayTime = needDelay ? Math.random() * 1.5 : 0;
        this.node.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(function () {
            var bee = cc.instantiate(_this.bee);
            bee.parent = _this._beeNode;
            bee.setLocalZOrder(1);
            bee.x = 1000 + _this._combPosArr[index].x;
            bee.y = _this._combPosArr[index].y;
            bee.getComponent("bee").init(_this._level, _this._combPosArr[index]);
        })));
    };
    NewClass.prototype.showBtn = function () {
        if (this._unlockNum == 0) {
            this.showUnlockBtn(this._canUnlock);
        }
        else if (this._unlockNum >= GameCtr_1.default.maxPerCombLevel) {
            this.showFullFillBtn();
        }
        else {
            this._word_levelFull.active = false;
            this._word_unlock.active = false;
            this._word_levelUp.active = true;
            this._combsUnlock = GameCtr_1.default.getInstance().getCombsUnlock();
            if (GameCtr_1.default.money >= (GameCtr_1.default.combConfig[this._level - 1].levelUpCost +
                GameCtr_1.default.combConfig[this._level - 1].upMatrix * (this._combsUnlock[this._level - 1]))) {
                this._btn_upgrade.getComponent(cc.Button).interactable = true;
            }
            else {
                this._btn_upgrade.getComponent(cc.Button).interactable = false;
            }
        }
    };
    NewClass.prototype.showFullFillBtn = function () {
        this._word_unlock.active = false;
        this._word_levelUp.active = false;
        this._word_levelFull.active = true;
        this._btn_upgrade.getComponent(cc.Button).interactable = false;
    };
    NewClass.prototype.showUnlockBtn = function (isEffectable) {
        this._btn_upgrade.active = isEffectable;
        this._word_unlock.active = true;
        this._word_levelUp.active = false;
        this._word_levelFull.active = false;
        this._btn_upgrade.getComponent(cc.Button).interactable = isEffectable;
    };
    NewClass.prototype.doBubbleHoney = function () {
        var bubbleHoney = cc.instantiate(this.bubbleHoney);
        bubbleHoney.parent = this.node.parent;
        bubbleHoney.x = -500 + (Math.random() - 0.5) * 20;
        bubbleHoney.y = this.node.y - 50;
        bubbleHoney.runAction(cc.sequence(cc.moveTo(0.4 * this._level, cc.p(bubbleHoney.x, 0)), cc.callFunc(function () {
            bubbleHoney.destroy();
        })));
    };
    NewClass.prototype.isSpeedUp = function () {
        return this._speedUpTime > 0;
    };
    NewClass.prototype.updateHoneyValue = function () {
        GameCtr_1.default.honeyValue += GameCtr_1.default.combConfig[this._level - 1].initialIncome +
            (this._combsUnlock[this._level - 1]) * GameCtr_1.default.combConfig[this._level - 1].incomeMatrix;
        GameCtr_1.default.getInstance().getManufacture().setHoneyValue();
        //console.log("log--------------GameCtr.honeyValue=:",GameCtr.honeyValue);
    };
    NewClass.prototype.updateBtnState = function () {
        if (this._unlockNum == 0) { // 此蜂巢还未解锁
            if (GameCtr_1.default.level >= GameCtr_1.default.combConfig[this._level - 1].needLevel) { //此蜂巢满足解锁条件
                this.showUnlockBtn(true);
            }
            else { //此蜂巢不满足解锁条件
                this.showUnlockBtn(false);
            }
        }
        else if (this._unlockNum < GameCtr_1.default.maxPerCombLevel) { //此蜂巢已经解锁,但未满级
            this._word_unlock.active = false;
            this._word_levelUp.active = true;
            if (GameCtr_1.default.money >= GameCtr_1.default.combConfig[this._level - 1].levelUpCost + GameCtr_1.default.combConfig[this._level - 1].upMatrix * this._unlockNum) {
                this._btn_upgrade.getComponent(cc.Button).interactable = true;
            }
            else {
                this._btn_upgrade.getComponent(cc.Button).interactable = false;
            }
        }
        else { //蜂巢满级
            this.showFullFillBtn();
        }
    };
    NewClass.prototype.doWork = function (dt) {
        this._interval += dt;
        if (this._speedUpTime > 0) {
            if ((Date.now() - this._speedUpTime) / 1000 >= 1.0) {
                this._speedUpTime = -1;
            }
        }
        if (this._interval >= 0.1) {
            this.updateBtnState();
            this._speed = this._speedUpTime > 0 ?
                GameCtr_1.default.combConfig[GameCtr_1.default.comblevel - 1].baseSpeed * (1 - GameCtr_1.default.combConfig[GameCtr_1.default.comblevel - 1].speedMatrix) :
                GameCtr_1.default.combConfig[GameCtr_1.default.comblevel - 1].baseSpeed;
            for (var i = 0; i < this._beeNode.children.length; i++) {
                if (this._beeNode.children[i].getComponent("bee").step == 1) { // 飞向采蜜区
                    this._beeNode.children[i].x -= 1000 / (this._speed * 60 / GameCtr_1.default.globalSpeedRate) * 6;
                    if (Math.floor(this._beeNode.children[i].x - this._beeNode.children[i].getComponent("bee").jobPos.x) < 5) {
                        this.doBubbleHoney();
                        this.updateHoneyValue();
                        this._beeNode.children[i].x = this._beeNode.children[i].getComponent("bee").jobPos.x;
                        this._beeNode.children[i].getComponent("bee").playHoneyEft();
                        this._beeNode.children[i].getComponent("bee").step++;
                    }
                }
                if (this._beeNode.children[i].getComponent("bee").step == 2) { //采蜜
                    if (this._beeNode.children[i].rotation < -45) {
                        this._beeNode.children[i].rotation -= 45 * 60 / (90 / GameCtr_1.default.globalSpeedRate * (1 - GameCtr_1.default.combConfig[GameCtr_1.default.comblevel - 1].speedMatrix));
                    }
                    else {
                        this._beeNode.children[i].rotation -= 135 * 60 / (90 / GameCtr_1.default.globalSpeedRate * (1 - GameCtr_1.default.combConfig[GameCtr_1.default.comblevel - 1].speedMatrix));
                    }
                    if (Math.abs(this._beeNode.children[i].rotation + 270) < 135 * 60 / (90 / GameCtr_1.default.globalSpeedRate * (1 - GameCtr_1.default.combConfig[GameCtr_1.default.comblevel - 1].speedMatrix))) {
                        this._beeNode.children[i].rotation = -270;
                        this._beeNode.children[i].getComponent("bee").step++;
                    }
                }
                if (this._beeNode.children[i].getComponent("bee").step == 3) { //离开采蜜区
                    this._beeNode.children[i].x += 1000 / (this._speed * 60 / GameCtr_1.default.globalSpeedRate) * 6;
                    if (Math.abs(this._beeNode.children[i].x - this._beeNode.children[i].getComponent("bee").jobPos.x - 1000) <= 1000 / (this._speed * 60 / GameCtr_1.default.globalSpeedRate) * 6) {
                        this._beeNode.children[i].rotation = -90;
                        this._beeNode.children[i].x = this._beeNode.children[i].getComponent("bee").jobPos.x + 1000;
                        this._beeNode.children[i].getComponent("bee").step = 1;
                    }
                }
            }
            this._interval = 0;
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
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();