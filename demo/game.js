const GameManager = require('./../classes/GameManager');
const ArduinoManager = require('./../classes/ArduinoManager');

let gm = new GameManager(null);
let am = new ArduinoManager(null);

am.connectComPort('/dev/cu.usbmodem1411');
// gm.startAI();