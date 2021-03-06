module.exports = class GameManager {

  constructor(ctrl)
  {
    this.ctrl = ctrl;

    this.light_array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    // this.light_array = [1, 2, 3];
    this.input_game_timer_seconds = 60;

    this.reset();

    this.initKeyEvent();
  }

  reset()
  {
    clearInterval(this.game_timeout);
    this.mode = 0;
    this.p1_score = 0;
    this.p2_score = 0;
    this.ai_fastest_reaction = 1000;
    this.gameover = true;
    this.light_index = null;
    $('.player01 .player-photo,.player02 .player-photo').removeClass('losser').removeClass('winner');
    $('.player01 .player-score').text(this.p1_score);
    $('.player02 .player-score').text(this.p2_score);

  }

  initKeyEvent(){
    let that = this;
    $(document).keypress((e)=>{
      this.triggerButton(e.key);
    });
    $('#input-game-timer-seconds').change(function(){
      that.input_game_timer_seconds = $(this).val();
    });

    $('#input-ai-level').change(function(){
      that.ai_fastest_reaction = $(this).val();
    });

  }

  triggerButton(index)
  {
    this.ctrl.im.zeroIdeaTimer();
    console.log('hit:' + index);
    if (
      !this.gameover &&
      this.light_index == index
      ) {
      this.p1AddScore(1);
      this.lightOff();
    }
  }

  p1AddScore(n) {
    this.p1_score += n;
    $('.player01 .player-score').text(this.p1_score);
    if (this.mode == 2) {
      this.ctrl.updateScore(this.p1_score);
    }
  }
  p2AddScore(n) {
    if (!this.gameover) {
      this.p2_score += n;
      $('.player02 .player-score').text(this.p2_score);
    }
  }

  startGameAI() {
    console.log('game:start:AI');
    this.gameover = false;
    let ai_range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);

    let AIPlay = () => {
      this.p2AddScore(1);
      // let this.ai_fastest_reaction = 3460;
      let reaction_variation_array = ai_range(this.ai_fastest_reaction, this.ai_fastest_reaction * 1.6);
      let reaction_variation = reaction_variation_array[Math.floor(Math.random() * reaction_variation_array.length)];
      // console.log('reaction_variation:' + reaction_variation);
      if (!this.gameover) {
        setTimeout(AIPlay, reaction_variation)
      }
    }
    AIPlay()
    this.startGame()
  }

  startGame() {
    console.log('game:start');
    this.gameover = false;
    let seconds = this.input_game_timer_seconds;
    let that = this;
    $('#game-timer').text(seconds);
    let countdown = () => {
      $('#game-timer').text(seconds);
      if (seconds <= 0) {
        clearInterval(this.game_timeout);
        this.light_index = null;
        this.gameover = true;
        setTimeout(()=>{this.gameOver()}, 1000)
      }
      seconds--;
    };
    this.game_timeout = setInterval(countdown, 1000);
    this.lightOn(3);
  }

  gameOver() {

    this.ctrl.fm
      .saveScores({
        'id' : this.ctrl.pm.player_id,
        'score' : this.p1_score,
        'name' : this.ctrl.pm.name
      });

    if (this.p1_score > this.p2_score) {
      console.log('game:over:win');
      $('.player01 .player-photo').addClass('winner').removeClass('losser');
      $('.player02 .player-photo').addClass('losser').removeClass('winner');
      $('#s06-result').css('background-image', 'url(images/bg-res-win.png)');
      $('#s07-thankyou').css('background-image', 'url(images/bg-thankyou-win.png)');
      this.ctrl.fm.getQrCode((code) => {
        console.log(code);
        $('#qrcode_canvas').show();
        $('#qrcode_text').show().text(code);
        this.ctrl.ui.makeQrCode(code);
      });
    } else {
      console.log('game:over:lose');
      $('.player01 .player-photo').addClass('losser').removeClass('winner');
      $('.player02 .player-photo').addClass('winner').removeClass('losser');
      $('#s06-result').css('background-image', 'url(images/bg-res-lose.png)');
      $('#s07-thankyou').css('background-image', 'url(images/bg-thankyou-lose.png)');
      $('#qrcode_canvas').hide();
      $('#qrcode_text').hide();
    }

    this.ctrl.gotoResult();
  }


  lightOn(seconds) {
    this.light_index = this.light_array[Math.floor(Math.random() * this.light_array.length)];

    console.log('ledon:' + this.light_index);
    this.ctrl.am.lightOn(this.light_index);

    this.light_timer = setTimeout(() => {
      this.lightOff()
    }, seconds * 1000);
  }

  lightOff() {
    console.log('ledoff');
    this.ctrl.am.lightOff();

    clearInterval(this.light_timer);

    if (!this.gameover) {
      setTimeout(()=>{
        this.lightOn(3)
      }, 100)
    }
  }
}