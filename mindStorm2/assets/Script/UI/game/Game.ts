/**
 * 游戏界面
 * 游戏逻辑自己实现
 */
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
import ViewManager from "../../Common/ViewManager";
import HttpCtr from "../../Controller/HttpCtr";
import UserManager from "../../Common/UserManager";
import Util from "../../Common/Util";
import AudioManager from "../../Common/AudioManager";
const { ccclass, property } = cc._decorator;

enum GameMap{
    LEFT,
    RIGHT
}

enum Obstacle{
    CAVE,
    CACTI,
}

@ccclass
export default class Game extends cc.Component {

    @property(cc.Prefab)
    cave:cc.Prefab=null;

    @property(cc.Prefab)
    cacti:cc.Prefab=null;

    @property(cc.Prefab)
    role_1:cc.Prefab=null;

    @property(cc.Prefab)
    role_2:cc.Prefab=null;

    @property(cc.Prefab)
    role_3:cc.Prefab=null;
    
    @property(cc.Prefab)
    morePower:cc.Prefab=null;

    @property(cc.Prefab)
    titlePrefab:cc.Prefab=null;

    @property(cc.Prefab)
    revivePrefab:cc.Prefab=null;

    @property(cc.Prefab)
    eatChickenPrefab:cc.Prefab=null;

    @property(cc.Prefab)
    flagPrefab:cc.Prefab=null;

    @property(cc.Node)
    choiceIcon:cc.Node

    private gameBg1=null;
    private gameBg2=null;
    private btn_error=null;
    private btn_error_clicked=null;
    private btn_corrent=null;
    private btn_corrent_clicked=null;
    private titleNode=null;
    private reviveNode=null;
    private line=null;
    private gameOverNode=null;
    private firstTitleTime=10;
    private titleIntervalTime=10;
    private matchingCount=3;
    private lastAnswerTime=-1;
    private lastAnserFinishTime=-1;
    
    private obstacleNode=null;
    private banAnswer=false;
    private isGameOver=false;
    private isObstacleComing=false;
    private dieLeft=false;

    private birthPlaceArr=[];
    private rolePlaceArr=[];
    private roles=[];
    private roleModleArr=[];
    
    onLoad() {
        GameCtr.getInstance().setGame(this);
        this.initData();
        this.initNode();
        this.initBtns();
        this.initEvent();
    }

    initData(){
        this.birthPlaceArr.push(cc.p(-600,600));
        this.birthPlaceArr.push(cc.p( 600,600));
        this.birthPlaceArr.push(cc.p(-600,0));
        this.birthPlaceArr.push(cc.p( 600,0));
        this.birthPlaceArr.push(cc.p(-600,-600));
        this.birthPlaceArr.push(cc.p( 600,-600));

        for(let i=0;i<GameCtr.gameRoleCount*2;i++){
            let offx=i%6>=3?50:0;
            this.rolePlaceArr.push({pos:cc.p(-400+(i%6)*150+offx+Math.random()*50-25,-480+Math.floor(i/6)*150),isEmpty:true,index:i});
        }

        this.roleModleArr.push(this.role_1);
        this.roleModleArr.push(this.role_2);
        this.roleModleArr.push(this.role_3);
    }

    initNode(){
        this.gameBg1=this.node.getChildByName('bg1');
        this.gameBg2=this.node.getChildByName('bg2');
        this.line=this.node.getChildByName("line");
        this.line.active=false;
        this.initGameOverNode();
    }

    initBtns(){
        this.btn_error=this.node.getChildByName("btn_error");
        this.btn_corrent=this.node.getChildByName("btn_corrent");
        this.btn_error_clicked=this.node.getChildByName("btn_error_clicked");
        this.btn_corrent_clicked=this.node.getChildByName("btn_corrent_clicked");

        this.btn_error.active=false;
        this.btn_corrent.active=false;
        this.btn_error_clicked.active=false;
        this.btn_corrent_clicked.active=false;

        this.initBtn(this.btn_error);
        this.initBtn(this.btn_corrent);

    }

