import Util from "../../Common/Util";
import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad(){
        this.node.active=true;
    }

    setMoney(money){
        this.node.getComponent(cc.Label).string="+$"+Util.formatNumber(money);
    }

  



}
