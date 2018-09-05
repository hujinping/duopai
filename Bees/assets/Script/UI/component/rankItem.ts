
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _lb_name=null;
    _lb_city=null;
    _lb_rank=null;
    _lb_money=null;
    _headImg=null;

    onLoad(){
        this.initNode();
    }

    initNode(){
        this._lb_name=this.node.getChildByName("lb_name");
        this._lb_city=this.node.getChildByName("lb_city");
        this._lb_rank=this.node.getChildByName("lb_rank");
        this._lb_money=this.node.getChildByName("lb_money");
        this._headImg=this.node.getChildByName("mask").getChildByName("headImg");
    }

    setName(name:string){
        this._lb_name.getComponent(cc.Label).string=name;
    }

    setCity(city:string){
        this._lb_city.getComponent(cc.Label).string=city;
    }

    setRank(rank:Number){
        this._lb_rank.getComponent(cc.Label).string=rank;
    }

    setMoney(money:number){
        this._lb_money.getComponent(cc.Label).string=money;
    }

    setHeadImg(headUrl:string){
        if(headUrl==undefined||headUrl==""){return;}
        
        let sp=this._headImg.getComponent(cc.Sprite);
        cc.loader.load({
            url: headUrl,
            type: 'png'
        }, (err, texture) => {
            sp.spriteFrame = new cc.SpriteFrame(texture);
        });
    }
}
