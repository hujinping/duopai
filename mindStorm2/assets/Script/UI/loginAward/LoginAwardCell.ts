import HttpCtr from "../../Controller/HttpCtr";
import Util from "../../Common/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginAwardCell extends cc.Component {

    @property(cc.Node)
    ndSigned: cc.Node = null;
    @property(cc.Label)
    lbNum: cc.Label = null;
    @property(cc.Sprite)
    sprGiftIcon: cc.Sprite = null;
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    setData(data) {
        this.lbNum.string = data.gold_amount+"";
        this.ndSigned.active = data.isSign;
    }
    // update (dt) {}
}
