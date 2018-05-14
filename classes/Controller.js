module.exports = class Controller {
  constructor() {
    this.gotoSelectPort();
  }

  registerModules(fm, am, pm, ui, cm, gm) {
    this.fm = fm;
    this.am = am;
    this.pm = pm;
    this.ui = ui;
    this.cm = cm;
    this.gm = gm;

    this.fm.logoutUser();
  }

  // S1
  gotoSelectPort() {
    $('section.module').hide();
    $('#s01-config').show();
  }

  // S2.1
  gotoScreenSaver() {
    // RESET STAGE VAR
    this.pm.reset();
    this.gm.reset();
    this.ui.clearWaitingCountdown();

    // RESET DB
    this.fm.resetUser(this.pm.config_player_id)
    this.updateUserStage('S2.1'); // ScreenSaver

    // RESET UI
    $('.player-passive').hide();
    $('.player-active').hide();
    $('#backdrop-video').attr('src', 'videos/screensaver-loop.mp4');
    $('section.module').hide();
    $('#s02-screen-saver').show();
  }

  // S2.2 WAITING PAGE
  gotoWaiting() {

    // S2.2 Wait to join
    if (this.pm.opponent_stage == 'S2.1') {
      // waiting for opponent
      this.updateUserStage('S2.2');
      $('.player-active').show();

      $('.countdown').text(15);
      this.ui.waitingCountdown(15, () => {
        this.singlePlayerMode();
      })
    } else {
      this.singlePlayerMode();
    }
  }

  // player / user setup
  singlePlayerMode() {
    console.log('PLAYER.MODE:1');
    this.gm.mode = 1;
    this.gotoCamera();
  }
  twoPlayerMode() {
    console.log('PLAYER.MODE:2');
    this.gm.mode = 2;
    this.gotoCamera();
  }
  gotoCamera() {

    // SETUP PLAYER, DB
    let player_id = this.fm.newPlayer();
    this.pm.player_id = player_id;
    this.updateUserStage('S3');

    if (this.gm.mode == 2)
      this.fm.updateUserAttribute(this.pm.config_player_id, 'player_id', player_id);

    // RESET UI / STAGE var
    this.cm.has_taken_photo = false;
    this.ui.clearWaitingCountdown();
    this.ui.keyboard_name.enabled = true;
    this.ui.keyboard_name.toggle();
    $('#cam-photo').attr('src', '');
    $('#wb-timer-text').hide();
    $('#we-timer-text').hide();
    $('#backdrop-video').attr('src', 'videos/bg-loop.mp4');
    $('.keyboard').val('');
    $('#btn-start-game').unbind('click');
    $('#btn-start-game').attr('src', 'images/btn-start-disabled.png');
    $('section.module').hide();
    $('#s03-camera').show();
  }
  uploadPlayerPhoto(blob) {
      this.fm.uploadBlob(this.pm.player_id, blob);
  }
  updateUserPhotoUrl(url) {
    // VS MODE
    if (this.gm.mode == 2)
      this.fm.updateUserAttribute(this.pm.config_player_id, 'player_photo_url', url)
  }
  startGameBtnClick(name) {

    // VS MODE
    if (this.gm.mode == 2) {
      this.fm.updateUserAttribute(this.pm.config_player_id, 'player_name', name)
      this.fm.updateUserAttribute(this.pm.config_player_id, 'score', 0)
    }

    // PLAYER-RECORDS
    this.pm.name = name;
    this.fm.updatePlayerAttribute(this.pm.player_id, 'name', name)

    $('.player01 .player-name').text(name);

    if (this.cm.has_taken_photo) {
      this.readyToStartGame();
      $('#btn-start-game').unbind('click');
      $('#btn-start-game').attr('src', 'images/btn-start-disabled.png');
    } else {
      $('#we-timer-text').hide();
      $('#btn-start-game').unbind('click');
      $('#btn-start-game').attr('src', 'images/btn-start-disabled.png');
      this.cm.count_down_take_picture();
      setTimeout(() => {
        this.readyToStartGame();
      }, 4000);
    }
  }

  // 05
  readyToStartGame()
  {
    this.updateUserStage('S4');

    if (this.gm.mode == 1) {

      // A first
      // #WA
      this.startGameAI();
    } else {
      if (this.pm.opponent_stage == 'S4') {

        // B first
        // #WD
        this.startGameBattle();
        clearInterval(this.ui.timer);
        clearInterval(this.opponent_left_timeout);

      } else {

        // A first
        // S3.1
        this.ui.S31();
        this.updateUserStage('S3.1'); // A first
        this.ui.waitingCountdown(60, () => {
          // #WB
          this.startGameAI();
        });
      }
    }
  }
  startGameAI()
  {
    this.gm.mode = 1;
    this.updateUserStage('S4');
    $('section.module').hide();
    $('#s05-game').show();
    $('.player02 .player-name').text('AI');
    $('.player02 .player-photo').attr('src', 'images/ai.png');
    $('.player02 .player-score').text(0);

    this.gm.startGameAI();
  }
  startGameBattle()
  {
    this.gm.mode = 2;
    this.updateUserStage('S4');
    $('section.module').hide();
    $('#s05-game').show();
    this.gm.startGame();
  }
  updateScore(score) {
    this.fm.updateUserAttribute(this.pm.config_player_id, 'score', score);
  }

  // 06
  gotoResult() {
    $('section.module').hide();
    $('#s06-result').show();
  }
  saveEmail(email) {
    this.fm.updatePlayerAttribute(this.pm.player_id, 'email', email)
  }
  // 07
  gotoThankyou() {
    $('section.module').hide();
    $('#s07-thankyou').show();
  }

  // SHARED
  updateUserStage(stage)
  {
    this.pm.stage = stage;
    this.fm.updateUserAttribute(this.pm.config_player_id, 'stage', stage);
  }

  updateOpponentPlayerData(snapshot)
  {
    if (snapshot.stage !== this.pm.opponent_stage) {
      this.onOpponentChangeStage(snapshot.stage);
    }
    this.pm.opponent_stage = snapshot.stage;

    // VS GAME mode
    if (this.gm.mode == 2) {
      this.ui.updateOpponentPlayerData(snapshot)
    }
  }

  onOpponentChangeStage(stage)
  {
    this.pm.opponent_stage = stage;
    // S2.3 PB, ASKED to JOIN
    if (
      this.pm.is_player_a === null &&
      this.pm.stage === 'S2.1' &&
      stage == 'S2.2'
    ) {
      this.updateUserStage('S2.3');
      this.pm.is_player_a = false;
      $('.player-passive').show();

      $('.countdown').text(15);
      this.ui.waitingCountdown(15, () => {
        this.gotoScreenSaver()
      });
    }

    // SCREENSAVER - CAMERA
    // S2.4 PB response
    if (
      this.pm.is_player_a &&
      this.pm.stage === 'S2.2' &&
      stage == 'S3'
    ) {
      this.twoPlayerMode();
    }

    // '#s01-config',      //0
    // '#s02-screen-saver',//1
    // '#s03-camera',      //3
    // '#s05-game'         //4

    // CAMERA - GAME
    // EVENT : A first And B responded
    if (stage == 'S4' && this.pm.stage === 'S4') {
      // #WC
      this.startGameBattle();
      clearInterval(this.ui.timer);
      clearInterval(this.opponent_left_timeout);
    }

    // EVENT : B first And A left
    // S3.2
    if (stage == 'S4' && this.pm.stage === 'S3') {
      this.updateUserStage('S3.2'); // B first
      this.ui.S32();
      console.log('PA is ready, waiting PB 60secs');
      this.ui.waitingCountdown(60, () => {
        // #WE
        this.gotoScreenSaver();
      });
    }
  }
}