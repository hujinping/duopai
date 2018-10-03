"use strict";
cc._RF.push(module, '4d95fg2LhFK4rd0bQKU3a0m', 'GameData');
// Script/Common/GameData.ts

Object.defineProperty(exports, "__esModule", { value: true });
var GameCtr_1 = require("../Controller/GameCtr");
var WXCtr_1 = require("../Controller/WXCtr");
//import Guide from "../view/game/Guide";
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameData = /** @class */ (function () {
    function GameData() {
    }
    GameData_1 = GameData;
    GameData.init = function () {
        //每隔1分钟提交一次个人数据
        setInterval(function () {
            GameData_1.submitGameData();
            // GameCtr.dianmondNotice((resp) => {
            //     if (resp.moeny) {
            //         GameData.diamonds += resp.moeny;
            //         GameCtr.ins.mGame.setDiamonds();
            //     }
            // });
            // //必须频繁保存lastTime，才能保证用户不是掐进程退出游戏，无法保存lastTime的情况
            var time = new Date().getTime();
            WXCtr_1.default.setStorageData("lastTime", time);
        }, 60000);
        //初始化 GameData.localData
        for (var i = 1; i <= GameData_1.maxPlane; i++) {
            var key = "feiji_shop_" + i;
            GameData_1.localData.planeData[key] = 0;
        }
    };
    //---------------------------从网络获取数据------------------------------------
    GameData.getNetData = function () {
        // GameCtr.getUserInfo((data) => {
        //     if(!data){//获取网络数据失败
        //         GameCtr.startGame();
        //         return;
        //     }
        //     console.log("getUserInfoByNet 只要进到这个回调函数，则表明最终收到了正确的网络数据，则需与本地数据比对，极有可能刷新所有游戏数据",)
        //     console.log("getUserInfoByNet data",data)
        //     console.log("getUserInfoByNet data",data.level)
        //     console.log("getUserInfoByNet data",data.money)
        //     let netData = {
        //         _guideStep:GameData.localData._guideStep,
        //         experience:data.exp,
        //         gold:data.gold,
        //         level:data.level,
        //         diamonds:data.money,
        //         maxPlaneLevel:data.maxfeiji,
        //         planeData:{},
        //         storageTime:data.data_3,//上次上传的时间
        //     };
        //     for (let i = 1; i <= GameData.maxPlane; i++) {
        //         let key = "feiji_shop_" + i;
        //         netData.planeData[key] = data[key];
        //     }
        //     for(let i = 1; i <= GameData.maxApron; i++) {
        //         let key1 = "feiji_" + i;
        //         let key2 = "feiji_switch_" + i;
        //         netData.planeData[key1] = data[key1] == "NaN" ? 0 : data[key1];
        //         netData.planeData[key2] = (data[key2] == "true");
        //     }
        //     GameData.valueData_1(netData);
        // });
    };
    GameData.valueData_1 = function (netData) {
        console.log("//初始化各种变量1", GameData_1.localData);
        GameData_1.localData = netData;
        GameData_1._guideStep = GameData_1.localData._guideStep;
        GameData_1.experience = GameData_1.localData.experience;
        GameData_1.gold = GameData_1.localData.gold;
        GameData_1.level = GameData_1.localData.level;
        GameData_1.diamonds = GameData_1.localData.diamonds;
        GameData_1.maxPlaneLevel = GameData_1.localData.maxPlaneLevel;
        for (var key in GameData_1.localData.planeData) {
            GameData_1.planeData[key] = GameData_1.localData.planeData[key];
        }
        // Guide.localStorageGuideStep(8);
        // Guide.guideStep = 8;
        GameCtr_1.default.startGame();
    };
    //---------------------------从本地获取数据------------------------------------
    GameData.getLocalData = function () {
        // GameData.setUserData({ gold: GameData._gold },true);//测试专用
        // cc.sys.localStorage.removeItem("localData"); //测试专用
        // cc.sys.localStorage.removeItem("guideStep"); //测试专用
        // return;  //测试专用
        //改用cocos来获取本地数据，如果获取成功，则跳过所有的微信获取过程
        var localData = cc.sys.localStorage.getItem("localData");
        console.log("cc.sys.localStorage GameData.localData=", localData);
        if (localData) {
            GameData_1.localData = localData;
            GameData_1.valueData_0();
            //GameData.storageTime = GameData.localData.storageTime;
        }
        else {
            console.log("微信获取本地数据");
            WXCtr_1.default.getStorageData("guideStep", function (resp) {
                console.log("resp guideStep == ", resp);
                if (resp) {
                    GameData_1._guideStep = resp;
                    //只会执行一次（将数据从微信存储改到cocos存储）
                    GameData_1.localData._guideStep = resp;
                    cc.sys.localStorage.setItem("localData", GameData_1.localData);
                }
                else
                    GameData_1.getNetData(); //（从本地）以cc和wx都没有获取到本地数据，则向网络请求数据------------------------------------------------------------------
            });
            WXCtr_1.default.getStorageData("exp", function (data) {
                if (data) {
                    GameData_1.experience = data;
                    //只会执行一次（将数据从微信存储改到cocos存储）
                    GameData_1.localData.experience = data;
                    cc.sys.localStorage.setItem("localData", GameData_1.localData);
                }
            });
            WXCtr_1.default.getStorageData("gold", function (data) {
                console.log("resp gold == ", data);
                if (data) {
                    GameData_1.gold = data;
                    //只会执行一次（将数据从微信存储改到cocos存储）
                    GameData_1.localData.gold = data;
                    cc.sys.localStorage.setItem("localData", GameData_1.localData);
                }
            });
            WXCtr_1.default.getStorageData("level", function (data) {
                if (data) {
                    GameData_1.level = data;
                    //只会执行一次（将数据从微信存储改到cocos存储）
                    GameData_1.localData.level = data;
                    cc.sys.localStorage.setItem("localData", GameData_1.localData);
                }
            });
            WXCtr_1.default.getStorageData("diamonds", function (data) {
                if (data) {
                    GameData_1.diamonds = data;
                    //只会执行一次（将数据从微信存储改到cocos存储）
                    GameData_1.localData.diamonds = data;
                    cc.sys.localStorage.setItem("localData", GameData_1.localData);
                }
            });
            WXCtr_1.default.getStorageData("maxPlaneLevel", function (data) {
                if (data) {
                    GameData_1.maxPlaneLevel = data;
                    //只会执行一次（将数据从微信存储改到cocos存储）
                    GameData_1.localData.maxPlaneLevel = data;
                    cc.sys.localStorage.setItem("localData", GameData_1.localData);
                }
            });
            var _loop_1 = function (i) {
                var key = "feiji_shop_" + i;
                WXCtr_1.default.getStorageData(key, function (data) {
                    if (data) {
                        GameData_1.planeData[key] = data;
                        //只会执行一次（将数据从微信存储改到cocos存储）
                        GameData_1.localData.planeData[key] = GameData_1.planeData[key];
                        cc.sys.localStorage.setItem("localData", GameData_1.localData);
                    }
                });
            };
            //GameData.localData.planeData={};
            for (var i = 1; i <= GameData_1.maxPlane; i++) {
                _loop_1(i);
            }
            var _loop_2 = function (i) {
                var key1 = "feiji_" + i;
                var key2 = "feiji_switch_" + i;
                WXCtr_1.default.getStorageData(key1, function (data) {
                    if (data) {
                        GameData_1.planeData[key1] = data;
                        console.log("", key1, "=", data);
                        //只会执行一次（将数据从微信存储改到cocos存储）
                        GameData_1.localData.planeData[key1] = GameData_1.planeData[key1];
                        cc.sys.localStorage.setItem("localData", GameData_1.localData);
                    }
                });
                WXCtr_1.default.getStorageData(key2, function (data) {
                    if (data) {
                        GameData_1.planeData[key2] = data;
                        //只会执行一次（将数据从微信存储改到cocos存储）
                        GameData_1.localData.planeData[key2] = GameData_1.planeData[key2];
                        cc.sys.localStorage.setItem("localData", GameData_1.localData);
                        if (i == GameData_1.maxApron)
                            GameCtr_1.default.startGame(); //获取到本地数据之后，则数据获取完毕，直接使用---------------------------------------------------------
                    }
                });
            };
            for (var i = 1; i <= GameData_1.maxApron; i++) {
                _loop_2(i);
            }
        }
    };
    GameData.valueData_0 = function () {
        console.log("//获取到本地数据之后，则数据获取完毕，直接使用", GameData_1.localData);
        GameData_1._guideStep = GameData_1.localData._guideStep;
        GameData_1._experience = GameData_1.localData.experience;
        GameData_1._gold = GameData_1.localData.gold;
        GameData_1._level = GameData_1.localData.level;
        GameData_1._diamond = GameData_1.localData.diamonds;
        GameData_1._maxPlaneLevel = GameData_1.localData.maxPlaneLevel;
        for (var key in GameData_1.localData.planeData) {
            GameData_1.planeData[key] = GameData_1.localData.planeData[key];
        }
        GameCtr_1.default.startGame(); //获取到本地数据之后，则数据获取完毕，直接使用---------------------------------------------------------------------------
    };
    //保存个人信息
    GameData.setUserData = function (data, upload) {
        if (upload === void 0) { upload = null; }
        for (var key in data) {
            //WXCtr.setStorageData(key, data[key]);
            if (upload)
                GameData_1.localData.planeData[key] = data[key];
            else
                GameData_1.localData[key] = data[key];
            GameData_1.localData.storageTime = new Date().getTime();
            //console.log("保存个人信息到本地",GameData.localData)
            cc.sys.localStorage.setItem("localData", GameData_1.localData);
        }
        if (upload) {
            //本地数据结构同网络数据结构有点差异，重组后上传
            var localData = { data_3: new Date().getTime(), maxfeiji: 0, money: 0 };
            for (var key in GameData_1.localData) {
                if (typeof (GameData_1.localData[key]) == "object") {
                    var object = GameData_1.localData[key];
                    for (var k in object) {
                        localData[k] = object[k];
                    }
                }
                else {
                    localData[key] = GameData_1.localData[key];
                    if (key == "maxPlaneLevel") {
                        console.log("if(key ==maxPlaneLevel)", GameData_1.localData);
                        localData.maxfeiji = GameData_1.localData[key];
                    }
                    else if (key == "diamonds") {
                        localData.money = GameData_1.localData.diamonds;
                    }
                }
            }
            console.log("上传数据", GameData_1.localData);
            GameData_1.submitGameData(localData);
        }
    };
    //获取下一级所需要的经验值
    GameData.getNextExperience = function () {
        var nextLevel = GameData_1.level + 1;
        var nextEx = Math.floor(Math.pow(2, nextLevel) * 0.75 + 5);
        return nextEx;
    };
    //增加经验值
    GameData.addExperience = function (planeLevel) {
        var addEx = Math.floor(Math.pow(2, planeLevel) * (1.0 / planeLevel));
        GameData_1.experience += addEx;
    };
    Object.defineProperty(GameData, "experience", {
        //获取经验值
        get: function () {
            return GameData_1._experience;
        },
        //设置经验值
        set: function (experience) {
            console.log("//设置经验值");
            GameData_1._experience = experience;
            //GameCtr.ins.mGame.setPgbLevel()//渲染刷新        
            GameData_1.setUserData({ exp: GameData_1._experience });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameData, "guideStep", {
        //获取新手引导步骤
        get: function () {
            return GameData_1._guideStep;
        },
        set: function (guideStep) {
            GameData_1._guideStep;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameData, "level", {
        //获取等级
        get: function () {
            return GameData_1._level;
        },
        //设置等级
        set: function (level) {
            console.log("//设置等级", level);
            GameData_1._level = level;
            //GameCtr.ins.mGame.setLevel()//渲染刷新        
            GameData_1.setUserData({ level: GameData_1._level });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameData, "profit", {
        get: function () {
            return GameData_1._profit;
        },
        set: function (profit) {
            console.log("//设置收益");
            GameData_1._profit = profit;
            //GameCtr.ins.mGame.setProfit()//渲染刷新 
            GameData_1.setUserData({ profit: GameData_1._profit });
        },
        enumerable: true,
        configurable: true
    });
    //增加飞机的每秒收益
    GameData.addProfitOfPlane = function (planeLevel) {
        var profit = GameData_1.getProfitOfPlane(planeLevel);
        GameData_1.profit += profit;
    };
    //减少飞机每秒收益
    GameData.reduceProfitOfPlane = function (planeLevel) {
        var profit = GameData_1.getProfitOfPlane(planeLevel);
        GameData_1.profit -= profit;
        if (GameData_1.profit <= 0) {
            GameData_1.profit = 0;
        }
    };
    //获取飞机的每秒收益
    GameData.getProfitOfPlane = function (planeLevel) {
        var speed = GameData_1.getSpeedOfPlane(planeLevel);
        var profit = Math.floor(25 * Math.pow(2, (planeLevel - 1) * 0.9) / speed);
        return profit;
    };
    //获取飞机的基础收益
    GameData.getBaseProfitOfPlane = function (level) {
        var profit = Math.floor(25 * Math.pow(2, (level - 1) * 0.9));
        return profit;
    };
    Object.defineProperty(GameData, "gold", {
        //获取金币数量
        get: function () {
            return GameData_1._gold;
        },
        //设置金币数量
        set: function (gold) {
            //console.log("//设置金币数量",gold)
            if (gold < 0) {
                gold = 0;
            }
            GameData_1._gold = gold;
            //GameCtr.ins.mGame.setGold()//渲染刷新
            GameData_1.setUserData({ gold: GameData_1._gold });
        },
        enumerable: true,
        configurable: true
    });
    //提交分数到微信
    GameData.submitScore = function () {
        var gold_ss = GameData_1._gold;
        //WXCtr.submitScoreToWx(gold_ss);
    };
    GameData.submitGameData = function (data) {
        if (data === void 0) { data = null; }
        if (!data) {
            data = {
                gold: GameData_1._gold,
                profit: GameData_1._profit,
                money: GameData_1._diamond,
                level: GameData_1._level,
                exp: GameData_1._experience
            };
        }
        //GameCtr.submitUserData(data);
    };
    //增加金币
    GameData.addGold = function (planeLevel) {
        // let addGold = Math.floor(25 * Math.pow(2, (planeLevel - 1) * 0.9));
        // if(GameCtr.ufoProfitBuff){
        //     addGold *= 5;
        // }
        // GameData.gold += addGold;
    };
    //增加金币固定值
    GameData.addGoldChangeless = function (addGold) {
        GameData_1.gold += addGold;
    };
    //增加钻石固定值
    GameData.addDiamondsChangeless = function (addDiamonds) {
        GameData_1.diamonds += addDiamonds;
    };
    GameData.reduceGold = function (num) {
        GameData_1.gold -= num;
    };
    Object.defineProperty(GameData, "diamonds", {
        //获取钻石数量
        get: function () {
            return GameData_1._diamond;
        },
        //设置钻石数量
        set: function (diamonds) {
            console.log("//设置钻石数量", diamonds);
            if (diamonds < 0) {
                diamonds = 0;
            }
            GameData_1._diamond = diamonds;
            //GameCtr.ins.mGame.setDiamonds()//渲染刷新 
            GameData_1.setUserData({ diamonds: GameData_1._diamond });
        },
        enumerable: true,
        configurable: true
    });
    //改变钻石数量
    GameData.changeDiamonds = function (num, callback) {
        if (callback === void 0) { callback = null; }
        var diamonds;
        // GameCtr.getUserInfo((data) => {
        //     console.log("data.money == ", data.money);
        //     diamonds = data.money;
        //     GameData.diamonds = diamonds + num;
        //     if (callback) {
        //         callback();
        //     }
        // });
    };
    Object.defineProperty(GameData, "maxPlaneLevel", {
        //获取自己拥有的最高飞机等级
        get: function () {
            return GameData_1._maxPlaneLevel;
        },
        //设置自己拥有的最高飞机等级
        set: function (level) {
            console.log("//设置自己拥有的最高飞机等级");
            GameData_1._maxPlaneLevel = level;
            GameData_1.setUserData({ maxPlaneLevel: GameData_1._maxPlaneLevel });
        },
        enumerable: true,
        configurable: true
    });
    //获取飞机价格
    GameData.getPriceOfPlane = function (level, times) {
        var price;
        if (level == 1) {
            price = Math.floor(100 * Math.pow(1.25, times));
        }
        else {
            var profit = GameData_1.getProfitOfPlane(level - 1);
            price = Math.floor(Math.floor((profit * 360 * (Math.pow(1.5, (level - 1)))) / 10) * 10 * Math.pow(1.25, times));
        }
        return price;
    };
    //获取飞机速度
    GameData.getSpeedOfPlane = function (level) {
        var speed = 5 * (1 - Math.pow(0.001, (1 / level)));
        return speed;
    };
    //设置飞机的购买次数
    GameData.setBuyTimesOfPlane = function (level, times) {
        console.log("//设置飞机的购买次数");
        var key = "feiji_shop_" + level;
        if (GameData_1.planeData) {
            GameData_1.planeData[key] = times;
        }
        var data = {};
        data[key] = times;
        GameData_1.setUserData(data, true);
    };
    //获取飞机的购买次数
    GameData.getBuyTimesOfPlane = function (level) {
        var times = 0;
        var key = "feiji_shop_" + level;
        if (GameData_1.planeData && GameData_1.planeData[key]) {
            times = GameData_1.planeData[key];
        }
        return times;
    };
    //设置停机坪状态
    GameData.setApronState = function (idx, level /* -1代表该停机坪未解锁， 0代表该停机坪上没有飞机， 大于0代表停机坪上飞机等级 */) {
        var key = "feiji_" + idx;
        if (GameData_1.planeData) {
            GameData_1.planeData[key] = level;
        }
        var data = {};
        data[key] = level;
        console.log("设置停机坪状态");
        GameData_1.setUserData(data, true);
    };
    GameData.getApronState = function (idx) {
        console.log("//获取停机坪状态");
        var level = 0;
        var key = "feiji_" + idx;
        for (var key1 in GameData_1.planeData) {
            if (key == key1) {
                level = GameData_1.planeData[key1];
            }
        }
        if (GameData_1.planeData && GameData_1.planeData[key] && GameData_1.planeData[key] != 0) {
            level = GameData_1.planeData[key];
        }
        return level;
    };
    // 设置停机坪飞机状态（是否在跑道）
    GameData.setPlaneStateOfApron = function (idx, state) {
        if (state === void 0) { state = false; }
        console.log("设置停机坪飞机状态（是否在跑道）");
        var key = "feiji_switch_" + idx;
        if (GameData_1.planeData) {
            GameData_1.planeData[key] = state;
        }
        var data = {};
        data[key] = state;
        GameData_1.setUserData(data, true);
    };
    //获取停机坪飞机状态
    GameData.getPlaneStateOfApron = function (idx) {
        console.log("//获取停机坪飞机状态");
        var state = false;
        var key = "feiji_switch_" + idx;
        if (GameData_1.planeData && GameData_1.planeData[key]) {
            state = GameData_1.planeData[key];
        }
        return state;
    };
    GameData._name = 0; //昵称（从微信获取）
    GameData._ID = 0; //ID（从我们服务器获取）
    GameData._experience = 0; //经验值
    GameData._gold = 10000; //金币数量
    GameData._profit = 0; //每秒收益
    GameData._level = 0; //个人等级
    GameData._diamond = 0; //钻石数量
    GameData._maxPlaneLevel = 1; //个人拥有的飞机最高等级   
    GameData._guideStep = 0; //新手引导步骤
    GameData.offLineProfit = 0;
    GameData.pfTurntable = 1; //剩余转盘次数
    GameData.planeData = {};
    GameData.maxPlane = 30;
    GameData.maxApron = 12;
    GameData.localData = {
        _guideStep: 0,
        experience: 0,
        gold: 10000,
        level: 0,
        diamonds: 0,
        maxPlaneLevel: 1,
        planeData: {},
        storageTime: 0,
    };
    GameData = GameData_1 = __decorate([
        ccclass
    ], GameData);
    return GameData;
    var GameData_1;
}());
exports.default = GameData;

cc._RF.pop();