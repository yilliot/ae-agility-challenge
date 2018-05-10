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

    $('#cam-photo').click(() => {
      $('#cam-photo').attr('src', '');
    })
  }

  initComEvent(ports)
  {
    let that = this;
    ports.forEach(function(port){
      $('#s01-select-port .container')
        .append('<button class="ui fluid basic massive button com" data-comname="' + port.comName + '">' + port.comName + '</button>');
    });

    $('.com').click(function(){
      let name = $(this).data('comname');
      that.ctrl.connectComPort(name);
      that.ctrl.loginUser()
    });
  }

  waitingPlayerCamera()
  {
    $('#btn-start-game').unbind('click');
    $('#btn-start-game').attr('src', 'images/btn-waiting-player.png');
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