
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _lb_msg=null;
    onLoad(){
        this._lb_msg=this.node.getChildByName("lb_msg");
    }

    show(msg){
        this._lb_msg.getComponent(cc.Label).string=msg;
    }

}
