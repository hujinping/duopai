//游戏全局控制类
import AudioManager from "../Common/AudioManager";
import UserManager from "../Common/UserManager";
import WXCtr from "./WXCtr";
import Game from "../UI/game/Game";
import Manufacture from "../UI/game/manufacture";
import Level from "../UI/game/level";
import RankingView from "../UI/ranking/RankingView";
import HttpCtr from "./HttpCtr";
import Http from "../Common/Http";
import Loading from "../UI/loading/loading";
//import Collide from "../View/game/Collide";

const { ccclass, property } = cc._decorator;



@ccclass
export default class GameCtr {
    public static ins: GameCtr;
    private mGame: Game;
    private mManufacture: Manufacture;
    private mLevel: Level;
    private mRanking:RankingView;
    private eventTarget=null;
    private mLoading: Loading;
    public static selfInfo=null;
    public static isAudited= false;                     //已审核
    public static reviveTimes = 0;                      //第几次复活
    public static globalSpeedRate=1;                    //游戏全局加速
    public static incomeRate=1;                         //收益倍率
    public static score: number = 0;
    public static rankingEntrance = "Start";            //排行榜界面入口，默认开始界面
    public static navigatorData = null;                 //更多游戏导航数据
    public static challengerData = null;                //挑战者信息
    public static challengeSwitch = false;              //挑战开关(有人发起挑战时为true)
    public static reviveData=null;      
    public static maxPerCombLevel=30;                   //最大蜂巢等级
    public static maxCombsCount=30;                     //蜂巢最大数量
    public static maxPlayerLevel=145;                   //人物最大等级
    public static maxManufactureLevel=300;              //生产线等级

    public static money=0;                              //玩家已经挣到的钱(只是还剩的钱，不包括生产线等级 和蜂巢 )
    public static levelMoney=0;
    public static rich=0;                               //玩家总财富
    public static honeyValue=0;                         //蜂蜜值
    public static level=null;
    public static ManufactureLevel=null;
    public static comblevel=null;
    public static combsUnlock=null;
    public static levelConfig=null;
    public static manufactureConfig=null;
    public static combConfig=null;
    public static pfTurnTableConfig=null;
    public static otherConfig=null;
    public static setting=null;
    public static upper_boundary=null;
    public static lower_boundary=null;
    public static newGameData=null;
    public static guide=null;
    public static tipHandTag=1500;
    public static realMoney=null;
    public static vedioTimes=6;
    public static honeyPool=null;
    public static jarPool=null;
    public static bubbleMoneyPool=null;
    public static isGetSetting=false;
    public static advTime=120;
    public static advVedioTime=60;

    public static clickType={
        speedUp:1,                   //加速分享
        invite:2,                      //邀请分享
        more:3,                        //更多游戏
        ufo:4,                         //ufo
        attention:5,                   //关注
        shop:6,                        //shop
        rank:7,                        //排行
        buy:8,                         //快速购买
        goldNotEnoughShare:9,          //金币不足
        offLineShare:10,                //离线分享
        offLineVedio:11,                //离线看广告
        pfTurntable:12,                 //转盘分享
    }

    constructor() {
        GameCtr.ins = this;
        WXCtr.getSystemInfo()
        WXCtr.getLaunchOptionsSync();
        WXCtr.createUserInfoBtn();
        WXCtr.getAuthSetting();
        WXCtr.showShareMenu();
        WXCtr.wxOnLogin();
        

        GameCtr.honeyPool=new cc.NodePool();
        GameCtr.jarPool=new cc.NodePool();
        GameCtr.bubbleMoneyPool=new cc.NodePool();
    }


    static getInstance() {
        if (!GameCtr.ins) {
            GameCtr.ins = new GameCtr();
        }
        return GameCtr.ins;
    }

    getAdaptScaleRate(){
        var visibleSize = cc.view.getFrameSize();
        var height = 1920 * visibleSize.width / 1080;
        var scaleRate = visibleSize.height / height;
        return scaleRate;
    }

    initEventTarget(){
        this.eventTarget=new cc.EventTarget();
    }

    getEventTarget(){
        return this.eventTarget;
    }

    emitEvent(event,data){
        this.eventTarget.emit(event,data);
    }

    addListener(event,callFunc){
        this.eventTarget.on(event,callFunc);
    }

    removeListener(event){
        this.eventTarget.off(event);
    }

    setLoading(loading:Loading){
        this.mLoading = loading;
    }

