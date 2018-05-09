(function() {

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  var streaming = false;

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;


  // firebase config
  var config = {
    apiKey: "AIzaSyDY2koLmpABB65fwaf0HHhBfzuK6mc_jRc",
    authDomain: "ae-aglity-challenge.firebaseapp.com",
    databaseURL: "https://ae-aglity-challenge.firebaseio.com",
    projectId: "ae-aglity-challenge",
    storageBucket: "ae-aglity-challenge.appspot.com",
    messagingSenderId: "302554562396"
  };
  firebase.initializeApp(config);
  var storageRef = firebase.storage().ref('player1/image01.jpg');
  storageRef.getDownloadURL().then(function(url) {
    photo = document.getElementById('photo');
    photo.src = url;
    // console.log(url);
  });

  function uploadImage(file)
  {

    var camRef = storageRef.child('player1/image01.jpg');

    camRef.put(file).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
    });

  }

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function(stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function(err) {
        console.log("An error occured! " + err);
      });

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);

    clearphoto();
  }


  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);

      canvas.toBlob(uploadImage, 'image/jpeg', 0.95)
    } else {
      clearphoto();
    }
  }

  startup();
})();