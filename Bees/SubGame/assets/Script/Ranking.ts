import RankingCell from "./RankingCell";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Ranking extends cc.Component {

    @property(cc.Node)
    ndContent: cc.Node = null;
    @property(cc.Prefab)
    pfCell: cc.Prefab = null;

    loadRanking(data,index) {
        if(index*7>=data.length){return;}
        this.ndContent.removeAllChildren();
        let startIndex=index*7;
        let endIndex=(index*7+7)>data.length?data.length:(index*7+7);
        for (let i = startIndex; i <endIndex; i++) {
            let off_y=i%7>=3?-35:0;
            let cell = cc.instantiate(this.pfCell);
            this.ndContent.addChild(cell);
            cell.x=2;
            cell.y=672+(i%7)*(-132)+off_y;
            let info = data[i];
            let comp = cell.getComponent(RankingCell);
            comp.setData(i, info);
        }
    }

    clear() {
        this.ndContent.removeAllChildren();
    }

    onLoad() {
    }

    start() {

    }

    // update (dt) {}
}
