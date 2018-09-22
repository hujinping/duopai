import AudioManager from "../../Common/AudioManager";
import HttpCtr from "../../Controller/HttpCtr";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    ufoAward:cc.Prefab=null;
    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/open_panel");
            this.node.destroy();
            if(cc.find("Canvas").getChildByName("ufoAward")){return}
            let ufoAward=cc.instantiate(this.ufoAward);
            ufoAward.parent=cc.find("Canvas");
            HttpCtr.openClick(GameCtr.clickType.ufo);
        })
    }

}
