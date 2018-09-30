import AudioManager from '../../Common/AudioManager'
const {ccclass, property} = cc._decorator;
enum DieWay{
    CAVE,
    CACTI,
}
@ccclass
export default class NewClass extends cc.Component {
    private id=null;
    private lb_name=null;
    private headImg=null;
    private headFrame=null;

    onLoad(){
        this.lb_name=this.node.getChildByName("lb_name");
        this.headFrame=this.node.getChildByName("headFrame");
        this.headImg=this.node.getChildByName("mask").getChildByName("heading");
        this.headFrame.active=false;
    }

    setName(name:string){
        this.lb_name.getComponent(cc.Label).string=name;
    }

    setID(id:number){
        this.id=id;
    }

    getID(){
        return this.id;
    }

    setHeadImg(url){
        this.headFrame.active=true;
        let spr=this.headImg.getComponent(cc.Sprite);
        cc.loader.load({
            url: url,
            type: 'png'
        }, (err, texture) => {
            spr.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    die(dieWay,die=true){
        if(dieWay==DieWay.CAVE){
            this.node.runAction(cc.sequence(
                cc.delayTime(0.1*Math.floor(Math.random()*3)),
                cc.scaleTo(0.2,0),
                cc.callFunc(function(){
                    AudioManager.getInstance().playSound("audio/scream");
                    if(die){
                        this.node.destroy();
                    }else{
                        this.node.active=false;
                        this.node.scale=1;
                        this.node.rotation=0
                    }
                }.bind(this))
            ))
        }else{
            this.node.runAction(cc.sequence(
                cc.delayTime(0.1*Math.floor(Math.random()*3)),
                cc.spawn(
                    cc.moveBy(0.2,cc.p(Math.random()*500-250,Math.random()*200+800)),
                    cc.rotateBy(0.2,Math.random()*90-45),
                    cc.scaleTo(0.2,0.5*Math.floor(Math.random())+0.3),
                ),
                cc.callFunc(function(){
                    AudioManager.getInstance().playSound("audio/scream");
                    if(die){
                        this.node.destroy();
                    }else{
                        this.node.active=false;
                        this.node.scale=1;
                        this.node.rotation=0
                    }
                }.bind(this))
            ))
        }
    }

}
