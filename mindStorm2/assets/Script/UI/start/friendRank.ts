import { UILoader } from "../../Common/UILoader";
import AudioManager from "../../Common/AudioManager";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    private scrollViewContent =null;
    private btn_close=null;

    onLoad(){
        this.scrollViewContent=this.node.getChildByName("scrollView").getChildByName("view").getChildByName("content");
        this.btn_close=this.node.getChildByName("btn_close");

        this.btn_close.on(cc.Node.EventType.TOUCH_END,function(e){
            this.close();
            AudioManager.getInstance().playSound("audio/btnCick");
        }.bind(this));
    }

    showRank(rankList){
        this.scrollViewContent.setContentSize(cc.size(740,170*2+50));//rankList.length
         for(let i=0; i<2; i++){//rankList.length
            UILoader.loadRes("prefab/friendRankItem", cc.Prefab, (prefab) => {
                UILoader.instantiate(prefab, this.scrollViewContent, (node) => {
                    // node.setLocalZOrder(10);
                    // this.reviveNode=node;
                    node.y=-100-(170*i);
                });
            });

        }
    }

    close(){
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2,0),
            cc.callFunc(function(){
                UILoader.destroy(this.node);
            }.bind(this))
        ))

    }





}
