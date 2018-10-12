import WXCtr from "../../Controller/WXCtr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _icon_done=null;
    _icon_needDo=null;
    _defaultHead=null;
    _head=null;
    _url=null;
    

    onLoad(){
        this._head=this.node.getChildByName("head");
        this._icon_done=this.node.getChildByName("icon_done");
        this._icon_needDo=this.node.getChildByName("icon_needDo");
        this._defaultHead=this.node.getChildByName("defaltHead");
        this._icon_done.active=false;
        this._icon_needDo.active=false;

        
    }

    setState(isDone=false){
        if(isDone){
            this._icon_done.active=true;
            this._icon_needDo.active=false;
        }else{
            this._icon_done.active=false;
            this._icon_needDo.active=true;
        }
    }

    initHeadEvent(){
        this.node.on(cc.Node.EventType.TOUCH_END,(e)=>{
            WXCtr.share({invite:true,callback:()=>{
                console.log("log----------------邀请好友---------");
            }})
        })
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
