
const { ccclass, property } = cc._decorator;

@ccclass
export default class RankingCell extends cc.Component {

    @property(cc.Sprite)
    sprBg: cc.Sprite = null;
    @property(cc.Sprite)
    sprMedal: cc.Sprite = null;
    @property(cc.Sprite)
    sprHead: cc.Sprite = null;
    @property(cc.Label)
    lbRank: cc.Label = null;
    @property(cc.Label)
    lbName: cc.Label = null;
    @property(cc.Label)
    lbScore: cc.Label = null;
    @property(cc.Label)
    lbGrade: cc.Label = null;
    @property(cc.Label)
    lbtitle: cc.Label = null;
    @property([cc.SpriteFrame])
    medalFrames: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    bgFrames: cc.SpriteFrame[] = [];

    private gradeList = ["王\n者", "宗\n师", "大\n师", "进\n阶", "入\n门", "渣\n渣"];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    setData(rank, data, boolSetBg) {
        this.createImage(data.avatarUrl);
        this.lbName.string = this.cutstr(data.nickname, 10);
        this.setMedal(rank);
        if (boolSetBg) {
            this.setBg(rank);
        }
        if (!data.KVDataList) {
            return;
        }
        let score = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.lbScore.string = score;
    }

    setOverData(rank, data) {
        if (!data.KVDataList) {
            return;
        }
        this.createImage(data.avatarUrl);
        this.lbName.string = this.cutstr(data.nickname, 10);
        this.setMedal(rank);

        let idx = rank % 2;
        if (idx == 0) this.sprBg.spriteFrame = this.bgFrames[idx];
        else this.sprBg.spriteFrame = null;

        let score = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.lbScore.string = score;

        return this.setLbGrade(score);
    }

    setSelfOverData(data) {
        if (!data.KVDataList) {
            return;
        }
        this.createImage(data.avatarUrl);
        this.lbName.string = this.cutstr(data.nickname, 10);
        let score = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.setLbGrade(score);
    }

    setLbGrade(score) {
        let lb = this.lbGrade.getComponent(cc.Label);
        if (score < 2000) {
            lb.string = this.gradeList[5];
            return 5;
        } else if (score >= 2000 && score < 10000) {
            lb.string = this.gradeList[4];
            return 4;
        } else if (score >= 10000 && score < 30000) {
            lb.string = this.gradeList[3];
            return 3;
        } else if (score >= 30000 && score < 50000) {
            lb.string = this.gradeList[2];
            return 2;
        } else if (score >= 50000 && score < 80000) {
            lb.string = this.gradeList[1];
            return 1;
        } else if (score >= 100000) {
            lb.string = this.gradeList[0];
            return 0;
        }
    }

    setTitle(string) {
        this.sprBg.node.active = false;
        this.lbtitle.getComponent(cc.Label).string = string;
    }

    setBg(idx) {
        idx = 0;
        this.sprBg.spriteFrame = this.bgFrames[idx];
    }

    setMedal(idx) {
        if (idx < 3) {
            this.sprMedal.node.active = true;
            this.sprMedal.spriteFrame = this.medalFrames[idx];
            this.lbRank.node.active = false;
        } else {
            this.lbRank.node.active = true;
            this.lbRank.string = idx + 1;
            this.sprMedal.node.active = false;
        }
    }

    createImage(avatarUrl) {
        if (window.wx != undefined) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.sprHead.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                        this.sprHead.node.active = false;
                    }
                };
                image.src = avatarUrl;
            } catch (e) {
                cc.log(e);
                this.sprHead.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl,
                type: 'jpg'
            }, (err, texture) => {
                this.sprHead.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }

    //裁剪字符串，超出指定长度之后显示...(每个中文字符长度为2）
    cutstr(str, len) {
        let str_length = 0;
        let str_len = 0;
        let str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            let a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4 
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length > len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        // //如果给定字符串小于指定长度，则返回源字符串； 
        // if (str_length < len) {
        //     return str;
        // }
        return str;
    }

    // start () {

    // }

    // update (dt) {}
}
