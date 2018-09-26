"use strict";
cc._RF.push(module, '1c7810/IFZD5LG6YNJImyPA', 'UserManager');
// Script/Common/UserManager.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 用户管理
 */
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UserManager = /** @class */ (function () {
    function UserManager() {
    }
    UserManager_1 = UserManager;
    Object.defineProperty(UserManager, "user", {
        /**
         * 获取用户信息
         */
        get: function () {
            return UserManager_1._user;
        },
        /**
         * 设置用户信息
         */
        set: function (user) {
            UserManager_1._user = user;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserManager, "user_id", {
        //获取用户userid
        get: function () {
            if (UserManager_1._user_id != null) {
                return UserManager_1._user_id;
            }
            return null;
        },
        set: function (user_id) {
            UserManager_1._user_id = user_id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserManager, "voucher", {
        get: function () {
            return UserManager_1._voucher;
        },
        set: function (voucher) {
            UserManager_1._voucher = voucher;
        },
        enumerable: true,
        configurable: true
    });
    UserManager._user = null; //用户信息
    UserManager._user_id = null;
    UserManager._voucher = null;
    UserManager = UserManager_1 = __decorate([
        ccclass
    ], UserManager);
    return UserManager;
    var UserManager_1;
}());
exports.default = UserManager;

cc._RF.pop();