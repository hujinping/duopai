"use strict";
cc._RF.push(module, '4fc24zKYd1DHYrslHrzPVYI', 'bee');
// Script/UI/component/bee.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameCtr_1 = require("../../Controller/GameCtr");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._stage1 = null;
        _this._stage2 = null;
        _this._level = null;
        _this.jobPos = null;
        _this._honey = null;
        _this._honeyEft = null;
        _this._combsUnlock = null;
        _this._speed = 1;
        _this.step = 1;
        _this.interval = 0;
        _this.beeAtlas = null;
        _this.honeyEft = null;
        return _this;
        // update(dt){
        //     this._interval+=dt;
        //     if(this._interval>=0.1){
        //         //console.log("log------------bee word---------")
        //         if(this._step==1){//飞向工作区
        //             this.node.x-=1000/(this._speed*60/GameCtr.globalSpeedRate)*6;
        //             if(Math.floor(this.node.x-this.jobPos.x)<5){
        //                 GameCtr.getInstance().emitEvent("bubbleHoney"+this._level,{comblevel:this._level});
        //                 this.playHoneyEft();
        //                 this.updateHoneyValue();
        //                 this.node.x=this.jobPos.x;
        //                 this.node.rotation+=180
        //                 this._step++;
        //             }
        //         }
        //         if(this._step==2){//采蜜 阶段1
        //             if(this.node.rotation<-45){
        //                 this.node.rotation+=45/(60/GameCtr.globalSpeedRate*(1-GameCtr.combConfig[GameCtr.comblevel-1].speedMatrix));
        //             }else{
        //                 this.node.rotation+=135/(60/GameCtr.globalSpeedRate*(1-GameCtr.combConfig[GameCtr.comblevel-1].speedMatrix));
        //             }
        //             if(Math.abs(this.node.rotation-90)<20){
        //                 this._step++;
        //             }
        //         }
        //         if(this._step==3){//飞回采蜜区
        //             this.node.x+=1000/(this._speed*60/GameCtr.globalSpeedRate)*6;
        //             if(Math.abs(this.node.x-this.jobPos.x-1000)<=1000/(this._speed*60/GameCtr.globalSpeedRate)*6){
        //                 this.node.rotation=-90;
        //                 this.node.x=this.jobPos.x+1000;
        //                 this._step=1;
        //             }
        //         }
        //         this._interval=0;
        //     }
        // }
    }
    NewClass.prototype.onLoad = function () {
        this._stage1 = this.node.getChildByName("stage1");
        this._stage2 = this.node.getChildByName("stage2");
        this._stage1.active = true;
        this._stage2.active = false;
        this.node.rotation = -90;
        this._honey = cc.instantiate(this.honeyEft);
        this._honey.parent = this.node.parent.parent;
        this._honey.active = false;
        this._speed = this.node.parent.parent.getComponent("honeycomb").isSpeedUp() ?
            GameCtr_1.default.combConfig[GameCtr_1.default.comblevel - 1].baseSpeed * (1 - GameCtr_1.default.combConfig[GameCtr_1.default.comblevel - 1].speedMatrix) :
            GameCtr_1.default.combConfig[GameCtr_1.default.comblevel - 1].baseSpeed;
    };
    NewClass.prototype.init = function (level, jobPos) {
        this._level = level;
        this.jobPos = jobPos;
        this.initBeeFrame();
        this.fly();
    };
    NewClass.prototype.initBeeFrame = function () {
        var spr1 = this.beeAtlas.getSpriteFrame(this._level + "-1");
        var spr2 = this.beeAtlas.getSpriteFrame(this._level + "-2");
        this._stage1.getComponent(cc.Sprite).spriteFrame = spr1;
        this._stage2.getComponent(cc.Sprite).spriteFrame = spr2;
    };
    NewClass.prototype.fly = function () {
        var _this = this;
        this.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.2), cc.callFunc(function () {
            _this._stage1.active = true;
            _this._stage2.active = false;
        }), cc.delayTime(0.2), cc.callFunc(function () {
            _this._stage1.active = false;
            _this._stage2.active = true;
        }))));
    };
    NewClass.prototype.playHoneyEft = function () {
        this._honey.active = true;
        this._honey.x = this.jobPos.x;
        this._honey.y = this.jobPos.y;
        this._honey.getComponent("eft_honey").play();
    };
    NewClass.prototype.updateHoneyValue = function () {
        this._combsUnlock = GameCtr_1.default.getInstance().getCombsUnlock();
        GameCtr_1.default.honeyValue += GameCtr_1.default.combConfig[this._level - 1].initialIncome +
            (this._combsUnlock[this._level - 1]) * GameCtr_1.default.combConfig[this._level - 1].incomeMatrix;
        GameCtr_1.default.getInstance().getManufacture().setHoneyValue();
        //console.log("log--------------GameCtr.honeyValue=:",GameCtr.honeyValue);
    };
    __decorate([
        property(cc.SpriteAtlas)
    ], NewClass.prototype, "beeAtlas", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "honeyEft", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();