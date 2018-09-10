/**
 * 游戏URL配置
 * 根据自己的项目配置正确的地址
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class UrlConfig {
    static rootUrl = "https://fengshui.2-00.cn/api_game_mifeng";              //接口域名地址根目录
    static LOGIN = "/publicapi.php?method=getuid";                            //用户登录-公共
    static SET_USER_DATA = "/publicapi.php?method=setUserData";               //授权上传资料-公共
    static DISPOSE_USER="publicapi.php?method=disposeUser";                   //截屏封号—公共
    static GET_USERINFO = "/publicapi.php?method=getUserInfo";                //查询用户资料-公共
    static GET_SETTING="/weixinapi.php?method=getsetting";                    //获取配置
    static SETTLEMENT="/weixinapi.php?method=settlement";                     //游戏结算
    static REVIVE="/weixinapi.php?method=revive";                             //用金币复活
    static GAME_OVER_SHARE_SWITCH="/weixinapi.php?method=GameOverShareSwitch";//
    static GET_GOLD = "/weixinapi.php?method=getGoldByShare";                 //分享/看视频获得金币
    static GET_SHARE = "/weixinapi.php?method=getShare";                      //获取分享内容
    static SHARE_SWITCH="/weixinapi.php?method=shareSwitch";                  //分享开关
    static FRIEND_SWITCH="/weixinapi.php?method=friendSwitch";                //朋友开关
    static ADD_FRIEND = "/weixinapi.php?method=addFriend";                    //添加朋友
    static SHARE_FRIEND_RESULT="/weixinapi.php?method=friendResult";          //获取分享的朋友结果
    static RECEIVE_PRIZE="/weixinapi.php?method=receivePrize";                //满足分享朋友条件之后的领取奖励
    static GET_RANDOM_USER="/weixinapi.php?method=getRandomUser";             //随机获取用户信息
    static GET_ALL_SLIDES="/weixinapi.php?method=getAllSlides";               //获取所有广告位置信息
    static REVIVECONFIG="/weixinapi.php?method=reviveConfig";                 //复活配置
    static CHANEL_RECORD="/weixinapi.php?method=addChannelRecord";            //渠道统计
    static ADConfig = "/weixinapi.php?method=getAdv";                         //获取广告id
    static VideoOpen = "/weixinapi.php?method=openAdv";                       //打开广告
    static GET_WORLD_LIST="/weixinapi.php?method=getWorldList";               //世界排名
    static SET_GOLD_DATA="/weixinapi.php?method=setData";                     //数据上报存储
    static GET_PROFIT="/weixinapi.php?method=getprofit";                      //下线后重新登录收益
    static SET_FORMID="/weixinapi.php?method=setformId";                      //提交formid
    static INVITED_BY_FRIEND = "/weixinapi.php?method=addSeek";               //邀请朋友
    static SEEK_LOG="/weixinapi.php?method=SeekLog";                          //获取邀请的朋友结果
    static SHARE_GROUP = "/weixinapi.php?method=shareGroup";                  //分享到群
    static GET_RANK_LIST="/weixinapi.php?method=getRankList";                 //获取排行榜
    static MONEY_TOTICES="/weixinapi.php?method=moneynotices";                //金币操作通知
    static GET_TODAY="/weixinapi.php?method=getToday";                        //获取签到列表
    static DO_TODAY="/weixinapi.php?method=doToday";                          //签到奖励领取
}
