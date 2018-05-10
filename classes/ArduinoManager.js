const SerialPort = require('serialport');

class ArduinoManager
{
  constructor(ctrl)
  {
    this.ctrl = ctrl;
    this.port = null;
    this.btn_indexes = {
      'btn_0' : 0,
      'btn_1' : 1,
      'btn_2' : 2,
      'btn_3' : 3,
      'btn_4' : 4,
      'btn_5' : 5,
      'btn_6' : 6,
      'btn_7' : 7,
      'btn_8' : 8,
      'btn_9' : 9,
      'btn_10' : 10,
      'btn_11' : 11
    };

    SerialPort.list((err, ports) => {
      console.log(ports);
      ctrl.initComEvent(ports);
    });
  }

  connectComPort(name)
  {
    this.port = new SerialPort(name, {baud_rate:9600});
    this.port.on('open', () => {
      console.log('port opened:' + name);
    });


    let buffer = [];
    this.port.on('data', (data) => {
      buffer = [...buffer, ...data];
      console.log(buffer);
      if (
        buffer[buffer.length-1] == 10 &&
        buffer[buffer.length-2] == 13
        ) {
          let btn_name = '';
          buffer.map((a) => {
            btn_name += String.fromCharCode(a);
          });
          this.ctrl.triggerButton(this.btn_indexes[btn_name.trim()]);
          console.log('btn:' + this.btn_indexes[btn_name.trim()]);
          buffer = [];
      }
      // array.length >= 7 
    });
  }

}

module.exports = ArduinoManager;
