import Util from "../../Common/Util";
import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _btn_upgrade=null;
    _btn_close=null;
    _lb_bonus=null;
    _word_levelFull=null;
    _interval=0;

    onLoad(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._btn_upgrade=this.node.getChildByName("btn_upgrade");
        this._lb_bonus=this._btn_upgrade.getChildByName("lb_bonus");
        this._word_levelFull=this._btn_upgrade.getChildByName("word_levelFull");
        this._lb_bonus.getComponent(cc.Label).string="Э"+Util.formatNumber(GameCtr.levelConfig[GameCtr.level-1].award);

        this.initBtn(this._btn_close);
        this.initBtn(this._btn_upgrade);
        this.showBtn();
    }

    initBtn(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_close"){
                AudioManager.getInstance().playSound("audio/btnClose");
               
            }else if(e.target.getName()=="btn_upgrade"){
                if(this._btn_upgrade.getComponent(cc.Button).interactable){
                    GameCtr.getInstance().getLevel().upgrade();
                    AudioManager.getInstance().playSound("audio/user_levelup");
                    this.showBtn();
                }   
            }

            this.node.destroy();
            GameCtr.getInstance().getGame().setMaskVisit(false);
        })
    }

    showBtn(){
        if(GameCtr.levelMoney<GameCtr.levelConfig[GameCtr.level-1].need){
            this._btn_upgrade.getComponent(cc.Button).interactable=false;
        }else{
            this._btn_upgrade.getComponent(cc.Button).interactable=true;
        }

        if(GameCtr.level>=GameCtr.maxPlayerLevel){
            this._btn_upgrade.getComponent(cc.Button).interactable=false;
            this._lb_bonus.active=false;
            this._word_levelFull.active=true;
        }
    }

    update(dt){
        if(this._btn_upgrade.getComponent(cc.Button).interactable){return}
        this._interval+=dt;
        if(this._interval>=0.5){
            this.showBtn();
            this._interval=0;
        }
    }

    start () {

    }
}
