const { ccclass, property } = cc._decorator;
enum Message_Type {
    Get_SelfData,                       //获取自己信息
    Get_FriendData,                     //获取好友排行榜数据
    Get_GroupData,                      //获取群排名
    Submit_SelfScore,                   //提交自己得分
    Compare_Score,                      //比较自己与好友得分
    Show_WholeRanking,                  //显示完整排行榜   
    Show_OverRanking,                   //显示结束排行榜
    Close_WholeRanking,                 //关闭好友排行
    Close_OverRanking,                  //关闭结束排行
};

@ccclass
export default class CanvasCtr extends cc.Component {

    private mFriendRankData=null;

    rankNode=null;

    onLoad(){
        this.handleWxMessage();
        this.rankNode=this.node.getChildByName("totalRank");
    }

    handleWxMessage(){
        if (window.wx != undefined) {
            window.wx.onMessage(data => {
                if (data.messageType == Message_Type.Get_FriendData) {              //获取好友排行榜数据
                    this.getFriendData(data.LIST_KEY);
                } else if (data.messageType == Message_Type.Get_GroupData) {        //获取群排名
                    //this.getGroupData(data.LIST_KEY, data.shareTicket)
                } else if (data.messageType == Message_Type.Submit_SelfScore) {     //提交得分
                    this.submitScore(data.score, data.LIST_KEY);
                } else if (data.messageType == Message_Type.Compare_Score) {        //比较自己与好友得分
                    //this.compareWithScore(data.score);
                } else if (data.messageType == Message_Type.Show_WholeRanking) {     //显示完整排行榜
                    this.showFriendRanking();
                } else if (data.messageType == Message_Type.Show_OverRanking) {      //显示结束排行榜
                    //this.showOverRanking();
                } else if (data.messageType == Message_Type.Get_SelfData) {          //获取自己信息
                    //this.getSelfData();
                } else if (data.messageType == Message_Type.Close_WholeRanking) {    //关闭完整排行
                    //this.closeFriendRanking();
                } else if (data.messageType = Message_Type.Close_OverRanking) {      //关闭结束排行
                    //this.closeOverRanking();
                }
            });
        }
    }


    getFriendData(LIST_KEY){
        console.log("获取好友排行榜数据！！！！！！！！！！！！！");
        if (window.wx != undefined) {
            window.wx.getFriendCloudStorage({
                keyList: [LIST_KEY],
                success: (res) => {
                    console.log("获取好友排行榜数据成功");
                    let data = res.data;
                    data.sort((a, b) => {
                        if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                            return 0;
                        }
                        if (a.KVDataList.length == 0) {
                            return 1;
                        }
                        if (b.KVDataList.length == 0) {
                            return -1;
                        }
                        return b.KVDataList[0].value - a.KVDataList[0].value;
                    });
                    this.mFriendRankData = data;
                    this.rankNode.getComponent("Rank").initFriendRankData(data);
                    console.log("log------好友榜数据 data=:",this.mFriendRankData);
                },
                fail: res => {
                    console.log("获取好友排行榜数据失败");
                },
            });
        }
    }


    submitScore(score, LIST_KEY){
        console.log('提交分数')
        if (window.wx != undefined) {
            window.wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: [LIST_KEY],
                success: (getres) => {
                    console.log('提交分数成功', getres)
                    if (getres.KVDataList.length != 0) {
                        if (getres.KVDataList[0].value > score) {
                            return;
                        }
                    }
                    // 对用户托管数据进行写数据操作
                    window.wx.setUserCloudStorage({
                        KVDataList: [{
                            key: LIST_KEY,
                            value: "" + score
                        }],
                        success: (res) => {
                            console.log('setUserCloudStorage', 'success', res)
                        },
                        fail: function (res) {
                            console.log('setUserCloudStorage', 'fail')
                        },
                        complete: function (res) {
                            console.log('setUserCloudStorage', 'ok')
                        }
                    });
                },
                fail: function (res) {
                    console.log('提交分数失败', 'fail')
                },
                complete: (res) => {
                    console.log('提交分数完成', 'ok')
                    this.getFriendData("Rank_Data");
                }
            });
        }else {
            cc.log("提交得分:" + LIST_KEY + " : " + score)
        }
    }


    showFriendRanking() {
        console.log("log---------------子域showFriendRanking");
        this.rankNode.getComponent("Rank").initRanks();
    }





   
}
