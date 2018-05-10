module.exports = class GameManager {

  constructor(ctrl)
  {
    this.ctrl = ctrl;
    this.mode = 0; // 1, 2
    this.p1_score = 0;
    this.p2_score = 0;
    this.gameover = false;
    this.light_array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    this.light_index = null;
    this.game_timer_seconds = 0;

    this.initKeyEvent();
  }

  initKeyEvent(){
    $(document).keypress((e)=>{
      this.triggerButton(e.key);
    });
  }

  triggerButton(index)
  {
    console.log('hit:' + index);
    if (this.light_index == index) {
      this.p1AddScore(1);
      this.lightOff();
    }
  }

  p1AddScore(n)
  {
    this.p1_score += n;
    $('.player01 .player-score').text(this.p1_score);
    if (this.mode == 2) {
      this.ctrl.updateScore(this.p1_score);
    }
  }
  p2AddScore(n)
  {
    this.p2_score += n;
    $('.player02 .player-score').text(this.p2_score);
  }

  startAI()
  {
    let range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);

    let AIPlay = () => {
      this.p2AddScore(1);
      let ai_fastest_reaction = 460;
      let reaction_variation_array = range(ai_fastest_reaction, ai_fastest_reaction + 500);
      let reaction_variation = reaction_variation_array[Math.floor(Math.random() * reaction_variation_array.length)];
      if (!this.gameover)
        setTimeout(AIPlay, reaction_variation)
    }
    AIPlay()
    this.startGame(60)
  }

  lightOn(seconds)
  {
    this.light_index = this.light_array[Math.floor(Math.random() * this.light_array.length)];
    // DEMO light
    console.log('on:' + this.light_index);
    // $('#lights .light:nth-child(' + (this.light_index+1) + ')').addClass('up');
    this.ctrl.lightOn(this.light_index);

    this.light_timer = setTimeout(() => {
      this.lightOff(this.light_index)
    }, seconds * 1000);
  }

  lightOff()
  {
    // DEMO light
    $('#lights .light').removeClass('up');
    this.ctrl.lightOff();

    clearInterval(this.light_timer);

    if (!this.gameover) {
      setTimeout(()=>{
        this.lightOn(3)
      }, 100)
    }
    this.light_index
  }

  startGame(seconds)
  {
    console.log('start game');
    console.log(seconds);
    this.gameover = false;
    let game_timeout;
    let that = this;
    let countdown = function(){
      $('#game-timer').text(seconds);
      if (seconds <= 0) {
        clearInterval(game_timeout);
        that.gameOver();
      }
      this.game_timer_seconds = seconds--;
    };
    game_timeout = setInterval(countdown, 1000);
    this.lightOn(3);
  }

  gameOver()
  {
    console.log('gameover');
    this.light_index = null;
    this.gameover = true;

  }

}