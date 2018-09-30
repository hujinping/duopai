
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    private lb_name=null;
    private lb_city=null;
    private lb_rank=null;
    private lb_chickenCount=null;
    private headImg=null;

    onLoad(){
        this.initNode();
    }

    initNode(){
        this.lb_name=this.node.getChildByName("lb_name");
        this.lb_city=this.node.getChildByName("lb_city");
        this.lb_rank=this.node.getChildByName("lb_rank");
        this.lb_chickenCount=this.node.getChildByName("lb_chickenCount");
        this.headImg=this.node.getChildByName("mask").getChildByName("headImg");
    }

    setName(name:string){
        this.lb_name.getComponent(cc.Label).string=name;
    }

    setCity(city:string){
        this.lb_city.getComponent(cc.Label).string=city;
    }

    setRank(rank:Number){
        this.lb_rank.getComponent(cc.Label).string=rank;
    }

    setChickenCount(chickenCount:number){
        this.lb_chickenCount.getComponent(cc.Label).string=chickenCount;
    }

    setHeadImg(headUrl:string){
        if(headUrl==undefined||headUrl==""){return;}
        
        let sp=this.headImg.getComponent(cc.Sprite);
        cc.loader.load({
            url: headUrl,
            type: 'png'
        }, (err, texture) => {
            sp.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    start () {

    }
}
