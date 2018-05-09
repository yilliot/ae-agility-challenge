module.exports = class Controller {
  constructor()
  {
  }

  registerModules(fm, sm, am, pm, ui, cm, gm)
  {
    this.fm = fm;
    this.sm = sm;
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
    this.sm.gotoScreenSaver()
    this.fm.resetUser(this.pm.getPlayer())
  }

  // 03
  gotoWaiting() {
    if (this.pm.getOpponentStage() == 1) {
      // waiting for opponent
      this.sm.gotoWaiting()
      this.ui.waitingCountdown(20, () => {
        this.singlePlayerMode();
      })
    } else {
      // single player mode
      this.singlePlayerMode();
    }
  }

  // 04
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
    this.sm.gotoCamera();
  }
  uploadPlayerPhoto(blob) {
    this.fm.uploadBlob(this.pm.player_id, blob);
  }
  updateUserPhotoUrl(url) {
    this.fm.updateUserAttribute(this.pm.getPlayer(), 'player_photo_url', url)
  }
  startGameBtnClick(name) {
    this.fm.updateUserAttribute(this.pm.getPlayer(), 'player_name', name)
    this.fm.updatePlayerAttribute(this.pm.player_id, 'name', name)
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
      this.startGameAI();
    } else {
      if (this.pm.getOpponentStage() == 4) {
        this.startGameBattle();
      } else {
        this.ui.waitingCountdown(60, () => {
          this.startGameAI();
        });
      }
    }
  }
  startGameAI()
  {
    this.gm.mode = 1;
    this.sm.gotoGame();
    this.gm.startAI();
  }
  startGameBattle()
  {
    this.gm.mode = 2;
    this.sm.gotoGame();
    this.gm.startGame();
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
      this.sm.gotoWaitingPassive();
      this.ui.waitingCountdown(15, () => {
        this.gotoScreenSaver()
      });
    }

    // EVENT : ACTIVE PLAYER ACCEPTED EVENT
    if (stage == 3 && this.pm.getStage() === 2) {
      this.twoPlayerMode();
    }

    // EVENT : ACTIVE PLAYER ACCEPTED EVENT
    if (stage == 4 && this.pm.getStage() === 4) {
      this.startGameBattle();
    }

  }

}