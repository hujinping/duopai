//游戏全局控制类
import AudioManager from "../Common/AudioManager";
import UserManager from "../Common/UserManager";
import WXCtr from "./WXCtr";
import Game from "../UI/game/Game";
import Start from "../UI/start/Start";
import End from "../UI/end/End";
import RankingView from "../UI/ranking/RankingView";
import Revive from "../UI/end/Revive";
import HttpCtr from "./HttpCtr";
import Http from "../Common/Http";
//import Collide from "../View/game/Collide";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameCtr {
    public static ins: GameCtr;
    public mGame: Game;
    private mStart: Start;
    private mEnd: End;
    private eventTarget=null;
    public mRanking: RankingView;
    public static selfInfo=null;
    public static isAudited= false;                     //已审核
    public static reviveTimes = 0;                      //第几次复活
    public static totalReviveTimes=0;                   //总复活次数
    public static questionDes="";                       //当前问题
    public static isMatchingOver=false;
    public static questionAnswer=-1;                    //当前问题答案  1 正确  2 错误
    public static powerValue = 10;                      //游戏体力值
    public static gameRoleCount=30;                     //游戏总人数    
    public static roleTag = -1;                         //游戏角色   
    public static chickenCount=-1;                      //吃鸡数量
    public static joinGameCount=-1;                     //参与游戏次数
    public static score: number = 0;
    public static rankingEntrance = "Start";            //排行榜界面入口，默认开始界面
    public static IPONEX_HEIGHT=2436;
    public static navigatorData = null;                 //更多游戏导航数据
    public static challengerData = null;                //挑战者信息
    public static challengeSwitch = false;              //挑战开关(有人发起挑战时为true)
    public static reviveData=null;
    public static money=null;


    constructor() {
        GameCtr.ins = this;
        WXCtr.getLaunchOptionsSync();
        WXCtr.getAuthSetting();
        WXCtr.showShareMenu();
        WXCtr.wxOnLogin();
        WXCtr.getSelfData();
        this.initEventTarget();
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

    //设置game实例(游戏)
    setGame(game: Game) {
        this.mGame = game;
    }
    //设置start实例（开始）
    setStart(start: Start) {
        this.mStart = start;
    }
    //设置end实例（结束）
    setEnd(end: End) {
        this.mEnd = end;
    }
    //设置ranking实例（排行）
    setRanking(ranking: RankingView) {
        this.mRanking = ranking;
    }



    //场景切换
    static gotoScene(sceneName) {
        cc.director.loadScene(sceneName);
        AudioManager.getInstance().stopAll();
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
            GameCtr.ins.mGame.showRevive();
        }
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
            WXCtr.submitScoreToWx(GameCtr.score);
            HttpCtr.sendScore();
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
}
