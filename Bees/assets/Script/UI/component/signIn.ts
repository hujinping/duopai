import AudioManager from "../../Common/AudioManager";
import GameCtr from "../../Controller/GameCtr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    _btn_close=null;
    _btn_getRedPackage=null;

    @property(cc.Prefab)
    redPackage:cc.Prefab=null;

    @property(cc.Prefab)
    getRedPackage:cc.Prefab=null;

    onLoad(){
        this.initNode();
        this.initRedPackages();
    }

    initNode(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._btn_getRedPackage=this.node.getChildByName("btn_getRedPackage");
        
        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_getRedPackage);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                AudioManager.getInstance().playSound("audio/btnClose");
                GameCtr.getInstance().getGame().setMaskVisit(false);
                this.node.destroy();
            }else if(e.target.getName()=="btn_getRedPackage"){
                AudioManager.getInstance().playSound("audio/btn_click");
                this.getPackage();
            }else if(e.target.getName()=="redPackage"){
                //console.log("log-------点击红包------",e.target.tag);
                AudioManager.getInstance().playSound("audio/btn_click");
                this.getPackage();
            }
        })
    }

    initRedPackages(){
        for(let i=0;i<7;i++){
            let redPackage=cc.instantiate(this.redPackage);
            redPackage.parent=this.node;
            redPackage.x=-225+i%3*225;
            redPackage.y=250-Math.floor(i/3)*280;

            redPackage.tag=1000+i;
            redPackage.getComponent("redPackage").setTitle("第"+(i+1)+"天");
            if(i<2){
                redPackage.getComponent("redPackage").setState("on");
            }else{
                redPackage.getComponent("redPackage").setState("off");
                this.initBtnEvent(redPackage);
            }
            
        }
    }

    getPackage(){
        if(this.node.getChildByName("getRedPackage")){return}
        let getPackage=cc.instantiate(this.getRedPackage);
        getPackage.parent=this.node;
    }

    
}
