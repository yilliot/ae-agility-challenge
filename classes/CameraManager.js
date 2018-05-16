module.exports = class CameraManager {
  constructor(ctrl)
  {
    this.ctrl = ctrl;
    this.has_taken_photo = false;
    this.initCamera()
  }

  reset()
  {
    this.has_taken_photo = false;
    $('#backdrop-video').attr('src', 'videos/bg-loop.mp4');
    $('#cam-photo').attr('src', '');
    $('.keyboard').val('');
    $('#wb-timer-text').hide();
    $('#we-timer-text').hide();
    $('#btn-start-game').unbind('click');
    $('#btn-start-game').attr('src', 'images/btn-start-disabled.png');

    $('section.module').hide();
    $('#s03-camera').show();

    $('#tap-instruction-retake').hide();
    $('#tap-instruction').show();

    let tap_instruction_event = () => {
      $('#tap-instruction').hide();
      $('#cam-video,#tap-instruction').unbind('click');
      this.count_down_take_picture()
    };

    $('#cam-video,#tap-instruction').click(tap_instruction_event);

    $('#tap-instruction-retake').click(() => {
      $('#cam-photo').attr('src', '');
      $('#tap-instruction').show()
      $('#tap-instruction-retake').hide()
      $('#cam-video,#tap-instruction').click(tap_instruction_event);
    })

  }

  initCamera()
  {
    this.video = $('#cam-video')[0];
    this.canvas = $('#cam-canvas')[0];
    this.photo = $('#cam-photo')[0];


    function gotDevices(deviceInfos) {
      for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];
        if (deviceInfo.kind === 'videoinput') {
          console.log(deviceInfo.label + ':' + deviceInfo.deviceId);
        }
      }
    }
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch((e) => { console.log(e.message) });

    // navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    navigator.mediaDevices.getUserMedia({ video : {deviceId : '7a854de5dacd7607d89cdb30e349b1b860d5b46c068c754f781f001770e9d9cf'} })
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
      })
      .catch((err) => {
        console.log("An error occured! " + err);
      });

    this.width = 686;    // We will scale the photo width to this
    this.height = 0;     // This will be computed based on the input stream
    let streaming = false;

    this.video.addEventListener('canplay', (ev) => {
      if (!streaming) {
        this.height = this.video.videoHeight / (this.video.videoWidth/this.width);
      
        this.video.setAttribute('width', this.width);
        this.video.setAttribute('height', this.height);
        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);
        streaming = true;
      }
    }, false);

  }

  count_down_take_picture()
  {
    this.count_down(3, '.count_down_text', ()=>{
      this.take_picture()
      $('#tap-instruction-retake').show();
      this.ctrl.ui.keyboard_name.enabled = true;
      this.ctrl.ui.keyboard_name.toggle();

    });
  }

  count_down(seconds, placeholder, action) {
    let countdown_interval;

    function minus1()
    {
      $(placeholder).text(seconds);
      if (seconds <= 0) {
        action();
        $(placeholder).text('');
        clearInterval(countdown_interval);
      }
      seconds--;
    }
    minus1();
    countdown_interval = setInterval(minus1, 1000);
  }


  take_picture() {

    var context = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    context.drawImage(this.video, 0, 0, this.width, this.height);
  
    var data = this.canvas.toDataURL('image/png');
    this.canvas.toBlob((blob) => {this.ctrl.uploadPlayerPhoto(blob)}, 'image/jpeg', 0.95)
    this.photo.setAttribute('src', data);
    $('.player01 .player-photo').attr('src', data);

    this.has_taken_photo = true;
  }
}