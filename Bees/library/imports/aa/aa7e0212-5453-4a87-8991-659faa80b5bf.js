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
    UrlConfig.rootUrl = "https://api.2-00.cn/api_game_chiji"; //接口域名地址根目录
    UrlConfig.LOGIN = "/publicapi.php?method=getuid"; //用户登录-公共
    UrlConfig.SET_USER_DATA = "/publicapi.php?method=setUserData"; //授权上传资料-公共
    UrlConfig.DISPOSE_USER = "publicapi.php?method=disposeUser"; //截屏封号—公共
    UrlConfig.GET_USERINFO = "/publicapi.php?method=getUserInfo"; //查询用户资料-公共
    UrlConfig.GET_SETTING = "/weixinapi.php?method=getsetting"; //获取配置
    UrlConfig.GET_GOLD = "/weixinapi.php?method=getGoldByShare"; //分享/看视频获得金币
    UrlConfig.GET_SHARE = "/weixinapi.php?method=getShare"; //获取分享内容
    UrlConfig.ADD_FRIEND = "/weixinapi.php?method=addFriend"; //添加朋友
    UrlConfig.SHARE_FRIEND_RESULT = "/weixinapi.php?method=friendResult"; //获取分享的朋友结果
    UrlConfig.RECEIVE_PRIZE = "/weixinapi.php?method=receivePrize"; //满足分享朋友条件之后的领取奖励
    UrlConfig.GET_RANDOM_USER = "/weixinapi.php?method=getRandomUser"; //随机获取用户信息
    UrlConfig.REVIVECONFIG = "/weixinapi.php?method=reviveConfig"; //复活配置
    UrlConfig.CHANEL_RECORD = "/weixinapi.php?method=addChannelRecord"; //渠道统计
    UrlConfig.ADConfig = "/weixinapi.php?method=getAdv"; //广告配置
    UrlConfig.VideoOpen = "/weixinapi.php?method=openAdv"; //关闭视频广告时渠道统计
    UrlConfig.SET_GOLD_DATA = "/weixinapi.php?method=setData"; //金币上报存储
    UrlConfig.SET_FORMID = "/weixinapi.php?method=setformId"; //提交formid
    UrlConfig.INVITED_BY_FRIEND = "/weixinapi.php?method=addSeek"; //邀请朋友获得金币
    UrlConfig.SEEK_LOG = "/weixinapi.php?method=SeekLog"; //获取分享的朋友结果
    UrlConfig.SHARE_GROUP = "/weixinapi.php?method=shareGroup"; //分享到群
    UrlConfig.GET_RANK_LIST = "/weixinapi.php?method=getRankList"; //获取排行榜
    UrlConfig.MONEY_TOTICES = "/weixinapi.php?method=moneynotices"; //金币操作通知
    UrlConfig.GET_TODAY = "/weixinapi.php?method=getToday"; //获取签到列表
    UrlConfig.DO_TODAY = "/weixinapi.php?method=doToday"; //签到奖励领取
    UrlConfig.GAME_START = "/weixinapi.php?method=GameStart"; //游戏开始
    UrlConfig.GET_GAME_START = "/weixinapi.php?method=getGameStart"; //开始游戏时获取匹配机器人
    UrlConfig.GET_TITLE = "/weixinapi.php?method=getTitle"; //获取题目
    UrlConfig.GAME_WIN = "/weixinapi.php?method=GameWin"; //获得第一吃鸡成功
    UrlConfig = __decorate([
        ccclass
    ], UrlConfig);
    return UrlConfig;
}());
exports.default = UrlConfig;

cc._RF.pop();