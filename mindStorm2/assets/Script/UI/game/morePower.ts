import AudioManager from "../../Common/AudioManager";
import WXCtr from "../../Controller/WXCtr";
import GameCtr from "../../Controller/GameCtr";
import ViewManager from "../../Common/ViewManager";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    onLoad () {
        this.initBtns();
        this.initEvent();
        this.showPower();
        this.openAction();
    }

    openAction(){
        this.node.scale=0.2;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.15,1.1),
            cc.scaleTo(0.1,1.0),
        ))
    }

    initBtns(){
        let btn_close=this.node.getChildByName("btn_close");
        let btn_morePower=this.node.getChildByName("btn_morePower");

        this.initBtnListen(btn_close);
        this.initBtnListen(btn_morePower);
    }

    initBtnListen(btn){
        btn.on(cc.Node.EventType.TOUCH_END,function(e){
            AudioManager.getInstance().playSound("audio/btnCick");
            let btnName=e.target.getName();
            if(btnName=="btn_close"){
                this.close();
            }else if(btnName=="btn_morePower"){
                if(GameCtr.powerValue==10){
                    ViewManager.toast("体力值已满");
                    return
                }
                WXCtr.share("morePower")
            }
        }.bind(this))
    }

    initEvent(){
        GameCtr.getInstance().addListener("morePowerSuccess",this.onMorePower.bind(this))
    }

    showPower(){
        let lb_powerValue=this.node.getChildByName("lb_power");
        lb_powerValue.getComponent(cc.Label).string=GameCtr.powerValue+"/10";
    }

    onMorePower(){
        this.close();
    }

    close(){
        GameCtr.getInstance().removeListener("morePowerSuccess");
        let mask=this.node.getChildByName("mask");
        mask.setContentSize(cc.size(1080,2436));
        mask.runAction(cc.fadeOut(0.15));
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.15,0.2),
            cc.callFunc(function(){
                this.node.destroy();
            }.bind(this))
        ))
    }
}
