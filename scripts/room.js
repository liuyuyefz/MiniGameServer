class Room {
    constructor(roomId,gameMode,host_openid) {
        this.roomId = roomId;
        // console.log('roomId:',roomId)
        // this.roomName = roomName;
        this.gameMode = gameMode;
        this.host_openid = host_openid;
        this.other_player_openid = '';

        this.timer = null;
        this.order_index = 0;

        this.host_order_arr = [];
        this.other_order_arr = [];
        this.current_host_order_arr = [];
        this.current_other_order_arr = [];
        global.inGame_rooms_map[roomId] = this;
    }

    join(openid){
        this.other_player_openid = openid;
        let player = global.players_map[openid];
        player.roomId = this.roomId;
    }

    lockStep(){

        let Self = this;
        let player = global.players_map[this.host_openid];
        let other_player = global.players_map[this.other_player_openid];
        // send player info to other player
        let player_info = {};
        player_info.type = 'match';
        player_info.roomId = this.roomId;
        player_info.openid = this.host_openid;
        player_info.name = player.name;
        player_info.avatarUrl = player.avatarUrl;
        player_info.gender = player.gender;

        other_player.connect.sendText(JSON.stringify(player_info));

        // send other player info to player
        let other_player_info = {};
        other_player_info.type = 'match';
        other_player_info.roomId = this.roomId;
        other_player_info.openid = this.other_player_openid;
        other_player_info.name = other_player.name;
        other_player_info.avatarUrl = other_player.avatarUrl;
        other_player_info.gender = other_player.gender;

        player.connect.sendText(JSON.stringify(other_player_info));

        //帧同步
        this.timer = setInterval(function(){

            let order = {};
            order.type = 'onRecvLockStep';
            order.index = Self.order_index;
            order.order = {};
            order.order[Self.host_openid] = Self.current_host_order_arr;
            order.order[Self.other_player_openid] = Self.current_other_order_arr;

            // console.log('host=',Self.current_host_order_arr)
            // console.log('other_arr=',Self.current_other_order_arr)
            // console.log('other=',order.order[Self.other_player_openid])

            player.connect.sendText(JSON.stringify(order));
            other_player.connect.sendText(JSON.stringify(order));
            // console.log("timer",JSON.stringify(order));
        
            //存入历史
            // for(let item in Self.current_host_order_arr)
            // {
            //     Self.host_order_arr.push(item);
            // }
            // for(let item in Self.current_other_order_arr)
            // {
            //     Self.other_order_arr.push(item);
            // }
            
            Self.current_host_order_arr.length = 0;
            Self.current_other_order_arr.length = 0;

            Self.order_index++;

        }, 66);
    }

    pushOrder(openid,order){
        if(openid === this.host_openid)
        {
            this.current_host_order_arr.push(order);
        }
        else
        {
            this.current_other_order_arr.push(order);
        }
        // console.log('current_host_order_arr=',this.current_host_order_arr)
        // console.log('current_other_order_arr=',this.current_other_order_arr)
    }

    close(){
        clearInterval(this.timer);
    }
}

module.exports = Room;


