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
        this.fly();
    }

    initBeeFrame(){
        let spr1=this.beeAtlas.getSpriteFrame(this._level+"-1");
        let spr2=this.beeAtlas.getSpriteFrame(this._level+"-2");
        this._stage1.getComponent(cc.Sprite).spriteFrame=spr1;
        this._stage2.getComponent(cc.Sprite).spriteFrame=spr2;
    }

    fly(){
        this.node.runAction(cc.repeatForever(
            cc.sequence(
                cc.delayTime(0.2),
                cc.callFunc(()=>{
                    this._stage1.active=true;
                    this._stage2.active=false;
                }),
                cc.delayTime(0.2),
                cc.callFunc(()=>{
                    this._stage1.active=false;
                    this._stage2.active=true;
                })
            )
        ))
    }

    playHoneyEft(){
        this._honey.active=true;
        this._honey.x=this.jobPos.x;
        this._honey.y=this.jobPos.y;
        this._honey.getComponent("eft_honey").play();
    }

    updateHoneyValue(){
        this._combsUnlock=GameCtr.getInstance().getCombsUnlock();

        GameCtr.honeyValue+=GameCtr.combConfig[this._level-1].initialIncome+
                             (this._combsUnlock[this._level-1])*GameCtr.combConfig[this._level-1].incomeMatrix;
        GameCtr.getInstance().getManufacture().setHoneyValue();
        //console.log("log--------------GameCtr.honeyValue=:",GameCtr.honeyValue);
    }


    // update(dt){
    //     this._interval+=dt;

    //     if(this._interval>=0.1){
    //         //console.log("log------------bee word---------")
    //         if(this._step==1){//飞向工作区
    //             this.node.x-=1000/(this._speed*60/GameCtr.globalSpeedRate)*6;
    //             if(Math.floor(this.node.x-this.jobPos.x)<5){
    //                 GameCtr.getInstance().emitEvent("bubbleHoney"+this._level,{comblevel:this._level});
    //                 this.playHoneyEft();
    //                 this.updateHoneyValue();
    //                 this.node.x=this.jobPos.x;
    //                 this.node.rotation+=180
    //                 this._step++;
    //             }
    //         }
    //         if(this._step==2){//采蜜 阶段1
    //             if(this.node.rotation<-45){
    //                 this.node.rotation+=45/(60/GameCtr.globalSpeedRate*(1-GameCtr.combConfig[GameCtr.comblevel-1].speedMatrix));
    //             }else{
    //                 this.node.rotation+=135/(60/GameCtr.globalSpeedRate*(1-GameCtr.combConfig[GameCtr.comblevel-1].speedMatrix));
    //             }
    //             if(Math.abs(this.node.rotation-90)<20){
    //                 this._step++;
    //             }
    //         }
    //         if(this._step==3){//飞回采蜜区
    //             this.node.x+=1000/(this._speed*60/GameCtr.globalSpeedRate)*6;
    //             if(Math.abs(this.node.x-this.jobPos.x-1000)<=1000/(this._speed*60/GameCtr.globalSpeedRate)*6){
    //                 this.node.rotation=-90;
    //                 this.node.x=this.jobPos.x+1000;
    //                 this._step=1;
    //             }
    //         }
    //         this._interval=0;
    //     }
    // }

}
