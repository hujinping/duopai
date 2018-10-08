const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _btn_close=null;
    _btn_sure=null;
    _btn_arrowLeft=null;
    _btn_arrowRight=null;

    @property(cc.Prefab)
    roles:cc.Prefab[]=[];

    onLoad(){
        this.initNode();
        this.initRole();
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
            if(e.target.getName()=="btn_close"){
                this.node.destroy();
            }else if(e.target.getName()=="btn_sure"){

            }else if(e.target.getName()=="btn_arrowLeft"){

            }else if(e.target.getName()=="btn_arrowRignt"){

            }
        })
    }

    initRole(){
        let role = cc.instantiate(this.roles[2]);
        role.parent=this.node;
        role.getComponent("role").setName("");
        role.y=-170;

    }
}
