const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _state_on=null;
    _state_off=null;
    _lb_title=null;

    onLoad(){
        this.initNode()
    }

    initNode(){
        this._state_on=this.node.getChildByName("state_on");
        this._state_off=this.node.getChildByName("state_off");
        this._lb_title=this.node.getChildByName("titleFrame").getChildByName("title");

        this._state_on.active=false;
        this._state_off.active=false;
    }

    setTitle(title){
        this._lb_title.getComponent(cc.Label).string=title;
    }

    setState(state){
        if(state=="on"){
            this._state_on.active=true;
            this._state_off.active=false;
        }else if(state=="off"){
            this._state_on.active=false;
            this._state_off.active=true;
        }
    }
}
