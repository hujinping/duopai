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
    _defaultHead=null;
  

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
        this._defaultHead=this.node.getChildByName("defaltHead");
        
        this.initBtnEvent(this._btn_get);

        this._btn_get.active=false;
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_get"){
                HttpCtr.getCash(this.showRedPackage.bind(this));
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

    showRedPackage(data){
        if(cc.find("Canvas").getChildByName("getRedPackage")){return}
        let getPackage=cc.instantiate(this.getRedPackage);
        getPackage.parent=cc.find("Canvas");
        getPackage.setLocalZOrder(1);
        getPackage.getComponent("getRedPackage").setValue(data.m);
        getPackage.getComponent("getRedPackage").setSurplusMoney();
        GameCtr.getInstance().getGame().setRealMoney(data.m);
        HttpCtr.setUserDataState(this.node.tag,10);
        this.disableBtn();
    }

    setName(name){
        if(name==null){return}
        this._name=name==false?"游客":name;
        this._btn_get.active=true;
        this._lb_name.getComponent(cc.Label).string=Util.cutstr(this._name,4);
    }

    setCount(count){
        this._lb_count.getComponent(cc.Label).string=count;
    }

    setHeadImg(url){
        this._url=url;
        if(this._url==null){return}
        if(this._url==false){
            this._defaultHead.active=true;
            return;
        }else{
            this._defaultHead.active=false;
        }
        
        let sp=this._head.getComponent(cc.Sprite);
        cc.loader.load({
            url: url,
            type: 'png'
        }, (err, texture) => {
            sp.spriteFrame = new cc.SpriteFrame(texture);
        });
    }
}
