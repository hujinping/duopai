import GameCtr from "../../Controller/GameCtr";
import AudioManager from "../../Common/AudioManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _level=null;
    _unlockNum=null;
    _lb_level=null;
    _btn_upgrade=null;
    _word_unlock=null;
    _word_levelUp=null;
    _word_levelFull=null;
    _combsUnlock=null;
    _totalComb=null;
    _beeNode=null;
    _canUnlock=false;
    _speedUpTime=-1;
    _combPosArr=[];
    _interval=0;
    _speed=1
    _unlock=false;
    _hadRandom=false;
    _isWorking=true;

    @property(cc.Prefab)
    bee:cc.Prefab=null;

    // @property(cc.Prefab)
    // flyBee:cc.Prefab=null;

    @property(cc.Prefab)
    unlockcomb:cc.Prefab=null;
    
    @property(cc.Prefab)
    combUpgrade:cc.Prefab=null;

    @property(cc.Prefab)
    bubbleHoney:cc.Prefab=null;

    @property(cc.Prefab)
    unlockCombTip:cc.Prefab=null;

    @property(cc.Prefab)
    flyBees:cc.Prefab[]=[];

    onLoad(){
        this.initData();
        this.initNode();
        
        this._combsUnlock=JSON.parse(GameCtr.getInstance().getCombsUnlock());
    }

    initData(){
        for(let i=0;i<10;i++){
            for(let j=0;j<3;j++){
                if(j%2==0){
                    this._combPosArr.push(cc.p(-358+75*i,19-60*j));
                }else{
                    this._combPosArr.push(cc.p(-397+75*i,19-60*j));
                } 
            }
        }
    }

    initNode(){
        this._beeNode=this.node.getChildByName("beeNode");
        this._lb_level=this.node.getChildByName("lb_level");
        this._totalComb=this.node.getChildByName("totalComb");
        this._btn_upgrade=this.node.getChildByName("btn_upgrade");
        this._word_unlock=this._btn_upgrade.getChildByName("word_unlock");
        this._word_levelUp=this._btn_upgrade.getChildByName("word_LeveUP");
        this._word_levelFull=this._btn_upgrade.getChildByName("word_levelFull");
        this.showUnlockBtn(false);
        this._beeNode.setLocalZOrder(2);
    }

    initEvent(){
        GameCtr.getInstance().addListener("moneyUpdate"+this._level,this.onMoneyUpdate.bind(this));
    }

    setLevel(level,unlockNum,unlock){
        this._level=level;
        this._unlock=unlock;
        this._unlockNum=unlockNum;
        this._lb_level.getComponent(cc.Label).string=level+'';

        for(let i=0;i<unlockNum;i++){
            this.unlockComb(i)
            this.createBee(i);
        }
        this.updateBtnState();
        this.initEvent();
    }

    setCanUnlock(canUnlock){
        this._canUnlock=canUnlock;
    }
    
    initBtn(){
        this.initBtnEvent(this._btn_upgrade);
        this.initBtnEvent(this._totalComb);
    }

    initBtnEvent(btn){
        btn.on(cc.Node.EventType.TOUCH_END,(e)=>{
            if(e.target.getName()=="btn_upgrade"){
                if(this._unlockNum==0 && !this._unlock){//解锁蜂巢
                    this.onUnlockComb();
                }else{//升级蜂巢
                    this.onUpgradeComb();
                    if(!GameCtr.getInstance().getGame().isGuideStepOver(2)){
                        GameCtr.getInstance().getGame().completeGuideStep(this.node,2);
                    }
                }
                AudioManager.getInstance().playSound("audio/open_panel");
            }else if(e.target.getName()=="totalComb"){
                this._speedUpTime=Date.now();
            }
        })
    }

    onUnlockComb(){
        if(cc.find("Canvas").getChildByName("unlockCombTip")){return;}
        let unlockCombTip=cc.instantiate(this.unlockCombTip);
        unlockCombTip.parent=cc.find("Canvas");
        unlockCombTip.y=-1218;
        unlockCombTip.runAction(cc.moveBy(0.4,cc.p(0,1218)).easing(cc.easeElasticOut(3.0)));
        unlockCombTip.getComponent("unlockCombTip").init(this._level);
        GameCtr.getInstance().getGame().setMaskVisit(true);
        this._unlock=true;
        GameCtr.combsUnlock.push({level:this._unlockNum,unlock:this._unlock});
        GameCtr.getInstance().setCombsUnlock();
    }

    onUpgradeComb(){
        if(cc.find("Canvas").getChildByName("combUpgrade")){return;}
        let combUpgrade=cc.instantiate(this.combUpgrade);
        combUpgrade.parent=cc.find("Canvas");
        combUpgrade.getComponent("combUpgrade").init(this._level,this._unlockNum);
        combUpgrade.y=-1218;
        combUpgrade.runAction(cc.moveBy(0.4,cc.p(0,1218)).easing(cc.easeElasticOut(3.0)));
        GameCtr.getInstance().getGame().setMaskVisit(true);
        GameCtr.getInstance().getGame().setCombUpgrade(combUpgrade);
    }

    upgrade(){
        console.log("log---------GameCtr.combsUnlock this._level=:",GameCtr.combsUnlock,this._level);
        this.unlockComb(this._unlockNum)
        this.createBee(this._unlockNum)
        GameCtr.money-=GameCtr.combConfig[this._level-1].levelUpCost+GameCtr.combConfig[this._level-1].upMatrix*(this._unlockNum-1)
        GameCtr.getInstance().getLevel().setMoney();
        this._unlockNum++;

        GameCtr.combsUnlock[this._level-1].level++;
        GameCtr.getInstance().setCombsUnlock();
        this.updateBtnState();
        this._combsUnlock=JSON.parse(GameCtr.getInstance().getCombsUnlock());
    }

    unlockComb(index){
        let comb=cc.instantiate(this.unlockcomb);
        comb.parent=this.node;
        comb.setLocalZOrder(0);
        comb.x=this._combPosArr[index].x;
        comb.y=this._combPosArr[index].y;
    }

    createBee(index){
        this.node.runAction(cc.sequence(
            cc.delayTime(Math.random()*3),
            cc.callFunc(()=>{
                let flyBee=cc.instantiate(this.flyBees[this._level-1]);
                flyBee.parent=this._beeNode;
                flyBee.tag=index;
                flyBee.setLocalZOrder(1);
                flyBee.x= this._combPosArr[index].x+292;
                flyBee.y= this._combPosArr[index].y+39;
                let sp_skeleton=flyBee.getComponent(sp.Skeleton);
                //sp_skeleton.timeScale=3;
                sp_skeleton.setEventListener((e)=>{
                    this.doBubbleHoney();
                })
            })
        ))
    }

    showFullFillBtn(){
        this._word_unlock.active=false;
        this._word_levelUp.active=false;
        this._word_levelFull.active=true;
        this._btn_upgrade.getComponent(cc.Button).interactable=false;
    }

    showUnlockBtn(isEffectable){
        this._btn_upgrade.active=isEffectable;
        this._word_unlock.active=true;
        this._word_levelUp.active=false;
        this._word_levelFull.active=false;
        this._btn_upgrade.getComponent(cc.Button).interactable=isEffectable;
    }

    doBubbleHoney(){
        let bubbleHoney=cc.instantiate(this.bubbleHoney);
        bubbleHoney.parent=this.node.parent;
        bubbleHoney.x=-500+(Math.random()-0.5)*60;
        bubbleHoney.y=this.node.y-50;
        bubbleHoney.runAction(cc.sequence(
            cc.moveTo(0.4*this._level,cc.p(bubbleHoney.x,0)),
            cc.callFunc(()=>{
                bubbleHoney.destroy();
                this.updateHoneyValue();
            })
        ))
    }

    isSpeedUp(){
        return this._speedUpTime>0;
    }

    updateHoneyValue(){
        GameCtr.honeyValue+=GameCtr.combConfig[this._level-1].initialIncome+
                             this._combsUnlock[this._level-1].level*GameCtr.combConfig[this._level-1].incomeMatrix;
        GameCtr.getInstance().getManufacture().setHoneyValue();
    }

    updateBtnState(){
        console.log("log-----updateBtnState   this._level=:",this._level);
        if(this._unlockNum==0 && !this._unlock){// 此蜂巢还未解锁
            // if(GameCtr.level>=GameCtr.combConfig[this._level-1].needLevel){//此蜂巢满足解锁条件
            //     this.showUnlockBtn(true);
            // }else{//此蜂巢不满足解锁条件
            //     this.showUnlockBtn(false);
            // }
        }else if(this._unlockNum<GameCtr.maxPerCombLevel){ //此蜂巢已经解锁,但未满级
            this._btn_upgrade.active=true;
            this._word_unlock.active=false;
            this._word_levelUp.active=true;
            if(GameCtr.money>=GameCtr.combConfig[this._level-1].levelUpCost+GameCtr.combConfig[this._level-1].upMatrix*(this._unlockNum-1)){
                this._btn_upgrade.getComponent(cc.Button).interactable=true;
                //新手引导2
                if(!this.node.getChildByTag(GameCtr.tipHandTag+2) &&! GameCtr.getInstance().getGame().isGuideStepOver(2)){
                    GameCtr.getInstance().getGame().showGuideStep2();
                }
            }else{
                this._btn_upgrade.getComponent(cc.Button).interactable=false;

                if(!GameCtr.getInstance().getGame().isGuideStepOver(2)){
                    GameCtr.getInstance().getGame().closeGuideStep(this.node,2);
                }
            }
        }else{//蜂巢满级
            this.showFullFillBtn();
        }
        
    }

    stopWork(){
        this._beeNode.removeAllChildren();
        this._isWorking=false;
    }

    startWork(){
        if(!this._isWorking){
            for (let i=0;i<this._unlockNum;i++){
                if(this._beeNode.getChildByTag(i)){return}
                this.createBee(i);
            }
            this._isWorking=true;
        }
    }


    onMoneyUpdate(){
        this.updateBtnState();
    }


    setSpeedRate(rate){
        for(let i=0;i<this._beeNode.children.length;i++){
            let sp_skeleton=this._beeNode.children[i].getComponent(sp.Skeleton);
            sp_skeleton.timeScale=rate;
        }
    }
}