    initBtn(btn){
        btn.on(cc.Node.EventType.TOUCH_END,function(e){
            if((Date.now()-this.lastAnswerTime)/1000<0.6){return;}
            if((Date.now()-this.lastAnserFinishTime)/1000<1.0){return;}
            if(this.isObstacleComing){return;}
           
            AudioManager.getInstance().playSound("audio/btnCick");
            this.doRoleAnswer(0);
            let btnName=e.target.getName();
            if(btnName=="btn_corrent"){
                this.btn_error.active=true;
                this.btn_corrent.active=false;
                this.btn_error_clicked.active=false;
                this.btn_corrent_clicked.active=true;
                this.choiceIcon.x=-280;
            }else if(btnName="btn_error"){
                this.btn_error.active=false;
                this.btn_corrent.active=true;
                this.btn_error_clicked.active=true;
                this.btn_corrent_clicked.active=false;
                this.choiceIcon.x=280;
            }

            this.choiceIcon.active=true;
            this.choiceIcon.opacity=0;
            this.choiceIcon.runAction(cc.sequence(
                cc.fadeIn(0.2),
                cc.delayTime(0.1),
                cc.fadeOut(0.2)
            ));
            this.lastAnswerTime=Date.now();
        }.bind(this))
    }

    initGameOverNode(){
        this.gameOverNode=this.node.getChildByName("gameOver");
        let btn_back=this.gameOverNode.getChildByName("frame").getChildByName("btn_back");
        let btn_continue=this.gameOverNode.getChildByName("frame").getChildByName("btn_continue");
        let btn_share=this.gameOverNode.getChildByName("desFrame").getChildByName("btn_share");
       
        this.gameOverNode.setLocalZOrder(80);

        btn_back.on(cc.Node.EventType.TOUCH_END,function(e){
            AudioManager.getInstance().playSound("audio/btnCick");
            cc.director.loadScene("Start")
        })

        btn_share.on(cc.Node.EventType.TOUCH_END,function(e){
            AudioManager.getInstance().playSound("audio/btnCick");
            WXCtr.share(null);
        })

        btn_continue.on(cc.Node.EventType.TOUCH_END,function(e){
            AudioManager.getInstance().playSound("audio/btnCick");
            if(GameCtr.powerValue>0){
                GameCtr.powerValue--;
                this.gameOverNode.active=false;
                this.clearRoles();
                this.start();
                this.gameBg1;
                this.gameBg2;
            }else{
                if(!GameCtr.isAudited){
                    ViewManager.toast("没有体力值");
                    return}
                if(this.node.getChildByName("morePower")){return}
                let morePowerNode=cc.instantiate(this.morePower);
                morePowerNode.parent=this.node;
                morePowerNode.setLocalZOrder(100);
               
            }
        }.bind(this))
    }

    initEvent(){
        GameCtr.getInstance().addListener("answerFinish",  this.onAnswerFinish.bind(this));
        GameCtr.getInstance().addListener("shareSuccess",  this.onShareSuccess.bind(this));
        GameCtr.getInstance().addListener("banAnswer",     this.onBanAnswer.bind(this));
        GameCtr.getInstance().addListener("matchCountDown",this.onMatchCountDown.bind(this));
        GameCtr.getInstance().addListener("showFlag",      this.onShowFlag.bind(this));
        GameCtr.getInstance().addListener("choiceGame",    this.onChoiceGame.bind(this));
        GameCtr.getInstance().addListener("restartGame",   this.onRestartGame.bind(this));
    }


    start() {
        this.matchingCount=3;
        GameCtr.reviveTimes=1;
        this.isGameOver=false;
        this.isObstacleComing=false;
        this.lastAnswerTime=Date.now();
        GameCtr.rankingEntrance = "Start";               //进入游戏后把排行榜的入口信息恢复成默认
        GameCtr.isMatchingOver =false;
        HttpCtr.GameStart(null);
        HttpCtr.getGameStartInfo(this.initMatchingRoles.bind(this));
        this.showMatching();
        this.scheduleOnce(function(){
            this.getTitie();
            AudioManager.getInstance().playSound("audio/start");
        }.bind(this),this.firstTitleTime);
        this.startBgRoll();
    }

