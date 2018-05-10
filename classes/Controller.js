module.exports = class Controller {
  constructor() {
    this.gotoResult();
  }
  gotoSelectPort() {
    $('section.module').hide();
    $('#s01-select-port').show();
  }


  registerModules(fm, am, pm, ui, cm, gm)
  {
    this.fm = fm;
    this.am = am;
    this.pm = pm;
    this.ui = ui;
    this.cm = cm;
    this.gm = gm;

    this.fm.logoutUser();
    // this.fm.loginUser(1);
    // this.singlePlayerMode();
  }

  // INIT EVENT
  initComEvent(ports) {
    this.ui.initComEvent(ports)
  }

  // 01
  connectComPort(name) {
    this.am.connectComPort(name);
  }
  loginUser() {
    this.fm.loginUser(this.pm.getPlayer())
  }

  // 02
  gotoScreenSaver() {
    $('section.module').hide();
    $('#s02-screen-saver').show();
    $('#backdrop-video').attr('src', 'videos/screensaver-loop.mp4');
    this.updatePlayerStage(1);
    this.fm.resetUser(this.pm.getPlayer())
  }

  // 03 WAITING PAGE
  gotoWaiting() {
    $('#backdrop-video').attr('src', 'videos/bg-loop.mp4');
    if (this.pm.getOpponentStage() == 1) {
      // waiting for opponent
      this.updatePlayerStage(2);
      $('section.module').hide();
      $('#s03-waiting').show();
      $('.player-passive').hide();

      this.ui.waitingCountdown(20, () => {
        this.singlePlayerMode();
      })
    } else {
      // single player mode
      this.singlePlayerMode();
    }
  }

  // 04 AFTER WAITING, player / user setup
  singlePlayerMode() {
    console.log('single player mode');
    this.gm.mode = 1;
    this.setupPlayer();
  }
  twoPlayerMode() {
    console.log('two player mode');
    this.gm.mode = 2;
    this.setupPlayer();
  }
  setupPlayer() {
    let player_id = this.fm.newPlayer();
    this.pm.player_id = player_id;
    this.fm.updateUserAttribute(this.pm.getPlayer(), 'player_id', player_id);
    this.ui.clearWaitingCountdown();
    this.cm.initCamera();
    this.updatePlayerStage(3);
    $('section.module').hide();
    $('#s04-camera').show();

  }
  uploadPlayerPhoto(blob) {
      this.fm.uploadBlob(this.pm.player_id, blob);
  }
  updateUserPhotoUrl(url) {
    // VS MODE
    if (this.gm.mode == 2)
      this.fm.updateUserAttribute(this.pm.getPlayer(), 'player_photo_url', url)
  }
  startGameBtnClick(name) {

    // VS MODE
    if (this.gm.mode == 2) {
      this.fm.updateUserAttribute(this.pm.getPlayer(), 'player_name', name)
      this.fm.updateUserAttribute(this.pm.getPlayer(), 'score', 0)
    }

    // PLAYER-RECORDS
    this.fm.updatePlayerAttribute(this.pm.player_id, 'name', name)

    $('.player01 .player-name').text(name);

    if (this.cm.has_taken_photo) {
      this.readyToStartGame();
    } else {
      this.cm.count_down_take_picture();
      setTimeout(() => {
        this.readyToStartGame();
      }, 4000);
    }
  }

  // 05
  readyToStartGame()
  {
    this.updatePlayerStage(4);

    if (this.gm.mode == 1) {

      // A first
      // #WA
      this.startGameAI();
    } else {
      if (this.pm.getOpponentStage() == 4) {

        // B first
        // #WD
        this.startGameBattle();

      } else {

        // A first
        this.ui.waitingPlayerCamera();
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
    this.updatePlayerStage(4);
    $('section.module').hide();
    $('#s05-game').show();
    $('.player02 .player-name').text('AI');
    $('.player02 .player-photo').attr('src', 'images/ai.png');
    $('.player02 .player-score').text(0);

    this.gm.startAI();
  }
  startGameBattle()
  {
    this.gm.mode = 2;
    this.updatePlayerStage(4);
    $('section.module').hide();
    $('#s05-game').show();
    this.gm.startGame(60);
  }
  triggerButton(index)
  {
    this.gm.triggerButton(index)
  }
  lightOn(index) {
    this.am.lightOn(index);
  }
  lightOff() {
    this.am.lightOff();
  }
  updateScore(score) {
    this.fm.updateUserAttribute(this.pm.getPlayer(), 'score', score);
  }

  // 06
  gotoResult() {
    $('section.module').hide();
    $('#s06-result').show();
    $('#s06-result').css('background-image', 'url(images/bg-res-lose.png)');

  }
  // 07
  gotoThankyou() {
    $('section.module').hide();
    $('#s07-thankyou').show();
  }

  // SHARED
  updatePlayerStage(stage)
  {
    this.pm.updateStage(stage);
    this.fm.updatePlayerStage(this.pm.getPlayer(), stage);
  }

  updateOpponentPlayerData(snapshot)
  {
    if (snapshot.stage !== this.pm.getOpponentStage()) {
      this.onOpponentChangedStageCallback(snapshot.stage);
    }
    this.pm.updateOpponentStage(snapshot.stage)

    // VS GAME mode
    if (this.gm.mode == 2) {
      this.ui.updateOpponentPlayerData(snapshot)
    }
  }

  onDisconnected()
  {
    this.fm.onDisconnected(this.pm.getPlayer());
  }

  onOpponentData()
  {
    this.fm.onPlayerData(this.pm.getOpponentPlayer());
  }

  onOpponentChangedStageCallback(stage)
  {
    this.pm.updateOpponentStage(stage);
    // EVENT : PASSIVE PLAYER MODE EVENT
    if (stage == 2 && this.pm.getStage() === 1) {
      this.updatePlayerStage(2);
      $('section.module').hide();
      $('#s03-waiting').show();
      $('.player-active').hide();
      $('#backdrop-video').attr('src', 'videos/bg-loop.mp4');

      this.ui.waitingCountdown(15, () => {
        this.gotoScreenSaver()
      });
    }

    // EVENT : ACTIVE PLAYER ACCEPTED EVENT
    if (stage == 3 && this.pm.getStage() === 2) {
      this.twoPlayerMode();
    }

    // EVENT : A first And B responded
    if (stage == 4 && this.pm.getStage() === 4) {
      // A First
      // #WC
      this.startGameBattle();
    }

    // EVENT : B first And A left
    if (stage == 3 && this.pm.getStage() === 4) {
      // B First
      // #WE
      setTimeout(() => {
        this.gotoScreenSaver();
      }, 60000);
    }

  }

}