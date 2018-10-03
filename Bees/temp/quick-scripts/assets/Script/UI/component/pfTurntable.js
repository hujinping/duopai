(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/component/pfTurntable.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9f080q6zIxGsZSrX4eamo4e', 'pfTurntable', __filename);
// Script/UI/component/pfTurntable.ts

Object.defineProperty(exports, "__esModule", { value: true });
//import PopupView from "../view/PopupView";
//import ViewManager from "../../Common/ViewManager";
var GameCtr_1 = require("../../Controller/GameCtr");
var GameData_1 = require("../../Common/GameData");
var WXCtr_1 = require("../../Controller/WXCtr");
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var pfTurntable = /** @class */ (function (_super) {
    __extends(pfTurntable, _super);
    function pfTurntable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wheelSp = null;
        _this.btnSp = null;
        _this.btn = null;
        _this.labelTips = null;
        _this.award = null;
        _this.data = { type: 5 };
        _this.active = true;
        _this.isTurning = false;
        return _this;
    }
    //根据数据初始化
    pfTurntable.prototype.myInit = function (again) {
        // if(again) return;//如果是“再来一次”，则无需判断时间
        // let hours = cc.sys.localStorage.getItem("hours");
        // let nowHours =new Date().getHours(); //获取当前小时数(0-23)
        // if(hours==nowHours){
        //     let num = 60 -new Date().getMinutes();
        //     this.labelTips.string = "距离下一次抽奖还有"+num+"分钟";
        //     this.active = false;
        //     //按钮禁用
        //     this.btn.interactable = false;
        // }else cc.sys.localStorage.setItem("hours",nowHours);
    };
    pfTurntable.prototype.setData = function (data) {
        this.data = data;
    };
    // update (dt) {},
    pfTurntable.prototype.callBack_btn = function () {
        if (GameData_1.default.pfTurntable < 1) {
            WXCtr_1.default.share({ pfTurnable: true });
        }
        else {
            GameData_1.default.pfTurntable--;
            //按钮禁用
            this.btn.node.active = false;
            this.btnSp.active = true;
            //请求数据
            // let func = (data)=>{
            //     this.data = data.data;
            //     this.requestResults()
            // }
            //GameCtr.turntableInfo(func);
            this.data = { type: Math.floor(Math.random() * 7) };
            this.requestResults();
            GameCtr_1.default.getInstance().getGame().disableBtnPfturnable();
            GameCtr_1.default.getInstance().getGame().startPfTurntableTime();
        }
    };
    pfTurntable.prototype.showResult = function (type) {
        var awardData = GameCtr_1.default.pfTurnTableConfig[type];
        if (this.node.getChildByName("award")) {
            return;
        }
        var award = cc.instantiate(this.award);
        award.parent = this.node;
        award.getComponent("award").showAward(awardData);
        this.isTurning = false;
    };
    pfTurntable.prototype.requestResults = function () {
        var _this = this;
        this.isTurning = true;
        var nowHours = new Date().getHours(); //获取当前小时数(0-23)
        cc.sys.localStorage.setItem("hours", nowHours);
        //基础数据
        var elickTimes = 10;
        var rounds = 10;
        //获取结果类型，得出相对偏转角度
        //0~45，~90,~135,~180,~225,~270,~315,~360
        var type = null; //Math.floor(Math.random()*8);//客户端随机，测试用
        type = this.data.type;
        var awardAngle = (Math.random() * 35 + 5) + 45 * type;
        console.log("&&&&^*", this.data, awardAngle);
        //动作及执行
        var rotateBy = cc.rotateBy(elickTimes, awardAngle + 360 * rounds).easing(cc.easeCubicActionOut());
        var finish = cc.callFunc(function () {
            _this.showResult(type);
        });
        var seq = cc.sequence(rotateBy, finish);
        var actionstepA = this.wheelSp.runAction(seq);
        //播放音效
        AudioManager_1.default.getInstance().playSound("audio/lottery_draw", false);
    };
    pfTurntable.prototype.callBack_test = function () {
        this.btn.interactable = true;
    };
    pfTurntable.prototype.close = function () {
        if (this.isTurning) {
            return;
        }
        AudioManager_1.default.getInstance().playSound("audio/btnClose");
        this.node.destroy();
    };
    __decorate([
        property(cc.Node)
    ], pfTurntable.prototype, "wheelSp", void 0);
    __decorate([
        property(cc.Node)
    ], pfTurntable.prototype, "btnSp", void 0);
    __decorate([
        property(cc.Button)
    ], pfTurntable.prototype, "btn", void 0);
    __decorate([
        property(cc.Label)
    ], pfTurntable.prototype, "labelTips", void 0);
    __decorate([
        property(cc.Prefab)
    ], pfTurntable.prototype, "award", void 0);
    pfTurntable = __decorate([
        ccclass
    ], pfTurntable);
    return pfTurntable;
}(cc.Component));
exports.default = pfTurntable;

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
        //# sourceMappingURL=pfTurntable.js.map
        