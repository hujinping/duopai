import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _mask=null;
    _btn_close=null;

    @property(cc.Prefab)
    ad:cc.Prefab=null;

    onLoad(){
        this._mask=this.node.getChildByName("mask");
        this._btn_close=this.node.getChildByName("btn_close");

        this.initBtnEvent(this._mask);
        this.initBtnEvent(this._btn_close);

        this.initAds();
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            this.node.destroy();
            AudioManager.getInstance().playSound("audio/btnClose");
        })
    }

    initAds(){
        for(let i=0;i<GameCtr.setting.nav.nav.length;i++){
            let ad=cc.instantiate(this.ad);
            ad.parent=this.node;
            ad.x=i%4*190-285;
            ad.y=Math.floor(i/4)*(-230)+300;
            ad.getComponent("ad").init(GameCtr.setting.nav.nav[i]);
        }
    }

}
