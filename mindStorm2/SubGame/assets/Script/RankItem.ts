
const { ccclass, property } = cc._decorator;
@ccclass
export default class RankingCell extends cc.Component {

    @property(cc.Label)
    lb_rank:cc.Label=null;

    @property(cc.Label)
    lb_name:cc.Label=null;

    @property(cc.Label)
    lb_chickenCount:cc.Label=null;


    @property(cc.Sprite)
    headImg:cc.Sprite=null;

    setRank(_rank){
        this.lb_rank.string=_rank;
    }

    setName(_name){
        this.lb_name.string=_name;
    }

    setChickenCount(_chickenCount){
        this.lb_chickenCount.string=_chickenCount;
    }

    setHeadImg(avatarUrl) {
        if (window.wx != undefined) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.headImg.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                        this.headImg.node.active = false;
                    }
                };
                image.src = avatarUrl;
            } catch (e) {
                cc.log(e);
                this.headImg.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl,
                type: 'jpg'
            }, (err, texture) => {
                this.headImg.spriteFrame = new cc.SpriteFrame(texture);
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
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length > len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        return str;
    }

    // start () {

    // }

    // update (dt) {}
}
