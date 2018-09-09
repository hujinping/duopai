import AudioManager from "../../Common/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _btn_get=null;
    _lb_title=null;
    _lb_count=null;


    onLoad(){
        this.initNode();
    }

    initNode(){
        this._btn_get=this.node.getChildByName("btn_get");
        this._lb_title=this.node.getChildByName("lb_title");
        this._lb_count=this.node.getChildByName("lb_count");

        this.initBtnEvent(this._btn_get);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/btn_click");
        })
    }

    setTitle(title){
        this._lb_title.getComponent(cc.Label).string=title;
    }

    setCount(count){
        this._lb_count.getComponent(cc.Label).string=count;
    }
}
