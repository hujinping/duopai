import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";
import ViewManager from "../../Common/ViewManager";
import Util from "../../Common/Util";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    morePower:cc.Prefab

    onLoad(){
        let light=this.node.getChildByName("light");
        let selfInfo=GameCtr.getInstance().getSelfInfoFromLocal();
        let headImg=this.node.getChildByName("mask").getChildByName("headImg");

        let btn_back=this.node.getChildByName("frame").getChildByName("btn_back");
        let btn_continue=this.node.getChildByName("frame").getChildByName("btn_continue");

        light.runAction(cc.repeatForever(cc.rotateBy(0.5,30)));
        this.loadHeadImg(headImg,selfInfo.avatarUrl);

        btn_back.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/btnCick");
            GameCtr.getInstance().getGame().removeEvent();
            cc.director.loadScene("Start");
        })

        btn_continue.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/btnCick");
            if(GameCtr.powerValue>0){
                GameCtr.powerValue--;
                localStorage.setItem("powerInfo",JSON.stringify({day:Util.getCurrTimeYYMMDD(),powerValue:GameCtr.powerValue}))
                GameCtr.getInstance().emitEvent("restartGame",null);
                this.node.destroy();
            }else{
                if(!GameCtr.isAudited){
                    GameCtr.getInstance().getGame().showToast("没有体力值");
                    return
                }
                if(this.node.parent.getChildByName("morePower")){return}
                let morePowerNode=cc.instantiate(this.morePower);
                morePowerNode.parent=this.node.parent;
                morePowerNode.setLocalZOrder(80);
            }
        })
    }

    loadHeadImg(headNode:cc.Node,headUrl:string){
        if(headUrl==undefined|| headUrl==""){return}
        let sp=headNode.getComponent(cc.Sprite);
        cc.loader.load({
            url: headUrl,
            type: 'png'
        }, (err, texture) => {
            sp.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    
}
