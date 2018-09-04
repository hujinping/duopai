import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.SpriteAtlas)
    beeAtlas:cc.SpriteAtlas=null;

    @property(cc.Prefab)
    celebrate:cc.Prefab=null;

    _btn_close=null;
    _bee=null;
    _level=null;

    onLoad(){
        this._bee=this.node.getChildByName("bee");
        this._btn_close=this.node.getChildByName("btn_close");

        this._btn_close.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/btn_click");
            GameCtr.getInstance().getGame().setMaskVisit(false);
            this.close();
        })
    }

    init(level){
        this._level=level;
        this.initBee();
    }

    initBee(){
        let sp=this.beeAtlas.getSpriteFrame(this._level+"-1");
        this._bee.getComponent(cc.Sprite).spriteFrame=sp;
        this._bee.scale=4.0;
    }

    close(){
        this.node.destroy();
        let celebrate=cc.instantiate(this.celebrate);
        celebrate.parent=cc.find("Canvas");
        let skeleton=celebrate.getChildByName("animation").getComponent(sp.Skeleton);
        skeleton.setCompleteListener(()=>{
            celebrate.destroy();
        });
    }

}