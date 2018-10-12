import AudioManager from "../../Common/AudioManager";
import WXCtr from "../../Controller/WXCtr";
import GameCtr from "../../Controller/GameCtr";
import ViewManager from "../../Common/ViewManager";
import Util from "../../Common/Util";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    onLoad () {
        
        this.initBtns();
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
        let secne=GameCtr.isFighting?GameCtr.getInstance().getGame():GameCtr.getInstance().getStart();
        btn.on(cc.Node.EventType.TOUCH_END,function(e){
            AudioManager.getInstance().playSound("audio/btnCick");
            let btnName=e.target.getName();
            if(btnName=="btn_close"){
                this.close();
                secne.setMaskVisit(false);
            }else if(btnName=="btn_morePower"){
                if(GameCtr.powerValue==10){
                    secne.showToast("体力值已满");
                    return
                }
                console.log("log----------------btn_morePower-------------");
                if(GameCtr.vedioTimes>0){
                    GameCtr.powerValue++;
                    localStorage.setItem("powerInfo",JSON.stringify({day:Util.getCurrTimeYYMMDD(),powerValue:GameCtr.powerValue}))
                    if(!GameCtr.isFighting){
                        GameCtr.getInstance().getStart().showGameCount();
                    }
                    this.showPower();
                    // WXCtr.offCloseVideo();
                    // WXCtr.showVideoAd();
                    // WXCtr.onCloseVideo((res) => {
                    //     if (res) {
                    //         GameCtr.powerValue++;
                    //         this.showPower();
                    //         if(!GameCtr.isFighting){
                    //              GameCtr.getInstance().getStart().showGameCount();
                    //         }
                    //         localStorage.setItem("powerInfo",JSON.stringify({day:Util.getCurrTimeYYMMDD(),powerValue:GameCtr.powerValue}))
                    //     }else{
                    //         secne.showToast("视频未看完，无法领取奖励");
                    //     }
                    // });
                }else{
                    secne.showToast("今日视频已看完");
                }
            }
        }.bind(this))
    }

    showPower(){
        let lb_powerValue=this.node.getChildByName("lb_power");
        lb_powerValue.getComponent(cc.Label).string=GameCtr.powerValue+"/10";
    }

    close(){
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
