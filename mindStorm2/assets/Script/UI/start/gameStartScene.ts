import GameCtr from "../../Controller/GameCtr";
import Start from "./Start";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    startPrefab:cc.Prefab;

    private loadingNode=null;
    private startNode=null;

    onLoad(){
        this.initNode();
    }
    initNode(){
        this.initStartNode();
    }

    initStartNode(){
        this.startNode=cc.instantiate(this.startPrefab);
        this.startNode.parent=cc.find("Canvas");
    }

}
