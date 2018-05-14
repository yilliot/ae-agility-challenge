
module.exports = class UiManager{
  constructor(ctrl)
  {
    this.timer = null;
    this.hiscore = [];
    this.ctrl = ctrl;
    this.initEvent();

    this.QRCode = require('qrcode');
    this.qrcode_canvas = document.getElementById('qrcode_canvas');

  }

  initEvent()
  {
    let that = this;
    // 01 Screen Saver
    $('#s02-screen-saver').click(() => {
      if (this.ctrl.pm.is_player_a === null) {
        this.ctrl.pm.is_player_a = true;
        this.ctrl.gotoWaiting();
      }
      if (!this.ctrl.pm.is_player_a) {
        this.ctrl.twoPlayerMode()
      }
    })

    $('#cam-photo').click(() => {
      // $('#cam-photo').attr('src', '');
    })

    // 05
    $('#btn-quit').click(() => {
      this.ctrl.gotoScreenSaver();
    })

    // 06
    $('#skip-email').click(() => {
      this.ctrl.gotoThankyou();      
    })
    $('#s07-thankyou').click(() => {
      this.ctrl.gotoScreenSaver();
    })


    $('#keyboard-name').keyboard({
      usePreview : false,
      appendTo : '#keyboard-name-area',
      alwaysOpen : true,
      display: {
        'bksp'   : '\u2190',
        'enter'  : 'return',
        'normal' : 'ABC',
        'meta1'  : '.?123',
        'meta2'  : '#+=',
        'accept' : '\u21d3'
      },
      'maxLength' : 12,
      'change' : function() {
        let name = $('#keyboard-name').val().trim();
        $('#btn-start-game').unbind('click');
        if ( that.ctrl.pm.stage !== 'S3.2' )
          $('#btn-start-game').attr('src', 'images/btn-start-disabled.png');
        if (
          name.length != 0 &&
          that.ctrl.cm.has_taken_photo
          ) {
          if ( that.ctrl.pm.stage !== 'S3.2' )
            $('#btn-start-game').attr('src', 'images/btn-start.png');
          $('#btn-start-game').on('click', () => {
            that.keyboard_name.enabled = false;
            that.keyboard_name.toggle();
            ctrl.startGameBtnClick(name);
          });
        }
      },

      layout: 'custom',
      customLayout: {
        'normal': [
          'q w e r t y u i o p {bksp}',
          'a s d f g h j k l {enter}',
          '{s} z x c v b n m @ . {s}',
          '{meta1} {space} _ -'
        ],
        'shift': [
          'Q W E R T Y U I O P {bksp}',
          'A S D F G H J K L {enter}',
          '{s} Z X C V B N M @ . {s}',
          '{meta1} {space} _ -'
        ],
        'meta1': [
          '1 2 3 4 5 6 7 8 9 0 {bksp}',
          '` | { } % ^ * / \' {enter}',
          '{meta2} $ & ~ # = + . {meta2}',
          '{normal} {space} ! ?'
        ],
        'meta2': [
          '[ ] { } \u2039 \u203a ^ * " , {bksp}',
          '\\ | / < > $ \u00a3 \u00a5 \u2022 {enter}',
          '{meta1} \u20ac & ~ # = + . {meta1}',
          '{normal} {space} ! ?'
        ]
      }
    });

    $('#keyboard-email').keyboard({
      usePreview : false,
      appendTo : '#keyboard-email-area',
      alwaysOpen : true,
      display: {
        'bksp'   : '\u2190',
        'enter'  : 'return',
        'normal' : 'ABC',
        'meta1'  : '.?123',
        'meta2'  : '#+=',
        'accept' : '\u21d3'
      },
      'maxLength' : 25,
      'change' : function() {
        let email = $('#keyboard-email').val().trim();
        $('#save-email').unbind('click');
        if (email.length != 0) {
          $('#save-email').on('click', () => {
            ctrl.gotoThankyou();
            ctrl.saveEmail(email);
          });
        }
      },

      layout: 'custom',
      customLayout: {
        'normal': [
          'q w e r t y u i o p {bksp}',
          'a s d f g h j k l {enter}',
          '{s} z x c v b n m @ . {s}',
          '{meta1} _ -'
        ],
        'shift': [
          'Q W E R T Y U I O P {bksp}',
          'A S D F G H J K L {enter}',
          '{s} Z X C V B N M @ . {s}',
          '{meta1} _ -'
        ],
        'meta1': [
          '1 2 3 4 5 6 7 8 9 0 {bksp}',
          '` | { } % ^ * / \' {enter}',
          '{meta2} $ & ~ # = + . {meta2}',
          '{normal} ! ?'
        ],
        'meta2': [
          '[ ] { } \u2039 \u203a ^ * " , {bksp}',
          '\\ | / < > $ \u00a3 \u00a5 \u2022 {enter}',
          '{meta1} \u20ac & ~ # = + . {meta1}',
          '{normal} ! ?'
        ]
      }
    });

    this.keyboard_name = $('#keyboard-name').getkeyboard();
    this.keyboard_email = $('#keyboard-email').getkeyboard();
  }

  initComEvent(ports)
  {
    let that = this;
    ports.forEach(function(port){
      $('#s01-config .container')
        .append('<button class="ui fluid basic massive button com" data-comname="' + port.comName + '">' + port.comName + '</button>');
    });

    $('.com').click(function(){
      let name = $(this).data('comname');
      that.ctrl.am.connectComPort(name);
      that.ctrl.fm.loginUser(that.ctrl.pm.config_player_id)
    });
  }

  S31() {
    $('#btn-start-game').unbind('click');
    $('#btn-start-game').attr('src', 'images/btn-waiting-player.png');
    $('#wb-timer-text').text('60');
    $('#wb-timer-text').show();
  }
  S32() {
    $('#btn-start-game').attr('src', 'images/btn-player-waiting.png');
    $('#we-timer-text').text('60');
    $('#we-timer-text').show();
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

  clearWaitingCountdown() {
    clearInterval(this.timer);
  }

  updateHiScore(snapshot) {
    this.hiscore.push(snapshot.val());
    this.hiscore.sort(function(a,b) {return (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0);} );
    console.log(this.hiscore);
    $('#hs0 .name').text(this.hiscore[0].name);
    $('#hs0 .score').text(this.hiscore[0].score);
    if (this.hiscore[1]) {
      $('#hs1 .name').text(this.hiscore[1].name);
      $('#hs1 .score').text(this.hiscore[1].score);
    }
    if (this.hiscore[2]) {
      $('#hs2 .name').text(this.hiscore[2].name);
      $('#hs2 .score').text(this.hiscore[2].score);
    }
  }

  updateOpponentPlayerData(snapshot) {
    $('.player02 .player-name').text(snapshot.player_name);
    $('.player02 .player-photo').attr('src', snapshot.player_photo_url);
    $('.player02 .player-score').text(snapshot.score);
  }

  makeQrCode(code) {
    this.QRCode.toCanvas(
      this.qrcode_canvas,
      code,
      {'width' : 283},
      (error) => {
        if (error) console.error(error)
        console.log('success!');
    })
  }

}