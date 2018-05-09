const SerialPort = require('serialport');

class ArduinoManager
{
  constructor(ctrl)
  {
    this.port = null;

    SerialPort.list((err, ports) => {
      ctrl.initComEvent(ports);
    });
  }

  connectComPort(name)
  {
    this.port = new SerialPort(name, {baud_rate:9600});
    this.port.on('open', function(){
      console.log('port opened:' + name);
    });
  }

}

module.exports = ArduinoManager;
