
//import PopupView from "../view/PopupView";
//import ViewManager from "../../Common/ViewManager";
import GameCtr from "../../Controller/GameCtr";
import GameData from "../../Common/GameData";
import WXCtr from "../../Controller/WXCtr";
import AudioManager from "../../Common/AudioManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class pfTurntable extends cc.Component {
    @property(cc.Node)
    wheelSp:cc.Node=null

    @property(cc.Node)
    btnSp:cc.Node=null
    @property(cc.Button)
    btn:cc.Button=null
    @property(cc.Label)
    labelTips:cc.Label=null

    @property(cc.Prefab)
    award:cc.Prefab=null

    private data = {type:5}
    private active = true;
    private isTurning=false;

    //根据数据初始化
    myInit(again){
        // if(again) return;//如果是“再来一次”，则无需判断时间

        // let hours = cc.sys.localStorage.getItem("hours");
        // let nowHours =new Date().getHours(); //获取当前小时数(0-23)
        // if(hours==nowHours){
        //     let num = 60 -new Date().getMinutes();
        //     this.labelTips.string = "距离下一次抽奖还有"+num+"分钟";
        //     this.active = false;
        //     //按钮禁用
        //     this.btn.interactable = false;
        // }else cc.sys.localStorage.setItem("hours",nowHours);
    }
    setData(data){
        this.data = data;
    }
    // update (dt) {},
    callBack_btn(){
        if(GameData.pfTurntable < 1){
            WXCtr.share({callback:()=>{
                GameData.pfTurntable++;
            }})
        }else{
            GameData.pfTurntable--;
            this.btn.node.active = false;
            this.btnSp.active = true;
            this.data = {type:Math.floor(Math.random()*7)};
            this.requestResults();
            GameCtr.getInstance().getGame().disableBtnPfturnable();
            GameCtr.getInstance().getGame().startPfTurntableTime();
        }
        
    }
    showResult(type){
        let awardData=GameCtr.pfTurnTableConfig[type];
        if(this.node.getChildByName("award")){return;}
        let award=cc.instantiate(this.award);
        award.parent=this.node;
        award.getComponent("award").showAward(awardData)
        this.isTurning=false;
    }
    requestResults(){
        this.isTurning=true;
        let nowHours =new Date().getHours(); //获取当前小时数(0-23)
        cc.sys.localStorage.setItem("hours",nowHours);

        //基础数据
        let elickTimes = 10;
        let rounds = 10;

        //获取结果类型，得出相对偏转角度
        //0~45，~90,~135,~180,~225,~270,~315,~360
        let type = null;//Math.floor(Math.random()*8);//客户端随机，测试用
        type = this.data.type;
        let awardAngle = (Math.random()*35+5) +45*type;
        console.log("&&&&^*",this.data,awardAngle);

        //动作及执行
        var rotateBy = cc.rotateBy(elickTimes, awardAngle + 360*rounds).easing(cc.easeCubicActionOut()); 
        let finish = cc.callFunc(()=>{
            this.showResult(type);
        });
        let seq =cc.sequence(rotateBy,finish);
        var actionstepA = this.wheelSp.runAction(seq);
        //播放音效
        AudioManager.getInstance().playSound("audio/lottery_draw", false);
    }
    callBack_test(){
        this.btn.interactable = true;
    }

    close() {
        if(this.isTurning){return}

        AudioManager.getInstance().playSound("audio/btnClose");
        this.node.destroy();
    }
}
