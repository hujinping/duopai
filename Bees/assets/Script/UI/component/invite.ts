import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";


const {ccclass, property} = cc._decorator;

@ccclass 
export default class NewClass extends cc.Component {
    _btn_close=null;
    _btn_invite=null;

    @property(cc.Prefab)
    inviteFriendItem:cc.Prefab=null;

    onLoad(){
        this.initNode();
        this.initFriendItems();
    }

    initNode(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._btn_invite=this.node.getChildByName("btn_invite");

        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_invite);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
                GameCtr.getInstance().getGame().setMaskVisit(false);
                AudioManager.getInstance().playSound("audio/btnClose")
            }else if(e.target.getName()=="btn_invite"){
                AudioManager.getInstance().playSound("audio/btn_click");
            }
        })
    }

    initFriendItems(){
        for(let i =0;i<4;i++){
            let friendItem=cc.instantiate(this.inviteFriendItem);
            friendItem.parent=this.node;

            friendItem.x=-255+170*i;
            friendItem.y=-120;
        }
    }

}
