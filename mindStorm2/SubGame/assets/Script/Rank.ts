const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    private rankContent =null;
    private friendsData=[];
    @property(cc.Prefab)
    rankItem:cc.Prefab=null;

    @property(cc.Prefab)
    head:cc.Prefab=null;
    onLoad(){
        this.initNode();
        this.adaptScreen();
    }

    initNode(){
        let rankNode=this.node.getChildByName("worldRankNode").getChildByName("rankNode");
        this.rankContent=rankNode.getChildByName("scrollView").getChildByName("view").getChildByName("content");
    }

    adaptScreen(){
        let visibleSize=cc.director.getVisibleSize();
        let rankNode=this.node.getChildByName("worldRankNode").getChildByName("rankNode");
        rankNode.y=visibleSize.height/2-600;
    }

    initRanks(){
        this.initNormalRanks();
    }


    initFriendRankData(rankData){
        this.friendsData=rankData;
    }


    initNormalRanks(){
        console.log("log----------this.friendData=:",this.friendsData);
        this.rankContent.setContentSize(cc.size(1080,200*this.friendsData.length+400));
        for(let i =0;i<this.friendsData.length;i++){
            let rankItem=cc.instantiate(this.rankItem)
            rankItem.parent=this.rankContent;
            rankItem.y=-200*Number(i)-100;
            rankItem.getComponent("RankItem").setRank(i+1);
            rankItem.getComponent("RankItem").setName(this.friendsData[i].nickname);
            rankItem.getComponent("RankItem").setChickenCount(this.friendsData[i].KVDataList[0].value);
            rankItem.getComponent("RankItem").setHeadImg(this.friendsData[i].avatarUrl);
        }
    }
}
