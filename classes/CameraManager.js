module.exports = class CameraManager {
  constructor(ctrl)
  {
    this.ctrl = ctrl;
  }

  initCamera()
  {
    this.video = $('#cam-video')[0];
    this.canvas = $('#cam-canvas')[0];
    this.photo = $('#cam-photo')[0];

    $('#cam-video').click(() => {
      this.takepicture()
    });

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

  clearphoto() {
    var context = this.canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    var data = this.canvas.toDataURL('image/png');
    this.photo.setAttribute('src', data);
  }

  takepicture() {
    var context = this.canvas.getContext('2d');
    if (this.width && this.height) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      context.drawImage(this.video, 0, 0, this.width, this.height);
    
      var data = this.canvas.toDataURL('image/png');
      this.photo.setAttribute('src', data);
    } else {
      clearphoto();
    }
  }
}