
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    private icon_role=null; 
    private icon_unlock=null;
    private lb_order=null;

    onLoad () {
        this.initNode();
    }

    initNode(){
        this.icon_role=this.node.getChildByName("icon_role");
        this.icon_unlock=this.node.getChildByName("icon_unlock");
        this.lb_order=this.node.getChildByName("lb_order");
        this.icon_unlock.active=false;
    }

    setIsUnlock(isUnlock:boolean){
        this.icon_unlock.active=isUnlock;
    }

    setOrder(order:Number){
        this.lb_order.getComponent(cc.Label).string=order;
    }
}
