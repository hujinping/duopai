import HttpCtr from "../../Controller/HttpCtr";
import PopupView from "../view/PopupView";
import LoginAwardCell from "./LoginAwardCell";
import Util from "../../Common/Util";
import ViewManager from "../../Common/ViewManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginAward extends cc.Component {

    @property(cc.Node)
    ndContent: cc.Node = null; 

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.setAwardDatas();
    }

    setAwardDatas() {
        HttpCtr.getLoginAwardList((res)=>{
            let list = res.data.sign_days;
            for(let i=0; i<list.length; i++){
                let data = list[i];
                let cell = this.ndContent.children[i];
                let comp = cell.getComponent(LoginAwardCell);
                comp.setData(data);
            }
        });
    }



    close() {
        if (!this.node.parent) {
            return;
        }
        let popupView = this.node.parent.getComponent(PopupView);
        if (!!popupView) {
            popupView.dismiss();
        } else {
            this.node.destroy();
        }
    }

    

    // update (dt) {}
}
