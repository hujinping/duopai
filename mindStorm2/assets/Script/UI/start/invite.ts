import HttpCtr from "../../Controller/HttpCtr";
import UserManager from "../../Common/UserManager";
import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _btn_close=null;
    _btn_get=null;
    _content=null;
    @property(cc.Prefab)
    inviteItem:cc.Prefab=null;

    onLoad(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._btn_get=this.node.getChildByName('btn_get');
        this._content=this.node.getChildByName("scrollView").getChildByName("view").getChildByName("content")
        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_get);

        this.initInviteItems();
        this.requestFriendList()
    }


    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/btnCick");
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
                GameCtr.getInstance().getStart().setMaskVisit(false);
            }else if(e.target.getName()=="btn_get"){
                //do sth
            }
        })
    }

    initInviteItems(){
        for(let i=0;i<10;i++){
            let item=cc.instantiate(this.inviteItem)
            item.parent=this._content;
            item.y=-145*i-80;
            item.tag=i+1;
            let key="data_"+item.tag;
            if(UserManager.user[key]>0){
                item.getComponent("inviteItem").setState(true);
            }else{
                item.getComponent("inviteItem").setState(false);
            }
        }
    }


    requestFriendList(){
        HttpCtr.getInviteResult((friendList)=>{
            for(let i=0;i<friendList.length;i++){
                if(friendList[i].uid){
                    console.log("邀请玩家-----uid=:",friendList[i].uid);
                    this._content.children[i].getComponent("inviteItem").setHeadImg(friendList[i].Icon);
                }else {
                    this._content.children[i].getComponent("inviteItem").initHeadEvent();
                }
            }
        });

        this.scheduleOnce(this.requestFriendList.bind(this),1.0);
    }

}
