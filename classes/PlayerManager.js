module.exports = class PlayerManager
{
  constructor(ctrl) {
    this.ctrl = ctrl;
    let that = this;

    this.config_player_id = 1; // config station 1 / 2
    this.player_id = null; // auto id firebase/player
    this.name = null;
    this.stage = null;
    this.opponent_stage = 0;

    this.is_player_a = false;

    $('#choose-player').change(function(){
      that.config_player_id = $(this).val();
    });
  }

  reset()
  {
    this.is_player_a = false;    
  }

  getOpponentConfigPlayerId() {
    return this.config_player_id == 1 ? 2 : 1;
  }
}
