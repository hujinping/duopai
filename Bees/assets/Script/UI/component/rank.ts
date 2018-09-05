
import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _btnClose=null;
    _content=null;

    @property(cc.Prefab)
    rankItem:cc.Prefab=null;

    onLoad(){
        this._btnClose=this.node.getChildByName("btn_close");
        this._content=this.node.getChildByName("scrollView").getChildByName("view").getChildByName("content");

        this.initBtnEvent(this._btnClose);
        this.initRank(5);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                AudioManager.getInstance().playSound("audio/btnClose");
                this.node.destroy();
                GameCtr.getInstance().getGame().setMaskVisit(false);
            }
        })
    }

    initRank(ranklist){
        for(let i=0;i<5;i++){
            let rankItem=cc.instantiate(this.rankItem);
            rankItem.parent=this._content;
            rankItem.y=-50-98*i;
            // rankItem.getComponent("rankItem").setRank();
            // rankItem.getComponent("rankItem").setCity();
            // rankItem.getComponent("rankItem").setName();
            // rankItem.getComponent("rankItem").setMoney();
            // rankItem.getComponent("rankItem").setHeadImg();
        }
    }

    
}
