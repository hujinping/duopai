(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Common/UserManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1c7810/IFZD5LG6YNJImyPA', 'UserManager', __filename);
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
        //# sourceMappingURL=UserManager.js.map
        