

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    setHead(headUrl:string){
        let headImg=this.node.getChildByName("mask").getChildByName("headImg");
        let sp=headImg.getComponent(cc.Sprite);
        this.loadImg(sp,headUrl);
    }

    loadImg(sp:cc.Sprite,headUrl:string){
        if(headUrl==undefined||headUrl==""){return;}
        
        cc.loader.load({
            url: headUrl,
            type: 'png'
        }, (err, texture) => {
            sp.spriteFrame = new cc.SpriteFrame(texture);
        });
    }
}
