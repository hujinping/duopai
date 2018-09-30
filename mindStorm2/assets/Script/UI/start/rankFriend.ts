import Util from "../../Common/Util";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    imagenode: cc.Node = null;

    @property(cc.Label)
    lb_chickenCount:cc.Label = null;

    setChickenCount(chickenCount){
        this.lb_chickenCount.string=chickenCount;
    }

    setHeadImg(url){
        let sp=this.imagenode.getComponent(cc.Sprite);
        Util.loadImg(sp,url)
    }

    
    // update (dt) {}
}
