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
    $('#s02-screen-saver').click(() => {
      this.ctrl.pm.is_player_a = true;
      this.ctrl.gotoWaiting();
    })

    $('.player-passive').click(() => {
      this.ctrl.twoPlayerMode()
    })

    $('#cam-photo').click(() => {
      $('#cam-photo').attr('src', '');
    })

    // 06
    $('#skip-email').click(() => {
      this.ctrl.gotoThankyou();      
    })
    $('#save-email').click(() => {
      this.ctrl.gotoThankyou();
    })
    $('#s07-thankyou').click(() => {
      this.ctrl.gotoScreenSaver();
    })

    $('#btn-quit').click(() => {
      this.ctrl.gotoScreenSaver();
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
  updateOpponentPlayerData(snapshot)
  {
    $('#player02 .player-name').text(snapshot.player_name);
    $('#player02 .player-photo').attr('src', snapshot.player_photo_url);
    $('#player02 .player-score').text(snapshot.score);
  }

}