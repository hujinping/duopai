/**
 * 游戏URL配置
 * 根据自己的项目配置正确的地址
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class UrlConfig {
    static rootUrl = "https://api.2-00.cn/api_game_chiji2";                   //接口域名地址根目录
    static LOGIN = "/publicapi.php?method=getuid";                           //用户登录-公共
    static SET_USER_DATA = "/publicapi.php?method=setUserData";              //授权上传资料-公共
    static DISPOSE_USER="publicapi.php?method=disposeUser";                  //截屏封号—公共
    static GET_USERINFO = "/publicapi.php?method=getUserInfo";               //查询用户资料-公共
    static GET_SETTING="/weixinapi.php?method=getsetting";                   //获取配置
    static GET_GOLD = "/weixinapi.php?method=getGoldByShare";                //分享/看视频获得金币
    static GET_SHARE = "/weixinapi.php?method=getShare";                     //获取分享内容
    static ADD_FRIEND = "/weixinapi.php?method=addFriend";                   //添加朋友
    static SHARE_FRIEND_RESULT="/weixinapi.php?method=friendResult";         //获取分享的朋友结果
    static RECEIVE_PRIZE="/weixinapi.php?method=receivePrize";                //满足分享朋友条件之后的领取奖励
    static GET_RANDOM_USER="/weixinapi.php?method=getRandomUser";             //随机获取用户信息
    static REVIVECONFIG="/weixinapi.php?method=reviveConfig";                 //复活配置
    static CHANEL_RECORD="/weixinapi.php?method=addChannelRecord";            //渠道统计
    static ADConfig = "/weixinapi.php?method=getAdv";                        //广告配置
    static VideoOpen = "/weixinapi.php?method=openAdv";                      //关闭视频广告时渠道统计
    static SET_GOLD_DATA="/weixinapi.php?method=setData";                     //金币上报存储
    static SET_FORMID="/weixinapi.php?method=setformId";                      //提交formid
    static INVITED_BY_FRIEND = "/weixinapi.php?method=addSeek";              //邀请朋友获得金币
    static SEEK_LOG="/weixinapi.php?method=SeekLog";                          //获取分享的朋友结果
    static SHARE_GROUP = "/weixinapi.php?method=shareGroup";                 //分享到群
    static GET_RANK_LIST="/weixinapi.php?method=getRankList";                 //获取排行榜
    static MONEY_TOTICES="/weixinapi.php?method=moneynotices";                //金币操作通知
    static GET_TODAY="/weixinapi.php?method=getToday";                        //获取签到列表
    static DO_TODAY="/weixinapi.php?method=doToday";                          //签到奖励领取
    static GAME_START="/weixinapi.php?method=GameStart";                      //游戏开始
    static GET_GAME_START="/weixinapi.php?method=getGameStart";               //开始游戏时获取匹配机器人
    static GET_TITLE="/weixinapi.php?method=getTitle";                        //获取题目
    static GAME_WIN="/weixinapi.php?method=GameWin";                          //获得第一吃鸡成功

}
