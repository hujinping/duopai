import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Prefab)
    celebrate:cc.Prefab=null;

    _btn_sure=null;
    _bee=null;
    _level=null;

    onLoad(){
        this._bee=this.node.getChildByName("bee");
        this._btn_sure=this.node.getChildByName("btn_sure");

        this._btn_sure.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/unlock_hive");
            GameCtr.getInstance().getGame().setMaskVisit(false);
            let comb=GameCtr.getInstance().getGame().getComb(this._level);
            let neetComb=GameCtr.getInstance().getGame().getComb(this._level+1);
            comb.getComponent("honeycomb").setUnlock(true);
            comb.getComponent("honeycomb").upgrade();
            if(neetComb){
                neetComb.getComponent("honeycomb").initBtnState();
            }
            this.node.destroy();
        })
    }

    init(level){
        this._level=level;
        this.initBee();
        this.showCelebrate();
    }

    initBee(){
        cc.loader.loadRes("textures/bees/00"+this._level, cc.SpriteFrame,  (err, spriteFrame)=> {
            this._bee.getComponent(cc.Sprite).spriteFrame=spriteFrame;
            this._bee.scale=4.0;
        });
    }

    showCelebrate(){
        let celebrate=cc.instantiate(this.celebrate);
        celebrate.parent=cc.find("Canvas");
        celebrate.scale=2;
        let skeleton=celebrate.getChildByName("animation").getComponent(sp.Skeleton);
        skeleton.setCompleteListener(()=>{
            celebrate.destroy();
        });
    }

}
