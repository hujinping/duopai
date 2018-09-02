import Ranking from "./Ranking";
import RankingCell from "./RankingCell";


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

    @property(cc.Node)
    ndFriend: cc.Node = null;
    @property(Ranking)
    scrRanking: Ranking = null;
    @property(cc.Node)
    ndSelf: cc.Node = null;

    @property(cc.Node)
    ndOverRanking: cc.Node = null;
    @property(Ranking)
    EndScrRanking: Ranking = null;
    @property(cc.Node)
    ndOverSelf: cc.Node = null;

    private mCanvas: cc.Canvas;
    private mFriendRankData;
    private mGroupData;
    private mSelfData = null;
    private mSelfRank = null;

    onLoad() {
        this.handleWxMessage();
    }

    handleWxMessage() {
        if (window.wx != undefined) {
            window.wx.onMessage(data => {
                if (data.messageType == Message_Type.Get_FriendData) {              //获取好友排行榜数据
                    this.getFriendData(data.LIST_KEY);
                } else if (data.messageType == Message_Type.Get_GroupData) {        //获取群排名
                    this.getGroupData(data.LIST_KEY, data.shareTicket)
                } else if (data.messageType == Message_Type.Submit_SelfScore) {     //提交得分
                    this.submitScore(data.score, data.LIST_KEY);
                } else if (data.messageType == Message_Type.Compare_Score) {        //比较自己与好友得分
                    this.compareWithScore(data.score);
                } else if (data.messageType == Message_Type.Show_WholeRanking) {     //显示完整排行榜
                    this.showFriendRanking();
                } else if (data.messageType == Message_Type.Show_OverRanking) {      //显示结束排行榜
                    this.showOverRanking();
                } else if (data.messageType == Message_Type.Get_SelfData) {          //获取自己信息
                    this.getSelfData();
                } else if (data.messageType == Message_Type.Close_WholeRanking) {    //关闭完整排行
                    this.closeFriendRanking();
                } else if (data.messageType = Message_Type.Close_OverRanking) {      //关闭结束排行
                    this.closeOverRanking();
                }
            });
        } else {

        }
    }

    onDestroy() {

    }

    getSelfData() {
        console.log("获取自己信息！！！！！！！！！！！！！");
        if (window.wx != undefined) {
            window.wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    console.log("获取自己信息成功！！！！！！！！！！！！！", userRes);
                    let userData = userRes.data[0];
                    this.mSelfData = userData;
                },
                fail: (res) => {
                    console.log("获取自己信息失败！！！！！！！！！！！！！");
                }
            });
        }
    }

    getFriendData(LIST_KEY, showOver = false) {
        console.log("获取好友排行榜数据！！！！！！！！！！！！！");
        if (window.wx != undefined) {
            window.wx.getFriendCloudStorage({
                keyList: [LIST_KEY],
                success: (res) => {
                    console.log("获取好友排行榜数据成功");
                    console.log("wx.getFriendCloudStorage success", res);
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
                    this.mSelfRank = this.getSelfRank();
                    if (showOver) {
                        this.showOverRanking();
                    } else {
                        this.getSelfRank();
                    }
                },
                fail: res => {
                    console.log("获取好友排行榜数据失败");
                },
            });
        }
    }

    getGroupData(LIST_KEY, shareTicket) {
        if (window.wx != undefined) {
            window.wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    window.wx.getGroupCloudStorage({
                        shareTicket: shareTicket,
                        keyList: [LIST_KEY],
                        success: (res) => {
                            console.log("wx.getGroupCloudStorage success", res);
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
                            this.mGroupData = data;
                            this.showGroupRanking();
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                        },
                    });
                }
            });
        }
    }

    submitScore(score, LIST_KEY) {
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
                    this.getFriendData("Rank_Data", true);
                }
            });
        } else {
            cc.log("提交得分:" + LIST_KEY + " : " + score)
        }
    }

    compareWithScore(selfScore) {

    }

    showFriendRanking() {
        this.ndOverRanking.active = false;
        this.EndScrRanking.node.active = false;
        this.ndFriend.active = true;
        this.scrRanking.node.active = true;
        console.log("显示好友排行榜", this.mFriendRankData);
        if (!this.mFriendRankData) {
            console.log("没有好友排行榜信息，请先获取好友排行榜信息");
            return;
        }
        this.scrRanking.loadRanking(this.mFriendRankData);

        console.log("显示自己信息：", this.mSelfData);
        if (!this.mSelfRank) {
            this.mSelfRank = this.getSelfRank();
        }
        let selfRanking = this.ndSelf.getComponent(RankingCell);
        selfRanking.setData(this.mSelfRank, this.mSelfData, false);
    }

    closeFriendRanking() {
        this.scrRanking.clear();
    }

    showOverRanking() {
        if (!this.mFriendRankData) {
            console.log("没有好友排行榜信息，请先获取好友排行榜信息");
            return;
        }
        console.log("this.mFriendRankData =========", this.mFriendRankData);
        this.ndOverRanking.active = true;
        this.EndScrRanking.node.active = true;
        this.ndFriend.active = false;
        this.scrRanking.node.active = false;

        let selfRanking = this.ndOverSelf.getComponent(RankingCell);
        selfRanking.setSelfOverData(this.mSelfData);

        this.EndScrRanking.loadOverRanking(this.mFriendRankData);
    }

    closeOverRanking() {
        this.EndScrRanking.clear();
    }

    getSelfRank() {
        let rank = 0;
        if (this.mSelfData) {
            for (let i = 0; i < this.mFriendRankData.length; i++) {
                let data = this.mFriendRankData[i];
                if (data.avatarUrl == this.mSelfData.avatarUrl) {
                    rank = i;
                    this.mSelfData = data;
                }
            }
        }
        return rank;
    }


    showGroupRanking() {
        if (!this.mGroupData) {
            console.log("没有群好友排行榜信息，请先获取");
            return;
        }
        console.log("this.mGroupData =========", this.mFriendRankData);
        this.closeOverRanking();
        this.EndScrRanking.loadOverRanking(this.mGroupData);
    }

    // start () {

    // }

    // update (dt) {}
}
