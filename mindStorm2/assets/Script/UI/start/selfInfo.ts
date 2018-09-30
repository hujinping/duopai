
import AudioManager from "../../Common/AudioManager";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    private lb_name=null;
    private lb_chickenCount=null;
    private lb_gameCount=null;
    private lb_id=null;

    onLoad(){
        this.initNode();
    }

    initNode(){
        this.lb_name=this.node.getChildByName("lb_name");
        this.lb_chickenCount=this.node.getChildByName("lb_chickenCount");
        this.lb_gameCount=this.node.getChildByName("lb_gameCount");
        this.lb_id=this.node.getChildByName("lb_id");

        let mask=this.node.getChildByName("mask");
        mask.on(cc.Node.EventType.TOUCH_END,function(e){
            AudioManager.getInstance().playSound("audio/btnCick");
            this.node.runAction(cc.sequence(
                cc.scaleTo(0.1,0.2),
                cc.callFunc(function(){
                    this.node.destroy();
                }.bind(this))
            ));
        }.bind(this))
    }

    setName(name:string){
        this.lb_name.getComponent(cc.Label).string=name;
    }

    setChickenCount(chickenCount:number){
        this.lb_chickenCount.getComponent(cc.Label).string=chickenCount;
    }

    setGameCount(gameCount:number){
        this.lb_gameCount.getComponent(cc.Label).string=gameCount;
    }

    setID(id:string){
        this.lb_id.getComponent(cc.Label).string=id;
    }
}
