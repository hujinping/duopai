// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(Number)
    honey:Number=0;

    @property(Boolean)
    isTransfering:Boolean=false;
    @property(cc.Node)
    jar_full:cc.Node=null;

    @property(cc.Node)
    jar_notFull:cc.Node=null;




    setFull(){
        this.jar_full.active=true;
        this.jar_notFull.active=false;
    }

    setNotFull(){
        this.jar_full.active=false;
        this.jar_notFull.active=true;
    }
}
