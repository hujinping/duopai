/**
 * 通用工具类
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Util {

    //根据图片路径设置sprite的spriteFrame
    static loadImg(spr, imgUrl) {
        cc.loader.load({
            url: imgUrl,
            type: 'png'
        }, (err, texture) => {
            spr.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    /**
     * 返回当前节点下第一个名为name的子节点
     * @param name 节点名
     * @param node 开始查找的根节点
     */
    static findChildByName(name: string, node: cc.Node): cc.Node {
        if (!name || !node || !node.children) {
            return null;
        }
        let result = node.getChildByName(name);
        if (result) {
            return result;
        }
        let children = node.children;
        for (let index = 0; index < children.length; index++) {
            result = Util.findChildByName(name, children[index]);
            if (result) {
                return result;
            }
        }
        return null;
    }

    /**
     * 设置节点文本
     * 
     * @param text 文本
     * @param node 节点
     */
    static setString(node: cc.Node | cc.Label | cc.EditBox, text: string | number) {
        if (typeof text === "number") {
            text = text + "";
        }
        text = text || "";
        if (node instanceof cc.Node) {
            let label = node.getComponent(cc.Label);
            if (cc.isValid(label)) {
                label.string = text;
                return;
            }
            let editBox = node.getComponent(cc.EditBox);
            if (cc.isValid(editBox)) {
                editBox.string = text;
            }
        } else {
            if (cc.isValid(node)) {
                node.string = text
            }
        }
    }

    //裁剪字符串，超出指定长度之后显示...(每个中文字符长度为2）
    static cutstr(str, len) {
        let str_length = 0;
        let str_len = 0;
        let str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            let a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4 
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length > len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        // //如果给定字符串小于指定长度，则返回源字符串； 
        // if (str_length < len) {
        //     return str;
        // }
        return str;
    }

    //获取年月日,格式为:2017-05-06
    static getCurrTimeYYMMDD() {
        var time: string = "";
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month;
        if ((myDate.getMonth() + 1) < 10) {
            month = "0" + (myDate.getMonth() + 1);
        } else {
            month = myDate.getMonth() + 1;
        }
        var day;
        if (myDate.getDate() < 10) {
            day = "0" + myDate.getDate();
        } else {
            day = myDate.getDate();
        }

        time = year + "-" + month + "-" + day;
        return time;
    }


    //数值格式化
    static formatNumber(number:number){
        if(number>1000000000000000000000000){
            return (number/1000000000000000000000000).toFixed(1)+"dd"
        }else if(number>1000000000000000000000){
            return (number/1000000000000000000000).toFixed(1)+"cc"
        }else if(number>1000000000000000000){
            return (number/1000000000000000000).toFixed(1)+"bb"
        }else if(number>1000000000000000){
            return (number/1000000000000000).toFixed(1)+"aa"
        }else if(number>1000000000000){
            return (number/1000000000000).toFixed(1)+"T"
        }else if(number>1000000000){//十亿
            return (number/1000000000).toFixed(1)+"B"
        }else if(number>1000000){//百万
            return (number/1000000).toFixed(1)+"M"
        }else if(number>1000){//千
            return (number/1000).toFixed(1)+"K"
        }
        return number;
    }
}
    
