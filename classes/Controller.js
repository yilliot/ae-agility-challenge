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
    this.singlePlayerMode();
  }

  initComEvent(ports)
  {
    this.ui.initComEvent(ports)
  }
  connectComPort(name)
  {
    this.am.connectComPort(name);
  }

  loginUser()
  {
    this.fm.loginUser(this.pm.getPlayer())
  }

  gotoScreenSaver()
  {
    this.sm.gotoScreenSaver()
  }
  gotoWaiting()
  {
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

  singlePlayerMode()
  {
    console.log('single player mode');
    this.gm.mode = 1;
    this.ui.clearWaitingCountdown();
    this.cm.initCamera();
    this.sm.gotoCamera();
  }
  twoPlayerMode()
  {
    console.log('two player mode');
    this.gm.mode = 2;
    this.ui.clearWaitingCountdown();
    this.cm.initCamera();
    this.sm.gotoCamera();
  }

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
  }

  startGame()
  {
    if (this.gm.mode == 1) {
      this.sm.gotoGame();
      this.gm.startAI();
    } else {
      this.updatePlayerStage(4);
      if (this.pm.getOpponentStage() == 4) {
        this.sm.gotoGame();
        this.gm.startGame();
      } else {
        this.ui.waitingCountdown(60, () => {
          this.gm.mode = 1;
          this.sm.gotoGame();
          this.gm.startAI();
        });
      }
    }
  }
}