var debug = true,
    log = console.log;
var messageType = {
    Get_SelfData: 0, //获取自己信息
    Get_FriendData: 1, //获取好友排行榜数据
    Get_GroupData: 2, //获取群排名
    Submit_SelfScore: 3, //提交自己得分
    Compare_Score: 4, //比较自己与好友得分
    Show_WholeRanking: 5, //显示完整排行榜   
    Show_OverRanking: 6, //显示结束排行榜
    Close_WholeRanking: 7, //关闭好友排行
    Close_OverRanking: 8, //关闭结束排行
};

class View {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this._color = "#ffffff";
        this.zorder = 0;
        this.children = [];
        this.childMaxZorder = 0;
        this.render = null;
        this.parent = null;
        this.marginTop = 0;
        this.marginLeft = 0;
    }
    color(value) {
        this._color = value;
        return this;
    }
    size(width, height) {
        this.width = width;
        this.height = height;
        return this;
    }
    add(view) {
        view.parent = this;
        this.children.push(view);
        this.childMaxZorder++;
        view.zorder = this.childMaxZorder;
        return this;
    }
    addTo(container) {
        container.add(this);
        return this;
    }
    move(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    remove(view) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i] == view) {
                this.children.splice(i, 1);
            }
        }
        return this;
    }

    clearAll() {
        this.children.splice(0, this.children.length);
    }
    draw(ctx, x, y) {}
}

class Render extends View {
    constructor() {
        super();
        this.canvas = wx.getSharedCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.width = 1080;
        this.height = 1920;
    }
    startRender(parent) {
        if (!parent) {
            this.render = this;
            this.size(this.canvas.width, this.canvas.height);
            this.ctx.clearRect(this.x, this.y, this.width, this.height);
        }
        var parent = parent || this;
        var children = parent.children;
        children.sort(function(a, b) { return a.zorder - b.zorder; });
        for (var i = 0; i < children.length; i++) {
            var view = children[i];
            view.marginTop = parent.marginTop + view.y;
            view.marginLeft = parent.marginLeft + view.x;
            view.render = this.render;
            view.draw(this.ctx, view.marginLeft, view.marginTop);
            if (view.children.length > 0) {
                this.startRender(view);
            }
        }
    }
}

class Image extends View {
    constructor() {
        super();
        this.lineWidth = 1;
        this.imageUrl = null;
        this.imageData = null;
        this.isImageLoading = false;
        this.fillType = 0; // 0区域，1框, 2图片
    }
    fillRect(width, height) {
        this.fillType = 0;
        this.width = width;
        this.height = height;
        return this;
    }
    drawRect(width, height) {
        this.fillType = 1;
        this.width = width;
        this.height = height;
        return this;
    }
    image(url) {
        this.fillType = 2;
        this.imageUrl = url;
        return this;
    }
    draw(ctx, x, y) {
        ctx.fillStyle = this._color;
        if (this.fillType == 0) {
            ctx.fillRect(x, y, this.width, this.height);
        } else if (this.fillType == 1) {
            var h = this.height,
                w = this.width,
                lw = this.lineWidth;
            ctx.fillRect(x, y, w - lw, lw); // top
            ctx.fillRect(x + w - lw, y, lw, h); // right
            ctx.fillRect(x, y + h - lw, w, lw); // bottom
            ctx.fillRect(x, y, lw, h - lw); // left 
        } else if (this.fillType == 2) {
            if (!!this.imageData && !this.imageData.complete) return;
            if (!!this.imageData && this.imageData.complete) {
                ctx.drawImage(this.imageData, x, y, this.width, this.height);
            } else if (!this.imageData) {
                this.isImageLoading = true;
                this.imageData = wx.createImage();
                this.imageData.src = this.imageUrl;
                this.imageData.onload = () => {
                    this.isImageLoading = false;
                    if (!!this.render) this.render.startRender();
                };
            }
        }
    }
}

class Label extends View {
    constructor() {
        super();
        this._font = "Helvetica";
        this._fontSize = 20;
        this._textAlign = "center";
        this._baseLine = "middle";
        this._text = null;
    }
    fontSize(value) { this._fontSize = value; return this; }
    textAlign(value) { this._textAlign = value; return this; }
    baseLine(value) { this._baseLine = value; return this; }
    text(value) { this._text = value; return this; }
    font(value) { this._font = value; return this; }
    topleft() {
        this._textAlign = "left";
        this._baseLine = "top";
        return this;
    }
    draw(ctx, x, y) {
        if (!!this.text) {
            ctx.fillStyle = this._color;
            ctx.textAlign = this._textAlign;
            ctx.textBaseline = this._baseLine;
            ctx.font = `${this._fontSize}px ${this._font}`;
            ctx.fillText(this._text, x, y);
        }
    }
}

