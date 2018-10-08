
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
        let rankItemCount=0;
        for(let i in ranklist){
            rankItemCount++;
        }
        this._content.setContentSize(cc.size(800,rankItemCount*98));
        for(let i in ranklist){
            let rankItem=cc.instantiate(this.rankItem);
            rankItem.parent=this._content;
            rankItem.y=-50-98*Number(i);
            rankItem.getComponent("rankItem").setRank(ranklist[i].top);
            rankItem.getComponent("rankItem").setCity(ranklist[i].City);
            rankItem.getComponent("rankItem").setName(ranklist[i].nick);
            rankItem.getComponent("rankItem").setMoney(ranklist[i].value);
            rankItem.getComponent("rankItem").setHeadImg(ranklist[i].Icon);
        }
    }

    
}
