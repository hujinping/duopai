import GameCtr from "../../Controller/GameCtr";
import HttpCtr from "../../Controller/HttpCtr";
import UserManager from "../../Common/UserManager";


    const {ccclass, property} = cc._decorator;
    @ccclass
    export default class NewClass extends cc.Component {
        _notices=[];
        _lb_notice=null;
        _bg=null;
        _isSelf=false;
        _nextTime=null;
        _interval=-1;
        onLoad(){
            this.initNode();
            this.requestNotices()
        }

        initNode(){
            this._bg=this.node.getChildByName("bg");
            this._lb_notice=this.node.getChildByName("mask").getChildByName("lb_notice");
        }

        setNotices(data){
            for(let i=0;i<data.length;i++){
                this._notices.push(data[i]);
            }
            console.log("log------自己获得红包----------this._notices=:",this._notices);
            this._interval=0;
            this._nextTime=this._notices[0].stime;
        }

        requestNotices(){
            HttpCtr.pushMsg(this.setNotices.bind(this));
        }



        showNotice(){
            if(!GameCtr.isAudited){return;}
            this._interval=-1;
            this._bg.active=true;
            this._lb_notice.x=390;
            this._lb_notice.getComponent(cc.Label).string=this._notices[0].title;
            this._notices.shift();
            this._lb_notice.stopAllActions();
            this._lb_notice.runAction(cc.sequence(
                cc.moveBy(10,cc.p(-1300,0)),
                cc.callFunc(()=>{
                    this._interval=0;
                    this._bg.active=false;
                    if(this._notices.length==0){
                        this.requestNotices();
                        this._nextTime=null;
                    }else{
                        this._nextTime=this._notices[0].stime;
                    }
                })
            ))
        }


        addNotice(money){
            if(money<=0){return }
            console.log("log------自己获得红包----------");
            this._isSelf=true;
            let delayTime= this._bg.active?10:1;
            let name =UserManager.user.nick?UserManager.user.nick:"恭喜你";
            this._notices.unshift({title:name+"获得了"+money/100+"红包",stime:delayTime});
        }


        update(dt){
            if(!GameCtr.isAudited){return};
            if(this._interval>=0 && this._nextTime){
                this._interval+=dt;
                if(this._interval>=this._nextTime){
                    this.showNotice();
                }
                if(this._isSelf && !this._bg.active){
                    this._interval=0;
                    this._nextTime=1;
                    this._isSelf=false;
                }
            } 
        }

}