class RankListHandler {
    constructor() {
        this.render = new Render();
        this.selfInfo = null;
        this.inited = false;
        this.keys = {
            ScoreKey: "Rank_Data"
        };
        this.users = [];
        this.friends = [];
        this.viewData = null;

        this.friend([this.keys.ScoreKey]).then((res) => {
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

            this.friends = data;
        });

        this.info(["selfOpenId"]).then(data => {
            this.selfInfo = data[0];
            this.inited = true;
            //this.showMT(this.viewData);
        });
    }

    user(keylist) {
        return new Promise((solve, reject) => {
            wx.getUserCloudStorage({
                keyList: keylist,
                success: res => {
                    console.log("wx.getFriendCloudStorage success", res);
                    solve(res);
                },
                fail: res => {
                    console.log("wx.getFriendCloudStorage fail", res);
                    reject(res);
                },
            });
        });
    }

    //取出所有好友数据 关卡得分
    friend(keylist) {
        return new Promise((solve, reject) => {
            wx.getFriendCloudStorage({
                keyList: keylist,
                success: res => {
                    console.log("wx.getFriendCloudStorage success", res);
                    solve(res);
                },
                fail: res => {
                    console.log("wx.getFriendCloudStorage fail", res);
                    reject(res);
                },
            });
        });
    }

    info(idlist) {
        return new Promise((solve, reject) => {
            wx.getUserInfo({
                openIdList: idlist,
                lang: 'zh_CN',
                success: res => {
                    console.log("wx.getUserInfo success", res);
                    var data = res.data;
                    for (var i = 0; i < data.length; i++) {
                        var info = data[i];
                        for (var j = this.users.length - 1; j >= 0; j--) {
                            if (this.users[j].openId == info.openId) {
                                this.users.splice(j, 1);
                                break;
                            }
                        }
                        this.users.push(info);
                    }
                    solve(res.data);
                },
                fail: res => {
                    console.log("wx.getUserInfo fail", res);
                    reject(res);
                },
            });
        });
    }

    getValue(item) {
        var valist = item.KVDataList;
        if (valist && valist.length == 0) {
            valist.push({ key: "Rank_Data", value: 0 })
        }
        return valist[0].value;
    }




    showHead() {
        console.log("log-------------showHead---------");
        var width = this.sharedCanvas.width,
            height = this.sharedCanvas.height;

        // 底框 
        var picBg = new Image().color("#ffffff").move(10, 10).fillRect(80, 80).addTo(this.render);
        new Image().image(this.selfInfo.avatarUrl).move(5, 5).size(70, 70).addTo(picBg);
        new Label().text(this.selfInfo.nickName).color("#F1C100").topleft().move(110, 20).fontSize(30).addTo(this.render);
        var sex = this.selfInfo.gender == 1 ? "帅哥" : "美女";
        new Label().text(`欢迎您，${sex}`).topleft().move(110, 60).fontSize(24).addTo(this.render);
        this.render.startRender();
    }

    getSelfInfo() {
        for (var i = 0; i < this.friends.length; i++) {
            var info = this.friends[i];
            if (info.avatarUrl == this.selfInfo.avatarUrl) {
                return info;
            }
        }
        return null;
    }

