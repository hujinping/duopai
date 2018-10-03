"use strict";
cc._RF.push(module, '55d02b1p5hDgagEsZ4zByL4', 'AudioManager');
// Script/Common/AudioManager.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 声音管理
 */
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AudioManager = /** @class */ (function () {
    function AudioManager() {
        this.string = null; //当前正在播放的背景音乐
        this.musicId = null; //当前正在播放的背景音乐
        this.soundId = null; //当前正在播放的音效
        this._musicOn = true; //是否开启播放背景音乐
        this._soundOn = true; //是否开启播放音效
    }
    AudioManager_1 = AudioManager;
    AudioManager.getInstance = function () {
        if (AudioManager_1.mAudioManager == null) {
            AudioManager_1.mAudioManager = new AudioManager_1();
        }
        return AudioManager_1.mAudioManager;
    };
    //播放背景音乐
    AudioManager.prototype.playMusic = function (path, loop, volume) {
        if (loop === void 0) { loop = true; }
        if (volume === void 0) { volume = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!path) {
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!(this.musicPath != path)) return [3 /*break*/, 3];
                        if (this.musicId != null) {
                            cc.audioEngine.stop(this.musicId);
                        }
                        _a = this;
                        return [4 /*yield*/, this.play(path, loop, volume)];
                    case 2:
                        _a.musicId = _b.sent();
                        _b.label = 3;
                    case 3:
                        this.musicPath = path;
                        if (!this.musicOn) {
                            this.pauseMusic();
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AudioManager.prototype.getMusicId = function () {
        return this.musicId;
    };
    AudioManager.prototype.pauseMusic = function () {
        cc.audioEngine.pause(this.musicId);
    };
    AudioManager.prototype.resumeMusic = function () {
        cc.audioEngine.resume(this.musicId);
    };
    /**
     * 播放音效
     *
     * @param path 路径
     * @param loop 是否循环
     * @param resolve 播放成功回调
     * @param reject 播放失败回调
     */
    AudioManager.prototype.playSoundAsync = function (path, loop, resolve, reject) {
        if (loop === void 0) { loop = false; }
        var promiseNumber = this.playSound(path, loop);
        if (promiseNumber) {
            if (resolve && reject) {
                promiseNumber.then(resolve, reject);
                return;
            }
            if (reject) {
                promiseNumber.catch(reject);
            }
        }
        else {
            if (reject) {
                reject(null);
            }
        }
    };
    //播放很短的音效
    AudioManager.prototype.playSound = function (path, loop) {
        if (loop === void 0) { loop = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!path) {
                            return [2 /*return*/];
                        }
                        if (!this.soundOn) {
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.play(path, loop)];
                    case 2:
                        _a.soundId = _b.sent();
                        return [2 /*return*/, this.soundId];
                    case 3:
                        e_2 = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 停止播放音效
     *
     * @param audioId
     */
    AudioManager.prototype.stopSound = function (audioId) {
        if (typeof audioId === "number") {
            cc.audioEngine.stop(audioId);
        }
    };
    /**
     * 停止播放所有声音
     */
    AudioManager.prototype.stopAll = function () {
        this.musicPath = null;
        this.musicId = null;
        cc.audioEngine.stopAll();
    };
    AudioManager.prototype.play = function (path, loop, volume) {
        if (loop === void 0) { loop = false; }
        if (volume === void 0) { volume = 1; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        cc.loader.loadRes(path, function (err, audio) {
                            if (!err) {
                                var id = cc.audioEngine.play(audio, loop, volume);
                                // cc.log("async play audio %s", audio);
                                resolve(id);
                            }
                            else {
                                cc.error(err);
                                reject(err);
                            }
                        });
                    })];
            });
        });
    };
    Object.defineProperty(AudioManager.prototype, "musicOn", {
        get: function () {
            return this._musicOn;
        },
        set: function (on) {
            if (this._musicOn == on) {
                return;
            }
            this._musicOn = on;
            if (on) {
                this.resumeMusic();
            }
            else {
                this.pauseMusic();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioManager.prototype, "soundOn", {
        get: function () {
            return this._soundOn;
        },
        set: function (on) {
            this._soundOn = on;
        },
        enumerable: true,
        configurable: true
    });
    AudioManager = AudioManager_1 = __decorate([
        ccclass
    ], AudioManager);
    return AudioManager;
    var AudioManager_1;
}());
exports.default = AudioManager;

cc._RF.pop();