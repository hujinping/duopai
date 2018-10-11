import WXCtr from "../../Controller/WXCtr";
import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    private lb_time=null;
    private timeCount=10;

    onLoad () {
        this.initBtns();
        this.lb_time=this.node.getChildByName("lb_time")
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
        let btn_revive=this.node.getChildByName("btn_revive");

        this.initBtnListen(btn_close);
        this.initBtnListen(btn_revive);
    }

    initBtnListen(btn){
        btn.on(cc.Node.EventType.TOUCH_END,function(e){
            let btnName=e.target.getName();
            AudioManager.getInstance().playSound("audio/btnCick");
            if(btnName=="btn_close"){
                this.close();
            }else if(btnName=="btn_revive"){
                //分享屏蔽 看视频复活
                GameCtr.getInstance().getGame().doRivive();
                // if(GameCtr.vedioTimes<0){
                //     WXCtr.offCloseVideo();
                //     WXCtr.showVideoAd();
                //     WXCtr.onCloseVideo((res) => {
                //         if (res) {
                //             GameCtr.getInstance().getGame().doRivive();
                //         }else{
                //             GameCtr.getInstance().getGame().showToast("视频未看完，无法领取奖励");
                //         }
                //     });
                // }else{
                //     GameCtr.getInstance().getGame().showToast("今日视频已看完");
                // }
            }
        }.bind(this))
    }


    update(dt){
        if(this.timeCount>=0){
            this.timeCount-=dt;
            let time=Math.ceil(this.timeCount);
            this.lb_time.getComponent(cc.Label).string=time;

            if(time==0){
                this.close();
            }
        }
    }

    close(){
        GameCtr.getInstance().emitEvent("choiceGame",null);
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.15,0.2),
            cc.callFunc(function(){
                this.node.destroy();
            }.bind(this))
        ))
    }
}