    setScore(data) {
        var info = this.getSelfInfo();
        if (!!info) {
            for (var i = 0; i < data.data.length; i++) {
                var item = data.data[i],
                    exists = false;
                for (var i = 0; i < info.KVDataList.length; i++) {
                    if (info.KVDataList[i].key == item.key) {
                        if (parseInt(info.KVDataList[i].value) < parseInt(item.value)) {
                            info.KVDataList[i].value = item.value;
                        }
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    info.KVDataList.push({ key: item.key, value: parseInt(item.value) });
                }
            }
            for (var i = 0; i < info.KVDataList.length; i++) {
                var item = info.KVDataList[i];

            }
        } else {
            info = {};
            info.avatarUrl = this.selfInfo.avatarUrl;
            info.nickname = this.selfInfo.nickName;
            info.openid = this.selfInfo.openId;
            info.KVDataList = [];
            for (var i = 0; i < data.data.length; i++) {
                var item = data.data[i];
                info.KVDataList.push({ key: item.key, value: item.value });
            }
            this.friends.push(info);
        }
    }

    start() {
        this.sharedCanvas = wx.getSharedCanvas();
        this.sharedCtx = this.sharedCanvas.getContext('2d');

        wx.onMessage(data => {
            log("log--------------子域接收到主域消息data=:", data);
            if (data && data.messageType != undefined) {
                this.doMessage(data);
            }
        });
    }

    doMessage(data) {
        if (!data) return;
        switch (data.messageType) {
            case messageType.Show_WholeRanking:
                this.showRank(data.pageIndex);
                break;
            case messageType.Submit_SelfScore:
                this.submitScore(data.score, data.LIST_KEY);
                break;
        }
    }


    showRank(index = 0) {
        console.log("log--------子域显示排行--index=:", index);
        if (index * 7 >= this.friends.length) { return; }
        this.render.clearAll();
        var startIndex = index * 7;
        var endIndex = (index * 7 + 7) > this.friends.length ? this.friends.length : (index * 7 + 7);
        for (var i = startIndex; i < endIndex; i++) {
            let off_y = i % 7 >= 3 ? 35 : 0;
            var picBg = new Image().color("#ffffff").move(200, 535 + 130 * (i % 7) + off_y).fillRect(100, 100).addTo(this.render);
            new Image().image(this.friends[i].avatarUrl).move(5, 5).size(90, 90).addTo(picBg);
            new Label().text(this.friends[i].nickname).color("#8B5A11").move(500, 585 + 130 * (i % 7) + off_y).fontSize(40).addTo(this.render);
            var score = this.friends[i].KVDataList.length >= 1 ? this.friends[i].KVDataList[0].value : 0;
            new Label().text(this.formatNumber(score)).color("#00ff00").move(800, 585 + 130 * (i % 7) + off_y).fontSize(50).addTo(this.render);
            new Label().text(i + 1).color("#8B5A11").move(150, 585 + 130 * (i % 7) + off_y).fontSize(50).addTo(this.render);
        }
        this.render.startRender();
    }


    submitScore(score, LIST_KEY) {
        console.log('子域提交分数提交分数');
        if (window.wx != undefined) {
            window.wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: [LIST_KEY],
                success: (getres) => {
                    console.log('提交分数成功--------------', getres)
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
                        fail: function(res) {
                            console.log('setUserCloudStorage', 'fail')
                        },
                        complete: function(res) {
                            console.log('setUserCloudStorage', 'ok')
                        }
                    });
                },
                fail: function(res) {
                    console.log('提交分数失败', 'fail')
                },
                complete: (res) => {
                    console.log('提交分数完成', 'ok')
                    this.friend([this.keys.ScoreKey]).then((res) => {
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

                        this.friends = data;
                    });
                }
            });
        } else {
            cc.log("提交得分:" + LIST_KEY + " : " + score)
        }
    }



    formatNumber(number) {
        if (number > Math.pow(10, 33)) {
            return (number / Math.pow(10, 33)).toFixed(1) + "gg"
        }
        if (number > Math.pow(10, 30)) {
            return (number / Math.pow(10, 30)).toFixed(1) + "ff"
        } else if (number > Math.pow(10, 27)) {
            return (number / Math.pow(10, 27)).toFixed(1) + "ee"
        } else if (number > Math.pow(10, 24)) {
            return (number / Math.pow(10, 24)).toFixed(1) + "dd"
        } else if (number > Math.pow(10, 21)) {
            return (number / Math.pow(10, 21)).toFixed(1) + "cc"
        } else if (number > Math.pow(10, 18)) {
            return (number / Math.pow(10, 18)).toFixed(1) + "bb"
        } else if (number > Math.pow(10, 15)) {
            return (number / Math.pow(10, 15)).toFixed(1) + "aa"
        } else if (number > Math.pow(10, 12)) {
            return (number / Math.pow(10, 12)).toFixed(1) + "T"
        } else if (number > Math.pow(10, 9)) { //十亿
            return (number / Math.pow(10, 9)).toFixed(1) + "B"
        } else if (number > Math.pow(10, 6)) { //百万
            return (number / Math.pow(10, 6)).toFixed(1) + "M"
        } else if (number > Math.pow(10, 3)) { //千
            return (number / Math.pow(10, 3)).toFixed(1) + "K"
        }
        return number;
    }

}
new RankListHandler().start();;