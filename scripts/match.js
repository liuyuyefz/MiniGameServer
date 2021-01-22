let Room = require('./room');
let match = {
    lockStep(openid,gameMode){ 
        
        let len = Object.keys(global.wait_rooms_map).length;
        // for(let roomId in global.wait_rooms_map)  
        // {
        //     console.log('roomId111:',roomId)  
        // }
        //if no players waiting push player into waiting array
        if(len == 0)
        {
            let player = global.players_map[openid];
            player.roomId = new Date().getTime();
            let room = new Room(player.roomId,'lockStep',openid);
            // set room name in map
            global.wait_rooms_map[player.roomId] = room;

            return;
        }
        //join game
        for(let roomId in global.wait_rooms_map){

            let room = global.wait_rooms_map[roomId];

            if(gameMode === room.gameMode)
            {
                room.join(openid);
                
                console.log(openid,'匹配进入：',roomId);
                global.inGame_rooms_map[roomId] = room;
              
                delete global.wait_rooms_map[roomId];
                for(let roomId in global.wait_rooms_map)  
                    {
                        console.log('roomId:',roomId)  
                    }
                room.lockStep();

                break;
            }
        }
    },
}

module.exports = match;