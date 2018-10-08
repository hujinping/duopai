"use strict";
cc._RF.push(module, '0b7913O/QlNjLISQVO2P7o9', 'loading');
// Script/UI/loading/loading.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameCtr_1 = require("../../Controller/GameCtr");
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._btnStart = null;
        _this._progress = null;
        _this._configTotalCount = 5;
        _this._configIndex = 0;
        _this._adNode = null;
        _this._carouselNode = null;
        _this._carouseAds = [];
        _this._carouselIndex = 0;
        _this.ad = null;
        return _this;
    }
    NewClass.prototype.onLoad = function () {
        this._progress = this.node.getChildByName("progress");
        this._btnStart = this.node.getChildByName("btn_start");
        this._adNode = this.node.getChildByName("adNode");
        this._carouselNode = this.node.getChildByName("carouselNode");
        this.initData();
        this.loadConf();
        this.initBtnStart();
        GameCtr_1.default.getInstance();
        //GameCtr.showLoading();
        GameCtr_1.default.getInstance().setLoading(this);
        this._btnStart.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.4, 1.05), cc.scaleTo(0.4, 1.0))));
    };
    NewClass.prototype.initCarousel = function () {
        var _this = this;
        if (!GameCtr_1.default.isAudited) {
            return;
        }
        if (!GameCtr_1.default.setting.nav.navA || GameCtr_1.default.setting.nav.navA <= 0) {
            return;
        }
        for (var i = 0; i < GameCtr_1.default.setting.nav.navA.length; i++) {
            var ad = cc.instantiate(this.ad);
            ad.parent = this._carouselNode;
            ad.scale = 1.0;
            ad.getComponent("ad").init(GameCtr_1.default.setting.nav.navA[i]);
            ad.x = i == 0 ? 0 : 1800;
            this._carouseAds.push(ad);
        }
        this._carouselIndex = 0;
        this.scheduleOnce(function () {
            _this._carouseAds[_this._carouselIndex].getComponent("ad").doShake();
        }, 2);
        this.scheduleOnce(this.doCarousel.bind(this), 5);
    };
    NewClass.prototype.doCarousel = function () {
        if (this._carouseAds.length <= 1) { //广告位推荐位大于1个，才有轮播功能
            return;
        }
        this._carouseAds[this._carouselIndex].x = 0;
        this._carouseAds[this._carouselIndex].getComponent("ad").doShake();
        for (var i = 0; i < this._carouseAds.length; i++) {
            if (i == this._carouselIndex) {
                continue;
            }
            this._carouseAds[i].rotation = 0;
            this._carouseAds[i].getComponent("ad").stopActions();
            this._carouseAds[i].x = 1800; //移除屏幕之外
        }
        this._carouselIndex++;
        this._carouselIndex = this._carouselIndex % this._carouseAds.length;
        this.scheduleOnce(this.doCarousel.bind(this), 5);
    };
    NewClass.prototype.initBtnStart = function () {
        var _this = this;
        this._btnStart.on(cc.Node.EventType.TOUCH_END, function (e) {
            AudioManager_1.default.getInstance().playSound("audio/open_panel");
            if (_this._configIndex < _this._configTotalCount) {
                //todo 提示
                return;
            }
            cc.director.loadScene("Game");
        });
    };
    NewClass.prototype.loadResource = function () {
        cc.loader.loadResDir("textures", this.progressCallback.bind(this), this.completeCallback.bind(this));
    };
    NewClass.prototype.progressCallback = function (completedCount, totalCount, item) {
        this._progress.getComponent(cc.ProgressBar).progress = completedCount / totalCount;
    };
    NewClass.prototype.completeCallback = function () {
        this.loadConf();
    };
    NewClass.prototype.loadConf = function () {
        this.loadLevelConf();
        this.loadmanufactureConf();
        this.loadCombConf();
        this.loadPfTurntableConf();
        this.loadOtherConf();
    };
    NewClass.prototype.loadLevelConf = function () {
        var _this = this;
        cc.loader.loadRes("config/level", function (err, res) {
            if (err) {
                return;
            }
            GameCtr_1.default.levelConfig = res;
            _this.checkLoadConfigOver();
        });
    };
    NewClass.prototype.loadmanufactureConf = function () {
        var _this = this;
        cc.loader.loadRes("config/manufacture", function (err, res) {
            if (err) {
                return;
            }
            GameCtr_1.default.manufactureConfig = res;
            _this.checkLoadConfigOver();
        });
    };
    NewClass.prototype.loadCombConf = function () {
        var _this = this;
        cc.loader.loadRes("config/comb", function (err, res) {
            if (err) {
                return;
            }
            GameCtr_1.default.combConfig = res;
            _this.checkLoadConfigOver();
        });
    };
    NewClass.prototype.loadPfTurntableConf = function () {
        var _this = this;
        cc.loader.loadRes("config/pfTurnTable", function (err, res) {
            if (err) {
                return;
            }
            GameCtr_1.default.pfTurnTableConfig = res;
            console.log("log----------GameCtr.pfTurnTableConfig=:", GameCtr_1.default.pfTurnTableConfig);
            _this.checkLoadConfigOver();
        });
    };
    NewClass.prototype.loadOtherConf = function () {
        var _this = this;
        cc.loader.loadRes("config/other", function (err, res) {
            if (err) {
                return;
            }
            GameCtr_1.default.otherConfig = res;
            _this.checkLoadConfigOver();
        });
    };
    NewClass.prototype.checkLoadConfigOver = function () {
        this._configIndex++;
    };
    NewClass.prototype.initData = function () {
        if (GameCtr_1.default.getInstance().getPlayerLevel()) {
            GameCtr_1.default.level = GameCtr_1.default.getInstance().getPlayerLevel();
        }
        else {
            GameCtr_1.default.level = 1;
            GameCtr_1.default.getInstance().setPlayerLevel();
        }
        if (GameCtr_1.default.getInstance().getManufactureLevel()) {
            GameCtr_1.default.ManufactureLevel = GameCtr_1.default.getInstance().getManufactureLevel();
        }
        else {
            GameCtr_1.default.ManufactureLevel = 1;
            GameCtr_1.default.getInstance().setManufactureLevel();
        }
        if (GameCtr_1.default.getInstance().getCombLevel()) {
            GameCtr_1.default.comblevel = GameCtr_1.default.getInstance().getCombLevel();
        }
        else {
            GameCtr_1.default.comblevel = 1;
            GameCtr_1.default.getInstance().setCombLevel();
        }
        console.log("log-------GameCtr.comblebel=:", GameCtr_1.default.comblevel);
        if (GameCtr_1.default.getInstance().getCombsUnlock()) {
            GameCtr_1.default.combsUnlock = JSON.parse(GameCtr_1.default.getInstance().getCombsUnlock());
        }
        else {
            GameCtr_1.default.combsUnlock = [];
            GameCtr_1.default.combsUnlock.push({ level: 1, unlock: true });
            GameCtr_1.default.getInstance().setCombsUnlock();
        }
        if (window.localStorage.getItem("guide")) {
            GameCtr_1.default.guide = JSON.parse(window.localStorage.getItem("guide"));
        }
        else {
            GameCtr_1.default.guide = [];
            GameCtr_1.default.getInstance().setGuide();
        }
        if (window.localStorage.getItem("honeyValue")) {
            GameCtr_1.default.honeyValue = GameCtr_1.default.getInstance().getHoneyValue();
        }
        else {
            GameCtr_1.default.honeyValue = 0;
            GameCtr_1.default.getInstance().setHoneyValue();
        }
        GameCtr_1.default.rich = GameCtr_1.default.getInstance().getRich();
        GameCtr_1.default.money = GameCtr_1.default.getInstance().getMoney();
        GameCtr_1.default.levelMoney = GameCtr_1.default.getInstance().getLevelMoney();
        GameCtr_1.default.guide = GameCtr_1.default.getInstance().getGuide();
        if (!GameCtr_1.default.rich)
            GameCtr_1.default.rich = 0;
        if (!GameCtr_1.default.money)
            GameCtr_1.default.money = 0;
        if (!GameCtr_1.default.levelMoney)
            GameCtr_1.default.levelMoney = 0;
    };
    NewClass.prototype.refreshMoreNewGame = function () {
        if (!GameCtr_1.default.isAudited) {
            return;
        }
        if (!GameCtr_1.default.setting.nav.banner || GameCtr_1.default.setting.nav.banner <= 0) {
            return;
        }
        if (!this._adNode) {
            return;
        }
        this._adNode.active = true;
        var adFrame = this._adNode.getChildByName("adFrame");
        for (var i = 0; i < GameCtr_1.default.setting.nav.banner.length; i++) {
            if (i >= 4)
                return;
            var ad = cc.instantiate(this.ad);
            ad.parent = adFrame;
            ad.scale = 1.0;
            ad.getComponent("ad").init(GameCtr_1.default.setting.nav.banner[i]);
            ad.y = -15;
            if (i == 0)
                ad.x = -292;
            if (i == 1)
                ad.x = -97;
            if (i == 2)
                ad.x = 96;
            if (i == 3)
                ad.x = 292;
        }
        this.initCarousel();
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "ad", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();