    getLoding(){
        return this.mLoading;
    }

    //设置game实例(游戏)
    setGame(game: Game) {
        this.mGame = game;
    }
    //设置蜜蜂工厂实例
    setManufacture(manufacture: Manufacture) {
        this.mManufacture = manufacture;
    }
    //设置end实例（结束）
    setLevel(level: Level) {
        this.mLevel = level;
    }

    setRanking(ranking: RankingView){
        this.mRanking = ranking;
    }

    getRanking(){
        return this.mRanking;
    }

    setCombsUnlock(){
        window.localStorage.setItem("combsUnlock",JSON.stringify(GameCtr.combsUnlock));
    }

    getCombsUnlock(){
        return  window.localStorage.getItem("combsUnlock");
    }

    setPlayerLevel(){
        window.localStorage.setItem("level",GameCtr.level);
    }

    getPlayerLevel(){
        return Number(window.localStorage.getItem("level"))
    }

    setManufactureLevel(){
        window.localStorage.setItem("ManufactureLevel",GameCtr.ManufactureLevel);
    }

    getManufactureLevel(){
        return Number(window.localStorage.getItem("ManufactureLevel"));
    }

    setCombLevel(){
        window.localStorage.setItem("comblevel",GameCtr.comblevel);
    }

    getCombLevel(){
        return Number(window.localStorage.getItem("comblevel"))
    }

    setTimestamp(){
        window.localStorage.setItem("timestamp",Date.now().toString());
    }

    setPlayTimes(){
        let playTimes=window.localStorage.getItem("playTimes")
        if(!playTimes){
            window.localStorage.setItem("playTimes",1+"")
        }else{
            window.localStorage.setItem("playTimes",Number(playTimes)+1+"")
        }
    }

    getPlayTimes(){
        return window.localStorage.getItem("playTimes");
    }

    getTimestamp(){
        return Number(window.localStorage.getItem("timestamp"));
    }


    setMoney(){
        window.localStorage.setItem("money",GameCtr.money+"");
    }

    getMoney(){
        return Number(window.localStorage.getItem("money"))
    }

    setRich(){
        window.localStorage.setItem("rich",GameCtr.rich+"");
    }

    getRich(){
        return Number(window.localStorage.getItem("rich"));
    }

    setLevelMoney(){
        window.localStorage.setItem("levelMoney",GameCtr.levelMoney+"");
    }

    getLevelMoney(){
        return Number(window.localStorage.getItem("levelMoney"));
    }

    setHoneyValue(){
        window.localStorage.setItem("honeyValue",GameCtr.honeyValue+"");
    }

    getHoneyValue(){
        return Number(window.localStorage.getItem("honeyValue"));
    }

    setGuide(){
        window.localStorage.setItem("guide",JSON.stringify(GameCtr.guide))
    }

    getGuide(){
        return JSON.parse(window.localStorage.getItem("guide"));
    }


    getGame(){
        return this.mGame;
    }

    getManufacture(){
        return this.mManufacture;
    }

    getLevel(){
        return this.mLevel;
    }

    //场景切换
    static gotoScene(sceneName) {
        cc.director.loadScene(sceneName);
        //AudioManager.getInstance().stopAll();
    }

    //显示结束界面
    static showEnd() {
        GameCtr.gotoScene("End");
    }

    //显示开始界面
    static showStart() {
        GameCtr.gotoScene("Start");
    }

    // 显示最想王者
    static showStrongest() {
        GameCtr.gotoScene("Strongest");
    }

    //显示复活界面
    static showRevive() {
        if(GameCtr.ins){
            //GameCtr.ins.mGame.showRevive();
        }
    }

