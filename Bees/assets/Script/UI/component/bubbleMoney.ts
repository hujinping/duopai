import Util from "../../Common/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad(){
        this.doAction();
        this.node.active=true;
    }

    setMoney(money){
        this.node.getComponent(cc.Label).string="+￥"+Util.formatNumber(money);
    }

    doAction(){
        this.node.runAction(
            cc.sequence(
                cc.moveBy(0.3,cc.p(0,80)),
                cc.delayTime(0.2),
                cc.fadeOut(0.1),
                cc.delayTime(0.5),
                cc.fadeIn(0.0),
                cc.moveBy(0,cc.p(0,-80)),
                cc.callFunc(()=>{
                    this.node.destroy();
                })
        )) 
    }



}
