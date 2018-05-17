const Controller = require('./classes/Controller');
const FirebaseManager = require('./classes/FirebaseManager');
const ArduinoManager = require('./classes/ArduinoManager');
const PlayerManager = require('./classes/PlayerManager');
const UiManager = require('./classes/UiManager');
const CameraManager = require('./classes/CameraManager');
const GameManager = require('./classes/GameManager');
const InactivityManager = require('./classes/InactivityManager');
const electron = require('electron');

// disable zoom
var webFrame = require('electron').webFrame
webFrame.setVisualZoomLevelLimits(1, 1)
webFrame.setLayoutZoomLevelLimits(0, 0)

let ctrl = new Controller();
let fm   = new FirebaseManager(firebase, ctrl, config);
let am   = new ArduinoManager(ctrl);
let pm  = new PlayerManager(ctrl);
let ui   = new UiManager(ctrl);
let cm   = new CameraManager(ctrl);
let gm   = new GameManager(ctrl);
let im = new InactivityManager();
ctrl.registerModules(fm, am, pm, ui, cm, gm, im);

