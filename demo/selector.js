// // Initialize Firebase
// var config = {
//   apiKey: "AIzaSyDY2koLmpABB65fwaf0HHhBfzuK6mc_jRc",
//   authDomain: "ae-aglity-challenge.firebaseapp.com",
//   databaseURL: "https://ae-aglity-challenge.firebaseio.com",
//   projectId: "ae-aglity-challenge",
//   storageBucket: "ae-aglity-challenge.appspot.com",
//   messagingSenderId: "302554562396"
// };
// firebase.initializeApp(config);
// var database = firebase.database();
// function writeUserData(userId, name, email) {
//   firebase.database().ref('users/' + userId).set({
//     username: name,
//     email: email
//   });
// }
// var ref = firebase.database().ref('users/1');
// ref.on('child_changed', function(data) {
//   console.log([data.key, data.val().text, data.val().author]);
// });

var SerialPort = require('serialport');
SerialPort.list((err, ports) => {
  ports.forEach(function(port){
    $('body').append('<button onclick="connect(\'' + port.comName + '\')">' + port.comName + '</button>');
    // console.log(port.comName);
  });
});
var port;
function connect(comName){
  port = new SerialPort(comName, {baud_rate:9600});
  port.on('open', function(){
    console.log('OPENED');
  });

  let series_data = [], timeBefore = 0, timeAfter = 0;

  var buffer = [];
  port.on('data', function (data) {
    buffer = [...buffer, ...data];
    if (
      buffer[buffer.length-1] == 10 &&
      buffer[buffer.length-2] == 13
      ) {
        let btn_name = '';
        buffer.map((a) => {
          btn_name += String.fromCharCode(a);
        });
        console.log(btn_name);
        buffer = [];
    }
    // array.length >= 7 
  });

  port.on('readable', function () {
    console.log('ReadableData:', port.read());
  });

}


let iarr = [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false
];

function bon(i) { port.write('on_'+i+'\n'); }
function bof(i) { port.write('of_'+i+'\n'); }


$(function(){
  $(document).keypress(function(e){
    //48
    let i = e.which-48;
    if (iarr[i])
      bof(i);
    else
      bon(i);
    iarr[i] = !iarr[i];
  });
})

function onall()
{
  port.write('allon\n');
}
function ofall()
{
  port.write('alloff\n');
}
