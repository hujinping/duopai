import AudioManager from "../../Common/AudioManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    @property(Number)
    honey:Number=0;
    money:Number=0;

    @property(Boolean)
    isTransfering:Boolean=false;

    @property(cc.Node)
    jar_full:cc.Node=null;

    @property(cc.Node)
    jar_notFull:cc.Node=null;

    @property(cc.Node)
    jar_money:cc.Node=null;


    setFull(){
        this.jar_money.active=false;
        this.jar_notFull.active=false;
        this.jar_full.active=true;
    }

    setNotFull(){
        this.jar_money.active=false;
        this.jar_full.active=false;
        this.jar_notFull.active=true;
    }

    setMoney(){

        this.jar_full.active=false;
        this.jar_notFull.active=false;
        this.jar_money.active=true;
    }

    onClilk(){
        AudioManager.getInstance().playSound("audio/open_panel");
        console.log("log-----------点击蜂蜜罐---------");
    }
}
