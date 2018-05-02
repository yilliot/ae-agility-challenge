module.exports = class Controller {
  constructor()
  {
  }

  registerModules(fm, sm, pm, plm, ui, cm)
  {
    this.fm = fm;
    this.sm = sm;
    this.pm = pm;
    this.plm = plm;
    this.ui = ui;
    this.cm = cm;

    this.fm.logoutUser();
  }

  initComEvent(ports)
  {
    this.ui.initComEvent(ports)
  }
  connectComPort(name)
  {
    this.pm.connectComPort(name);
  }

  loginUser()
  {
    this.fm.loginUser(this.plm.getPlayer())
  }

  gotoScreenSaver()
  {
    this.sm.gotoScreenSaver()
  }
  gotoWaiting()
  {
    if (this.plm.getOpponentStage() == 1) {
      // waiting for opponent
      this.sm.gotoWaiting()
    } else {
      // single player mode
      this.cm.initCamera()
      this.sm.gotoCamera()      
    }
  }

  updatePlayerStage(stage)
  {
    this.plm.updateStage(stage);
    this.fm.updatePlayerStage(this.plm.getPlayer(), stage);
  }

  updateOpponentPlayerData(snapshot)
  {
    if (snapshot.stage !== this.plm.getOpponentStage()) {
      this.onOpponentChangedStageCallback(snapshot.stage);
    }
    this.plm.updateOpponentStage(snapshot.stage)
  }

  onDisconnected()
  {
    this.fm.onDisconnected(this.plm.getPlayer());
  }

  onOpponentData()
  {
    this.fm.onPlayerData(this.plm.getOpponentPlayer());
  }

  onOpponentChangedStageCallback(stage)
  {
    this.plm.updateOpponentStage(stage);
    // EVENT : PASSIVE PLAYER MODE EVENT
    if (stage == 2 && this.plm.getStage() === 1) {
      this.sm.gotoWaitingPassive();
    }

    // EVENT : ACTIVE PLAYER ACCEPTED EVENT
    if (stage == 3 && this.plm.getStage() === 2) {
      this.cm.initCamera()
      this.sm.gotoCamera();
    }

  }
}