    startBgRoll(){
        this.gameBg1.stopAllActions();
        this.gameBg2.stopAllActions();
        this.gameBg1.y=0;
        this.gameBg2.y=-GameCtr.IPONEX_HEIGHT;

        this.gameBg1.runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(2.5,cc.p(0,GameCtr.IPONEX_HEIGHT)),
            cc.callFunc(function(){
                if(this.gameBg1.y>=GameCtr.IPONEX_HEIGHT-5){this.gameBg1.y=-GameCtr.IPONEX_HEIGHT};
            }.bind(this)),
        )));
        this.gameBg2.runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(2.5,cc.p(0,GameCtr.IPONEX_HEIGHT)),
            cc.callFunc(function(){
                if(this.gameBg2.y>=GameCtr.IPONEX_HEIGHT-5){this.gameBg2.y=-GameCtr.IPONEX_HEIGHT};
            }.bind(this)),
        )));

        if(this.obstacleNode){
            this.obstacleNode.destroy();
        }
    }


    showMatching(){
        this.titleNode=cc.instantiate(this.titlePrefab);
        this.titleNode.parent=this.node;
        this.titleNode.getComponent("titleNode").showMatching();
        this.titleNode.setLocalZOrder(40);
    }

    getTitie(){
        if(this.isGameOver){
            return;
        }
        this.banAnswer=false;
        this.titleNode.active=true;
        this.titleNode.getComponent("titleNode").getTitle();
        this.btn_error.active=true;
        this.btn_corrent.active=true;
        this.line.active=true;
        this.randomOtherRoleAnswer();
        this.switchBtnStateByPos();

        this.scheduleOnce(this.getTitie.bind(this),this.titleIntervalTime);
    }

    switchBtnStateByPos(){
        if(this.roles[0].node.x>0){//自己在错误队列
            this.btn_error.active=false;
            this.btn_corrent.active=true;
            this.btn_error_clicked.active=true;
            this.btn_corrent_clicked.active=false;
        }else{
            this.btn_error.active=true;
            this.btn_corrent.active=false;
            this.btn_error_clicked.active=false;
            this.btn_corrent_clicked.active=true;
        }
    }

    initMatchingRoles(matchingRoles){
        for(let i=0;i<GameCtr.gameRoleCount;i++){
            this.node.runAction(cc.sequence(
                cc.delayTime(0.2*i),
                cc.callFunc(function(){
                let role=null;
                if(i==0){//初始化玩家自己
                    let selfInfo=GameCtr.getInstance().getSelfInfoFromLocal();
                    role=cc.instantiate(this.roleModleArr[GameCtr.roleIndex]);
                    role.parent=this.node;
                    role.getComponent("role").setName(Util.cutstr(selfInfo.nickName,4));
                    role.getComponent("role").setHeadImg(selfInfo.avatarUrl);
                }else{//其他玩家
                    role=cc.instantiate(this.roleModleArr[Math.floor(Math.random()*3)]);
                    role.parent=this.node;
                    role.getComponent("role").setName(Util.cutstr(matchingRoles[i].nick,4));
                }
                let randomNum=Math.floor(Math.random()*6);
                role.x=this.birthPlaceArr[randomNum].x;
                role.y=this.birthPlaceArr[randomNum].y;
                
                role.tag=i;
                role.setLocalZOrder(GameCtr.gameRoleCount*2-i);
                role.runAction(cc.moveTo(0.3,this.rolePlaceArr[i].pos)); 
                this.rolePlaceArr[i].isEmpty=false;
                this.roles.push({node:role,die:false});
                }.bind(this))
            ))
        }
    }


    randomOtherRoleAnswer(){
        if(this.banAnswer ||this.roles.length==1){return}

        let randomNum=Math.floor(Math.random()*(this.roles.length-1)+1);
        randomNum=this.roles.length==1?0:randomNum;
            
        this.doRoleAnswer(randomNum);
        let nextTime=Math.random()*0.5+Math.floor(8/this.roles.length);
        
        this.scheduleOnce(this.randomOtherRoleAnswer.bind(this),nextTime);
        this.scheduleOnce(this.makeUpRoles.bind(this),nextTime*(1.5));
    }



    doRoleAnswer(roleIndex){
        let role=this.roles[roleIndex].node;
        this.rolePlaceArr[role.tag].isEmpty=true;
        let posIndex=null;
        if(role.x>0){//此机器人判断当前问题是错的
            posIndex=this.getBestEmptyPosIndex(GameMap.LEFT);
        }else{//此机器人判断当前问题是对的
            posIndex=this.getBestEmptyPosIndex(GameMap.RIGHT);
        }
        role.stopAllActions();
        console.log("log-----------doRoleAnswer-----------roleIndex  this.rolePlaceArr=:",posIndex,this.rolePlaceArr);
        role.runAction(cc.moveTo(0.5,cc.p(this.rolePlaceArr[posIndex].pos)));
        role.setLocalZOrder(GameCtr.gameRoleCount*2-posIndex);
        role.tag=posIndex;
        this.rolePlaceArr[posIndex].isEmpty=false;

    }

    getPrePosIndex(role){
        for(let i=0;i<this.rolePlaceArr.length;i++){
            if(role.x==this.rolePlaceArr[i].pos.x && role.y==this.rolePlaceArr[i].pos.y){
                return i
            }
        }
    }

    getBestEmptyPosIndex(gameMapPos:GameMap){
        if(gameMapPos==GameMap.LEFT){
            for(let i=0;i<this.rolePlaceArr.length;i++){
                if(i%6>=3){continue;}
                if(this.rolePlaceArr[i].isEmpty) 
                    return i; 
            }
        }else {
            for(let i=0;i<this.rolePlaceArr.length;i++){
                if(i%6<3){continue;}
                if(this.rolePlaceArr[i].isEmpty) 
                    return i; 
            }
        }
    }

    //当前玩家要到另一队列中，需要找到最后面的机器人来补齐此机器人的位置
    makeUpRoles(){
        if(this.banAnswer){return}

        let randomNum=Math.floor(Math.random()*(this.roles.length-1)+1);
        randomNum=this.roles.length==1?0:randomNum;

        if(this.roles[randomNum].node.x>0){
            for(let i =0;i<this.rolePlaceArr.length;i++){
                if(i%6<3){continue;}
                if(randomNum-i<6){return};

                if(this.rolePlaceArr[i].isEmpty){
                    this.rolePlaceArr[this.roles[randomNum].node.tag].isEmpty=true;
                    this.rolePlaceArr[i].isEmpty=false;
                    this.roles[randomNum].node.tag=i;
                    this.roles[randomNum].node.setLocalZOrder(GameCtr.gameRoleCount*2-i)
                    this.roles[randomNum].node.stopAllActions();
                    this.roles[randomNum].node.runAction(cc.moveTo(0.5,this.rolePlaceArr[i].pos))
                    return 
                }
            }

        }else{
            for(let i =0;i<this.rolePlaceArr.length;i++){
                if(i%6>3){continue;}
                if(randomNum-i<6){return};

                if(this.rolePlaceArr[i].isEmpty){
                    this.rolePlaceArr[this.roles[randomNum].node.tag].isEmpty=true;
                    this.rolePlaceArr[i].isEmpty=false;
                    this.roles[randomNum].node.tag=i;
                    this.roles[randomNum].node.setLocalZOrder(GameCtr.gameRoleCount*2-i) 
                    this.roles[randomNum].node.stopAllActions();
                    this.roles[randomNum].node.runAction(cc.moveTo(0.5,this.rolePlaceArr[i].pos))
                    return 
                }
            }
        }
    }



    getBackwardRoleIndex(gameMapPos:GameMap){
        if(gameMapPos==GameMap.LEFT){
            for(let i=this.rolePlaceArr.length-1;i>=0;i--){
                if(i%6>=3){continue;}
                if(!this.rolePlaceArr[i].isEmpty) 
                    return i; 
            }
        }else {
            for(let i=this.rolePlaceArr.length-1;i>=0;i--){
                if(i%6<3){continue;}
                if(!this.rolePlaceArr[i].isEmpty) 
                    return i; 
            }
        }
    }

    showErrorObstacle(){
        this.isObstacleComing=true;
        let randnum=Math.floor(Math.random()*2);
        let absX=null;
        if(randnum==Obstacle.CAVE){
            this.obstacleNode=cc.instantiate(this.cave);
            this.obstacleNode.scaleX=1.0;
            absX=310;
        }else if(randnum==Obstacle.CACTI){
            this.obstacleNode=cc.instantiate(this.cacti);
            this.obstacleNode.scaleX=0.79;
            this.obstacleNode.scaleY=0.79*0.79;
            absX=274;
        }

        if(this.gameBg1.y<0){
            this.obstacleNode.parent=this.gameBg1;
        }else{
            this.obstacleNode.parent=this.gameBg2;
        }
        
        if(GameCtr.questionAnswer==1){
            this.obstacleNode.x=absX
        }else{
            this.obstacleNode.x=-absX
        }
        this.obstacleNode.y=-960;
        this.obstacleNode.scaleY=1/1.269
        this.obstacleNode.tag=randnum;
    }

    //增加游戏分数
    addScore(num = 1) {
        GameCtr.addScore(num);
    }

    /**
     * 下面两个方法为测试用，自己根据实际需求处理
     */
    gameOver() {
        GameCtr.gameOver();
    }

    clickAddScore() {
        this.addScore(1);
    }
 
    showRevive(){
        if(this.node.getChildByName("revive")){return};
        if(!GameCtr.isAudited){return}

        this.reviveNode=cc.instantiate(this.revivePrefab);
        this.reviveNode.parent=this.node;
        this.reviveNode.setLocalZOrder(60);
    }

    matchingCountDown(){
        if(this.matchingCount==0){return};
        let countNode=this.node.getChildByName("countDown_"+this.matchingCount);
        countNode.active=true;
        countNode.setLocalZOrder(90);
        countNode.scale=1.8;
        countNode.runAction(cc.sequence(
            cc.scaleTo(0.5,1.0),
            cc.delayTime(0.5),
            cc.callFunc(function(){
                countNode.active=false;
            })
        ))
        this.matchingCount--;
        AudioManager.getInstance().playSound("audio/countDown");
        this.scheduleOnce(this.matchingCountDown.bind(this),1);
    }   
    
    
    clearRoles(){
        for(let i=0;i<this.roles.length;i++){
            this.roles[i].node.destroy();
        }
        this.roles.splice(0,this.roles.length);
    }

    /*------------------------------event-------------------------*/
    onAnswerFinish(){
        this.lastAnserFinishTime=Date.now();
        this.node.runAction(cc.sequence(
            cc.delayTime(1.5),
            cc.callFunc(function(){
                this.obstacleNode.destroy();
                this.obstacleNode=null;
            }.bind(this))
        ))
    }

    
    onBanAnswer(){
        this.banAnswer=true;
        this.showErrorObstacle();
        this.hideGameBtns();
    }

    onShowFlag(){
        while(this.node.getChildByTag(5555)){
            this.node.removeChildByTag(5555);
        }
        let flag=cc.instantiate(this.flagPrefab);
        flag.setLocalZOrder(80);
        flag.parent=this.node;
        flag.tag=5555;
    }

    onMatchCountDown(){ 
       this.matchingCountDown()
    }

    onShareSuccess(){
        this.reviveNode.destroy();
        this.reviveNode=null;
        this.revive();
        AudioManager.getInstance().playMusic("audio/gameMusic");
        //console.log("log---------------音乐开关=：", AudioManager.getInstance().musicOn);
    }

    onChoiceGame(){
        let desFrame=this.gameOverNode.getChildByName("desFrame");
        desFrame.active=!GameCtr.isAudited?false:true
        let lb_question=this.gameOverNode.getChildByName("desFrame").getChildByName("lb_question");
        let lb_answer=this.gameOverNode.getChildByName("desFrame").getChildByName("lb_answer");
        lb_question.getComponent(cc.Label).string=GameCtr.questionDes;
        lb_answer.getComponent(cc.Label).string=GameCtr.questionAnswer==1?"正确":"错误";

        this.node.runAction(cc.sequence(
            cc.delayTime(0.3),
            cc.callFunc(function(){
                this.gameOverNode.active=true;
            }.bind(this))
        ))
    }

    onRestartGame(){
        this.clearRoles();
        this.start();
    }

    //----------------------------------------------------------------------------------//
    showEatChicken(){
        let eatChickenNode=cc.instantiate(this.eatChickenPrefab);
        eatChickenNode.parent=this.node;
        eatChickenNode.setLocalZOrder(60);
    }


    collateRolesData(){
        let rolesTemp=[];
        for(let i=0;i<this.roles.length;i++){
            if(!this.roles[i].die){
                rolesTemp.push(this.roles[i]);
            }
        }
        this.roles.splice(0,this.roles.length);
        for(let i=0;i<rolesTemp.length;i++){
            this.roles.push(rolesTemp[i]);
        }
    }

    checkEatChicken(){
        if(this.roles.length==1&&!this.isGameOver){//吃鸡成功
            this.unscheduleAllCallbacks();
            this.titleNode.getComponent("titleNode").unscheduleAllCallbacks();
            HttpCtr.getGameWin(null);
            this.showEatChicken();
        }
    }

    doAbstacle(){
        let offx=GameCtr.questionAnswer==2?1:-1;
        for(let i=0;i<this.roles.length;i++){
            if(offx*this.roles[i].node.x>0){

            }else{
                if(i==0){
                    this.isGameOver=true;
                    this.dieLeft=this.roles[0].node.x>0?false:true;
                    this.roles[i].node.getComponent("role").die(this.obstacleNode.tag,false);
                    this.rolePlaceArr[this.roles[i].node.tag].isEmpty=true;
                    this.unscheduleAllCallbacks();
                }else{
                    this.roles[i].die=true;
                    this.rolePlaceArr[this.roles[i].node.tag].isEmpty=true;
                    this.roles[i].node.getComponent("role").die(this.obstacleNode.tag);
                    
                }
            }
        }

        this.collateRolesData();
        this.chickRivive();
        this.setMoney();
        this.checkEatChicken();
    }

    setMoney(){
        if(!this.isGameOver){
            GameCtr.money+=10;
            HttpCtr.setMoney(GameCtr.money);
        }
    }

    chickRivive(){
        if(!this.isGameOver){return;}
        console.log("log------------------GameCtr.totalReviveTimes  GameCtr.reviveData.revive_number=:",GameCtr.totalReviveTimes,GameCtr.reviveData.revive_number)
        if(GameCtr.reviveTimes>0&&this.roles.length>1&&GameCtr.isAudited&&GameCtr.totalReviveTimes<=GameCtr.reviveData.revive_number){
            this.scheduleOnce(this.showRevive.bind(this),1.0);
        }else{
            this.onChoiceGame();
        }
    }


    hideGameBtns(){
        this.btn_error.active=false;
        this.btn_corrent.active=false;
        this.btn_error_clicked.active=false;
        this.btn_corrent_clicked.active=false;
        this.line.active=false;
    }


    revive(){
        this.isGameOver=false;
        this.roles[0].node.active=true;
        let posIndex=null;
        console.log("log--------------revive-----this.dieLeft=:",this.dieLeft);
        if(!this.dieLeft){
            posIndex=this.getBestEmptyPosIndex(GameMap.RIGHT);
        }else{
            posIndex=this.getBestEmptyPosIndex(GameMap.LEFT);
        }
        console.log("log--------------revive-----this.dieLeft posIndex=:",this.dieLeft,posIndex);
        this.roles[0].node.setLocalZOrder(GameCtr.gameRoleCount*2-posIndex);
        this.roles[0].node.tag=posIndex;
        this.roles[0].node.x=this.rolePlaceArr[posIndex].pos.x;
        this.roles[0].node.y=this.rolePlaceArr[posIndex].pos.y;
        this.rolePlaceArr[posIndex].isEmpty=false;

        GameCtr.reviveTimes--;
        GameCtr.totalReviveTimes++;
        this.unscheduleAllCallbacks();
        this.titleNode.getComponent("titleNode").unscheduleAllCallbacks();
        this.getTitie();
        this.startBgRoll();
    }

    update (dt) {
        if(this.obstacleNode && this.isObstacleComing){
            if(this.obstacleNode.parent.y>200){
                this.doAbstacle();
                this.isObstacleComing=false;
            }
        }
    }
}
