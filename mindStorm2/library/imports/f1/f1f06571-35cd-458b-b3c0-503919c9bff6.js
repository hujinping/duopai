"use strict";
cc._RF.push(module, 'f1f06VxNc1Fi7PAUDkZyb/2', 'Game');
// Script/UI/game/Game.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 游戏界面
 * 游戏逻辑自己实现
 */
var GameCtr_1 = require("../../Controller/GameCtr");
var WXCtr_1 = require("../../Controller/WXCtr");
var ViewManager_1 = require("../../Common/ViewManager");
var HttpCtr_1 = require("../../Controller/HttpCtr");
var Util_1 = require("../../Common/Util");
var AudioManager_1 = require("../../Common/AudioManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameMap;
(function (GameMap) {
    GameMap[GameMap["LEFT"] = 0] = "LEFT";
    GameMap[GameMap["RIGHT"] = 1] = "RIGHT";
})(GameMap || (GameMap = {}));
var Obstacle;
(function (Obstacle) {
    Obstacle[Obstacle["CAVE"] = 0] = "CAVE";
    Obstacle[Obstacle["CACTI"] = 1] = "CACTI";
})(Obstacle || (Obstacle = {}));
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cave = null;
        _this.cacti = null;
        _this.role_1 = null;
        _this.role_2 = null;
        _this.role_3 = null;
        _this.morePower = null;
        _this.titlePrefab = null;
        _this.revivePrefab = null;
        _this.eatChickenPrefab = null;
        _this.flagPrefab = null;
        _this.gameBg1 = null;
        _this.gameBg2 = null;
        _this.btn_error = null;
        _this.btn_error_clicked = null;
        _this.btn_corrent = null;
        _this.btn_corrent_clicked = null;
        _this.titleNode = null;
        _this.reviveNode = null;
        _this.line = null;
        _this.gameOverNode = null;
        _this.firstTitleTime = 10;
        _this.titleIntervalTime = 10;
        _this.matchingCount = 3;
        _this.lastAnswerTime = -1;
        _this.lastAnserFinishTime = -1;
        _this.obstacleNode = null;
        _this.banAnswer = false;
        _this.isGameOver = false;
        _this.isObstacleComing = false;
        _this.dieLeft = false;
        _this.birthPlaceArr = [];
        _this.rolePlaceArr = [];
        _this.roles = [];
        _this.roleModleArr = [];
        return _this;
    }
    Game.prototype.onLoad = function () {
        GameCtr_1.default.getInstance().setGame(this);
        this.initData();
        this.initNode();
        this.initBtns();
        this.initEvent();
    };
    Game.prototype.initData = function () {
        this.birthPlaceArr.push(cc.p(-600, 600));
        this.birthPlaceArr.push(cc.p(600, 600));
        this.birthPlaceArr.push(cc.p(-600, 0));
        this.birthPlaceArr.push(cc.p(600, 0));
        this.birthPlaceArr.push(cc.p(-600, -600));
        this.birthPlaceArr.push(cc.p(600, -600));
        for (var i = 0; i < GameCtr_1.default.gameRoleCount * 2; i++) {
            var offx = i % 6 >= 3 ? 50 : 0;
            this.rolePlaceArr.push({ pos: cc.p(-400 + (i % 6) * 150 + offx + Math.random() * 50 - 25, -480 + Math.floor(i / 6) * 150), isEmpty: true, index: i });
        }
        this.roleModleArr.push(this.role_1);
        this.roleModleArr.push(this.role_2);
        this.roleModleArr.push(this.role_3);
    };
    Game.prototype.initNode = function () {
        this.gameBg1 = this.node.getChildByName('bg1');
        this.gameBg2 = this.node.getChildByName('bg2');
        this.line = this.node.getChildByName("line");
        this.line.active = false;
        this.initGameOverNode();
    };
    Game.prototype.initBtns = function () {
        this.btn_error = this.node.getChildByName("btn_error");
        this.btn_corrent = this.node.getChildByName("btn_corrent");
        this.btn_error_clicked = this.node.getChildByName("btn_error_clicked");
        this.btn_corrent_clicked = this.node.getChildByName("btn_corrent_clicked");
        this.btn_error.active = false;
        this.btn_corrent.active = false;
        this.btn_error_clicked.active = false;
        this.btn_corrent_clicked.active = false;
        this.initBtn(this.btn_error);
        this.initBtn(this.btn_corrent);
    };
    Game.prototype.initBtn = function (btn) {
        btn.on(cc.Node.EventType.TOUCH_END, function (e) {
            if ((Date.now() - this.lastAnswerTime) / 1000 < 0.6) {
                return;
            }
            if ((Date.now() - this.lastAnserFinishTime) / 1000 < 1.0) {
                return;
            }
            if (this.isObstacleComing) {
                return;
            }
            AudioManager_1.default.getInstance().playSound("audio/btnCick");
            this.doRoleAnswer(0);
            var btnName = e.target.getName();
            if (btnName == "btn_corrent") {
                this.btn_error.active = true;
                this.btn_corrent.active = false;
                this.btn_error_clicked.active = false;
                this.btn_corrent_clicked.active = true;
                this.choiceIcon.x = -280;
            }
            else if (btnName = "btn_error") {
                this.btn_error.active = false;
                this.btn_corrent.active = true;
                this.btn_error_clicked.active = true;
                this.btn_corrent_clicked.active = false;
                this.choiceIcon.x = 280;
            }
            this.choiceIcon.active = true;
            this.choiceIcon.opacity = 0;
            this.choiceIcon.runAction(cc.sequence(cc.fadeIn(0.2), cc.delayTime(0.1), cc.fadeOut(0.2)));
            this.lastAnswerTime = Date.now();
        }.bind(this));
    };
    Game.prototype.initGameOverNode = function () {
        this.gameOverNode = this.node.getChildByName("gameOver");
        var btn_back = this.gameOverNode.getChildByName("frame").getChildByName("btn_back");
        var btn_continue = this.gameOverNode.getChildByName("frame").getChildByName("btn_continue");
        var btn_share = this.gameOverNode.getChildByName("desFrame").getChildByName("btn_share");
        this.gameOverNode.setLocalZOrder(80);
        btn_back.on(cc.Node.EventType.TOUCH_END, function (e) {
            AudioManager_1.default.getInstance().playSound("audio/btnCick");
            cc.director.loadScene("Start");
        });
        btn_share.on(cc.Node.EventType.TOUCH_END, function (e) {
            AudioManager_1.default.getInstance().playSound("audio/btnCick");
            WXCtr_1.default.share(null);
        });
        btn_continue.on(cc.Node.EventType.TOUCH_END, function (e) {
            AudioManager_1.default.getInstance().playSound("audio/btnCick");
            if (GameCtr_1.default.powerValue > 0) {
                GameCtr_1.default.powerValue--;
                this.gameOverNode.active = false;
                this.clearRoles();
                this.start();
                this.gameBg1;
                this.gameBg2;
            }
            else {
                if (!GameCtr_1.default.isAudited) {
                    ViewManager_1.default.toast("没有体力值");
                    return;
                }
                if (this.node.getChildByName("morePower")) {
                    return;
                }
                var morePowerNode = cc.instantiate(this.morePower);
                morePowerNode.parent = this.node;
                morePowerNode.setLocalZOrder(100);
            }
        }.bind(this));
    };
    Game.prototype.initEvent = function () {
        GameCtr_1.default.getInstance().addListener("answerFinish", this.onAnswerFinish.bind(this));
        GameCtr_1.default.getInstance().addListener("shareSuccess", this.onShareSuccess.bind(this));
        GameCtr_1.default.getInstance().addListener("banAnswer", this.onBanAnswer.bind(this));
        GameCtr_1.default.getInstance().addListener("matchCountDown", this.onMatchCountDown.bind(this));
        GameCtr_1.default.getInstance().addListener("showFlag", this.onShowFlag.bind(this));
        GameCtr_1.default.getInstance().addListener("choiceGame", this.onChoiceGame.bind(this));
        GameCtr_1.default.getInstance().addListener("restartGame", this.onRestartGame.bind(this));
    };
    Game.prototype.start = function () {
        this.matchingCount = 3;
        GameCtr_1.default.reviveTimes = 1;
        this.isGameOver = false;
        this.isObstacleComing = false;
        this.lastAnswerTime = Date.now();
        GameCtr_1.default.rankingEntrance = "Start"; //进入游戏后把排行榜的入口信息恢复成默认
        GameCtr_1.default.isMatchingOver = false;
        HttpCtr_1.default.GameStart(null);
        HttpCtr_1.default.getGameStartInfo(this.initMatchingRoles.bind(this));
        this.showMatching();
        this.scheduleOnce(function () {
            this.getTitie();
            AudioManager_1.default.getInstance().playSound("audio/start");
        }.bind(this), this.firstTitleTime);
        this.startBgRoll();
    };
    Game.prototype.startBgRoll = function () {
        this.gameBg1.stopAllActions();
        this.gameBg2.stopAllActions();
        this.gameBg1.y = 0;
        this.gameBg2.y = -GameCtr_1.default.IPONEX_HEIGHT;
        this.gameBg1.runAction(cc.repeatForever(cc.sequence(cc.moveBy(2.5, cc.p(0, GameCtr_1.default.IPONEX_HEIGHT)), cc.callFunc(function () {
            if (this.gameBg1.y >= GameCtr_1.default.IPONEX_HEIGHT - 5) {
                this.gameBg1.y = -GameCtr_1.default.IPONEX_HEIGHT;
            }
            ;
        }.bind(this)))));
        this.gameBg2.runAction(cc.repeatForever(cc.sequence(cc.moveBy(2.5, cc.p(0, GameCtr_1.default.IPONEX_HEIGHT)), cc.callFunc(function () {
            if (this.gameBg2.y >= GameCtr_1.default.IPONEX_HEIGHT - 5) {
                this.gameBg2.y = -GameCtr_1.default.IPONEX_HEIGHT;
            }
            ;
        }.bind(this)))));
        if (this.obstacleNode) {
            this.obstacleNode.destroy();
        }
    };
    Game.prototype.showMatching = function () {
        this.titleNode = cc.instantiate(this.titlePrefab);
        this.titleNode.parent = this.node;
        this.titleNode.getComponent("titleNode").showMatching();
        this.titleNode.setLocalZOrder(40);
    };
    Game.prototype.getTitie = function () {
        if (this.isGameOver) {
            return;
        }
        this.banAnswer = false;
        this.titleNode.active = true;
        this.titleNode.getComponent("titleNode").getTitle();
        this.btn_error.active = true;
        this.btn_corrent.active = true;
        this.line.active = true;
        this.randomOtherRoleAnswer();
        this.switchBtnStateByPos();
        this.scheduleOnce(this.getTitie.bind(this), this.titleIntervalTime);
    };
    Game.prototype.switchBtnStateByPos = function () {
        if (this.roles[0].node.x > 0) { //自己在错误队列
            this.btn_error.active = false;
            this.btn_corrent.active = true;
            this.btn_error_clicked.active = true;
            this.btn_corrent_clicked.active = false;
        }
        else {
            this.btn_error.active = true;
            this.btn_corrent.active = false;
            this.btn_error_clicked.active = false;
            this.btn_corrent_clicked.active = true;
        }
    };
    Game.prototype.initMatchingRoles = function (matchingRoles) {
        var _loop_1 = function (i) {
            this_1.node.runAction(cc.sequence(cc.delayTime(0.2 * i), cc.callFunc(function () {
                var role = null;
                if (i == 0) { //初始化玩家自己
                    var selfInfo = GameCtr_1.default.getInstance().getSelfInfoFromLocal();
                    role = cc.instantiate(this.roleModleArr[GameCtr_1.default.roleTag]);
                    role.parent = this.node;
                    role.getComponent("role").setName(Util_1.default.cutstr(selfInfo.nickName, 4));
                    role.getComponent("role").setHeadImg(selfInfo.avatarUrl);
                }
                else { //其他玩家
                    role = cc.instantiate(this.roleModleArr[Math.floor(Math.random() * 3)]);
                    role.parent = this.node;
                    role.getComponent("role").setName(Util_1.default.cutstr(matchingRoles[i].nick, 4));
                }
                var randomNum = Math.floor(Math.random() * 6);
                role.x = this.birthPlaceArr[randomNum].x;
                role.y = this.birthPlaceArr[randomNum].y;
                role.tag = i;
                role.setLocalZOrder(GameCtr_1.default.gameRoleCount * 2 - i);
                role.runAction(cc.moveTo(0.3, this.rolePlaceArr[i].pos));
                this.rolePlaceArr[i].isEmpty = false;
                this.roles.push({ node: role, die: false });
            }.bind(this_1))));
        };
        var this_1 = this;
        for (var i = 0; i < GameCtr_1.default.gameRoleCount; i++) {
            _loop_1(i);
        }
    };
    Game.prototype.randomOtherRoleAnswer = function () {
        if (this.banAnswer || this.roles.length == 1) {
            return;
        }
        var randomNum = Math.floor(Math.random() * (this.roles.length - 1) + 1);
        randomNum = this.roles.length == 1 ? 0 : randomNum;
        this.doRoleAnswer(randomNum);
        var nextTime = Math.random() * 0.5 + Math.floor(8 / this.roles.length);
        this.scheduleOnce(this.randomOtherRoleAnswer.bind(this), nextTime);
        this.scheduleOnce(this.makeUpRoles.bind(this), nextTime * (1.5));
    };
    Game.prototype.doRoleAnswer = function (roleIndex) {
        var role = this.roles[roleIndex].node;
        this.rolePlaceArr[role.tag].isEmpty = true;
        var posIndex = null;
        if (role.x > 0) { //此机器人判断当前问题是错的
            posIndex = this.getBestEmptyPosIndex(GameMap.LEFT);
        }
        else { //此机器人判断当前问题是对的
            posIndex = this.getBestEmptyPosIndex(GameMap.RIGHT);
        }
        role.stopAllActions();
        console.log("log-----------doRoleAnswer-----------roleIndex  this.rolePlaceArr=:", posIndex, this.rolePlaceArr);
        role.runAction(cc.moveTo(0.5, cc.p(this.rolePlaceArr[posIndex].pos)));
        role.setLocalZOrder(GameCtr_1.default.gameRoleCount * 2 - posIndex);
        role.tag = posIndex;
        this.rolePlaceArr[posIndex].isEmpty = false;
    };
    Game.prototype.getPrePosIndex = function (role) {
        for (var i = 0; i < this.rolePlaceArr.length; i++) {
            if (role.x == this.rolePlaceArr[i].pos.x && role.y == this.rolePlaceArr[i].pos.y) {
                return i;
            }
        }
    };
    Game.prototype.getBestEmptyPosIndex = function (gameMapPos) {
        if (gameMapPos == GameMap.LEFT) {
            for (var i = 0; i < this.rolePlaceArr.length; i++) {
                if (i % 6 >= 3) {
                    continue;
                }
                if (this.rolePlaceArr[i].isEmpty)
                    return i;
            }
        }
        else {
            for (var i = 0; i < this.rolePlaceArr.length; i++) {
                if (i % 6 < 3) {
                    continue;
                }
                if (this.rolePlaceArr[i].isEmpty)
                    return i;
            }
        }
    };
    //当前玩家要到另一队列中，需要找到最后面的机器人来补齐此机器人的位置
    Game.prototype.makeUpRoles = function () {
        if (this.banAnswer) {
            return;
        }
        var randomNum = Math.floor(Math.random() * (this.roles.length - 1) + 1);
        randomNum = this.roles.length == 1 ? 0 : randomNum;
        if (this.roles[randomNum].node.x > 0) {
            for (var i = 0; i < this.rolePlaceArr.length; i++) {
                if (i % 6 < 3) {
                    continue;
                }
                if (randomNum - i < 6) {
                    return;
                }
                ;
                if (this.rolePlaceArr[i].isEmpty) {
                    this.rolePlaceArr[this.roles[randomNum].node.tag].isEmpty = true;
                    this.rolePlaceArr[i].isEmpty = false;
                    this.roles[randomNum].node.tag = i;
                    this.roles[randomNum].node.setLocalZOrder(GameCtr_1.default.gameRoleCount * 2 - i);
                    this.roles[randomNum].node.stopAllActions();
                    this.roles[randomNum].node.runAction(cc.moveTo(0.5, this.rolePlaceArr[i].pos));
                    return;
                }
            }
        }
        else {
            for (var i = 0; i < this.rolePlaceArr.length; i++) {
                if (i % 6 > 3) {
                    continue;
                }
                if (randomNum - i < 6) {
                    return;
                }
                ;
                if (this.rolePlaceArr[i].isEmpty) {
                    this.rolePlaceArr[this.roles[randomNum].node.tag].isEmpty = true;
                    this.rolePlaceArr[i].isEmpty = false;
                    this.roles[randomNum].node.tag = i;
                    this.roles[randomNum].node.setLocalZOrder(GameCtr_1.default.gameRoleCount * 2 - i);
                    this.roles[randomNum].node.stopAllActions();
                    this.roles[randomNum].node.runAction(cc.moveTo(0.5, this.rolePlaceArr[i].pos));
                    return;
                }
            }
        }
    };
    Game.prototype.getBackwardRoleIndex = function (gameMapPos) {
        if (gameMapPos == GameMap.LEFT) {
            for (var i = this.rolePlaceArr.length - 1; i >= 0; i--) {
                if (i % 6 >= 3) {
                    continue;
                }
                if (!this.rolePlaceArr[i].isEmpty)
                    return i;
            }
        }
        else {
            for (var i = this.rolePlaceArr.length - 1; i >= 0; i--) {
                if (i % 6 < 3) {
                    continue;
                }
                if (!this.rolePlaceArr[i].isEmpty)
                    return i;
            }
        }
    };
    Game.prototype.showErrorObstacle = function () {
        this.isObstacleComing = true;
        var randnum = Math.floor(Math.random() * 2);
        var absX = null;
        if (randnum == Obstacle.CAVE) {
            this.obstacleNode = cc.instantiate(this.cave);
            this.obstacleNode.scaleX = 1.0;
            absX = 310;
        }
        else if (randnum == Obstacle.CACTI) {
            this.obstacleNode = cc.instantiate(this.cacti);
            this.obstacleNode.scaleX = 0.79;
            this.obstacleNode.scaleY = 0.79 * 0.79;
            absX = 274;
        }
        if (this.gameBg1.y < 0) {
            this.obstacleNode.parent = this.gameBg1;
        }
        else {
            this.obstacleNode.parent = this.gameBg2;
        }
        if (GameCtr_1.default.questionAnswer == 1) {
            this.obstacleNode.x = absX;
        }
        else {
            this.obstacleNode.x = -absX;
        }
        this.obstacleNode.y = -960;
        this.obstacleNode.scaleY = 1 / 1.269;
        this.obstacleNode.tag = randnum;
    };
    //增加游戏分数
    Game.prototype.addScore = function (num) {
        if (num === void 0) { num = 1; }
        GameCtr_1.default.addScore(num);
    };
    /**
     * 下面两个方法为测试用，自己根据实际需求处理
     */
    Game.prototype.gameOver = function () {
        GameCtr_1.default.gameOver();
    };
    Game.prototype.clickAddScore = function () {
        this.addScore(1);
    };
    Game.prototype.showRevive = function () {
        if (this.node.getChildByName("revive")) {
            return;
        }
        ;
        if (!GameCtr_1.default.isAudited) {
            return;
        }
        this.reviveNode = cc.instantiate(this.revivePrefab);
        this.reviveNode.parent = this.node;
        this.reviveNode.setLocalZOrder(60);
    };
    Game.prototype.matchingCountDown = function () {
        if (this.matchingCount == 0) {
            return;
        }
        ;
        var countNode = this.node.getChildByName("countDown_" + this.matchingCount);
        countNode.active = true;
        countNode.setLocalZOrder(90);
        countNode.scale = 1.8;
        countNode.runAction(cc.sequence(cc.scaleTo(0.5, 1.0), cc.delayTime(0.5), cc.callFunc(function () {
            countNode.active = false;
        })));
        this.matchingCount--;
        AudioManager_1.default.getInstance().playSound("audio/countDown");
        this.scheduleOnce(this.matchingCountDown.bind(this), 1);
    };
    Game.prototype.clearRoles = function () {
        for (var i = 0; i < this.roles.length; i++) {
            this.roles[i].node.destroy();
        }
        this.roles.splice(0, this.roles.length);
    };
    /*------------------------------event-------------------------*/
    Game.prototype.onAnswerFinish = function () {
        this.lastAnserFinishTime = Date.now();
        this.node.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function () {
            this.obstacleNode.destroy();
            this.obstacleNode = null;
        }.bind(this))));
    };
    Game.prototype.onBanAnswer = function () {
        this.banAnswer = true;
        this.showErrorObstacle();
        this.hideGameBtns();
    };
    Game.prototype.onShowFlag = function () {
        while (this.node.getChildByTag(5555)) {
            this.node.removeChildByTag(5555);
        }
        var flag = cc.instantiate(this.flagPrefab);
        flag.setLocalZOrder(80);
        flag.parent = this.node;
        flag.tag = 5555;
    };
    Game.prototype.onMatchCountDown = function () {
        this.matchingCountDown();
    };
    Game.prototype.onShareSuccess = function () {
        this.reviveNode.destroy();
        this.reviveNode = null;
        this.revive();
        AudioManager_1.default.getInstance().playMusic("audio/gameMusic");
        //console.log("log---------------音乐开关=：", AudioManager.getInstance().musicOn);
    };
    Game.prototype.onChoiceGame = function () {
        var desFrame = this.gameOverNode.getChildByName("desFrame");
        desFrame.active = !GameCtr_1.default.isAudited ? false : true;
        var lb_question = this.gameOverNode.getChildByName("desFrame").getChildByName("lb_question");
        var lb_answer = this.gameOverNode.getChildByName("desFrame").getChildByName("lb_answer");
        lb_question.getComponent(cc.Label).string = GameCtr_1.default.questionDes;
        lb_answer.getComponent(cc.Label).string = GameCtr_1.default.questionAnswer == 1 ? "正确" : "错误";
        this.node.runAction(cc.sequence(cc.delayTime(0.3), cc.callFunc(function () {
            this.gameOverNode.active = true;
        }.bind(this))));
    };
    Game.prototype.onRestartGame = function () {
        this.clearRoles();
        this.start();
    };
    //----------------------------------------------------------------------------------//
    Game.prototype.showEatChicken = function () {
        var eatChickenNode = cc.instantiate(this.eatChickenPrefab);
        eatChickenNode.parent = this.node;
        eatChickenNode.setLocalZOrder(60);
    };
    Game.prototype.collateRolesData = function () {
        var rolesTemp = [];
        for (var i = 0; i < this.roles.length; i++) {
            if (!this.roles[i].die) {
                rolesTemp.push(this.roles[i]);
            }
        }
        this.roles.splice(0, this.roles.length);
        for (var i = 0; i < rolesTemp.length; i++) {
            this.roles.push(rolesTemp[i]);
        }
    };
    Game.prototype.checkEatChicken = function () {
        if (this.roles.length == 1 && !this.isGameOver) { //吃鸡成功
            this.unscheduleAllCallbacks();
            this.titleNode.getComponent("titleNode").unscheduleAllCallbacks();
            HttpCtr_1.default.getGameWin(null);
            this.showEatChicken();
        }
    };
    Game.prototype.doAbstacle = function () {
        var offx = GameCtr_1.default.questionAnswer == 2 ? 1 : -1;
        for (var i = 0; i < this.roles.length; i++) {
            if (offx * this.roles[i].node.x > 0) {
            }
            else {
                if (i == 0) {
                    this.isGameOver = true;
                    this.dieLeft = this.roles[0].node.x > 0 ? false : true;
                    this.roles[i].node.getComponent("role").die(this.obstacleNode.tag, false);
                    this.rolePlaceArr[this.roles[i].node.tag].isEmpty = true;
                    this.unscheduleAllCallbacks();
                }
                else {
                    this.roles[i].die = true;
                    this.rolePlaceArr[this.roles[i].node.tag].isEmpty = true;
                    this.roles[i].node.getComponent("role").die(this.obstacleNode.tag);
                }
            }
        }
        this.collateRolesData();
        this.chickRivive();
        this.setMoney();
        this.checkEatChicken();
    };
    Game.prototype.setMoney = function () {
        if (!this.isGameOver) {
            GameCtr_1.default.money += 10;
            HttpCtr_1.default.setMoney(GameCtr_1.default.money);
        }
    };
    Game.prototype.chickRivive = function () {
        if (!this.isGameOver) {
            return;
        }
        console.log("log------------------GameCtr.totalReviveTimes  GameCtr.reviveData.revive_number=:", GameCtr_1.default.totalReviveTimes, GameCtr_1.default.reviveData.revive_number);
        if (GameCtr_1.default.reviveTimes > 0 && this.roles.length > 1 && GameCtr_1.default.isAudited && GameCtr_1.default.totalReviveTimes <= GameCtr_1.default.reviveData.revive_number) {
            this.scheduleOnce(this.showRevive.bind(this), 1.0);
        }
        else {
            this.onChoiceGame();
        }
    };
    Game.prototype.hideGameBtns = function () {
        this.btn_error.active = false;
        this.btn_corrent.active = false;
        this.btn_error_clicked.active = false;
        this.btn_corrent_clicked.active = false;
        this.line.active = false;
    };
    Game.prototype.revive = function () {
        this.isGameOver = false;
        this.roles[0].node.active = true;
        var posIndex = null;
        console.log("log--------------revive-----this.dieLeft=:", this.dieLeft);
        if (!this.dieLeft) {
            posIndex = this.getBestEmptyPosIndex(GameMap.RIGHT);
        }
        else {
            posIndex = this.getBestEmptyPosIndex(GameMap.LEFT);
        }
        console.log("log--------------revive-----this.dieLeft posIndex=:", this.dieLeft, posIndex);
        this.roles[0].node.setLocalZOrder(GameCtr_1.default.gameRoleCount * 2 - posIndex);
        this.roles[0].node.tag = posIndex;
        this.roles[0].node.x = this.rolePlaceArr[posIndex].pos.x;
        this.roles[0].node.y = this.rolePlaceArr[posIndex].pos.y;
        this.rolePlaceArr[posIndex].isEmpty = false;
        GameCtr_1.default.reviveTimes--;
        GameCtr_1.default.totalReviveTimes++;
        this.unscheduleAllCallbacks();
        this.titleNode.getComponent("titleNode").unscheduleAllCallbacks();
        this.getTitie();
        this.startBgRoll();
    };
    Game.prototype.update = function (dt) {
        if (this.obstacleNode && this.isObstacleComing) {
            if (this.obstacleNode.parent.y > 200) {
                this.doAbstacle();
                this.isObstacleComing = false;
            }
        }
    };
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "cave", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "cacti", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "role_1", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "role_2", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "role_3", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "morePower", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "titlePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "revivePrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "eatChickenPrefab", void 0);
    __decorate([
        property(cc.Prefab)
    ], Game.prototype, "flagPrefab", void 0);
    __decorate([
        property(cc.Node)
    ], Game.prototype, "choiceIcon", void 0);
    Game = __decorate([
        ccclass
    ], Game);
    return Game;
}(cc.Component));
exports.default = Game;

cc._RF.pop();