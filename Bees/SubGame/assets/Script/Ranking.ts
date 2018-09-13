import RankingCell from "./RankingCell";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Ranking extends cc.Component {

    @property(cc.Node)
    ndContent: cc.Node = null;
    @property(cc.Prefab)
    pfCell: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    loadRanking(data) {
        for (let i = 0; i < data.length; i++) {
            let cell = cc.instantiate(this.pfCell);
            this.ndContent.addChild(cell);
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
