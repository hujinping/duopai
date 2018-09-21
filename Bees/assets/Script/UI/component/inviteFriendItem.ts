import AudioManager from "../../Common/AudioManager";
import HttpCtr from "../../Controller/HttpCtr";
import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";
import Util from "../../Common/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _btn_get=null;
    _lb_name=null;
    _lb_count=null;
    _head=null;

    _name=null;
    _url=null;
  

    @property(cc.Prefab)
    getRedPackage:cc.Prefab=null;

    onLoad(){
        this.initNode();
    }

    initNode(){
        this._btn_get=this.node.getChildByName("btn_get");
        this._lb_name=this.node.getChildByName("lb_name");
        this._lb_count=this.node.getChildByName("lb_count");
        this._head=this.node.getChildByName("head");
        
        this.initBtnEvent(this._btn_get);

        this._btn_get.active=false;
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_get"){
                HttpCtr.openRed(2,this.showRedPackage.bind(this));
            }else if(e.target.getName()=="head"){
                WXCtr.share({invite:true,callback:()=>{
                    console.log("log----------------邀请好友---------");
                }})
            }
            AudioManager.getInstance().playSound("audio/open_panel");
        })
    }

    initHeadEvent(){
        this.initBtnEvent(this._head);
    }

    disableBtn(){
        this._btn_get.active=true;
        this._btn_get.getComponent(cc.Button).interactable=false;
        let icon_get=this.node.getChildByName("icon_get");
        icon_get.active=true;
    }

    showRedPackage(money){
        if(cc.find("Canvas").getChildByName("getRedPackage")){return}
        let getPackage=cc.instantiate(this.getRedPackage);
        getPackage.parent=cc.find("Canvas");
        getPackage.getComponent("getRedPackage").setValue(money);
        getPackage.getComponent("getRedPackage").setSurplusMoney();
        
        GameCtr.realMoney+=money;
        GameCtr.getInstance().getGame().setRealMoney();
        HttpCtr.setFriendBonusState(this.node.tag,10);
        this.disableBtn();
    }

    setName(name){
        if(this._name){return}
        this._name=name;
        this._btn_get.active=true;
        this._lb_name.getComponent(cc.Label).string=Util.cutstr(name,4);
    }

    setCount(count){
        this._lb_count.getComponent(cc.Label).string=count;
    }

    setHeadImg(url){
        if(this._url){return}

        this._url=url
        let sp=this._head.getComponent(cc.Sprite);
        cc.loader.load({
            url: url,
            type: 'png'
        }, (err, texture) => {
            sp.spriteFrame = new cc.SpriteFrame(texture);
        });
    }
}
