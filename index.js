const Controller = require('./classes/Controller');
const FirebaseManager = require('./classes/FirebaseManager');
const ArduinoManager = require('./classes/ArduinoManager');
const PlayerManager = require('./classes/PlayerManager');
const UiManager = require('./classes/UiManager');
const CameraManager = require('./classes/CameraManager');
const GameManager = require('./classes/GameManager');
const electron = require('electron');

let ctrl = new Controller();
let fm   = new FirebaseManager(firebase, ctrl, config);
let am   = new ArduinoManager(ctrl);
let pm  = new PlayerManager(ctrl);
let ui   = new UiManager(ctrl);
let cm   = new CameraManager(ctrl);
let gm   = new GameManager(ctrl);
ctrl.registerModules(fm, am, pm, ui, cm, gm);

