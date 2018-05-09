module.exports = class PlayerManager
{
  constructor(ctrl) {
    this.player_id = null; // auto id firebase/player
    this.player = 1;
    this.stage = 0;
    this.opponent_stage = 0;

    this.ctrl = ctrl;
    let that = this;
    $('#choose-player').change(function(){
      that.player = $(this).val();
    });
  }

  updateStage(stage)
  {
    this.stage = stage;
  }
  updateOpponentStage(stage)
  {
    this.opponent_stage = stage;
  }
  getStage() {
    return this.stage;
  }
  getOpponentStage() {
    return this.opponent_stage;
  }
  getPlayer() {
    return this.player;
  }
  getOpponentPlayer() {
    return this.player == 1 ? 2 : 1;
  }
}
