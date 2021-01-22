let login = {
    on(connect,openid,name,avatarUrl,gender){
        //如果新用户就注册

        let player_info = {};
        player_info.connect = connect;
        player_info.name = name;
        player_info.avatarUrl = avatarUrl;
        player_info.gender = gender;
        player_info.roomName = '';
      
        global.players_map[openid] = player_info;
    }
}

module.exports = login;