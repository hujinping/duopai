import GameCtr from "../../Controller/GameCtr";
import Start from "./Start";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Prefab)
    loadingPrefab:cc.Prefab;
    @property(cc.Prefab)
    startPrefab:cc.Prefab;

    private loadingNode=null;
    private startNode=null;

    onLoad(){
        
        
        this.initNode();
        this.initEvent();
    }

    initNode(){
        this.initLoadingNode();
        this.initStartNode();
    }

    initLoadingNode(){
        this.loadingNode=cc.instantiate(this.loadingPrefab);
        this.loadingNode.parent=this.node;
    }

    initStartNode(){
        this.startNode=cc.instantiate(this.startPrefab);
        this.startNode.parent=this.node;
        this.startNode.y=-GameCtr.IPONEX_HEIGHT;
    }

    initEvent(){
        GameCtr.getInstance().addListener("loadComplete",this.onLoadComplete.bind(this))
    }

    onLoadComplete(){
        //console.log("log--------------------------onLoadComplete------------------");
        this.loadingNode.runAction(cc.moveBy(1.0,cc.p(0,GameCtr.IPONEX_HEIGHT)));
        this.startNode.runAction(cc.sequence(
            cc.moveBy(1.0,cc.p(0,GameCtr.IPONEX_HEIGHT)),
            cc.callFunc(function(){
                GameCtr.getInstance().emitEvent("showStartFullly",null);
            })
        ));
    }
}
