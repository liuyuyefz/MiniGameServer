let close = {
    on(connect,result)
    {
        for(let openid in global.players_map){
            if(global.players_map[openid].connect === connect)
            {
                console.log(openid,':',result)
                let roomId = global.players_map[openid].roomId;
                
                let room = global.inGame_rooms_map[roomId];
                if(room)
                {
                    room.close()
                    delete global.inGame_rooms_map[roomId];
                    // console.log('删除房间：',roomId)    
                    // for(let aId in global.inGame_rooms_map)  
                    // {
                    //     console.log('roomId:',aId)  
                    // }
                }
              
                // remove room
                delete global.players_map[openid];
                // for(let aOpenid in global.players_map)  
                //     {
                //         console.log('openid:',aOpenid)  
                //     }
                // console.log('删除玩家：',openid)
                return;
            }
        }
    }
}

module.exports = close;