    //根据图片路径设置sprite的spriteFrame
    static loadImg(spr, imgUrl) {
        cc.loader.load({
            url: imgUrl,
            type: 'png'
        }, (err, texture) => {
            spr.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    //开始游戏
    static startGame() {
        GameCtr.score = 0;
        GameCtr.gotoScene("Game");
    }

    //显示排行榜
    static showRanking(entrance) {
        GameCtr.rankingEntrance = entrance;
        GameCtr.gotoScene("Ranking");
    }

    //复活继续游戏
    static revive() {
        //GameCtr.surplusReviveTimes--;
        //复活逻辑自己处理...
    }


    //播放背景音乐
    static playBgm() {
        // AudioManager.getInstance().playMusic("audio/bgm", true, 1); 
    }

    //增加分数
    static addScore(num) {
        if (GameCtr.ins) {
            GameCtr.score += num;
        }
    }

    //游戏结束
    static gameOver() {
        if (GameCtr.ins) {
            //WXCtr.submitScoreToWx(GameCtr.score);
            //HttpCtr.sendScore();
            // if(GameCtr.surplusReviveTimes > 0) {
            //     GameCtr.showRevive();
            // }
        }
    }

    saveSelfInfoToLocal(info){
        let selfInfo={
            avatarUrl: info.avatarUrl,
            city: info.city,
            country: info.country,
            gender: info.gender,
            language: info.language,
            nickName: info.nickName,
            province: info.province,
        }
        
        window.localStorage.setItem("selfInfo",JSON.stringify(selfInfo))
    }

    getSelfInfoFromLocal(){
        let selfInfo=window.localStorage.getItem("selfInfo");
        if(!selfInfo){return};
        return JSON.parse(selfInfo);
    }

     //获取广告配置
     static getSliderConfig(slideType) {
        Http.send({
            url: Http.UrlConfig.GET_ALL_SLIDES,
            success: (resp) => {
                console.log("getSlider数据", resp);
                if (slideType == "index") {
                    // GameCtr.otherData=resp.data;
                    // GameCtr.ins.mStart.showSlide(resp.data);
                } else if (slideType == "settlement") {
                    //GameCtr.ins.mEnd.showSlider(resp.data);
                }else if (slideType == "nav") {
                    GameCtr.newGameData=resp.data;
                }
            },
            data: {
                slide_type: slideType
            }
        });
    }


    static showLoading(showMask = true) {
        if (window.wx != undefined) {
            wx.showLoading({
                title: "疯狂加载中",
                mask: showMask
            });
        }
    }

    static hideLoading() {
        if (window.wx != undefined) {
            wx.hideLoading();
        }
    }

    //分享到群检测
    static shareGroupCheck(encryptedData, iv,type) {
        Http.send({
            url: Http.UrlConfig.SHARE_GROUP,
            data: {
                user_id: UserManager.user_id,
                encrypted_data: encryptedData,
                iv: iv
            },
            success: (resp) => {
                console.log("分享到群成功", resp);
                console.log(resp.code == 403);
                if (resp.code == 200) {
                    // console.log('走到200');
                    // if(type=='collide'){
                    //     GameCtr.ins.mCollide.shareOk()
                    // }else{
                    //     GameCtr.getGold("group");
                    // }
                } else if (resp.code == 403) {
                    // if(type == 'collide'){
                    //     console.log('222222222')
                    //     GameCtr.shareTip('今天已分享过该群，暂无奖励');
                    // }else{
                    //     GameCtr.reviveTip("今天已经分享过这个了！");
                    // }
                }
            }
        });
    }

        //登录游戏
        static login(code, info, showWorldRanking = false) {
            Http.send({
                url: Http.UrlConfig.LOGIN,
                success: (resp) => {
                    if (resp.code == Http.Code.OK) {
                        UserManager.user_id = resp.data.user_id;
                        // if (showWorldRanking) {
                        //     GameCtr.getInstance().getRanking().showWorldRanking();
                        //     console.log("log-------------showWorldRanking-----------");
                        //     GameCtr.getInstance().getRanking().initSelfInfo();
                        // }
                        // Http.send({
                        //     url: Http.UrlConfig.SAVE_INFO,
                        //     data:
                        //     {
                        //         avatar_url: info.avatarUrl,
                        //         city: info.city,
                        //         country: info.country,
                        //         gender: info.gender,
                        //         language: info.language,
                        //         nick_name: info.nickName,
                        //         user_id: UserManager.user_id,
                        //         province: info.province,
                        //     },
                        //     success: () => {
                        //         GameCtr.getShareSwitch();               //登录成功，获取分享开关
                        //         GameCtr.getRandomUser();
                        //         GameCtr.getGameOverShareSwitch();
                        //         console.log("渠道验证成功111", WXCtr.launchOption.query);
                        //         GameCtr.chanelCheck(WXCtr.launchOption.query.channel_id, UserManager.user_id);
                        //         GameCtr.seekJion(WXCtr.launchOption.query.Send_user_id, WXCtr.launchOption.query.isInvite);
                        //         GameCtr.getToolInfo();
                        //         
                        //         GameCtr.getUserInfoCtr();
                        //     }
                        // });
                    }
                },
                data: {
                    code: code
                }
            });
    
        }
}
