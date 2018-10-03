import GameCtr from "../../Controller/GameCtr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _aniNode=null;
    _ani=null;
    _gold=null;
    _honey=null;

    onLoad(){

        this._aniNode=this.node.getChildByName("eft");
        this._gold=this.node.getChildByName("gold");
        this._honey=this.node.getChildByName("honey")
    
        this._aniNode.active=false;
        this._gold.active=false;
        this._honey.active=false;
        this._gold.scale=0.5;

        this._ani=this._aniNode.getComponent(cc.Animation);
        this._ani.on("finished",this.onFinish.bind(this));
    }

    play(){
        //this._honey.active=true;
        this.bubbleGold();
        this._aniNode.active=true;
        this._ani.play();
    }
    
    
    onFinish(){
        this._aniNode.active=false;
    }

    bubbleGold(){
        this._gold.active=true;
        this._gold.runAction(cc.sequence(
            cc.moveBy(0.7,cc.p(0,70)),
            cc.delayTime(0.3),
            cc.callFunc(function(){
                this._gold.active=false;
                this._gold.y-=70;
            }.bind(this))
        ))
    }
}
