import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _btn_close=null;
    _btn_sure=null;
    _btn_arrowLeft=null;
    _btn_arrowRight=null;
    _roleTag=18653;

    @property(cc.Prefab)
    roles:cc.Prefab[]=[];

    onLoad(){
        GameCtr.roleIndex=Number(localStorage.getItem("roleIndex"));
        this.initNode();
        this.initRole(GameCtr.roleIndex);

    }

    initNode(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._btn_sure=this.node.getChildByName("btn_sure");
        this._btn_arrowLeft=this.node.getChildByName("btn_arrowLeft");
        this._btn_arrowRight=this.node.getChildByName("btn_arrowRignt");

        this.initBtnEvent(this._btn_close);
        this.initBtnEvent(this._btn_sure);
        this.initBtnEvent(this._btn_arrowLeft);
        this.initBtnEvent(this._btn_arrowRight);
    }


    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            AudioManager.getInstance().playSound("audio/btnCick");
            if(e.target.getName()=="btn_close"){
                GameCtr.getInstance().getStart().setMaskVisit(false);
                this.node.destroy();
            }else if(e.target.getName()=="btn_sure"){
                localStorage.setItem("roleIndex",GameCtr.roleIndex+"");
                GameCtr.getInstance().getStart().initCurrentRole();
                GameCtr.getInstance().getStart().setMaskVisit(false);
                this.node.destroy();
            }else if(e.target.getName()=="btn_arrowLeft"){
                GameCtr.roleIndex--;
                if(GameCtr.roleIndex<0){
                    GameCtr.roleIndex=GameCtr.maxRoles-1;
                }
                this.initRole(GameCtr.roleIndex);
            }else if(e.target.getName()=="btn_arrowRignt"){
                GameCtr.roleIndex++
                if(GameCtr.roleIndex>=GameCtr.maxRoles){
                    GameCtr.roleIndex=0;
                }
                this.initRole(GameCtr.roleIndex);
            }
        })
    }

    initRole(index){
        while(this.node.getChildByTag(this._roleTag)){
            this.node.removeChildByTag(this._roleTag)
        }
        let role = cc.instantiate(this.roles[index]);
        role.parent=this.node;
        role.tag=this._roleTag;
        role.getComponent("role").setName("");
        role.y=-170;
    }


}
