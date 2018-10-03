(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Common/Util.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2190bA9XapLCKNN06NNZmnm', 'Util', __filename);
// Script/Common/Util.ts

/**
 * 通用工具类
 */
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Util = /** @class */ (function () {
    function Util() {
    }
    Util_1 = Util;
    //根据图片路径设置sprite的spriteFrame
    Util.loadImg = function (spr, imgUrl) {
        cc.loader.load({
            url: imgUrl,
            type: 'png'
        }, function (err, texture) {
            spr.spriteFrame = new cc.SpriteFrame(texture);
        });
    };
    /**
     * 返回当前节点下第一个名为name的子节点
     * @param name 节点名
     * @param node 开始查找的根节点
     */
    Util.findChildByName = function (name, node) {
        if (!name || !node || !node.children) {
            return null;
        }
        var result = node.getChildByName(name);
        if (result) {
            return result;
        }
        var children = node.children;
        for (var index = 0; index < children.length; index++) {
            result = Util_1.findChildByName(name, children[index]);
            if (result) {
                return result;
            }
        }
        return null;
    };
    /**
     * 设置节点文本
     *
     * @param text 文本
     * @param node 节点
     */
    Util.setString = function (node, text) {
        if (typeof text === "number") {
            text = text + "";
        }
        text = text || "";
        if (node instanceof cc.Node) {
            var label = node.getComponent(cc.Label);
            if (cc.isValid(label)) {
                label.string = text;
                return;
            }
            var editBox = node.getComponent(cc.EditBox);
            if (cc.isValid(editBox)) {
                editBox.string = text;
            }
        }
        else {
            if (cc.isValid(node)) {
                node.string = text;
            }
        }
    };
    //裁剪字符串，超出指定长度之后显示...(每个中文字符长度为2）
    Util.cutstr = function (str, len) {
        var str_length = 0;
        var str_len = 0;
        var str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            var a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4 
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length > len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        // //如果给定字符串小于指定长度，则返回源字符串； 
        // if (str_length < len) {
        //     return str;
        // }
        return str;
    };
    //获取年月日,格式为:2017-05-06
    Util.getCurrTimeYYMMDD = function () {
        var time = "";
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month;
        if ((myDate.getMonth() + 1) < 10) {
            month = "0" + (myDate.getMonth() + 1);
        }
        else {
            month = myDate.getMonth() + 1;
        }
        var day;
        if (myDate.getDate() < 10) {
            day = "0" + myDate.getDate();
        }
        else {
            day = myDate.getDate();
        }
        time = year + "-" + month + "-" + day;
        return time;
    };
    //数值格式化
    Util.formatNumber = function (number) {
        if (number > 1000000000) { //十亿
            return (number / 1000000000).toFixed(1) + "B";
        }
        else if (number > 1000000) { //百万
            return (number / 1000000).toFixed(1) + "M";
        }
        else if (number > 1000) { //千
            return (number / 1000).toFixed(1) + "K";
        }
        return number;
    };
    Util = Util_1 = __decorate([
        ccclass
    ], Util);
    return Util;
    var Util_1;
}());
exports.default = Util;

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
        //# sourceMappingURL=Util.js.map
        