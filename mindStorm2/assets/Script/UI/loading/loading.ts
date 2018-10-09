import GameCtr from "../../Controller/GameCtr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    private btn_go=null;
    private loadProgress=null;
    private loadProgressIcon=null;
  
    onLoad(){
        this.initNode();
        this.adaptScreen();
    }

    initNode(){
        let root=this.node;
        this.btn_go=root.getChildByName("btn_go");
        this.loadProgress=root.getChildByName("loadProgress");
        this.loadProgressIcon=this.loadProgress.getChildByName("icon");
        this.loadProgress.getComponent(cc.ProgressBar).progress=0;
    }


    adaptScreen(){
        var widget=this.loadProgress.getComponent(cc.Widget);
        widget.target=cc.find("Canvas");
        widget.isAlignLeft=true;
        widget.isAlignRight=true;
        widget.left=67;
        widget.right=83;
    }
}
