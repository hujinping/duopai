var Message_Type = {
    Get_SelfData: 0,                       //获取自己信息
    Get_FriendData: 1,                     //获取好友排行榜数据
    Get_GroupData: 2,                      //获取群排名
    Submit_SelfScore: 3,                   //提交自己得分
    Compare_Score: 4,                      //比较自己与好友得分
    Show_WholeRanking: 5,                  //显示完整排行榜   
    Show_OverRanking: 6,                   //显示结束排行榜
    Close_WholeRanking: 7,                 //关闭好友排行
    Close_OverRanking: 8,                  //关闭结束排行
};

class SubRanking {
    listen() {
        wx.onMessage(data => {
            console.log("收到主域消息");
            if (data.messageType == Message_Type.Get_FriendData) {              //获取好友排行榜数据
                this.getFriendData(data.SCORE_KEY, data.LOCATION_KEY);
            } else if (data.messageType == Message_Type.Get_GroupData) {        //获取群排名
                this.getGroupData(data.SCORE_KEY, data.shareTicket)
            } else if (data.messageType == Message_Type.Submit_SelfScore) {     //提交得分
                this.submitScore(data.score, data.SCORE_KEY, data.location, data.LOCATION_KEY);
            } else if (data.messageType == Message_Type.Show_WholeRanking) {     //显示完整排行榜
                
            } else if (data.messageType == Message_Type.Get_SelfData) {          //获取自己信息
                this.getSelfData();
            } else if (data.messageType == Message_Type.Close_WholeRanking) {    //关闭完整排行
                
            }
        });
    }

    getSelfData() {
        console.log("获取自己信息！！！！！！！！！！！！！");
        wx.getUserInfo({
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

    getFriendData(SCORE_KEY, LOCATION_KEY, showFriend = false) {
        console.log("获取好友排行榜数据！！！！！！！！！！！！！");
        wx.getFriendCloudStorage({
            keyList: [SCORE_KEY, LOCATION_KEY],
            success: (res) => {
                console.log("获取好友排行榜数据成功", res);
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
                let openContext = wx.getSharedCanvas().getContext("2d");
                openContext["canvas"]["friendData"] = JSON.stringify(data);
                
            },
            fail: res => {
                console.log("获取好友排行榜数据失败");
            },
        });
    }

    getGroupData(SCORE_KEY, shareTicket) {
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: (userRes) => {
                wx.getGroupCloudStorage({
                    shareTicket: shareTicket,
                    keyList: [SCORE_KEY],
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
                    },
                    fail: res => {
                        console.log("wx.getFriendCloudStorage fail", res);
                    },
                });
            }
        });
    }

    submitScore(score, SCORE_KEY, location, LOCATION_KEY) {
        console.log('提交分数')
        wx.getUserCloudStorage({
            // 以key/value形式存储
            keyList: [SCORE_KEY, LOCATION_KEY],
            success: (getres) => {
                console.log('提交分数成功', getres)
                if (getres.KVDataList.length != 0) {
                    if (getres.KVDataList[0].value > score) {
                        return;
                    }
                }
                // 对用户托管数据进行写数据操作
               wx.setUserCloudStorage({
                    KVDataList: [
                        {
                            key: SCORE_KEY,
                            value: "" + score
                        },
                        {
                            key: LOCATION_KEY,
                            value: location
                        }
                    ],
                    success: (res) => {
                        console.log('setUserCloudStorage', 'success', res)
                    },
                });
            },
            fail: function (res) {
                console.log('提交分数失败', 'fail')
            },
            complete: (res) => {
                console.log('提交分数完成', 'ok')
            }
        });
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
}

const rankList = new SubRanking();
rankList.listen();