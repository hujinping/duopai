(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Common/MemoryDetector.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '86461BkJVpNt4ZELh7OE6Sl', 'MemoryDetector', __filename);
// Script/Common/MemoryDetector.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var MemoryDetector = /** @class */ (function () {
    function MemoryDetector() {
    }
    MemoryDetector_1 = MemoryDetector;
    MemoryDetector.showMemoryStatus = function () {
        if (cc.sys.isNative) {
            return;
        }
        if (MemoryDetector_1._inited) {
            return;
        }
        var _memLabel = null;
        var profiler = cc["profiler"];
        //profiler.showStats();
        var createMemLabel = function () {
            _memLabel = document.createElement('div');
            profiler._fps = document.getElementById('fps');
            profiler._fps.style.height = '100px';
            var style = _memLabel.style;
            style.color = 'rgb(0, 255, 255)';
            style.font = 'bold 12px Helvetica, Arial';
            style.lineHeight = '20px;';
            style.width = '100%';
            profiler._fps.appendChild(_memLabel);
        };
        //createMemLabel();
        var afterVisit = function () {
            var count = 0;
            var totalBytes = 0;
            var locTexrues = cc.textureCache["_textures"];
            for (var key in locTexrues) {
                var selTexture = locTexrues[key];
                count++;
                totalBytes += selTexture.getPixelWidth() * selTexture.getPixelHeight() * 4;
            }
            var locTextureColorsCache = cc.textureCache["_textureColorsCache"];
            for (var key in locTextureColorsCache) {
                var selCanvasColorsArr = locTextureColorsCache[key];
                for (var selCanvasKey in selCanvasColorsArr) {
                    var selCanvas = selCanvasColorsArr[selCanvasKey];
                    count++;
                    totalBytes += selCanvas.width * selCanvas.height * 4;
                }
            }
            //_memLabel.innerHTML = "  Memory  " + (totalBytes / (1024.0 * 1024.0)).toFixed(2) + " M";
            console.log("log-----------------------memory=:", (totalBytes / (1024.0 * 1024.0)).toFixed(2) + "M");
        };
        cc.director.on(cc.Director.EVENT_AFTER_VISIT, afterVisit);
        MemoryDetector_1._inited = true;
    };
    MemoryDetector._inited = false;
    MemoryDetector = MemoryDetector_1 = __decorate([
        ccclass
    ], MemoryDetector);
    return MemoryDetector;
    var MemoryDetector_1;
}());
exports.MemoryDetector = MemoryDetector;

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
        //# sourceMappingURL=MemoryDetector.js.map
        