module.exports = class UiManager{
  constructor(ctrl)
  {
    this.timer = null;
    this.ctrl = ctrl;
    this.initEvent();
  }

  initEvent()
  {
    // 01 Screen Savaer
    $('#btn-to-waiting').click(() => {
      this.ctrl.gotoWaiting();
    })

    $('.player-passive').click(() => {
      this.ctrl.twoPlayerMode()
    })

    $('#btn-start-game').click(() => {
      this.ctrl.startGame();
    })
  }

  initComEvent(ports)
  {
    let that = this;
    ports.forEach(function(port){
      $('#s01-select-port .container')
        .append('<button class="ui fluid basic button com" data-comname="' + port.comName + '">' + port.comName + '</button>');
    });

    $('.com').click(function(){
      let name = $(this).data('comname');
      that.ctrl.connectComPort(name);
      that.ctrl.loginUser()
    });
  }

  waitingCountdown(timer, callback)
  {
    this.timer = setInterval(() => {
      if (timer>=0) {
        $('.countdown').text(timer--);
      } else {
        this.clearWaitingCountdown();
        callback();
      }
    }, 1000);
  }

  clearWaitingCountdown()
  {
    clearInterval(this.timer);
  }

}