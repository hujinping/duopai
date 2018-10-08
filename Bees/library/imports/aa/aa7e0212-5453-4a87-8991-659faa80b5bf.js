"use strict";
cc._RF.push(module, 'aa7e0ISVFNKh4mRZZ+qgLW/', 'UrlConfig');
// Script/Common/UrlConfig.ts

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 游戏URL配置
 * 根据自己的项目配置正确的地址
 */
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var UrlConfig = /** @class */ (function () {
    function UrlConfig() {
    }
    UrlConfig.rootUrl = "https://fengshui.2-00.cn/api_game_mifeng"; //接口域名地址根目录
    UrlConfig.LOGIN = "/publicapi.php?method=getuid"; //用户登录-公共
    UrlConfig.SET_USER_DATA = "/publicapi.php?method=setUserData"; //授权上传资料-公共
    UrlConfig.DISPOSE_USER = "publicapi.php?method=disposeUser"; //截屏封号—公共
    UrlConfig.GET_USERINFO = "/publicapi.php?method=getUserInfo"; //查询用户资料-公共
    UrlConfig.GET_SETTING = "/weixinapi.php?method=getsetting"; //获取配置
    UrlConfig.SETTLEMENT = "/weixinapi.php?method=settlement"; //游戏结算
    UrlConfig.REVIVE = "/weixinapi.php?method=revive"; //用金币复活
    UrlConfig.GAME_OVER_SHARE_SWITCH = "/weixinapi.php?method=GameOverShareSwitch"; //
    UrlConfig.GET_GOLD = "/weixinapi.php?method=getGoldByShare"; //分享/看视频获得金币
    UrlConfig.GET_SHARE = "/weixinapi.php?method=getShare"; //获取分享内容
    UrlConfig.SHARE_SWITCH = "/weixinapi.php?method=shareSwitch"; //分享开关
    UrlConfig.FRIEND_SWITCH = "/weixinapi.php?method=friendSwitch"; //朋友开关
    UrlConfig.ADD_FRIEND = "/weixinapi.php?method=addFriend"; //添加朋友
    UrlConfig.SHARE_FRIEND_RESULT = "/weixinapi.php?method=friendResult"; //获取分享的朋友结果
    UrlConfig.RECEIVE_PRIZE = "/weixinapi.php?method=receivePrize"; //满足分享朋友条件之后的领取奖励
    UrlConfig.GET_RANDOM_USER = "/weixinapi.php?method=getRandomUser"; //随机获取用户信息
    UrlConfig.GET_ALL_SLIDES = "/weixinapi.php?method=getAllSlides"; //获取所有广告位置信息
    UrlConfig.REVIVECONFIG = "/weixinapi.php?method=reviveConfig"; //复活配置
    UrlConfig.CHANEL_RECORD = "/weixinapi.php?method=addChannelRecord"; //渠道统计
    UrlConfig.ADConfig = "/weixinapi.php?method=getAdv"; //获取广告id
    UrlConfig.VideoOpen = "/weixinapi.php?method=openAdv"; //打开广告
    UrlConfig.GET_WORLD_LIST = "/weixinapi.php?method=getWorldList"; //世界排名
    UrlConfig.SET_GOLD_DATA = "/weixinapi.php?method=setData"; //数据上报存储
    UrlConfig.GET_PROFIT = "/weixinapi.php?method=getprofit"; //下线后重新登录收益
    UrlConfig.SET_FORMID = "/weixinapi.php?method=setformId"; //提交formid
    UrlConfig.INVITED_BY_FRIEND = "/weixinapi.php?method=addSeek"; //邀请朋友
    UrlConfig.SEEK_LOG = "/weixinapi.php?method=SeekLog"; //获取邀请的朋友结果
    UrlConfig.SHARE_GROUP = "/weixinapi.php?method=shareGroup"; //分享到群
    UrlConfig.GET_RANK_LIST = "/weixinapi.php?method=getRankList"; //获取排行榜
    UrlConfig.MONEY_TOTICES = "/weixinapi.php?method=moneynotices"; //金币操作通知
    UrlConfig.GET_TODAY = "/weixinapi.php?method=getToday"; //获取签到列表
    UrlConfig.DO_TODAY = "/weixinapi.php?method=doToday"; //签到奖励领取
    UrlConfig.OPEN_RED = "/weixinapi.php?method=openRed"; //红包获得 
    UrlConfig.DO_EXCHANGE = "/weixinapi.php?method=doexchange"; //红包兑换 
    UrlConfig.OPEN_CLICK = "/weixinapi.php?method=openClick"; //点击统计
    UrlConfig.GET_CASH = "/weixinapi.php?method=getCash"; //现金红包
    UrlConfig.PUSH_MSG = "/weixinapi.php?method=pushMsg"; //跑马灯（广播）
    UrlConfig = __decorate([
        ccclass
    ], UrlConfig);
    return UrlConfig;
}());
exports.default = UrlConfig;

cc._RF.pop();