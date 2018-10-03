(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Common/Http.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ba804Fwfo1B7pM2bIm/ruPv', 'Http', __filename);
// Script/Common/Http.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Http请求
 */
var UrlConfig_1 = require("./UrlConfig");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Http = /** @class */ (function () {
    function Http() {
        this.isCancel = false;
        this.xhr = new XMLHttpRequest();
        this.xhr.timeout = 10000; //超时10秒
    }
    Http_1 = Http;
    Http.send = function (_a) {
        var _b = _a.mountNode, mountNode = _b === void 0 ? null : _b, //挂载节点
        _c = _a.tag, //挂载节点
        tag = _c === void 0 ? null : _c, //请求标识
        _d = _a.url, //请求标识
        url = _d === void 0 ? null : _d, //请求地址
        _e = _a.data, //请求地址
        data = _e === void 0 ? {} : _e, //请求数据
        _f = _a.method, //请求数据
        method = _f === void 0 ? 'POST' : _f, //请求方式
        _g = _a.success, //请求方式
        success = _g === void 0 ? function (result, tag) { } : _g, //成功回调
        _h = _a.error, //成功回调
        error = _h === void 0 ? null : _h, //失败回调
        _j = _a.async, //失败回调
        async = _j === void 0 ? true : _j;
        if (!url) {
            return;
        }
        if (!/^http/.test(url) && Http_1.rootUrl) {
            url = Http_1.rootUrl + url;
        }
        cc.log('request url:%s method:%s', url, method);
        if (!data.tk) {
            // let time = new Date().getTime();
            // data.tk = App.encryptByDES(App.UserManager.uid + "|" + time);
            // if (App.UserManager.u) {
            //     data.u = App.UserManager.u;
            // }
        }
        cc.log(JSON.stringify(data));
        var http = new Http_1();
        http.request({
            mountNode: mountNode,
            tag: tag,
            url: url,
            data: data,
            method: method,
            success: success,
            error: error,
            async: async
        });
        cc.log('sendsendsendsendsendsendsend', url, method);
        return http;
    };
    /**
     * 不要调用此方法,调用底部的静态call方法
     * 说明->查看底部调用入口
     */
    Http.prototype.request = function (_a) {
        var _this = this;
        var _b = _a.mountNode, mountNode = _b === void 0 ? null : _b, _c = _a.tag, tag = _c === void 0 ? null : _c, _d = _a.url, url = _d === void 0 ? null : _d, _e = _a.data, data = _e === void 0 ? {} : _e, _f = _a.method, method = _f === void 0 ? 'GET' : _f, _g = _a.success, success = _g === void 0 ? function (result, tag) { } : _g, _h = _a.error, error = _h === void 0 ? null : _h, _j = _a.async, async = _j === void 0 ? true : _j;
        method = method || 'GET';
        var dataPair = "";
        for (var k in data) {
            if (dataPair != "") {
                dataPair += "&";
            }
            dataPair += k + "=" + encodeURIComponent(data[k]);
        }
        if (method == "GET" && dataPair != "") {
            if (url.indexOf("?") == -1) {
                url += "?";
            }
            url += dataPair;
        }
        var errCallback = function (msg) {
            if (_this.isCancel) {
                cc.log('request canceled!');
                return;
            }
            if (mountNode != null && !cc.isValid(mountNode)) { //挂载节点已销毁
                return;
            }
            if (error) {
                error(msg, tag);
                error = null;
            }
        };
        this.xhr.onreadystatechange = function () {
            if (_this.xhr.readyState == 4 && !_this.isCancel) {
                if (_this.xhr.status >= 200 && _this.xhr.status <= 400) {
                    var response = _this.xhr.responseText;
                    try {
                        cc.log(response);
                        if (response.indexOf('{') == 0) {
                            response = JSON.parse(response);
                        }
                        if (mountNode != null && !cc.isValid(mountNode)) { //挂载节点已销毁
                            return;
                        }
                        if (success) {
                            success(response, tag);
                        }
                    }
                    catch (e) {
                        cc.error(e);
                    }
                }
                else {
                    cc.warn('http request problem:' + _this.xhr.status);
                    errCallback('连接失败:' + _this.xhr.status);
                }
            }
        };
        this.xhr.onerror = function (e) {
            cc.error('http request onerror');
            errCallback('连接失败，请检查网络');
        };
        this.xhr.ontimeout = function () {
            cc.error('http request ontimeout');
            errCallback('连接超时');
        };
        this.xhr.open(method, url, async);
        this.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if (method == "GET") {
            cc.log('send Get!!');
            this.xhr.send();
        }
        else if (method == "POST") {
            cc.log('send Post!!');
            this.xhr.send(dataPair);
        }
        else {
            cc.log('[HTTP] no send');
        }
    };
    Http.prototype.cancel = function () {
        this.isCancel = true;
    };
    /**
     * Http返回状态
     */
    Http.Code = {
        /**
         * 成功
         */
        OK: "300",
    };
    Http.UrlConfig = UrlConfig_1.default;
    Http.rootUrl = Http_1.UrlConfig.rootUrl;
    Http = Http_1 = __decorate([
        ccclass
    ], Http);
    return Http;
    var Http_1;
}());
exports.default = Http;

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
        //# sourceMappingURL=Http.js.map
        