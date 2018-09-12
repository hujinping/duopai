import GameCtr from "../../Controller/GameCtr";
import WXCtr from "../../Controller/WXCtr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _adSprite=null;
    _adName=null;

    onLoad(){
       this._adSprite=this.node.getChildByName("sp");
       this._adName=this.node.getChildByName("name");
       this._adName.active=false;
    }

    init(data){
        let sp = this._adSprite.getComponent(cc.Sprite);
        GameCtr.loadImg(sp,data.img)
        let obj = {appid:data.appid,path:data.path}
        this._adSprite.on(cc.Node.EventType.TOUCH_START, ()=>{
            WXCtr.gotoOther(obj);
        });

    }
}
