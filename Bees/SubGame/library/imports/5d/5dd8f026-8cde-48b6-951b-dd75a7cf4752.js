"use strict";
cc._RF.push(module, '5dd8fAmjN5ItpUb3XWnz0dS', 'CanvasCtr');
// Script/CanvasCtr.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Ranking_1 = require("./Ranking");
var RankingCell_1 = require("./RankingCell");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Message_Type;
(function (Message_Type) {
    Message_Type[Message_Type["Get_SelfData"] = 0] = "Get_SelfData";
    Message_Type[Message_Type["Get_FriendData"] = 1] = "Get_FriendData";
    Message_Type[Message_Type["Get_GroupData"] = 2] = "Get_GroupData";
    Message_Type[Message_Type["Submit_SelfScore"] = 3] = "Submit_SelfScore";
    Message_Type[Message_Type["Compare_Score"] = 4] = "Compare_Score";
    Message_Type[Message_Type["Show_WholeRanking"] = 5] = "Show_WholeRanking";
    Message_Type[Message_Type["Show_OverRanking"] = 6] = "Show_OverRanking";
    Message_Type[Message_Type["Close_WholeRanking"] = 7] = "Close_WholeRanking";
    Message_Type[Message_Type["Close_OverRanking"] = 8] = "Close_OverRanking";
})(Message_Type || (Message_Type = {}));
;
var CanvasCtr = /** @class */ (function (_super) {
    __extends(CanvasCtr, _super);
    function CanvasCtr() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ndFriend = null;
        _this.scrRanking = null;
        // @property(cc.Node)
        // ndSelf: cc.Node = null;
        _this.ndOverRanking = null;
        _this.overCells = [];
        _this.ndsurpass = null;
        _this.mSelfData = null;
        _this.mSelfRank = null;
        return _this;
    }
    CanvasCtr.prototype.onLoad = function () {
        this.handleWxMessage();
    };
    CanvasCtr.prototype.handleWxMessage = function () {
        var _this = this;
        if (window.wx != undefined) {
            window.wx.onMessage(function (data) {
                if (data.messageType == Message_Type.Get_FriendData) { //获取好友排行榜数据
                    _this.getFriendData(data.LIST_KEY);
                }
                else if (data.messageType == Message_Type.Get_GroupData) { //获取群排名
                    _this.getGroupData(data.LIST_KEY, data.shareTicket);
                }
                else if (data.messageType == Message_Type.Submit_SelfScore) { //提交得分
                    _this.submitScore(data.score, data.LIST_KEY);
                }
                else if (data.messageType == Message_Type.Compare_Score) { //比较自己与好友得分
                    _this.compareWithScore(data.score);
                }
                else if (data.messageType == Message_Type.Show_WholeRanking) { //显示完整排行榜
                    _this.showFriendRanking(data.pageIndex);
                }
                else if (data.messageType == Message_Type.Show_OverRanking) { //显示结束排行榜
                    _this.showOverRanking();
                }
                else if (data.messageType == Message_Type.Get_SelfData) { //获取自己信息
                    _this.getSelfData();
                }
                else if (data.messageType == Message_Type.Close_WholeRanking) { //关闭完整排行
                    _this.closeFriendRanking();
                }
                else if (data.messageType = Message_Type.Close_OverRanking) { //关闭结束排行
                    _this.closeOverRanking();
                }
            });
        }
        else {
        }
    };
    CanvasCtr.prototype.onDestroy = function () {
    };
    CanvasCtr.prototype.getSelfData = function () {
        var _this = this;
        console.log("获取自己信息！！！！！！！！！！！！！");
        if (window.wx != undefined) {
            window.wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: function (userRes) {
                    console.log("获取自己信息成功！！！！！！！！！！！！！", userRes);
                    var userData = userRes.data[0];
                    _this.mSelfData = userData;
                },
                fail: function (res) {
                    console.log("获取自己信息失败！！！！！！！！！！！！！");
                }
            });
        }
    };
    CanvasCtr.prototype.getFriendData = function (LIST_KEY, showOver) {
        var _this = this;
        if (showOver === void 0) { showOver = false; }
        console.log("获取好友排行榜数据！！！！！！！！！！！！！");
        if (window.wx != undefined) {
            window.wx.getFriendCloudStorage({
                keyList: [LIST_KEY],
                success: function (res) {
                    console.log("获取好友排行榜数据成功");
                    console.log("wx.getFriendCloudStorage success", res);
                    var data = res.data;
                    data.sort(function (a, b) {
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
                    _this.mFriendRankData = data;
                    _this.getSelfRank();
                    if (showOver) {
                        //this.showOverRanking();
                    }
                },
                fail: function (res) {
                    console.log("获取好友排行榜数据失败");
                },
            });
        }
    };
    CanvasCtr.prototype.getGroupData = function (LIST_KEY, shareTicket) {
        var _this = this;
        if (window.wx != undefined) {
            window.wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: function (userRes) {
                    window.wx.getGroupCloudStorage({
                        shareTicket: shareTicket,
                        keyList: [LIST_KEY],
                        success: function (res) {
                            console.log("wx.getGroupCloudStorage success", res);
                            var data = res.data;
                            data.sort(function (a, b) {
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
                            _this.mGroupData = data;
                        },
                        fail: function (res) {
                            console.log("wx.getFriendCloudStorage fail", res);
                        },
                    });
                }
            });
        }
    };
    CanvasCtr.prototype.submitScore = function (score, LIST_KEY) {
        var _this = this;
        console.log('提交分数');
        if (window.wx != undefined) {
            window.wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: [LIST_KEY],
                success: function (getres) {
                    console.log('提交分数成功', getres);
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
                        success: function (res) {
                            console.log('setUserCloudStorage', 'success', res);
                        },
                        fail: function (res) {
                            console.log('setUserCloudStorage', 'fail');
                        },
                        complete: function (res) {
                            console.log('setUserCloudStorage', 'ok');
                        }
                    });
                },
                fail: function (res) {
                    console.log('提交分数失败', 'fail');
                },
                complete: function (res) {
                    console.log('提交分数完成', 'ok');
                    _this.getFriendData("Rank_Data", true);
                }
            });
        }
        else {
            cc.log("提交得分:" + LIST_KEY + " : " + score);
        }
    };
    CanvasCtr.prototype.compareWithScore = function (selfScore) {
        if (!this.mFriendRankData) {
            console.log("没有好友排行榜信息，请先获取好友排行榜信息");
            return;
        }
        console.log("this.mFriendRankData =========", this.mFriendRankData);
        console.log("this.mSelfRank ============", this.mSelfRank);
        for (var i = 0; i < this.mFriendRankData.length; i++) {
            var data = this.mFriendRankData[i];
            if (data.avatarUrl == this.mSelfData.avatarUrl) {
                data.KVDataList[0].value = selfScore;
            }
        }
        this.mFriendRankData.sort(function (a, b) {
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
        this.mSelfRank = this.getSelfRank();
        this.ndOverRanking.active = false;
        this.ndFriend.active = false;
        for (var i = 0; i < this.mFriendRankData.length; i++) {
            var data = this.mFriendRankData[i];
            if (i == this.mSelfRank - 1) {
                this.ndsurpass.active = true;
                this.createImage(data.avatarUrl, this.ndsurpass.getChildByName("image").getComponent(cc.Sprite));
                return;
            }
        }
    };
    CanvasCtr.prototype.CloseCompareWithScore = function () {
        this.ndsurpass.active = false;
    };
    CanvasCtr.prototype.createImage = function (avatarUrl, sprHead) {
        if (window.wx != undefined) {
            try {
                var image_1 = wx.createImage();
                image_1.onload = function () {
                    try {
                        var texture = new cc.Texture2D();
                        texture.initWithElement(image_1);
                        texture.handleLoadedTexture();
                        sprHead.spriteFrame = new cc.SpriteFrame(texture);
                    }
                    catch (e) {
                        cc.log(e);
                        sprHead.node.active = false;
                    }
                };
                image_1.src = avatarUrl;
            }
            catch (e) {
                cc.log(e);
                sprHead.node.active = false;
            }
        }
        else {
            cc.loader.load({
                url: avatarUrl,
                type: 'jpg'
            }, function (err, texture) {
                sprHead.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    };
    CanvasCtr.prototype.showFriendRanking = function (pageIndex) {
        this.CloseCompareWithScore();
        this.ndFriend.active = true;
        this.ndOverRanking.active = false;
        this.scrRanking.node.active = true;
        console.log("显示好友排行榜", this.mFriendRankData);
        if (!this.mFriendRankData) {
            console.log("没有好友排行榜信息，请先获取好友排行榜信息");
            return;
        }
        this.scrRanking.loadRanking(this.mFriendRankData, pageIndex);
    };
    CanvasCtr.prototype.closeFriendRanking = function () {
        this.scrRanking.clear();
        this.ndFriend.active = false;
        this.ndOverRanking.active = true;
        this.CloseCompareWithScore();
    };
    CanvasCtr.prototype.showOverRanking = function () {
        return;
        if (!this.mFriendRankData) {
            console.log("没有好友排行榜信息，请先获取好友排行榜信息");
            return;
        }
        if (!this.mSelfRank) {
            this.mSelfRank = this.getSelfRank();
        }
        console.log("this.mFriendRankData =========", this.mFriendRankData);
        console.log("this.mSelfRank ============", this.mSelfRank);
        this.ndFriend.active = false;
        this.ndOverRanking.active = true;
        this.CloseCompareWithScore();
        for (var i = 0; i < this.mFriendRankData.length; i++) {
            var rankingCell = null;
            var data = this.mFriendRankData[i];
            if (i == this.mSelfRank) {
                rankingCell = this.overCells[1];
            }
            else if (i == this.mSelfRank + 1) {
                rankingCell = this.overCells[2];
            }
            else if (i == this.mSelfRank - 1) {
                rankingCell = this.overCells[0];
            }
            if (rankingCell) {
                rankingCell.node.active = true;
                rankingCell.setData(i, data);
            }
        }
    };
    CanvasCtr.prototype.closeOverRanking = function () {
        this.ndOverRanking.active = false;
        this.CloseCompareWithScore();
    };
    CanvasCtr.prototype.getSelfRank = function () {
        var rank = 0;
        if (this.mSelfData) {
            for (var i = 0; i < this.mFriendRankData.length; i++) {
                var data = this.mFriendRankData[i];
                if (data.avatarUrl == this.mSelfData.avatarUrl) {
                    rank = i;
                    this.mSelfData = data;
                }
            }
        }
        return rank;
    };
    __decorate([
        property(cc.Node)
    ], CanvasCtr.prototype, "ndFriend", void 0);
    __decorate([
        property(Ranking_1.default)
    ], CanvasCtr.prototype, "scrRanking", void 0);
    __decorate([
        property(cc.Node)
    ], CanvasCtr.prototype, "ndOverRanking", void 0);
    __decorate([
        property([RankingCell_1.default])
    ], CanvasCtr.prototype, "overCells", void 0);
    __decorate([
        property(cc.Node)
    ], CanvasCtr.prototype, "ndsurpass", void 0);
    CanvasCtr = __decorate([
        ccclass
    ], CanvasCtr);
    return CanvasCtr;
}(cc.Component));
exports.default = CanvasCtr;

cc._RF.pop();