import GameCtr from "../../Controller/GameCtr";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    _stage1=null;
    _stage2=null;
    _level=null;
    jobPos=null;
    _honey=null;
    _honeyEft=null;
    _combsUnlock=null;
    _speed=1;
    step=1;
    interval=0;


    @property(cc.SpriteAtlas)
    beeAtlas:cc.SpriteAtlas=null;

    @property(cc.Prefab)
    honeyEft:cc.Prefab=null;

    onLoad(){
        this._stage1=this.node.getChildByName("stage1");
        this._stage2=this.node.getChildByName("stage2");
        this._stage1.active=true;
        this._stage2.active=false;
        this.node.rotation=-90;

        this._honey=cc.instantiate(this.honeyEft);
        this._honey.parent=this.node.parent.parent;
        this._honey.active=false;

        this._speed=this.node.parent.parent.getComponent("honeycomb").isSpeedUp()?
        GameCtr.combConfig[GameCtr.comblevel-1].baseSpeed*(1-GameCtr.combConfig[GameCtr.comblevel-1].speedMatrix):
        GameCtr.combConfig[GameCtr.comblevel-1].baseSpeed;
    }

    init(level,jobPos){
        this._level=level;
        this.jobPos=jobPos;
        this.initBeeFrame();
        //this.fly();
    }

    initBeeFrame(){
        let spr1=this.beeAtlas.getSpriteFrame(this._level+"-1");
        let spr2=this.beeAtlas.getSpriteFrame(this._level+"-2");
        this._stage1.getComponent(cc.Sprite).spriteFrame=spr1;
        this._stage2.getComponent(cc.Sprite).spriteFrame=spr2;
    }

    fly(){
        this._stage1.active=!this._stage1.active;
        this._stage2.active=!this._stage2.active;
    }

    playHoneyEft(){
        this._honey.active=true;
        this._honey.x=this.jobPos.x;
        this._honey.y=this.jobPos.y;
        this._honey.getComponent("eft_honey").play();
    }

    randPos(){
        this.node.x-=Math.random()*2000;
    }

    updateHoneyValue(){
        this._combsUnlock=GameCtr.getInstance().getCombsUnlock();
        GameCtr.honeyValue+=GameCtr.combConfig[this._level-1].initialIncome+
                             this._combsUnlock[this._level-1].level*GameCtr.combConfig[this._level-1].incomeMatrix;
        GameCtr.getInstance().getManufacture().setHoneyValue();
    }
}
