//排行榜单条数据信息

import GameCtr from "../../Controller/GameCtr";
import Util from "../../Common/Util";

const {ccclass, property} = cc._decorator;

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
    @property([cc.SpriteFrame])
    medalFrames: cc.SpriteFrame[] = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    setData(rank, data) {
        // this.setBgColor(rank);
        this.setMedal(rank);
        this.createImage(data.Icon);
        this.lbName.string = Util.cutstr(data.nick, 10);
        this.lbScore.string = data.value +"";
    }

    setMedal(idx) {
        if(idx < 3) {
            this.sprMedal.node.active = true;
            this.sprMedal.spriteFrame = this.medalFrames[idx];
            this.lbRank.node.active = true;
            this.lbRank.string = idx+1;
            
        }else{
            this.lbRank.node.active = true;
            this.lbRank.string = idx+1;
            this.sprMedal.node.active = false;
        }
    }

    //根据index设置背景色
    setBgColor(idx) {
        idx = idx % 2;
        this.sprBg.node.color = (idx == 0) ? cc.hexToColor("#1966EE") : cc.hexToColor("#5990F1");
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



    // start () {

    // }

    // update (dt) {}
}
