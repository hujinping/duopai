"use strict";
cc._RF.push(module, '55bf0TnyxRPIay2+X13X3OE', 'exchangeRecord');
// Script/UI/component/exchangeRecord.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btn_close = null;
        _this._recordNodes = [];
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        var _this = this;
        this._btn_close = this.node.getChildByName("btn_close");
        this._btn_close.on(cc.Node.EventType.TOUCH_END, function (e) {
            _this.node.destroy();
        });
        this.initRecordNode();
        this.showRecords(null);
    };
    NewClass.prototype.initRecordNode = function () {
        var recordNode = this.node.getChildByName("recordNode");
        for (var i = 0; i < 5; i++) {
            var user = recordNode.getChildByName("user" + (i + 1));
            var time = recordNode.getChildByName("time" + (i + 1));
            var phoneNumber = recordNode.getChildByName("phoneNumber" + (i + 1));
            user.active = false;
            time.active = false;
            phoneNumber.active = false;
            user.getComponent(cc.Label).string = "";
            time.getComponent(cc.Label).string = "";
            phoneNumber.getComponent(cc.Label).string = "";
            this._recordNodes.push({ _user: user, _time: time, _phoneNumber: phoneNumber });
        }
    };
    NewClass.prototype.showRecords = function (recordList) {
        recordList = [];
        recordList.push({ user: "kankan", time: "2.02456464", phoneNumber: "1253649565" });
        for (var i = 0; i < recordList.length; i++) {
            this._recordNodes[i]._user.active = true;
            this._recordNodes[i]._time.active = true;
            this._recordNodes[i]._phoneNumber.active = true;
            this._recordNodes[i]._user.getComponent(cc.Label).string = recordList[i].user;
            this._recordNodes[i]._time.getComponent(cc.Label).string = recordList[i].time;
            this._recordNodes[i]._phoneNumber.getComponent(cc.Label).string = recordList[i].phoneNumber;
        }
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();