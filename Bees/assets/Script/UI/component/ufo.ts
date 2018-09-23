import AudioManager from "../../Common/AudioManager";
import HttpCtr from "../../Controller/HttpCtr";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    ufoAward:cc.Prefab=null;
    treatureBox=null;
    onLoad(){
        this.treatureBox=this.node.getChildByName("treatureBox");
        this.node.runAction(cc.sequence(
            cc.delayTime(3.5),
            cc.callFunc(()=>{
                this.treatureBox.runAction(cc.sequence(
                    cc.moveTo(0.5,cc.p(0,0)).easing(cc.easeElasticOut(3.0)),
                    cc.callFunc(()=>{
                        this.treatureBox.on(cc.Node.EventType.TOUCH_END,(e)=>{
                            AudioManager.getInstance().playSound("audio/open_panel");
                            this.treatureBox.active=false;
                            if(cc.find("Canvas").getChildByName("ufoAward")){return};
                            let ufoAward=cc.instantiate(this.ufoAward);
                            ufoAward.parent=cc.find("Canvas");
                            HttpCtr.openClick(GameCtr.clickType.ufo);
                        })
                        this.treatureBox.runAction(cc.repeatForever(cc.sequence(
                            cc.rotateBy(0.1,-10),
                            cc.rotateBy(0.2,20),
                            cc.rotateBy(0.1,-10),
                            cc.rotateBy(0.05,-10),
                            cc.rotateBy(0.1,20),
                            cc.rotateBy(0.05,-10),
                            cc.delayTime(4),
                        )))
                    }),
                ))
            })
        ))
       


        let spineSkeleton=this.node.getChildByName("spine").getComponent(sp.Skeleton);
        spineSkeleton.setCompleteListener(()=>{
            this.node.destroy();
        })
    }

}
