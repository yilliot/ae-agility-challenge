const Controller = require('./classes/Controller');
const FirebaseManager = require('./classes/FirebaseManager');
const PortManager = require('./classes/PortManager');
const SectionManager = require('./classes/SectionManager');
const PlayerManager = require('./classes/PlayerManager');
const UiManager = require('./classes/UiManager');
const CameraManager = require('./classes/CameraManager');

let ctrl = new Controller();
let fm   = new FirebaseManager(firebase, ctrl);
let sm   = new SectionManager(ctrl);
let pm   = new PortManager(ctrl);
let plm  = new PlayerManager(ctrl);
let ui   = new UiManager(ctrl);
let cm   = new CameraManager(ctrl);
ctrl.registerModules(fm, sm, pm, plm, ui, cm);

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
