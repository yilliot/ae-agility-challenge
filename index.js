const Controller = require('./classes/Controller');
const FirebaseManager = require('./classes/FirebaseManager');
const ArduinoManager = require('./classes/ArduinoManager');
const PlayerManager = require('./classes/PlayerManager');
const UiManager = require('./classes/UiManager');
const CameraManager = require('./classes/CameraManager');
const GameManager = require('./classes/GameManager');

let ctrl = new Controller();
let fm   = new FirebaseManager(firebase, ctrl, config);
let am   = new ArduinoManager(ctrl);
let pm  = new PlayerManager(ctrl);
let ui   = new UiManager(ctrl);
let cm   = new CameraManager(ctrl);
let gm   = new GameManager(ctrl);
ctrl.registerModules(fm, am, pm, ui, cm, gm);

$(function(){

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
    'maxLength' : 15,
    'change' : function() {
      let name = $('#keyboard-name').val().trim();
      $('#btn-start-game').unbind('click');
      $('#btn-start-game').attr('src', 'images/btn-start-disabled.png');
      if (name.length != 0) {
        $('#btn-start-game').attr('src', 'images/btn-start.png');
        $('#btn-start-game').on('click', () => {
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
    'maxLength' : 15,
    'change' : function() {
      let email = $('#keyboard-email').val().trim();
      $('#btn-start-game').unbind('click');
      $('#btn-start-game').attr('src', 'images/btn-start-disabled.png');
      if (email.length != 0) {
        $('#btn-start-game').attr('src', 'images/btn-start.png');
        $('#btn-start-game').on('click', () => {
          ctrl.startGameBtnClick(email);
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
});

//   let series_data = [], timeBefore = 0, timeAfter = 0;

//   var buffer = [];
//   port.on('data', function (data) {
//     buffer = [...buffer, ...data];
//     if (
//       buffer[buffer.length-1] == 10 &&
//       buffer[buffer.length-2] == 13
//       ) {
//         let btn_name = '';
//         buffer.map((a) => {
//           btn_name += String.fromCharCode(a);
//         });
//         console.log(btn_name);
//         buffer = [];
//     }
//     // array.length >= 7 
//   });

//   port.on('readable', function () {
//     console.log('ReadableData:', port.read());
//   });

// }


// let iarr = [
//   false,
//   false,
//   false,
//   false,
//   false,
//   false,
//   false,
//   false,
//   false,
//   false,
//   false
// ];

// function bon(i) { port.write('on_'+i+'\n'); }
// function bof(i) { port.write('of_'+i+'\n'); }


// $(function(){
//   $(document).keypress(function(e){
//     //48
//     let i = e.which-48;
//     if (iarr[i])
//       bof(i);
//     else
//       bon(i);
//     iarr[i] = !iarr[i];
//   });
// })

// function onall()
// {
//   port.write('allon\n');
// }
// function ofall()
// {
//   port.write('alloff\n');
// }
