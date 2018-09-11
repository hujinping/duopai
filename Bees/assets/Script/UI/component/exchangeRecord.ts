const {ccclass, property} = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {

    _btn_close=null;
    _recordNodes=[];
    

    onLoad(){
        this._btn_close=this.node.getChildByName("btn_close");
        this._btn_close.on(cc.Node.EventType.TOUCH_END,(e)=>{
            this.node.destroy();
        })
        this.initRecordNode();
        this.showRecords(null);
    }

    initRecordNode(){
        let recordNode=this.node.getChildByName("recordNode");
        for(let i=0;i<5;i++){
            let user=recordNode.getChildByName("user"+(i+1));
            let time=recordNode.getChildByName("time"+(i+1));
            let phoneNumber=recordNode.getChildByName("phoneNumber"+(i+1));

            user.active=false;
            time.active=false;
            phoneNumber.active=false; 

            user.getComponent(cc.Label).string="";
            time.getComponent(cc.Label).string="";
            phoneNumber.getComponent(cc.Label).string="";
            this._recordNodes.push({_user:user,_time:time,_phoneNumber:phoneNumber});
        }
    }

    showRecords(recordList){
        recordList=[];
        recordList.push({user:"kankan",time:"2.02456464",phoneNumber:"1253649565"})
        for(let i =0;i<recordList.length;i++){
            this._recordNodes[i]._user.active=true;
            this._recordNodes[i]._time.active=true;
            this._recordNodes[i]._phoneNumber.active=true;
            this._recordNodes[i]._user.getComponent(cc.Label).string=recordList[i].user;
            this._recordNodes[i]._time.getComponent(cc.Label).string=recordList[i].time;
            this._recordNodes[i]._phoneNumber.getComponent(cc.Label).string=recordList[i].phoneNumber;
        }
    }
}
