var sharedCanvas = wx.getSharedCanvas();

function drawRankList(data) {

    console.log('drawRankList', data);
    var sharedCanvas = wx.getSharedCanvas();
    let context = sharedCanvas.getContext('2d')

    let icon = wx.createImage();
    //getAvatar('');
    icon.src = 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLnQfCfmXCPI2Krbia8qzXp0f43tMMnLHeYVmrEIdtwjVwq2nfuygRcUfvwN4EYcruvZ0jw9YQXwBA/96';
    icon.onload = function() {
        context.drawImage(icon, 200, 120, icon.width, icon.height);
    }



    context.fillStyle = 'red'
    context.font = "20px Arial"
    context.textAlign = 'center';

    for (var i = 0; i <= 10; i++) {

        context.fillText(
            '子域数据: ' + i,
            200,
            250 + 30 * i,
        )
    }


    //var canvas = cc.game.canvas
    if (canvas) {
        cc.log("画布可用")
    }

    let canvas = wx.createCanvas()
    let ctx = canvas.getContext('2d')
    ctx.drawImage(sharedCanvas, 0, 0)

    if (context) {
        console.log("画布可用")
    }
    /*
      var context = canvas.getContext('2d')
    if (context) {
      console.log("上下文可用")
      context.drawImage(sharedCanvas, 0, 0)
    }
      */
}

wx.onMessage(data => {


    console.log('接受', data)

    /*
    var id = 10;
    var time=10;
    if(time % 100){
      return 10;
    }
    */

    var kvDataList = new Array()
    kvDataList.push({ key: "rank", value: "1" });

    wx.setUserCloudStorage({
        KVDataList: kvDataList,
        success: (msg) => {
            console.log('z_setrank', msg)
        },
    })

    wx.getUserCloudStorage({
        keyList: ['rank'],
        success: res => {
            var n = res.KVDataList[0].value
            console.log('z_getrank', res);
            console.log('z_rank:', n);

            drawRankList(res.KVDataList);
        }
    })

    wx.getFriendCloudStorage({
        success: res => {

            console.log('z_data:', res);
        }
    })



})