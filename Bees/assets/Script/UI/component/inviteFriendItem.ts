import AudioManager from "../../Common/AudioManager";
import HttpCtr from "../../Controller/HttpCtr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _btn_get=null;
    _lb_name=null;
    _lb_count=null;
    _head=null;
  

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
            if(!this._btn_get.getComponent(cc.Button).interactable){return}

            AudioManager.getInstance().playSound("audio/btn_click");
            HttpCtr.openRed(2,this.showRedPackage.bind(this));
        })
    }

    enableBtn(bool){
        this._btn_get.active=bool;
    }

    showRedPackage(money){
        
        if(cc.find("Canvas").getChildByName("getRedPackage")){return}
        let getPackage=cc.instantiate(this.getRedPackage);
        getPackage.parent=cc.find("Canvas");
        getPackage.getComponent("getRedPackage").setValue(money);
        HttpCtr.setFriendBonusState(this.node.tag,10);
    }

    setName(name){
        this._btn_get.active=true;
        this._lb_name.getComponent(cc.Label).string=name;
    }

    setCount(count){
        this._lb_count.getComponent(cc.Label).string=count;
    }

    setHeadImg(url){
        let sp=this._head.getComponent(cc.Sprite);
        cc.loader.load({
            url: url,
            type: 'png'
        }, (err, texture) => {
            sp.spriteFrame = new cc.SpriteFrame(texture);
        });
    }
}
