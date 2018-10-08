import GameCtr from "../Controller/GameCtr";
import WXCtr from "../Controller/WXCtr";
//import Guide from "../view/game/Guide";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameData {

    private static _name: number = 0;                             //昵称（从微信获取）
    private static _ID: number = 0;                             //ID（从我们服务器获取）

    private static _experience: number = 0;                             //经验值
    private static _gold: number = 10000;                               //金币数量
    private static _profit: number = 0;                                 //每秒收益
    private static _level: number = 0;                                  //个人等级
    private static _diamond: number = 0;                                //钻石数量
    private static _maxPlaneLevel: number = 1;                          //个人拥有的飞机最高等级   
    private static _guideStep: number = 0;                             //新手引导步骤

    public static offLineProfit: number = 0;
    public static pfTurntable: number = 1;                             //剩余转盘次数

    public static planeData = {};
    private static maxPlane = 30;
    private static maxApron = 12;
    private static ins:GameData;

    private static localData = {
        _guideStep:0,
        experience:0,
        gold:10000,
        level:0,
        diamonds:0,
        maxPlaneLevel:1,
        planeData:{},
        storageTime:0,
    };

    static init(){
        //每隔1分钟提交一次个人数据
        setInterval(() => {
            GameData.submitGameData();
            // GameCtr.dianmondNotice((resp) => {
            //     if (resp.moeny) {
            //         GameData.diamonds += resp.moeny;
            //         GameCtr.ins.mGame.setDiamonds();
            //     }
            // });
            // //必须频繁保存lastTime，才能保证用户不是掐进程退出游戏，无法保存lastTime的情况
            let time = new Date().getTime();
            WXCtr.setStorageData("lastTime", time);
        }, 60000);


        //初始化 GameData.localData
        for (let i = 1; i <= GameData.maxPlane; i++) {
            let key = "feiji_shop_" + i;
            GameData.localData.planeData[key] = 0;
        }

    }

    
    static valueData_1(netData){
        console.log("//初始化各种变量1",GameData.localData)
        GameData.localData = netData;
        
        GameData._guideStep = GameData.localData._guideStep;
        GameData.experience = GameData.localData.experience;
        GameData.gold = GameData.localData.gold;
        GameData.level = GameData.localData.level;
        GameData.diamonds = GameData.localData.diamonds;
        GameData.maxPlaneLevel = GameData.localData.maxPlaneLevel;

        for(let key in GameData.localData.planeData){
            GameData.planeData[key] = GameData.localData.planeData[key];
        }

        // Guide.localStorageGuideStep(8);
        // Guide.guideStep = 8;
        GameCtr.startGame();
    }

    //---------------------------从本地获取数据------------------------------------
    static getLocalData(){
        // GameData.setUserData({ gold: GameData._gold },true);//测试专用
        // cc.sys.localStorage.removeItem("localData"); //测试专用
        // cc.sys.localStorage.removeItem("guideStep"); //测试专用
        // return;  //测试专用
        
        //改用cocos来获取本地数据，如果获取成功，则跳过所有的微信获取过程
        let localData = cc.sys.localStorage.getItem("localData");
        console.log("cc.sys.localStorage GameData.localData=",localData)

        if(localData){
            GameData.localData = localData;
            GameData.valueData_0();
            //GameData.storageTime = GameData.localData.storageTime;
        }else{
            console.log("微信获取本地数据")
            WXCtr.getStorageData("guideStep", (resp)=>{
                console.log("resp guideStep == ", resp);
                if(resp){
                    GameData._guideStep = resp;
                    //只会执行一次（将数据从微信存储改到cocos存储）
                    GameData.localData._guideStep = resp;
                    cc.sys.localStorage.setItem("localData",GameData.localData);
                }else GameData.getNetData();//（从本地）以cc和wx都没有获取到本地数据，则向网络请求数据------------------------------------------------------------------
            });
    
            WXCtr.getStorageData("exp", (data) => {
                if (data) {
                    GameData.experience = data;
                    //只会执行一次（将数据从微信存储改到cocos存储）
                    GameData.localData.experience = data;
                    cc.sys.localStorage.setItem("localData",GameData.localData);
                }
            });
            WXCtr.getStorageData("gold", (data) => {
                console.log("resp gold == ", data);
                if (data) {
                    GameData.gold = data;
                    //只会执行一次（将数据从微信存储改到cocos存储）
                    GameData.localData.gold = data;
                    cc.sys.localStorage.setItem("localData",GameData.localData);
                }
            });
    
            WXCtr.getStorageData("level", (data) => {
                if (data) {
                    GameData.level = data;
                    //只会执行一次（将数据从微信存储改到cocos存储）
                    GameData.localData.level = data;
                    cc.sys.localStorage.setItem("localData",GameData.localData);
                }
            });
            WXCtr.getStorageData("diamonds", (data) => {
                if (data) {
                    GameData.diamonds = data;
                    //只会执行一次（将数据从微信存储改到cocos存储）
                    GameData.localData.diamonds = data;
                    cc.sys.localStorage.setItem("localData",GameData.localData);
                }
            });
            WXCtr.getStorageData("maxPlaneLevel", (data) => {
                if (data) {
                    GameData.maxPlaneLevel = data;
                    //只会执行一次（将数据从微信存储改到cocos存储）
                    GameData.localData.maxPlaneLevel = data;
                    cc.sys.localStorage.setItem("localData",GameData.localData);
                }
            });
    
            //GameData.localData.planeData={};
            for (let i = 1; i <= GameData.maxPlane; i++) {
                let key = "feiji_shop_" + i;
                WXCtr.getStorageData(key, (data) => {
                    if (data) {
                        GameData.planeData[key] = data;
                        //只会执行一次（将数据从微信存储改到cocos存储）
                        GameData.localData.planeData[key] = GameData.planeData[key];
                        cc.sys.localStorage.setItem("localData",GameData.localData);
                    }
                });
            }
    
            for(let i = 1; i <= GameData.maxApron; i++) {
                let key1 = "feiji_" + i;
                let key2 = "feiji_switch_" + i;
                WXCtr.getStorageData(key1, (data) => {
                    if (data) {
                        GameData.planeData[key1] = data;
                        console.log("",key1,"=",data);
                        //只会执行一次（将数据从微信存储改到cocos存储）
                        GameData.localData.planeData[key1] = GameData.planeData[key1];
                        cc.sys.localStorage.setItem("localData",GameData.localData);
                    }
                });
                WXCtr.getStorageData(key2, (data) => {
                    if (data) {
                        GameData.planeData[key2] = data;
                        //只会执行一次（将数据从微信存储改到cocos存储）
                        GameData.localData.planeData[key2] = GameData.planeData[key2];
                        cc.sys.localStorage.setItem("localData",GameData.localData);
                        if(i== GameData.maxApron) GameCtr.startGame();//获取到本地数据之后，则数据获取完毕，直接使用---------------------------------------------------------
                    }
                });
            }
        }
    }

    static valueData_0(){
        console.log("//获取到本地数据之后，则数据获取完毕，直接使用",GameData.localData)
        
        GameData._guideStep = GameData.localData._guideStep;
        GameData._experience = GameData.localData.experience;
        GameData._gold = GameData.localData.gold;
        GameData._level = GameData.localData.level;
        GameData._diamond = GameData.localData.diamonds;
        GameData._maxPlaneLevel = GameData.localData.maxPlaneLevel;

        for(let key in GameData.localData.planeData){
            GameData.planeData[key] = GameData.localData.planeData[key];
        }

        GameCtr.startGame();//获取到本地数据之后，则数据获取完毕，直接使用---------------------------------------------------------------------------
    }

    //保存个人信息
    static setUserData(data,upload=null) {
        for (let key in data) {
            //WXCtr.setStorageData(key, data[key]);
            if(upload) GameData.localData.planeData[key] = data[key];
            else GameData.localData[key] = data[key];
            GameData.localData.storageTime= new Date().getTime();
            //console.log("保存个人信息到本地",GameData.localData)
            cc.sys.localStorage.setItem("localData",GameData.localData);
        }
        if(upload){
            //本地数据结构同网络数据结构有点差异，重组后上传
            let localData = {data_3: new Date().getTime(),maxfeiji:0,money:0};
            for(let key in GameData.localData){
                if(typeof(GameData.localData[key]) == "object") {
                    let object = GameData.localData[key];
                    for(let k in object){
                        localData[k] = object[k];
                    }
                }else{
                    localData[key] = GameData.localData[key];
                    if(key =="maxPlaneLevel"){
                        console.log("if(key ==maxPlaneLevel)",GameData.localData)
                        localData.maxfeiji = GameData.localData[key];
                    }else if(key =="diamonds"){
                        localData.money = GameData.localData.diamonds;
                    }
                }
            }
            console.log("上传数据",GameData.localData)

            GameData.submitGameData(localData);
        }
            
    }

    //获取下一级所需要的经验值
    static getNextExperience() {
        let nextLevel = GameData.level + 1;
        let nextEx = Math.floor(Math.pow(2, nextLevel) * 0.75 + 5);
        return nextEx;
    }

    //增加经验值
    static addExperience(planeLevel) {
        let addEx = Math.floor(Math.pow(2, planeLevel) * (1.0 / planeLevel));
        GameData.experience += addEx;
    }

    //设置经验值
    static set experience(experience) {
        console.log("//设置经验值")
        GameData._experience = experience;
        //GameCtr.ins.mGame.setPgbLevel()//渲染刷新        
        GameData.setUserData({ exp: GameData._experience });
    }

    //获取经验值
    static get experience() {
        return GameData._experience;
    }

    //获取新手引导步骤
    static get guideStep() {
        return GameData._guideStep;
    }
    static set guideStep(guideStep) {
        GameData._guideStep;
    }

    //设置等级
    static set level(level) {
        console.log("//设置等级",level)

        GameData._level = level;
        //GameCtr.ins.mGame.setLevel()//渲染刷新        
        GameData.setUserData({ level: GameData._level });
    }

    //获取等级
    static get level() {
        return GameData._level;
    }

    static set profit(profit) {
        console.log("//设置收益")

        GameData._profit = profit;
        //GameCtr.ins.mGame.setProfit()//渲染刷新 
        GameData.setUserData({ profit: GameData._profit });
    }

    static get profit() {
        return GameData._profit;
    }

    //增加飞机的每秒收益
    static addProfitOfPlane(planeLevel) {
        let profit = GameData.getProfitOfPlane(planeLevel);
        GameData.profit += profit;
    }

    //减少飞机每秒收益
    static reduceProfitOfPlane(planeLevel) {
        let profit = GameData.getProfitOfPlane(planeLevel);
        GameData.profit -= profit;
        if (GameData.profit <= 0) {
            GameData.profit = 0;
        }
    }

    //获取飞机的每秒收益
    static getProfitOfPlane(planeLevel) {
        let speed = GameData.getSpeedOfPlane(planeLevel);
        let profit = Math.floor(25 * Math.pow(2, (planeLevel - 1) * 0.9) / speed);
        return profit;
    }

    //获取飞机的基础收益
    static getBaseProfitOfPlane(level) {
        let profit = Math.floor(25 * Math.pow(2, (level - 1) * 0.9));
        return profit;
    }

    //设置金币数量
    static set gold(gold) {
        //console.log("//设置金币数量",gold)

        if(gold < 0){
            gold = 0;
        }
        GameData._gold = gold;
        //GameCtr.ins.mGame.setGold()//渲染刷新
        GameData.setUserData({ gold: GameData._gold });
    }
    //提交分数到微信
    static submitScore(){
        let gold_ss = GameData._gold;
        //WXCtr.submitScoreToWx(gold_ss);
    }

    //获取金币数量
    static get gold() {
        return GameData._gold;
    }

    static submitGameData(data=null) {
        if(!data){
            data={
                gold: GameData._gold,
                profit: GameData._profit,
                money: GameData._diamond,
                level: GameData._level,
                exp: GameData._experience
            }
        }
        //GameCtr.submitUserData(data);
    }

    //增加金币
    static addGold(planeLevel) {
        // let addGold = Math.floor(25 * Math.pow(2, (planeLevel - 1) * 0.9));
        // if(GameCtr.ufoProfitBuff){
        //     addGold *= 5;
        // }
        // GameData.gold += addGold;
    }
    //增加金币固定值
    static addGoldChangeless(addGold) {
        GameData.gold += addGold;
    }
    //增加钻石固定值
    static addDiamondsChangeless(addDiamonds) {
        GameData.diamonds += addDiamonds;
    }
    static reduceGold(num) {
        GameData.gold -= num;
    }

    //设置钻石数量
    static set diamonds(diamonds) {
        console.log("//设置钻石数量",diamonds)

        if(diamonds < 0) {
            diamonds = 0;
        }
        GameData._diamond = diamonds;
        //GameCtr.ins.mGame.setDiamonds()//渲染刷新 
        GameData.setUserData({ diamonds: GameData._diamond });
    }

    //获取钻石数量
    static get diamonds() {
        return GameData._diamond;
    }

    //改变钻石数量
    static changeDiamonds(num, callback = null) {
        let diamonds;
        // GameCtr.getUserInfo((data) => {
        //     console.log("data.money == ", data.money);
        //     diamonds = data.money;
        //     GameData.diamonds = diamonds + num;
        //     if (callback) {
        //         callback();
        //     }
        // });
    }

    //设置自己拥有的最高飞机等级
    static set maxPlaneLevel(level) {
        console.log("//设置自己拥有的最高飞机等级")

        GameData._maxPlaneLevel = level;
        GameData.setUserData({ maxPlaneLevel: GameData._maxPlaneLevel });
    }

    //获取自己拥有的最高飞机等级
    static get maxPlaneLevel() {
        return GameData._maxPlaneLevel;
    }

    //获取飞机价格
    static getPriceOfPlane(level, times) {
        let price
        if (level == 1) {
            price = Math.floor(100 * Math.pow(1.25, times));
        } else {
            let profit = GameData.getProfitOfPlane(level - 1);
            price = Math.floor(Math.floor((profit * 360 * (Math.pow(1.5, (level - 1)))) / 10) * 10 * Math.pow(1.25, times));
        }
        return price;
    }

    //获取飞机速度
    static getSpeedOfPlane(level) {
        let speed = 5 * (1 - Math.pow(0.001, (1 / level)));
        return speed;
    }

    //设置飞机的购买次数
    static setBuyTimesOfPlane(level, times) {
        console.log("//设置飞机的购买次数")
        let key = "feiji_shop_" + level;
        if (GameData.planeData) {
            GameData.planeData[key] = times;
        }
        let data = {};
        data[key] = times;
        GameData.setUserData(data,true);
    }

    //获取飞机的购买次数
    static getBuyTimesOfPlane(level) {
        let times = 0;
        let key = "feiji_shop_" + level;
        if (GameData.planeData && GameData.planeData[key]) {
            times = GameData.planeData[key];
        }
        return times;
    }

    //设置停机坪状态
    static setApronState(idx, level/* -1代表该停机坪未解锁， 0代表该停机坪上没有飞机， 大于0代表停机坪上飞机等级 */) {
        let key = "feiji_" + idx;
        if (GameData.planeData) {
            GameData.planeData[key] = level;
        }
        let data = {};
        data[key] = level;
        console.log("设置停机坪状态");
        
        GameData.setUserData(data,true);
    }

    
    static getApronState(idx) {
        console.log("//获取停机坪状态")
        let level = 0;
        let key = "feiji_" + idx;
        for(let key1 in GameData.planeData){
            if(key == key1){
                level = GameData.planeData[key1]; 
            }
        }
        if (GameData.planeData && GameData.planeData[key] && GameData.planeData[key] != 0) {
            level = GameData.planeData[key];
        }
        return level;
    }

    // 设置停机坪飞机状态（是否在跑道）
    static setPlaneStateOfApron(idx, state = false) {
        console.log("设置停机坪飞机状态（是否在跑道）");

        let key = "feiji_switch_" + idx;
        if (GameData.planeData) {
            GameData.planeData[key] = state;
        }
        let data = {};
        data[key] = state;
        GameData.setUserData(data,true);
    }

    //获取停机坪飞机状态
    static getPlaneStateOfApron(idx) {
        console.log("//获取停机坪飞机状态")
        let state = false;
        let key = "feiji_switch_" + idx;
        if (GameData.planeData && GameData.planeData[key]) {
            state = GameData.planeData[key];
        }
        return state;
    }

    // update (dt) {}
}
