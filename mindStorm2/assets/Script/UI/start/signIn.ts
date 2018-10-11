import HttpCtr from "../../Controller/HttpCtr";
import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _btn_close=null;
    _btn_get=null;
    _days=[];

    onLoad(){
        this.initNode();
        HttpCtr.getLoginAwardList(this.initRedPackages.bind(this));
    }

    initNode(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._btn_get=this.node.getChildByName("btn_get");
        for(let i =1;i<8;i++){
            let day=this.node.getChildByName("day_0"+i);
            this._days.push(day);
        }

        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_get);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/btnCick");
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
                GameCtr.getInstance().getStart().setMaskVisit(false);
            }else if(e.target.getName()=="btn_get"){
                HttpCtr.sign(this.doGetAward.bind(this))
            }
        })
    }

    initRedPackages(data){
        console.log("log--------initRedPackages--->data=:",data);
        for(let i=0;i<7;i++){
            let day=this.node.getChildByName("day_0"+(i+1));
            let icon_get=day.getChildByName("icon_get");
            if(i<data.todaySum){
                icon_get.active=true;
            }else{
                icon_get.active=false;
            }
        }
    }


    doGetAward(day){
        let icon_get=this._days[day-1].getChildByName("icon_get");
        icon_get.active=true;
        icon_get.scale=1.5;
        icon_get.runAction(cc.scaleTo(0.5,1.0));
    }
}
