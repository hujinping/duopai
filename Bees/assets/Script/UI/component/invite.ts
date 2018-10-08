import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";
import WXCtr from "../../Controller/WXCtr";
import HttpCtr from "../../Controller/HttpCtr";
import UserManager from "../../Common/UserManager";


const {ccclass, property} = cc._decorator;

@ccclass 
export default class NewClass extends cc.Component {
    _btn_close=null;
    _btn_invite=null;
    _friendNode=null;

    @property(cc.Prefab)
    inviteFriendItem:cc.Prefab=null;

    onLoad(){
        this.initNode();
        this.initFriendItems();
        this.requestFriendList()
    }

    initNode(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._btn_invite=this.node.getChildByName("btn_invite");
        this._friendNode=this.node.getChildByName("friendNode").getChildByName("view").getChildByName("content");
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
                AudioManager.getInstance().playSound("audio/open_panel");
                WXCtr.share({invite:true,callback:()=>{
                    console.log("log----------------邀请好友---------");
                }})
            }
        })
    }

    initFriendItems(){
        for(let i =0;i<10;i++){
            let friendItem=cc.instantiate(this.inviteFriendItem);
            friendItem.parent=this._friendNode;
            friendItem.tag=10+i;
            friendItem.x=102+176*i;
            friendItem.y=20;
            let key="data_"+friendItem.tag;
            if(UserManager.user[key]>0){
                friendItem.getComponent("inviteFriendItem").disableBtn();
            }
        }
    }

    requestFriendList(){
        HttpCtr.getInviteResult((friendList)=>{
            for(let i=0;i<friendList.length;i++){
                if(friendList[i].uid){
                    console.log("邀请玩家-----uid=:",friendList[i].uid);
                    this._friendNode.children[i].getComponent("inviteFriendItem").setName(friendList[i].nick);
                    this._friendNode.children[i].getComponent("inviteFriendItem").setHeadImg(friendList[i].Icon);
                }else {
                    this._friendNode.children[i].getComponent("inviteFriendItem").initHeadEvent();
                }
            }
        });

        this.scheduleOnce(this.requestFriendList.bind(this),1.0);
    }

}
