module.exports = class SectionManager {
  constructor(ctrl)
  {
    this.ctrl = ctrl;
    this.modules = [
      '#s01-select-port', //0
      '#s02-screen-saver',//1
      '#s03-waiting',     //2
      '#s04-camera',      //3
      '#s05-game'         //4
    ];

    // this.gotoSelectPort();
    // this.gotoScreenSaver();
    // this.gotoWaiting()
    // this.gotoWaitingPassive()
    // this.gotoWaitingPassive()
    

  }

  gotoSelectPort()
  {
    $('section.module').hide();
    $(this.modules[0]).show();
  }
  gotoScreenSaver()
  {
    this.ctrl.updatePlayerStage(1);

    $('section.module').hide();
    $(this.modules[1]).show();
  }
  gotoWaiting()
  {
    this.ctrl.updatePlayerStage(2);
    $('section.module').hide();
    $(this.modules[2]).show();
    $('.player-passive').hide();

  }
  gotoWaitingPassive()
  {
    this.ctrl.updatePlayerStage(2);
    $('section.module').hide();
    $(this.modules[2]).show();
    $('.player-active').hide();
  }
  gotoCamera()
  {
    this.ctrl.updatePlayerStage(3);
    $('section.module').hide();
    $(this.modules[3]).show();
  }
  gotoGame()
  {
    this.ctrl.updatePlayerStage(4);
    $('section.module').hide();
    $(this.modules[4]).show();
  }

}