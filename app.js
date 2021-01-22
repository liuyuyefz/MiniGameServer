var login = require('./scripts/login');
var match = require('./scripts/match');
var room = require('./scripts/room');
var close = require('./scripts/close');

var lib = require('./scripts/lib');
//所有用户，必须用全局global安装，这样保证每一个线程都能访问到相同的全局数组
global.players_map = [];

global.wait_rooms_map = [];
global.inGame_rooms_map = [];

let ws = require("nodejs-websocket");
// 创建服务器
// let server = ws.createServer(function (connect)
ws.createServer(function (connect)
{
    // 监听客户端回调信息
    connect.on("text", function (data) {
        // console.log('data=',data)
        let data_json = JSON.parse(data);

        //用户登录
        if (data_json.type === 'login') {

            console.log(data_json.openid + '进入大厅');
            login.on(connect,data_json.openid,data_json.name,data_json.avatarUrl,data_json.gender);
        }
        else if (data_json.type === 'match') {

            console.log(data_json.openid + '正在匹配..');
            if(data_json.gameMode === 'lockStep')
            {
                match.lockStep(data_json.openid,data_json.gameMode);
            }
        }
        else if (data_json.type === 'lockStep') {

            console.log(data_json.openid + '发送消息：'+data_json.order);
            console.log('roomId:'+data_json.roomId);
            let room = global.inGame_rooms_map[data_json.roomId];
            room.pushOrder(data_json.openid,data_json.order);
        }
    });

    connect.on("close", function (code, reason) {
        // for(let key in global.players_map){
        //     if(global.players_map[key].connect === connect)
        //     {
        //         console.log(key+'退出')
        //     }
        // }
        // console.log('code='+code);
        close.on(connect,'退出');
    });

    connect.on("error", function (code, reason) {
        // for(let key in global.players_map){
        //     if(global.players_map[key].connect === connect)
        //     {
        //         console.log(key+'异常退出')
        //     }
        // }
        // console.log('code='+code);
        // close.on(connect,'异常退出');
    });
}).listen(3000)
console.log("WebSocket建立完毕")

