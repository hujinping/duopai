"use strict";
cc._RF.push(module, '4d4d9jueVJMnoeoNVuMb5gY', 'UILoader');
// Script/Common/UILoader.ts

Object.defineProperty(exports, "__esModule", { value: true });
function initRetain(texture) {
    if (texture.retain == null) {
        texture.retain = 0;
    }
}
function _isNullObj(texture) {
    if (texture) {
        return true;
    }
    return false;
}
function initSceneRetain(texture) {
    if (texture) {
        if (texture.retain == undefined || texture.retain == null) {
            texture.retain = 1;
            return false;
        }
        else {
            return true;
        }
    }
    return false;
}
function parserPrefab(node, number) {
    // if (!(node instanceof cc.Scene)) {
    //     parserPrefabNode(node, number);
    // }
    var children = node._children;
    children.forEach(function (child) {
        parserPrefabNode(child, number);
        parserPrefab(child, number);
    });
}
function parserPrefabNode(node, number) {
    var sprite = node.getComponent(cc.Sprite);
    if (sprite && sprite.spriteFrame) {
        initRetain(cc.loader["_cache"][sprite.spriteFrame._textureFilename]);
        cc.loader["_cache"][sprite.spriteFrame._textureFilename].retain += number;
    }
    var button = node.getComponent(cc.Button);
    if (button) {
        if (button.normalSprite) {
            initRetain(cc.loader["_cache"][button.normalSprite._textureFilename]);
            cc.loader["_cache"][button.normalSprite._textureFilename].retain += number;
        }
        if (button.pressedSprite) {
            initRetain(cc.loader["_cache"][button.pressedSprite._textureFilename]);
            cc.loader["_cache"][button.pressedSprite._textureFilename].retain += number;
        }
        if (button.hoverSprite) {
            initRetain(cc.loader["_cache"][button.hoverSprite._textureFilename]);
            cc.loader["_cache"][button.hoverSprite._textureFilename].retain += number;
        }
        if (button.disabledSprite) {
            initRetain(cc.loader["_cache"][button.disabledSprite._textureFilename]);
            cc.loader["_cache"][button.disabledSprite._textureFilename].retain += number;
        }
    }
    var label = node.getComponent(cc.Label);
    if (label && label.font && label.font instanceof cc.BitmapFont && label.font.spriteFrame) {
        initRetain(cc.loader["_cache"][label.font.spriteFrame._textureFilename]);
        cc.loader["_cache"][label.font.spriteFrame._textureFilename].retain += number;
    }
    var richText = node.getComponent(cc.RichText);
    if (richText && richText.imageAtlas) {
        var keys = Object.keys(richText.imageAtlas._spriteFrames);
        if (keys.length > 0) {
            initRetain(cc.loader["_cache"][richText.imageAtlas._spriteFrames[keys[0]]._textureFilename]);
            cc.loader["_cache"][richText.imageAtlas._spriteFrames[keys[0]]._textureFilename].retain += number;
        }
    }
    var particleSystem = node.getComponent(cc.ParticleSystem);
    if (particleSystem && particleSystem._texture) {
        initRetain(cc.loader["_cache"][particleSystem._texture]);
        cc.loader["_cache"][particleSystem._texture].retain += number;
    }
    var pageViewIndicator = node.getComponent(cc.PageViewIndicator);
    if (pageViewIndicator && pageViewIndicator.spriteFrame) {
        initRetain(cc.loader["_cache"][pageViewIndicator.spriteFrame._textureFilename]);
        cc.loader["_cache"][pageViewIndicator.spriteFrame._textureFilename].retain += number;
    }
    var editBox = node.getComponent(cc.EditBox);
    if (editBox && editBox.backgroundImage) {
        initRetain(cc.loader["_cache"][editBox.backgroundImage._textureFilename]);
        cc.loader["_cache"][editBox.backgroundImage._textureFilename].retain += number;
    }
    var mask = node.getComponent(cc.Mask);
    if (mask && mask.spriteFrame) {
        initRetain(cc.loader["_cache"][mask.spriteFrame._textureFilename]);
        cc.loader["_cache"][mask.spriteFrame._textureFilename].retain += number;
    }
}
function parseStaticRes(item, tag) {
    if (item instanceof cc.Texture2D) {
        cc.loader["_cache"][item.url].isStatic = true;
        cc.loader["_cache"][item.url].cusTag = tag;
    }
    else if (item instanceof cc.SpriteFrame) {
        cc.loader["_cache"][item["_textureFilename"]].isStatic = true;
        cc.loader["_cache"][item["_textureFilename"]].cusTag = tag;
    }
    else if (item instanceof cc.Prefab) {
        parseStaticPrefab(item, tag);
    }
    else if (item instanceof cc.BitmapFont) {
        cc.loader["_cache"][item["spriteFrame"]._textureFilename].isStatic = true;
        cc.loader["_cache"][item["spriteFrame"]._textureFilename].cusTag = tag;
    }
    else if (item instanceof cc.SpriteAtlas) {
        var keys = Object.keys(item["_spriteFrames"]);
        keys.forEach(function (key) {
            cc.loader["_cache"][item["_spriteFrames"][key]._textureFilename].isStatic = true;
            cc.loader["_cache"][item["_spriteFrames"][key]._textureFilename].cusTag = tag;
        });
    }
    else if (item instanceof cc.AnimationClip) {
        cc.log('AnimationClip 资源加载未做处理');
    }
    else if (item instanceof Object && item.name) {
        cc.log('Object 资源加载未做处理');
    }
}
function parseStaticPrefab(node, tag) {
    var prefab = node;
    if (node.data) {
        prefab = node.data;
    }
    if (!(prefab instanceof cc.Scene)) {
        parseStaticNode(prefab, tag);
    }
    var children = prefab._children;
    children.forEach(function (child) {
        parseStaticNode(child, tag);
        parseStaticPrefab(child, tag);
    });
}
function parseStaticNode(node, tag) {
    var sprite = node.getComponent(cc.Sprite);
    if (sprite && sprite.spriteFrame) {
        if (_isNullObj(cc.loader["_cache"][sprite.spriteFrame._textureFilename])) {
            cc.loader["_cache"][sprite.spriteFrame._textureFilename].isStatic = true;
            cc.loader["_cache"][sprite.spriteFrame._textureFilename].cusTag = tag;
        }
    }
    var button = node.getComponent(cc.Button);
    if (button) {
        if (button.normalSprite) {
            if (_isNullObj(cc.loader["_cache"][button.normalSprite._textureFilename])) {
                cc.loader["_cache"][button.normalSprite._textureFilename].isStatic = true;
                cc.loader["_cache"][button.normalSprite._textureFilename].cusTag = tag;
            }
        }
        if (button.pressedSprite) {
            if (_isNullObj(cc.loader["_cache"][button.pressedSprite._textureFilename])) {
                cc.loader["_cache"][button.pressedSprite._textureFilename].isStatic = true;
                cc.loader["_cache"][button.pressedSprite._textureFilename].cusTag = tag;
            }
        }
        if (button.hoverSprite) {
            if (_isNullObj(cc.loader["_cache"][button.hoverSprite._textureFilename])) {
                cc.loader["_cache"][button.hoverSprite._textureFilename].isStatic = true;
                cc.loader["_cache"][button.hoverSprite._textureFilename].cusTag = tag;
            }
        }
        if (button.disabledSprite) {
            if (_isNullObj(cc.loader["_cache"][button.disabledSprite._textureFilename])) {
                cc.loader["_cache"][button.disabledSprite._textureFilename].isStatic = true;
                cc.loader["_cache"][button.disabledSprite._textureFilename].cusTag = tag;
            }
        }
    }
    var label = node.getComponent(cc.Label);
    if (label && label.font && label.font instanceof cc.BitmapFont && label.font.spriteFrame) {
        if (_isNullObj(cc.loader["_cache"][label.font.spriteFrame._textureFilename])) {
            cc.loader["_cache"][label.font.spriteFrame._textureFilename].isStatic = true;
            cc.loader["_cache"][label.font.spriteFrame._textureFilename].cusTag = tag;
        }
    }
    var richText = node.getComponent(cc.RichText);
    if (richText && richText.imageAtlas) {
        var keys = Object.keys(richText.imageAtlas._spriteFrames);
        if (keys.length > 0) {
            if (_isNullObj(cc.loader["_cache"][richText.imageAtlas._spriteFrames[keys[0]]._textureFilename])) {
                cc.loader["_cache"][richText.imageAtlas._spriteFrames[keys[0]]._textureFilename].isStatic = true;
                cc.loader["_cache"][richText.imageAtlas._spriteFrames[keys[0]]._textureFilename].cusTag = tag;
            }
        }
    }
    var particleSystem = node.getComponent(cc.ParticleSystem);
    if (particleSystem && particleSystem._texture) {
        if (_isNullObj(cc.loader["_cache"][particleSystem._texture])) {
            cc.loader["_cache"][particleSystem._texture].isStatic = true;
            cc.loader["_cache"][particleSystem._texture].cusTag = tag;
        }
    }
    var pageViewIndicator = node.getComponent(cc.PageViewIndicator);
    if (pageViewIndicator && pageViewIndicator.spriteFrame) {
        if (_isNullObj(cc.loader["_cache"][pageViewIndicator.spriteFrame._textureFilename])) {
            cc.loader["_cache"][pageViewIndicator.spriteFrame._textureFilename].isStatic = true;
            cc.loader["_cache"][pageViewIndicator.spriteFrame._textureFilename].cusTag = tag;
        }
    }
    var editBox = node.getComponent(cc.EditBox);
    if (editBox && editBox.backgroundImage) {
        if (_isNullObj(cc.loader["_cache"][editBox.backgroundImage._textureFilename])) {
            cc.loader["_cache"][editBox.backgroundImage._textureFilename].isStatic = true;
            cc.loader["_cache"][editBox.backgroundImage._textureFilename].cusTag = tag;
        }
    }
    var mask = node.getComponent(cc.Mask);
    if (mask && mask.spriteFrame) {
        if (_isNullObj(cc.loader["_cache"][mask.spriteFrame._textureFilename])) {
            cc.loader["_cache"][mask.spriteFrame._textureFilename].cusTag = tag;
            cc.loader["_cache"][mask.spriteFrame._textureFilename].isStatic = true;
        }
    }
}
function deepCloneObj(obj) {
    var i;
    var o = Array.isArray(obj) ? [] : {};
    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            o[i] = typeof obj[i] === "Object" ? deepCloneObj(obj[i]) : obj[i];
        }
    }
    return o;
}
function releaseNodeRes() {
    var dependAssets = cc.director.getScene()["dependAssets"];
    var texturesInCache = deepCloneObj(cc.loader["_cache"]);
    var release_key = [];
    for (var asset in texturesInCache) {
        if (texturesInCache[asset].isStatic) {
            continue;
        }
        // if (dependAssets.indexOf(asset) !== -1) {
        //     continue;
        // }
        if (texturesInCache[asset].retain <= 0) {
            release_key.push(texturesInCache[asset].url);
            cc.loader.release(texturesInCache[asset].url);
        }
    }
    var release_json = [];
    for (var asset in cc.loader["_cache"]) {
        if (cc.loader["_cache"][asset].dependKeys && cc.loader["_cache"][asset].dependKeys.length > 0) {
            var is_release = false;
            for (var i = 0; i < cc.loader["_cache"][asset].dependKeys.length; i++) {
                if (release_key.indexOf(cc.loader["_cache"][asset].dependKeys[i]) !== -1) {
                    is_release = true;
                }
            }
            if (is_release) {
                release_json.push(cc.loader["_cache"][asset].url);
                cc.loader.release(cc.loader["_cache"][asset].url);
            }
        }
    }
    for (var asset in cc.loader["_cache"]) {
        if (cc.loader["_cache"][asset].dependKeys && cc.loader["_cache"][asset].dependKeys.length > 0) {
            var is_release = false;
            for (var i = 0; i < cc.loader["_cache"][asset].dependKeys.length; i++) {
                if (release_json.indexOf(cc.loader["_cache"][asset].dependKeys[i]) !== -1) {
                    is_release = true;
                }
            }
            if (is_release) {
                cc.loader.release(cc.loader["_cache"][asset].url);
            }
        }
    }
    release_key = [];
}
function releaseStaticRes(tag) {
    var dependAssets = cc.director.getScene()["dependAssets"];
    var texturesInCache = deepCloneObj(cc.loader["_cache"]);
    var release_key = [];
    for (var asset in texturesInCache) {
        if (tag) {
            if (texturesInCache[asset].cusTag != tag) {
                continue;
            }
        }
        if (texturesInCache[asset].retain > 0 && texturesInCache[asset].isStatic) {
            cc.log(asset + " \u8FD8\u5728\u4F7F\u7528\u4E2D..., \u8BE5\u7EB9\u7406\u4E0D\u4F1A\u91CA\u653E");
            continue;
        }
        // if (texturesInCache[asset].isStatic) {
        //     texturesInCache[asset].retain -= 1;
        // }
        if (texturesInCache[asset].retain <= 0) {
            release_key.push(texturesInCache[asset].url);
            cc.loader.release(texturesInCache[asset].url);
        }
    }
    var release_json = [];
    for (var asset in cc.loader["_cache"]) {
        if (cc.loader["_cache"][asset].dependKeys && cc.loader["_cache"][asset].dependKeys.length > 0) {
            var is_release = false;
            for (var i = 0; i < cc.loader["_cache"][asset].dependKeys.length; i++) {
                if (release_key.indexOf(cc.loader["_cache"][asset].dependKeys[i]) !== -1) {
                    is_release = true;
                }
            }
            if (is_release) {
                release_json.push(cc.loader["_cache"][asset].url);
                cc.loader.release(cc.loader["_cache"][asset].url);
            }
        }
    }
    for (var asset in cc.loader["_cache"]) {
        if (cc.loader["_cache"][asset].dependKeys && cc.loader["_cache"][asset].dependKeys.length > 0) {
            var is_release = false;
            for (var i = 0; i < cc.loader["_cache"][asset].dependKeys.length; i++) {
                if (release_json.indexOf(cc.loader["_cache"][asset].dependKeys[i]) !== -1) {
                    is_release = true;
                }
            }
            if (is_release) {
                cc.loader.release(cc.loader["_cache"][asset].url);
            }
        }
    }
    release_key = [];
}
function replaceButtonTexture(target, normalSprite, newNormalSprite) {
    if (target[normalSprite]) {
        initRetain(cc.loader["_cache"][target[normalSprite]._textureFilename]);
        cc.loader["_cache"][target[normalSprite]._textureFilename].retain -= 1;
    }
    initRetain(cc.loader["_cache"][newNormalSprite._textureFilename]);
    cc.loader["_cache"][newNormalSprite._textureFilename].retain += 1;
    target[normalSprite] = newNormalSprite;
}
var key_map = {};
var audioPath = null;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UILoader = /** @class */ (function () {
    function UILoader() {
    }
    UILoader.loadRes = function (path, type, callback) {
        cc.loader.loadRes(path, type, function (err, asset) {
            if (err) {
                cc.log("[\u8D44\u6E90\u52A0\u8F7D] \u9519\u8BEF " + err);
                return;
            }
            callback(asset);
        });
    };
    UILoader.loadStaticRes = function (path, type, tag, callback) {
        if (!path || !type || !callback) {
            cc.log("参数错误");
            return;
        }
        cc.loader.loadRes(path, type, function (err, asset) {
            if (err) {
                cc.log("[\u8D44\u6E90\u52A0\u8F7D] \u9519\u8BEF " + err);
                return;
            }
            callback(asset);
            parseStaticRes(asset, tag);
        });
    };
    UILoader.retainScene = function (scene) {
        parserPrefab(scene, 1);
    };
    UILoader.replaceSpriteTexture = function (target, spriteFrame) {
        if (!target || !spriteFrame) {
            cc.log("参数错误");
            return;
        }
        if (!target.getComponent(cc.Sprite)) {
            cc.log("目标节点没有Sprite组件");
            return;
        }
        var sprite = target.getComponent(cc.Sprite);
        replaceButtonTexture(sprite, "spriteFrame", spriteFrame);
        releaseNodeRes();
    };
    UILoader.replaceButtonTexture = function (target, normalSprite, pressedSprite, hoverSprite, disabledSprite) {
        if (!target || !normalSprite) {
            cc.log("参数错误");
            return;
        }
        if (!target.getComponent(cc.Button)) {
            cc.log("目标节点没有Button组件");
            return;
        }
        var button = target.getComponent(cc.Button);
        if (normalSprite) {
            replaceButtonTexture(button, "normalSprite", normalSprite);
        }
        if (pressedSprite) {
            replaceButtonTexture(button, "pressedSprite", pressedSprite);
        }
        if (hoverSprite) {
            replaceButtonTexture(button, "hoverSprite", hoverSprite);
        }
        if (disabledSprite) {
            replaceButtonTexture(button, "disabledSprite", disabledSprite);
        }
        releaseNodeRes();
    };
    UILoader.instantiate = function (prefab, target, callback) {
        if (!target || !callback) {
            cc.log("参数不对, 请检查参数");
        }
        var node_prefab = cc.instantiate(prefab);
        target.addChild(node_prefab);
        callback(node_prefab);
        parserPrefab(node_prefab, 1);
    };
    UILoader.releaseStaticRes = function (tag) {
        if (tag === void 0) { tag = null; }
        releaseStaticRes(tag);
    };
    UILoader.destroy = function (node) {
        if (!(node instanceof cc.Node)) {
            cc.log("你要销毁的不是一个节点");
            return;
        }
        parserPrefab(node, -1);
        node.destroy();
        releaseNodeRes();
    };
    UILoader.beforeSceneLoading = function (event /*, detail*/) {
        key_map = {};
        var dependAssets = event.currentTarget._scene.dependAssets;
        if (dependAssets && dependAssets.length > 0) {
            for (var i = 0; i < dependAssets.length; i++) {
                if (cc.loader["_cache"][dependAssets[i]] && cc.loader["_cache"][dependAssets[i]].isStatic) {
                    key_map[i] = dependAssets[i];
                    delete dependAssets[i];
                }
                if (initSceneRetain(cc.loader["_cache"][dependAssets[i]])) {
                    cc.loader["_cache"][dependAssets[i]].retain -= 1;
                }
            }
        }
        var keys = Object.keys(cc.loader["_cache"]);
        keys.forEach(function (key) {
            if (cc.loader["_cache"][key] && !cc.loader["_cache"][key].isStatic && cc.loader["_cache"][key].retain > 0) {
                if (initSceneRetain(cc.loader["_cache"][key])) {
                    cc.loader["_cache"][key].retain = 0;
                }
            }
        });
    };
    UILoader.afterSceneLaunch = function (event /*, detail*/) {
        for (var key in key_map) {
            event.currentTarget._scene.dependAssets[key] = key_map[key];
        }
        var dependAssets = event.currentTarget._scene.dependAssets;
        if (dependAssets && dependAssets.length > 0) {
            for (var i = dependAssets.length - 1; i >= 0; i--) {
                if (cc.loader["_cache"][dependAssets[i]] && cc.loader["_cache"][dependAssets[i]].isStatic) {
                    continue;
                }
                if (initSceneRetain(cc.loader["_cache"][dependAssets[i]])) {
                    cc.loader["_cache"][dependAssets[i]].retain += 1;
                }
            }
        }
        releaseNodeRes();
    };
    UILoader.playEffect = function (path, volume) {
        if (!path || !volume) {
            cc.log("参数错误");
            return;
        }
        var audioID = cc.audioEngine.play(path, false, volume);
        cc.audioEngine.setFinishCallback(audioID, function (ss, ss11) {
            cc.loader.release(cc.loader["_cache"][ss.target.src].url);
        });
        return audioID;
    };
    UILoader.playMusic = function (path, loop, volume) {
        if (!path || !volume) {
            cc.log("参数错误");
            return;
        }
        if (audioPath) {
            cc.loader.release(cc.loader["_cache"][audioPath].url);
        }
        audioPath = path;
        var audioID = cc.audioEngine.play(path, loop, volume);
        cc.audioEngine.setFinishCallback(audioID, function (ss, ss11) {
            cc.log("触发回调函数");
            cc.loader.release(cc.loader["_cache"][ss.target.src].url);
        });
        return audioID;
    };
    UILoader = __decorate([
        ccclass
    ], UILoader);
    return UILoader;
}());
exports.UILoader = UILoader;

cc._RF.pop();