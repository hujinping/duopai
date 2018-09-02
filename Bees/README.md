小游戏模板工程结构说明：
Scene：场景
    工程分为四个场景，开始(Start)，游戏(Game)，结束(End)，排行(Ranking)
Script：代码
    Common:
        AudioManager： 声音管理
        Http: Http请求
        UrlConfig: URL配置
        UserManager: 用户管理
    Controller: 
        GameCtr: 全局控制类
        WXCtr: 微信相关全局方法
    View: 游戏界面
        end:
            End: 结束界面
            Revive: 复活界面
        game:
            Game: 游戏界面
        ranking:
            RankingView: 排行榜界面
            RankingCell: 排行榜单条数据信息
        start:
            Start: 开始界面
resources: 资源
    animation: 动画资源
    audio：音效资源
    prefab：预制体资源
    texture：图片资源
        animation：动画图片资源
        common：通用图片资源
        end：结束界面相关资源
        game：游戏相关资源
        ranking：排行榜相关资源
        start：开始界面相关资源
游戏的开始、结束、排行几个界面主体功能一般不变，具体界面显示根据自己的实际需求自己调整。
实际游戏逻辑等细节自己完成。最好是直接在Game.ts里面拓展，其他跟游戏相关的代码、资源等也放到对应的game文件夹下以免造成混淆。


子域工程：SubGame
    子域工程包含好友排行榜和结束界面小排行榜，一般不变动。

如有疑问，咨询胡爱平。
